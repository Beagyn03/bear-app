// Estantes no perfil (pedido da Bia, 15/11): em "Amigos e privacidade", "Escolher estantes" expande uma lista para ligar/desligar
// e ordenar as prateleiras que aparecem no perfil. Vai no resumo publicado (snapshot.shelf.show + snapshot.shelf.extra), sem mudar a API.
// Padrão (sem escolha): Melhores avaliados + Lidos recentes, como antes.
{ const st = document.createElement('style'); st.textContent = `
.sheet .pv2 details.pv2-sh{margin:-.1rem 0 .1rem 1.9rem;border:1px solid var(--line,#e5d9c8);border-radius:12px;background:var(--panel,#fffaf2)}
.sheet .pv2 details.pv2-sh summary{list-style:none;cursor:pointer;display:flex;justify-content:space-between;align-items:center;min-height:38px;padding:0 .7rem;font-size:.84rem;font-weight:800}
.sheet .pv2 details.pv2-sh summary::-webkit-details-marker{display:none}
.sheet .pv2 details.pv2-sh summary::after{content:'›';font-size:1.1rem;transition:transform .15s}.sheet .pv2 details.pv2-sh[open] summary::after{transform:rotate(90deg)}
.sheet .pv2 details.pv2-sh summary small{font-weight:600;opacity:.7;margin-left:auto;margin-right:.5rem}
.sheet .pv2 .pv2-shl{display:grid;padding:0 .4rem .4rem .7rem;max-height:13rem;overflow:auto}
.sheet .pv2 .pv2-shr{display:grid;grid-template-columns:auto 1fr auto auto;align-items:center;gap:.4rem;min-height:36px;font-size:.84rem}
.sheet .pv2 .pv2-shr small{opacity:.65;font-weight:600}
.sheet .pv2 .pv2-shr button{width:30px;height:30px;border-radius:8px;border:1px solid var(--line,#e5d9c8);background:transparent;color:inherit;font:inherit;font-weight:900;padding:0;margin:0}
.sheet .pv2 .pv2-shr button:disabled{opacity:.25}
`; document.head.append(st); }
const PROF_SH_DEFAULT = ['MELHORES', 'LIDOS'];
const profShelfOpts = () => {
  const L = lib(), n = (f) => L.filter(f).length;
  const base = [['MELHORES', 'Melhores avaliados', n((e) => e.status === 'LIDO' && ((reviewOfLib(e) || {}).paws || 0) >= 4.5)], ['LIDOS', 'Lidos recentes', n((e) => e.status === 'LIDO')],
    ['LENDO', 'Lendo', n((e) => e.status === 'LENDO')], ['QUERO', 'Quero ler', n((e) => e.status === 'QUERO')], ['FAV', shelfName('FAV'), n((e) => isFav(e))], ['ABANDONEI', 'Abandonados', n((e) => e.status === 'ABANDONEI')]];
  const mine = (db.shelves || []).map((s) => ['sh:' + s.id, s.name || 'Estante', (s.bookIds || []).filter((id) => L.some((e) => e.id === id)).length]);
  return [...base, ...mine];
};
const profShelfBooks = (key) => {
  const L = lib(), by = (k) => (a, b) => String(b[k] || '').localeCompare(String(a[k] || ''));
  if (key === 'LENDO') return L.filter((e) => e.status === 'LENDO');
  if (key === 'QUERO') return L.filter((e) => e.status === 'QUERO').sort((a, b) => ((a.prio || 2) - (b.prio || 2)) || by('addedAt')(a, b));
  if (key === 'FAV') return L.filter((e) => isFav(e));
  if (key === 'ABANDONEI') return L.filter((e) => e.status === 'ABANDONEI').sort(by('addedAt'));
  if (key.startsWith('sh:')) { const s = (db.shelves || []).find((x) => x.id === key.slice(3)); return s ? (s.bookIds || []).map((id) => L.find((e) => e.id === id)).filter(Boolean) : []; }
  return [];
};
const profShelfShow = () => { const p = db.prefs && db.prefs.profShelves; const ok = new Set(profShelfOpts().map((o) => o[0])); return (Array.isArray(p) ? p : PROF_SH_DEFAULT).filter((k) => ok.has(k)); };
// entra no resumo publicado (chamado por publishSnapshot)
function profShelvesSnap(snapshot) {
  const show = profShelfShow(), names = Object.fromEntries(profShelfOpts().map((o) => [o[0], o[1]]));
  const mini = (e) => ({ title: e.title, author: e.author || null, cover: e.cover && !/^data:/.test(e.cover) && e.cover.length < 600 ? e.cover : null });
  snapshot.shelf.show = show;
  snapshot.shelf.extra = show.filter((k) => !PROF_SH_DEFAULT.includes(k)).slice(0, 8).map((k) => ({ key: k, name: names[k], books: profShelfBooks(k).slice(0, 12).map(mini) }));
}
// "Amigos e privacidade": lista expansível
{ const _ss = socialSettingsSheet; socialSettingsSheet = async function () {
  const r = await _ss.apply(this, arguments);
  const form = document.querySelector('body > .sheet form.pv2'); if (!form || form.querySelector('.pv2-sh')) return r;
  const shelfCk = [...form.querySelectorAll('.ck-row')].find((x) => /^Estantes/.test(x.textContent.trim())); if (!shelfCk) return r;
  let sel = profShelfShow(); const opts = profShelfOpts();
  const det = document.createElement('details'); det.className = 'pv2-sh';
  const draw = () => {
    const order = [...sel, ...opts.map((o) => o[0]).filter((k) => !sel.includes(k))];
    det.innerHTML = `<summary>Escolher estantes<small>${sel.length ? sel.length + (sel.length === 1 ? ' no perfil' : ' no perfil') : 'nenhuma'}</small></summary><div class="pv2-shl">${order.map((k) => { const o = opts.find((x) => x[0] === k); const on = sel.includes(k), i = sel.indexOf(k);
      return `<label class="pv2-shr"><input type="checkbox" data-k="${esc(k)}" ${on ? 'checked' : ''}><span>${esc(o[1])} <small>${o[2]}</small></span><button type="button" data-up="${esc(k)}" aria-label="Subir" ${on && i > 0 ? '' : 'disabled'}>↑</button><button type="button" data-dn="${esc(k)}" aria-label="Descer" ${on && i < sel.length - 1 ? '' : 'disabled'}>↓</button></label>`; }).join('')}</div>`;
    det.querySelectorAll('input[data-k]').forEach((i) => i.addEventListener('change', () => { const k = i.dataset.k; sel = i.checked ? [...sel, k] : sel.filter((x) => x !== k); draw(); det.open = true; }));
    det.querySelectorAll('[data-up],[data-dn]').forEach((b) => b.addEventListener('click', (ev) => { ev.preventDefault(); const k = b.dataset.up || b.dataset.dn, i = sel.indexOf(k), j = b.dataset.up ? i - 1 : i + 1; if (i < 0 || j < 0 || j >= sel.length) return; [sel[i], sel[j]] = [sel[j], sel[i]]; draw(); det.open = true; }));
  };
  draw(); shelfCk.after(det);
  const sync = () => { det.hidden = !shelfCk.querySelector('input').checked; }; shelfCk.querySelector('input').addEventListener('change', sync); sync();
  form.addEventListener('submit', () => { db.prefs = { ...(db.prefs || {}), profShelves: sel }; save(); publishSnapshot(); setTimeout(() => { const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) openMyProfile(); }, 600); });
  return r;
}; }
// perfil (próprio e de amigo): mostra só as estantes escolhidas, na ordem escolhida
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h || !d.shelf) return r;
  const show = d.self ? profShelfShow() : d.shelf.show; if (!Array.isArray(show)) return r;
  const heads = [...v.querySelectorAll('.v3-sh')];
  const grab = (re) => { const hd = heads.find((x) => re.test(x.textContent.trim())); if (!hd) return null; const nx = hd.nextElementSibling; const frag = [hd]; if (nx && !nx.classList.contains('v3-sh')) frag.push(nx); return frag; };
  const parts = { MELHORES: grab(/^Melhores avaliados/), LIDOS: grab(/^Lidos recentes/) };
  const anchor = heads.find((x) => /^Avaliações/.test(x.textContent.trim())) || v.querySelector('.sl-empty');
  const ins = (nodes) => nodes.forEach((n) => (anchor ? anchor.before(n) : v.querySelector('.sl-body').append(n)));
  Object.values(parts).forEach((p) => p && p.forEach((n) => n.remove()));
  const strip = (arr) => `<div class="es-row">${arr.map((b) => `<button type="button" class="es-bk" data-book="${esc(b.title)}" data-author="${esc(b.author || '')}">${cvh(b.title, b.cover, 'es-cv')}</button>`).join('')}</div>`;
  const extra = d.self ? show.filter((k) => !PROF_SH_DEFAULT.includes(k)).map((k) => ({ key: k, name: (profShelfOpts().find((o) => o[0] === k) || [])[1], books: profShelfBooks(k).slice(0, 12).map((e) => ({ title: e.title, author: e.author, cover: e.cover })) })) : (d.shelf.extra || []);
  for (const k of show) {
    if (parts[k]) { ins(parts[k]); continue; }
    const x = extra.find((y) => y.key === k); if (!x || !x.books.length) continue;
    const t = document.createElement('template'); t.innerHTML = `<div class="v3-sh"><b>${esc(x.name || 'Estante')}</b></div>${strip(x.books)}`; ins([...t.content.childNodes]);
  }
  return r;
}; }
