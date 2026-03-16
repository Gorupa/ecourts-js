'use strict';

const { Prover } = require('tlsn-js');
const qs = require('qs');
const cheerio = require('cheerio');

const NOTARY_URL = 'https://notary.pse.dev/v1';
const WEBSOCKET_PROXY_URL = 'wss://notary.pse.dev/proxy?node=services.ecourts.gov.in:443';

/**
 * Fetches case details by CNR and generates a cryptographic zkTLS Proof.
 * @param {object} session - The session object from createSession()
 * @param {string} cnrNumber - The 16 character alphanumeric CNR number
 */
async function getVerifiedCaseByCNR(session, cnrNumber) {
    const { token, captchaText, client } = session;

    if (!cnrNumber || cnrNumber.length !== 16) {
        throw new Error('Invalid CNR Number.');
    }

    console.log(`[zkTLS] Initiating cryptographic proof for CNR: ${cnrNumber}`);

    // Extract the PHPSESSID from the Axios CookieJar
    const cookieString = await client.defaults.jar.getCookieString('https://services.ecourts.gov.in');

    const payload = qs.stringify({
        app_token: token,
        fcaptcha_code: captchaText,
        c_no: cnrNumber,
        search_type: 'cnr',
        ajax_req: 'true'
    });

    const prover = new Prover({
        serverDns: 'services.ecourts.gov.in',
    });

    try {
        await prover.setup({
            notaryUrl: NOTARY_URL,
            websocketProxyUrl: WEBSOCKET_PROXY_URL,
            method: 'POST',
            url: 'https://services.ecourts.gov.in/ecourtindia_v6/case-search',
            headers: {
                'Host': 'services.ecourts.gov.in',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Cookie': cookieString,
                'Referer': 'https://services.ecourts.gov.in/ecourtindia_v6/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            },
            body: payload,
        });

        console.log('[zkTLS] Executing Multi-Party Computation handshake...');
        const response = await prover.sendRequest();
        
        console.log('[zkTLS] Generating Zero-Knowledge Proof...');
        const proof = await prover.generateProof({
            revealBody: true,
            revealHeaders: ['Date', 'Content-Type'] 
        });

        const $ = cheerio.load(response.body);
        const caseStatus = $('.case_status_table td').eq(1).text().trim();
        const nextHearing = $('.next_hearing_date').text().trim();

        console.log('[zkTLS] Proof generated successfully!');

        return {
            data: {
                cnr: cnrNumber,
                status: caseStatus || 'Data not found',
                nextHearingDate: nextHearing || null,
            },
            zkProof: proof 
        };

    } catch (error) {
        console.error('[zkTLS] Proof generation failed:', error.message);
        throw error;
    }
}

module.exports = { getVerifiedCaseByCNR };
