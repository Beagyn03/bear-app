// Acessibilidade e acabamento (Bia, 20/11: rodada de confiabilidade).
// 1) Contraste AA no tema Papel: o laranja e o cinza de texto ficavam abaixo de 4,5:1 sobre o fundo creme (3,2 a 4,3).
//    O laranja escurece um pouco (#9c5216: 5,0 sobre o fundo, 5,8 com texto branco) e o cinza também (#6e5a47: 5,7).
// 2) Botão com fundo laranja nos temas escuros usava texto branco (1,8:1); passa a usar a cor de texto sobre o laranja do tema.
// 3) Alvos de toque de pelo menos 40 px: fechar do cartão do topo, curtir/salvar/••• dos posts, ícones do topo, voltar, fechar dica.
// 4) Folhas e menus: Esc fecha; ao abrir, o foco vai para dentro; ao fechar, volta para onde estava. Foco visível no teclado.
// 5) Quem pede menos movimento no celular: sem cometa, estrelas piscando, deslizes e transições animadas.
{ const hs = document.createElement('style'); hs.textContent = `html[data-pal="papel"]{--acc:#9c5216;--caramel-deep:#9c5216;--ink-2:#6e5a47}`; document.head.append(hs);
  const st = document.createElement('style'); st.id = 'v10a11y'; st.textContent = `
:host(.light) .v8dia,:host(.light) .v4ler{--vio:#6a4fb8}
.in-meta-cta button{color:var(--on-acc,#fff)!important}
.v4ler,.v6com{--ink3:var(--ink-2)!important}
:host(.light) .pact.le,:host-context(.light) .pact.le,:host(.light) .le,:host-context(.light) .le{color:#5a40a8!important}
.v8diaw .v8x{width:40px!important;height:40px!important;top:4px!important;right:4px!important}
.rd-like,.rd-save,.rd-more,.rd-rep,.rd-reply{min-width:40px;min-height:40px}
.g-b,.g-orb{min-width:40px;min-height:40px}
.v4back,.v4back2{min-width:40px!important;min-height:40px!important}
.v2tip button{min-width:40px;min-height:40px;display:inline-grid;place-items:center}
[role=tab]{min-height:40px}.v6com .acts button,.v6com .cg{min-height:40px;min-width:40px;justify-content:center}button.ic{min-width:40px;min-height:40px}
.v3dots button{position:relative}.v3dots button::after{content:"";position:absolute;inset:-16px -6px}
button:focus-visible,a:focus-visible,[role=button]:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--acc)!important;outline-offset:2px}
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important;scroll-behavior:auto!important}
  .v8dia .comet,.dcomet,.v7load i,.sky i{animation:none!important}.v8dia .comet{display:none!important}
}`; TR.append(st);
  const ds = document.createElement('style'); ds.textContent = `@media (prefers-reduced-motion: reduce){body .sheet *,body .sheet{animation:none!important;transition:none!important}}`; document.head.append(ds); }
