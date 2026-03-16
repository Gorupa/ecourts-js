/**
 * @bullpenm/legal-case-scraper v0.1.0
 * The first open source Node.js library for scraping 
 * Indian eCourts case data directly from services.ecourts.gov.in
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 *
 * Usage:
 * const scraper = require('@bullpenm/legal-case-scraper');
 *
 * const session  = await scraper.createSession();
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
 * @returns {object} session object
 */
async function createSession() {
    return initSession();
}

module.exports = {
    // Package Identity
    name: '@bullpenm/legal-case-scraper',
    version: '0.1.0',

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
