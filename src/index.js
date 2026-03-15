/**
 * ecourts-js v0.1.0
 * The first open source Node.js library for
 * scraping Indian eCourts case data directly
 * from services.ecourts.gov.in
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 *
 * Usage:
 *   const ecourts = require('ecourts-js');
 *
 *   const session  = await ecourts.createSession();
 *   const caseData = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
 *   const states   = await ecourts.getStates(session);
 *
 * DISCLAIMER:
 *   This library scrapes publicly available data from ecourts.gov.in.
 *   Use responsibly. Do not overload the servers. Add delays between
 *   requests. This is intended for non-commercial, research and civic
 *   tech purposes only.
 */

'use strict';

const { initSession, refreshSession } = require('./session');
const { getCaseByCNR }                = require('./cnr');
const { searchByParty }               = require('./party');
const { searchByAdvocate }            = require('./advocate');
const { getStates, getDistricts }     = require('./states');

/**
 * Create a new eCourts session.
 * Call this once and reuse the session across multiple requests.
 * Refresh it if you encounter repeated errors.
 *
 * @returns {object} session object
 *
 * @example
 * const session = await ecourts.createSession();
 */
async function createSession() {
    return initSession();
}

module.exports = {
    version: '0.1.0',

    // Session management
    createSession,
    refreshSession,

    // Core search functions
    getCaseByCNR,
    searchByParty,
    searchByAdvocate,

    // Metadata
    getStates,
    getDistricts,
};
