/**
 * ecourts-js — src/parser.js
 * Parses eCourts HTML responses into clean JSON.
 * Uses cheerio (jQuery-like HTML parsing).
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const cheerio = require('cheerio');

/**
 * Parse states list from HTML response
 * @param {string} html
 * @returns {Array<{ state_code, state_name }>}
 */
function parseStates(html) {
    const $ = cheerio.load(html);
    const states = [];
    $('select#sess_state_code option, select[name="state_code"] option').each((_, el) => {
        const val  = $(el).attr('value');
        const name = $(el).text().trim();
        if (val && val !== '0' && name) {
            states.push({ state_code: val, state_name: name });
        }
    });
    return states;
}

/**
 * Parse districts list from HTML/JSON response
 * @param {string} html
 * @returns {Array<{ district_code, district_name }>}
 */
function parseDistricts(html) {
    // eCourts returns districts as JSON or HTML options
    try {
        const json = JSON.parse(html);
        if (Array.isArray(json)) {
            return json.map(d => ({
                district_code: d.dist_code || d.code || d.id,
                district_name: d.dist_name || d.name || d.label,
            })).filter(d => d.district_code && d.district_name);
        }
    } catch (_) {}

    // Fall back to HTML parsing
    const $         = cheerio.load(html);
    const districts = [];
    $('option').each((_, el) => {
        const val  = $(el).attr('value');
        const name = $(el).text().trim();
        if (val && val !== '0' && name) {
            districts.push({ district_code: val, district_name: name });
        }
    });
    return districts;
}

/**
 * Parse case detail from CNR search response
 * @param {string} html
 * @returns {object} case detail object
 */
function parseCaseDetail(html) {
    const $ = cheerio.load(html);

    // Check for no results
    const noResult = $('span.red, .errormsg, .alert-danger').text().trim();
    if (noResult && noResult.toLowerCase().includes('no case')) return null;

    const detail = {};

    // CNR Number
    detail.cnr_number = $('.cnr_number, td:contains("CNR Number")').next().text().trim()
        || $('input[name="cino"]').val()
        || '';

    // Case title — usually in h2 or heading
    detail.case_title = $('h2.case_heading, .case_title, .heading').first().text().trim()
        || $('table.case_details td').first().text().trim()
        || '';

    // Case type and number
    detail.case_type = $('td:contains("Case Type")').next().text().trim()
        || $('span.case_type').text().trim()
        || '';

    // Filing date
    detail.filing_date = $('td:contains("Filing Date")').next().text().trim()
        || $('td:contains("Date of Filing")').next().text().trim()
        || '';

    // Registration date
    detail.registration_date = $('td:contains("Registration Date")').next().text().trim()
        || $('td:contains("Date of Registration")').next().text().trim()
        || '';

    // Court name
    detail.court_name = $('td:contains("Court Name")').next().text().trim()
        || $('td:contains("Court Number")').next().text().trim()
        || '';

    // District
    detail.district_name = $('td:contains("District")').next().text().trim() || '';

    // Status
    detail.case_status = $('td:contains("Case Status")').next().text().trim()
        || $('span.case_status').text().trim()
        || 'Pending';

    // Stage
    detail.case_stage = $('td:contains("Stage of Case")').next().text().trim()
        || $('td:contains("Next Purpose")').next().text().trim()
        || '';

    // Petitioner
    detail.petitioner = $('td:contains("Petitioner")').next().text().trim()
        || $('span.petitioner').text().trim()
        || '';

    // Respondent
    detail.respondent = $('td:contains("Respondent")').next().text().trim()
        || $('span.respondent').text().trim()
        || '';

    // Advocates
    detail.petitioner_advocate = $('td:contains("Petitioner Advocate")').next().text().trim()
        || $('td:contains("Advocate for Pet")').next().text().trim()
        || '';

    detail.respondent_advocate = $('td:contains("Respondent Advocate")').next().text().trim()
        || $('td:contains("Advocate for Res")').next().text().trim()
        || '';

    // Next hearing date — most important field
    detail.next_hearing_date = $('td:contains("Next Hearing Date")').next().text().trim()
        || $('td:contains("Next Date")').next().text().trim()
        || $('span.next_date').text().trim()
        || null;

    detail.next_hearing_purpose = $('td:contains("Next Purpose")').next().text().trim()
        || $('td:contains("Purpose of Next Hearing")').next().text().trim()
        || '';

    // Case history
    detail.case_history = [];
    $('table.history_table tr, table#historyTableId tr, .case_history tr').each((i, row) => {
        if (i === 0) return; // skip header
        const cells = $(row).find('td');
        if (cells.length < 2) return;
        detail.case_history.push({
            hearing_date:  $(cells[0]).text().trim(),
            order_details: $(cells[1]).text().trim(),
            purpose:       $(cells[2])?.text().trim() || '',
        });
    });

    return detail;
}

/**
 * Parse case list from party/advocate search
 * @param {string} html
 * @returns {Array<object>}
 */
function parseCaseList(html) {
    const $     = cheerio.load(html);
    const cases = [];

    // eCourts renders results as table rows
    $('table.case_list tr, table#caseListId tr, .table tr').each((i, row) => {
        if (i === 0) return; // skip header
        const cells = $(row).find('td');
        if (cells.length < 2) return;

        const cnrCell   = $(cells[0]).text().trim();
        const titleCell = $(cells[1]).text().trim() || $(cells[2]).text().trim();
        const typeCell  = $(cells[2])?.text().trim() || '';
        const dateCell  = $(cells[3])?.text().trim() || '';

        // Try to get CNR from link
        const cnrLink = $(row).find('a[href*="cino"], a[onclick*="cino"]');
        const cnr     = cnrLink.attr('href')?.match(/cino=([A-Z0-9]+)/)?.[1]
            || cnrCell.replace(/\s/g, '').toUpperCase()
            || '';

        if (!cnr && !titleCell) return;

        cases.push({
            cnr_number: cnr,
            case_title: titleCell,
            case_type:  typeCell,
            filing_date: dateCell,
        });
    });

    return cases;
}

/**
 * Check if response contains a CAPTCHA error
 * @param {string} html
 * @returns {boolean}
 */
function isCaptchaError(html) {
    const lower = html.toLowerCase();
    return lower.includes('invalid captcha')
        || lower.includes('captcha mismatch')
        || lower.includes('please enter captcha')
        || lower.includes('wrong captcha');
}

/**
 * Check if response is empty / no results
 * @param {string} html
 * @returns {boolean}
 */
function isNoResults(html) {
    const lower = html.toLowerCase();
    return lower.includes('no case found')
        || lower.includes('no record found')
        || lower.includes('no results')
        || lower.includes('case not found');
}

module.exports = {
    parseStates,
    parseDistricts,
    parseCaseDetail,
    parseCaseList,
    isCaptchaError,
    isNoResults,
};
