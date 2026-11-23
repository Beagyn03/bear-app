// ---------- v2: painel compacto, leque, deslizar para selecionar, arrastar do carrossel, temas com prévia (Bia, 22/11) ----------
const FLP_IC = (p) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const FLP_I = { pe: FLP_IC('<rect x="9" y="3" width="6" height="18" rx="1"/>'), dei: FLP_IC('<rect x="3" y="14" width="18" height="6" rx="1"/><rect x="5" y="8" width="14" height="5" rx="1"/>'),
  fre: FLP_IC('<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 8h6"/>'), inc: FLP_IC('<path d="m8 21 6-18 4 1.3-6 18z"/>'), mv: FLP_IC('<path d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4"/>'),
  lomb: FLP_IC('<rect x="9" y="3" width="6" height="18" rx="1"/><path d="M9 7h6M9 17h6"/>'), ver: FLP_IC('<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
  tirar: FLP_IC('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'), fr: FLP_IC('<path d="M12 19V5M6 11l6-6 6 6"/>'), tr: FLP_IC('<path d="M12 5v14M6 13l6 6 6-6"/>'),
  tc: FLP_IC('<path d="M4 7h13l-3-3M20 17H7l3 3"/>'), ok: FLP_IC('<path d="m5 12 5 5 9-10"/>') };
// painel do livro e do enfeite: tudo à vista (sem "•••"), compacto, ancorado ao livro com a seta
{ const _pp = flPosPanel; flPosPanel = function () { const r = _pp.apply(this, arguments); try { const sr = shBibRoot(), p = sr && sr.querySelector('.flpos'); if (!p) return r; const f = flFind(FLX.pos); if (!f) return r;
    const o = f.o, P = shc().pos || {}, id = o.t === 'b' ? o.id : o.t === 'p' ? o.ids[0] : null, G = FLX.posG && FLX.posG.length > 1 ? FLX.posG.length : 0;
    const cur = o.t === 'p' ? 'dei' : P[id] === 'face' ? 'fre' : P[id] === 'lean' ? 'inc' : 'pe';
    const B = (k, ic, l, cls, on) => `<button type="button" class="fpb${cls ? ' ' + cls : ''}${on ? ' on' : ''}" data-flp="${k}"${on != null ? ` role="radio" aria-checked="${!!on}"` : ''}>${FLP_I[ic]}<span>${l}</span></button>`;
    const nm = o.t === 'd' ? (SH_DN[o.k] || 'Enfeite') : G ? G + ' livros juntos' : ((shById(id) || {}).t || '');
    p.innerHTML = `<div class="fph2"><span class="fpn">${esc(nm)}</span><button type="button" class="fpok" data-flp="ok" aria-label="Pronto">${FLP_I.ok}</button></div>` + (o.t === 'd'
      ? `<div class="fpg">${B(o.z ? 'dtras' : 'dfrente', o.z ? 'tr' : 'fr', o.z ? 'Atrás' : 'Frente')}${B('mv', 'mv', 'Mover')}${B(o.k === 'leitor' ? 'dvisor' : 'dtroca', 'tc', o.k === 'leitor' ? 'Visor' : 'Trocar')}${B('drem', 'tirar', 'Remover', 'red')}</div>`
      : `<div class="fpg" role="radiogroup" aria-label="Posição">${B('pe', 'pe', 'Em pé', '', cur === 'pe')}${B('dei', 'dei', 'Deitado', '', cur === 'dei')}${B('fre', 'fre', 'De frente', '', cur === 'fre')}${B('inc', 'inc', 'Inclinado', '', cur === 'inc')}</div>`
        + `<div class="fpg">${B('mv', 'mv', 'Mover')}${G ? '' : B('lomb', 'lomb', 'Lombada')}${G ? '' : B('ver', 'ver', 'Ver livro')}${B('tirar', 'tirar', 'Tirar', 'red')}</div>`);
    p.classList.add('fpc3');
    const el = sr.querySelector(`.bsh.flx .fli[data-u="${o.u}"]`); if (el) { const E = el.getBoundingClientRect(), ph = p.offsetHeight, pw = p.offsetWidth, cSide = flColSide(), W = innerWidth - (cSide === 'R' ? 60 : 0), L0 = cSide === 'L' ? 68 : 8;
      let top = E.top - ph - 12, below = false; if (top < 64) { top = Math.min(E.bottom + 12, innerHeight - ph - 8); below = true; }
      const left = Math.max(L0, Math.min(W - pw - 8, E.left + E.width / 2 - pw / 2)); p.style.top = top + 'px'; p.style.left = left + 'px'; p.style.setProperty('--ax', Math.max(16, Math.min(pw - 16, E.left + E.width / 2 - left)) + 'px'); p.classList.toggle('below', below); }
  } catch (e) { console.warn('painel', e); } return r; }; }
window.addEventListener('click', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.flp === 'ver'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const f = flFind(FLX.pos), id = f ? (f.o.t === 'b' ? f.o.id : f.o.ids && f.o.ids[0]) : null; FLX.pos = null; flRender(); if (id) { const e = v5Book(id); if (e) shOpen('v5book', { e }); } } catch (e) { console.warn('ver livro', e); } }, true);
// leque da pilha: tocar num livro tira ele da pilha (em pé, ao lado) e abre o painel dele, em vez de pôr na mão
let FLF_LAST = null;
{ const _fr = flRender; flRender = function () { try { if (FLF_LAST && !FLX.fan && FLX.pk && FLX.pk.from === 'shelf' && FLX.pk.pb && FLX.pk.u === FLF_LAST && !FLX.sel && !FLX.D) { const pk = FLX.pk, F = shc().free, f = flFind(pk.u);
      if (f && f.o.t === 'p') { const pileW = flW(f.o), nb = flExtract(flKeyOf(pk.u, pk.pb)); if (nb) { const row = F.rows[f.r]; nb.x = (f.o.x || 0) + pileW + 2; nb.n = f.o.n || 0; row.it.push(nb); flNormalize(F); shSave(); FLX.pk = null; FLX.pos = nb.u; FLX.posG = null; } } } } catch (e) { console.warn('leque', e); }
  const r = _fr.apply(this, arguments); FLF_LAST = FLX.fan || null; return r; }; }
