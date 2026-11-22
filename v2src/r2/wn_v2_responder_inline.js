// Responder no próprio cartão (Bia, 21/11: "o responder não precisa abrir uma tela nova.. é só expandir no próprio card com o
// campo pra escrever a resposta e enviar"). Tocar em Responder abre, dentro do cartão, as 2 últimas respostas, "Ver todas as N
// respostas" (essa sim abre a conversa inteira) e o campo com a sua foto, que cresce com o texto e tem ditar (os dois vêm dos
// blocos w9/wa, que ligam todo textarea). Enviar fica desligado com o campo vazio; ao enviar, a resposta aparece na hora, o
// contador sobe, o campo limpa e continua aberto; em erro, o texto fica e aparece "Não enviou. Tentar de novo".
// Tocar em Responder de novo, abrir outro cartão ou sair da tela recolhe (o rascunho fica guardado por post). Um cartão por vez.
// Vale no feed da Comunidade (todas as abas e a página do desafio) e na Comunidade do livro (cartões .rd-card).
// Junto: a foto do campo "Escreva sobre sua leitura…" saía ampliada e cortada (faltava background-size no .av da Comunidade).
const IRP_CSS = `
.irp{display:grid;gap:10px;margin-top:10px;padding-top:12px;border-top:1px solid var(--line)}
.irp .irp-r{display:grid;grid-template-columns:28px 1fr;gap:8px;align-items:start}
.irp .irp-av{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:11px;font-weight:900;color:#fff;background-size:cover;background-position:center;flex:none}
.irp .irp-b{min-width:0;padding:8px 11px;border-radius:4px 14px 14px 14px;background:color-mix(in srgb,var(--ink) 6%,var(--panel))}
.irp .irp-b b{font-size:13px;font-weight:900}
.irp .irp-b small{color:var(--ink-2);font-size:11.5px;font-weight:700;margin-left:4px}
.irp .irp-b p{margin:2px 0 0;font-size:14px;line-height:1.42;overflow-wrap:anywhere;white-space:pre-wrap}
.irp .irp-sp{display:flex;align-items:center;gap:6px;width:100%;margin-top:4px;padding:8px 10px;border:1px dashed var(--line);border-radius:10px;background:none;color:var(--ink-2);font:inherit;font-size:13px;font-weight:800;cursor:pointer;text-align:left}
.irp .irp-sp u{margin-left:auto;color:var(--acc);text-decoration:none}
.irp .irp-mut{margin:0;color:var(--ink-2);font-size:13px;font-weight:700}
.irp .irp-all{justify-self:start;min-height:40px;padding:0 4px;border:0;background:none;color:var(--acc);font:inherit;font-size:13.5px;font-weight:900;cursor:pointer}
.irp .irp-f{display:grid;grid-template-columns:28px 1fr auto;gap:8px;align-items:end;margin:0}
.irp .irp-f .irp-av{margin-bottom:8px}
.irp .irp-w{position:relative;min-width:0}
.irp textarea{display:block;width:100%;box-sizing:border-box;min-height:44px;max-height:180px;padding:11px 44px 11px 12px;border:1px solid var(--line);border-radius:14px;background:var(--bg,var(--panel));color:var(--ink);font:inherit;font-size:15px;line-height:1.4;resize:none}
.irp textarea:focus{outline:2px solid var(--acc);outline-offset:0;border-color:transparent}
.irp .irp-send{min-height:44px;min-width:72px;padding:0 14px;border:0;border-radius:14px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-size:14px;font-weight:900;cursor:pointer}
.irp .irp-send:disabled{opacity:.4;cursor:default}
.irp .irp-op{display:flex;align-items:center;gap:8px;margin-left:36px;font-size:13px;font-weight:700;color:var(--ink-2)}
.irp .irp-op input{appearance:none;-webkit-appearance:none;width:20px;height:20px;margin:0;border:1.5px solid var(--ink-2);border-radius:6px;background:var(--panel);display:grid;place-items:center;cursor:pointer;flex:none}
.irp .irp-op input:checked{background:var(--acc);border-color:var(--acc)}
.irp .irp-op input:checked::after{content:'';width:10px;height:6px;border-left:2.5px solid var(--on-acc,#fff);border-bottom:2.5px solid var(--on-acc,#fff);transform:translateY(-1px) rotate(-45deg)}
.irp .irp-op label{display:flex;align-items:center;gap:7px;min-height:40px;cursor:pointer}
.irp .irp-err{display:flex;align-items:center;gap:8px;margin:0 0 0 36px;color:var(--danger,#d0574a);font-size:13px;font-weight:800}
.irp .irp-err button{min-height:40px;padding:0 4px;border:0;background:none;color:var(--acc);font:inherit;font-weight:900;cursor:pointer;text-decoration:underline}
.irp-on .acts [data-a="v6rp"],.irp-on footer .rd-rp{color:var(--acc)}
.v6com .av{background-size:cover;background-position:center}
.irp-hide{visibility:hidden!important;pointer-events:none!important}
:host(.irp-t) .inst-pop,body.irp-typing .inst-pop{visibility:hidden!important;pointer-events:none!important}
`;
{ const st = document.createElement('style'); st.dataset.irp = 1; st.textContent = IRP_CSS; TR.append(st); try { document.head.append(st.cloneNode(true)); } catch {} }
const IRP = (S.irp = S.irp || { key: null, drafts: {}, reps: {}, sp: {} });
// enquanto digita, o aviso de instalar some (cobria o campo); a barra de baixo e o botão Ler ficam, e o campo rola para cima deles
function irpTyping(on) { document.body.classList.toggle('irp-typing', !!on); try { TR.host.classList.toggle('irp-t', !!on); } catch {} }
const irpKey = (it) => (it ? it.type + it.id : '');
const irpRootOf = (el) => { const r = el && el.getRootNode ? el.getRootNode() : document; return r; };
const irpArmCss = (el) => { const r = irpRootOf(el); if (r && r !== document && r.querySelector && !r.querySelector('style[data-irp]')) { const st = document.createElement('style'); st.dataset.irp = 1; st.textContent = IRP_CSS; r.append(st); } };
const irpMe = () => { try { return socialProfile || {}; } catch { return {}; } };
const irpAv = (h, name, cls = 'irp-av') => { let d = null; try { d = avatarOf(h); } catch {}
  return `<span class="${cls}" style="background-color:${friendColor(h || '')}${d ? `;background-image:url('${d}')` : ''}">${d ? '' : esc(initial(name || h || '?'))}</span>`; };
