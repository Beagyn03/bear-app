// v2 fase visual (Bia, 19/11, branch livroverso-2): um padrão só para o app novo.
//  - Cartão único: cantos 20px, borda fina, sombra suave, respiro igual entre seções.
//  - Títulos de seção em serifa (Georgia) com o "ver mais" pequeno à direita; corpo segue Nunito.
//  - Ícones próprios em duas camadas (traço + preenchimento suave) no topo: menu, sino, ••• .
//  - Usa as cores do tema (--panel, --ink, --line, --acc…); só acrescenta tokens novos por cima, então claro e escuro seguem funcionando.
Object.assign(V2I, {
  menu: '<path d="M4 7h16M4 12h11M4 17h16"/><circle class="d" cx="19" cy="12" r="2.2"/>',
  bell: '<path class="d" d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.5H4.2z"/><path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.8 1.5H4.2zM10 21h4"/>',
  dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
});
{ const st = document.createElement('style'); st.textContent = `
:host{--v2-r:20px;--v2-r-s:14px;--v2-sh:0 1px 2px rgba(60,35,10,.05),0 8px 22px rgba(60,35,10,.06);--v2-disp:Georgia,'Times New Roman',serif;--v2-gap:1rem}
/* cartões: um estilo só */
.v3c,.in-sec,.ini-meta,.orb-row > *,.v2-qd,.v2-qn,.lx-card,.es-blk,.rd-post,.rdc,.rd-card,.bud-card,.ach-card,.yo-sec,.st-card,.av-card{border-radius:var(--v2-r)!important;border:1px solid var(--line)!important;box-shadow:var(--v2-sh)!important;background:var(--panel)}
.in-sec,.ini-meta,.v2-qd,.v2-qn{margin-bottom:var(--v2-gap)!important}
/* títulos de seção e de tela em serifa */
.v3-sh b,.v3-sh h2,.v3-sh h3,.es-h b,.sl-top b,.rd-h b,.ini-meta b,.v2-qd .q,.st-h b,.yo-sh b{font-family:var(--v2-disp)!important;font-weight:700!important;letter-spacing:0}
.v3-sh{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;margin:1.2rem .1rem .55rem!important}
.v3-sh b{font-size:1.08rem!important;color:var(--ink)}
.v3-sh button,.v3-sh a{font-size:.76rem!important;font-weight:800!important;color:var(--acc)!important;background:none!important;border:0!important}
.sl-top b{font-size:1.15rem!important}
#g-t:not(.g-brand){font-family:var(--v2-disp)!important;font-size:1.25rem!important}
/* ícones do topo no traço novo */
#g-av.v2ic > :not(.v2i),#g-bell.v2ic > :not(.v2i):not(u),#g-imore.v2ic > :not(.v2i){display:none!important}
#g-av.v2ic,#g-bell.v2ic,#g-imore.v2ic,#g-find{color:var(--ink);display:grid;place-items:center;background-image:none!important}
#g-bell.v2ic::before,#g-bell.v2ic::after,#g-av.v2ic::before,#g-av.v2ic::after{display:none!important}
#g-av.v2ic .v2i,#g-bell.v2ic .v2i,#g-imore.v2ic .v2i,#g-find .v2i{width:24px;height:24px}
#g-imore.v2ic{background:none!important;border:0!important;box-shadow:none!important;font-size:0!important;color:var(--ink)}
#g-bell u{font-family:inherit}
/* botões principais com o mesmo raio e peso */
.lx-btn,.v3-quick button,.v2-pill,.v2-btn{border-radius:14px!important}
/* respiro e fundo de tela */
.v3-colA{padding-top:.2rem}
`; TR.append(st); }
{ const ICON = { 'g-av': 'menu', 'g-bell': 'bell', 'g-imore': 'dots' };
  let tm = 0; const paint = () => { Object.entries(ICON).forEach(([id, k]) => { const b = TR.querySelector('#' + id); if (!b || b.querySelector(':scope > .v2i')) return; b.classList.add('v2ic'); b.insertAdjacentHTML('afterbegin', V2SVG(k, 24)); }); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; paint(); }, 40); }).observe(TR, { childList: true, subtree: true }); setTimeout(paint, 600); }
