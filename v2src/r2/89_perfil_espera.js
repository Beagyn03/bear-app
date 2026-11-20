// Recarregar o app na aba Perfil (Bia, 17/11): o @usuário ainda não chegou da API e a aba caía por um instante em
// "Editar perfil · Sem @usuário ainda" antes de virar o perfil. Agora a aba espera o perfil chegar (até ~6 s) antes de abrir.
{ let tk = 0; const _gt = goTab; goTab = function (tab, fromBar) {
    const my = ++tk;
    if (tab === 'eu' && connected() && socialProfile === undefined) {
      try { $$('#tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.tab === 'eu')); } catch {}
      (async () => {
        for (let i = 0; i < 40 && socialProfile === undefined; i++) await new Promise((r) => setTimeout(r, 150));
        if (socialProfile === undefined) { try { await loadProfile(); } catch {} }
        if (my === tk) _gt.call(this, tab, fromBar);
      })();
      return;
    }
    return _gt.apply(this, arguments);
  }; }