const irpRepHTML = (it, x, i) => {
  const u = x.user || {}; let sp = null;
  if (x.spoiler && !x.mine && !(S.rdOpen && S.rdOpen.has('reply' + x.id))) { try { sp = rdSpoil({ ...x, type: 'reply', book: it.book, spoiler: x.spoiler }); } catch { sp = { label: 'Cuidado, spoiler' }; } }
  return `<div class="irp-r">${irpAv(u.handle, u.displayName)}<div class="irp-b"><b>${esc(u.displayName || '@' + (u.handle || ''))}</b><small>${esc(relTime(x.createdAt))}</small>
    ${sp ? `<button type="button" class="irp-sp" data-irp="sp" data-r="${i}">${esc(sp.label || 'Cuidado, spoiler')}<u>Mostrar</u></button>` : `<p>${esc(x.text || '')}</p>`}</div></div>`;
};
function irpPanelHTML(it) {
  const k = irpKey(it), reps = IRP.reps[k], n = Math.max(Number(it.replies) || 0, reps ? reps.length : 0), isRev = it.type === 'review', me = irpMe();
  const last = reps ? reps.slice(-2) : [];
  const list = reps === undefined ? '<p class="irp-mut">Carregando respostas…</p>' : reps === null ? '<p class="irp-mut">Não carregou as respostas agora.</p>'
    : last.length ? last.map((x) => irpRepHTML(it, x, reps.indexOf(x))).join('') : '<p class="irp-mut">Ninguém respondeu ainda. Seja a primeira pessoa.</p>';
  const d = IRP.drafts[k] || '', err = IRP.err && IRP.err.k === k ? IRP.err.m : '';
  return `<div class="irp" data-k="${esc(k)}">${list}${n > 2 ? `<button type="button" class="irp-all" data-irp="all">Ver todas as ${n} respostas</button>` : ''}
    <form class="irp-f" data-irp="f">${irpAv(me.handle, me.displayName)}<div class="irp-w"><textarea rows="1" maxlength="${isRev ? 500 : 280}" placeholder="Sua resposta…" aria-label="Escreva sua resposta">${esc(d)}</textarea></div><button type="submit" class="irp-send"${d.trim() ? '' : ' disabled'}>Enviar</button></form>
    ${isRev ? '' : `<div class="irp-op"><label><input type="checkbox" data-irp="spc"${IRP.sp[k] ? ' checked' : ''}>Minha resposta tem spoiler</label></div>`}
    ${err ? `<p class="irp-err" role="alert">${esc(err)}<button type="button" data-irp="retry">Tentar de novo</button></p>` : ''}</div>`;
}
// cartão → item
function irpItemOf(card) {
  if (!card) return null;
  if (card.__irpIt) return card.__irpIt;
  if (card.matches('article.post')) { try { return v6S().list[+card.dataset.i] || null; } catch { return null; } }
  return null;
}
const irpCardOf = (btn) => btn && (btn.closest('article.post') || btn.closest('.rd-card'));
const irpRpBtn = (card) => card && (card.querySelector('[data-a="v6rp"]') || card.querySelector('.rd-rp'));
function irpCountLbl(card, it) {
  const b = irpRpBtn(card); if (!b) return; const n = Number(it.replies) || 0;
  if (b.dataset.a === 'v6rp') b.innerHTML = v4ic('reply', 18) + 'Responder' + (n ? ' · ' + n : ''); else b.textContent = 'Responder' + (n ? ' · ' + n : '');
  b.setAttribute('aria-expanded', IRP.key === irpKey(it));
}
function irpFind(k) { // o cartão aberto, onde quer que esteja (documento ou shadow da Comunidade)
  if (IRP.card && IRP.card.isConnected && IRP.card.getClientRects().length) { const it = irpItemOf(IRP.card); if (it && irpKey(it) === k) return IRP.card; }
  const roots = [document, TR]; try { const h = $('#lista > .v6host'); if (h && h.shadowRoot) roots.unshift(h.shadowRoot); } catch {}
  for (const r of roots) { for (const c of r.querySelectorAll('article.post, .rd-card')) { const it = irpItemOf(c); if (it && irpKey(it) === k && c.getClientRects().length) return c; } }
  return null;
}
function irpClose(keepNothing) {
  const k = IRP.key, c0 = IRP.card; IRP.key = null; IRP.card = null; IRP.err = null; IRP.typing = false; irpTyping(false);
  if (!k) return; const roots = [document, TR]; try { const h = $('#lista > .v6host'); if (h && h.shadowRoot) roots.push(h.shadowRoot); } catch {}
  if (c0) roots.push(c0.getRootNode());
  roots.forEach((r) => { try { r.querySelectorAll('.irp').forEach((p) => { const c = p.parentElement; p.remove(); if (c) { c.classList.remove('irp-on'); const it = irpItemOf(c); if (it) irpCountLbl(c, it); } }); } catch {} });
}
function irpMount(card, it, focus) {
  irpArmCss(card); card.querySelector('.irp')?.remove(); IRP.card = card;
  const box = document.createElement('div'); box.innerHTML = irpPanelHTML(it); const p = box.firstElementChild; card.append(p); card.classList.add('irp-on'); irpCountLbl(card, it);
  const ta = p.querySelector('textarea'), send = p.querySelector('.irp-send'), k = irpKey(it);
  const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight + 2, 180) + 'px'; ta.style.overflowY = ta.scrollHeight > 178 ? 'auto' : 'hidden'; };
  if (ta.value) requestAnimationFrame(grow);
  ta.addEventListener('input', () => { grow(); IRP.drafts[k] = ta.value; send.disabled = !ta.value.trim(); if (IRP.err && IRP.err.k === k) { IRP.err = null; p.querySelector('.irp-err')?.remove(); } });
  ta.addEventListener('focus', () => { IRP.typing = true; irpTyping(true); irpKeep(ta); });
  ta.addEventListener('blur', () => setTimeout(() => { if (!ta.isConnected) return; /* repintura da lista: o campo volta com foco */ let a = document.activeElement; while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement; if (!a || !a.closest || !a.closest('.irp')) { IRP.typing = false; irpTyping(false); } }, 150));
  ta.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); irpSend(card, it); } });
  p.addEventListener('submit', (ev) => { ev.preventDefault(); ev.stopPropagation(); irpSend(card, it); });
  p.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-irp]'); if (!b) return; ev.stopPropagation(); const a = b.dataset.irp;
    if (a === 'all') { ev.preventDefault(); const t = it; irpClose(); return openRdThread(t); }
    if (a === 'sp') { ev.preventDefault(); const x = (IRP.reps[k] || [])[+b.dataset.r]; if (x) (S.rdOpen = S.rdOpen || new Set()).add('reply' + x.id); return irpMount(card, it); }
    if (a === 'retry') { ev.preventDefault(); return irpSend(card, it); }
    if (a === 'spc') { IRP.sp[k] = b.checked; }
  });
  if (focus) { try { ta.focus({ preventScroll: true }); } catch { ta.focus(); } try { const L = ta.value.length; ta.setSelectionRange(L, L); } catch {} irpKeep(ta); }
}
// mantém o campo à vista: acima do teclado e sem a barra de baixo / botão Ler por cima
function irpKeep(ta) {
  // o que cobre o fim da tela: barra de baixo, botão Ler, aviso de instalar ou qualquer outra peça fixa embaixo
  const cover = () => { let top = innerHeight; const seen = new Set(), look = (list) => { for (const n of list) { if (seen.has(n) || n.classList.contains('irp-hide')) continue; seen.add(n);
      let cs; try { cs = getComputedStyle(n); } catch { continue; } if ((cs.position !== 'fixed' && cs.position !== 'sticky') || cs.visibility === 'hidden' || cs.display === 'none') continue;
      const r = n.getBoundingClientRect(); if (r.height > 0 && r.width > 40 && r.top > innerHeight * 0.45 && r.top < top) top = r.top; } };
    try { look(TR.querySelectorAll(':scope > *, :scope > * > *'));
      const tb = TR.querySelector('#tabbar'); if (tb && tb.getClientRects().length && getComputedStyle(tb).visibility !== 'hidden') [tb, ...tb.querySelectorAll('*')].forEach((n) => { const r = n.getBoundingClientRect(); if (r.height > 0 && r.top > innerHeight * 0.45 && r.top < top) top = r.top; }); look(document.querySelectorAll('body > *')); } catch {} return top; };
  const go = () => { if (!ta.isConnected) return; const vv = window.visualViewport, H = Math.min(vv ? vv.height + vv.offsetTop : innerHeight, cover());
    const box = ta.closest('.irp-f') || ta, fr = box.getBoundingClientRect(), op = ta.closest('.irp') && ta.closest('.irp').querySelector('.irp-op, .irp-err'), limit = H - 12;
    const ob = op ? op.getBoundingClientRect().bottom : fr.bottom, r = { top: fr.top, bottom: ob - fr.top < H - 140 ? ob : fr.bottom };
    let sc = null, x = box.parentElement || (box.getRootNode() && box.getRootNode().host);
    while (x && x !== document.documentElement) { const cs = getComputedStyle(x); if (/(auto|scroll)/.test(cs.overflowY) && x.scrollHeight > x.clientHeight + 1) { sc = x; break; } x = x.parentElement || (x.getRootNode() && x.getRootNode().host); }
    const by = (d) => { if (sc) sc.scrollTop += d; else window.scrollBy(0, d); };
    if (r.bottom > limit) by(r.bottom - limit); else if (r.top < 70) by(r.top - 70); };
  requestAnimationFrame(go); setTimeout(go, 320);
}
if (window.visualViewport) visualViewport.addEventListener('resize', () => { const c = IRP.key && irpFind(IRP.key), ta = c && c.querySelector('.irp textarea'); if (ta && document.activeElement && (document.activeElement === ta || (ta.getRootNode().activeElement === ta))) irpKeep(ta); });
async function irpLoad(card, it) {
  const k = irpKey(it), isRev = it.type === 'review';
  try { const r = await sapi('GET', isRev ? `/v1/reviews/${it.id}/comments` : `/v1/posts/${it.id}/replies`);
    IRP.reps[k] = r.status === 200 && r.data ? (r.data.items || []).map((x) => ({ ...x, user: x.user || {} })) : null;
  } catch { IRP.reps[k] = null; }
  if (IRP.reps[k] && IRP.reps[k].length > (Number(it.replies) || 0)) it.replies = IRP.reps[k].length;
  if (IRP.key !== k) return; const c = irpFind(k) || card; if (!c || !c.isConnected) return;
  const ta = c.querySelector('.irp textarea'), had = IRP.typing, pos = ta ? ta.selectionStart : 0;
  irpMount(c, it, false); if (had) { const t2 = c.querySelector('.irp textarea'); try { t2.focus({ preventScroll: true }); t2.setSelectionRange(pos, pos); } catch {} }
}
async function irpSend(card, it) {
  const k = irpKey(it), c = irpFind(k) || card, ta = c && c.querySelector('.irp textarea'); if (!ta || IRP.busy) return;
  const t = ta.value.trim(); if (!t) return; const isRev = it.type === 'review', sp = !isRev && !!IRP.sp[k];
  IRP.busy = true; const btn = c.querySelector('.irp-send'); if (btn) { btn.disabled = true; btn.textContent = 'Enviando…'; }
  let ok = false, msg = 'Não enviou.';
  try {
    const r = await sapi('POST', isRev ? `/v1/reviews/${it.id}/comments` : `/v1/posts/${it.id}/replies`, isRev ? { text: t } : { text: t, ...(sp ? { spoiler: { kind: it.spoiler && it.spoiler.kind === 'end' ? 'end' : 'yes' } } : {}) });
    if (r.status === 403) msg = 'Só amizades podem responder avaliações.'; else if (r.status < 300) ok = true;
  } catch {}
  IRP.busy = false;
  if (!ok) { IRP.err = { k, m: msg }; const c2 = irpFind(k) || c; if (c2) { irpMount(c2, it, false); const t2 = c2.querySelector('.irp textarea'); if (t2) t2.value = IRP.drafts[k] = t; const s2 = c2.querySelector('.irp-send'); if (s2) s2.disabled = false; } return; }
  const me = irpMe(); IRP.drafts[k] = ''; IRP.sp[k] = false; IRP.err = null;
  (IRP.reps[k] = IRP.reps[k] || []).push({ id: 'tmp' + Date.now(), text: t, mine: true, canDelete: true, createdAt: new Date().toISOString(), spoiler: sp || null, user: { handle: me.handle, displayName: me.displayName || me.handle } });
  it.replies = (Number(it.replies) || 0) + 1;
  try { v6All(it).forEach((x) => { if (x !== it) x.replies = it.replies; }); } catch {}
  const c3 = irpFind(k) || c; if (c3) { irpMount(c3, it, true); }
  try { toast('Resposta enviada'); } catch {}
  setTimeout(() => { if (IRP.key === k) { const c4 = irpFind(k); if (c4) irpLoad(c4, it); } }, 900);
}
function irpToggle(card, it) {
  const k = irpKey(it); if (!k) return;
  if (IRP.key === k) { const ta = card.querySelector('.irp textarea'); if (ta) IRP.drafts[k] = ta.value; return irpClose(); }
  irpClose(); IRP.key = k; irpMount(card, it, true); irpLoad(card, it);
}
// toque em Responder: pego antes dos ouvintes antigos (que abriam a tela de conversa)
window.addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : [ev.target];
  const b = p.find((n) => n && n.nodeType === 1 && (n.matches('[data-a="v6rp"]') || n.matches('.rd-rp'))); if (!b) return;
  const card = irpCardOf(b), it = irpItemOf(card); if (!card || !it || !it.id || String(it.id).startsWith('me-local')) return;
  ev.stopImmediatePropagation(); ev.preventDefault(); irpToggle(card, it);
}, true);
// os cartões .rd-card guardam o item (o rdBind recebe a lista)
{ const _rb = rdBind; rdBind = function (root, list) { const r = _rb.apply(this, arguments);
    try { $$('.rd-card', root).forEach((c) => { const it = list[+c.dataset.i]; if (it) { c.__irpIt = it; if (IRP.key && irpKey(it) === IRP.key && !c.querySelector('.irp')) irpMount(c, it, !!IRP.typing); } }); } catch {}
    return r; }; }
