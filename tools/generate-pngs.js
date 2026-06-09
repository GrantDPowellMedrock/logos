// Rasterize every logo SVG into a ladder of transparent PNGs.
//   Usage:  node tools/generate-pngs.js
// Output:  <each logo folder>/png/<logo name>-<size>.png   (size = longest edge in px)
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.resolve(__dirname, '..');
const BRANDS = ['Medrock', 'MedDots'];
const SIZES = [16, 32, 48, 64, 128, 256, 512, 1024];

function viewBoxAR(svg) {
  const vb = svg.match(/viewBox="([\d.\-\s]+)"/);
  if (vb) { const p = vb[1].trim().split(/\s+/).map(Number); return p[2] / p[3]; }
  const w = svg.match(/width="([\d.]+)"/), h = svg.match(/height="([\d.]+)"/);
  return w && h ? Number(w[1]) / Number(h[1]) : 1;
}

let total = 0;
for (const brand of BRANDS) {
  const brandDir = path.join(ROOT, brand);
  for (const folder of fs.readdirSync(brandDir)) {
    if (folder.startsWith('_')) continue;                  // skip _source etc.
    const dir = path.join(brandDir, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    const svgPath = path.join(dir, folder + '.svg');
    if (!fs.existsSync(svgPath)) continue;
    const svg = fs.readFileSync(svgPath, 'utf8');
    const ar = viewBoxAR(svg);                             // width / height
    const pngDir = path.join(dir, 'png');
    fs.mkdirSync(pngDir, { recursive: true });
    for (const N of SIZES) {
      const fitTo = ar >= 1 ? { mode: 'width', value: N } : { mode: 'height', value: N };
      const png = new Resvg(svg, { fitTo, background: 'rgba(0,0,0,0)' }).render().asPng();
      fs.writeFileSync(path.join(pngDir, folder + '-' + N + '.png'), png);
      total++;
    }
    console.log('✓', brand + '/' + folder, '→', SIZES.length, 'PNGs');
  }
}
console.log('\nDone:', total, 'PNGs across', BRANDS.length, 'brands.');
