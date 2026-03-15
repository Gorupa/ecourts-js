/**
 * ecourts-js — src/advocate.js
 * Search cases by advocate name.
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const qs                     = require('qs');
const { fetchCaptcha }       = require('./session');
const { solveCaptchaSimple } = require('./captcha');
const { parseCaseList, isCaptchaError, isNoResults } = require('./parser');

const MAX_ATTEMPTS = 10;

/**
 * Search cases by advocate name
 *
 * @param {object} session
 * @param {object} options
 * @param {string} options.stateCode
 * @param {string} options.districtCode
 * @param {string} options.name  - advocate name
 * @returns {Array<object>}
 *
 * @example
 * const cases = await searchByAdvocate(session, {
 *     stateCode:    '24',
 *     districtCode: '1',
 *     name:         'Sharma',
 * });
 */
async function searchByAdvocate(session, options = {}) {
    const { stateCode, districtCode, name } = options;

    if (!stateCode || !districtCode || !name) {
        throw new Error('stateCode, districtCode and name are required.');
    }
    if (name.trim().length < 3) {
        throw new Error('Name must be at least 3 characters.');
    }

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        const captchaBuffer = await fetchCaptcha(session);
        const captchaText   = await solveCaptchaSimple(captchaBuffer);

        if (!captchaText || captchaText.length < 4) continue;

        const payload = qs.stringify({
            state_code:    stateCode,
            dist_code:     districtCode,
            adv_name:      name.trim(),
            captcha:       captchaText,
            app_token:     session.appToken,
            ajax_req:      'true',
            action:        'advocate_wise',
        });

        const res  = await session.client.post('/adv_wise_case_no_new.php', payload, {
            headers: {
                'Content-Type':     'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        });

        const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);

        if (isCaptchaError(html)) continue;
        if (isNoResults(html))    return [];

        const cases = parseCaseList(html);
        return cases;
    }

    throw new Error(`Advocate search failed after ${MAX_ATTEMPTS} attempts.`);
}

module.exports = { searchByAdvocate };