// repintura da Comunidade: o cartão aberto continua aberto (curtir, salvar, carregar mais repintam a lista)
{ const _p = v6Paint; v6Paint = function () { const ae = (() => { try { const h = $('#lista > .v6host'); return h && h.shadowRoot && h.shadowRoot.activeElement; } catch { return null; } })(), had = ae && ae.closest && ae.closest('.irp');
    const r = _p.apply(this, arguments);
    try { const h = $('#lista > .v6host'); if (h && h.shadowRoot) irpArmCss(h.shadowRoot.querySelector('.v6com')); } catch {}
    try { if (IRP.key) { const c = irpFind(IRP.key), it = c && irpItemOf(c); if (c && it) irpMount(c, it, !!(had || IRP.typing)); else if (!c) { IRP.key = null; irpTyping(false); } } } catch {}
    return r; }; }
// sair da tela recolhe (o rascunho fica)
{ const save = () => { if (!IRP.key) return; const c = irpFind(IRP.key), ta = c && c.querySelector('.irp textarea'); if (ta) IRP.drafts[IRP.key] = ta.value; };
  const _gt = goTab; goTab = function () { save(); irpClose(); return _gt.apply(this, arguments); };
  ['openAnyBook', 'openRdComposer', 'friendPage'].forEach((n) => { try { const f = eval(n); if (typeof f !== 'function') return; const w = function () { save(); irpClose(); return f.apply(this, arguments); }; eval(n + ' = w'); } catch {} });
  window.addEventListener('popstate', () => { save(); irpClose(); }, true);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { save(); irpClose(); } });
}
// Tremor da Comunidade (achado no QA desta rodada): cada refresh() do app (ex.: fillFromCatalog completando livros) redesenhava a
// aba e o v6Root criava um shadow root NOVO; os estilos que outros blocos acrescentam depois (alvos de toque etc.) entravam um
// quadro depois, e o topo e os cartões pulavam ~10–35 px algumas vezes por segundo. Agora a mesma raiz é reaproveitada: o
// conteúdo é repintado igual, sem trocar estilos nem perder o foco do campo de resposta.
{ const _vr = v6Root; v6Root = function (box) {
    try { const cur = box.querySelector(':scope > .v6host'); const keep = S.__v6host;
      if (!cur && keep && keep.shadowRoot && keep.shadowRoot.querySelector('.v6com')) { box.innerHTML = '<div class="gtop-sp"></div>'; box.append(keep); return keep.shadowRoot.querySelector('.v6com'); }
    } catch {}
    const r = _vr.apply(this, arguments); try { S.__v6host = box.querySelector(':scope > .v6host'); } catch {} return r; }; }
