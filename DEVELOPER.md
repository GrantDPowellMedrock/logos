# Developer notes

Technical reference for this logo repository. For the logos themselves (with download instructions), see **[README.md](README.md)**.

## Repository layout

```
logos/
├── Medrock/   (8 logos)   each folder: <slug>.svg + png/<slug>-<size>.png
│   └── _source/MedRock Design Doc.ai   editable master artwork (Illustrator)
├── MedDots/   (7 logos)
├── tools/     generate-pngs.js, build-readme.js (+ package.json)
├── README.md      generated gallery (do not hand-edit)
└── DEVELOPER.md   this file (generated)
```

Each logo lives in its own slug-named folder containing the master `.svg` and a `png/`
sub-folder with the full size ladder (16, 32, 48, 64, 128, 256, 512, 1024 px).

## Regenerating assets

After adding or editing any SVG, rebuild the PNGs and docs:

```bash
npm --prefix tools install      # one-time: install @resvg/resvg-js
node tools/generate-pngs.js     # rebuild every PNG ladder from the SVGs
node tools/build-readme.js      # rebuild README.md + DEVELOPER.md
```

To add a new logo: drop `<slug>/<slug>.svg` under `Medrock/` or `MedDots/`, add an entry
to the `BRANDS` array in `tools/build-readme.js`, then run the two commands above.

## Public raw URL base

```text
https://raw.githubusercontent.com/GrantDPowellMedrock/logos/main/
```

Append a file path, e.g. `Medrock/medrock-logo/png/medrock-logo-512.png`. A CDN-cached
alternative (public repos) is jsDelivr: `https://cdn.jsdelivr.net/gh/GrantDPowellMedrock/logos@main/<path>`.

## Technical notes

- **All text is converted to outlines** in the SVGs — they render identically everywhere with no fonts to install.
- **PNGs are RGBA with transparent backgrounds**, rendered by `@resvg/resvg-js`; the longest edge equals the size in the filename (aspect ratio preserved).
- The “Science of SkinCare” tagline is set in **EB Garamond Italic** (outlined into the SVG).
- The MedDots wordmark reuses the exact MedRock letterforms so the two brands stay visually locked together.

## Full palette

- **MedRock:** wordmark `#231f20`, secondary line `#818284`, mortar `#666666`, icon accents `#4c3661` / `#7d2f44` / `#ae425f`.
- **MedDots:** blue gradient mark `#00317A` → `#0066FF` (accent `#0062F6`), wordmark `#231f20`, ENGINEERING line `#818284`.
