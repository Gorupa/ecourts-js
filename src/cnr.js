/**
 * ecourts-js — src/cnr.js
 * Search for a case by its CNR (Case Number Record) number.
 * CNR is a unique 16-character identifier assigned to every case.
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const qs                       = require('qs');
const { fetchCaptcha }         = require('./session');
const { solveCaptchaSimple }   = require('./captcha');
const { parseCaseDetail, isCaptchaError, isNoResults } = require('./parser');

const MAX_ATTEMPTS = 10;

/**
 * Get case details by CNR number
 *
 * @param {object} session    - session object from initSession()
 * @param {string} cnrNumber  - 16-character CNR e.g. 'MHAU010012342023'
 * @returns {object|null}     - parsed case detail or null if not found
 *
 * @example
 * const session = await initSession();
 * const detail  = await getCaseByCNR(session, 'MHAU010012342023');
 */
async function getCaseByCNR(session, cnrNumber) {
    // Normalise CNR — strip spaces/dashes, uppercase
    const cnr = cnrNumber.replace(/[\s\-]/g, '').toUpperCase();

    if (!/^[A-Z0-9]{16}$/.test(cnr)) {
        throw new Error(`Invalid CNR format: "${cnrNumber}". Must be 16 alphanumeric characters.`);
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        // Fetch fresh CAPTCHA
        const captchaBuffer = await fetchCaptcha(session);
        const captchaText   = await solveCaptchaSimple(captchaBuffer);

        if (!captchaText || captchaText.length < 4) continue;

        // POST CNR search
        const payload = qs.stringify({
            cino:       cnr,
            captcha:    captchaText,
            app_token:  session.appToken,
            ajax_req:   'true',
        });

        const res = await session.client.post('/case_status_new.php', payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);

        // CAPTCHA wrong — retry with fresh CAPTCHA
        if (isCaptchaError(html)) continue;

        // No results found
        if (isNoResults(html)) return null;

        // Parse and return
        const detail = parseCaseDetail(html);
        if (detail) {
            detail.cnr_number = cnr;
            return detail;
        }
    }

    throw new Error(`Failed to fetch CNR ${cnr} after ${MAX_ATTEMPTS} attempts.`);
}

module.exports = { getCaseByCNR };
