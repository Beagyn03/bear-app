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
