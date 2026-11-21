// Conta nova (Bia, 21/11; protótipo v170): logo depois de criar a conta, boas-vindas + abertura de 3 telas (pulável); depois o
// primeiro acesso de sempre (gêneros, Top 3, trazer histórico). O tour antigo de 8 telas sai; no lugar entra o cartão
// "Primeiros passos" no Hoje (bloco y1) com caminhos guiados (bloco y2). Estado por conta em db.prefs.pp (sincroniza com a conta).
// Contas antigas não veem o cartão, mas podem abrir em Ajustes › Ajuda › Primeiros passos.
{ const st = document.createElement('style'); st.textContent = `
.ppab{position:fixed;inset:0;z-index:2147482990;display:grid;place-items:center;padding:24px max(18px,env(safe-area-inset-left));background:var(--ppbg,#151022);color:var(--ppink,#f3ecff);font-family:inherit}
.ppab .in{width:min(420px,100%);display:grid;gap:14px;justify-items:center;text-align:center}
.ppab .sk{position:fixed;top:calc(14px + env(safe-area-inset-top));right:16px;min-height:44px;padding:0 14px;border:0;background:none;color:inherit;opacity:.75;font:inherit;font-weight:800;cursor:pointer}
.ppab .ic{width:76px;height:76px;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--ppacc,#e0a060) 18%,transparent);color:var(--ppacc,#e0a060)}
.ppab .ic svg{width:38px;height:38px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.ppab h2{margin:0;font-size:1.55rem;line-height:1.2}
.ppab p{margin:0;font-size:1rem;line-height:1.45;opacity:.85}
.ppab .dots{display:flex;gap:6px}.ppab .dots i{width:7px;height:7px;border-radius:50%;background:currentColor;opacity:.3}.ppab .dots i.on{opacity:1}
.ppab .ok{min-height:48px;width:100%;border:0;border-radius:99px;background:var(--ppacc,#e0a060);color:var(--ppon,#2a1709);font:inherit;font-weight:900;font-size:1rem;cursor:pointer}
@media (prefers-reduced-motion: no-preference){.ppab .in{animation:ppabIn .35s ease both}@keyframes ppabIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}}
`; document.head.append(st); }
// estado do guia (por conta)
function ppS() { const p = (db.prefs || {}).pp; return p && typeof p === 'object' ? p : null; }
function ppPut(patch) { const p = { ...(ppS() || {}), ...patch }; db.prefs = { ...(db.prefs || {}), pp: p }; try { save(); } catch {} try { ppRepaint(); } catch {} return p; }
function ppRepaint() { /* o Hoje refaz o cartão quando a chave do topo muda (bloco y1) */ try { if (S.tab === 'inicio') drawTab(); } catch {} }
// cores do tema para o que fica fora do shadow root (abertura, balões)
function ppVars(el) { try { const cs = getComputedStyle(TR.host || document.body), g = (k, d) => (cs.getPropertyValue(k) || '').trim() || d;
  el.style.setProperty('--ppbg', g('--bg', '#151022')); el.style.setProperty('--pppan', g('--panel', '#1f1a2e')); el.style.setProperty('--ppink', g('--ink', '#f3ecff'));
  el.style.setProperty('--ppink2', g('--ink-2', '#b9aecf')); el.style.setProperty('--ppacc', g('--acc', '#e0a060')); el.style.setProperty('--ppline', g('--line', '#3a3150'));
  // texto sobre o botão de destaque: branco em cor escura, escuro em cor clara (contraste)
  const acc = g('--acc', '#e0a060'), m = acc.match(/^#?([0-9a-f]{6})$/i); let lum = 0.6; if (m) { const n = parseInt(m[1], 16); lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255; }
  el.style.setProperty('--ppon', lum < 0.55 ? '#fff' : '#2a1709');
  // balão com superfície própria, destacada do fundo em todos os temas, e texto com contraste AA (Bia, 21/11, item C)
  const rgb = (c) => { c = String(c || '').trim(); let m = c.match(/^#([0-9a-f]{6})$/i); if (m) { const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
      m = c.match(/^#([0-9a-f]{3})$/i); if (m) return m[1].split('').map((x) => parseInt(x + x, 16)); m = c.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/); return m ? [+m[1], +m[2], +m[3]] : null; },
    L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); },
    CR = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); },
    mix = (a, b, t) => a.map((v, i) => Math.round(v * (1 - t) + b[i] * t)), hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  const bg = rgb(g('--bg', '#151022')) || [21, 16, 34], pan = rgb(g('--panel', '#1f1a2e')) || bg, dark = L(bg) < 0.2;
  const surf = dark ? mix(pan, [255, 255, 255], 0.14) : [255, 255, 255];
  let ink = rgb(g('--ink', '#f3ecff')) || (dark ? [243, 236, 255] : [33, 26, 20]); if (CR(ink, surf) < 7) ink = dark ? [255, 255, 255] : [24, 18, 12];
  let sub = mix(ink, surf, 0.22); if (CR(sub, surf) < 4.6) sub = mix(ink, surf, 0.1); if (CR(sub, surf) < 4.6) sub = ink;
  el.style.setProperty('--ppsurf', hex(surf)); el.style.setProperty('--ppbal-ink', hex(ink)); el.style.setProperty('--ppsub', hex(sub)); } catch {} }
