// Lembrete do prazo confere o servidor (Bia, 21/11: salvou "Me lembrar todo dia" e no dia seguinte estava desligado).
// Ao abrir o app (e ao voltar para ele), lê GET /v1/me/reminder:
//  - o servidor tem lembrete e o livro (mesmo título e prazo, em Lendo) perdeu a marca no aparelho → devolve a marca (o interruptor volta a aparecer ligado);
//  - o aparelho tem lembrete válido e o servidor não → grava de novo no servidor.
{ let busy = false, last = 0;
  const check = async () => {
    if (busy || Date.now() - last < 60000) return; busy = true; last = Date.now();
    try {
      if (!connected() || (typeof vFn === 'function' && !vFn('prazos'))) return;
      const r = await sapi('GET', '/v1/me/reminder'); if (!r || r.status !== 200 || !r.data) return;
      const s = r.data.reminder, own = typeof remindOwner === 'function' ? remindOwner() : null;
      if (s) {
        if (own) return;
        const e = lib().find((x) => x.status === 'LENDO' && x.dueAt === s.dueAt && normT(x.title) === normT(s.title));
        if (e && !e.remind) { e.remind = { hour: Number(s.hour) || 20, minute: Number(s.minute) || 0 }; save(); }
      } else if (own) { own.remind.sent = ''; save(); reminderSync(own); }
    } catch (err) { console.warn('lembrete servidor', err); } finally { busy = false; }
  };
  setTimeout(check, 6000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(check, 1500); });
}
