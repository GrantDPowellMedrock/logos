// Regenerate README.md (friendly gallery) + DEVELOPER.md (technical notes).
//   Usage:  node tools/build-readme.js   (run AFTER generate-pngs.js)
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];
const RAW = 'https://raw.githubusercontent.com/GrantDPowellMedrock/logos/main/';

const enc = p => p.split('/').map(encodeURIComponent).join('/');
const anchor = h => h.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

const BRANDS = [
  { dir: 'Medrock', title: 'MedRock', logos: [
    { slug: 'medrock-logo', display: 'MedRock Logo' },
    { slug: 'medrock-pharmacy', display: 'MedRock Logo (Medrock Pharmacy)' },
    { slug: 'medrock-dermatology', display: 'MedRock Logo (Medrock Dermatology)' },
    { slug: 'medrock-pharmacy-dermatology', display: 'MedRock Logo (Medrock Pharmacy Dermatology)' },
    { slug: 'medrock-pharmacy-centered', display: 'MedRock Logo Centered (Medrock Pharmacy)' },
    { slug: 'medrock-dermatology-centered', display: 'MedRock Logo Centered (Medrock Dermatology)' },
    { slug: 'medrock-pharmacy-dermatology-centered', display: 'MedRock Logo Centered (Medrock Pharmacy Dermatology)' },
    { slug: 'medrock-dermatology-science-of-skincare-centered', display: 'MedRock Logo Centered (Medrock Dermatology Science of SkinCare)' },
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

// ---- a single logo's gallery block (clickable images + copy-paste links) ----
function logoBlock(brand, logo) {
  const base = brand.dir + '/' + logo.slug;
  const svgRel = enc(base + '/' + logo.slug + '.svg');
  const svgRaw = RAW + svgRel;
  const pngRel = N => enc(base + '/png/' + logo.slug + '-' + N + '.png');
  const pngRaw = N => RAW + pngRel(N);
  const link = (imgRel, target) => '[![' + logo.display + '](' + imgRel + ')](' + target + ')';

  let o = '### ' + logo.display + '\n\n';
  // always-visible clickable hero (opens the SVG file)
  o += link(svgRel, svgRaw) + '\n\n';
  // everything else folds into a default-collapsed section
  o += '<details>\n';
  o += '<summary><b>Other sizes &amp; direct links</b> — click to open</summary>\n\n';
  o += '**PNG sizes** — click any to open the file, then right-click → Save:\n\n';
  const small = SIZES.filter(n => n <= 256);
  o += small.map(n => '[![' + n + 'px](' + pngRel(n) + ')](' + pngRaw(n) + ')').join(' ') + '\n\n';
  o += '*' + small.join('px · ') + 'px*\n\n';
  for (const n of SIZES.filter(n => n > 256)) {
    o += '[![' + n + 'px](' + pngRel(n) + ')](' + pngRaw(n) + ')\n\n*' + n + 'px*\n\n';
  }
  o += '**Direct links** — copy to paste into a website, email, or slide deck:\n\n';
  const links = [['SVG (best quality, any size)', svgRaw], ...SIZES.map(n => [n + 'px PNG', pngRaw(n)])];
  for (const [label, url] of links) o += label + '\n\n```text\n' + url + '\n```\n\n';
  o += '</details>\n';
  return o;
}

// ---- TOC ----
let toc = '## Find a logo\n\n';
for (const brand of BRANDS) {
  toc += '- [' + brand.title + '](#' + anchor(brand.title) + ')\n';
  for (const logo of brand.logos) toc += '  - [' + logo.display + '](#' + anchor(logo.display) + ')\n';
}

// ============================ README.md (friendly) ============================
let md = '';
md += '# MedRock & MedDots — Logo Library\n\n';
md += 'Every official MedRock and MedDots logo, ready to download and use. Scroll down to see them all, or jump to one using **[Find a logo](#find-a-logo)** below.\n\n';

md += '## How to use these logos\n\n';
md += '**To download a logo:** click its picture — it opens the image file in your browser, where you can right-click and choose **“Save image as…”**. The large image is the SVG (best quality).\n\n';
md += 'Need a specific PNG size, or a link to copy? Under each logo, click **“Other sizes & direct links”** to expand the full set of sizes plus copy-paste links (for websites, email signatures, slide decks).\n\n';
md += '**Should I use the SVG or a PNG?**\n\n';
md += '- **SVG** — the original artwork. It stays perfectly sharp at *any* size, from a business card to a billboard. Use this whenever you can.\n';
md += '- **PNG** — a ready-made picture at a fixed size. Use it when a tool only accepts a regular image (some email tools, older apps, website favicons).\n\n';
md += '**Which PNG size?**\n\n';
md += '| Size | Good for |\n|---|---|\n';
md += '| 16–48 px | favicons, tiny icons, email signatures |\n';
md += '| 64–256 px | websites, social media, slide decks |\n';
md += '| 512–1024 px | print, posters, large screens |\n\n';
md += '*Not sure? Use the SVG — it never blurs.*\n\n';
md += 'Every logo has a **see-through (transparent) background**, so it sits cleanly on any color.\n\n';

md += '## Brand colors\n\n';
md += '| | Color | Hex |\n|---|---|---|\n';
md += '| Wordmark / black text | near-black | `#231f20` |\n';
md += '| Secondary line (Dermatology / Engineering) | grey | `#818284` |\n';
md += '| MedRock mortar icon | grey | `#666666` |\n';
md += '| MedRock icon accents | berry tones | `#4c3661` · `#7d2f44` · `#ae425f` |\n';
md += '| MedDots mark | blue gradient | `#00317A` → `#0066FF` |\n\n';

md += '---\n\n' + toc + '\n';

for (const brand of BRANDS) {
  md += '\n---\n\n# ' + brand.title + '\n\n';
  for (const logo of brand.logos) {
    md += logoBlock(brand, logo);
    md += '\n---\n\n';
  }
}

md += 'Need a size or format that isn’t here, or a one-color / inverted version? Just ask.\n\n';
md += '*Technical details (folder layout, how these files are generated) live in [DEVELOPER.md](DEVELOPER.md).*\n';

fs.writeFileSync(path.join(ROOT, 'README.md'), md);
console.log('wrote README.md (' + md.length + ' bytes)');

// ============================ DEVELOPER.md (technical) ============================
const mrCount = BRANDS[0].logos.length, mdCount = BRANDS[1].logos.length;
let dev = '';
dev += '# Developer notes\n\n';
dev += 'Technical reference for this logo repository. For the logos themselves (with download instructions), see **[README.md](README.md)**.\n\n';
dev += '## Repository layout\n\n';
dev += '```\n';
dev += 'logos/\n';
dev += '├── Medrock/   (' + mrCount + ' logos)   each folder: <slug>.svg + png/<slug>-<size>.png\n';
dev += '│   └── _source/MedRock Design Doc.ai   editable master artwork (Illustrator)\n';
dev += '├── MedDots/   (' + mdCount + ' logos)\n';
dev += '├── tools/     generate-pngs.js, build-readme.js (+ package.json)\n';
dev += '├── README.md      generated gallery (do not hand-edit)\n';
dev += '└── DEVELOPER.md   this file (generated)\n';
dev += '```\n\n';
dev += 'Each logo lives in its own slug-named folder containing the master `.svg` and a `png/`\n';
dev += 'sub-folder with the full size ladder (' + SIZES.join(', ') + ' px).\n\n';
dev += '## Regenerating assets\n\n';
dev += 'After adding or editing any SVG, rebuild the PNGs and docs:\n\n';
dev += '```bash\n';
dev += 'npm --prefix tools install      # one-time: install @resvg/resvg-js\n';
dev += 'node tools/generate-pngs.js     # rebuild every PNG ladder from the SVGs\n';
dev += 'node tools/build-readme.js      # rebuild README.md + DEVELOPER.md\n';
dev += '```\n\n';
dev += 'To add a new logo: drop `<slug>/<slug>.svg` under `Medrock/` or `MedDots/`, add an entry\n';
dev += 'to the `BRANDS` array in `tools/build-readme.js`, then run the two commands above.\n\n';
dev += '## Public raw URL base\n\n';
dev += '```text\n' + RAW + '\n```\n\n';
dev += 'Append a file path, e.g. `Medrock/medrock-logo/png/medrock-logo-512.png`. A CDN-cached\n';
dev += 'alternative (public repos) is jsDelivr: `https://cdn.jsdelivr.net/gh/GrantDPowellMedrock/logos@main/<path>`.\n\n';
dev += '## Technical notes\n\n';
dev += '- **All text is converted to outlines** in the SVGs — they render identically everywhere with no fonts to install.\n';
dev += '- **PNGs are RGBA with transparent backgrounds**, rendered by `@resvg/resvg-js`; the longest edge equals the size in the filename (aspect ratio preserved).\n';
dev += '- The “Science of SkinCare” tagline is set in **EB Garamond Italic** (outlined into the SVG).\n';
dev += '- The MedDots wordmark reuses the exact MedRock letterforms so the two brands stay visually locked together.\n\n';
dev += '## Full palette\n\n';
dev += '- **MedRock:** wordmark `#231f20`, secondary line `#818284`, mortar `#666666`, icon accents `#4c3661` / `#7d2f44` / `#ae425f`.\n';
dev += '- **MedDots:** blue gradient mark `#00317A` → `#0066FF` (accent `#0062F6`), wordmark `#231f20`, ENGINEERING line `#818284`.\n';

fs.writeFileSync(path.join(ROOT, 'DEVELOPER.md'), dev);
console.log('wrote DEVELOPER.md (' + dev.length + ' bytes)');
