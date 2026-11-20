// Carregando com estrelas cadentes (Bia, 20/11): a tela de estrelas do perfil antigo vale para o app todo, mas só quando a
// tela demora. Um pedido à API que sai logo depois de um toque e passa de 0,3 s mostra as estrelas sobre o conteúdo
// (topo e barra de baixo continuam visíveis); quando aparecem, ficam ao menos 0,4 s. Pedidos de fundo (sem toque) não contam.
{ const st = document.createElement('style'); st.textContent = `
.v7load{position:fixed;left:0;right:0;top:56px;bottom:64px;z-index:45;background:var(--bg);display:grid;place-items:center;overflow:hidden;pointer-events:none;opacity:0;transition:opacity .18s ease}
.v7load.on{opacity:1}
.v7load b{position:relative;z-index:2;font-size:.9rem;font-weight:800;color:var(--ink-2);display:flex;align-items:center;gap:.45rem}
.v7load b i{font-style:normal;color:#f2c94c;font-size:1.2rem;animation:fpTw 1.2s ease-in-out infinite;text-shadow:0 0 8px rgba(242,201,76,.8)}
.v7load s,.v3pfwait s{position:absolute;width:110px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(242,201,76,.15),#f7d77a);transform:rotate(-35deg);opacity:0;animation:fpShoot 1.6s ease-in infinite;text-decoration:none;pointer-events:none}
.v7load s::after,.v3pfwait s::after{content:"★";position:absolute;right:-7px;top:-9px;font-size:14px;color:#ffe08a;text-shadow:0 0 6px #ffd35a}
.v7load s:nth-child(1),.v3pfwait s:nth-child(1){top:12%;left:70%;animation-delay:0s}.v7load s:nth-child(2),.v3pfwait s:nth-child(2){top:28%;left:95%;animation-delay:.45s}
.v7load s:nth-child(3),.v3pfwait s:nth-child(3){top:5%;left:40%;animation-delay:.9s}.v7load s:nth-child(4),.v3pfwait s:nth-child(4){top:45%;left:85%;animation-delay:1.25s}.v7load s:nth-child(5),.v3pfwait s:nth-child(5){top:20%;left:115%;animation-delay:.7s}
.v3pfwait{overflow:hidden}.v3pfwait > :not(s){position:relative;z-index:2}.v3pfwait.v7st .sp{display:none}
@keyframes fpTw{50%{transform:scale(.7) rotate(20deg);opacity:.6}}
@keyframes fpShoot{0%{opacity:0;transform:rotate(-35deg) translateX(0)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:rotate(-35deg) translateX(-420px)}}
@media (prefers-reduced-motion:reduce){.v7load s,.v3pfwait s{display:none}.v3pfwait.v7st .sp{display:block}}
`; TR.append(st); }
{ let tap = 0, pend = 0, ov = null, shownAt = 0, showT = 0, label = 'Carregando…';
  addEventListener('pointerup', () => { tap = Date.now(); }, true);
  const lbl = (p) => /^\/v1\/users\//.test(p) ? 'Abrindo perfil…' : /^\/v1\/(books|reviews|niveis|ressaca|markers\/book|echoes)|[?&]book=/.test(p) ? 'Abrindo livro…' : /^\/v1\/buddies/.test(p) ? 'Abrindo leitura conjunta…' : /^\/v1\/(feed|rede|board|qday|trends)/.test(p) ? 'Abrindo comunidade…' : /^\/v1\/messages/.test(p) ? 'Abrindo conversa…' : 'Carregando…';
  const show = () => { showT = 0; if (!pend || ov || TR.querySelector('.v3pfwait, .fp-load')) return;
    ov = document.createElement('div'); ov.className = 'v7load'; ov.setAttribute('aria-live', 'polite');
    ov.innerHTML = '<s></s><s></s><s></s><s></s><s></s><b><i>★</i>' + esc(label) + '</b>'; TR.append(ov); shownAt = Date.now(); requestAnimationFrame(() => ov && ov.classList.add('on')); };
  const hide = () => { if (pend) return; clearTimeout(showT); showT = 0; if (!ov) return; const o = ov, wait = Math.max(0, 400 - (Date.now() - shownAt));
    setTimeout(() => { if (pend && ov === o) return; if (ov === o) ov = null; requestAnimationFrame(() => { o.classList.remove('on'); setTimeout(() => o.remove(), 200); }); }, wait); };
  const _s = sapi; sapi = async function (method, path) {
    const nav = String(method).toUpperCase() === 'GET' && Date.now() - tap < 500 && !/^\/v1\/(me\/profile|push|covers|flairs|me\/notices)/.test(String(path || ''));
    if (nav) { pend++; label = lbl(String(path || '')); if (!showT && !ov) showT = setTimeout(show, 300); }
    try { return await _s.apply(this, arguments); }
    finally { if (nav) { pend = Math.max(0, pend - 1); if (!pend) requestAnimationFrame(hide); } } };
  // a espera do seu perfil (bloco f4) ganha as mesmas estrelas no lugar do círculo girando
  new MutationObserver(() => { TR.querySelectorAll('.v3pfwait:not(.v7st)').forEach((w) => { w.classList.add('v7st'); w.insertAdjacentHTML('afterbegin', '<s></s><s></s><s></s><s></s><s></s>'); }); }).observe(TR, { childList: true, subtree: true });
}
