# Internal validation summary

- All JavaScript files passed `node --check`.
- Mocked Google Apps Script POST accepted a valid multi-product (Wallpaper + SPC) test Lead, produced source `WEBSITE`, status `รอส่ง LINE` and a reference number, and returned a message acknowledgement.
- Spreadsheet Dashboard formulas checked: no Excel formula error matches.
- This is **not** an end-to-end test against a real Google Sheet or real LINE OA. A Google owner must deploy the Apps Script Web App and test that the iframe acknowledgement is accepted by the actual browser.
- Browser-based visual tests could not be completed inside this environment (Chromium blocked local/file navigation by administrator); manual iOS/Android check is mandatory.
- Actual customer reviews, installation photographs and guarantee terms still require owner-approved source data. These have not been fabricated.
