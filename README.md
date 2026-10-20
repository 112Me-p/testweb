# FACEWALL Draft 03 — GitHub Pages preview

Front-end prototype only (HTML/CSS/JS), **not a WordPress theme**. This release can be uploaded over the same GitHub Pages repository that hosted Draft 02; **replace files rather than nesting the ZIP folder**.

## What's updated in Draft 03

- Home: replaced desktop/mobile hero photography; Wallpaper Solutions card uses the supplied warm minimal bedroom image.
- Home: moved the complete **WHY FACEWALL / Details make the difference** section immediately after **OUR SOLUTIONS**. Sequence: 01 Our Solutions, 02 Why Facewall, unnumbered About, 03 Before/After, 04 Material Library, 05 Journal.
- Home and Showcase: Before/After uses the newly supplied paired concept images for Wallpaper; Flooring demo remains unchanged. All demo visuals are explicitly identified as concepts, not actual completed installations.
- Home Material Library: transparent Andante book cover, matching the transparent Wallpaper catalog theme. Flooring card retains its existing treatment.
- eCatalog Wallpaper: **3 curated books only** — Andante, No. 5, Square Garden — with transparent original cut-out assets, minimal title overlay and direct links to verified DECCO PDFs in a new tab. The 3 Flooring catalogs continue to link to FlipHTML5.
- The previous Blog and Contact pages remain available. Contact uses the temporary LINE OA `@proface`, phone `096-110-8841` and serves Bangkok and surrounding provinces.

## Update your EXISTING GitHub Pages repository

1. Download the ZIP file and extract it locally.
2. Open your **existing** repository on GitHub (same repository and Pages URL as Draft 02).
3. Upload the extracted folders and files (`index.html`, `css/`, `js/`, `assets/`, other `.html` files) **to the repository root**, replacing matching files. Keep folder structure unchanged.
4. Commit the replacement. If Pages is published from `main` root, it will deploy automatically. Refresh with a hard reload if the old style persists.
5. Existing HTML files, paths and navigation are preserved; **there is no need to create another repo**.

A simple 'Upload files' in the GitHub browser can add/replace most files, but it may not remove assets that were deleted in prior versions. This ZIP contains the full functioning site; if using git CLI, you can sync folder contents and commit for a clean update.

## Layout

- `index.html` — Home
- `showcase.html` — Before / After gallery
- `catalog.html` — eCatalog
- `blog.html` — Journal
- `blog-*.html` — 3 articles
- `contact.html` — Contact
- `css/style.css` — responsive UI + Draft 03 design adjustments
- `js/site.js` — filters, comparison slider, menu, lead inquiry preview
- `js/catalogs.js` — book metadata and publisher URLs; **not a product database**
- `assets/*-d03.webp` — optimized uploaded imagery
- `assets/book-*-dicut.webp` — original transparent Wallpaper cover art optimized for web

## Notes

- GitHub Pages is a design preview. The final WordPress site will require page templates, forms and CMS integration separately.
- 'Demo' Before/After visuals are placeholders/concepts, not proof of customer work.
- The inquiry form creates copyable LINE inquiry text; it does not submit to a server.
- `noindex,nofollow` is intentionally used for prototype HTML; remove/set appropriate SEO settings when going live on WordPress.
- PDF URLs link to DECCO's website, which may change in the future. No PDF copyrighted content is rehosted in this ZIP.
