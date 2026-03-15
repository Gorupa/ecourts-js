/**
 * ecourts-js — examples/basic.js
 * Basic usage examples
 */

'use strict';

const ecourts = require('../src/index');

async function main() {
    console.log('ecourts-js v' + ecourts.version);
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
    // Replace with a real CNR number to test
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

    // ── Example 5: Advocate search ──
    // console.log('\n--- Advocate Search ---');
    // const advCases = await ecourts.searchByAdvocate(session, {
    //     stateCode:    '24',
    //     districtCode: '1',
    //     name:         'Mehta',
    // });
    // console.log(`Found ${advCases.length} cases`);
}

main().catch(console.error);
