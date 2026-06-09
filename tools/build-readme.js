// Regenerate README.md: TOC + gallery (SVG + PNG ladder + raw links) per logo.
//   Usage:  node tools/build-readme.js   (run AFTER generate-pngs.js / slug rename)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];
const RAW = 'https://raw.githubusercontent.com/GrantDPowellMedrock/logos/main/';

const enc = p => p.split('/').map(encodeURIComponent).join('/');
const anchor = h => h.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

// brand -> [{slug, display, type}]
const BRANDS = [
  { dir: 'Medrock', title: 'MedRock', logos: [
    { slug: 'medrock-logo', display: 'MedRock Logo' },
    { slug: 'medrock-pharmacy', display: 'MedRock Logo (Medrock Pharmacy)' },
    { slug: 'medrock-dermatology', display: 'MedRock Logo (Medrock Dermatology)' },
    { slug: 'medrock-pharmacy-dermatology', display: 'MedRock Logo (Medrock Pharmacy Dermatology)' },
    { slug: 'medrock-pharmacy-centered', display: 'MedRock Logo Centered (Medrock Pharmacy)' },
    { slug: 'medrock-dermatology-centered', display: 'MedRock Logo Centered (Medrock Dermatology)' },
    { slug: 'medrock-pharmacy-dermatology-centered', display: 'MedRock Logo Centered (Medrock Pharmacy Dermatology)' },
  ]},
  { dir: 'MedDots', title: 'MedDots', logos: [
    { slug: 'meddots-logo', display: 'MedDots Logo' },
    { slug: 'meddots-pharmacy', display: 'MedDots Logo (MedDots Pharmacy)' },
    { slug: 'meddots-engineering', display: 'MedDots Logo (MedDots Engineering)' },
    { slug: 'meddots-pharmacy-engineering', display: 'MedDots Logo (MedDots Pharmacy Engineering)' },
    { slug: 'meddots-pharmacy-centered', display: 'MedDots Logo Centered (MedDots Pharmacy)' },
    { slug: 'meddots-engineering-centered', display: 'MedDots Logo Centered (MedDots Engineering)' },
    { slug: 'meddots-pharmacy-engineering-centered', display: 'MedDots Logo Centered (MedDots Pharmacy Engineering)' },
  ]},
];

function logoBlock(brand, logo) {
  const base = brand.dir + '/' + logo.slug;
  const svg = base + '/' + logo.slug + '.svg';
  const png = N => base + '/png/' + logo.slug + '-' + N + '.png';
  let out = '### ' + logo.display + '\n\n';
  out += '**SVG** (vector — infinitely scalable, all type outlined):\n\n';
  out += '![' + logo.display + '](' + enc(svg) + ')\n\n';
  out += '**PNG** raster ladder (transparent, px — smallest → largest):\n\n';
  const small = SIZES.filter(n => n <= 256);
  out += small.map(n => '![' + n + 'px](' + enc(png(n)) + ')').join(' ') + '\n\n';
  out += '*' + small.join('px · ') + 'px*\n\n';
  for (const n of SIZES.filter(n => n > 256)) {
    out += '![' + n + 'px](' + enc(png(n)) + ')\n\n*' + n + 'px*\n\n';
  }
  out += '**Raw image links** (public — each has its own copy button):\n\n';
  const links = [{ label: 'SVG', url: svg }, ...SIZES.map(n => ({ label: n + 'px', url: png(n) }))];
  for (const l of links) {
    out += l.label + '\n\n```text\n' + RAW + enc(l.url) + '\n```\n\n';
  }
  return out;
}

// ---- TOC ----
let toc = '## Contents\n\n';
for (const brand of BRANDS) {
  toc += '- [' + brand.title + '](#' + anchor(brand.title) + ')\n';
  for (const logo of brand.logos) toc += '  - [' + logo.display + '](#' + anchor(logo.display) + ')\n';
}

let md = `# MedRock & MedDots — Logo Library

Clean, production-ready brand assets for both pharmacy brands. Every logo is a single
self-contained **SVG** (scalable to any size, all type outlined — no fonts required) plus a
full ladder of transparent **PNG** rasters from 16 px up to 1024 px. Public raw image links
are listed under each logo for copy-paste into sites, decks, and docs.

The two brands share one design system — an **icon**, three **horizontal** lockups
(icon left, wordmark right), and three **centered** lockups (icon top, wordmark beneath):

| | MedRock | MedDots |
|---|---|---|
| wordmark (black \`#231f20\`) | MEDROCK | MEDDOTS |
| black line \`#231f20\` | PHARMACY | PHARMACY |
| grey line \`#818284\` | DERMATOLOGY | ENGINEERING |

\`\`\`
Logos/
├── Medrock/   ← 7 logos  (each folder: <slug>.svg + png/<slug>-<size>.png)
│   └── _source/MedRock Design Doc.ai   ← editable master artwork
├── MedDots/   ← 7 logos
├── tools/     ← regeneration scripts (generate-pngs.js, build-readme.js)
└── README.md  ← this file (generated)
\`\`\`

> **Raw link base:** \`${RAW}\`
> **Regenerate** after editing any SVG: \`npm --prefix tools install\` then
> \`node tools/generate-pngs.js && node tools/build-readme.js\`.

---

${toc}
`;

for (const brand of BRANDS) {
  md += '\n---\n\n# ' + brand.title + '\n\n';
  brand.logos.forEach((logo, i) => {
    md += logoBlock(brand, logo);
    md += '\n---\n\n';   // clear separator between every logo
  });
}

md += `### Notes
- **Type is fully outlined** — renders identically everywhere, no font installation needed.
- **MedRock palette:** wordmark \`#231f20\`, grey line \`#818284\`, mortar \`#666\`, hex accents \`#4c3661\` / \`#7d2f44\` / \`#ae425f\`.
- **MedDots palette:** blue gradient mark (\`#00317A\` → \`#0066FF\`, accent \`#0062F6\`), wordmark \`#231f20\`, ENGINEERING line \`#818284\`.
- The MedDots wordmark reuses the exact MedRock letterforms, keeping the two brands visually locked together.
- PNG backgrounds are transparent; any checkerboard in a viewer is the alpha channel, not the art.
`;

fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('wrote README.md (' + md.length + ' bytes)');
