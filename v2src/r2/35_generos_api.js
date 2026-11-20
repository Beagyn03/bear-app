// Gênero pelo servidor (15/11, API 016): o catálogo da bear-api diz o gênero do livro (sem gastar a cota do Google no
// aparelho); o app informa os gêneros da estante (PUT /v1/books/genres) e o Em alta ganha filtro por gênero.
// Também: "Sair da conta" no menu lateral.
{ const _eg = ensureGenres; let busy = false;
  ensureGenres = async function (max = 6) {
    if (busy) return; busy = true; let changed = false;
    try {
      const todo = (db.library || []).filter((e) => !e.genre && !e.genreApi).slice(0, max);
      for (const e of todo) {
        e.genreApi = true; changed = true;
        const isbn = String(e.isbn || '').replace(/[^0-9Xx]/g, '');
        let g = null;
        if (isbn.length === 10 || isbn.length === 13) { const b = await getJSON(`${catBase()}/v1/books/isbn/${isbn}`, 12000); g = b && b.genre; }
        if (!g) { const d = await getJSON(`${catBase()}/v1/books/search?limit=10&q=${encodeURIComponent(`${e.title} ${String(e.author || '').split(',')[0]}`.trim().slice(0, 120))}`, 12000);
          const want = normT(e.title), hit = d && Array.isArray(d.items) && d.items.find((b) => b.genre && (normT(b.title) === want || normT(b.title).startsWith(want) || want.startsWith(normT(b.title)))); g = hit && hit.genre; }
        if (g && GENRES.some((x) => x[0] === g)) { e.genre = g; e.genreAuto = true; }
      }
      if (changed) save();
    } catch (err) { console.warn('gênero', err); } finally { busy = false; }
    try { await _eg(max); } catch {} // o que o servidor não soube: Google direto do aparelho, como antes
    setTimeout(reportGenres, 1500);
  };
}
let genreReportBusy = false;
async function reportGenres() { // manda ao servidor os gêneros ainda não enviados (escolha manual conta como do leitor)
  if (genreReportBusy || !connected() || !socialProfile) return;
  const L = (db.library || []).filter((e) => e.genre && e.genre !== 'Outro' && e.title && e.genreSent !== e.genre + (e.genreAuto ? '' : '!')).slice(0, 100);
  if (!L.length) return; genreReportBusy = true;
  try {
    const r = await sapi('PUT', '/v1/books/genres', { items: L.map((e) => ({ title: String(e.title).slice(0, 200), genre: e.genre, ...(e.genreAuto ? {} : { manual: true }) })) });
    if (r.status === 200) { L.forEach((e) => { e.genreSent = e.genre + (e.genreAuto ? '' : '!'); }); save(); }
  } catch {} finally { genreReportBusy = false; }
}
setTimeout(reportGenres, 8000); setInterval(reportGenres, 10 * 60000);
// ---------- Em alta por gênero ----------
{ const st = document.createElement('style'); st.textContent = `
.tr-gen{display:flex;gap:.3rem;overflow-x:auto;scrollbar-width:none;margin:-.1rem 0 .5rem}.tr-gen::-webkit-scrollbar{display:none}
.tr-gen button{flex:none;border:1px dashed var(--line);background:none;color:var(--ink-2);border-radius:999px;padding:.28rem .7rem;font:inherit;font-weight:700;font-size:.72rem}
.tr-gen button.on{border-style:solid;border-color:var(--acc);color:var(--acc);background:var(--panel)}
`; TR.append(st); }
S.trG = S.trG || null;
loadTrends = function (force) {
  if (!connected() || !socialProfile) return;
  const g = S.trG || '';
  if (!force && S.trends && (S.trends.g || '') === g && Date.now() - S.trends.at < 5 * 60000) return;
  if (S.trBusy) return; S.trBusy = true;
  sapi('GET', '/v1/trends' + (g ? '?genre=' + encodeURIComponent(g) : '')).then((r) => { if (r.status === 200 && r.data) { S.trends = { ...r.data, at: Date.now(), g }; if (r.data.genres) S.trGenres = r.data.genres;
      if (g && !(r.data[S.trTab] || []).length) { const k = ['app', 'topRated', 'friends'].find((x) => (r.data[x] || []).length); if (k) S.trTab = k; } // filtro: abre a aba que tem livro
      if (S.tab === 'comunidade') paintTrends(); } })
    .catch(() => {}).finally(() => { S.trBusy = false; if ((S.trG || '') !== g) loadTrends(); });
};
{ const _th = trendsHTML; trendsHTML = function () {
  const h = _th(), gs = (S.trGenres || []).map((x) => x.genre).filter((g) => GENRES.some((y) => y[0] === g));
  if (S.trG && !gs.includes(S.trG)) gs.unshift(S.trG);
  if (!gs.length) return h;
  const chips = `<div class="tr-gen" role="group" aria-label="Filtrar por gênero"><button type="button" data-trg="" class="${S.trG ? '' : 'on'}">Todos os gêneros</button>${gs.map((g) => `<button type="button" data-trg="${esc(g)}" class="${S.trG === g ? 'on' : ''}">${esc(g)}</button>`).join('')}</div>`;
  const filtered = S.trG && S.trends && (S.trends.g || '') === S.trG ? h.replace(/<p class="tr-empty">[^<]*<\/p>/, `<p class="tr-empty">Nada de ${esc(S.trG)} em alta agora.</p>`) : h;
  return filtered.replace('</div>', '</div>' + chips); // filtro logo abaixo das abas
}; }
{ const _pt = paintTrends; paintTrends = function () {
  const r = _pt.apply(this, arguments); const host = $('#lista #tr-host'); if (!host) return r;
  $$('[data-trg]', host).forEach((b) => b.addEventListener('click', () => { const g = b.dataset.trg || null; if (g === S.trG) return; S.trG = g; S.trends = null; paintTrends(); loadTrends(true); }));
  return r;
}; }
// ---------- "Para você": começa pelo que os leitores do Livroverso estão lendo nos seus gêneros ----------
const TASTE_TO_GENRE = { romance: 'Romance', contemporaneo: 'Romance', dark: 'Romance', romantasia: 'Fantasia', darkfantasy: 'Fantasia', fantasia: 'Fantasia', distopia: 'Ficção científica', ficcao: 'Ficção científica', suspense: 'Suspense e mistério', policial: 'Suspense e mistério', terror: 'Terror', historico: 'História', classicos: 'Clássicos', ya: 'Jovem adulto', poesia: 'Poesia', hq: 'HQ e mangá', biografia: 'Biografia', autoajuda: 'Autoajuda', negocios: 'Não ficção', ciencia: 'Não ficção' };
{ const _tr = tasteRecs; tasteRecs = async function () {
  const base = await _tr.apply(this, arguments);
  const t = tasteOf(); if (!t || !connected() || !socialProfile) return base;
  const gs = [...new Set((t.genres || []).map((k) => TASTE_TO_GENRE[k]).filter(Boolean))].slice(0, 3); if (!gs.length) return base;
  try {
    const rs = await Promise.all(gs.map((g) => sapi('GET', '/v1/trends?genre=' + encodeURIComponent(g)).catch(() => null)));
    const mine = new Set((lib() || []).map((e) => normT(e.title || ''))), seen = new Set(base.map((x) => normT(x.title))), top = [];
    for (const r of rs) { if (!r || r.status !== 200 || !r.data) continue; for (const x of [...(r.data.topRated || []), ...(r.data.app || [])]) { const k = normT(x.title); if (!k || mine.has(k) || seen.has(k)) continue; seen.add(k); top.push({ title: x.title, author: x.author || null, coverUrl: x.cover || null }); } }
    return [...top.slice(0, 8).map((x) => ({ ...x, fromApp: 1 })), ...base];
  } catch { return base; }
}; }
// ---------- "Sair da conta" no menu lateral ----------
{ const st = document.createElement('style'); st.textContent = `.drw .drw-out{color:#b3412e;margin-top:.2rem}.drw .drw-out svg{stroke:#b3412e}`; TR.append(st); }
function addDrawerOut() {
  const d = TR.querySelector('.drw');
  if (d && connected() && !d.querySelector('.drw-out')) {
    d.insertAdjacentHTML('beforeend', `<button type="button" class="drw-it drw-out"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M10 16l-4-4 4-4"/><path d="M6 12h10"/></svg>Sair da conta</button>`);
    d.querySelector('.drw-out').addEventListener('click', () => { closeDrawer(); logout(); });
  }
}
TR.addEventListener('click', (ev) => { if (ev.target.closest && ev.target.closest('#g-av')) setTimeout(addDrawerOut, 0); });
