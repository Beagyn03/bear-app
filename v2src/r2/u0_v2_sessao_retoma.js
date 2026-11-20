// Sessão de leitura não se perde (Bia, 20/11): se há uma sessão aberta, ao recarregar a página ou voltar ao app
// (tela bloqueada, outro app), o Livroverso abre direto na tela da sessão, com o cronômetro contando de onde estava.
{ const aberta = () => { try { const V = typeof V4 !== 'undefined' ? V4 : null; return !!(V && V.isConnected && v4State().view === 'ler'); } catch { return false; } };
  const retoma = () => {
    let ss = null; try { ss = v2SesGet(); } catch {} if (!ss || !ss.libId) return;
    let e = null; try { e = lib().find((x) => x.id === ss.libId); } catch {} if (!e) return;
    if (aberta() && v4State().e === e.id) return;
    try { v4Open(e); } catch (err) { console.warn('retomar sessão', err); }
  };
  // ao abrir: depois que a navegação salva foi restaurada (ela poderia levar para outra tela por cima)
  setTimeout(retoma, 1400); setTimeout(retoma, 3200);
  let saiu = 0;
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { saiu = Date.now(); return; } if (saiu && Date.now() - saiu > 1500) setTimeout(retoma, 250); });
  addEventListener('pageshow', (ev) => { if (ev.persisted) setTimeout(retoma, 250); }); }
