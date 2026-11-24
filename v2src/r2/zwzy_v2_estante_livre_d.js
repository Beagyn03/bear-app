// ---------- estante livre D (Bia, 22/11): desfazer/refazer sempre à mão, pilha em leque, enfeite na frente ----------
// histórico: cada gravação no Organizar/Decorar guarda o estado anterior (até 40 passos); ↶ ↷ na coluna lateral
let FLH_U = [], FLH_R = [], FLH_CUR = null, FLH_LOCK = 0, FLH_MD = null, FLH_T = 0;
// o passo do Desfazer guarda a estante como estava no toque que começou a ação (o redesenho recalcula posições sem salvar)
let FLH_PRE = null;
window.addEventListener('pointerdown', () => { try { if (flhOn() && !FLH_LOCK) { const b = shBk(); FLH_PRE = { bk: b, js: JSON.stringify(b) }; } } catch {} }, true);
const flhOn = () => { try { return flActive() && (SHX_MODE === 'org' || SHX_MODE === 'deco'); } catch { return false; } };
{ const _s = shSave; shSave = function () { const r = _s.apply(this, arguments);
    try { if (flhOn() && !FLH_LOCK && !FL_PV) { const cur = shBk(), js = JSON.stringify(cur); // gravações em sequência (a mesma ação salva 2-3 vezes) viram um passo só
      if (FLH_CUR && FLH_CUR.js !== js) { const now = Date.now(); if (now - FLH_T > 600 || !FLH_U.length) { FLH_U.push(FLH_PRE && FLH_PRE.js !== js ? FLH_PRE.bk : FLH_CUR.bk); if (FLH_U.length > 40) FLH_U.shift(); } FLH_PRE = null; FLH_T = now; FLH_R = []; FLH_CUR = { bk: cur, js }; } else if (!FLH_CUR) FLH_CUR = { bk: cur, js }; flhPaint(); } } catch (err) { console.warn('estante: histórico', err); }
    return r; }; }
function flhReset() { FLH_U = []; FLH_R = []; try { const b = shBk(); FLH_CUR = { bk: b, js: JSON.stringify(b) }; } catch { FLH_CUR = null; } }
function flhGo(dir) { const from = dir < 0 ? FLH_U : FLH_R, to = dir < 0 ? FLH_R : FLH_U; if (!from.length) return toast(dir < 0 ? 'Nada para desfazer' : 'Nada para refazer');
  const now = shBk(); to.push(now); const bk = from.pop(); FLH_LOCK = 1; try { if (window.flCancelDrag) window.flCancelDrag(); FLX.pk = null; FLX.pos = null; FLX.sel = null; FLX.fan = null; shRestore(bk); } finally { FLH_LOCK = 0; }
  FLH_CUR = { bk: JSON.parse(JSON.stringify(bk)), js: JSON.stringify(bk) }; try { navigator.vibrate && navigator.vibrate(6); } catch {} flhPaint(); }
