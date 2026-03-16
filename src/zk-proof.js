'use strict';

const { Prover } = require('tlsn-js');
const qs = require('qs');
const cheerio = require('cheerio');

const NOTARY_URL = 'https://notary.pse.dev/v1';
const WEBSOCKET_PROXY_URL = 'wss://notary.pse.dev/proxy?node=services.ecourts.gov.in:443';

/**

* Fetch case details using zkTLS proof generation
* @param {object} session
* @param {string} cnrNumber
  */

async function getVerifiedCaseByCNR(session, cnrNumber) {

const { client, appToken } = session;

if (!cnrNumber || cnrNumber.length !== 16) {
    throw new Error('Invalid CNR Number. Must be 16 characters.');
}

console.log(`[zkTLS] Starting proof generation for CNR: ${cnrNumber}`);

/* Extract session cookies */
let cookieString = '';
try {
    cookieString = await client.defaults.jar.getCookieString(
        'https://services.ecourts.gov.in'
    );
} catch (err) {
    console.warn('[zkTLS] Failed to extract cookies:', err.message);
}

/* Build POST payload */
const payload = qs.stringify({
    app_token: appToken,
    c_no: cnrNumber,
    search_type: 'cnr',
    ajax_req: 'true'
});

/* Initialize prover */
const prover = new Prover({
    serverDns: 'services.ecourts.gov.in',
    maxTranscriptSize: 10 * 1024 * 1024
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
            'Referer': 'https://services.ecourts.gov.in/ecourtindia_v6/',
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Cookie': cookieString
        },

        body: payload
    });

    console.log('[zkTLS] Executing TLS Notary handshake...');

    const response = await prover.sendRequest();

    console.log('[zkTLS] Generating Zero Knowledge Proof...');

    const proof = await prover.generateProof({
        revealBody: true,
        revealHeaders: ['Date', 'Content-Type']
    });

    /* Parse HTML response */
    const $ = cheerio.load(response.body);

    const caseStatus =
        $('.case_status_table td').eq(1).text().trim() ||
        'Unknown';

    const nextHearing =
        $('.next_hearing_date').text().trim() || null;

    console.log('[zkTLS] Proof generated successfully');

    return {
        data: {
            cnr: cnrNumber,
            status: caseStatus,
            nextHearingDate: nextHearing
        },
        zkProof: proof
    };

} catch (error) {

    console.error(
        '[zkTLS] Proof generation failed:',
        error.message
    );

    throw new Error(
        'zkTLS proof generation failed: ' + error.message
    );
}

}

module.exports = { getVerifiedCaseByCNR };
