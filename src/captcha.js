/**
 * ecourts-js — src/captcha.js
 * Solves the eCourts 6-character alphanumeric CAPTCHA
 * using Tesseract.js (pure JS OCR — no external service).
 *
 * The eCourts CAPTCHA is relatively simple:
 * - 6 alphanumeric characters
 * - Light background with slight noise
 * - Tesseract with preprocessing achieves ~75% accuracy
 * - We retry up to MAX_RETRIES times
 *
 * Author : gorupa (https://github.com/gorupa)
 * License: MIT
 */

'use strict';

const Tesseract = require('tesseract.js');
const sharp     = require('sharp');

const MAX_RETRIES = 10;

/**
 * Preprocess CAPTCHA image for better OCR accuracy:
 * - Convert to greyscale
 * - Increase contrast
 * - Resize to 3x for better recognition
 * - Remove noise with median filter
 *
 * @param {Buffer} imageBuffer
 * @returns {Buffer} processed image buffer
 */
async function preprocessCaptcha(imageBuffer) {
    return sharp(imageBuffer)
        .greyscale()
        .normalize()
        .resize({ width: 180, kernel: sharp.kernel.nearest })
        .median(1)
        .sharpen()
        .toBuffer();
}

/**
 * Extract text from preprocessed CAPTCHA image
 * using Tesseract OCR
 *
 * @param {Buffer} imageBuffer
 * @returns {string} cleaned OCR result
 */
async function ocr(imageBuffer) {
    const processed = await preprocessCaptcha(imageBuffer);

    const { data: { text } } = await Tesseract.recognize(processed, 'eng', {
        logger: () => {}, // suppress logs
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        tessedit_pageseg_mode:   '8', // single word mode
    });

    // Clean output — remove whitespace, keep alphanumeric only
    return text.replace(/[^A-Za-z0-9]/g, '').substring(0, 6);
}

/**
 * Attempt to solve CAPTCHA with retries
 *
 * @param {Function} fetchCaptchaFn - async function that returns a new CAPTCHA buffer
 * @param {Function} verifyCaptchaFn - async function(captchaText) → bool
 * @returns {string} solved CAPTCHA text
 * @throws {Error} if all retries exhausted
 */
async function solveCaptcha(fetchCaptchaFn, verifyCaptchaFn) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const imageBuffer = await fetchCaptchaFn();
            const text        = await ocr(imageBuffer);

            if (!text || text.length < 4) continue;

            const valid = await verifyCaptchaFn(text);
            if (valid) return text;

        } catch (err) {
            // continue to next attempt
        }
    }
    throw new Error(`CAPTCHA solve failed after ${MAX_RETRIES} attempts.`);
}

/**
 * Simple CAPTCHA solve — just returns OCR result
 * without verification (used when verification isn't
 * available separately)
 *
 * @param {Buffer} imageBuffer
 * @returns {string}
 */
async function solveCaptchaSimple(imageBuffer) {
    return ocr(imageBuffer);
}

module.exports = { solveCaptcha, solveCaptchaSimple, preprocessCaptcha };
