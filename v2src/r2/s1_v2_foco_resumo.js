// Resumo do foco para o "Vocês combinam" (Bia, 20/11; API 037): só o RESUMO do ano vai para o servidor — minutos com
// cronômetro, quantas sessões e a hora mais comum (pelo início de cada sessão, pesando os minutos). Nunca as sessões.
// O resumo não aparece em perfil nenhum; o servidor só o usa na comparação do par (GET /v1/users/:h/match).
// Manda só quando muda (hash guardado no aparelho) e só com conta conectada.
{ const resumo = () => {
    const y = todayISO().slice(0, 4), F = (db.focus || []).filter((x) => x && Number(x.minutes) > 0 && String(x.date || '').startsWith(y));
    if (!F.length) return null;
    const H = new Array(24).fill(0); let min = 0;
    F.forEach((x) => { const m = Number(x.minutes) || 0; min += m; const d = x.start ? new Date(x.start) : null; if (d && !isNaN(d)) H[d.getHours()] += m; });
    const top = Math.max(...H), peak = top > 0 ? H.indexOf(top) : null;
    return { year: Number(y), minutes: Math.min(600000, Math.round(min)), sessions: Math.min(100000, F.length), peakHour: peak };
  };
  let busy = false;
  const push = async () => {
    if (busy || document.visibilityState === 'hidden') return; try { if (!connected()) return; } catch { return; }
    let r = null; try { r = resumo(); } catch { return; } if (!r) return;
    const who = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || 'eu', k = 'v9fo:' + who, h = JSON.stringify(r);
    let last = null; try { last = localStorage.getItem(k); } catch {} if (last === h) return;
    busy = true;
    try { const res = await sapi('PUT', '/v1/me/focus-summary', r); if (res && res.status === 200) { try { localStorage.setItem(k, h); } catch {} } } catch {} finally { busy = false; }
  };
  setTimeout(push, 8000); setInterval(push, 30000);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') push(); }); }
