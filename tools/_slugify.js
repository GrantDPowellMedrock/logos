// One-time migration: rename logo folders + svg + png files to URL-safe slugs.
// Brand folders (Medrock / MedDots) are already URL-safe and kept as-is.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

const MAP = {
  Medrock: {
    'MedRock Logo': 'medrock-logo',
    'MedRock Logo (Medrock Pharmacy)': 'medrock-pharmacy',
    'MedRock Logo (Medrock Dermatology)': 'medrock-dermatology',
    'MedRock Logo (Medrock Pharmacy Dermatology)': 'medrock-pharmacy-dermatology',
    'MedRock Logo Centered (Medrock Pharmacy)': 'medrock-pharmacy-centered',
    'MedRock Logo Centered (Medrock Dermatology)': 'medrock-dermatology-centered',
    'MedRock Logo Centered (Medrock Pharmacy Dermatology)': 'medrock-pharmacy-dermatology-centered',
  },
  MedDots: {
    'MedDots Logo': 'meddots-logo',
    'MedDots Logo (MedDots Pharmacy)': 'meddots-pharmacy',
    'MedDots Logo (MedDots Engineering)': 'meddots-engineering',
    'MedDots Logo (MedDots Pharmacy Engineering)': 'meddots-pharmacy-engineering',
    'MedDots Logo Centered (MedDots Pharmacy)': 'meddots-pharmacy-centered',
    'MedDots Logo Centered (MedDots Engineering)': 'meddots-engineering-centered',
    'MedDots Logo Centered (MedDots Pharmacy Engineering)': 'meddots-pharmacy-engineering-centered',
  },
};

for (const brand of Object.keys(MAP)) {
  for (const [oldName, slug] of Object.entries(MAP[brand])) {
    const dir = path.join(ROOT, brand, oldName);
    if (!fs.existsSync(dir)) { console.log('SKIP (missing):', brand, oldName); continue; }
    // svg
    fs.renameSync(path.join(dir, oldName + '.svg'), path.join(dir, slug + '.svg'));
    // pngs
    const pngDir = path.join(dir, 'png');
    for (const N of SIZES) {
      fs.renameSync(path.join(pngDir, oldName + '-' + N + '.png'), path.join(pngDir, slug + '-' + N + '.png'));
    }
    // folder last
    fs.renameSync(dir, path.join(ROOT, brand, slug));
    console.log('renamed:', brand + '/' + oldName, '->', brand + '/' + slug);
  }
}
console.log('slugify complete.');
