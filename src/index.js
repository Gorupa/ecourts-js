'use strict';

const { initSession, refreshSession } = require('./session');
const { getCaseByCNR } = require('./cnr');
const { searchByParty } = require('./party');
const { searchByAdvocate } = require('./advocate');
const { getStates, getDistricts } = require('./states');

/**
 * Lazy loader for zkTLS proof module.
 * Prevents tlsn-js from crashing Node environments
 * unless the proof function is explicitly used.
 */
async function getVerifiedCaseByCNR(session, cnr) {
    const { getVerifiedCaseByCNR } = require('./zk-proof');
    return getVerifiedCaseByCNR(session, cnr);
}

async function createSession(proxyUrl = null) {
    return initSession(proxyUrl);
}

module.exports = {
    name: '@bullpenm/legal-case-scraper',
    version: '0.2.0',

    createSession,
    refreshSession,

    getCaseByCNR,
    searchByParty,
    searchByAdvocate,

    getVerifiedCaseByCNR,

    getStates,
    getDistricts
};
