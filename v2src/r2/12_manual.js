// Cadastro manual de livro mais completo: título, autor, páginas, ano, editora, ISBN, gênero, idioma, capa (foto ou link) e sinopse.
{ const st = document.createElement('style'); st.textContent = `
.sheet.mb2 .box{max-height:88vh;overflow:auto}
.sheet.mb2 .form{gap:.5rem}
.sheet.mb2 .mb-row{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}
.sheet.mb2 select,.sheet.mb2 textarea{width:100%;font:inherit}
.sheet.mb2 .mb-cv{display:flex;gap:.6rem;align-items:center}
.sheet.mb2 .mb-cv img{width:48px;height:72px;object-fit:cover;border-radius:3px 6px 6px 3px;background:#ddd;flex:none}
.sheet.mb2 .mb-cv .mb-cvb{display:flex;flex-direction:column;gap:.3rem;flex:1}
.sheet.mb2 .mb-btns{display:grid;grid-template-columns:auto 1fr;gap:.5rem;align-items:center}.sheet.mb2 .mb-btns .cancel{margin:0;padding:0 1rem}
.sheet.mb2 .mb-opt{font-weight:400;opacity:.7}
.sheet.mb2 .mb-cv img[style*=hidden]{display:none}
.sheet.mb2 .mb-cvb .cancel{border:1px dashed currentColor!important;border-radius:12px;min-height:42px;margin:0}
.sheet.mb2 textarea{background:rgba(255,255,255,.7)!important}
`; document.head.append(st); }
manualBookSheet = function (onPick) {
  const el = (tag, props = {}, kids = []) => { const e = document.createElement(tag); for (const [k, v] of Object.entries(props)) { if (k === 'text') e.textContent = v; else if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); } kids.forEach((c) => e.append(c)); return e; };
  const close = () => wrap.remove();
  const inp = (n, a = {}) => el('input', { name: n, ...a });
  const lab = (l, child, opt) => { if (opt && child.tagName !== 'SELECT' && !child.getAttribute('placeholder')) child.setAttribute('placeholder', 'Opcional'); return el('label', {}, [el('span', { text: l }), child]); };
  const genre = el('select', { name: 'genre' }, [el('option', { value: '', text: 'Opcional' }), ...GENRES.map(([g]) => el('option', { value: g, text: g }))]);
  const lang = el('select', { name: 'lang' }, [['pt', 'Português'], ['en', 'Inglês'], ['es', 'Espanhol'], ['', 'Outro']].map(([v, t]) => el('option', { value: v, text: t })));
  let cover = null;
  const prev = el('img', { alt: '' }), file = el('input', { type: 'file', accept: 'image/*', hidden: '' }), link = inp('coverUrl', { type: 'url', placeholder: 'ou cole o link da imagem' });
  const pick = el('button', { type: 'button', class: 'cancel', text: 'Escolher foto da capa', onclick: () => file.click() });
  const setPrev = (u) => { cover = u || null; prev.src = u || ''; prev.style.visibility = u ? 'visible' : 'hidden'; }; setPrev(null);
  file.addEventListener('change', () => { const f = file.files && file.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { const im = new Image(); im.onload = () => {
    const w = 300, h = Math.round(w * (im.height / im.width)), c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h); setPrev(c.toDataURL('image/jpeg', 0.8)); link.value = ''; }; im.src = r.result; }; r.readAsDataURL(f); });
  link.addEventListener('change', () => { const u = link.value.trim(); if (/^https:\/\//.test(u)) setPrev(u); else if (!u) setPrev(null); });
  const desc = el('textarea', { name: 'desc', rows: '3', maxlength: '1500', placeholder: 'Do que o livro trata' });
  const form = el('form', { class: 'form' }, [
    el('h3', { text: 'Cadastrar livro' }),
    lab('Título', inp('title', { required: '', maxlength: '200' })),
    lab('Autor', inp('author', { maxlength: '120' }), true),
    el('div', { class: 'mb-row' }, [lab('Páginas', inp('pages', { type: 'number', min: '1', inputmode: 'numeric' })), lab('Ano', inp('year', { type: 'number', min: '1000', max: '2100', inputmode: 'numeric' }), true)]),
    el('div', { class: 'mb-row' }, [lab('Gênero', genre, true), lab('Idioma', lang)]),
    el('div', { class: 'mb-row' }, [lab('Editora', inp('pub', { maxlength: '80' }), true), lab('ISBN', inp('isbn', { maxlength: '17', inputmode: 'numeric' }), true)]),
    el('div', {}, [el('span', { text: 'Capa (opcional)' }), el('div', { class: 'mb-cv' }, [prev, el('div', { class: 'mb-cvb' }, [pick, link])]), file]),
    lab('Sinopse', desc, true),
    el('div', { class: 'mb-btns' }, [el('button', { type: 'button', class: 'cancel', text: 'Cancelar', onclick: close }), el('button', { type: 'submit', class: 'primary', text: 'Continuar' })]),
  ]);
  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); const d = new FormData(form);
    const title = String(d.get('title') || '').trim(); if (!title) return;
    const isbn = String(d.get('isbn') || '').replace(/[^0-9Xx]/g, '') || null;
    const extra = { genre: String(d.get('genre') || '') || null, lang: String(d.get('lang') || '') || null, pub: String(d.get('pub') || '').trim() || null, year: String(d.get('year') || '').trim() || null, desc: String(d.get('desc') || '').trim() || null };
    const before = new Set(lib().map((e) => e.id)); close();
    onPick({ title, author: String(d.get('author') || '').trim() || null, totalPages: Number(d.get('pages')) || null, ...(isbn ? { isbn } : {}), ...(cover ? { cover, coverUrl: cover } : {}) });
    // o livro só entra depois de escolher onde guardar: espera ele aparecer e completa os dados
    let n = 0; const fill = () => { const e = lib().find((x) => !before.has(x.id) && x.title === title); if (!e) return ++n < 120 && setTimeout(fill, 500);
      if (extra.genre) e.genre = extra.genre; if (cover && !e.cover) e.cover = cover; if (isbn && !e.isbn) e.isbn = isbn;
      e.meta = { ...(e.meta || {}), desc: extra.desc, cat: extra.genre, lang: extra.lang, pub: extra.pub, date: extra.year, src: 'Cadastro manual', at: todayISO() };
      save(); try { refresh(); } catch {} };
    setTimeout(fill, 300);
  });
  const wrap = el('div', { class: 'sheet mb2', onclick: (ev) => { if (ev.target === wrap) close(); } }, [el('div', { class: 'box' }, [form])]);
  document.body.append(wrap); form.querySelector('input').focus();
};
