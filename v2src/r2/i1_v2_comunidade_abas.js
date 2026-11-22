// Comunidade em 5 abas (Bia, 22/11; protótipo v194 aprovado): Amizades · Todos · Desafio · Ler junto · Salvos.
// - Avaliações e Comentários viraram filtro (Tudo · Avaliações · Comentários) dentro de Amizades e Todos, lembrado por aba
//   no aparelho (lv.comFil); a engrenagem fica no fim da linha dos filtros. Enquete é post: conta como comentário.
// - Desafio: o campo de cima vira "Participar do desafio…"; tema e prazo; "Mais citados até agora" (top 3 dos livros das respostas,
//   pontos = respostas que citam o livro + curtidas dessas respostas; só com 3+ respostas; tocar filtra as respostas);
//   respostas no cartão do feed (com Responder no cartão); "Desafios anteriores" recolhido, cada um com o vencedor e o resultado.
//   Ponto na aba enquanto a pessoa não respondeu ao desafio da semana. Os dados vêm do feed que o app já carrega (sem rota nova):
//   resposta = post que começa com "Desafio da semana: <tema>"; desafio de semanas antigas só conta o que está carregado.
// - Ler junto: o campo de cima vira "+ Ler junto"; Convites, Mensagens novas, Em andamento e Encerradas recolhidas (mesma lista e
//   mesmo "•••" da página Ler junto: ljBodyHTML('com') + ljWire). Ponto na aba com convite, mensagem nova ou convite parado no aparelho.
//   A aba some quando a função Ler junto está desligada.
const V6TABS = [['amigos', 'Amizades'], ['todos', 'Todos'], ['desafio', 'Desafio'], ['junto', 'Ler junto'], ['salvos', 'Salvos']];
const V6FIL = [['tudo', 'Tudo'], ['aval', 'Avaliações'], ['coment', 'Comentários']];
const v6JuntoOn = () => { try { return typeof vFn === 'function' ? vFn('junto') !== false : true; } catch { return true; } };
const v6FilAll = () => { try { return JSON.parse(localStorage.getItem('lv.comFil') || '{}') || {}; } catch { return {}; } };
function v6Fil(f) { const k = v6FilAll()[f]; return f === 'amigos' || f === 'todos' ? (V6FIL.some(([x]) => x === k) ? k : 'tudo') : 'tudo'; }
function v6FilSet(f, k) { const o = v6FilAll(); o[f] = k; try { localStorage.setItem('lv.comFil', JSON.stringify(o)); } catch {} }
// abas antigas (Avaliações / Comentários) caem em Todos já com o filtro; Ler junto desligado cai em Amizades
function v6FixTab() { const S6 = v6S();
  if (S6.f === 'aval' || S6.f === 'coment') { v6FilSet('todos', S6.f); S6.f = 'todos'; }
  if (!V6TABS.some(([k]) => k === S6.f) || (S6.f === 'junto' && !v6JuntoOn())) S6.f = 'amigos'; }

