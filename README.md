# FACEWALL — Draft 02

**Static website preview for GitHub Pages; final deployment target: WordPress.**

> Current name: **FACEWALL · WALLPAPER & FLOORING**. Future brand name reserved: **FACEWALL FLOORING · WALLPAPER & FLOORING**.

## Pages included

| Main page | File | Features |
|---|---|---|
| Home | `index.html` | Original desktop/mobile hero, services split, brand, comparison, eCatalog highlights, blog previews, consultation CTA |
| Before / After | `showcase.html` | Wallpaper / Vinyl Flooring category buttons, two functional before/after sliders, uploaded Wallpaper banner |
| eCatalog Online | `catalog.html` | Six real covers, full-text title search, category & subtype filters, external PDF / FlipHTML5 links |
| Blog | `blog.html` | Featured story + two article cards |
| Contact | `contact.html` | Phone/LINE, service area, consultation form that **generates and copies** a message; no backend |

Additional static article pages (accessible from the Blog index):

- `blog-wallpaper-vs-paint.html` — ติดวอลเปเปอร์หรือทาสี
- `blog-printing-wallpaper.html` — วอลเปเปอร์ภาพพิมพ์
- `blog-repair-wallpaper.html` — ซ่อมวอลเปเปอร์

### eCatalog links in `js/catalogs.js`

| Catalog | Book cover | Link destination |
|---|---|---|
| Andante | `assets/book-andante.webp` | DECCO original PDF from user |
| **No. 5** | `assets/book-no5.webp` | **Correct NO.5 DECCO PDF (replaces mis-matched Texture II URL)** |
| Square Garden | `assets/book-square-garden.webp` | DECCO original PDF from user |
| SPC Click-Lock 4.0 mm | `assets/book-spc4.webp` | FlipHTML5 `/ieqni/nyoy/` |
| LVT Glue-Down 3.0 mm | `assets/book-lvt3.webp` | FlipHTML5 `/ieqni/gxiu/` |
| SPC Click-Lock 9.0 mm | `assets/book-spc9.webp` | FlipHTML5 `/ieqni/ikxp/` |

No SKU-level material database. Catalog metadata are only the six book covers, names, material categories, and external URLs.

## Deploy to GitHub Pages

1. Create or choose your repository, e.g. `facewall-website`.
2. Extract this ZIP locally. Upload **the contents** (not the containing ZIP) directly to the repo root. Make sure `index.html` is at the root.
3. Commit to `main`.
4. Open **Settings → Pages → Deploy from a branch → main / (root) → Save**.
5. Wait for the deployment, then visit `https://YOUR-USERNAME.github.io/facewall-website/`.
6. `href` and image paths are relative; they work in GitHub Pages project repositories.

To preview locally, open `index.html` in a browser or run a local web server (`python3 -m http.server 8000` from the extracted folder), then visit `http://localhost:8000/`.

## Manage content before WordPress migration

- Contact, LINE OA and future name: `js/config.js`.
- eCatalog covers and URL mappings: `js/catalogs.js`.
- Layout and brand palette: `css/style.css` (`--coral` etc.).
- Main copy and sections: the five root HTML pages.
- Blog text: each `blog-*.html` article.
- Replace demo comparisons: locate `assets/room-before.svg` and `assets/room-illustration.svg` in `showcase.html` and `index.html`, then use matching aspect-ratio BEFORE and AFTER photos from the **same viewpoint**.
- Logo: `assets/logo-white.png`, extracted from the selected FACEWALL CI; artwork has a transparent background. Adjust all header/footer logo images and SEO titles together if renaming.

## Recommended WordPress implementation

- Pages: Home, Showcase, eCatalog, Blog, Contact.
- Blog: WordPress **Posts** with categories, slugs, metadata and featured images. Convert the three standalone articles into Posts in the production CMS.
- Showcase: a **Projects Custom Post Type** with Before image, After image, project kind (`wallpaper` / `flooring`), description and tags. Until actual project images arrive, do not label these demo comparisons as real installations.
- eCatalog: a **Catalogs Custom Post Type** or manageable WordPress fields with **book cover, book title, category, style, external URL** only — not an SKU database. The frontend filter can be replaced by WP filters or fed by an exported JSON list.
- Contact: use a genuine secured form plugin or LINE integration if you want forms to submit. The current static form **does not send to FACEWALL**; it only makes a message and offers copy-to-clipboard. Add spam controls and privacy notice before collecting personal data on WordPress.
- Interactive HTML/CSS/JS can be ported into Elementor/custom theme components, but this ZIP is not an installable WordPress theme. A WordPress conversion is still required.

## Brand and demo notes

- Branding: FACEWALL (WALLPAPER & FLOORING), orange/white CI; design direction Editorial Premium × Bold Creative.
- Working contact: LINE `@proface` is a **temporary** business channel approved for use in this draft. Phone `096-110-8841`. Facebook display name `Facewall Flooring` only: verified direct Page URL **not supplied**, so no guessed URL is used.
- Service area: Bangkok and surrounding metropolitan provinces. Free consultation and site measurement are copied from user-provided business messaging; final booking conditions should be checked before launch.
- The hero desktop/mobile, Wallpaper showcase banner and all six catalog cover images are based on **user-provided files** and are encoded as lightweight WebP.
- Before/After slider currently uses a *paired illustration concept from Draft 01*, not a photo of a real installed project. Clearly labeled Demo on screen.
- No catalog files are bundled: book cover taps lead to publishers' external PDFs/FlipHTML5; external links require connectivity and publisher availability.
- Blog drafts are adapted from the provided brand overview PDF and **need editorial/technical approval before publishing**. Do not automatically publish old pricing, 3-day installation promises, or claims about universal cleaning/resistance properties.
- For the GitHub Pages draft, **all pages contain `<meta name="robots" content="noindex,nofollow">`**. Remove it on the actual WordPress site once content/SEO are approved, and add canonicals, sitemap, site verification, etc.
- CSS requests Google Fonts when online; safe system-font fallbacks apply otherwise.
- The site does not have a WordPress backend, live inventory, checkout, upload endpoint, or server-side submission.

## Files

```
index.html
showcase.html
catalog.html
blog.html
contact.html
blog-wallpaper-vs-paint.html
blog-printing-wallpaper.html
blog-repair-wallpaper.html
css/style.css
js/config.js
js/catalogs.js
js/site.js
assets/ (logo, favicon, hero desktop/mobile, sample images & 6 book covers)
.nojekyll
README.md
```
