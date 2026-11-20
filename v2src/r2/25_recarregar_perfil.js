// Atualizar a página com o perfil aberto: volta para o perfil (antes caía em Ajustes, porque no início o perfil
// ainda não carregou e a aba Perfil cai no Editar perfil/Ajustes). Guarda "estava no perfil" e reabre depois que o perfil carrega.
{
  const KEY = 'bear.onMe';
  const onMe = () => { const v = $('#shelflist'); return !!(v && !v.hidden && v.classList.contains('mine-page') && v.querySelector('.yo-top')); }; // só o perfil mesmo (a estante aberta a partir dele herda a classe)
  const mark = () => { try { sessionStorage.setItem(KEY, JSON.stringify({ on: onMe(), at: Date.now() })); } catch {} };
  addEventListener('pagehide', mark); document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') mark(); }); setInterval(mark, 3000);
  let saved = null; try { saved = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch {}
  if (saved && saved.on && Date.now() - (saved.at || 0) < 30 * 60000 && connected()) {
    setTimeout(async () => {
      try { if (socialProfile === undefined) await loadProfile(); } catch {}
      if (!socialProfile) return;
      const ed = $('#editor'); if (ed && !ed.hidden) closeEd();
      if (!onMe()) goTab('eu');
      const mk = () => { if (!onMe()) return; S.tab = 'eu'; $$('#tabbar button').forEach((b) => b.classList.toggle('on', b.dataset.tab === 'eu')); };
      [0, 400, 1000].forEach((ms) => setTimeout(mk, ms));
    }, 750);
  }
}