// segurar ~350 ms num livro e deslizar seleciona o intervalo; no modo Selecionar basta deslizar
let FLS = null;
{ const _px = flPx; flPx = function () { const r = _px.apply(this, arguments); try { const e = window.event; if (e && e.type === 'pointerdown' && SHX_MODE === 'org') { const pid = e.pointerId, x0 = e.clientX, y0 = e.clientY;
      queueMicrotask(() => { const D = FLX.D; if (!D || D.pid !== pid || D.src !== 'shelf' || !D.u) return; const f = flFind(D.u); if (!f || f.o.t === 'd') return; const slide = !!(FLX.sel && FLX.sel.src === 'shelf');
        const go = () => { if (FLX.D !== D || D.on) return; FLX.D = null; FLX.pk = null; FLX.pos = null; const keep = slide && FLX.sel ? FLX.sel.ids : []; FLX.sel = { src: 'shelf', ids: keep }; if (!keep.includes(D.u)) keep.push(D.u); FLS = { pid, x0, y0 }; FLX.swallow = 1; try { navigator.vibrate && navigator.vibrate(14); } catch {} flRender(); };
        if (slide) FLS = { pid, x0, y0, pend: true, go }; else D.slT = setTimeout(go, 350); }); } } catch {} return r; }; }
window.addEventListener('pointermove', (ev) => { if (!FLS || ev.pointerId !== FLS.pid) return; try { if (FLS.pend) { if (Math.hypot(ev.clientX - FLS.x0, ev.clientY - FLS.y0) < 10) return; const g = FLS.go; FLS.pend = false; g(); }
  if (ev.cancelable) ev.preventDefault(); const sr = flR(), el = sr && sr.elementFromPoint(ev.clientX, ev.clientY), fli = el && el.closest && el.closest('.bsh.flx .fli'); if (!fli || fli.classList.contains('fl-d')) return; const u = fli.dataset.u;
  if (FLX.sel && !FLX.sel.ids.includes(u)) { FLX.sel.ids.push(u); try { navigator.vibrate && navigator.vibrate(5); } catch {} flRender(); } } catch {} }, { passive: false });
const flsEnd = (ev) => { if (!FLS || ev.pointerId !== FLS.pid) return; const was = !FLS.pend; FLS = null; if (was) { FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 500); if (FLX.sel && FLX.sel.ids.length > 1) toast(FLX.sel.ids.length + ' livros selecionados · arraste um deles para levar todos'); } };
window.addEventListener('pointerup', flsEnd); window.addEventListener('pointercancel', flsEnd);
// arrastar a miniatura do carrossel direto para o ponto da estante (fica na frente dos livros, onde soltar)
let FLCD = null;
window.addEventListener('pointerdown', (ev) => { try { if (!flActive() || SHX_MODE !== 'deco' || ev.button > 0) return; const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.a === 'dkadd' && n.dataset.k);
  if (b) FLCD = { pid: ev.pointerId, k: b.dataset.k, x0: ev.clientX, y0: ev.clientY, on: false, g: null }; } catch {} }, true);
