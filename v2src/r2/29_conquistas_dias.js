// Conquistas de registro (segunda rodada, ok da Bia 15/11): contavam cada atualização, até correções, e dava para ganhar
// atualizando várias vezes no mesmo dia. Agora contam DIAS diferentes em que a leitura avançou (páginas > 0).
// Quem já tinha ganho (já avisado em prefs.achSeen) continua com a conquista.
ACHIEVEMENTS.filter((a) => a.m === 'regs').forEach((a) => { a.desc = a.goal === 1 ? 'Avançar a leitura em 1 dia' : `Avançar a leitura em ${a.goal} dias diferentes`; });
{ const _am = achMetrics; achMetrics = function () {
  const M = _am.apply(this, arguments);
  try { const days = new Set(); for (const x of readingEvents()) if (x.pages > 0 && x.date) days.add(String(x.date).slice(0, 10)); M.regs = days.size; } catch {}
  return M;
}; }
{ const _as = achState; achState = function () {
  const st = _as.apply(this, arguments), seen = new Set((db.prefs && db.prefs.achSeen) || []);
  return st.map((a) => (a.m === 'regs' && !a.done && seen.has(a.id) ? { ...a, done: true, cur: a.goal } : a));
}; }
