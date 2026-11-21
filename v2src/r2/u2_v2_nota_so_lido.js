// Nota só em leitura concluída (Bia, 20/11): livro abandonado, pausado ou ainda em leitura não recebe nota.
// - Minha leitura: o cartão "Minha avaliação" (Avaliar/Editar) só aparece em livro lido.
// - Atividade do perfil: "Abandonou"/"Pausou" sem estrelas (notas antigas ficam guardadas, só não aparecem nem contam).
{ const st = document.createElement('style'); st.textContent = `#shelflist .bp-card.v9rate-off{display:none!important}`; TR.append(st); }
{ let tm = 0; const v = $('#shelflist');
  const fix = () => { tm = 0; if (!v || v.hidden) return; const t = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (!t) return;
    let e = null; try { e = lib().find((x) => normT(x.title) === normT(t)); } catch {} if (!e) return; const off = e.status !== 'LIDO';
    v.querySelectorAll('.sl-body > .bp-card').forEach((c) => { const b = c.querySelector('[data-a=rate]'); if (!b) return; if (c.classList.contains('v9rate-off') !== off) c.classList.toggle('v9rate-off', off); }); };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 60); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-bt', 'hidden'] }); }
// pílula da Atividade: sem nota para abandonado/pausado
v3Pill = function (st, paws, pg, pct) { const n = paws ? ' ★ ' + String(paws).replace('.', ',') : '', at = pg ? ' · pág. ' + pg : pct != null && pct < 100 ? ' · ' + Math.round(pct) + '%' : '';
  if (st === 'ABANDONEI') return 'Abandonou' + at; if (st === 'HIBERNANDO') return 'Pausou' + at; return 'Avaliou' + n; };
// "minha nota" no topo do livro também some fora de livro lido (o teste mostrou Quero ler com "minha nota ★ 4")
{ const st = document.createElement('style'); st.textContent = `#shelflist.v9nolido .bp-hero .bp-chip.gold{display:none!important}`; TR.append(st);
  let tm = 0; const v = $('#shelflist');
  const fix = () => { tm = 0; if (!v || v.hidden) return; const t = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); let e = null; try { e = t && lib().find((x) => normT(x.title) === normT(t)); } catch {}
    const off = !!e && e.status !== 'LIDO'; if (v.classList.contains('v9nolido') !== off) v.classList.toggle('v9nolido', off); };
  if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 60); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// avaliação publicada sai da Comunidade quando o livro deixa de estar lido ("Não terminei", voltar status); a nota fica
// guardada no aparelho e volta a ser publicada se o livro for terminado de novo
{ const _pr = publishReview; publishReview = async function (b) {
    const e = b && b.status ? b : null;
    if (e && e.status !== 'LIDO' && e.review) { try { if (connected()) await sapi('DELETE', `/v1/reviews/${encodeURIComponent(e.id)}`); } catch {} return; }
    const out = await _pr.apply(this, arguments);
    // a avaliação nova aparece logo: Atividade, feed e números do livro sem esperar o cache (teste 12 e 14)
    try { S.v8atv = null; Object.values(S.v6f || {}).forEach((x) => { x.at = 0; }); v8Bust(); } catch {}
    return out; };
  const sweep = async () => { if (document.visibilityState === 'hidden') return; try { if (!connected()) return; } catch { return; } let ch = false;
    for (const e of lib()) { if (!e.review) continue; const off = e.status !== 'LIDO';
      if (off && !e.rvOff) { try { const r = await sapi('DELETE', `/v1/reviews/${encodeURIComponent(e.id)}`); if (r && r.status < 300) { e.rvOff = 1; ch = true; } } catch {} }
      else if (!off && e.rvOff) { delete e.rvOff; ch = true; try { await publishReview(e); } catch {} } }
    if (ch) try { save(); } catch {} };
  setTimeout(sweep, 7000); setInterval(sweep, 30000); }
// apagar a avaliação (Minha avaliação › Apagar avaliação, com segundo toque para confirmar)
{ const _fp = v4FimPage; v4FimPage = function (e) { let h = _fp.apply(this, arguments); const r = (e && reviewOfLib(e)) || {};
    if (e && e.status === 'LIDO' && (r.paws || String(r.texto || '').trim())) h = h.replace(/<\/div><\/section>$/, '<button class="btn s w" data-a="fimdel" style="margin-top:8px;color:var(--red,#d9534f)">Apagar avaliação</button></div></section>');
    return h; };
  let armT = 0;
  TR.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.dataset && n.dataset.a === 'fimdel'); if (!b) return;
    ev.stopPropagation(); ev.preventDefault();
    if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = 'Toque de novo para apagar'; clearTimeout(armT); armT = setTimeout(() => { delete b.dataset.armed; b.textContent = 'Apagar avaliação'; }, 3500); return; }
    const e = lib().find((x) => x.id === v4State().fim); if (!e) return; v9DelReview(e);
    const x = (b.getRootNode && b.getRootNode().querySelector('[data-a=fimx]')); if (x) x.click(); toast('Avaliação apagada'); }, true); }
function v9DelReview(e) {
  if (e.link) { try { const g = db.goals.find((x) => x.id === e.link.goalId), gb = g && g.books.find((x) => x.id === e.link.bookId); if (gb) gb.review = null; } catch {} }
  e.review = null; delete e.rvOff; try { save(); refresh(); } catch {}
  const after = () => { try { S.v8atv = null; Object.values(S.v6f || {}).forEach((x) => { x.at = 0; }); S.bkRede = {}; v8Bust(); const sec = TR.querySelector('#shelflist .bp-rede'); if (sec) sec.remove(); } catch {} };
  try { if (connected()) sapi('DELETE', `/v1/reviews/${encodeURIComponent(e.id)}`).then(after).catch(() => {}); else after(); } catch {}
}
// "•••" da sua avaliação na Comunidade do livro: Editar e Apagar (antes não abria nada dentro da página do livro)
{ const _rm = rdMenu; rdMenu = function (it, after, anchor) {
    const inBook = !!(anchor && anchor.closest && anchor.closest('.bp-rede'));
    if (inBook && it && it.mine && it.type === 'review') {
      // o cartão da Comunidade do livro não traz o livro (book: null); o título vem da própria página (reteste G3: o ••• não abria nada)
      const pt = ((anchor.closest('#shelflist') || TR).querySelector('.bp-hero h2') || {}).textContent || '';
      const le = lib().find((x) => x.id === it.libId) || (it.book ? lib().find((x) => normT(x.title) === normT(it.book.title)) : null) || (pt ? lib().find((x) => normT(x.title) === normT(pt)) : null); if (!le) return _rm.apply(this, arguments);
      return popMenu(anchor, [{ label: 'Editar avaliação', fn: () => { try { v4FimOpen(le); } catch { rateForm(le, { logs: [] }, () => {}); } } },
        { label: 'Apagar avaliação', fn: () => sheet('Apagar sua avaliação de “' + le.title + '”?', [['Apagar avaliação', () => { v9DelReview(le); toast('Avaliação apagada'); }]]) }]); }
    return _rm.apply(this, arguments); }; }