// ---------- desafio: semanas, respostas, ranking ----------
function v6WkAt(back) { const d = new Date(); d.setDate(d.getDate() - 7 * (back || 0)); const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())), day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day); const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return t.getUTCFullYear() * 100 + Math.ceil(((t - y0) / 864e5 + 1) / 7); }
const v6WkQ = (back) => { try { return V2WK[v6WkAt(back) % V2WK.length]; } catch { return ''; } };
// domingo que fecha a semana "back" semanas atrás
const v6WkEnd = (back) => { const d = new Date(); d.setDate(d.getDate() - 7 * (back || 0) + ((7 - (d.getDay() || 7)) % 7)); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }); };
function v6DesItems(q) {
  const pre = ('Desafio da semana: ' + q).toLowerCase(), seen = new Set(), out = [];
  ['rede', 'amigos'].forEach((sc) => { try { v6Feed(sc).items.forEach((x) => { const k = x.type + x.id; if (seen.has(k)) return; if (String(x.text || '').toLowerCase().startsWith(pre)) { seen.add(k); out.push(x); } }); } catch {} });
  try { return rdVisible(out); } catch { return out; }
}
const v6BkKey = (b) => (b && b.title ? normT(b.title) : '');
function v6Rank(items) {
  const m = {};
  items.forEach((it) => { const k = v6BkKey(it.book); if (!k) return; const r = (m[k] = m[k] || { k, title: it.book.title, author: it.book.author, cover: it.book.cover, n: 0, pts: 0, best: null });
    r.n++; r.pts += 1 + (Number(it.likes) || 0); if (!r.cover && it.book.cover) r.cover = it.book.cover; if (!r.best || (Number(it.likes) || 0) > (Number(r.best.likes) || 0)) r.best = it; });
  return Object.values(m).sort((a, z) => z.pts - a.pts || z.n - a.n || a.title.localeCompare(z.title));
}
const v6Cit = (n) => `citado ${n} ${n === 1 ? 'vez' : 'vezes'}`;
// respondeu ao desafio da semana: post seu no feed ou marca guardada no aparelho (por conta e semana)
function v6DesDone(items) {
  const me = v6Me(), key = 'lv.desDone:' + me, wk = String(v6WkAt(0));
  if (items.some((it) => it.mine || (it.user && it.user.handle && it.user.handle === me))) { try { localStorage.setItem(key, wk); } catch {} return true; }
  try { return localStorage.getItem(key) === wk; } catch { return false; }
}
const v6DesLeft = () => { const d = new Date().getDay(); return d === 0 ? 'termina hoje' : d === 6 ? 'termina amanhã (domingo)' : `termina domingo · faltam ${7 - d} dias`; };

// ---------- pedaços comuns ----------
function v6TabsHTML() {
  const S6 = v6S(), T = V6TABS.filter(([k]) => k !== 'junto' || v6JuntoOn());
  const dot = (k) => { try { if (k === 'desafio') return !v6DesDone(v6DesItems(v6WkQ(0)));
      if (k === 'junto') { const L = ljItems(); return ljInv(L).length > 0 || ljOn(L).some((x) => ljNew(x) > 0) || ljLocal().length > 0; } } catch {} return false; };
  return `<div class="ctabs c5" role="tablist" aria-label="Comunidade">${T.map(([k, l]) => { const d = S6.f !== k && dot(k);
    return `<button role="tab" aria-selected="${S6.f === k}" class="${S6.f === k ? 'on' : ''}" data-a="v6tab" data-k="${k}">${l}${d ? '<i class="cdot" aria-label=", tem novidade"></i>' : ''}</button>`; }).join('')}</div>`;
}
function v6FilHTML() {
  const S6 = v6S(), sf = v6Fil(S6.f);
  return `<div class="cfil" role="group" aria-label="Mostrar">${V6FIL.map(([k, l]) => `<button type="button" class="${sf === k ? 'on' : ''}" data-a="v6fil" data-k="${k}" aria-pressed="${sf === k}">${l}</button>`).join('')}<button type="button" class="cg2" data-a="v6cfg" aria-label="Preferências da Comunidade">${v4ic('gear', 17)}</button></div>`;
}
const v6MeAv = () => { const me = socialProfile || {}; return `<span class="av" data-avh="${esc(me.handle || '')}" style="background-color:${friendColor(me.handle || '')}">${esc(initial(me.displayName || me.handle || '?'))}</span>`; };
const v6Cv = (title, cover) => { try { return cvh(title, cover || (typeof covOv === 'function' ? covOv(title, null) : null)); } catch { return cvh(title, cover); } };

