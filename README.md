# @bullpenm/ecourts

[![npm](https://img.shields.io/npm/v/@bullpenm/ecourts?style=for-the-badge&color=1a73e8)](https://www.npmjs.com/package/@bullpenm/ecourts)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-6d28d9?style=for-the-badge&logo=github)](https://github.com/Gorupa/ecourts-js)

> The first open source Node.js library for Indian eCourts case data.
> Search by CNR number, party name or advocate name — directly from ecourts.gov.in.

---

## Install

```bash
npm install @bullpenm/ecourts

const ecourts = require('@bullpenm/ecourts');

async function main() {
    // 1. Create a session (do this once, reuse it)
    const session = await ecourts.createSession();

    // 2. Get case by CNR number
    const caseData = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
    console.log(caseData.next_hearing_date); // → '15-04-2026'
    console.log(caseData.case_status);       // → 'Pending'

    // 3. Get all states
    const states = await ecourts.getStates(session);

    // 4. Get districts for a state
    const districts = await ecourts.getDistricts(session, '24'); // Maharashtra
}

main().catch(console.error);
const session = await ecourts.createSession();
const detail = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
const states = await ecourts.getStates(session);
// [{ state_code: '1', state_name: 'Andhra Pradesh' }, ...]

const districts = await ecourts.getDistricts(session, '24');
// [{ district_code: '1', district_name: 'Ahmednagar' }, ...]

Gemini said
Here is the complete, final version of your README.md in a single copyable block. It has been fully updated with the @bullpenm/ecourts scope and all necessary technical corrections.

Markdown
# @bullpenm/ecourts

[![npm](https://img.shields.io/npm/v/@bullpenm/ecourts?style=for-the-badge&color=1a73e8)](https://www.npmjs.com/package/@bullpenm/ecourts)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-6d28d9?style=for-the-badge&logo=github)](https://github.com/Gorupa/ecourts-js)

> The first open source Node.js library for Indian eCourts case data.
> Search by CNR number, party name or advocate name — directly from ecourts.gov.in.

---

## Install

```bash
npm install @bullpenm/ecourts
Quick Start
JavaScript
const ecourts = require('@bullpenm/ecourts');

async function main() {
    // 1. Create a session (do this once, reuse it)
    const session = await ecourts.createSession();

    // 2. Get case by CNR number
    const caseData = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
    console.log(caseData.next_hearing_date); // → '15-04-2026'
    console.log(caseData.case_status);       // → 'Pending'

    // 3. Get all states
    const states = await ecourts.getStates(session);

    // 4. Get districts for a state
    const districts = await ecourts.getDistricts(session, '24'); // Maharashtra
}

main().catch(console.error);
API Reference
ecourts.createSession()
Creates a new HTTP session with eCourts portal. Call once and reuse.

JavaScript
const session = await ecourts.createSession();
ecourts.getCaseByCNR(session, cnrNumber)
Get full case details by 16-character CNR number.

JavaScript
const detail = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
ecourts.getStates(session)
Returns all Indian states with codes.

JavaScript
const states = await ecourts.getStates(session);
// [{ state_code: '1', state_name: 'Andhra Pradesh' }, ...]
ecourts.getDistricts(session, stateCode)
Returns districts for a state.

JavaScript
const districts = await ecourts.getDistricts(session, '24');
// [{ district_code: '1', district_name: 'Ahmednagar' }, ...]
How it works
@bullpenm/ecourts
    ↓
Creates HTTP session with eCourts portal
    ↓
Fetches CAPTCHA image
    ↓
Solves CAPTCHA using Tesseract OCR (~75% accuracy)
    ↓
Submits search form with solved CAPTCHA
    ↓
Retries up to 10 times if CAPTCHA fails
    ↓
Parses HTML response into clean JSON
    ↓
Returns structured data
Important Notes
Web Scraping: This library scrapes publicly available data from ecourts.gov.in. Use responsibly and add delays between bulk requests to avoid IP blocks.

CAPTCHA: Solving accuracy is ~75%. The library handles retries automatically.

Official API: For high-volume production use, consider applying for the official NIC eCourts API at developer.ecourts.gov.in.

Environment: Requires Node.js >= 18.0.0.

Used by
vaad.in — Free Indian court case tracker

Contributing
PRs are welcome! Key areas for improvement:

Better CAPTCHA solver accuracy.

High Court support.

TypeScript definitions.

Disclaimer
@bullpenm/ecourts is an independent open source project and is not affiliated with the eCommittee of the Supreme Court of India, NIC, or any government body. All data is fetched from the publicly accessible ecourts.gov.in portal.

License
MIT © 2026 gorupa / Gaurav Kalal

