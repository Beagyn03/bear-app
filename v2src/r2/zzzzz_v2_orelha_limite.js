// ---------- v2: orelha do cartão com limite (Bia, 28/11: "isso tá feio") ----------
// Puxar a tela para atualizar começando no canto do cartão arrastava a orelha junto, e ela crescia sem limite até cobrir o
// livro inteiro (triângulo gigante). Agora: a orelha do cartão cresce no máximo até 132px (o bastante para passar do ponto
// de abrir, 120px) e o toque que começa nela não dispara o "puxar para atualizar".
{ const st = document.createElement('style'); st.textContent = `#v5ler.ear.card{width:min(var(--s,44px),132px)!important;height:min(var(--s,44px),132px)!important}`; TR.append(st);
  const ear = jnPl_; ['touchstart', 'touchmove'].forEach((t) => ear.addEventListener(t, (ev) => ev.stopPropagation(), { passive: true }));
}