// ---------- abas Desafio e Ler junto ----------
function v6PaintTab(R) {
  const S6 = v6S(); v6ArmTabs(R);
  if (S6.f === 'junto') {
    R.innerHTML = `<div class="cbar">${v6MeAv()}<button class="cin cpart" type="button" data-ljadd>+ Ler junto</button></div>${v6TabsHTML()}<div class="v6lj">${ljBodyHTML('com')}</div>`;
    try { ljWire(R, () => v6Paint()); } catch {}
    try { if (!LJ2.items || Date.now() - LJ2.at > 30000) setTimeout(() => { try { ljLoad(); } catch {} }, 0); } catch {}
    return v6Fin(R);
  }
  // Desafio
  const back = S6.desWk || 0, q = v6WkQ(back), items = v6DesItems(q), rank = v6Rank(items), done = v6DesDone(back ? v6DesItems(v6WkQ(0)) : items);
  const F = v6Feed('rede'); if (!F.at && !F.busy) setTimeout(() => { try { v6Load('rede'); } catch {} }, 0);
  const bk = S6.desBk && rank.some((r) => r.k === S6.desBk) ? S6.desBk : null; if (!bk) S6.desBk = null;
  const list = bk ? items.filter((it) => v6BkKey(it.book) === bk) : items; S6.list = list;
  // dentro da aba o tema já está no cartão de cima: a resposta aparece sem o "Desafio da semana: <tema>" na frente
  const pre = new RegExp('(<p>)Desafio da semana: ' + esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*', 'gi');
  const posts = list.map((it, i) => v6PostHTML(it, i)).join('').replace(pre, '$1');
  const bar = back ? '' : done ? `<div class="cbar cbar-ok">${v6MeAv()}<span class="cpart ok">${v4ic('ok', 16)}Você já participou desta semana</span></div>`
    : `<div class="cbar">${v6MeAv()}<button class="cin cpart" type="button" data-a="v6dgo">Participar do desafio…</button></div>`;
  const pod = rank.length && items.length >= 3 && !back ? `<div class="dh">Mais citados até agora</div><div class="dpod" role="group" aria-label="Filtrar respostas por livro">${[rank[1], rank[0], rank[2]].filter(Boolean).map((x) => { const pos = rank.indexOf(x) + 1, on = bk === x.k;
      return `<button type="button" class="dpod-i p${pos}${on ? ' on' : ''}" data-a="v6dbk" data-k="${esc(x.k)}" aria-pressed="${on}" aria-label="${pos}º ${esc(x.title)}, ${v6Cit(x.n)}; mostrar só essas respostas">${v6Cv(x.title, x.cover)}<span class="dpod-n"><b>${pos}º</b> ${x.n}×</span></button>`; }).join('')}</div>` : '';
  const flt = bk ? `<div class="dflt"><span>Respostas sobre <b>${esc((rank.find((r) => r.k === bk) || {}).title || '')}</b></span><button type="button" class="lnk" data-a="v6dbk" data-k="${esc(bk)}">Limpar</button></div>` : '';
  const res = (r3, b) => { const w = r3[0]; if (!w) return `<div class="card des-c"><div class="eb acc">Resultado · semana até ${v6WkEnd(b)}</div><h3>${esc(v6WkQ(b))}</h3><span class="mut">${items.length ? 'Nenhuma resposta citou um livro' : 'Sem respostas carregadas desta semana'}</span></div>`;
    const bb = w.best; return `<div class="card des-res"><div class="eb acc">Resultado · ${esc(v6WkQ(b))}</div>
      <div class="des-w">${v6Cv(w.title, w.cover)}<div><small class="mut">Venceu</small><h3>${esc(w.title)}</h3><span class="mut">${v6Cit(w.n)} · ${w.pts} ${w.pts === 1 ? 'ponto' : 'pontos'}</span>${bb && bb.text ? `<blockquote>“${esc(v6Body(bb.text).replace(/^Desafio da semana:[^\n]*\n?/i, '').slice(0, 140))}”<small>${esc((bb.user && (bb.user.displayName || bb.user.handle)) || '')}${bb.likes ? ` · ${bb.likes} ${bb.likes === 1 ? 'curtida' : 'curtidas'}` : ''}</small></blockquote>` : ''}</div></div>
      ${r3.length > 1 ? `<div class="des-rest">${r3.slice(1, 3).map((x, k) => `<span>${v6Cv(x.title, x.cover)}<b>${k + 2}º</b> ${esc(x.title)}<small>${v6Cit(x.n)}</small></span>`).join('')}</div>` : ''}</div>`; };
  // semana passada: o resultado aparece em cima na segunda e na terça
  const dw = new Date().getDay(), prevRank = !back && (dw === 1 || dw === 2) ? v6Rank(v6DesItems(v6WkQ(1))) : [];
  const prevLine = prevRank[0] ? `<button type="button" class="des-prev" data-a="v6dwk" data-k="1">${v6Cv(prevRank[0].title, prevRank[0].cover)}<span><small>Resultado da semana passada</small><b>${esc(prevRank[0].title)} venceu</b></span>${v4ic('chev', 14)}</button>` : '';
  const card = back ? res(rank, back) : `<div class="card des-c"><div class="eb acc">Desafio da semana</div><h3>${esc(q)}</h3><span class="mut">${esc(v6DesLeft())} · ${items.length} ${items.length === 1 ? 'resposta' : 'respostas'}</span></div>`;
  const H = [1, 2, 3, 4].map((b) => { const its = v6DesItems(v6WkQ(b)), w = v6Rank(its)[0];
    return `<button type="button" class="des-hi" data-a="v6dwk" data-k="${b}">${w ? v6Cv(w.title, w.cover) : `<span class="des-hn">${v4ic('ach', 16)}</span>`}<span class="t"><b>${esc(v6WkQ(b))}</b><small>até ${v6WkEnd(b)} · ${its.length} ${its.length === 1 ? 'resposta' : 'respostas'}${w ? ' · venceu ' + esc(w.title) : ''}</small></span>${v4ic('chev', 14)}</button>`; }).join('');
  const empty = !F.at ? '<div class="msg">Carregando as respostas…</div>'
    : back ? '<div class="msg">Nenhuma resposta desta semana no que está carregado.</div>'
    : `<div class="msg"><b>Ninguém respondeu ainda</b><br>Conte qual livro você escolheria para este tema.<div class="macts"><button class="btn p" type="button" data-a="v6dgo">Responder ao desafio</button></div></div>`;
  R.innerHTML = `${bar}${v6TabsHTML()}${back ? `<button type="button" class="des-back" data-a="v6dwk" data-k="0">${v4ic('back', 16)}Desafio desta semana</button>` : prevLine}
    ${card}${pod}${flt}
    <div class="dh">${back ? 'Respostas' : 'Respostas'}${list.length ? ` <small>${list.length}</small>` : ''}</div>${posts || empty}
    ${back ? '' : `<details class="des-h"${S6.desHOpen ? ' open' : ''}><summary>Desafios anteriores · 4</summary>${H}</details>`}`;
  R.querySelectorAll('details.des-h').forEach((d) => d.addEventListener('toggle', () => { S6.desHOpen = d.open; }));
  return v6Fin(R);
}
function v6Fin(R) {
  try { paintCv(R); } catch {} try { rdLoadImages(R); } catch {}
  R.querySelectorAll('[data-avh]').forEach((n) => { try { const d = avatarOf(n.dataset.avh); if (d) { n.style.backgroundImage = `url("${d}")`; n.textContent = ''; } } catch {} });
}
// novas ações (o v6Click do bloco i0 cuida do resto)
{ const _vc = v6Click; v6Click = function (ev) {
    const b = ev.target.closest && ev.target.closest('[data-a]'), a = b && b.dataset.a, S6 = v6S();
    if (a === 'v6dgo') { ev.stopPropagation(); ev.preventDefault(); return openRdComposer({ kind: 'comment', desafio: v6WkQ(0) }); }
    if (a === 'v6dbk') { ev.stopPropagation(); ev.preventDefault(); S6.desBk = S6.desBk === b.dataset.k ? null : b.dataset.k; return v6Paint(); }
    if (a === 'v6dwk') { ev.stopPropagation(); ev.preventDefault(); S6.desWk = +b.dataset.k || 0; S6.desBk = null; v6Paint(); try { const h = $('#lista > .v6host'); h && h.scrollIntoView({ block: 'start' }); } catch {} return; }
    return _vc.apply(this, arguments);
  }; }
// publicar no feed recarrega as duas abas do feed: a resposta ao desafio aparece e o ponto some
{ const _rl = typeof rdLoad === 'function' ? rdLoad : null; if (_rl) rdLoad = function () { const r = _rl.apply(this, arguments);
    try { ['rede', 'amigos'].forEach((sc) => { const F = v6Feed(sc); F.at = 0; }); if (S.tab === 'comunidade') { v6Load('rede'); v6Load('amigos'); } } catch {}
    return r; }; }
// ponto do Ler junto: a lista é carregada quando a Comunidade aparece (a cada 60 s no máximo)
{ const _p = v6Paint; v6Paint = function () { try { const h = $('#lista > .v6host'); if (h && h.shadowRoot) v6ArmTabs(h.shadowRoot.querySelector('.v6com')); } catch {}
    const r = _p.apply(this, arguments);
    try { if (S.tab === 'comunidade' && v6JuntoOn() && connected() && (!LJ2.items || Date.now() - LJ2.at > 60000) && !LJ2.busy) setTimeout(() => { try { ljLoad(); } catch {} }, 0); } catch {}
    return r; }; }
// sair da Comunidade volta ao desafio desta semana
{ const _gt = goTab; goTab = function (t) { if (t !== 'comunidade') { try { const S6 = v6S(); S6.desWk = 0; S6.desBk = null; } catch {} } return _gt.apply(this, arguments); }; }
function v6ArmTabs(R) {
  const sr = R && R.getRootNode && R.getRootNode(); if (!sr || !sr.querySelector) return;
  if (!sr.querySelector('style[data-c5]')) { const st = document.createElement('style'); st.dataset.c5 = '1'; st.textContent = V6C5CSS; sr.append(st); }
  if (!sr.querySelector('style[data-lj2]') && typeof LJ2 !== 'undefined' && LJ2.css) { const st = document.createElement('style'); st.dataset.lj2 = '1'; st.textContent = LJ2.css; sr.append(st); }
}
const V6C5CSS = `
.v6com .ctabs.c5{gap:0}.v6com .ctabs.c5 button{flex:1 1 0;min-width:0;padding:11px 2px 10px;font-size:12.5px;min-height:44px;position:relative;overflow:visible}
.v6com .cdot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--acc);margin-left:3px;vertical-align:5px}
.v6com .cfil{display:flex;gap:6px;align-items:center;margin-top:10px}
.v6com .cfil button:not(.cg2){flex:none;min-height:36px;padding:0 13px;border-radius:99px;border:1.5px solid var(--line);background:var(--card);color:var(--ink2);font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}
.v6com .cfil button.on{background:var(--ink);border-color:var(--ink);color:var(--bg,var(--panel))}
.v6com .cfil .cg2{margin-left:auto;flex:none;border:0;background:none;color:var(--ink3);width:44px;min-height:40px;display:grid;place-items:center;border-radius:12px;cursor:pointer}
.v6com .cpart{flex:1;text-align:left;border:0;background:none;font:inherit;font-size:14px;font-weight:800;color:var(--acc);padding:6px 4px;min-height:36px;cursor:pointer}
.v6com .cpart.ok{display:inline-flex;gap:6px;align-items:center;color:var(--ink2);cursor:default}
.v6com .dh{font-family:var(--f-disp);font-size:17px;font-weight:700;margin:18px 2px 8px;display:flex;align-items:baseline;gap:6px}.v6com .dh small{font-family:inherit;font-size:12px;color:var(--ink3);font-weight:800}
.v6com .des-c{margin-top:12px;padding:14px 16px;display:grid;gap:4px}.v6com .des-c h3{margin:2px 0;font-size:19px;line-height:1.25}.v6com .des-c .mut,.v6com .des-res .mut{color:var(--ink2);font-size:13px;font-weight:700}
.v6com .eb.acc{color:var(--acc)}
.v6com .dpod{display:flex;justify-content:center;align-items:flex-end;gap:14px;padding:6px 0 2px}
.v6com .dpod-i{display:grid;justify-items:center;gap:5px;border:0;background:none;padding:4px;border-radius:12px;font:inherit;color:var(--ink);cursor:pointer;min-height:44px}
.v6com .dpod-i .cv{width:56px;height:84px;border-radius:3px 7px 7px 3px;box-shadow:0 4px 10px rgba(0,0,0,.25)}.v6com .dpod-i.p1 .cv{width:70px;height:105px}
.v6com .dpod-i.on{outline:2px solid var(--acc);outline-offset:2px}
.v6com .dpod-n{font-size:12px;font-weight:800;color:var(--ink2)}.v6com .dpod-n b{color:var(--acc)}
.v6com .dflt{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px;padding:8px 12px;border-radius:12px;background:var(--soft);font-size:13px}
.v6com .dflt .lnk{min-height:36px}
.v6com .des-res{margin-top:12px;padding:14px 16px;display:grid;gap:10px}
.v6com .des-w{display:flex;gap:12px;align-items:flex-start}.v6com .des-w .cv{width:72px;height:108px;flex:none;border-radius:3px 7px 7px 3px}.v6com .des-w h3{margin:2px 0;font-size:18px;line-height:1.2}
.v6com .des-w blockquote{margin:8px 0 0;padding:6px 10px;border-left:3px solid var(--acc);font-style:italic;font-size:13px;line-height:1.4}.v6com .des-w blockquote small{display:block;font-style:normal;color:var(--ink3);font-size:11.5px;margin-top:2px}
.v6com .des-rest{display:flex;gap:12px;border-top:1px solid var(--line);padding-top:10px}.v6com .des-rest span{display:flex;gap:8px;align-items:center;font-size:13px;flex:1;min-width:0}.v6com .des-rest .cv{width:30px;height:45px;flex:none;border-radius:2px 4px 4px 2px}.v6com .des-rest small{display:block;color:var(--ink3);font-size:11.5px}
.v6com .des-prev,.v6com .des-back{display:flex;align-items:center;gap:10px;width:100%;margin-top:12px;padding:8px 12px;border:1px solid var(--line);border-radius:14px;background:var(--card);font:inherit;color:var(--ink);text-align:left;min-height:48px;cursor:pointer}
.v6com .des-prev .cv{width:28px;height:42px;flex:none;border-radius:2px 4px 4px 2px}.v6com .des-prev span{flex:1;min-width:0;display:grid}.v6com .des-prev small{color:var(--acc);font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}
.v6com .des-back{border:0;background:none;padding:4px 2px;font-weight:800;color:var(--ink2);min-height:44px}
.v6com .des-h{margin-top:16px;border:1px solid var(--line);border-radius:16px;background:var(--card);padding:0 12px}
.v6com .des-h summary{cursor:pointer;padding:13px 2px;font-weight:800;font-size:14px;color:var(--ink2);list-style:none;display:flex;justify-content:space-between;align-items:center;min-height:44px;box-sizing:border-box}
.v6com .des-h summary::-webkit-details-marker{display:none}.v6com .des-h summary::after{content:'▾';color:var(--ink3)}.v6com .des-h[open] summary::after{content:'▴'}.v6com .des-h[open]{padding-bottom:6px}
.v6com .des-hi{display:flex;width:100%;align-items:center;gap:10px;text-align:left;border:0;border-top:1px solid var(--line);background:none;font:inherit;color:var(--ink);padding:10px 2px;min-height:52px;cursor:pointer}
.v6com .des-hi .cv{width:28px;height:42px;flex:none;border-radius:2px 4px 4px 2px}.v6com .des-hn{width:28px;height:42px;display:grid;place-items:center;color:var(--ink3);flex:none}
.v6com .des-hi .t{flex:1;min-width:0;display:grid;gap:2px}.v6com .des-hi b{font-size:14px}.v6com .des-hi small{color:var(--ink3);font-size:12px;font-weight:700}
.v6com .v6lj{margin-top:12px}.v6com .lj2-more{top:.35rem;right:.35rem;width:40px;height:40px;border-radius:50%;background:color-mix(in srgb,var(--ink) 6%,transparent);color:var(--ink2)}.v6com .lj2-h{margin-top:14px}
.v6com .lj2-msg{display:flex;width:100%;gap:10px;align-items:flex-start;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:10px 12px;font:inherit;color:var(--ink);cursor:pointer}
.v6com .lj2-msg .cv{width:34px;height:51px;flex:none;border-radius:2px 5px 5px 2px}.v6com .lj2-msg .t{flex:1;min-width:0;display:grid;gap:3px}.v6com .lj2-msg .t small{color:var(--ink3);font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v6com .lj2-msg .t>span{font-size:14px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v6com .lj2-fim{margin-top:16px;border:1px solid var(--line);border-radius:16px;background:var(--card);padding:0 12px}
.v6com .lj2-fim summary{cursor:pointer;padding:13px 2px;font-weight:800;font-size:14px;color:var(--ink2);list-style:none;display:flex;justify-content:space-between;align-items:center;min-height:44px;box-sizing:border-box}
.v6com .lj2-fim summary::-webkit-details-marker{display:none}.v6com .lj2-fim summary::after{content:'▾';color:var(--ink3)}.v6com .lj2-fim[open] summary::after{content:'▴'}.v6com .lj2-fim[open]{padding-bottom:12px}
`;
