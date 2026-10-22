/**
 * FACEWALL Lead Receiver for Google Sheets
 * 1. Open the imported FACEWALL Lead Tracker in Google Sheets.
 * 2. Extensions -> Apps Script; paste this file into Code.gs.
 * 3. Set deployment as Web app: Execute as ME, access Anyone.
 * 4. Paste /exec deployment URL into js/config.js of the website.
 * Does NOT send a LINE message. LINE opens separately so the customer can tap Send.
 */
const FW_SHEET_NAME = 'Leads';
const FW_HEADERS = [
  'Lead ID','วันที่รับข้อมูล','Lead Source','ชื่อลูกค้า','เบอร์โทร',
  'สินค้าที่สนใจ','Wallpaper','SPC','Vinyl / LVT','Carpet',
  'สถานที่ / เขตพื้นที่','พื้นที่โดยประมาณ','รายละเอียดเพิ่มเติม',
  'LINE Chat Status','Sales Status','Priority','ผู้รับผิดชอบ',
  'ติดต่อล่าสุด','ติดตามครั้งถัดไป','LINE User ID','LINE Message ID',
  'ยินยอมใช้ข้อมูล','หมายเหตุฝ่ายขาย'
];
const FW_ALLOWED_PRODUCTS = ['Wallpaper','SPC','Vinyl / LVT','Carpet'];

function doGet() {
  return ContentService.createTextOutput('FACEWALL Lead API is active. Submit via POST.');
}

function doPost(e) {
  const p = (e && e.parameter) || {};
  const nonce = String(p.request_id || '').slice(0, 80);
  try {
    if (String(p.website || '').trim()) return response_({ok:false, error:'Rejected', nonce});
    const name = text_(p.name, 120);
    const phone = text_(p.phone, 30);
    const products = String(p.products || '').split('|').map(x => x.trim()).filter(x => FW_ALLOWED_PRODUCTS.indexOf(x) >= 0);
    const unique = [...new Set(products)];
    if (!name || !/^[0-9+()\-\s]{8,30}$/.test(phone) || !unique.length || p.consent !== 'yes') {
      return response_({ok:false, error:'Invalid form data', nonce});
    }
    // Simple per-number throttle. Use a stronger CAPTCHA/WAF if form spam increases.
    const cache = CacheService.getScriptCache();
    const seen = nonce && cache.get('req:'+nonce);
    if (seen) return response_({ok:true, leadId:seen, nonce});
    const phoneKey = 'phone:'+phone.replace(/\D/g,'');
    if (cache.get(phoneKey)) return response_({ok:false,error:'กรุณารอสักครู่ก่อนส่งซ้ำ', nonce});
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return response_({ok:false,error:'ระบบกำลังรับข้อมูลจำนวนมาก',nonce});
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!ss) throw new Error('No bound Google Sheet');
      let sheet = ss.getSheetByName(FW_SHEET_NAME);
      if (!sheet) throw new Error('Sheet Leads not found. Import the template first.');
      // Validate schema so data never silently enters incorrect columns.
      const current = sheet.getRange(1,1,1,FW_HEADERS.length).getDisplayValues()[0];
      if (current.join('|') !== FW_HEADERS.join('|')) throw new Error('Lead sheet columns do not match template');
      const leadId = 'FW-' + Utilities.formatDate(new Date(),'Asia/Bangkok','yyyyMMdd') + '-' + Utilities.getUuid().replace(/-/g,'').slice(0,8).toUpperCase();
      const now = Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd HH:mm:ss');
      const row = [leadId, now, 'WEBSITE',name,phone,unique.join(' + '),
        unique.includes('Wallpaper')?'✓':'',unique.includes('SPC')?'✓':'',
        unique.includes('Vinyl / LVT')?'✓':'',unique.includes('Carpet')?'✓':'',
        text_(p.place,150),text_(p.area,80),text_(p.detail,1200),
        'รอส่ง LINE','ลูกค้าใหม่','ปกติ','','','','','','ใช่',''];
      // Text format prevents leading 0 from disappearing from phone numbers.
      const target = sheet.getLastRow()+1;
      sheet.getRange(target,1,1,FW_HEADERS.length).setNumberFormat('@').setValues([row]);
      if (nonce) cache.put('req:'+nonce,leadId,1800);
      cache.put(phoneKey,'1',25);
      return response_({ok:true, leadId, nonce});
    } finally { lock.releaseLock(); }
  } catch (err) {
    console.error('FACEWALL lead error:', err);
    return response_({ok:false,error:'ไม่สามารถบันทึกข้อมูลได้ กรุณาติดต่อทาง LINE',nonce});
  }
}

function text_(value, maxLen) {
  const s = String(value || '').trim().slice(0,maxLen);
  // Prevent formula injection into Sheets from untrusted form input.
  return /^[=+\-@]/.test(s) ? "'"+s : s;
}

function response_(obj) {
  // Apps Script HtmlService is framed so website can receive a POST acknowledgement.
  // Only nonce + save state/leadId are returned, never customer personal data.
  const payload = JSON.stringify({channel:'FACEWALL_LEADS', ...obj}).replace(/</g,'\\u003c');
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body>'+
    '<script>window.top.postMessage('+payload+',"*");<\\/script>'+ // escaped delimiter for source templating
    '<p>FACEWALL request processed. Return to the website.</p></body></html>';
  // NB correct script end tag needed; normalize escaped marker.
  return HtmlService.createHtmlOutput(html.replace('<\\/script>','</script>'))
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function setupLeadSheet() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(FW_SHEET_NAME);
  if (!sh) throw new Error('Leads sheet missing');
  sh.setFrozenRows(1);
  sh.setFrozenColumns(3);
  if (!sh.getFilter()) sh.getRange(1,1,sh.getMaxRows(),FW_HEADERS.length).createFilter();
  SpreadsheetApp.getActiveSpreadsheet().setSpreadsheetTimeZone('Asia/Bangkok');
}
