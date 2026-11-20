// Organizar meu perfil com ORDEM (Bia, 17/11): cada bloco da página (Números, Leituras por mês, Top 5, Lidos recentes,
// Estantes, Conquistas, Avaliações) pode subir/descer e ser mostrado ou escondido. Guardado em db.prefs.profOrder / profHide.
const PROF_BLOCKS = [['nums', 'Números'], ['ys', 'Leituras por mês'], ['top5', 'Top 5'], ['recent', 'Lidos recentes'], ['shelves', 'Estantes'], ['ach', 'Conquistas'], ['reviews', 'Avaliações']];
const PROF_PRIV = { shelves: 'shelf', ach: 'achievements', reviews: 'reviews' }; // estes também valem para quem visita
const profOrder = () => { const o = ((db.prefs && db.prefs.profOrder) || []).filter((k) => PROF_BLOCKS.some(([x]) => x === k)); for (const [k] of PROF_BLOCKS) if (!o.includes(k)) o.push(k); return o; };
const profKeyOf = (el) => {
  if (el.classList.contains('yo-nums')) return 'nums';
  if (el.matches('section.ys') || /^Leituras por m/.test(el.textContent.trim())) return 'ys';
  const t = (el.classList.contains('v3-sh') ? el : el.querySelector('.v3-sh') || el).textContent.trim();
  if (el.classList.contains('t5-h') || /^(Top 5|Melhores avaliados)/.test(t)) return 'top5';
  if (/^Lidos recentes/.test(t)) return 'recent';
  if (/^Conquistas/.test(t)) return 'ach';
  if (/^(Minhas resenhas|Avaliações|Resenhas)/.test(t)) return 'reviews';
  return 'shelves';
};
{ let tm = 0; const apply = () => {
    const v = $('#shelflist'); if (!v || v.hidden || !v.classList.contains('mine-page')) return; const body = v.querySelector('.sl-body'); if (!body) return;
    const head = body.querySelector(':scope > header.yo-top'); if (!head) return;
    const kids = [...body.children]; const i0 = kids.indexOf(head) + 1; const blocks = []; let cur = null;
    for (const el of kids.slice(i0)) { const starts = el.classList.contains('yo-nums') || el.tagName === 'SECTION' || el.classList.contains('v3-sh');
      if (starts || !cur) { cur = { k: profKeyOf(el), els: [el] }; blocks.push(cur); } else cur.els.push(el); }
    if (!blocks.length) return;
    const order = profOrder(), hide = (db.prefs && db.prefs.profHide) || {};
    const sorted = [...blocks].sort((a, b) => order.indexOf(a.k) - order.indexOf(b.k));
    const same = sorted.every((b, i) => b === blocks[i]);
    if (!same) for (const b of sorted) for (const el of b.els) body.append(el);
    for (const b of blocks) if (!PROF_PRIV[b.k]) for (const el of b.els) el.style.display = hide[b.k] ? 'none' : '';
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(apply, 70); }).observe(TR, { childList: true, subtree: true }); }
// a lista com ordem dentro de "Organizar meu perfil"
{ const st = document.createElement('style'); st.textContent = `.po-list{display:grid;gap:.35rem;margin:.2rem 0 .4rem}
.po-it{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:.45rem;border:1px solid var(--line);border-radius:12px;padding:.35rem .5rem;background:var(--panel)}
.po-it label{display:flex;align-items:center;gap:.45rem;font-size:.86rem;font-weight:800;color:var(--ink);margin:0}
html .po-it button{width:32px!important;height:32px!important;min-height:0!important;border-radius:9px!important;border:1px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important;font:inherit!important;font-weight:900!important;padding:0!important;box-shadow:none!important}
html .po-it button:disabled{opacity:.3}`; document.head.append(st); }
{ const _sss = socialSettingsSheet; socialSettingsSheet = async function (mode) {
    const r = await _sss.apply(this, arguments);
    try {
      if (mode !== 'perfil') return r;
      const f = [...document.querySelectorAll('body > .sheet form.pv2')].pop(); if (!f) return r;
      const privCk = (txt) => { const l = [...f.querySelectorAll('label.ck-row')].find((x) => x.textContent.trim().startsWith(txt)); return l ? l.querySelector('input') : null; };
      const pmap = { shelves: privCk('Estantes'), ach: privCk('Conquistas'), reviews: privCk('Avaliações') };
      for (const k of Object.keys(pmap)) if (pmap[k]) pmap[k].closest('label').style.setProperty('display', 'none', 'important');
      const shSel = f.querySelector('details.pv2-sh'); // escolher estantes fica logo abaixo da lista
      let order = profOrder(); const hide = { ...((db.prefs && db.prefs.profHide) || {}) };
      const box = document.createElement('div'); box.className = 'po-list';
      const on = (k) => pmap[k] ? pmap[k].checked : !hide[k];
      const draw = () => { box.innerHTML = order.map((k, i) => '<div class="po-it" data-k="' + k + '"><label><input type="checkbox"' + (on(k) ? ' checked' : '') + '> ' + esc(PROF_BLOCKS.find(([x]) => x === k)[1]) + '</label><span></span><button type="button" data-d="-1"' + (i === 0 ? ' disabled' : '') + ' aria-label="Subir">↑</button><button type="button" data-d="1"' + (i === order.length - 1 ? ' disabled' : '') + ' aria-label="Descer">↓</button></div>').join('');
        box.querySelectorAll('.po-it').forEach((row) => { const k = row.dataset.k;
          row.querySelector('input').addEventListener('change', (ev) => { if (pmap[k]) { pmap[k].checked = ev.target.checked; pmap[k].dispatchEvent(new Event('change')); } else { if (ev.target.checked) delete hide[k]; else hide[k] = true; } });
          row.querySelectorAll('button[data-d]').forEach((b) => b.addEventListener('click', () => { const i = order.indexOf(k), j = i + Number(b.dataset.d); if (j < 0 || j >= order.length) return; [order[i], order[j]] = [order[j], order[i]]; draw(); })); }); };
      draw();
      const lendo = privCk('Lendo agora'); const anchor = lendo ? lendo.closest('label') : f.querySelector('h3');
      const tt = document.createElement('div'); tt.className = 'group'; tt.textContent = 'Blocos da página (ordem e o que aparece)';
      anchor.after(tt); tt.after(box); if (shSel) box.after(shSel);
      f.addEventListener('submit', () => { db.prefs = { ...(db.prefs || {}), profOrder: order, profHide: hide }; save(); });
    } catch (err) { console.warn('ordem do perfil', err); }
    return r;
  }; }
