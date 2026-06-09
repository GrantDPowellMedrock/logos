// Regenerate README.md: a gallery of every logo (SVG hero + full PNG size ladder).
//   Usage:  node tools/build-readme.js   (run AFTER generate-pngs.js)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

const enc = p => p.split('/').map(encodeURIComponent).join('/');

const ORDER = {
  Medrock: [
    'MedRock Logo',
    'MedRock Logo (Medrock Pharmacy)',
    'MedRock Logo (Medrock Dermatology)',
    'MedRock Logo (Medrock Pharmacy Dermatology)',
    'MedRock Logo Centered (Medrock Pharmacy)',
    'MedRock Logo Centered (Medrock Dermatology)',
    'MedRock Logo Centered (Medrock Pharmacy Dermatology)',
  ],
  MedDots: [
    'MedDots Logo',
    'MedDots Logo (MedDots Pharmacy)',
    'MedDots Logo (MedDots Engineering)',
    'MedDots Logo (MedDots Pharmacy Engineering)',
    'MedDots Logo Centered (MedDots Pharmacy)',
    'MedDots Logo Centered (MedDots Engineering)',
    'MedDots Logo Centered (MedDots Pharmacy Engineering)',
  ],
};

function heroHeight(name) {
  if (/Centered/.test(name)) return 300;
  if (/\(/.test(name)) return 130;          // horizontal lockups
  return 200;                                // icon only
}

function logoBlock(brand, name) {
  const base = brand + '/' + name;
  const svg = enc(base + '/' + name + '.svg');
  let out = '### ' + name + '\n\n';
  out += '**SVG** (vector — infinitely scalable, all type outlined):\n\n';
  out += '<img src="' + svg + '" alt="' + name + '" height="' + heroHeight(name) + '">\n\n';
  out += '**PNG** (transparent, px — smallest → largest):\n\n';
  const png = N => enc(base + '/png/' + name + '-' + N + '.png');
  // small→mid inline on one row
  const small = SIZES.filter(n => n <= 256);
  out += small.map(n => '<img src="' + png(n) + '" alt="' + n + 'px" title="' + n + 'px">').join(' ') + '\n\n';
  out += '<sub>' + small.join('px · ') + 'px</sub>\n\n';
  // large each on its own line
  for (const n of SIZES.filter(n => n > 256)) {
    out += '<img src="' + png(n) + '" alt="' + n + 'px" title="' + n + 'px"> <sub>' + n + 'px</sub>\n\n';
  }
  return out;
}

let md = `# MedRock & MedDots — Logo Library

Clean, production-ready brand assets for both pharmacy brands. Every logo is provided as a
single self-contained **SVG** (scalable to any size, all type outlined — no fonts required)
plus a full ladder of transparent **PNG** rasters from 16 px up to 1024 px.

The two brands share one design system. Each comes in an **icon**, three **horizontal** lockups
(icon left, wordmark right), and three **centered** lockups (icon top, wordmark beneath):

| | MedRock | MedDots |
|---|---|---|
| wordmark (black \`#231f20\`) | MEDROCK | MEDDOTS |
| black line \`#231f20\` | PHARMACY | PHARMACY |
| grey line \`#818284\` | DERMATOLOGY | ENGINEERING |

\`\`\`
Logos/
├── Medrock/   ← 7 logos  (each folder: <name>.svg + png/<name>-<size>.png)
│   └── _source/MedRock Design Doc.ai   ← editable master artwork
├── MedDots/   ← 7 logos
├── tools/     ← regeneration scripts (generate-pngs.js, build-readme.js)
└── README.md  ← this file (generated)
\`\`\`

> Regenerate everything after editing an SVG: \`npm --prefix tools install\` then
> \`node tools/generate-pngs.js && node tools/build-readme.js\`.

`;

for (const brand of Object.keys(ORDER)) {
  md += '\n---\n\n# ' + (brand === 'Medrock' ? 'MedRock' : 'MedDots') + '\n\n';
  for (const name of ORDER[brand]) md += logoBlock(brand, name) + '\n';
}

md += `---

### Notes
- **Type is fully outlined** — renders identically everywhere, no font installation needed.
- **MedRock palette:** wordmark \`#231f20\`, grey line \`#818284\`, mortar \`#666\`, hex accents \`#4c3661\` / \`#7d2f44\` / \`#ae425f\`.
- **MedDots palette:** blue gradient mark (\`#00317A\` → \`#0066FF\`, accent \`#0062F6\`), wordmark \`#231f20\`, ENGINEERING line \`#818284\`.
- The MedDots wordmark reuses the exact MedRock letterforms, keeping the two brands visually locked together.
- PNG backgrounds are transparent; the checkerboard you may see in some viewers is the alpha channel, not part of the art.
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('wrote README.md (' + md.length + ' bytes)');
