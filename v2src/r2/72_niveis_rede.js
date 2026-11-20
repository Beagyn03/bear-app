// Níveis do enredo na comunidade (Bia, 17/11): a avaliação publicada leva os níveis; a página do livro mostra a média de
// quem avaliou (bolinhas 1–5 e nº de votos); na Buscar, atalhos "Muito suspense", "Muito romance"… com a lista de livros.
S.nvBook = S.nvBook || {};
{ const st = document.createElement('style'); st.textContent = `
.nv-term{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.75rem .85rem;margin:0 0 .8rem;display:grid;gap:.4rem}
.nv-term .nv-h{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}.nv-term .nv-h b{font-size:.95rem}.nv-term .nv-h small{font-size:.75rem;color:var(--ink-2);font-weight:700}
.nv-term .nv-r{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:.5rem;font-size:.84rem;font-weight:800;color:var(--ink)}
.nv-term .nv-r small{font-size:.7rem;color:var(--ink-2);font-weight:700;min-width:3.6em;text-align:right}
.nv-term .nv-dots i{width:9px;height:9px}
.nv-term .nv-empty{font-size:.82rem;color:var(--ink-2);margin:0}
.nv-dots{display:inline-flex;gap:2px}.nv-dots i{width:7px;height:7px;border-radius:50%;background:var(--line)}.nv-dots i.on{background:var(--acc)}
.nv-chips{display:flex;gap:.45rem;flex-wrap:wrap;margin:.2rem 0 .2rem}
.nv-chips button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .9rem;font:inherit;font-weight:800;font-size:.86rem}`; TR.append(st); }
const NV_NOME = Object.fromEntries(NIVEIS);
// 1) publicar: a avaliação leva os níveis; se a API ainda não conhecer o campo (400), reenvia sem ele
{ const _pr = publishReview; let nivFor = null;
  publishReview = async function (b) { await new Promise((ok) => setTimeout(ok, 0)); /* deixa o salvar dos níveis (bloco 70) rodar antes */ const rv = (b && b.review) || null; nivFor = rv && rv.niveis && Object.keys(rv.niveis).length ? rv.niveis : null; try { return await _pr.apply(this, arguments); } finally { nivFor = null; } };
  const _sa = sapi;
  sapi = async function (method, path, body) {
    if (method === 'PUT' && /^\/v1\/reviews\/[^/]+$/.test(path) && body && typeof body === 'object' && nivFor && S.nivApiOk !== false) {
      const r = await _sa.call(this, method, path, { ...body, niveis: nivFor });
      if (r && r.status === 400) { S.nivApiOk = false; return _sa.call(this, method, path, body); }
      return r;
    }
    return _sa.apply(this, arguments);
  }; }
