'use strict';

/**

* @bullpenm/legal-case-scraper
* Main entry file
* 
* Author : gorupa
* License: MIT
  */

/* ─────────────────────────────────────────────
IMPORT CORE MODULES
───────────────────────────────────────────── */

const { initSession, refreshSession } = require('./session');

const { getCaseByCNR } = require('./cnr');

const { searchByParty } = require('./party');

const { searchByAdvocate } = require('./advocate');

const { getStates, getDistricts } = require('./states');

/* ─────────────────────────────────────────────
SESSION CREATION
───────────────────────────────────────────── */

async function createSession(proxyUrl = null) {
return initSession(proxyUrl);
}

/* ─────────────────────────────────────────────
zkTLS PROOF (LAZY LOADED)
Prevents Node crash when tlsn-js loads
───────────────────────────────────────────── */

async function getVerifiedCaseByCNR(session, cnrNumber) {

const { getVerifiedCaseByCNR } = require('./zk-proof');

return getVerifiedCaseByCNR(session, cnrNumber);

}

/* ─────────────────────────────────────────────
PACKAGE EXPORTS
───────────────────────────────────────────── */

module.exports = {

/* Package metadata */

name: '@bullpenm/legal-case-scraper',

version: '0.2.1',


/* Session management */

createSession,

refreshSession,


/* Standard extraction */

getCaseByCNR,

searchByParty,

searchByAdvocate,


/* zkTLS verified extraction */

getVerifiedCaseByCNR,


/* Location metadata */

getStates,

getDistricts

};
