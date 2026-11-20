// Ícones novos do Livroverso (Bia, 17/11): conjunto dourado da prancha do ChatGPT na barra de baixo, no menu lateral, no topo
// e nos botões só de ícone (curtir/comentar). Botões que têm texto ficam só com o texto (sem ícone).
// Os desenhos entram como <image> dentro do mesmo <svg> que o app já monta (SVG/dsv), então nada de markup novo.
{ const IMG = (f) => `<image href="img/${f}.webp" x="0" y="0" width="24" height="24" preserveAspectRatio="xMidYMid meet"/>`;
  Object.assign(ICO, { inicio: IMG('tab_inicio'), estante: IMG('tab_estante'), comunidade: IMG('tab_comunidade'), progresso: IMG('mn_estatisticas'), buscar: IMG('tab_buscar'), eu: IMG('tab_perfil'), msg: IMG('top_conversas'), bell: IMG('top_notificacoes') });
  Object.assign(DI, { stats: IMG('mn_estatisticas'), quote: IMG('mn_trechos'), shelves: IMG('tab_estante'), folder: IMG('tab_estante'), hist: IMG('mn_historico'), award: IMG('mn_conquistas'), target: IMG('mn_metas'), users: IMG('mn_amigos'), plus: IMG('tab_comunidade'), cfg: IMG('mn_ajustes'), pen: IMG('tab_perfil'), user: IMG('tab_perfil') });
  // ícones de imagem usados por IC()/MN() que têm equivalente novo
  Object.assign(A, { ic_curtir: 'img/bt_curtir.webp', ic_comentar: 'img/bt_comentar.webp', ic_procurar: 'img/tab_buscar.webp', ic_config: 'img/mn_ajustes.webp', ic_perfil: 'img/tab_perfil.webp', ic_meta: 'img/mn_metas.webp',
    mn_notificacoes: 'img/top_notificacoes.webp', mn_novidades: 'img/tab_comunidade.webp', mn_estantes: 'img/tab_estante.webp', mn_numeros: 'img/mn_estatisticas.webp', mn_conquistas: 'img/mn_conquistas.webp', mn_meta: 'img/mn_metas.webp', mn_perfil: 'img/tab_perfil.webp', mn_hoje: 'img/tab_inicio.webp' });
}
{ const st = document.createElement('style'); st.textContent = `
#tabbar button svg{width:28px;height:28px;transition:transform .15s ease,opacity .15s ease,filter .15s ease}
#tabbar button:not(.on) svg{opacity:.62;filter:saturate(.55)}
#tabbar button.on svg{transform:scale(1.12)}
#tabbar button.on small{font-weight:900}
.gtop .g-b svg{width:24px;height:24px}
.drw-it svg{width:24px;height:24px}
.ic-off{display:none!important}
.rd-like .rd-hi{width:18px;height:18px;vertical-align:-4px;margin-right:.25rem;transition:filter .15s ease,opacity .15s ease}
.rd-like:not(.on) .rd-hi{filter:grayscale(1);opacity:.55}
.fd-like:not(.on) img,.rc-act:not(.on) img{filter:grayscale(1);opacity:.55}
.rc-act img{width:18px;height:18px;vertical-align:-4px;margin-right:.25rem}
`; TR.append(st); }
{ // menu lateral: ícones específicos por item (Ajustar leituras ≠ Estatísticas; Sair da conta)
  const BY = { fix: 'mn_ajustar', people: 'tab_comunidade', prof: 'tab_perfil' };
  const LIST_SEL = '.bm-it,.v3-row,.drw-it,.aj-row,.cf-row,[role=menuitem],.sh-it,.drw-me';
  const paint = () => {
    [['#g-msg', ICO.msg], ['#g-bell', ICO.bell], ['.g-menu', null]].forEach(([q, ic]) => { const s2 = ic && TR.querySelector(q + ' svg'); if (s2 && !s2.dataset.ic2) { s2.dataset.ic2 = 1; s2.innerHTML = ic; } });
    TR.querySelectorAll('.drw-it:not([data-ic2])').forEach((b) => { b.dataset.ic2 = 1; const f = b.classList.contains('drw-out') ? 'mn_sair' : BY[b.dataset.go]; const s = b.querySelector('svg'); if (f && s) s.innerHTML = `<image href="img/${f}.webp" x="0" y="0" width="24" height="24"/>`; });
    // botões com texto: some o ícone (fica só o texto). Botões só de ícone ou só com contador continuam com ícone.
    TR.querySelectorAll('button img.ico-m, button img.ico-b, button img.ico-s').forEach((im) => { const b = im.closest('button'); if (!b || b.matches(LIST_SEL) || b.closest(LIST_SEL)) return;
      const t = b.textContent.replace(/\s+/g, ' ').trim(); if (t && !/^\d*$/.test(t)) im.classList.add('ic-off'); });
    // curtir nos cartões da Rede: coração desenhado no lugar do ♥/♡
    TR.querySelectorAll('.rd-like:not([data-ic2]), .rc-act:not([data-ic2])').forEach((b) => { if (!/[♥♡]/.test(b.textContent)) return; b.dataset.ic2 = 1; const fix = () => { const n = b.textContent.replace(/[♥♡]/g, '').trim(); b.innerHTML = `<img class="rd-hi" src="img/bt_curtir.webp" alt="">${n}`; b.setAttribute('aria-label', 'Curtir'); };
      fix(); new MutationObserver(() => { if (/[♥♡]/.test(b.textContent)) fix(); }).observe(b, { childList: true, characterData: true, subtree: true }); });
  };
  let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 60); }).observe(TR, { childList: true, subtree: true });
  setTimeout(() => { try { drawTabbar(); } catch {} paint(); }, 0);
}
