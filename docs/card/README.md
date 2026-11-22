# epox business card (Ice Mint)

The card from the Ice Mint brand system (Business card group), filled in with the real details. It replaces the earlier Holo Foil card (portrait, infrared + lime), which is in git history; its character art moved to `docs/characters/hello-pair-v4.png`.

| | |
| --- | --- |
| Trim | 3.5 × 2 in (88.9 × 50.8 mm), landscape |
| Bleed | 3 mm on every side (artwork 3.75 × 2.25 in) |
| Stock | 600gsm black board, soft-touch (velvet) lamination |
| Foil | Ice-mint holographic foil on the foil bars and the front wordmark (see the foil plates: black = foil) |
| Back text | White ink or white foil |

## Back: contact lines

- info@epox.systems
- +92 308 2982001 (calls and WhatsApp)
- epox.systems
- St#6, Zia Town, Canal Road, Faisalabad

QR code: **https://epox.systems** (error correction Q, 25 × 25), on the off-white panel. Checked: it decodes from the exported PNG.

## Files

| File | What it is |
| --- | --- |
| `epox-card-front.svg`, `epox-card-back.svg` | Artwork at trim size; contact lines are live Inter text |
| `epox-card-*-print-bleed.svg` | The same with 3 mm bleed, for the printer |
| `epox-card-*-foil-plate.svg` | Foil plates (from the brand system, unchanged) |
| `epox-card-*.png`, `epox-card-*-print-bleed.png` | 300 dpi proofs (trim 1050 × 600, bleed 1125 × 675) |
| `card-preview.png` | Both sides side by side |
| `card.pdf` | 2 pages at bleed size, vector, fonts embedded |

Re-export after editing an SVG: `node scripts/render-card.js`.

## Before printing

- No name or job title yet. When decided, add the name in Space Grotesk Bold 11 pt above the contact lines (brand spec).
- Ask the printer whether they take the PDF with embedded fonts or want the text converted to outlines (do that in Illustrator or Figma with Inter installed).
- Ask for a physical proof of the foil on black board.
