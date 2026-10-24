# Dafoof Books — brand kit, social kit & landing page

Everything for **Dafoof Books** (<https://payhip.com/DafoofBooks>) in one folder:
a logo set, a social media kit, editable book-cover templates, and a bilingual
(English / Arabic) landing page you can host and link from your Payhip bio.

---

## 1. What's inside

```
dafoof-books/
├─ brand/
│  ├─ logo/          Logo set — SVG (editable) + PNG exports
│  ├─ social/        Profile picture, cover banner, 3 post templates
│  ├─ covers/        2 book-cover templates (1600×2400, Payhip's 2:3 ratio)
│  ├─ fonts/         Fraunces · Amiri · Tajawal (OFL licensed, bundled)
│  └─ reference/     Your current Payhip logo (kept for comparison)
├─ landing/          Bilingual website — home, shop, product, contact
│  ├─ assets/        Logos, favicon, your 7 covers, books.js (catalogue)
│  ├─ index.html     Home
│  ├─ shop.html      The full shelf, filterable
│  ├─ product.html   One book + related titles
│  └─ contact.html   Contact channels, checklist, FAQ
├─ work/             Generators, renderer, local preview server
└─ package.json      npm run build / render / serve
```

**PNGs ship next to every SVG** — `brand/logo/dafoof-logo-primary.svg` and
`brand/logo/dafoof-logo-primary@1360w.png` are the same artwork.

---

## 2. The brand

### The mark
A closed book with an arched doorway cut into the cover, a warm light inside,
and the **DB** monogram above it. It is a literal expression of the tagline —
*your gateway between the covers* — and it keeps the book + arch + monogram DNA
of your original logo, recoloured into the new palette.

Three cuts of the mark:

| File | Use it for |
|---|---|
| `dafoof-icon.svg` | Profile pictures, banners, anything ≥ 64 px |
| `dafoof-icon-minimal.svg` | Favicon, watermarks, anything ≤ 48 px (no monogram) |
| `*-dark.svg` lockups | Artwork placed on dark / green backgrounds |

### Palette

| Token | Hex | Where |
|---|---|---|
| Parchment | `#FBF5EA` | Page background, text on green |
| Sand | `#F3E7D3` | Panels, quotes |
| Sand deep | `#EADCC2` | Borders, pills |
| Espresso | `#3A2A1F` | Primary text |
| Walnut | `#6B5540` | Secondary text |
| Book green | `#2F5D50` | Primary brand colour |
| Deep green | `#24463C` | Dark fields, footers |
| Terracotta | `#C0663D` | Call-to-action, accent |
| Honey gold | `#E0A94E` | Highlights, light in the doorway |

### Typography

| Role | Font | Used for |
|---|---|---|
| English display | **Fraunces** | Headlines, wordmark, cover titles |
| Arabic display | **Amiri** | Arabic headlines and pull quotes |
| UI / body (both) | **Tajawal** | Body copy, labels, taglines |
| Monogram | Georgia Bold Italic | The **DB** in the mark |

All three families are bundled in `brand/fonts/` under the SIL Open Font License
— free for commercial use.

---

## 3. Logo set

| File | Size (SVG) | Exports |
|---|---|---|
| `dafoof-icon.svg` | 512 × 512 | 1024 / 512 / 256 px PNG |
| `dafoof-icon-minimal.svg` | 512 × 512 | 1024 / 512 / 256 px PNG |
| `dafoof-logo-primary.svg` | 720 × 220 | 2040 / 1360 px PNG |
| `dafoof-logo-primary-dark.svg` | 720 × 220 | 2040 / 1360 px PNG |
| `dafoof-logo-stacked.svg` | 520 × 340 | 1560 / 1040 px PNG |
| `dafoof-logo-stacked-dark.svg` | 520 × 340 | 1560 / 1040 px PNG |
| `dafoof-logo-arabic.svg` | 430 × 220 | 2100 / 1400 px PNG |
| `dafoof-logo-arabic-dark.svg` | 430 × 220 | 2100 / 1400 px PNG |

> **Payhip store logo:** upload `dafoof-icon@1024w.png` (square) or
> `dafoof-logo-primary@1360w.png` (wordmark).

---

## 4. Social media kit

| File | Size | Purpose |
|---|---|---|
| `profile-picture.png` | 500 × 500 | Instagram / Facebook / Payhip avatar |
| `cover-banner.png` | 1500 × 500 | Facebook cover, Payhip banner, X header |
| `post-free-book.png` | 1080 × 1080 | "Get your first book free" promo |
| `post-new-arrivals.png` | 1080 × 1080 | Shows 3 real covers + prices |
| `post-quote.png` | 1080 × 1080 | Bilingual reading quote |

Each is bilingual (English + Arabic) and ends with your store URL.
`post-new-arrivals.svg` embeds your real cover art as base64, so the file is
self-contained (~670 kB) — edit the titles/prices near the bottom of the SVG.

---

## 5. Book-cover templates

`brand/covers/cover-template-cream.svg` and `cover-template-green.svg`
are **1600 × 2400** (2:3), which matches Payhip's recommended product image ratio.

To publish a new book cover:

1. Open the SVG in any editor (Inkscape, Figma, Illustrator, even Notepad).
2. Search for `EDIT` — every placeholder is marked.
   Replace `BOOK TITLE`, `Subtitle or series name`, `عنوان الكتاب`, the
   description lines and the `PDF · EPUB` badge.
3. Re-render to PNG at full size:

   ```powershell
   npm run build          # regenerates all SVGs from the design system
   # …or just render one file at any width:
   node work/render.js brand/covers/cover-template-cream.svg
   ```

4. Upload the PNG to Payhip as the product image.

---

## 6. The website

`landing/` is a plain static site — no build step, no framework. Four pages,
one shared style:

| Page | What it is |
| --- | --- |
| `landing/index.html` | Home — hero, 4 featured books, why-Dafoof, how it works |
| `landing/shop.html` | The full shelf — all 7 books, filterable by category |
| `landing/product.html` | One book at a time (`product.html?id=…`), with related titles |
| `landing/contact.html` | How to reach you, a checklist, and an FAQ |

* **Bilingual** with a working **EN / ع** toggle: it flips `dir` between `ltr`
  and `rtl`, swaps every string, swaps the logo to the Arabic lockup, changes
  the page title, and remembers your choice in `localStorage`.
* Auto-detects Arabic browsers and defaults to RTL.
* All 7 of your products, with your real cover art, real Payhip descriptions
  and live Payhip links.
* Warm, readable, mobile-first; respects `prefers-reduced-motion`.
* Works without JavaScript too — every page falls back to a link to your
  Payhip store.

### Preview it locally

```powershell
npm run serve
# then open http://127.0.0.1:8077/landing/
```

### Put it online and link it from Payhip

The folder is host-ready as-is. Any of these work:

* **GitHub Pages** — push `landing/` contents to a repo, enable Pages.
* **Netlify / Cloudflare Pages** — drag the `landing/` folder into the deploy UI.
* **Your own host** — upload the `landing/` folder via FTP/SFTP.

Then in Payhip: **Store settings → Store links / bio**, add your new URL.

### Editing copy

Every translatable string sits on one element with both languages:

```html
<h1 data-en="Your gateway between the covers" data-ar="بوابتك بين الأغلفة">
  Your gateway between the covers
</h1>
```

Change either side and reload — no rebuild needed.

### Editing the products

The books live in **one file**: `landing/assets/books.js`. Title, price, cover,
Payhip link, description and bullet points, each in English and Arabic. Every
card on every page reads from it, so changing a price there updates the home
page, the shop, and all 7 product pages at once.

```js
{
  id: "the-48-laws-of-power",        // used by product.html?id=…
  url: "https://payhip.com/b/oXDvu", // your Payhip short link
  price: 2,                          // 0 renders as "Free / مجاني"
  tag: "classics",                   // filter category on the shop page
  title: { en: "The 48 Laws of Power", ar: "…" },
  blurb: { en: "…", ar: "…" },       // paragraph on the product page
  points: [ { en: "…", ar: "…" } ]   // bullet list on the product page
}
```

Category labels are at the top of the same file, in `TAGS`.

---

## 7. Regenerating everything

```powershell
npm install          # once — installs the SVG→PNG renderer
npm run all          # rebuild all SVGs, then export every PNG
npm run build        # SVGs only
npm run render       # PNGs only
```

`work/brandlib.js` is the single source of truth: palette, the mark, and the
SVG helpers. `work/build-logos.js`, `build-social.js` and `build-covers.js`
all import it, so a colour change in one place updates the whole kit.

---

## 8. Two things worth fixing on the store

1. **Banner typo** — the announcement bar currently reads
   *"Get You First Book Free"*. It should be **"Get Your First Book Free"**.
2. **Two product titles** have typos:
   *"Animatior Survival Kit…"* → **"Animator Survival Kit…"**, and
   *"Step-By-Step Guide to Earning $1,000 per Month"* is fine but long —
   a shorter title converts better.

---

## 9. Fonts & licences

| Font | Source | Licence |
|---|---|---|
| Fraunces | [Google Fonts](https://fonts.google.com/specimen/Fraunces) | SIL OFL 1.1 |
| Amiri | [Google Fonts](https://fonts.google.com/specimen/Amiri) | SIL OFL 1.1 |
| Tajawal | [Google Fonts](https://fonts.google.com/specimen/Tajawal) | SIL OFL 1.1 |

The landing page loads the same families from Google Fonts for speed, with
these bundled files as local fallbacks. Cover art from your own store is used
with permission — it belongs to the original publishers.