// 2) página do livro: níveis de quem avaliou
async function nvBookData(title) {
  const k = rsKey(title), c = S.nvBook[k]; if (c && Date.now() - c.at < 10 * 60000) return c.d;
  if (!connected()) return null;
  try { const r = await sapi('GET', '/v1/niveis/book?title=' + encodeURIComponent(String(title).slice(0, 200))); if (r.status !== 200 || !r.data) return null; S.nvBook[k] = { d: r.data, at: Date.now() }; return r.data; } catch { return null; }
}
function nvTermHTML(d) {
  const it = (d.items || []).filter((x) => NV_NOME[x.k]);
  if (!it.length) return '<div class="nv-h"><b>Níveis do enredo</b></div><p class="nv-empty">Ninguém marcou ainda. Ao avaliar, conte quanto o livro tem de romance, suspense, hot…</p>';
  const tot = Math.max(...it.map((x) => x.n));
  return '<div class="nv-h"><b>Níveis do enredo</b><small>quem avaliou</small></div>'
    + it.slice(0, 8).map((x) => '<div class="nv-r"><span>' + esc(NV_NOME[x.k]) + '</span>' + nivDots(Math.round(x.avg)) + '<small>' + plural(x.n, 'voto', 'votos') + '</small></div>').join('');
}
// 3) Buscar: atalhos por elemento
const NV_ATALHOS = [['suspense', 'Muito suspense'], ['romance', 'Muito romance'], ['hot', 'Muito hot'], ['terror', 'Muito terror'], ['choro', 'Me fez chorar'], ['plot', 'Cheio de reviravoltas']];
async function openNivelList(k, title) {
  const v = $('#shelflist'); closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page');
  const shell = (body) => { v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back" data-own="1">‹ Voltar</button><b>' + esc(title) + '</b><span></span></div>' + body;
    v.querySelector('.sl-back').addEventListener('click', () => { try { openCatalog(); } catch { v.hidden = true; } }); };
  shell('<p class="sl-empty">Carregando…</p>'); v.hidden = false; v.scrollTop = 0;
  let items = []; try { const r = await sapi('GET', '/v1/niveis?k=' + encodeURIComponent(k) + '&min=4'); items = r.status === 200 && r.data ? r.data.items || [] : []; } catch {}
  shell('<p class="hint" style="margin:.2rem 0 0">Livros em que os leitores do Livroverso marcaram ' + esc((NV_NOME[k] || k).toLowerCase()) + ' nível 4 ou 5.</p>'
    + (items.length ? '<div class="rs-list">' + items.map((b) => '<button type="button" class="es-bk" data-book="' + esc(b.title) + '" data-author="' + esc(b.author || '') + '">' + cvh(b.title, b.cover, 'es-cv') + '<small>' + esc(b.title) + '<br>' + nivDots(Math.round(b.avg)) + ' ' + plural(b.n, 'voto', 'votos') + '</small></button>').join('') + '</div>'
      : '<p class="sl-empty">Ainda não tem votos suficientes. Quando as pessoas avaliarem marcando os níveis do enredo, os livros aparecem aqui.</p>'));
  try { paintCv(v); } catch {}
}
{ const v = $('#shelflist'); let tm = 0;
  const fill = async () => {
    const body = v.querySelector('.sl-body'); if (!body || v.hidden) return;
    const rs = body.querySelector('.rs-term');
    if (rs && S.rsTitle && !body.querySelector('.nv-term')) {
      const box = document.createElement('div'); box.className = 'nv-term'; box.innerHTML = '<div class="nv-h"><b>Níveis do enredo</b></div><p class="nv-empty">Carregando…</p>'; rs.after(box);
      const t = S.rsTitle, d = await nvBookData(t);
      if (!box.isConnected || t !== S.rsTitle) return;
      if (!d) { box.remove(); return; }
      box.innerHTML = nvTermHTML(d);
    }
    const ch0 = body.querySelector('.rs-chips');
    if (ch0 && !body.querySelector('.nv-chips')) {
      const ch = document.createElement('div'); ch.className = 'nv-chips'; ch.innerHTML = NV_ATALHOS.map(([k, n]) => '<button type="button" data-nvk="' + k + '">' + esc(n) + '</button>').join(''); ch0.after(ch);
      ch.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => openNivelList(b.dataset.nvk, b.textContent)));
    }
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fill, 90); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
// 4) avaliação aberta para ler (rt-view): mostra os níveis marcados embaixo da nota (a folha troca de modo sem reabrir)
{ let tm = 0; const paint = () => { document.querySelectorAll('body > .sheet.rt-view .rv-paws').forEach((pw) => {
      const wrap = pw.closest('.sheet'); if (wrap.querySelector('.nv-view')) return;
      const t = (wrap.querySelector('.rtf-info b') || {}).textContent || ''; const e = lib().find((x) => x.title === t); if (!e) return;
      const nv = ((reviewOfLib(e) || {}).niveis) || {}, ks = NIVEIS.filter(([k]) => nv[k] > 0); if (!ks.length) return;
      const sum = document.createElement('div'); sum.className = 'nv-sum nv-view'; sum.style.cssText = 'justify-content:center;margin:.2rem 0 .4rem';
      sum.innerHTML = ks.map(([k, n]) => '<span class="nv-tag">' + esc(n) + nivDots(nv[k]) + '</span>').join(''); pw.after(sum); }); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 60); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); }
