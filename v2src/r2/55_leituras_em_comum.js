// Leituras em comum (Bia, 16/11): no perfil de outra pessoa, logo abaixo dos números (antes de Leituras por mês), um botão
// "Você e Fulana têm N leituras em comum, como …" que abre a página com as duas notas lado a lado e a compatibilidade literária.
{ const st = document.createElement('style'); st.textContent = `
.cm-btn{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;width:100%;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.65rem .8rem;margin:0 0 .9rem;color:var(--ink);font:inherit}
.cm-btn .cm-pc{font-style:normal;font-weight:900;font-size:1.15rem;color:var(--acc)}.cm-btn b{display:block;font-size:.88rem}.cm-btn small{font-size:.78rem;color:var(--ink-2)}
.cm-hd{display:grid;justify-items:center;text-align:center;gap:.2rem;margin:.3rem 0 1rem}.cm-hd .big{font-size:2.4rem;font-weight:900;color:var(--acc);line-height:1}.cm-hd small{color:var(--ink-2);font-size:.82rem;max-width:300px}
.cm-row{display:grid;grid-template-columns:44px 1fr 56px 56px;gap:.55rem;align-items:center;border-bottom:1px solid var(--line);padding:.5rem 0}
.cm-row .cv{width:44px;height:66px;border-radius:3px 5px 5px 3px;font-size:.42rem}.cm-row b{font-size:.86rem;line-height:1.25}
.cm-row .n{text-align:center;font-weight:900;font-size:.9rem}.cm-row .n small{display:block;font-size:.62rem;font-weight:800;color:var(--ink-2)}
.cm-row .n.eq{color:#2f8a52}
.cm-th{display:grid;grid-template-columns:44px 1fr 56px 56px;gap:.55rem;font-size:.7rem;font-weight:800;color:var(--ink-2);text-align:center}
`; TR.append(st); }
const cmKey = (t) => normT(String(t || '').split(/[:(]/)[0]);
function commonReads(d) {
  const mineL = new Map(lib().filter((e) => e.status === 'LIDO').map((e) => [cmKey(e.title), e]));
  const theirs = new Map();
  for (const b of (d.shelf && d.shelf.lidos) || []) { const k = cmKey(b.title); if (k && !theirs.has(k)) theirs.set(k, { title: b.title, cover: b.cover || null, p: 0 }); }
  for (const x of (d.shelf && d.shelf.ano) || []) { const k = cmKey(x.t); if (!k) continue; const o = theirs.get(k) || { title: x.t, cover: x.c || null, p: 0 }; if (x.p) o.p = x.p; if (!o.cover && x.c) o.cover = x.c; theirs.set(k, o); }
  for (const r of d.reviews || []) { const k = cmKey(r.title); if (k && theirs.has(k) && r.paws && !theirs.get(k).p) theirs.get(k).p = r.paws; }
  const out = [];
  for (const [k, o] of theirs) { const e = mineL.get(k); if (!e) continue; out.push({ title: e.title, cover: e.cover || o.cover, mine: (reviewOfLib(e) || {}).paws || 0, theirs: o.p || 0 }); }
  const both = out.filter((x) => x.mine && x.theirs), diff = both.length ? both.reduce((a, x) => a + Math.abs(x.mine - x.theirs), 0) / both.length : null;
  return { list: out, both: both.length, compat: diff == null ? null : Math.max(0, Math.round(100 - diff * 25)) }; // diferença média de 0 a 4 notas → 100% a 0%
}
function openCommonReads(d) {
  const v = $('#shelflist'), c = commonReads(d), nm = String(d.displayName || d.handle).split(' ')[0];
  const nt = (p) => (p ? String(p).replace('.', ',') : '–');
  v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back" data-own="1">‹ Voltar</button><b>Você e ${esc(nm)}</b><span></span></div>
    <div class="cm-hd">${c.compat != null ? `<span class="big">${c.compat}%</span><b>compatibilidade literária</b><small>pela diferença entre as notas de ${plural(c.both, 'livro que vocês avaliaram', 'livros que vocês avaliaram')}</small>` : `<b>${plural(c.list.length, 'leitura em comum', 'leituras em comum')}</b><small>A compatibilidade aparece quando vocês tiverem nota em pelo menos um livro em comum.</small>`}</div>
    <div class="cm-th"><span></span><span style="text-align:left">${plural(c.list.length, 'livro', 'livros')}</span><span>você</span><span>${esc(nm)}</span></div>
    ${c.list.map((x) => `<div class="cm-row">${cvh(x.title, x.cover, '')}<b>${esc(x.title)}</b><span class="n${x.mine && x.mine === x.theirs ? ' eq' : ''}">${nt(x.mine)}</span><span class="n${x.mine && x.mine === x.theirs ? ' eq' : ''}">${nt(x.theirs)}</span></div>`).join('')}`;
  try { paintCv(v); } catch {}
  v.querySelector('.sl-back').addEventListener('click', () => friendPage(d.handle));
  v.scrollTop = 0;
}
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData;
  try {
    if (v.hidden || !d || d.self || d.handle !== h || v.querySelector('.cm-btn')) return r;
    v.querySelectorAll('.fr-common').forEach((x) => x.remove());
    const c = commonReads(d); if (!c.list.length) return r;
    const nm = String(d.displayName || d.handle).split(' ')[0];
    const b = document.createElement('button'); b.type = 'button'; b.className = 'cm-btn';
    b.innerHTML = `<span><b>${c.compat != null ? `<em class="cm-pc">${c.compat}%</em> de compatibilidade literária` : `${plural(c.list.length, 'leitura', 'leituras')} em comum`}</b><small>${c.compat != null ? `Você e ${esc(nm)} têm ${plural(c.list.length, 'leitura', 'leituras')} em comum, como ${esc(c.list[0].title)}` : `Você e ${esc(nm)} leram ${esc(c.list[0].title)}${c.list.length > 1 ? ' e outros' : ''}`}</small></span><span>›</span>`;
    b.addEventListener('click', () => openCommonReads(d));
    const at = v.querySelector('.yo-nums') || v.querySelector('.yo-top'); if (at) at.after(b);
  } catch (err) { console.warn('leituras em comum', err); }
  return r;
}; }
// Perfil aberto: a tela de baixo (Busca/Estante) não pode continuar como "a tela a redesenhar"; senão, quando a sincronização
// ou o catálogo atualizam, o perfil é trocado pela Busca (bug do recarregar no perfil de um amigo, 16/11).
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments);
  try { const v = $('#shelflist'); if (v && !v.hidden && v.querySelector('.yo-top, .fr-lock')) S.listRedraw = null; } catch {}
  return r;
}; }
