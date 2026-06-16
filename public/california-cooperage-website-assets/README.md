# California Cooperage Website Assets

All images and logos extracted from the brand PDF and supplied files. Drop these into the `/public/` folder of your Next.js project.

## Folder Structure

```
logos/                  All logo variations (16 PNGs with transparent backgrounds)
lifestyle/              Hero and section lifestyle photography
moodboard/              9 brand mood images from the PDF (Palm Springs vibe)
section_backgrounds/    Beach and palm tree backgrounds used as dividers
mockups/                Practical application mockups (surfboard, mug, tote, sticker)
products/               Product infographic images for CR1, CR2, CR3
from_pdf_pages/         High res rasters of PDF reference pages
```

---

## Logos (folder: `logos/`)

All logos have transparent backgrounds. Use color version on white only, white version over images or dark colors, black version when color cannot be used.

| File | Use Case |
| --- | --- |
| `california-cooperage-logo-color.png` | Primary horizontal logo, use on white backgrounds |
| `california-cooperage-logo-white.png` | Not present in zip, use vert white instead, or `calcoop-primary-white.png` |
| `california-cooperage-logo-black.png` | Black version, white backgrounds when color cannot be used |
| `california-cooperage-logo-singlecolor.png` | Single color version |
| `california-cooperage-logo-vert-color.png` | Vertical layout, color |
| `california-cooperage-logo-vert-white.png` | Vertical layout, white (good for footer over dark) |
| `california-cooperage-logo-vert-black.png` | Vertical layout, black |
| `california-cooperage-logo-vert-singlecolor.png` | Vertical, single color |
| `california-cooperage-wordmark-color.png` | Text only, no icon, color |
| `california-cooperage-wordmark-white.png` | Text only, white |
| `california-cooperage-wordmark-black.png` | Text only, black |
| `california-cooperage-icon-color.png` | Icon only (wave in circle), color, great for favicon |
| `california-cooperage-icon-white.png` | Icon only, white |
| `california-cooperage-icon-black.png` | Icon only, black |
| `california-cooperage-icon-singlecolor.png` | Icon only, single color |
| `calcoop-primary-black.png` | Primary lockup, black |
| `calcoop-primary-white.png` | Primary lockup, white |

### Recommended Usage in the Site

- **Navbar (dark background):** `california-cooperage-logo-vert-white.png` or `calcoop-primary-white.png`
- **Footer:** vertical white logo
- **Favicon:** `california-cooperage-icon-color.png` (resize to 32x32 and 180x180)
- **OG social share image:** create a 1200x630 image using `calcoop-primary-white.png` on a brand blue background

---

## Lifestyle Photos (folder: `lifestyle/`)

| File | Source | Suggested Use |
| --- | --- | --- |
| `cover-women-hot-tub.jpg` | PDF cover page | Hero image, brand story section |
| `main-homepage-image.png` | Your uploaded homepage hero | Homepage hero section |
| `three-tubs-poolside.png` | Your uploaded image | Product lineup section, lifestyle context |

---

## Moodboard Images (folder: `moodboard/`)

Nine images from page 4 of the brand PDF. These capture the brand vibe (Palm Springs, retro California, easy lifestyle). Use sparingly as accent images, on the About section, or in a moodboard style grid.

| File | Subject |
| --- | --- |
| `01-wooden-tub-garden.jpg` | Wooden hot tub in garden setting |
| `02-redwood-forest.jpg` | Redwood forest looking up |
| `03-feet-in-water.jpg` | Feet relaxing in water |
| `04-beach-pastel.jpg` | Pastel beach shoreline |
| `05-man-in-hot-tub.jpg` | Man relaxing in hot tub, mountain view |
| `06-lifeguard-tower.jpg` | Teal lifeguard tower at beach |
| `07-two-women-laughing.jpg` | Two women laughing in spa |
| `08-palm-trees-retro.jpg` | Palm trees with retro filter |
| `09-woman-relaxing-wine.jpg` | Woman relaxing with glass of wine |

---

## Section Backgrounds (folder: `section_backgrounds/`)

Large background images used in the brand PDF as section dividers. Use as full width section backgrounds with dark overlay for readability.

| File | Subject |
| --- | --- |
| `beach-sunset.jpg` | Calm beach at sunset (2559x2550) |
| `palm-trees-vintage.jpg` | Vintage filtered palm trees (2266x2257) |

---

## Mockups (folder: `mockups/`)

Practical application examples from page 21 of the PDF. These show the logo applied to real world items. Use these on an About or Brand page if relevant, or as inspiration for merchandise.

| File | Subject |
| --- | --- |
| `surfboard-with-logo.jpg` | Logo on retro striped surfboard, California beach scene |
| `sticker-pattern.jpg` | Logo sticker pattern on teal background |
| `coffee-mug.jpg` | Logo on white coffee mug |
| `tote-bag-beach.jpg` | Logo on tote bag carried by woman by beach |

---

## Product Infographics (folder: `products/`)

The product feature images with labels overlaid. These came from the original uploads. The original scope doc flagged these as needing clean replacements without labels, but they can be used as is for now.

| File | Product | Notes |
| --- | --- | --- |
| `cr1-square-4person-infographic.png` | Shows 4 person square plug and play | Listed as CR1 but actually shows 4 seater. Verify with supplier |
| `cr2-square-7person-infographic.png` | 7 person square (matches CR2 flagship) | Good fit for CR2 page |
| `cr3-round-infographic.png` | Round plug and play (matches CR3) | Good fit for CR3 page |

> **Note:** all three infographics show 110V plug and play wiring. Confirm with supplier whether this is the actual configuration you are selling (this is open question Q6 in the Notion brief).

---

## Reference Pages (folder: `from_pdf_pages/`)

High resolution rasters of specific PDF pages, kept for reference when implementing brand rules.

| File | Page | Purpose |
| --- | --- | --- |
| `color-palette-page.png` | Page 10 | Official brand color swatches |
| `typography-page.png` | Page 19 | Futura, Open Sans, Pacifico font specimens |
| `clear-space-rules-art.jpg` | Page 16 | Clear space diagram artwork |

---

## Brand Color Reference

From the brand PDF (use these HEX codes in your Tailwind config):

```js
colors: {
  brand: {
    blue:   '#1C4A63',  // Primary, headings
    teal:   '#008B9C',  // Secondary, subheadings
    yellow: '#EFB764',  // Accents
    red:    '#8E2C22',  // Accents, logo element
    brown:  '#9F6438',  // Warm accents
    beige:  '#E9D0BA',  // Backgrounds, warm neutral
  }
}
```

---

## File Size Notes

All extracted JPEGs are at original resolution from the PDF (300 DPI, 800-2500 pixels wide). Before deploying, run them through Next.js Image optimization or compress to WebP. Target under 200 KB per product image and under 400 KB per hero image.

---

*Generated from california-cooperage-brand.pdf and supplied logo zip. Date: May 20, 2026.*
