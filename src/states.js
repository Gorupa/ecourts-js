/**
 * ecourts-js — src/states.js
 * Fetch all states available on eCourts portal.
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const { parseStates, parseDistricts } = require('./parser');

/**
 * Get list of all Indian states from eCourts
 *
 * @param {object} session - session from initSession()
 * @returns {Array<{ state_code, state_name }>}
 *
 * @example
 * const states = await getStates(session);
 * // [{ state_code: '1', state_name: 'Andhra Pradesh' }, ...]
 */
async function getStates(session) {
    const res    = await session.client.get('/');
    const html   = typeof res.data === 'string' ? res.data : '';
    const states = parseStates(html);

    // If parsing homepage fails try the dedicated states endpoint
    if (states.length === 0) {
        const res2    = await session.client.get('/state_dist_wise_case_no_new.php');
        const html2   = typeof res2.data === 'string' ? res2.data : '';
        return parseStates(html2);
    }

    return states;
}

/**
 * Get districts for a given state
 *
 * @param {object} session    - session from initSession()
 * @param {string} stateCode  - state code from getStates()
 * @returns {Array<{ district_code, district_name }>}
 *
 * @example
 * const districts = await getDistricts(session, '24');
 * // [{ district_code: '1', district_name: 'Ahmednagar' }, ...]
 */
async function getDistricts(session, stateCode) {
    if (!stateCode) throw new Error('stateCode is required.');

    const qs  = require('qs');
    const res = await session.client.post('/state_dist_wise_case_no_new.php',
        qs.stringify({
            state_code: stateCode,
            action:     'getDistricts',
            ajax_req:   'true',
            app_token:  session.appToken,
        }),
        {
            headers: {
                'Content-Type':     'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
            },
        }
    );

    const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    return parseDistricts(body);
}

module.exports = { getStates, getDistricts };
