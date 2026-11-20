// Estante (Bia, 16/11): mesma linguagem das Leituras por mês. Livro lido com nota ganha o marca-página em estrela com a nota
// (5 furta-cor, 4 e 4,5 ouro, 3 e 3,5 prata, abaixo de 3 bronze); saem a coluna de patinhas e a barrinha verde de "lido".
{ const G = 'linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,0) 55%,rgba(0,0,0,.2))';
  const st = document.createElement('style'); st.textContent = `
.es-bk .es4-done{display:none!important}
.es-bk .pw5,.es4-bk .pw5{display:none!important}.es-bk .es4-st:has(> .pw5)::before,.es4-bk > small:has(> .pw5)::before{content:"lido"}
#shelflist .esv-grid > .es-bk > .es4-st:has(.pw5){display:none!important}
#shelflist .esv-grid > .es-bk{grid-template-columns:minmax(0,1fr)!important}
.mk-bear{position:absolute;top:-6px;left:8px;width:28px;height:46px;z-index:5;pointer-events:none;filter:drop-shadow(0 1.5px 1.5px rgba(0,0,0,.4))}
#shelflist .esv-grid > .es-bk > .mk-bear{top:-22px}
.mk-bear::before{content:"";position:absolute;left:12px;top:0;width:4px;height:24px;background:var(--mk);background-size:100% 100%,220% 100%}
.mk-bear b{position:absolute;left:0;bottom:0;width:28px;height:27px;clip-path:polygon(50% 0%,62% 34%,98% 36%,69% 58%,80% 94%,50% 73%,20% 94%,31% 58%,2% 36%,38% 34%);padding-top:3px;box-sizing:border-box;background:var(--mk);background-size:100% 100%,220% 100%;font:900 9px/21px Nunito,system-ui,sans-serif;letter-spacing:-.2px;text-align:center;color:var(--mkt,#2b2018);text-shadow:0 1px 0 rgba(255,255,255,.35)}
.mk-bear b::before,.mk-bear b::after{display:none;content:"";position:absolute;top:-3px;width:9px;height:9px;border-radius:50%;background:var(--mk);background-size:100% 100%,220% 100%;z-index:-1}
.mk-bear b::before{left:0}.mk-bear b::after{right:0}
.mk-bear.t-ouro{--mk:${G},linear-gradient(90deg,#9c7314,#e9c45a 25%,#fff3b8 40%,#c9971c 60%,#f7dc6f 80%,#9c7314)}
.mk-bear.t-prata{--mk:${G},linear-gradient(90deg,#7c858d,#cfd6dc 25%,#ffffff 40%,#9aa3ab 60%,#e9eef2 80%,#7c858d)}
.mk-bear.t-bronze{--mk:${G},linear-gradient(90deg,#74401a,#c98448 25%,#f3c08e 40%,#94562a 60%,#d99a62 80%,#74401a);--mkt:#fff8ef}
.mk-bear.t-bronze b{text-shadow:0 1px 1px rgba(0,0,0,.45)}
.mk-bear.t-5{--mk:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0) 60%),linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff,#f6c94a);--mkt:#fff;filter:drop-shadow(0 0 4px rgba(255,190,90,.9)) drop-shadow(0 1.5px 1.5px rgba(0,0,0,.35))}
.mk-bear.t-5 b{text-shadow:0 1px 2px rgba(80,30,90,.7)}
.mk-bear.t-5::before,.mk-bear.t-5 b,.mk-bear.t-5 b::before,.mk-bear.t-5 b::after{animation:ysMkFlow 3s linear infinite}
@media (prefers-reduced-motion:reduce){.mk-bear *,.mk-bear::before{animation:none!important}}
`; TR.append(st); }
{ const tierOf = (p) => (p >= 5 ? 't-5' : p >= 4 ? 't-ouro' : p >= 3 ? 't-prata' : 't-bronze');
  const paint = () => {
    TR.querySelectorAll('.es-bk[data-id]').forEach((b) => {
      if (b.closest('.ys')) return; // Leituras por mês já tem o seu
      const e = lib().find((x) => x.id === b.dataset.id), p = e && e.status === 'LIDO' ? ((reviewOfLib(e) || {}).paws || 0) : 0;
      const cur = b.querySelector(':scope > .mk-bear'), want = p ? tierOf(p) + '|' + p : '';
      if ((cur ? cur.dataset.k : '') === want) return;
      cur && cur.remove(); if (!p) return;
      if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
      const m = document.createElement('span'); m.className = 'mk-bear ' + tierOf(p); m.dataset.k = want; m.setAttribute('aria-hidden', 'true');
      m.innerHTML = '<b>' + String(p).replace('.', ',') + '</b>'; b.prepend(m);
    });
  };
  let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 60); }).observe(TR, { childList: true, subtree: true });
  setTimeout(paint, 1500);
}
