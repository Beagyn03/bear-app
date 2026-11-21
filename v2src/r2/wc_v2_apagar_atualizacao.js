// Progresso em telas sociais (Bia, 21/11): para outras pessoas, sempre em % ("Lendo · 26%"), nunca página/posição/capítulo.
// pct quando vier; senão calcula pela página e o total do próprio livro; sem como saber, não mostra número.
function v2PctTxt(pct, page, title, pre) {
  let p = pct != null && pct !== '' ? Number(pct) : null;
  if ((p == null || !isFinite(p)) && page) { try { const k = normT(title || ''); const e = lib().find((x) => normT(x.title) === k); const t = e && Number(e.totalPages); if (t) p = Math.min(100, page / t * 100); } catch {} }
  return p != null && isFinite(p) ? (pre || '') + Math.max(0, Math.min(100, Math.round(p))) + '%' : '';
}
// Apagar uma atualização de leitura (Bia, 21/11): no Histórico, "Apagar" tira o registro e a página do livro volta
// (o bloco do histórico já desconta as páginas). Aqui: sem o "toque de novo" — apaga na hora com "Desfazer" (regra do app);
// a atividade daquele dia no feed/Atividade sai junto (API DELETE /v1/activities/by-day) ou é refeita com a página certa
// se ainda houver leitura naquele dia; a chamada só vai 5 s depois, para o Desfazer não precisar falar com a API.
{ const _te = tlEditClick; const pend = new Map();
  tlEditClick = function (ev, e, redraw) {
    const b = ev.target.closest && ev.target.closest('.tl-eb button'), c = b && b.closest('.tl-c');
    if (!b || b.dataset.a !== 'rm' || !c || !String(c.dataset.ref || '').startsWith('rl:')) return _te.apply(this, arguments);
    const ix = Number(c.dataset.ref.split(':')[1]), L = e.readLog || [], x = L[ix]; if (!x) return;
    const before = Number(e.currentPage) || 0, day = String(x.date || '').slice(0, 10), key = e.id + '|' + day;
    // é a mais recente? (data maior, ou mesma data e posição depois). Se não for, a página atual não muda: as páginas dela
    // passam para o registro seguinte, para a soma continuar batendo com a página atual.
    const dk = (y, i) => String(y.date || '').slice(0, 10) + '|' + String(i).padStart(6, '0');
    let next = null; L.forEach((y, i) => { if (i !== ix && dk(y, i) > dk(x, ix) && (!next || dk(y, i) < dk(next.y, next.i))) next = { y, i }; });
    const nextObj = next && next.y;
    b.dataset.ok = '1'; _te.apply(this, arguments); // o original apaga, desconta as páginas, salva e redesenha
    if (nextObj) { nextObj.pages = (Number(nextObj.pages) || 0) + (Number(x.pages) || 0); e.currentPage = before; save(); try { redraw(); } catch {} }
    const sync = () => { pend.delete(key);
      if (!connected()) return;
      const still = (e.readLog || []).some((y) => String(y.date || '').slice(0, 10) === day && Number(y.pages));
      if (still && day === todayISO()) { try { publishActivity(e, 'PROGRESS'); } catch {} return; }
      if (!still) Promise.resolve(sapi('DELETE', '/v1/activities/by-day?' + new URLSearchParams({ libId: e.id, kind: 'PROGRESS', day }).toString())).catch(() => {}); };
    clearTimeout(pend.get(key)); pend.set(key, setTimeout(sync, 5000));
    try { refresh(); } catch {}
    toast('Atualização apagada · pág. ' + (Number(e.currentPage) || 0), { label: 'Desfazer', fn: () => {
      clearTimeout(pend.get(key)); pend.delete(key);
      const L2 = e.readLog || (e.readLog = []); if (nextObj) nextObj.pages = (Number(nextObj.pages) || 0) - (Number(x.pages) || 0); L2.splice(Math.min(ix, L2.length), 0, x); e.currentPage = before; save();
      try { refresh(); } catch {} try { redraw(); } catch {} toast('Atualização de volta');
    } });
  };
}
