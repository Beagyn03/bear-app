// Leituras por mês ("Por mês" na Meta, em Estatísticas e no perfil) — Bia, 22/11:
// 1) sem contorno brilhante por nota nas capas, sem marcadores/brilhos de nota e sem a legenda "Nota · 5 · 4 e 4,5…"
//    (só neste card e na página expandida; o contorno por nota nas outras telas continua);
// 2) a lista de lidos vira a 4ª vista do card: Faixa · Calendário · Estante · Lista (agrupada por mês, toque abre o livro).
//    Na Meta, a lista solta embaixo do card sai.
{ const st = document.createElement('style'); st.textContent = `
.ys .ys-bk::before,.ys .ys-bk::after,.ys .cv[class*=rt-]::before,.ys .cv[class*=rt-]::after,.yx-g .cv[class*=rt-]::before,.yx-g .cv[class*=rt-]::after{content:none!important;display:none!important;animation:none!important}
.ys .ys-bk .cv,.ys .cv.rt,.yx-g .cv.rt{box-shadow:0 2px 6px rgba(0,0,0,.28)!important}
.ys .ys-bk + .ys-bk .cv{box-shadow:-3px 0 6px -2px rgba(0,0,0,.4),0 2px 6px rgba(0,0,0,.28)!important}
.ys .ys-mk,.ys .ys-sp,.ys .rt-sp,.ys .ys-leg,.yx-g .yx-mk,.yx-g .rt-sp{display:none!important}
.ys .yv-seg button{min-width:0;padding-left:2px!important;padding-right:2px!important;white-space:nowrap}
.ys .yv-list{display:grid;gap:.5rem;margin-top:.1rem}
.ys .yv-lh{display:flex;align-items:baseline;gap:.45rem;margin:.55rem 0 .05rem}
.ys .yv-lh:first-child{margin-top:0}
.ys .yv-lh b{font-family:var(--f-disp,Georgia,serif);font-size:.95rem;color:var(--ink)}
.ys .yv-lh small{font-size:.74rem;color:var(--ink-2);font-weight:700}
.ys .yv-list .sl-item{width:100%;margin:0}
.ys .yv-list .sl-item i{white-space:nowrap}
.ys .yv-empty{margin:.4rem 0;font-size:.85rem;color:var(--ink-2)}
.gp-page > .gp-h,.gp-page > .sl-list{display:none!important}
`; TR.append(st); }
// tira as marcas de nota que o mountYearShelf antigo põe nas capas do card
const pmStrip = (sec) => { sec.querySelectorAll('.ys-bk').forEach((b) => b.classList.remove('paw', 'ys-5', 'ys-ouro', 'ys-prata', 'ys-bronze', 'ys-ferro'));
  sec.querySelectorAll('.ys-sp, .ys-mk, .ys-leg, .rt-sp').forEach((n) => n.remove());
  sec.querySelectorAll('.cv[class*=rt-]').forEach((c) => c.className = c.className.split(/\s+/).filter((k) => k !== 'rt' && !/^rt-/.test(k)).join(' ')); };
{ const _mys = mountYearShelf; mountYearShelf = function (root, at, items, own) {
    const r = _mys.apply(this, arguments);
    try { const sec = root && root.querySelector('.ys'); if (sec) pmStrip(sec); } catch (err) { console.warn('por mês sem brilho', err); }
    return r; }; }
// vista Lista: livros do ano, mês mais recente primeiro, no mesmo cartão da lista de lidos
function pmList(sec, row, list, y, own) {
  const box = document.createElement('div'); box.className = 'yv-list';
  const rows = [...list].sort((a, b) => String(b.d).localeCompare(String(a.d)));
  const card = (x) => {
    const e = own && x.id ? byId(x.id) : null;
    const when = x.ap ? String(x.d).slice(0, 4) : fmt(String(x.d).slice(0, 10));
    if (e) return slItem(e).replace('class="sl-item"', 'class="sl-item es-bk"').replace('<i>›</i>', '<i>' + esc(when) + ' ›</i>');
    return '<button type="button" class="sl-item es-bk" data-book="' + esc(x.t) + '" data-author="' + esc(x.a || '') + '">' + cvh(x.t, x.c, '', 'font-size:.4rem') + '<span class="sl-info"><b>' + esc(x.t) + '</b><small>' + esc(x.a || '') + '</small><em>' + (x.p ? pawTxt(x.p) : '') + '</em></span><i>' + esc(when) + ' ›</i></button>'; };
  const groups = [];
  for (let m = 12; m >= 1; m--) { const g = rows.filter((x) => !x.ap && Number(String(x.d).slice(5, 7)) === m); if (g.length) groups.push([YS_MESES[m - 1], g]); }
  const sem = rows.filter((x) => x.ap || !String(x.d).slice(5, 7)); if (sem.length) groups.push(['Sem mês', sem]);
  box.innerHTML = groups.map(([n, g]) => '<div class="yv-lh"><b>' + esc(n) + '</b><small>' + plural(g.length, 'livro', 'livros') + '</small></div>' + g.map(card).join('')).join('')
    || '<p class="yv-empty">Nenhum livro terminado neste ano ainda.</p>';
  row.after(box); try { paintCv(box); } catch {}
}
yvViews = function (sec, root, items, own) {
  if (!sec || sec.dataset.yv) return; sec.dataset.yv = own ? yvSig() : 'v'; YV_CTX.set(sec, { root, items, own });
  const fsh = !own && S.fpData && S.fpData.shelf, P = own ? db.prefs || {} : { ysView: fsh && fsh.ysView, ysLines: fsh && fsh.ysLines };
  const view = ['faixa', 'cal', 'estante', 'lista'].includes(P.ysView) ? P.ysView : 'faixa', lines = P.ysLines === 2 ? 2 : 1;
  const y = Number(sec.querySelector('.ys-y > b')?.textContent) || S.ysYear || Number(todayISO().slice(0, 4));
  const list = items.filter((x) => Number(String(x.d).slice(0, 4)) === y).sort((a, b) => String(a.d).localeCompare(String(b.d)));
  YV_LAST = { root, items, own };
  const cnt = sec.querySelector('.es5-c'); const tb = document.createElement('div'); tb.className = 'yv-tb';
  if (cnt) { cnt.before(tb); tb.append(cnt); } else sec.querySelector('.ys-h').after(tb);
  if (view === 'faixa' && own) {
    const ln = document.createElement('div'); ln.className = 'yv-ln';
    ln.innerHTML = '<button type="button" data-l="1" class="' + (lines === 1 ? 'on' : '') + '">1 linha</button><button type="button" data-l="2" class="' + (lines === 2 ? 'on' : '') + '">2 linhas</button>';
    tb.append(ln);
  }
  const seg = document.createElement('div'); seg.className = 'yv-seg';
  seg.innerHTML = [['faixa', 'Faixa'], ['cal', 'Calendário'], ['estante', 'Estante'], ['lista', 'Lista']].map(([k, n]) => '<button type="button" data-v="' + k + '" class="' + (view === k ? 'on' : '') + '">' + n + '</button>').join('');
  if (own) tb.after(seg);
  const row = sec.querySelector('.ys-row'), leg = sec.querySelector('.ys-leg'); if (!row) return;
  if (leg) leg.remove();
  if (view === 'faixa') { if (lines === 2) yvTwoLines(sec, row); return; }
  row.style.display = 'none';
  if (view === 'cal') yvCalendar(sec, row, list, y, own);
  else if (view === 'lista') pmList(sec, row, list, y, own);
  else yvShelf(sec, row, list, y, own);
};
