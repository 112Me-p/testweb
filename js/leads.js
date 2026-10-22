(() => {
  'use strict';
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  const config = window.FACEWALL_CONFIG || {};
  const endpoint = (config.leadWebAppUrl || '').trim();
  const productsNode = document.getElementById('product-choices');
  const addButton = document.getElementById('add-product');
  const result = document.getElementById('inquiry-result');
  const status = document.getElementById('lead-status');
  const lineButton = document.getElementById('lead-line-link');
  const preview = document.getElementById('inquiry-preview');
  const submitButton = document.getElementById('lead-submit');
  const itemChoices = ['Wallpaper','SPC','Vinyl / LVT','Carpet'];
  let processing = false;
  const ARROW = '<svg class="ui-arrow" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11"/></svg>';
  function makeProductRow(index) {
    const row = document.createElement('div');
    row.className = 'lead-product-row';
    const select = document.createElement('select');
    select.name = 'product[]'; select.required = true;
    select.setAttribute('aria-label','ประเภทงานที่สนใจ '+(index+1));
    select.append(new Option('เลือกวัสดุที่สนใจ',''));
    itemChoices.forEach(item => select.append(new Option(item,item)));
    row.append(select);
    if (index > 0) {
      const remove = document.createElement('button');
      remove.type='button';remove.className='lead-remove';remove.textContent='นำออก';
      remove.addEventListener('click',()=>{row.remove();addButton.disabled=false;});
      row.append(remove);
    }
    return row;
  }
  productsNode.append(makeProductRow(0));
  addButton.addEventListener('click',()=>{
    if (productsNode.children.length>=itemChoices.length) return;
    productsNode.append(makeProductRow(productsNode.children.length));
    addButton.disabled=productsNode.children.length>=itemChoices.length;
  });
  function collect() {
    const data = new FormData(form);
    const val = key => (data.get(key)||'').toString().trim();
    const products = [...new Set(data.getAll('product[]').map(x=>x.toString().trim()).filter(Boolean))];
    return {name:val('name'),phone:val('phone'),products,place:val('place'),area:val('area'),detail:val('message'),consent:data.get('consent')==='yes'};
  }
  function formatLine(v,leadId) {
    return [
      'FACEWALL | ขอคำปรึกษางานผนังและพื้น',
      'รหัสคำขอ: '+(leadId || 'ส่งจากเว็บไซต์ (ยังไม่มีเลขอ้างอิง)'),
      'ชื่อ: '+v.name,
      'โทร: '+v.phone,
      'ประเภทงาน: '+v.products.join(' + '),
      'พื้นที่ติดตั้ง: '+(v.place||'ยังไม่ระบุ'),
      'ขนาดพื้นที่: '+(v.area||'ยังไม่ระบุ'),
      'รายละเอียด: '+(v.detail||'ยังไม่ระบุ'),
      'รบกวนทีมงาน FACEWALL ติดต่อกลับด้วยครับ/ค่ะ'
    ].join('\n');
  }
  function lineUrl(message) {
    return 'https://line.me/R/oaMessage/%40proface/?'+encodeURIComponent(message);
  }
  function showLine(v,id,caption) {
    const msg = formatLine(v,id);
    preview.value = msg;
    lineButton.href = lineUrl(msg);
    status.textContent = caption;
    result.hidden = false;
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  document.getElementById('copy-inquiry')?.addEventListener('click',async()=>{
    try {await navigator.clipboard.writeText(preview.value);status.textContent='คัดลอกข้อความแล้ว กรุณาเปิด LINE และกดส่ง';}
    catch {preview.focus();preview.select();status.textContent='กรุณาคัดลอกข้อความที่เลือกด้วยตนเอง';}
  });
  form.addEventListener('submit',(event)=>{
    event.preventDefault();
    if (processing || !form.reportValidity()) return;
    const v=collect();
    if (v.products.length===0) return;
    const phone=v.phone.replace(/\s/g,'');
    if (!/^[0-9+()\-]{8,30}$/.test(phone)) {status.textContent='กรุณาตรวจสอบเบอร์โทร';result.hidden=false;return;}
    const nonce=(self.crypto&&crypto.randomUUID)?crypto.randomUUID():'fw'+Date.now()+Math.random().toString(36).slice(2);
    if (!endpoint || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(endpoint)) {
      showLine(v,'','ยังไม่ได้เชื่อม Google Sheets: สามารถส่งข้อความผ่าน LINE ได้ก่อน แต่ข้อมูลยังไม่ถูกบันทึกลง Sheets');
      return;
    }
    processing=true;submitButton.disabled=true;submitButton.textContent='กำลังบันทึกข้อมูล...';
    let timer;
    const frame=document.createElement('iframe');
    frame.name='fw_lead_'+Date.now();frame.title='Lead submission status';frame.style.display='none';
    document.body.append(frame);
    const pending=document.createElement('form');
    pending.method='POST';pending.action=endpoint;pending.target=frame.name;pending.style.display='none';
    const fields={...v,request_id:nonce,products:v.products.join('|'),website:'',consent:'yes',detail:v.detail};
    Object.entries(fields).forEach(([key,value])=>{
      if (Array.isArray(value) || typeof value==='boolean')return;
      const input=document.createElement('input');input.type='hidden';input.name=key;input.value=String(value);
      pending.append(input);
    });
    document.body.append(pending);
    const cleanup=()=>{
      clearTimeout(timer);window.removeEventListener('message',onMessage);
      setTimeout(()=>{frame.remove();pending.remove();},800);
      processing=false;submitButton.disabled=false;submitButton.innerHTML='บันทึกข้อมูลและดำเนินการต่อใน LINE '+ARROW;
    };
    const onMessage=event=>{
      const p=event.data||{};
      if (p.channel!=='FACEWALL_LEADS'||p.nonce!==nonce) return;
      // Only Google Apps Script HTML responses should be accepted.
      const origin=new URL(event.origin).hostname;
      if (origin!=='script.google.com' && !origin.endsWith('.googleusercontent.com') && origin!=='script.googleusercontent.com') return;
      cleanup();
      if(p.ok){
        showLine(v,p.leadId,'บันทึกลง Google Sheets แล้ว เลขอ้างอิง '+p.leadId+' — โปรดกดเปิด LINE และกดส่งข้อความอีกครั้ง');
      } else {
        showLine(v,'','ยังยืนยันการบันทึก Google Sheets ไม่สำเร็จ: '+(p.error||'กรุณาลองใหม่')+' — สามารถส่ง LINE ได้');
      }
    };
    window.addEventListener('message',onMessage);
    timer=setTimeout(()=>{
      cleanup();showLine(v,'','ยังไม่ได้รับการยืนยันจาก Google Sheets โปรดตรวจสอบ Sheet ก่อนส่งซ้ำ — คุณยังสามารถส่ง LINE ได้');
    },18000);
    try{pending.submit();}catch(err){cleanup();showLine(v,'','เกิดข้อผิดพลาดในการเชื่อม Google Sheets กรุณาส่งผ่าน LINE');}
  });
})();
