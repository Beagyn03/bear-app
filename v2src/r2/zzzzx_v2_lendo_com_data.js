// ---------- v2: "Lendo" do perfil com o dia da última atualização (Bia, 27/11) ----------
// "Por que não vejo o dia que ela atualizou?" Na Atividade do perfil de outra pessoa, o cartão "Lendo · 24%" vem do resumo
// publicado (snapshot.reading), que não levava data. Agora cada livro do resumo leva "at" (dia do último registro de leitura,
// ou o início) e o cartão mostra o dia. Vale para quem já estiver com esta versão quando o app dela publicar o resumo de novo.
const lvLendoAt = (e) => { try { const L = e.readLog || []; const ds = L.map((x) => String(x.ts || x.date || '')).filter(Boolean).sort(); const d = ds.length ? ds[ds.length - 1] : (e.startedTs || e.startedAt || e.startDate); return d ? String(d) : null; } catch { return null; } };
{ const _s = sapi; sapi = function (method, path, body) {
    try { if (method === 'PUT' && path === '/v1/me/snapshot' && body && body.snapshot && Array.isArray(body.snapshot.reading)) {
      const L = lib() || []; body = { ...body, snapshot: { ...body.snapshot, reading: body.snapshot.reading.map((b) => { const e = L.find((x) => x.status === 'LENDO' && normT(x.title) === normT(b.title || '')); const at = e && lvLendoAt(e); return at ? { ...b, at } : b; }) } }; } } catch (err) { console.warn('lendo com data', err); }
    return _s.call(this, method, path, body); }; }
