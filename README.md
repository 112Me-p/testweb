# FACEWALL — Website Evolution / GitHub Pages

## Existing GitHub Repository

Unzip this package and upload **all files/folders INSIDE** it into the root of the existing FACEWALL GitHub Pages repository. `index.html` must remain at root. Commit the updated files. Do not upload the ZIP as one file.

The existing website will render normally without the Lead backend configured, but then the form will offer a LINE-only fallback, **not pretend to save to Google Sheets**.

See **INTEGRATION_SETUP.md** for deploying Google Apps Script and connecting the Google Sheets template.

## Pages

- Home `index.html`
- Before/After `showcase.html`
- eCatalog `catalog.html` (Wallpaper 10, Flooring 6)
- Journal `blog.html` (6 full articles)
- Contact `contact.html`

## Notes

- Google Sheets template is a separate download in the conversation; import into Google Sheets under your own account.
- No customer information is prepopulated in the template.
- The `Leads` sheet has placeholders for future `LINE OA` ingestion, not enabled in this version.
- Images and before/after in the existing Showcase may be demonstration images: do **not** represent them as installed projects by FACEWALL.
- New verified projects and testimonials are intentionally empty until real approved content arrives. Populate `js/projects.js` with permissioned materials only.
- LINE OA @proface and Facebook Page name Facewall Flooring remain interim data.
- `noindex` is intentionally kept for a staging website.