const PP_AB = [
  ['estante', 'Boas-vindas ao Livroverso', 'Sua leitura organizada: uma Biblioteca com o que você lê, quer ler e já leu. Prazo, metas e a órbita dos dias seguidos ajudam a manter o ritmo.'],
  ['ler', 'A sessão de leitura', 'Um botão conta o tempo e silencia o resto. No caminho aparecem ecos: frases de quem já passou por aquela página.'],
  ['friends', 'Comunidade sem spoiler', 'Comente, avalie e leia junto com amizades. O que conta o enredo fica coberto até a pessoa chegar na página.'],
];
function ppAbertura(done) {
  let i = 0; const ov = document.createElement('div'); ov.className = 'ppab'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'ppab-t'); ppVars(ov);
  const end = () => { document.removeEventListener('keydown', key, true); ov.remove(); ppPut({ ab: 1 }); try { done && done(); } catch (e) { console.warn('abertura', e); } };
  const key = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); end(); } };
  const draw = () => { const [ic, t, x] = PP_AB[i], last = i === PP_AB.length - 1;
    ov.innerHTML = `<button type="button" class="sk">Pular</button><div class="in"><span class="ic" aria-hidden="true">${v4ic(ic, 38)}</span><h2 id="ppab-t">${esc(t)}</h2><p>${esc(x)}</p>
      <div class="dots" role="img" aria-label="Tela ${i + 1} de ${PP_AB.length}">${PP_AB.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div>
      <button type="button" class="ok">${last ? 'Começar' : 'Continuar'}</button></div>`;
    ov.querySelector('.sk').addEventListener('click', end); ov.querySelector('.ok').addEventListener('click', () => { if (last) end(); else { i++; draw(); } });
    ov.querySelector('.ok').focus({ preventScroll: true }); };
  document.addEventListener('keydown', key, true); document.body.append(ov); draw();
}
// conta nova: marca o guia; a abertura vem antes do primeiro acesso
{ const _ar = afterRegister; afterRegister = function () { const t = todayISO(); db.prefs = { ...(db.prefs || {}), pp: { on: 1, at: t, ab: 0, fs: 1, done: [], skip: [], tips: [] }, tipCapa: 1, tipEst5: 1 }; // dicas antigas que repetem o tour não aparecem para conta nova (item E)
    // conta nova começa no tema Sistema (teste real 21/11, item 11)
    try { localStorage.setItem('lv.temaSis', '1'); T().theme = 'sistema'; applyTheme('sistema', true); } catch {}
    try { save(); } catch {} return _ar.apply(this, arguments); }; }
