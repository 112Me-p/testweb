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

  const ARROW_NE = `<svg class="ui-arrow" xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11"/></svg>`;
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
        article.className = 'catalog-card catalog-card--dicut';
        const link = document.createElement('a');
        link.href = c.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
        const destination = c.category === 'wallpaper' ? 'PDF' : 'eCatalog FlipHTML5';
        link.setAttribute('aria-label', `เปิด ${destination} ${c.title} ในแท็บใหม่`);
        const cover = document.createElement('div'); cover.className = 'catalog-cover catalog-cover--dicut';
        const img = document.createElement('img'); img.src = c.image; img.alt = c.alt;
        img.loading = 'lazy'; img.decoding = 'async';
        const overlay = document.createElement('div'); overlay.className = 'wallpaper-cover-meta';
        const meta = document.createElement('span'); meta.className = 'wallpaper-cover-family';
        meta.textContent = c.category === 'wallpaper' ? 'WALLPAPER / PDF' : c.family + ' / FLIPBOOK';
        const name = document.createElement('h3'); name.textContent = c.title;
        const open = document.createElement('span'); open.className = 'wallpaper-cover-open';
        open.textContent = 'VIEW CATALOG';
        open.insertAdjacentHTML('beforeend', ARROW_NE);
        overlay.append(meta, name, open); cover.append(img,overlay);link.append(cover);article.append(link);
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


  // Render only verified, approved FACEWALL installations. No fabricated projects or reviews.
  const verifiedProjects = window.FACEWALL_REAL_PROJECTS || [];
  const realProjectsGrid = document.querySelector('#real-projects-grid');
  if (realProjectsGrid && verifiedProjects.length) {
    document.querySelector('#real-projects').hidden = false;
    for (const p of verifiedProjects) {
      if (!p.title || !p.image || !p.description || !p.category) continue;
      const article = document.createElement('article');article.className='real-project-card';
      const img=document.createElement('img');img.src=p.image;img.alt=p.title;img.loading='lazy';
      const info=document.createElement('div');info.className='real-project-info';
      const badge=document.createElement('small');badge.textContent=p.category.toUpperCase()+' • '+(p.location||'');
      const name=document.createElement('h3');name.textContent=p.title;
      const material=document.createElement('p');material.textContent='วัสดุ: '+(p.products||'สอบถามรายละเอียด');
      const desc=document.createElement('p');desc.textContent=p.description;
      const ask=document.createElement('a');ask.href='contact.html?project='+encodeURIComponent(p.title);ask.textContent='สนใจงานสไตล์นี้ ↗';
      info.append(badge,name,material,desc);
      if (p.review?.quote && p.review?.approved === true) {
        const block=document.createElement('blockquote');block.textContent='“'+p.review.quote+'”';info.append(block);
      }
      info.append(ask);article.append(img,info);realProjectsGrid.append(article);
    }
  }
})();
