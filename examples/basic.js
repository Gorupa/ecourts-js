/**
 * @bullpenm/ecourts — examples/basic.js
 * Basic usage examples
 */

'use strict';

// This relative path is correct for local testing within the repo
const ecourts = require('../src/index');

async function main() {
    // Updated to reflect the new package identity
    console.log('@bullpenm/ecourts v' + (ecourts.version || '0.1.0'));
    console.log('Creating session...');

    const session = await ecourts.createSession();
    console.log('Session created. App token:', session.appToken || 'none');

    // ── Example 1: Get all states ──
    console.log('\n--- States ---');
    const states = await ecourts.getStates(session);
    console.log(`Found ${states.length} states`);
    console.log('First 5:', states.slice(0, 5));

    // ── Example 2: Get districts for Maharashtra (code 24) ──
    console.log('\n--- Districts (Maharashtra) ---');
    const districts = await ecourts.getDistricts(session, '24');
    console.log(`Found ${districts.length} districts`);
    console.log('First 5:', districts.slice(0, 5));

    // ── Example 3: CNR search ──
    // console.log('\n--- CNR Search ---');
    // const caseDetail = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
    // console.log(JSON.stringify(caseDetail, null, 2));

    // ── Example 4: Party name search ──
    // console.log('\n--- Party Search ---');
    // const cases = await ecourts.searchByParty(session, {
    //     stateCode:    '24',
    //     districtCode: '1',
    //     name:         'Sharma',
    // });
    // console.log(`Found ${cases.length} cases`);
}

main().catch(err => {
    console.error('Error in @bullpenm/ecourts example:', err.message);
});