// se o app recarregar no meio das boas-vindas ou do primeiro acesso, ele volta de onde parou (teste real 21/11, item 1)
{ let tries = 0; const resume = () => { tries++; const p = ppS(); if (!p || !p.on || !p.fs || p.fs === 'ok') return;
    let ready = false; try { ready = connected() && socialProfile !== undefined && !document.querySelector('.ppab'); } catch {}
    if (!ready) { if (tries < 40) setTimeout(resume, 500); return; }
    const v = TR.querySelector('#shelflist'); if (v && !v.hidden && v.querySelector('#gs-ok')) return;
    try { goTab('inicio'); } catch {} try { openTaste(true, socialProfile, p.fs); } catch (e) { console.warn('retomar primeiro acesso', e); } };
  setTimeout(resume, 1500); }
{ const _ot = openTaste; openTaste = function (first) { const p = ppS(), a = arguments, me = this;
    if (first && p && p.on && !p.ab) { ppAbertura(() => _ot.apply(me, a)); return; }
    return _ot.apply(this, arguments); }; }
// o tour antigo (8 telas) sai: quem é novo tem os Primeiros passos
maybeTour = function () {};
// Ajustes › Ajuda: "Ver o tour do app" vira "Primeiros passos" (reabre o cartão no Hoje, também para conta antiga)
function ppReabrir() { const p = ppS() || {}; ppPut({ on: 1, off: 0, at: p.at || todayISO(), ab: 1, done: p.done || [], skip: p.skip || [], tips: p.tips || [], fim: 0 }); try { goTab('inicio'); } catch {} setTimeout(() => { try { const c = TR.querySelector('#lista .ppc'); if (c) c.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch {} }, 500); }
startTour = function () { ppReabrir(); };
new MutationObserver(() => { const r = TR.querySelector('#aj-tour'); if (!r || r.dataset.pp) return; r.dataset.pp = '1';
  const b = r.querySelector('b'), s = r.querySelector('small'); if (b) b.textContent = 'Primeiros passos'; if (s) s.textContent = 'o guia do começo, com dicas nas telas'; }).observe(TR, { childList: true, subtree: true });
TR.addEventListener('click', (ev) => { const r = ev.target.closest && ev.target.closest('#aj-tour'); if (!r) return; ev.preventDefault(); ev.stopPropagation(); ppReabrir(); }, true);
// Avisos › Notificações: as boas-vindas ficam registradas (só no aparelho/conta; sem tipo novo na API)
{ const st = document.createElement('style'); st.textContent = `.ppwel{display:flex;align-items:center;gap:.7rem;width:100%;padding:.75rem .85rem;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer;min-height:56px}
.ppwel .ic{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;flex:none;background:color-mix(in srgb,var(--acc) 16%,transparent);color:var(--acc)}
.ppwel b{display:block;font-size:.92rem}.ppwel small{display:block;font-size:.78rem;color:var(--ink-2)}
#editor.ntpage:has(.ppwel) .nt-empty{display:none!important}`; TR.append(st);
  new MutationObserver(() => { const p = ppS(); if (!p || !p.on) return; const L = TR.querySelector('#editor.ntpage .nt-list'); if (!L || L.querySelector('.ppwel')) return;
    const w = document.createElement('button'); w.type = 'button'; w.className = 'ppwel';
    w.innerHTML = `<span class="ic" aria-hidden="true">${v4ic('orb', 18)}</span><span><b>Boas-vindas ao Livroverso</b><small>Seus primeiros passos estão no Hoje</small></span>`;
    w.addEventListener('click', () => ppReabrir()); L.prepend(w); }).observe(TR, { childList: true, subtree: true }); }
// primeiro acesso em tela cheia: sem a barra de baixo e sem lupa/sino até terminar (Bia, 21/11, item A)
{ const st = document.createElement('style'); st.textContent = ':host(.ppfull) #tabbar,:host(.ppfull) #g-find,:host(.ppfull) #g-bell,:host(.ppfull) .v3-fab{display:none!important}'; TR.append(st);
  let tm = 0; const sync = () => { tm = 0; const v = TR.querySelector('#shelflist'); const on = !!(v && !v.hidden && v.querySelector('#gs-ok') && !v.querySelector('.sl-back'));
    const h = TR.host; if (h && h.classList.contains('ppfull') !== on) h.classList.toggle('ppfull', on); };
  new MutationObserver(() => { if (!tm) tm = setTimeout(sync, 40); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }

