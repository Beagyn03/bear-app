// Perfil (Bia, 17/11): no celular aparecia por um instante a versão antiga da página (Lendo agora, Conquistas, Melhores
// avaliados) antes de virar a nova, e sobrava um espaço vazio no topo do seu perfil (o botão de voltar escondido).
// Ao abrir um perfil, a página fica invisível até terminar de montar; no seu perfil, a barra de voltar some de vez.
{ const st = document.createElement('style'); st.textContent = `
#shelflist.fp-wait .sl-body{visibility:hidden}
#shelflist .sl-body{transition:opacity .15s}
#shelflist.mine-page .sl-body > .sl-top:has(~ .yo-top){display:none!important}
`; TR.append(st); }
{ const _fp = friendPage; friendPage = async function (h) {
    const v = $('#shelflist'), same = v && !v.hidden && S.fpData && String(S.fpData.handle || '').toLowerCase() === String(h || '').replace(/^@/, '').toLowerCase();
    if (v && !same) v.classList.add('fp-wait');
    try { return await _fp.apply(this, arguments); }
    finally { if (v && !same) setTimeout(() => v.classList.remove('fp-wait'), 220); setTimeout(() => v && v.classList.remove('fp-wait'), 2500); }
  }; }