function flhPaint() { try { const c = flQ('.v5est > .flcol'); if (!c) return; const u = c.querySelector('[data-fl="undo"]'), r = c.querySelector('[data-fl="redo"]'); if (u) u.classList.toggle('off', !FLH_U.length); if (r) r.classList.toggle('off', !FLH_R.length); } catch {} }
const FLH_IC = { u: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/></svg>',
  r: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/></svg>' };
{ const _c = flColHTML; flColHTML = function () { let h = _c.apply(this, arguments); try {
    const B = (k, ic, lab, off) => `<button type="button" class="flcb flh${off ? ' off' : ''}" data-fl="${k}" aria-label="${lab}">${ic}<span class="flbl" aria-hidden="true">${lab}</span></button>`;
    h = h.replace(/(<button[^>]*data-a="shdone"[\s\S]*?<\/button>)/, `$1${B('undo', FLH_IC.u, 'Desfazer', !FLH_U.length)}${B('redo', FLH_IC.r, 'Refazer', !FLH_R.length)}`); } catch (err) { console.warn('estante: coluna', err); } return h; }; }
{ const _a = flAct; flAct = function (k) { if (k === 'undo') return flhGo(-1); if (k === 'redo') return flhGo(1); return _a.apply(this, arguments); }; }
// entrar/sair do modo zera o histórico (desfazer vale para a sessão de edição)
{ const _sd = shDraw; shDraw = function () { if (SHX_MODE !== FLH_MD) { FLH_MD = SHX_MODE; flhReset(); } const r = _sd.apply(this, arguments); flhPaint(); return r; }; }
// Ctrl+Z / Ctrl+Shift+Z no computador
window.addEventListener('keydown', (ev) => { if (!flhOn() || !(ev.ctrlKey || ev.metaKey) || String(ev.key).toLowerCase() !== 'z') return; const T = flTgt(ev); if (T && T.closest && T.closest('input,textarea,[contenteditable]')) return; ev.preventDefault(); ev.stopImmediatePropagation(); flhGo(ev.shiftKey ? 1 : -1); }, true);

const SHX_CSSFLD = `
.v4ler .flcol .flcb.flh{width:40px;height:40px}.v4ler .flcol .flcb.flh.off{opacity:.38}
.v4ler .bsh.flx .fli.flz{z-index:4}.v4ler .bsh.flx .fli.flz .dec{filter:drop-shadow(0 4px 5px rgba(0,0,0,.45))}
.v4ler .bsh.flx .fli.fl-p.flfan{z-index:6}
.v4ler .bsh.flx .fli.fl-p.flfan .pile{display:flex;flex-direction:column;gap:9px;padding:10px 8px;border-radius:12px;background:color-mix(in srgb,var(--card) 82%,transparent);box-shadow:0 10px 26px rgba(0,0,0,.45);transform:translateY(-6px);transition:transform .18s ease}
.v4ler .bsh.flx .fli.fl-p.flfan .pb{min-height:30px;margin-left:0!important;border-radius:4px;outline:1.5px solid color-mix(in srgb,var(--acc) 55%,transparent)}
.v4ler .bsh.flx .fli.fl-p.flfan .pb>span{font-size:11px}
@media (prefers-reduced-motion:reduce){.v4ler .bsh.flx .fli.fl-p.flfan .pile{transition:none}}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shxfld]')) { const st = document.createElement('style'); st.dataset.shxfld = 1; st.textContent = SHX_CSSFLD; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-shxfld]')) { const st = document.createElement('style'); st.dataset.shxfld = 1; st.textContent = SHX_CSSFLD; sr.append(st); } }); } catch {}
try { window.__flT = { shc: () => shc(), FLX: () => FLX, flFind: (u) => flFind(u), hist: () => ({ u: FLH_U.length, r: FLH_R.length }), flR: () => flR(), cover: (id) => { const b = shById(id); return b && b.img ? b.img : null; } }; } catch {}

// ---------- Decorar: categorias na coluna lateral + carrossel que sai dela (Bia, 22/11) ----------
const FLC_SV = (p) => `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const FLC_CATS = [
  ['enf', 'Enfeites', FLC_SV('<path d="M12 20v-7"/><path d="M12 13c-3 0-5-2-5-5 3 0 5 2 5 5Z"/><path d="M12 11c0-3 2-6 6-6 0 4-3 6-6 6Z"/><path d="M8 20h8"/>')],
  ['temas', 'Temas', FLC_SV('<path d="m12 3 2.6 5.6 6 .6-4.5 4 1.3 6L12 16.3 6.6 19.2l1.3-6-4.5-4 6-.6Z"/>')],
  ['leitor', 'Leitor digital', FLC_SV('<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 7h6M9 10h6M9 13h4"/>')],
  ['luz', 'Luzinhas', FLC_SV('<path d="M3 6c4 4 14 4 18 0"/><circle cx="7" cy="11" r="1.6"/><circle cx="12" cy="12.5" r="1.6"/><circle cx="17" cy="11" r="1.6"/>')],
  ['plq', 'Plaquinhas', FLC_SV('<rect x="4" y="8" width="16" height="8" rx="2"/><path d="M8 12h8"/>')],
  ['est', 'Estrutura', FLC_SV('<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 12h16M12 4v8"/>')],
  ['lomb', 'Lombadas', FLC_SV('<rect x="5" y="4" width="4" height="16" rx="1"/><rect x="10" y="6" width="4" height="14" rx="1"/><path d="m15.5 6.5 3.5 13"/>')],
  ['mad', 'Madeira', FLC_SV('<path d="M3 8h18M3 16h18"/><path d="M6 8v8M18 8v8"/>')],
  ['par', 'Parede', FLC_SV('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 4v16"/>')]];
let FLC_SCR = {};
{ const _c = flColHTML; flColHTML = function () { let h = _c.apply(this, arguments); try { if (SHX_MODE !== 'deco') return h;
    const cats = FLC_CATS.map(([k, l, ic]) => `<button type="button" class="flcb flcat${FLX.car === k ? ' on' : ''}" data-fl="car" data-k="${k}" aria-pressed="${FLX.car === k}" aria-label="${l}">${ic}<span class="flbl" aria-hidden="true">${l}</span></button>`).join('');
    h = h.replace(/<button[^>]*data-a="shmode" data-v="org"[\s\S]*?<\/button>/, '').replace(/(<button[^>]*data-fl="redo"[\s\S]*?<\/button>)/, `$1${cats}`).replace('class="flcol ', 'class="flcol fldk '); } catch (err) { console.warn('decorar: coluna', err); } return h; }; }
{ const _a = flAct; flAct = function (k, el) { if (k !== 'car') return _a.apply(this, arguments); const c = el && el.dataset.k; if (!c) return;
    if (c === 'leitor') { FLX.car = null; const F = shc().free; let u = null; (F ? F.rows : []).forEach((rw) => rw.it.forEach((o) => { if (!u && o.t === 'd' && o.k === 'leitor') u = o.u; }));
      if (u) return flDecoSheet(u); try { flDecoAdd('leitor'); const F2 = shc().free; (F2 ? F2.rows : []).forEach((rw) => rw.it.forEach((o) => { if (!u && o.t === 'd' && o.k === 'leitor') u = o.u; })); if (u) setTimeout(() => flDecoSheet(u), 250); } catch {} return; }
    FLX.car = FLX.car === c ? null : c; if (FLX.car) SHX_DKT = c === 'temas' ? 'enf' : c; try { navigator.vibrate && navigator.vibrate(6); } catch {} return flRender(); }; }
// o carrossel é a mesma folha de antes, numa faixa compacta: só a categoria tocada, sem abas nem rodapé
{ const _dp = dkPanel; dkPanel = function () { const h0 = _dp.apply(this, arguments); try { if (!flActive() || SHX_MODE !== 'deco') return h0; if (!FLX.car) return '';
    let h = h0.replace(/<div class="dtabs[^"]*" role="tablist">[\s\S]*?<\/div>/, '').replace('class="dkpan', `class="dkpan flcar fc-${FLX.car} ${flColSide() === 'L' ? 'cL' : 'cR'}`);
    return h; } catch (err) { console.warn('decorar: carrossel', err); return h0; } }; }
// guarda a rolagem do carrossel por categoria: tocar numa opção redesenha e a faixa volta para onde estava
{ const _sd = shDraw; shDraw = function () { try { const b = flQ('.dkpan.flcar .dbody'); if (b && FLX.car) FLC_SCR[FLX.car] = b.scrollLeft; } catch {} if (SHX_MODE !== 'deco') FLX.car = null;
    const r = _sd.apply(this, arguments); try { const b = flQ('.dkpan.flcar .dbody'); if (b && FLX.car && FLC_SCR[FLX.car]) b.scrollLeft = FLC_SCR[FLX.car];
      const R = flQ('.v5est'); if (R && SHX_MODE === 'deco' && flActive()) { const sp = [...R.querySelectorAll('div[aria-hidden="true"]')].find((d) => /vh/.test(d.getAttribute('style') || '') && d.offsetHeight > 60); if (sp) sp.style.height = FLX.car ? '24vh' : '10vh'; } } catch {} return r; }; }
// tocar na estante fora do carrossel fecha
window.addEventListener('click', (ev) => { try { if (!flActive() || SHX_MODE !== 'deco' || !FLX.car) return; const T = flTgt(ev); if (!T || !T.closest || !T.closest('.v5est')) return; if (T.closest('.dkpan, .flcol, .bsh.flx .fli, .bsh.flx .ndv, .bsh.flx .plq, .shx-sx')) return;
    if (T.closest('.bsh.flx')) { FLX.car = null; flRender(); } } catch {} }, true);
const SHX_CSSFLC = `
.v4ler .flcol.fldk{gap:4px;max-height:calc(100vh - 170px);overflow-y:auto;scrollbar-width:none}.v4ler .flcol.fldk::-webkit-scrollbar{display:none}
.v4ler .flcol.fldk .flcb{width:40px;height:40px}.v4ler .flcol .flcb.flcat.on{background:var(--acc);color:var(--on-acc,#1b1426)}
.v4ler .dkpan.flcar{position:fixed!important;top:auto!important;bottom:calc(84px + env(safe-area-inset-bottom,0px))!important;width:calc(100vw - 92px)!important;max-width:520px;height:auto!important;max-height:none!important;margin:0!important;padding:8px 8px 6px!important;border-radius:18px!important;box-shadow:0 10px 28px rgba(0,0,0,.42)!important;transform:none!important;animation:flcarin .16s ease-out;z-index:9400}
.v4ler .dkpan.flcar.cR{right:calc(64px + env(safe-area-inset-right,0px))!important;left:auto!important}.v4ler .dkpan.flcar.cL{left:calc(64px + env(safe-area-inset-left,0px))!important;right:auto!important}
.v4ler .dkpan.flcar .grab,.v4ler .dkpan.flcar .flgrab2,.v4ler .dkpan.flcar .dtabs,.v4ler .dkpan.flcar .dkfoot,.v4ler .dkpan.flcar .dkh,.v4ler .dkpan.flcar .dsec,.v4ler .dkpan.flcar .tzhint,.v4ler .dkpan.flcar p{display:none!important}
.v4ler .dkpan.flcar .dbody{display:flex!important;flex-wrap:nowrap;align-items:stretch;gap:8px;overflow-x:auto;overflow-y:hidden;max-height:none!important;padding:0 2px 4px;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
.v4ler .dkpan.flcar .dbody>div,.v4ler .dkpan.flcar .dkgrid,.v4ler .dkpan.flcar .dsw,.v4ler .dkpan.flcar .tzsec,.v4ler .dkpan.flcar .tzits,.v4ler .dkpan.flcar .tzchips{display:contents!important}
.v4ler .dkpan.flcar .dbody button{flex:0 0 auto;width:86px;height:96px;min-height:0;max-height:96px;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:3px;padding:6px 4px!important;scroll-snap-align:start;font-size:11px;line-height:1.15}
.v4ler .dkpan.flcar.fc-enf .tzsec{display:none!important}.v4ler .dkpan.flcar.fc-temas .dkgrid{display:none!important}
.v4ler .dkpan.flcar .dbody button .th,.v4ler .dkpan.flcar .dbody button .sw,.v4ler .dkpan.flcar .dbody button .tzth{display:block;width:56px!important;height:54px!important;max-height:54px;flex:none;overflow:hidden}.v4ler .dkpan.flcar .dbody button .th svg{max-width:56px;max-height:54px}
.v4ler .v5est .dkpan.flcar .dtabs,.v4ler .v5est .dkpan.flcar .dtabs.six,.v4ler .v5est .dkpan.flcar .dkfoot{display:none!important}
.v4ler .dkpan.flcar.fc-temas .dbody button.tzc{width:auto;height:40px;min-height:0;max-height:40px;padding:0 14px!important;border-radius:20px;justify-content:center;align-self:center;font-size:13px;font-weight:700}.v4ler .dkpan.flcar.fc-temas .tzact{display:flex!important;flex:none;gap:6px;align-items:center}.v4ler .dkpan.flcar.fc-temas .tzact button{width:auto;height:40px;min-height:0;padding:0 12px!important;align-self:center}
.v4ler .dkpan.flcar.fc-temas .tzact{position:absolute!important;left:6px;right:6px;bottom:calc(100% + 6px);display:flex!important;flex-wrap:nowrap!important;gap:6px;align-items:center;padding:6px 6px 6px 12px;border-radius:14px;background:var(--card,#1f1a2b);border:1px solid var(--line);box-shadow:0 8px 22px rgba(0,0,0,.35);z-index:2}.v4ler .dkpan.flcar.fc-temas .tzact .tzmsg{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;font-weight:800;color:var(--ink)}.v4ler .dkpan.flcar.fc-temas .tzact button,.v4ler .dkpan.flcar.fc-temas .dbody .tzact button{flex:none!important;display:inline-flex!important;flex-direction:row!important;align-items:center!important;justify-content:center!important;width:auto!important;min-width:0!important;height:40px!important;min-height:40px!important;max-height:40px!important;padding:0 12px!important;border-radius:12px!important;font-size:13px!important;font-weight:800!important;white-space:nowrap}@media (max-width:370px){.v4ler .dkpan.flcar.fc-temas .tzact button{padding:0 10px!important}}
@keyframes flcarin{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.v4ler .dkpan.flcar{animation:none}}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shxflc]')) { const st = document.createElement('style'); st.dataset.shxflc = 1; st.textContent = SHX_CSSFLC; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-shxflc]')) { const st = document.createElement('style'); st.dataset.shxflc = 1; st.textContent = SHX_CSSFLC; sr.append(st); } }); } catch {}
window.addEventListener('pointerdown', () => { try { if (!FLX.car) return; const b = flQ('.dkpan.flcar .dbody'); if (b) FLC_SCR[FLX.car] = b.scrollLeft; } catch {} }, true);
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { const k = FLX.car, v = k && FLC_SCR[k]; if (v) { const put = () => { const b = flQ('.dkpan.flcar .dbody'); if (b && Math.abs(b.scrollLeft - v) > 2) b.scrollLeft = v; }; put(); requestAnimationFrame(put); setTimeout(put, 120); } } catch {} return r; }; }

// ---------- Organizar: "Arrumar por" e "•••" saem da coluna (carrossel/popover), nada embaixo (Bia, 22/11) ----------
// "•••" da coluna (Organizar e Decorar): as mesmas ações, num popover ao lado da coluna em vez da folha de baixo
let FL_POPAT = null;
function flPop(title, items, at) { const R = flQ('.v5est'); if (!R) return; R.querySelectorAll('.flpop').forEach((e) => e.remove()); const p = document.createElement('div'); p.className = 'flpop ' + (flColSide() === 'L' ? 'cL' : 'cR'); p.setAttribute('role', 'menu'); p.setAttribute('aria-label', title || 'Opções');
  p.innerHTML = `<b>${esc(title || '')}</b>` + items.filter(Boolean).map(([l], i) => `<button type="button" role="menuitem" data-i="${i}">${esc(l)}</button>`).join('');
  const L = items.filter(Boolean); R.appendChild(p); try { const q = at.getBoundingClientRect(); p.style.top = Math.max(70, Math.min(innerHeight - p.offsetHeight - 90, q.top + q.height / 2 - p.offsetHeight / 2)) + 'px'; } catch {}
  const off = (ev) => { const ph = ev.composedPath ? ev.composedPath() : []; if (ph.includes(p)) return; p.remove(); document.removeEventListener('pointerdown', off, true); };
  setTimeout(() => document.addEventListener('pointerdown', off, true), 0);
  p.addEventListener('click', (ev) => { ev.stopPropagation(); const b = ev.target.closest('[data-i]'); if (!b) return; p.remove(); document.removeEventListener('pointerdown', off, true); const it = L[+b.dataset.i]; try { it[1](); } catch (err) { console.warn('estante: menu', err); } });
  p.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); p.remove(); } }); const f = p.querySelector('button'); if (f) f.focus(); }
{ const _x = shX; shX = function (title, items) { if (FL_POPAT && flActive() && (SHX_MODE === 'org' || SHX_MODE === 'deco')) { const at = FL_POPAT; FL_POPAT = null; return flPop(title, items, at); } return _x.apply(this, arguments); }; }
{ const _a = flAct; flAct = function (k, el) { if ((k === 'more' || k === 'dkmore') && el) { FL_POPAT = el; try { return _a.apply(this, arguments); } finally { FL_POPAT = null; } } return _a.apply(this, arguments); }; }
// o "Arrumar por" vira carrossel ao lado da coluna: Plaquinhas (chip) · critérios · ✓ Arrumar · ×
{ const _ar = flArrSheet; flArrSheet = function () { const r = _ar.apply(this, arguments); try { const w = FL_ARRW; if (w) { w.classList.add('flcar2', flColSide() === 'L' ? 'cL' : 'cR'); const fix = () => { const go = w.querySelector('.argo'); if (go && !/✓/.test(go.textContent)) go.textContent = '✓ Arrumar'; };
      fix(); new MutationObserver(fix).observe(w, { childList: true, subtree: true }); } } catch {} return r; }; }
const SHX_CSSFLA = `
.v4ler .shx-sx.flarr.flcar2{position:fixed!important;left:auto;right:auto;top:auto!important;bottom:calc(84px + env(safe-area-inset-bottom,0px))!important;width:calc(100vw - 92px)!important;max-width:520px;margin:0!important;padding:8px!important;border-radius:18px!important;box-shadow:0 10px 28px rgba(0,0,0,.42)!important;transform:none!important;z-index:9400;max-height:none!important}
.v4ler .shx-sx.flarr.flcar2.cR{right:calc(64px + env(safe-area-inset-right,0px))!important}.v4ler .shx-sx.flarr.flcar2.cL{left:calc(64px + env(safe-area-inset-left,0px))!important}
.v4ler .flarr.flcar2>div{display:flex!important;align-items:center;gap:6px;overflow-x:auto;scrollbar-width:none;flex-wrap:nowrap}.v4ler .flarr.flcar2>div::-webkit-scrollbar{display:none}
.v4ler .flarr.flcar2 .sxh{order:4;flex:none;margin:0!important}.v4ler .flarr.flcar2 .sxh b{display:none}
.v4ler .flarr.flcar2 .arg,.v4ler .flarr.flcar2 .arft{display:contents!important}
.v4ler .flarr.flcar2 .arsw{order:0;flex:none;min-height:44px;padding:0 10px;border:1px solid var(--line);border-radius:12px;background:var(--card)}
.v4ler .flarr.flcar2 .arg button{order:1}
.v4ler .flarr.flcar2 .argo{order:3;flex:none!important;min-height:44px;padding:0 16px!important;border-radius:12px;font-weight:900;white-space:nowrap}
.v4ler .flarr.flcar2 .argo:not([disabled]){background:var(--acc)!important;color:var(--on-acc,#1b1426)!important;opacity:1!important;box-shadow:0 3px 10px color-mix(in srgb,var(--acc) 45%,transparent)}
.v4ler .flarr.flcar2 .argo[disabled]{opacity:.45}
.v4ler .bsh.flx .fli.flnew{animation:flnew 1.4s ease-out}@keyframes flnew{0%,60%{filter:drop-shadow(0 0 10px var(--acc)) drop-shadow(0 0 4px var(--acc))}100%{filter:none}}
.v4ler .flpop{position:fixed;z-index:9600;display:grid;gap:2px;min-width:210px;max-width:min(300px,calc(100vw - 96px));padding:8px;border-radius:16px;background:var(--card);color:var(--ink);border:1px solid var(--line);box-shadow:0 12px 30px rgba(0,0,0,.4);animation:flcarin .14s ease-out}
.v4ler .flpop.cR{right:calc(64px + env(safe-area-inset-right,0px))}.v4ler .flpop.cL{left:calc(64px + env(safe-area-inset-left,0px))}
.v4ler .flpop b{font-size:12px;color:var(--ink2);padding:4px 8px 2px;font-weight:800}
.v4ler .flpop button{text-align:left;min-height:44px;padding:8px 10px;border:0;border-radius:10px;background:transparent;color:var(--ink);font:inherit;font-weight:700;font-size:14px;cursor:pointer}.v4ler .flpop button:hover,.v4ler .flpop button:focus-visible{background:color-mix(in srgb,var(--acc) 16%,transparent)}
.v5est.flmode.flcolR .bsh.flx{margin-right:44px!important}.v5est.flmode.flcolL .bsh.flx{margin-left:44px!important}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shxfla]')) { const st = document.createElement('style'); st.dataset.shxfla = 1; st.textContent = SHX_CSSFLA; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-shxfla]')) { const st = document.createElement('style'); st.dataset.shxfla = 1; st.textContent = SHX_CSSFLA; sr.append(st); } }); } catch {}
// a margem da coluna entra na largura já no 1º desenho do modo (senão os livros da borda ficam atrás da coluna)
{ const _bw = flBW; flBW = function () { let w = _bw.apply(this, arguments); try { const R = flQ('.v5est'), ed = (SHX_MODE === 'org' || SHX_MODE === 'deco') && flActive(), has = R && R.classList.contains('flmode') && (R.classList.contains('flcolR') || R.classList.contains('flcolL')); if (ed && !has) w -= 44; else if (!ed && has) w += 44; } catch {} return Math.max(200, w); }; }

