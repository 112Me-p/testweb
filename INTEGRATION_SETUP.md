# FACEWALL — Google Sheets + LINE OA lead integration

This package is **ready for connection**, not connected to a live Google account until you perform the steps below. The lead form runs on GitHub Pages; the Google Apps Script Web App receives a POST and appends a row in Google Sheets; afterwards the customer clicks to open LINE OA with a prepared message and must tap **Send** in LINE.

## 1. Prepare Google Sheets

1. Download `FACEWALL_Lead_Tracker_GoogleSheets.xlsx` (provided separately in this conversation).
2. Upload it to your Google Drive; open with **Google Sheets**, not just the Excel viewer. Keep the sheet private to your staff.
3. Verify sheet tab **Leads** exists, and row 1 contains 23 headings, from `Lead ID` through `หมายเหตุฝ่ายขาย`.
4. From Google Sheets open **Extensions → Apps Script**.
5. Replace the default `Code.gs` with this site's `integration/Code.gs`.
6. Save; select `setupLeadSheet` from the function dropdown, click **Run** once and approve access. This creates a filter and freezes header columns.

## 2. Deploy a Web App

1. In Apps Script click **Deploy → New deployment → Web app**.
2. **Execute as**: Me (the Google account owning the Sheet).
3. **Who has access**: Anyone (required for customers using an unauthenticated public web form).
4. Authorize requested scopes; copy the deployed **Web app URL ending in `/exec`**.
5. Edit `js/config.js` of the website ZIP and set:

```javascript
leadWebAppUrl: 'https://script.google.com/macros/s/DEPLOYMENT_ID/exec',
```

6. Upload the updated website contents to the root of the existing GitHub repository. Do not put OAuth credentials, API keys, service-account JSON, Sheet sharing tokens, or other secrets in the static site.

When changing the Apps Script source later, select **Deploy → Manage deployments → Edit** and deploy a new version. The active `/exec` deployment points to the deployed version, not your unsaved editor.

## 3. Test end-to-end with test data only

1. On the published website, open `contact.html`, enter dummy test details, and select more than one product using `+ เพิ่มประเภทงาน`.
2. Tick the consent checkbox and click **บันทึกข้อมูลและดำเนินการต่อใน LINE**.
3. Verify the website displays a unique lead reference `FW-YYYYMMDD-XXXXXXXX` *after* a server acknowledgement.
4. In Google Sheets → **Leads**, confirm a new row: `Lead Source = WEBSITE`, products, individual material columns, and `LINE Chat Status = รอส่ง LINE`.
5. Click **เปิด LINE เพื่อกดส่ง** and **tap Send in LINE** to deliver the customer message. The LINE chat contains the same lead reference.
6. Manually change `LINE Chat Status` to `ลูกค้าส่ง LINE แล้ว` only after your team confirms an actual message arrived. The website does not know whether the LINE message was sent.
7. If the acknowledgement fails or times out, confirm whether the row was saved before retrying, to avoid duplicate Leads.

## Important behavior and limitations

- Saving in Sheets and delivering a LINE message are **different actions**. The first is server-confirmed via Apps Script; the second requires the visitor to send in LINE.
- The LINE URI works primarily on mobile. The site also provides a **Copy message** fallback.
- The script creates only `WEBSITE` leads. Future LINE OA collection (LINE Messaging API webhook / LIFF) can populate `Lead Source = LINE OA`, `LINE User ID`, and `LINE Message ID` once connected and authorized. **This is not active yet.**
- Google Apps Script Web Apps configured for public access are public HTTP endpoints. The included checks (field limits, honeypot, basic 25-second throttle and per-submission ID) reduce casual spam but **are not strong protection**. Monitor abuse; for higher volume add CAPTCHA and a managed backend.
- Website assets still contain demo Before/After, and no invented customer reviews or real-project photos. Populate `js/projects.js` only with approved real work.
- Before going live with genuine customer information, review a privacy notice, data retention policy, and permission controls; only authorized FACEWALL team members should access the Google Sheet.
- If your account has restrictions on public Apps Script deployments, you may need Workspace admin approval or another serverless endpoint.

## Site content updates included in this edition

- Lead form: name/phone, multiple material selectors, area/location/details, consent, server acknowledgement, LINE deep link.
- Dashboard-style Google Sheets template with sources WEBSITE / LINE OA / MANUAL, sales-status dropdowns and summary formulas.
- Sticky Mobile Consultation CTA, How We Work 4-step section, stronger Hero service description, light section reveal motions.
- Three basic educational articles: SPC, Vinyl/LVT, Carpet.
- Service terms section, and verified-only project/review rendering infrastructure (`js/projects.js`). These sections only populate after real content is supplied.

**Preview status:** Staging code retains `noindex`. This is intentional while deployment/domain are undecided. WordPress is not required.