// telas novas (Ler, Comunidade, Biblioteca) vivem em shadow roots dentro do app: o mesmo CSS e as mesmas regras valem lá dentro
const v10Roots = () => { const out = [TR]; const walk = (r) => r.querySelectorAll('*').forEach((x) => { if (x.shadowRoot) { out.push(x.shadowRoot); walk(x.shadowRoot); } }); walk(TR); return out; };
const v10All = (sel) => v10Roots().flatMap((r) => [...r.querySelectorAll(sel)]);
{ // Esc fecha a camada de cima
  const deep = () => { let a = document.activeElement; while (a && a.shadowRoot && a.shadowRoot.activeElement) a = a.shadowRoot.activeElement; return a; };
  window.addEventListener('keydown', (ev) => { if (ev.key !== 'Escape' || ev.defaultPrevented) return;
    if (v10All('.v10dlg').length) return; // a folha de confirmação cuida do próprio Esc
    try {
      { const rt = [...TR.children].find((n) => n.classList && n.classList.contains('rt')); if (rt) { rt.remove(); ev.preventDefault(); return; } } // retrospectiva do livro, por cima de tudo
      if (v10All('.pop').length) { closePop(); ev.preventDefault(); return; }
      const veil = v10All('.veil[data-a=close]').pop(); if (veil) { veil.click(); ev.preventDefault(); return; }
      const bs = [...document.body.querySelectorAll(':scope > .sheet')].pop(); if (bs) { bs.remove(); ev.preventDefault(); return; }
      const es = v10All('.esn-sheet').pop(); if (es) { const c = es.querySelector('[data-a=close],.cancel,.x,[aria-label=Fechar]'); if (c) c.click(); else es.remove(); ev.preventDefault(); return; }
      const ed = TR.querySelector('#editor'); if (ed && !ed.hidden) { closeEd(); ev.preventDefault(); }
    } catch (e) { console.warn('Esc', e); } }, true);
  // foco: entra na camada que abriu e volta para onde estava quando ela fecha
  const OVL = '.v4ler .sheet, .pop, .esn-sheet, #editor:not([hidden]) .ed-body';
  let stack = [];
  const first = (el) => el.querySelector('button:not([disabled]),[href],input:not([type=hidden]),select,textarea,[tabindex]:not([tabindex="-1"])');
  const scan = () => {
    const open = [...v10All(OVL), ...document.body.querySelectorAll(':scope > .sheet .box')];
    open.forEach((el) => { if (stack.some((s) => s.el === el)) return; const prev = deep(); stack.push({ el, prev });
      if (!el.getAttribute('role')) el.setAttribute('role', 'dialog');
      if (el.getAttribute('role') === 'dialog') el.setAttribute('aria-modal', 'true');
      // só puxa o foco quando a pessoa está usando teclado (no toque, não abre o teclado do celular nem pinta o contorno)
      if (kb) setTimeout(() => { const f = first(el); if (f && el.isConnected) f.focus(); }, 40); });
    stack = stack.filter((s) => { if (s.el.isConnected && !(s.el.closest('#editor') && s.el.closest('#editor').hidden)) return true; if (kb && s.prev && s.prev.isConnected) { try { s.prev.focus(); } catch {} } return false; }); };
  let kb = false; window.addEventListener('keydown', (ev) => { if (ev.key === 'Tab' || ev.key === 'Escape' || ev.key === 'Enter') kb = true; }, true); window.addEventListener('pointerdown', () => { kb = false; }, true);
  let tm = 0; const mo = new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(scan, 30); });
  const opt = { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] };
  const css = () => TR.querySelector('#v10a11y');
  // cada shadow root novo ganha o CSS de acessibilidade e passa a ser observado
  const spread = () => v10Roots().forEach((r) => { if (r === TR || r.v10a) return; r.v10a = 1; const c = css(); if (c) r.append(c.cloneNode(true)); mo.observe(r, opt); });
  const mo2 = new MutationObserver(() => { clearTimeout(tm2); tm2 = setTimeout(spread, 60); }); let tm2 = 0;
  mo.observe(TR, opt); mo.observe(document.body, { childList: true }); mo2.observe(TR, { childList: true, subtree: true }); spread(); }
// Esqueleto do Hoje (Bia, 20/11: acabamento). Na abertura o Hoje fica invisível até o layout final estar pronto (reteste M8);
// em vez de tela vazia, mostra blocos cinza no formato do Hoje (cartão do topo, cartão do livro, dois cartões pequenos),
// por cima do lugar da lista e sem ocupar espaço próprio (não empurra nada: o deslocamento continua zero).
{ const st = document.createElement('style'); st.textContent = `
.v10sk{position:absolute;z-index:1;pointer-events:none;display:grid;gap:12px;align-content:start}
.v10sk i{display:block;border-radius:18px;background:color-mix(in srgb,var(--ink) 7%,transparent)}
.v10sk .r{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media (prefers-reduced-motion: no-preference){.v10sk i{animation:v10pulse 1.2s ease-in-out infinite alternate}@keyframes v10pulse{to{opacity:.55}}}`; TR.append(st);
  let sk = null;
  const sync = () => { const l = TR.querySelector('#lista:not(.lista-snap)'), on = !!(l && l.classList.contains('v3-wait') && S.tab === 'inicio');
    if (!on) { if (sk) { sk.remove(); sk = null; } return; }
    if (!sk) { sk = document.createElement('div'); sk.className = 'v10sk'; sk.setAttribute('aria-hidden', 'true'); sk.innerHTML = '<i style="height:96px"></i><i style="height:300px"></i><div class="r"><i style="height:86px"></i><i style="height:86px"></i></div><i style="height:140px"></i>'; }
    if (sk.parentElement !== l.parentElement) l.before(sk);
    sk.style.top = l.offsetTop + 'px'; sk.style.left = l.offsetLeft + 'px'; sk.style.width = l.offsetWidth + 'px';
    const pe = l.parentElement; if (pe && getComputedStyle(pe).position === 'static') pe.style.position = 'relative'; };
  new MutationObserver(sync).observe(TR, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true }); }
