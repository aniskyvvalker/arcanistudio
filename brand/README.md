# Brand guidelines

Three documents, same source of truth:

| File | Source | Pages | Format | Audience |
| --- | --- | --- | --- | --- |
| `arcaniStudio-Brand-Guidelines.pdf` | `brand-guidelines.html` | 21 | A4 landscape, 297 × 210 mm | Designers and developers — the full system, with tokens, ratios and file paths |
| `arcaniStudio-Brand-Essentials.pdf` | `brand-essentials.html` | 9 | 16:9 deck, 297 × 167 mm | Marketing — logo, colour, type, voice, and a pre-publish checklist |
| `arcaniStudio-Brand-Deck.pdf` | `brand-deck.html` | 9 | 3:2 deck, 1920 × 1280 pt | Marketing — brand, logo, colour, typography, elements, laid out on the reference presentation template's grid |

All three are built from a single self-contained HTML file: fonts inlined as
base64 in the shared `_fonts.css`, the mark as inline SVG, no external requests.

`brand-deck.html` reproduces the layout of a Figma community presentation
template — its column grid (80 / 520 / 960 / 1400 / 1840 pt), 80 pt baseline
grid, type sizes and card geometry were measured out of the reference PDF and
are documented in comments at the top of each page block. Only the colours, the
logo and the copy are ours. Coordinates in that file are template points; do not
convert them to other units.

Its page order is deliberately *not* the template's. The template opened with
typography and placed its one section divider after the section it announced;
this deck runs cover → contents → brand → logo → colour → shades → typeface →
hierarchy → elements, and the divider layout is reused as the contents page. The
template's bare grid page was dropped — the grid it documented is the one in the
comment above, and it is easier to read there.

Every colour, token, size and file path is read from the live source
(`src/styles/global.css`, `src/components/Logo.astro`, `public/`, `PRODUCT.md`).
When a token changes, edit the HTML and re-export.

## Re-generate `_fonts.css`

Only needed if the typefaces in `public/fonts/` change.

```bash
python3 - <<'PY'
import base64, pathlib
fonts = [
    ("Switzer", "public/fonts/switzer/Switzer-Variable.woff2", "100 900", "normal"),
    ("ClashDisplay", "public/fonts/clash-display/ClashDisplay-Variable.woff2", "200 700", "normal"),
    ("RecklessNeue", "public/fonts/reckless-neue/RecklessNeue-Regular.woff2", "400", "normal"),
    ("RecklessNeue", "public/fonts/reckless-neue/RecklessNeue-Medium.woff2", "500", "normal"),
    ("RecklessNeue", "public/fonts/reckless-neue/RecklessNeue-Light.woff2", "300", "normal"),
    ("RecklessNeue", "public/fonts/reckless-neue/RecklessNeue-RegularItalic.woff2", "400", "italic"),
]
out = []
for fam, path, weight, style in fonts:
    b = base64.b64encode(pathlib.Path(path).read_bytes()).decode()
    out.append(f"@font-face{{font-family:'{fam}';src:url(data:font/woff2;base64,{b}) format('woff2');font-weight:{weight};font-style:{style};font-display:block;}}")
pathlib.Path("brand/_fonts.css").write_text("\n".join(out))
PY
```

## Re-export the PDFs

Run from the repo root. Headless Chrome honours each document's `@page` size, so
no paper-format flags are needed.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=10000 --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="brand/arcaniStudio-Brand-Guidelines.pdf" "file://$(pwd)/brand/brand-guidelines.html"
```

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=10000 --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="brand/arcaniStudio-Brand-Essentials.pdf" "file://$(pwd)/brand/brand-essentials.html"
```

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --virtual-time-budget=12000 --run-all-compositor-stages-before-draw --print-to-pdf-no-header --print-to-pdf="brand/arcaniStudio-Brand-Deck.pdf" "file://$(pwd)/brand/brand-deck.html"
```

## Editing notes

- Each `<section>` is exactly one PDF page — `.page` in the full book, `.slide`
  in the essentials deck, `.pg` in the template deck — and is clipped at its
  page size. Content that overruns is silently cut, so after editing, open the
  HTML at the matching viewport (1123 × 794 for the book, 1123 × 631 for the
  essentials deck, 2560 × 1707 for the template deck) and confirm nothing
  scrolls:

  ```js
  [...document.querySelectorAll('.page, .slide, .pg')].map((p,i) => ({ page: i+1, over: p.scrollHeight - Math.round(p.getBoundingClientRect().height) })).filter(x => x.over > 1)
  ```

- Page numbers are hard-coded in all three documents — the contents list in the book,
  the `01 / 09` counters in the deck. Adding or removing a page means updating
  them.
- The three documents must agree. If a rule changes, change it in all of them.