window.addEventListener('pointermove', (ev) => { const C = FLCD; if (!C || ev.pointerId !== C.pid) return; const dx = Math.abs(ev.clientX - C.x0), dy = Math.abs(ev.clientY - C.y0);
  if (!C.on) { if (dy < 14 && dx < 26) return; if (dx > dy * 1.4 && dy < 30) { FLCD = null; return; } // é rolagem do carrossel
    C.on = true; const g = document.createElement('div'); g.className = 'flcdg'; g.innerHTML = SH_DEC[C.k] ? SH_DEC[C.k](0.9, {}) : ''; (flR() || document.body).append(g); C.g = g; try { navigator.vibrate && navigator.vibrate(10); } catch {} }
  if (ev.cancelable) ev.preventDefault(); C.g.style.left = ev.clientX + 'px'; C.g.style.top = ev.clientY + 'px'; }, { passive: false, capture: true });
const flcdEnd = (ev) => { const C = FLCD; if (!C || ev.pointerId !== C.pid) return; FLCD = null; if (!C.on) return; if (C.g) C.g.remove(); FLX.swallow = 1; setTimeout(() => { FLX.swallow = 0; }, 500);
  try { if (ev.type !== 'pointerup') return; const sr = flR(), el = sr && sr.elementFromPoint(ev.clientX, ev.clientY), bay = el && el.closest && el.closest('.bsh.flx .bay.fl'); if (!bay) return;
    const r = +bay.dataset.r, br = bay.querySelector('.brow'), R = (br || bay).getBoundingClientRect(), F = shc().free, row = F.rows[r]; if (!row) return; const bk = shBk(), o = { u: flUid(), t: 'd', k: C.k, z: 1, n: 0 }, w = flW(o);
    o.x = Math.max(0, Math.min(flNW(row, 0, flBW()) - w, Math.round(ev.clientX - R.left - w / 2))); row.it.push(o); shSave(); flRender(); toast((SH_DN[C.k] || 'Enfeite') + ' na estante', shUndo(bk)); } catch (e) { console.warn('arrastar enfeite', e); } };
window.addEventListener('pointerup', flcdEnd, true); window.addEventListener('pointercancel', flcdEnd, true);
window.addEventListener('click', (ev) => { try { if (FLX && FLX.swallow) { const p = ev.composedPath ? ev.composedPath() : []; if (p.find((n) => n && n.dataset && n.dataset.a === 'dkadd')) { ev.stopImmediatePropagation(); ev.preventDefault(); } } } catch {} }, true);
// ---------- temas: tocar já mostra a prévia na estante; miniatura da peça principal ----------
const TZ_MAIN = { natal: 'ia_natal_redoma', terror: 'ia_terror_abobora', romance: 'ia_romance_rosas', fantasia: 'ia_fantasia_dragao', misterio: 'ia_fantasia_lamparina', aconchego: 'ia_basicos_gato', encantado: 'ia_encantado_dragao' };
{ const _ap = tzApply; tzApply = function (id) { const r = _ap.apply(this, arguments);
    try { const sr = shBibRoot(), sh = sr && sr.querySelector('.bsh'); if (sh) { const R = sh.getBoundingClientRect(); if (R.top < 60 || R.top > innerHeight * 0.4) sh.scrollIntoView({ block: 'start', behavior: 'smooth' }); } } catch {} return r; }; }
// tocar no chip do tema = abrir + aplicar a prévia
window.addEventListener('click', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.tz === 'open'); if (!b) return; const k = b.dataset.k; ev.stopImmediatePropagation(); ev.preventDefault();
  TZ_OPEN = k; tzApply(k); setTimeout(() => { try { flRender(); } catch {} tzRepaint(); }, 80); } catch (e) { console.warn('tema', e); } }, true);
// fechar a faixa de Temas sem manter desfaz a prévia
{ const _fr = flRender; flRender = function () { try { if (TZ_PV && typeof FLX !== 'undefined' && FLX.car !== 'temas') tzCancel(); } catch {} return _fr.apply(this, arguments); }; }
// chips de tema viram miniaturas da peça principal com o nome embaixo
{ const _h = tzHTML; tzHTML = function () { let h = _h.apply(this, arguments); try { h = h.replace(/<button type="button" class="tzc([^"]*)" data-tz="open" data-k="([a-z]+)"([^>]*)>([^<]*)<\/button>/g, (m, cls, k, rest, l) => { const mk = TZ_MAIN[k];
      return `<button type="button" class="tzc tzm${cls}" data-tz="open" data-k="${k}"${rest}><span class="tzv th">${mk && SH_DEC[mk] ? SH_DEC[mk](0.5) : ''}</span><small>${l}</small></button>`; }); } catch {} return h; }; }
