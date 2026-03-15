# ecourts-js

[![npm](https://img.shields.io/npm/v/ecourts-js?style=for-the-badge&color=1a73e8)](https://www.npmjs.com/package/ecourts-js)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-6d28d9?style=for-the-badge&logo=github)](https://github.com/Gorupa/ecourts-js)

> The first open source Node.js library for Indian eCourts case data.
> Search by CNR number, party name or advocate name — directly from ecourts.gov.in.

---

## Install

```bash
npm install ecourts-js
```

---

## Quick Start

```js
const ecourts = require('ecourts-js');

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

// 5. Search by party name
const cases = await ecourts.searchByParty(session, {
    stateCode:    '24',
    districtCode: '1',
    name:         'Gaurav Kalal',
});

// 6. Search by advocate name
const advCases = await ecourts.searchByAdvocate(session, {
    stateCode:    '24',
    districtCode: '1',
    name:         'Sharma',
});
```

---

## API Reference

### `ecourts.createSession()`
Creates a new HTTP session with eCourts portal. Call once and reuse.
```js
const session = await ecourts.createSession();
```

### `ecourts.getCaseByCNR(session, cnrNumber)`
Get full case details by 16-character CNR number.
```js
const detail = await ecourts.getCaseByCNR(session, 'MHAU010012342023');
```
Returns:
```js
{
    cnr_number:          'MHAU010012342023',
    case_title:          'ABC vs XYZ',
    case_type:           'Civil Suit',
    filing_date:         '01-01-2023',
    case_status:         'Pending',
    case_stage:          'Arguments',
    court_name:          'Civil Judge Senior Division',
    district_name:       'Aurangabad',
    petitioner:          'ABC',
    respondent:          'XYZ',
    petitioner_advocate: 'Adv. Sharma',
    respondent_advocate: 'Adv. Mehta',
    next_hearing_date:   '15-04-2026',
    next_hearing_purpose:'Arguments',
    case_history: [
        { hearing_date: '01-03-2026', order_details: '...', purpose: '...' }
    ]
}
```

### `ecourts.getStates(session)`
Returns all Indian states with codes.
```js
const states = await ecourts.getStates(session);
// [{ state_code: '1', state_name: 'Andhra Pradesh' }, ...]
```

### `ecourts.getDistricts(session, stateCode)`
Returns districts for a state.
```js
const districts = await ecourts.getDistricts(session, '24');
// [{ district_code: '1', district_name: 'Ahmednagar' }, ...]
```

### `ecourts.searchByParty(session, options)`
Search cases by petitioner or respondent name.
```js
const cases = await ecourts.searchByParty(session, {
    stateCode:    '24',   // required
    districtCode: '1',    // required
    name:         'Sharma', // required, min 3 chars
    caseType:     '',       // optional
});
```

### `ecourts.searchByAdvocate(session, options)`
Search cases by advocate name.
```js
const cases = await ecourts.searchByAdvocate(session, {
    stateCode:    '24',
    districtCode: '1',
    name:         'Mehta',
});
```

### `ecourts.refreshSession(session)`
Refresh session if it expires.
```js
await ecourts.refreshSession(session);
```

---

## How it works

```
ecourts-js
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
```

---

## File Structure

```
ecourts-js/
├── src/
│   ├── index.js       ← main export
│   ├── session.js     ← session + cookie management
│   ├── captcha.js     ← Tesseract OCR solver
│   ├── parser.js      ← HTML → JSON parser
│   ├── cnr.js         ← CNR search
│   ├── party.js       ← party name search
│   ├── advocate.js    ← advocate search
│   └── states.js      ← states + districts
├── examples/
│   └── basic.js       ← usage examples
├── package.json
├── README.md
└── LICENSE
```

---

## Important Notes

- This library scrapes publicly available data from `ecourts.gov.in`
- Use responsibly — add delays between bulk requests
- CAPTCHA solving accuracy is ~75% — the library retries automatically
- For production use with high volume, consider applying for the official NIC eCourts API at `developer.ecourts.gov.in`
- Sessions expire — call `refreshSession()` if you encounter repeated errors

---

## Used by

- **[vaad.in](https://vaad.pages.dev)** — Free Indian court case tracker

---

## Contributing

PRs welcome. Key areas for improvement:
- [ ] Better CAPTCHA solver accuracy
- [ ] High Court support
- [ ] Consumer Forum support
- [ ] TypeScript definitions
- [ ] Retry logic improvements
- [ ] Session pooling for high volume

---

## Disclaimer

ecourts-js is an independent open source project and is not affiliated with the eCommittee of the Supreme Court of India, NIC, or any government body. All data is fetched from the publicly accessible `ecourts.gov.in` portal.

---

## License

[MIT](LICENSE) © 2026 [gorupa](https://github.com/gorupa) / Gaurav Kalal
