// Escolha da Bia (15/11): "lido" = barra cheia na base da capa (a mesma barrinha do "lendo", completa e verde);
// nota = cinco patinhas desenhadas (com meia patinha), no lugar de "lido · 🐾 4,5".
{ const st = document.createElement('style'); st.textContent = `
.es4-done{top:auto!important;right:6px!important;left:6px!important;bottom:6px!important;width:auto!important;height:4px!important;border-radius:99px!important;clip-path:none!important;
  background:#2e8a52!important;box-shadow:0 0 0 1px rgba(255,255,255,.55)!important;font-size:0!important;color:transparent!important}
.pw5{display:inline-flex;gap:1px;vertical-align:-2px}
.pw5 i{position:relative;width:11px;height:11px;display:inline-block}
.pw5 svg{position:absolute;inset:0;width:11px;height:11px;fill:currentColor;stroke:none}
.pw5 i.o svg{opacity:.22}
.pw5 i.h svg + svg{clip-path:inset(0 50% 0 0)}
.pw5 i.h svg:first-child{opacity:.22}
.pw5{display:inline-block!important;flex-direction:row!important;font-size:.66rem;font-weight:900;line-height:1;padding:.18rem .42rem;border-radius:99px;color:#2b1d05;white-space:nowrap;vertical-align:middle;text-transform:none;letter-spacing:0}
.pw5.nt-g{background:linear-gradient(135deg,#f7d774,#c9962b 55%,#f3d27a)}.pw5.nt-s{background:linear-gradient(135deg,#eef1f4,#a9b0b8 55%,#e3e7eb)}
.es4-bar{display:none!important}
.pw5.nt-b{background:linear-gradient(135deg,#e9b08a,#a8673d 55%,#dca07a);color:#2a1305}.pw5.nt-r{background:linear-gradient(90deg,#ff8a8a,#ffd36e,#8fe3a0,#7cc4ff,#c9a2ff)}
`; TR.append(st); }
const pawSvg = () => `<svg viewBox="0 0 24 24" aria-hidden="true">${BI.paw}</svg>`;
const paws5 = (n) => { n = Number(n) || 0; if (!n) return 'lido'; const t = n >= 5 ? 'r' : n >= 4 ? 'g' : n >= 3 ? 's' : 'b'; return `<span class="pw5 nt-${t}" role="img" aria-label="nota ${String(n).replace('.', ',')}">nota ${String(n).replace('.', ',')}</span>`; };
{ // legendas "lido · 🐾 4,5" → patinhas; "lido" sem nota fica "lido"
  const fix = (root) => root.querySelectorAll('small.es4-st, .es4-bk small, .au-grid small').forEach((s) => {
    if (s.dataset.pw) return; const m = s.textContent.trim().match(/^lido\s*·\s*\D*?(\d+(?:,\d)?)\s*$/); if (!m) return;
    s.dataset.pw = 1; s.innerHTML = paws5(Number(m[1].replace(',', '.')));
  });
  new MutationObserver(() => fix(TR)).observe(TR, { childList: true, subtree: true }); fix(TR);
}
