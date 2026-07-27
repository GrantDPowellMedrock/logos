# CLAUDE.md — MedRock & MedDots Logo Library

Guidance for Claude (and humans) working in this repo. Read this before making or editing any logo.

Public repo: `https://github.com/GrantDPowellMedrock/logos`

---

## What this repo is

A brand-asset library for two sister brands — **MedRock** (pharmacy/dermatology) and **MedDots**
(engineering/pharmacy) — plus a `MISC/` folder of event/partner assets. Every logo ships as a
self-contained **SVG** (all text outlined — no fonts required) and a ladder of transparent **PNGs**.

```
logos/
├── Medrock/     one folder per logo:  <slug>/<slug>.svg  +  <slug>/png/<slug>-<size>.png
│   └── _source/MedRock Design Doc.ai      editable master artwork (Illustrator) — do not delete
├── MedDots/     same structure
├── MISC/        flat folder of event/partner assets (hand-curated, no ladder)
├── tools/       generate-pngs.js, build-readme.js (Node; deps in tools/node_modules, gitignored)
├── README.md    GENERATED — do not hand-edit
├── DEVELOPER.md GENERATED — do not hand-edit
└── CLAUDE.md    this file
```

Logo sizes: `16, 32, 48, 64, 128, 256, 512, 1024` px (longest edge = the number; aspect preserved).

---

## Golden rules

1. **NEVER modify or delete an existing logo unless explicitly asked.** To make a variant, COPY its
   shapes into a NEW file. The user is emphatic about this.
2. **All type is outlined** in the SVGs (vector paths, not `<text>`). No font is ever required to render.
3. **PNGs are transparent** (RGBA). Rendered by `@resvg/resvg-js`, longest edge = size.
4. **`README.md` and `DEVELOPER.md` are generated.** Never edit them directly — edit
   `tools/build-readme.js` and re-run it.
5. **Slug names**: lowercase, hyphenated, URL-safe (`medrock-pharmacy-centered`). Brand folders
   `Medrock`/`MedDots` stay capitalized (already URL-safe).
6. **Brand colors** — wordmark/black `#231f20`; grey secondary line (Dermatology/Engineering)
   `#818284`; MedRock mortar `#666666` + berry accents `#4c3661` / `#7d2f44` / `#ae425f`;
   MedDots icon blue gradient `#00317A → #0066FF` (accent `#0062F6`).

---

## How to add or edit a logo

**A regular brand logo (Medrock/ or MedDots/):**
1. Create `Medrock/<slug>/<slug>.svg` (outlined, transparent).
2. Add `{ slug, display }` to the `BRANDS` array in `tools/build-readme.js`.
3. Regenerate:
   ```bash
   npm --prefix tools install        # one-time
   node tools/generate-pngs.js       # builds every PNG ladder from the SVGs
   node tools/build-readme.js        # rebuilds README.md + DEVELOPER.md
   ```
4. Commit + push. `generate-pngs.js` auto-discovers folders (skips names starting with `_`).

**A MISC/event asset:** drop the file in `MISC/`, then add it to the `miscSection()` /
`miscItem(...)` calls in `tools/build-readme.js` and re-run `build-readme.js`.

---

## How the logos are built (design knowledge — don't re-derive this)

- **The wordmark font is an unidentified wide, light, geometric sans.** Do NOT try to match it to a
  font. The **real outlined glyphs** live in `Medrock/medrock-pharmacy-dermatology/…svg` (the 3-line
  master): MEDROCK, PHARMACY (black, with a weight-matching `stroke-width` 0.31), DERMATOLOGY (grey).
  Reuse those glyph paths.
- **The MedDots wordmark reuses the exact MedRock letterforms** (`MEDDOTS` = M,E,D,O real + a
  constructed `T` + a Century-Gothic `S` tuned to fit). This keeps the two brands visually locked.
- **Monoline stroke** ≈ `0.09 × cap-height` for both weights (they only look different because sizes
  differ). Constructed letters must match that.
- **Missing letters** were constructed (I, N, T from rectangles/polygons) or borrowed and weight-tuned
  (S from Century Gothic). The **"Science of SkinCare" tagline** is **EB Garamond Italic**, outlined.
- **Icons**: MedRock = mortar & pestle (`#666` bowl + berry hexagons). MedDots = blue-gradient mark
  (uses `<defs>` linear gradients — keep the `<defs>` when you move the icon between files).

---

## Tooling & gotchas (these will bite you)

- **SVG → PNG**: use `@resvg/resvg-js` (`new Resvg(svg, {fitTo, background:'rgba(0,0,0,0)'}).render().asPng()`).
- **Vectorize a raster logo** (e.g. a partner PNG): flatten it onto white first, then `potrace`
  (single-color trace). Works great for black line-art; the trace is only as detailed as the source,
  so start from the highest-res raster you can find (often the org's official site serves 1024px).
- **Measuring a group's rendered bounding box**: `resvg.innerBBox()` is **UNRELIABLE** with nested
  transforms (returns garbage like `h:1`). Instead render to pixels and scan the alpha channel
  (supersample ~4×, find min/max x/y where alpha > ~12). See `_mdbuild/build.js` history / MedDots
  plain-logo build for the pattern.
- **Chrome headless screenshots**: ALWAYS pass an **absolute** `--screenshot=C:/…/out.png` path.
  A relative path silently saves to the wrong cwd.
- **README uses inline HTML** (`<details>` collapsibles, `<p align="center">`, `<img>`). This renders
  on **GitHub and VS Code preview** but shows as raw tags in viewers that strip HTML. Keep hero
  previews as PNGs (portable) linking to the SVG; that's why each logo shows a centered 512px preview.
- **Scratch dirs**: prefix throwaway files/folders with `_` (e.g. `_build/`, `_mdbuild/`) and delete
  them before committing. `tools/node_modules` is gitignored.

---

## Verify before claiming done

- `npm --prefix tools install && node tools/generate-pngs.js && node tools/build-readme.js` runs clean.
- New raw URLs return HTTP 200 after push:
  `https://raw.githubusercontent.com/GrantDPowellMedrock/logos/main/<path>`
- `git status` shows only intended changes (no accidental edits to existing logos).
