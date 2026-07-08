const XLSX = require('xlsx');
const axios = require('axios');
const sharp = require('sharp');
const archiver = require('archiver');
const fs = require('fs');

// 🔹 IMPORTANT: Change this to your Excel file name if it's different
const INPUT_FILE = 'Merchant_V.xlsx';
const OUTPUT_ZIP = 'updated_qr_codes.zip';

function extractNameFromUrl(url) {
    try {
        const filename = url.split('/').pop();
        const match = filename.match(/qr_(.*?)\.png$/);
        if (match) return decodeURIComponent(match[1]);
    } catch (_) {}
    return null;
}

async function processRow(row, index) {
    // Find the QR column (case-insensitive)
    const qrKey = Object.keys(row).find(k => /qr/i.test(k) || /image/i.test(k));
    if (!qrKey) throw new Error('No QR column found');
    const qrUrl = row[qrKey];
    if (!qrUrl) throw new Error('QR URL is empty');

    // Find merchant name column (optional)
    const nameKey = Object.keys(row).find(k => /merchant business name/i.test(k) || /owner name/i.test(k));
    let merchantName = nameKey ? String(row[nameKey]).trim() : '';
    if (!merchantName) merchantName = extractNameFromUrl(qrUrl);
    if (!merchantName) throw new Error('Cannot determine merchant name');

    console.log(`[${index}] Downloading: ${qrUrl}`);
    const response = await axios.get(qrUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    const metadata = await sharp(imageBuffer).metadata();
    const width = metadata.width, height = metadata.height;

    // 🎯 COVER THE BOTTOM 25% (exactly where the old name & blue background are)
    const rectHeight = Math.floor(height * 0.25);
    const rectY = height - rectHeight;
    const fontSize = Math.min(rectHeight * 0.5, 40);

    // Create an SVG overlay with dark rectangle and yellow text
    const svg = `
        <svg width="${width}" height="${height}">
            <rect x="0" y="${rectY}" width="${width}" height="${rectHeight}" fill="rgba(0, 0, 0, 0.7)" />
            <text x="${width/2}" y="${rectY + rectHeight/2}" 
                  font-family="'Noto Sans Myanmar','Pyidaungsu','Myanmar Text',sans-serif" 
                  font-size="${fontSize}" font-weight="bold" fill="#FFD700" 
                  text-anchor="middle" dominant-baseline="central"
                  stroke="rgba(0,0,0,0.8)" stroke-width="2">
                ${merchantName}
            </text>
        </svg>
    `;

    const overlayBuffer = Buffer.from(svg);
    return await sharp(imageBuffer)
        .composite([{ input: overlayBuffer, top: 0, left: 0 }])
        .png()
        .toBuffer();
}

async function main() {
    // Check if the Excel file exists
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`❌ Input file "${INPUT_FILE}" not found.`);
        console.error(`   Please rename your Excel file to "${INPUT_FILE}" or change INPUT_FILE in overlay.js.`);
        process.exit(1);
    }

    const workbook = XLSX.readFile(INPUT_FILE);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);
    if (!json.length) {
        console.error('❌ Excel file is empty.');
        process.exit(1);
    }

    console.log(`✅ Loaded ${json.length} rows.`);

    const output = fs.createWriteStream(OUTPUT_ZIP);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(output);

    let processed = 0, failed = 0;

    for (let i = 0; i < json.length; i++) {
        try {
            const buffer = await processRow(json[i], i + 1);
            // Get name for the output file
            const nameKey = Object.keys(json[i]).find(k => /merchant business name/i.test(k) || /owner name/i.test(k));
            let name = nameKey ? String(json[i][nameKey]).trim() : '';
            if (!name) {
                const qrKey = Object.keys(json[i]).find(k => /qr/i.test(k) || /image/i.test(k));
                name = extractNameFromUrl(json[i][qrKey]) || `row_${i+1}`;
            }
            const safeName = name.replace(/[^a-zA-Z0-9\u1000-\u109F]/g, '_').substring(0, 50);
            archive.append(buffer, { name: `qr_${i+1}_${safeName}.png` });
            processed++;
            console.log(`✅ Row ${i+1} done`);
        } catch (err) {
            failed++;
            console.error(`❌ Row ${i+1} failed:`, err.message);
        }
    }

    await archive.finalize();
    console.log(`\n🎉 Done! ${processed} succeeded, ${failed} failed. ZIP saved.`);
}

main().catch(console.error);
