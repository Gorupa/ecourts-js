# 🏛️ @bullpenm/legal-case-scraper

[![npm](https://img.shields.io/npm/v/india-validators?style=for-the-badge&color=1a73e8)](https://www.npmjs.com/package/@bullpenm/legal-case-scraper)
[![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A powerful, open-source Node.js library for scraping and extracting Indian court case data directly from the official eCourts portal. Built specifically for civic tech, legal research, and automated case tracking.

---

## ✨ Features

* 🔐 **Cryptographically Verified (zkTLS):** Native integration with TLSNotary to generate mathematically verifiable Zero-Knowledge Proofs of scraped case data.
* 🤖 **Automated Captcha Bypass:** Smart extraction using built-in OCR (powered by Tesseract.js and Sharp) to handle eCourts visual captchas.
* 🔍 **Multiple Search Methods:** Fetch real-time case data via CNR number, Party Name, or Advocate Name.
* 🗺️ **Location Metadata:** Retrieve updated lists of State and District Court registry codes.

## 📦 Installation

Install the package via npm:

```bash
npm install @bullpenm/legal-case-scraper


​🚀 Quick Start
​1. Standard Extraction (Fast)
​Use this for standard dashboards, UI displays, and fast automated tracking.

const scraper = require('@bullpenm/legal-case-scraper');

async function main() {
    // Initialize session and bypass initial captchas
    const session = await scraper.createSession();
    
    // Fetch data using a 16-digit CNR
    const caseDetail = await scraper.getCaseByCNR(session, 'MHAU010012342023');
    console.log(caseDetail.status);
}
main().catch(console.error);



​2. Verifiable Web3 Oracle Extraction (zkTLS)
​Use this if you are building smart contracts or require legally verifiable proof that the data was not tampered with.

const scraper = require('@bullpenm/legal-case-scraper');
const fs = require('fs');

async function main() {
    const session = await scraper.createSession();
    
    // Returns the standard JSON data PLUS a cryptographic proof file
    const result = await scraper.getVerifiedCaseByCNR(session, 'MHAU010012342023');
    
    console.log('Verified Case Status:', result.data.status);
    
    // Save the cryptographic proof to allow third-party verification
    fs.writeFileSync('proof.json', JSON.stringify(result.zkProof));
}
main().catch(console.error);


​⚠️ Disclaimer
​This library is designed for educational, research, and civic tech purposes. It scrapes publicly available data from services.ecourts.gov.in.
​Use responsibly. Do not use this tool to overload government servers. Always implement appropriate delays and rate-limiting between network requests. The maintainers are not responsible for any IP bans or legal repercussions resulting from the misuse of this script.
​⚖️ License
​Distributed under the MIT License.

