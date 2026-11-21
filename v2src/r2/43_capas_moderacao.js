// Capa corrigida pela moderação (16/11): vale para todo mundo. A API guarda por título normalizado (covKey);
// o app troca a capa nas estantes (menos de quem escolheu outra edição: e.coverOwn), na busca e no que mostra.
const COVM = { map: new Map(), admin: false, at: 0 };
const covKey = (t) => normT(String(t || '').split(/[:(]/)[0]).slice(0, 200);
// (21/11) a troca vale para o livro certo: título E autor. Cada item guarda { c: capa, a: autor normalizado ('' se a troca não tem autor).
// Autor comparado pelo 1º nome da lista (antes de vírgula/&/" e "). Sem autor na troca: na busca, vale só para o autor mais
// comum daquele título entre os resultados; onde não se sabe o autor do livro (cvh sem autor), vale como antes.
const covA = (a) => normT(String(a || '').split(/,|&| e | and /)[0]);
const covVal = (v) => (v && typeof v === 'object' ? { c: v.c, a: v.a || '' } : { c: v, a: '' });
const covSave = () => { try { localStorage.setItem('bear.covers', JSON.stringify({ v: 2, items: [...COVM.map], admin: COVM.admin, at: COVM.at })); } catch {} };
function covOv(title, author, fallbackA) {
  const v = COVM.map.get(covKey(title)); if (!v) return null; const o = covVal(v);
  if (author == null || author === '') return o.a && fallbackA != null ? (o.a === fallbackA ? o.c : null) : o.c;
  const a = covA(author);
  if (o.a) return a && (a === o.a || a.includes(o.a) || o.a.includes(a)) ? o.c : null;
  return fallbackA == null || a === fallbackA ? o.c : null;
}
try { const c = JSON.parse(localStorage.getItem('bear.covers') || 'null'); if (c && Array.isArray(c.items)) { COVM.map = new Map(c.items.map(([k, v]) => [k, covVal(v)])); COVM.admin = !!c.admin; COVM.at = c.v === 2 ? (c.at || 0) : 0; } } catch {}
function applyCovers() {
  if (!COVM.map.size) return; let n = 0;
  for (const e of lib()) { if (e.coverOwn) continue; const ov = covOv(e.title, e.author || null); if (ov && e.cover !== ov) { e.cover = ov; n++; } }
  if (n) { save(); try { refresh(); } catch {} }
}
async function loadCovers(force) {
  if (!connected() || (!force && Date.now() - COVM.at < 30 * 60000)) return applyCovers();
  try {
    const r = await sapi('GET', '/v1/covers'); if (r.status !== 200 || !r.data) return;
    COVM.map = new Map((r.data.items || []).map((x) => [x.key, { c: x.cover, a: covA(x.author) }])); COVM.admin = !!r.data.admin; COVM.at = Date.now();
    covSave();
    applyCovers();
  } catch {}
}
setTimeout(() => loadCovers(), 2500); setInterval(() => loadCovers(), 30 * 60000);
// (Bia, 21/11) na busca a troca só vale para o mesmo autor (ver covOv); edições de outros autores ficam com a capa delas
// folha da moderação: escolher uma capa das edições encontradas ou colar o link de uma imagem
async function modCoverSheet(x) {
  if (!COVM.admin) return toast('Só a moderação troca a capa para todo mundo');
  const title = String(x.title || ''), author = x.author || null, key = covKey(title), cur = COVM.map.has(key) ? covVal(COVM.map.get(key)).c : null;
  const wrap = document.createElement('div'); wrap.className = 'sheet';
  wrap.innerHTML = `<div class="box"><form class="form"><h3></h3><p class="hint">A capa escolhida passa a aparecer para todo mundo: nas estantes, na busca e nos perfis. Quem escolheu outra edição continua com a dela.</p>
    <div class="mc-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;max-height:46vh;overflow:auto;padding:.2rem"><p class="hint" style="grid-column:1/-1">Procurando capas…</p></div>
    <label>Ou cole o link de uma imagem<input name="url" inputmode="url" placeholder="https://…" autocomplete="off" spellcheck="false"></label>
    <p class="hint mc-msg" style="color:var(--danger,#b4442c)"></p>
    <button type="submit" class="primary">Usar este link</button>${cur ? '<button type="button" class="mc-undo">Voltar à capa original</button>' : ''}<button type="button" class="cancel">Cancelar</button></form></div>`;
  const f = wrap.querySelector('form'), grid = wrap.querySelector('.mc-grid'), msg = wrap.querySelector('.mc-msg');
  f.querySelector('h3').textContent = `Capa de “${title}”`;
  const close = () => wrap.remove();
  wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); }); f.querySelector('.cancel').addEventListener('click', close);
  const put = async (cover) => {
    msg.textContent = 'Salvando…';
    const r = await sapi('PUT', '/v1/admin/cover', { key, title: title.slice(0, 200), author: author ? String(author).slice(0, 120) : null, cover });
    if (r.status !== 200) { msg.textContent = r.status === 404 ? 'Sua conta não é de moderação.' : 'Não consegui salvar. Tente de novo.'; return; }
    COVM.map.set(key, { c: cover, a: covA(author) }); covSave();
    const mine = lib().find((e) => covKey(e.title) === key && (!author || !e.author || covA(e.author) === covA(author))); if (mine) delete mine.coverOwn;
    applyCovers(); close(); toast('Capa trocada para todo mundo');
  };
  f.addEventListener('submit', (ev) => { ev.preventDefault(); const u = String(new FormData(f).get('url') || '').trim(); if (!/^https:\/\/\S+$/.test(u)) { msg.textContent = 'Cole um link que comece com https://'; return; } put(u); });
  f.querySelector('.mc-undo')?.addEventListener('click', async () => {
    const r = await sapi('DELETE', '/v1/admin/cover', { key }); if (r.status !== 200) { msg.textContent = 'Não consegui desfazer agora.'; return; }
    COVM.map.delete(key); covSave();
    close(); toast('Capa original de volta (para quem adicionar daqui para frente)');
  });
  document.body.append(wrap);
  let res = []; try { res = await searchBooks(title + (author ? ' ' + String(author).split(',')[0] : '')); } catch {}
  const seen = new Set(), covers = res.map((it) => it.coverUrl).filter((u) => u && /^https:/.test(u) && !seen.has(u) && seen.add(u)).slice(0, 16);
  grid.innerHTML = covers.length ? covers.map((u, i) => `<button type="button" data-i="${i}" style="border:2px solid ${u === cur ? 'var(--acc)' : 'transparent'};border-radius:8px;padding:0;background:none;aspect-ratio:2/3;overflow:hidden"><img src="${esc(u)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></button>`).join('')
    : '<p class="hint" style="grid-column:1/-1">Não achei outras capas. Cole o link de uma imagem.</p>';
  grid.querySelectorAll('button[data-i]').forEach((b) => b.addEventListener('click', () => put(covers[Number(b.dataset.i)])));
}
// A capa corrigida vale em qualquer lugar (perfil de outra pessoa, Rede, catálogo), não só na própria estante (16/11).
// Quem escolheu outra edição para o próprio livro (coverOwn) continua vendo a dela.
{ const _cvh = cvh; cvh = function (title, coverUrl, cls, style) {
  try {
    // cvh não recebe o autor: usa o do livro na Biblioteca com o mesmo título e a mesma capa, se houver; sem saber, vale como antes
    if (COVM.map.size) { const k = covKey(title), mineE = lib().find((e) => covKey(e.title) === k && (!coverUrl || e.cover === coverUrl)) || null;
      const ov = covOv(title, mineE ? mineE.author || null : null);
      if (ov && ov !== coverUrl) { const own = lib().find((e) => e.coverOwn && covKey(e.title) === k && e.cover === coverUrl); if (!own) coverUrl = ov; } }
  } catch {}
  return _cvh.call(this, title, coverUrl, cls, style);
}; }
