// Avatar da própria pessoa (Bia, 21/11): a barra "Escreva sobre sua leitura…" da Comunidade mostrava uma imagem antiga/borrada
// em vez da foto atual, enquanto a barra de baixo (que usa a foto do perfil) estava certa. Causa: as telas novas pintam o avatar
// pelo cache de miniaturas por @ (bear.avatars), que guardava uma miniatura velha do próprio @. Agora o próprio @ usa sempre a
// foto atual do perfil (ou a inicial, sem foto), e o cache em memória é zerado quando a conta do aparelho muda (sair/entrar).
{ const sync = () => {
    try {
      if (AVS.owner !== avOwner()) { AVS = { owner: avOwner(), map: {} }; } // outra conta neste aparelho: nada da anterior
      const h = socialProfile && socialProfile.handle; if (!h) return;
      const ph = myPhoto(), cur = AVS.map[h];
      if (ph && AV_OK.test(ph)) { if (!cur || cur.d !== ph) { AVS.map[h] = { d: ph, t: Date.now() }; avSave(); avSoon(); } }
      else if (cur) { delete AVS.map[h]; avSave(); avSoon(); }
    } catch {}
  };
  sync(); setInterval(sync, 2000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
}
