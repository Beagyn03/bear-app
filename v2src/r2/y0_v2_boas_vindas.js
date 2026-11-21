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
  el.style.setProperty('--ppon', lum < 0.55 ? '#fff' : '#2a1709'); } catch {} }
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
{ const _ar = afterRegister; afterRegister = function () { const t = todayISO(); db.prefs = { ...(db.prefs || {}), pp: { on: 1, at: t, ab: 0, done: [], skip: [], tips: [] } }; try { save(); } catch {} return _ar.apply(this, arguments); }; }
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
.ppwel b{display:block;font-size:.92rem}.ppwel small{display:block;font-size:.78rem;color:var(--ink-2)}`; TR.append(st);
  new MutationObserver(() => { const p = ppS(); if (!p || !p.on) return; const L = TR.querySelector('#editor.ntpage .nt-list'); if (!L || L.querySelector('.ppwel')) return;
    const w = document.createElement('button'); w.type = 'button'; w.className = 'ppwel';
    w.innerHTML = `<span class="ic" aria-hidden="true">${v4ic('orb', 18)}</span><span><b>Boas-vindas ao Livroverso</b><small>Seus primeiros passos estão no Hoje</small></span>`;
    w.addEventListener('click', () => ppReabrir()); L.prepend(w); }).observe(TR, { childList: true, subtree: true }); }