const FLP_CSS = `.v4ler .flpos.fpc3{width:auto!important;max-width:calc(100vw - 84px);padding:6px!important}
.v4ler .flpos.fpc3 .fph2{display:flex;align-items:center;gap:6px;margin:0 2px 4px}.v4ler .flpos.fpc3 .fpn{flex:1;min-width:0;font-size:11.5px;font-weight:700;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v4ler .flpos.fpc3 .fpok{width:44px;height:44px;margin:-6px -4px -6px 0;border-radius:50%;border:0;background:var(--acc);color:var(--on-acc,#fff);display:grid;place-items:center;cursor:pointer;flex:none}
.v4ler .flpos.fpc3 .fpg{display:grid;grid-template-columns:repeat(4,64px);gap:4px}.v4ler .flpos.fpc3 .fpg+.fpg{margin-top:4px}
.v4ler .flpos.fpc3 .fpb{height:46px;min-height:0!important;border-radius:10px;border:1px solid var(--line);background:var(--soft,rgba(127,127,127,.12));color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0!important;font:inherit;font-size:10.5px;font-weight:700;line-height:1;cursor:pointer}
.v4ler .flpos.fpc3 .fpb.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}.v4ler .flpos.fpc3 .fpb.red{color:#e5675a}
@media (max-width:370px){.v4ler .flpos.fpc3 .fpg{grid-template-columns:repeat(4,58px)}}
.flcdg{position:fixed;z-index:10050;pointer-events:none;transform:translate(-50%,-80%) scale(1.05);filter:drop-shadow(0 10px 14px rgba(0,0,0,.45));opacity:.92}
.v4ler .dkpan .tzsec .tzc.tzm,.v4ler .dkpan.flcar .dbody button.tzc.tzm{width:86px!important;height:96px!important;max-height:96px!important;border-radius:14px!important;display:flex!important;flex-direction:column;align-items:center;justify-content:flex-start;gap:3px;padding:6px 4px!important;font-size:11px}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-flp3]')) { const st = document.createElement('style'); st.dataset.flp3 = 1; st.textContent = FLP_CSS; sr.append(st); } } catch {} }; }
// prévia de tema e Desfazer: a prévia não entra no histórico; Desfazer cancela a prévia; Manter vira um passo só.
// Trocar de tema durante a prévia e depois cancelar volta à estante de antes da primeira prévia.
let TZ_H = null;
{ const _ap = tzApply; tzApply = function () { const first = !TZ_PV; if (first) TZ_H = { hb: shBk() }; FLH_LOCK++; let r; try { r = _ap.apply(this, arguments); } finally { FLH_LOCK--; } return r; }; }
{ const _k = tzKeep; tzKeep = function () { const h = TZ_H; FLH_LOCK++; let r; try { r = _k.apply(this, arguments); } finally { FLH_LOCK--; }
    try { if (h) { FLH_U.push(h.hb); if (FLH_U.length > 40) FLH_U.shift(); FLH_R = []; const b = shBk(); FLH_CUR = { bk: b, js: JSON.stringify(b) }; flhPaint(); } } catch {} TZ_H = null; return r; }; }
{ const _c = tzCancel; tzCancel = function () { FLH_LOCK++; let r; try { r = _c.apply(this, arguments); } finally { FLH_LOCK--; } try { const b = shBk(); FLH_CUR = { bk: b, js: JSON.stringify(b) }; flhPaint(); } catch {} TZ_H = null; return r; }; }
{ const _g = flhGo; flhGo = function (dir) { if (TZ_PV && dir < 0) { tzCancel(); try { flRender(); } catch {} return toast('Prévia do tema desfeita'); } return _g.apply(this, arguments); }; }
{ const _p = flhPaint; flhPaint = function () { _p.apply(this, arguments); try { const c = flQ('.v5est > .flcol'); if (!c) return; const u = c.querySelector('[data-fl="undo"]'), r = c.querySelector('[data-fl="redo"]'); if (u && TZ_PV) u.classList.remove('off'); [u, r].forEach((b) => { if (b) b.setAttribute('aria-disabled', b.classList.contains('off') ? 'true' : 'false'); }); } catch {} }; }
{ const _a = tzApply; tzApply = function () { const r = _a.apply(this, arguments); try { flhPaint(); } catch {} return r; }; }
