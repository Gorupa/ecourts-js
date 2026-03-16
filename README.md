# 🏛️ @bullpenm/legal-case-scraper

![npm version](https://img.shields.io/npm/v/@bullpenm/legal-case-scraper.svg?style=flat-square&color=blue)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg?style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)

A powerful, open-source Node.js library for scraping and extracting Indian court case data directly from the official eCourts portal. Built specifically for civic tech, legal research, and automated case tracking.

---

## ✨ Features

* 🔐 **Session Management:** Automatically handles cookies, hidden tokens, and session initialization.
* 🤖 **Smart Extraction:** Bypasses visual captchas using built-in OCR (powered by Tesseract.js and Sharp).
* 🔍 **Multiple Search Methods:** Fetch real-time case data via CNR number, Party Name, or Advocate Name.
* 🗺️ **Location Metadata:** Retrieve updated, dynamic lists of State and District Court registry codes.

## 📦 Installation

Install the package via npm:

```bash
npm install @bullpenm/legal-case-scraper

🚀 Quick Start
Here is a basic example of how to initialize a session and retrieve case data.
const scraper = require('@bullpenm/legal-case-scraper');

async function main() {
    // 1. Initialize the session (handles cookies and initial tokens)
    const session = await scraper.createSession();
    console.log('✅ Session created with token:', session.appToken);

    // 2. Fetch District Court metadata
    const states = await scraper.getStates(session);
    console.log(`📍 Loaded ${states.length} states.`);

    // 3. Search for a specific case by CNR
    // const caseDetail = await scraper.getCaseByCNR(session, 'MHAU010012342023');
    // console.log(caseDetail);
}

main().catch(console.error);

🛣️ Roadmap
This library is actively being developed. Upcoming features include:
 * High Court Routing: Expanding data extraction architecture to natively support High Court and Supreme Court portals.
 * zkTLS Integration: Providing cryptographic zero-knowledge proofs for scraped data to ensure absolute tamper-resistance, allowing the library to act as a verifiable web3 oracle for smart contracts.
 * Advanced Captcha Handling: Improved OCR accuracy and dynamic bypass for updated portal security measures.

⚠️ Disclaimer
This library is designed for educational, research, and civic tech purposes. It scrapes publicly available data from services.ecourts.gov.in.
Use responsibly. Do not use this tool to overload government servers. Always implement appropriate delays and rate-limiting between network requests. The maintainers are not responsible for any IP bans or legal repercussions resulting from the misuse of this script.
⚖️ License
Distributed under the MIT License.
