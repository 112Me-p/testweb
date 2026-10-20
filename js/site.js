(() => {
  'use strict';
  const $ = (s, base = document) => base.querySelector(s);
  const $$ = (s, base = document) => [...base.querySelectorAll(s)];
  const toast = (message) => {
    const node = $('#toast'); if (!node) return;
    node.textContent = message; node.classList.add('show');
    clearTimeout(toast.handle); toast.handle = setTimeout(() => node.classList.remove('show'), 3500);
  };
  const navButton = $('#menu-toggle'), nav = $('#site-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', () => {
      const expanded = navButton.getAttribute('aria-expanded') === 'true';
      navButton.setAttribute('aria-expanded', String(!expanded));
      navButton.setAttribute('aria-label', expanded ? 'เปิดเมนู' : 'ปิดเมนู');
      nav.classList.toggle('open', !expanded);
    });
    $$('.nav-link', nav).forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); navButton.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {nav.classList.remove('open'); navButton.setAttribute('aria-expanded', 'false');}
    });
  }
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('is-visible'); obs.unobserve(entry.target);}
    }), {threshold: 0.07});
    $$('.reveal').forEach(node => obs.observe(node));
  } else {$$('.reveal').forEach(node => node.classList.add('is-visible'));}

  // Accessible native range controls allow mouse, touch and keyboard operation.
  $$('[data-compare]').forEach(container => {
    const slider = $('input[type=range]', container);
    if (!slider) return;
    const update = () => container.style.setProperty('--split', `${slider.value}%`);
    slider.addEventListener('input', update); slider.addEventListener('change', update); update();
  });

  const caseFilters = $$('#showcase-filters [data-case-filter]');
  if (caseFilters.length) {
    const cases = $$('.showcase-card[data-case]');
    caseFilters.forEach(button => button.addEventListener('click', () => {
      const active = button.dataset.caseFilter;
      caseFilters.forEach(b => { b.classList.toggle('is-selected', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      cases.forEach(c => c.hidden = active !== 'all' && c.dataset.case !== active);
    }));
  }

  const grid = $('#catalog-grid');
  if (grid) {
    const catalogs = window.FACEWALL_CATALOGS || [];
    const search = $('#catalog-search'), subtype = $('#catalog-subtype'), count = $('#catalog-count'), empty = $('#catalog-empty');
    const buttons = $$('[data-catalog-category]');
    const urlCategory = new URLSearchParams(location.search).get('category');
    let category = ['wallpaper','flooring'].includes(urlCategory) ? urlCategory : 'all';
    const setButtonState = () => buttons.forEach(b => {
      const active = b.dataset.catalogCategory === category;
      b.classList.toggle('is-selected', active); b.setAttribute('aria-pressed', String(active));
    });
    const render = () => {
      const term = (search.value || '').toLocaleLowerCase('th').trim();
      const filterType = subtype.value;
      const results = catalogs.filter(c => {
        const categoryOK = category === 'all' || c.category === category;
        const subtypeOK = filterType === 'all' || c.subType === filterType;
        const searchOK = !term || `${c.title} ${c.family} ${c.caption} ${c.tags}`.toLocaleLowerCase('th').includes(term);
        return categoryOK && subtypeOK && searchOK;
      });
      // All values below are from a locally-owned, fixed metadata list.
      grid.replaceChildren(...results.map(c => {
        const article = document.createElement('article');
        const isWallpaper = c.category === 'wallpaper';
        article.className = isWallpaper ? 'catalog-card catalog-card--wallpaper' : 'catalog-card';
        const link = document.createElement('a'); link.href = c.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `เปิด PDF / eCatalog ${c.title} ${c.caption} ในแท็บใหม่`);
        const cover = document.createElement('div'); cover.className = isWallpaper ? 'catalog-cover catalog-cover--dicut' : 'catalog-cover';
        const img = document.createElement('img'); img.src = c.image; img.alt = c.alt; img.loading = 'lazy';
        img.decoding = 'async';
        if (isWallpaper) {
          const overlay = document.createElement('div'); overlay.className = 'wallpaper-cover-meta';
          const meta = document.createElement('span'); meta.className = 'wallpaper-cover-family'; meta.textContent = 'WALLPAPER / PDF ↗';
          const name = document.createElement('h3'); name.textContent = c.title;
          const open = document.createElement('span'); open.className = 'wallpaper-cover-open'; open.textContent = 'OPEN CATALOG ↗';
          overlay.append(meta,name,open); cover.append(img,overlay); link.append(cover);
        } else {
          const tag = document.createElement('span'); tag.className = 'catalog-cover-tag'; tag.textContent = c.family;
          cover.append(img,tag);
          const info = document.createElement('div'); info.className = 'catalog-info';
          const family = document.createElement('span'); family.textContent = 'FLOORING COLLECTION';
          const name = document.createElement('h3'); name.textContent = c.title;
          const caption = document.createElement('p'); caption.textContent = c.caption;
          const open = document.createElement('div'); open.className = 'catalog-open'; open.innerHTML = '<span>VIEW CATALOG</span><span aria-hidden="true">↗</span>';
          info.append(family,name,caption,open); link.append(cover,info);
        }
        article.append(link);
        return article;
      }));
      count.textContent = `${results.length.toString().padStart(2,'0')} COLLECTION${results.length===1?'':'S'}`;
      empty.hidden = results.length !== 0;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.catalogCategory;
      if (category === 'wallpaper' && !['all','wallpaper'].includes(subtype.value)) subtype.value = 'all';
      if (category === 'flooring' && subtype.value === 'wallpaper') subtype.value = 'all';
      setButtonState(); render();
      const url = new URL(location.href);
      if (category === 'all') url.searchParams.delete('category'); else url.searchParams.set('category',category);
      history.replaceState(null,'',url.pathname+url.search);
    }));
    search.addEventListener('input',render);
    subtype.addEventListener('change', () => {
      if (subtype.value === 'wallpaper') category = 'wallpaper';
      if (['spc','lvt'].includes(subtype.value)) category = 'flooring';
      setButtonState(); render();
    });
    $('#clear-catalog')?.addEventListener('click',()=>{
      search.value = ''; subtype.value = 'all'; category='all'; setButtonState();render();
    });
    setButtonState();render();
  }

  const inquiryForm = $('#inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!inquiryForm.reportValidity()) return;
      const data = new FormData(inquiryForm);
      const val = name => (data.get(name) || '').toString().trim();
      const msg = ['สวัสดีครับ/ค่ะ FACEWALL ขอปรึกษางานตกแต่งผนังและพื้น',
        `ชื่อผู้ติดต่อ: ${val('name')}`,
        `เบอร์ติดต่อ: ${val('phone') || 'ไม่ได้ระบุ'}`,
        `ประเภทงาน: ${val('type')}`,
        `พื้นที่ติดตั้ง: ${val('place') || 'ไม่ได้ระบุ'}`,
        `พื้นที่โดยประมาณ: ${val('area') || 'ไม่ได้ระบุ'}`,
        `รายละเอียดเพิ่มเติม: ${val('message') || 'ไม่ได้ระบุ'}`].join('\n');
      $('#inquiry-preview').value = msg;
      $('#inquiry-result').hidden = false;
      $('#inquiry-result').scrollIntoView({block:'nearest',behavior:'smooth'});
      toast('จัดเตรียมข้อความแล้ว กรุณาคัดลอกเพื่อส่งผ่าน LINE');
    });
    $('#copy-inquiry')?.addEventListener('click', async () => {
      const text = $('#inquiry-preview').value;
      try {
        if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
        else { const el = $('#inquiry-preview');el.focus();el.select();document.execCommand('copy'); }
        toast('คัดลอกข้อความแล้ว เปิด LINE เพื่อส่งให้ทีมงาน');
      } catch(err) {toast('คัดลอกอัตโนมัติไม่ได้ กรุณาเลือกและคัดลอกข้อความด้วยตนเอง');}
    });
  }
})();