// ---------- Arrumar por: mais critérios, ordem invertível (tocar de novo no chip), desempate pelo título (Bia, 22/11) ----------
let FL_REV = false;
const flRaw = (id) => { try { return v5Book(id) || {}; } catch { return {}; } };
const flSerOf = (b) => { const e = flRaw(b.id), m = e.meta || {}; const s = e.series || m.series || m.serie || ''; if (s) return { s: String(s), v: +(e.seriesIndex || m.seriesIndex || m.volume || 0) || 0 };
  const t = String(b.t || ''), mm = t.match(/\(([^()#]+?),?\s*#\s*(\d+(?:[.,]\d+)?)\)\s*$/); return mm ? { s: mm[1].trim(), v: parseFloat(mm[2].replace(',', '.')) } : null; };
function flArrOpts() { const ids = shAllIds(), hasFmt = ids.some((id) => flRaw(id).format), hasSer = ids.some((id) => { const b = shById(id); return b && flSerOf(b); });
  return [['sit', 'Situação'], ['data', 'Data de conclusão'], ['genero', 'Gênero'], ['autor', 'Autor'], ['cor', 'Cor'], ['titulo', 'Título'], ['nota', 'Nota'], ['pag', 'Páginas'], ['entrada', 'Data de entrada']]
    .concat(hasFmt ? [['formato', 'Formato']] : []).concat(hasSer ? [['serie', 'Série']] : []).concat([['altura', 'Altura']]); }
{ const _s = flSortArr; flSortArr = function (k) { const col = (x, y) => String(x).localeCompare(String(y), 'pt', { sensitivity: 'base' }), art = (t) => String(t || '').replace(/^(o|a|os|as|um|uma|the)\s+/i, '');
    let out = null; const B = () => shAllIds().map((id, i) => ({ ...shById(id), i })).filter((b) => b.id), tt = (x, y) => col(art(x.t), art(y.t));
    if (k === 'genero') { const g = (b) => { try { return v2Genre(flRaw(b.id)) || ''; } catch { return ''; } }; const S = B().sort((x, y) => (g(x) ? 0 : 1) - (g(y) ? 0 : 1) || col(g(x), g(y)) || tt(x, y)); out = { S, lab: (b) => g(b) || 'Sem gênero', none: 'Sem gênero' }; }
    else if (k === 'nota') { const n = (b) => { const e = flRaw(b.id), r = e.review || e.rv || {}; const v = +(r.paws ?? r.nota ?? e.paws ?? 0) || 0; return v; }; const S = B().sort((x, y) => (n(x) ? 0 : 1) - (n(y) ? 0 : 1) || n(y) - n(x) || tt(x, y));
      out = { S, lab: (b) => { const v = n(b); return !v ? 'Sem nota' : v >= 5 ? '★5' : v >= 4 ? '★4' : v >= 3 ? '★3' : 'menos de 3'; }, none: 'Sem nota' }; }
    else if (k === 'pag') { const p = (b) => +flRaw(b.id).totalPages || 0; const S = B().sort((x, y) => (p(x) ? 0 : 1) - (p(y) ? 0 : 1) || p(x) - p(y) || tt(x, y)); out = { S, lab: (b) => { const v = p(b); return !v ? 'Sem páginas' : v < 200 ? 'até 200 pág.' : v < 400 ? '200–400 pág.' : v < 600 ? '400–600 pág.' : '600+ pág.'; }, none: 'Sem páginas' }; }
    else if (k === 'entrada') { const d = (b) => { const e = flRaw(b.id); return String(e.addedAt || e.createdAt || e.added || ''); }; const S = B().sort((x, y) => (d(x) ? 0 : 1) - (d(y) ? 0 : 1) || d(y).localeCompare(d(x)) || x.i - y.i); out = { S, lab: (b) => (d(b) ? d(b).slice(0, 4) : 'Sem data'), none: 'Sem data' }; }
    else if (k === 'formato') { const F = { fisico: 'Físico', ebook: 'E-book', audio: 'Audiolivro' }, f = (b) => { const v = String(flRaw(b.id).format || '').toLowerCase(); return /e-?book|kindle/.test(v) ? 'ebook' : /aud/.test(v) ? 'audio' : v ? 'fisico' : ''; };
      const S = B().sort((x, y) => (f(x) ? 0 : 1) - (f(y) ? 0 : 1) || col(f(x), f(y)) || tt(x, y)); out = { S, lab: (b) => F[f(b)] || 'Sem formato', none: 'Sem formato' }; }
    else if (k === 'serie') { const S = B().sort((x, y) => { const a = flSerOf(x), z = flSerOf(y); return (a ? 0 : 1) - (z ? 0 : 1) || col(a ? a.s : '', z ? z.s : '') || ((a && a.v) || 0) - ((z && z.v) || 0) || tt(x, y); }); out = { S, lab: (b) => { const a = flSerOf(b); return a ? a.s : 'Sem série'; }, none: 'Sem série' }; }
    else out = _s.apply(this, arguments);
    if (k === 'data' && !out.none) out.none = 'Sem data';
    if (FL_REV && out && out.S) { const none = out.none, lab = out.lab || (() => ''); const has = out.S.filter((b) => !none || lab(b) !== none), sem = out.S.filter((b) => none && lab(b) === none); out = { ...out, S: has.reverse().concat(sem) }; }
    return out; }; }
// enfeite novo: rola até ele e pisca, para já poder arrastar (inclusive com a estante arrumada e cheia)
{ const _da = flDecoAdd; flDecoAdd = function () { const before = new Set(); try { shc().free.rows.forEach((rw) => rw.it.forEach((o) => before.add(o.u))); } catch {} const r = _da.apply(this, arguments);
    try { let nu = null; shc().free.rows.forEach((rw) => rw.it.forEach((o) => { if (!before.has(o.u) && o.t === 'd') nu = o.u; })); if (nu) setTimeout(() => { const e = flQ(`.bsh.flx .fli[data-u="${nu}"]`); if (!e) return; e.scrollIntoView({ block: 'center', behavior: 'smooth' }); e.classList.add('flnew'); setTimeout(() => e.classList.remove('flnew'), 1600); }, 120); } catch {} return r; }; }
