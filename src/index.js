/**
 * @bullpenm/legal-case-scraper v0.2.0
 * The first open source Node.js library for scraping 
 * Indian eCourts case data directly from services.ecourts.gov.in
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 *
 * Usage:
 * const scraper = require('@bullpenm/legal-case-scraper');
 *
 * const session  = await scraper.createSession('http://proxy-ip:port');
 * const caseData = await scraper.getCaseByCNR(session, 'MHAU010012342023');
 * const verifiedData = await scraper.getVerifiedCaseByCNR(session, 'MHAU010012342023');
 *
 * DISCLAIMER:
 * This library scrapes publicly available data from ecourts.gov.in.
 * Use responsibly. Do not overload the servers. Add delays between
 * requests. This is intended for non-commercial, research and civic
 * tech purposes only.
 */

'use strict';

// Import local modules
const { initSession, refreshSession } = require('./session');
const { getCaseByCNR }                = require('./cnr');
const { searchByParty }               = require('./party');
const { searchByAdvocate }            = require('./advocate');
const { getStates, getDistricts }     = require('./states');
const { getVerifiedCaseByCNR }        = require('./zk-proof');

/**
 * Create a new eCourts session.
 * Call this once and reuse the session across multiple requests.
 * Refresh it if you encounter repeated errors.
 *
 * @param {string|null} proxyUrl - Optional Indian proxy URL to bypass geo-blocks
 * @returns {object} session object
 */
async function createSession(proxyUrl = null) {
    // Pass the proxy URL down to your session handler
    return initSession(proxyUrl);
}

module.exports = {
    // Package Identity
    name: '@bullpenm/legal-case-scraper',
    version: '0.2.0',

    // Session Management
    createSession,
    refreshSession,

    // Core Search Functions (Standard Extraction)
    getCaseByCNR,
    searchByParty,
    searchByAdvocate,

    // Core Search Functions (zkTLS Verified Extraction)
    getVerifiedCaseByCNR,

    // Location Metadata
    getStates,
    getDistricts,
};
