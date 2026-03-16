/**
 * ecourts-js — src/session.js
 * Manages HTTP sessions, cookies and app tokens
 * for the eCourts portal. Includes proxy support for bypassing geo-blocks.
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const axios   = require('axios');
const tough   = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const { HttpsProxyAgent } = require('https-proxy-agent'); // <-- Added Proxy Agent

const BASE_URL = 'https://services.ecourts.gov.in/ecourtindia_v6';

/**
 * Create a new axios instance with cookie jar support
 * This maintains session state across requests
 * @param {string|null} proxyUrl - Optional proxy URL
 */
function createClient(proxyUrl = null) {
    const jar    = new tough.CookieJar();
    
    const config = {
        jar,
        baseURL:        BASE_URL,
        timeout:        20000,
        withCredentials: true,
        headers: {
            'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-IN,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection':      'keep-alive',
            'Referer':         `${BASE_URL}/`,
        },
    };

    // <-- Attach the Proxy Agent if a URL is provided
    if (proxyUrl) {
        const agent = new HttpsProxyAgent(proxyUrl);
        config.httpsAgent = agent;
        config.httpAgent = agent;
    }

    const client = wrapper(axios.create(config));
    return { client, jar };
}

/**
 * Initialize a session — visits the homepage to
 * get session cookies and extract the app_token.
 *
 * @param {string|null} proxyUrl - Optional proxy URL
 * @returns {{ client, jar, appToken, proxyUrl }}
 */
async function initSession(proxyUrl = null) {
    // Pass the proxy URL down to the client creator
    const { client, jar } = createClient(proxyUrl);

    const res = await client.get('/');
    const html = res.data;

    // Extract app_token from the page
    const tokenMatch = html.match(/app_token['":\s]+['"]([a-zA-Z0-9]+)['"]/);
    const appToken   = tokenMatch ? tokenMatch[1] : null;

    // Return proxyUrl so we can reuse it during a refresh
    return { client, jar, appToken, proxyUrl };
}

/**
 * Fetch CAPTCHA image as a buffer
 * @param {{ client, appToken }} session
 * @returns {Buffer} CAPTCHA image buffer
 */
async function fetchCaptcha(session) {
    const res = await session.client.get('/captcha_new.php', {
        params:       { app_token: session.appToken },
        responseType: 'arraybuffer',
    });
    return Buffer.from(res.data);
}

/**
 * Refresh session — re-init if token expired
 */
async function refreshSession(session) {
    // Reuse the exact same proxy if the session drops
    const fresh = await initSession(session.proxyUrl); 
    session.client   = fresh.client;
    session.jar      = fresh.jar;
    session.appToken = fresh.appToken;
    session.proxyUrl = fresh.proxyUrl;
    return session;
}

module.exports = { initSession, fetchCaptcha, refreshSession, BASE_URL };
