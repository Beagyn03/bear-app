// Números do topo do perfil (Bia, 16/11): para leitor crítico. Saem "lendo", "amigos" e "conquistas" (a capinha já mostra a leitura).
// Linha 1 (geral, não zera na virada do ano): lidos · páginas · nota média · resenhas. Linha 2: quero ler · abandonados · meta do ano atual (ocupa 2). Sem "pág. por dia" (pedido da Bia).
{ const st = document.createElement('style'); st.textContent = `
.yo-nums.yo-n7{grid-template-columns:repeat(4,1fr)!important}
#shelflist.mine-page:has(.yo-top) > .sl-body > .sl-top .sl-back{visibility:hidden} /* seu perfil (aba Perfil): não tem para onde voltar; os menus de baixo navegam */
.yo-nums.yo-n7 button.wide{grid-column:span 2}
.yo-nums.yo-n7 button small{white-space:nowrap}.yo-nums.yo-n7 .tt{display:block;max-width:100%;padding:0 .3rem;font-size:.6rem;font-weight:700;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-sizing:border-box}
.yo-nums.yo-n7 .mt{display:block;width:80%;height:4px;border-radius:99px;background:var(--line);margin:.2rem auto 0;overflow:hidden}.yo-nums.yo-n7 .mt i{display:block;height:100%;background:var(--acc)}
`; TR.append(st); }
function myProfileNums() {
  try {
    const v = $('#shelflist'), nums = v && !v.hidden && v.querySelector('.yo-top') && v.querySelector('.yo-nums'); if (!nums) return;
    const L = lib(), y = Number(todayISO().slice(0, 4)), Y = String(y);
    const lidosAno = L.filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').slice(0, 4) === Y);
    const lidos = L.filter((e) => e.status === 'LIDO'), pags = lidos.reduce((a, e) => a + (Number(e.totalPages) || 0), 0);
    const datas = lidos.map((e) => String(e.startedAt || e.finishedAt || '')).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort(), desde = datas[0] || (Y + '-01-01');
    const rated = L.filter((e) => e.status === 'LIDO' && (reviewOfLib(e) || {}).paws), avg = rated.length ? rated.reduce((a, e) => a + reviewOfLib(e).paws, 0) / rated.length : 0;
    const pagsDatadas = lidos.filter((e) => e.startedAt || e.finishedAt).reduce((a, e) => a + (Number(e.totalPages) || 0), 0), dias = Math.max(1, Math.round((Date.parse(todayISO()) - Date.parse(desde)) / 864e5) + 1), ritmo = pagsDatadas ? Math.round(pagsDatadas / dias) : 0;
    const maior = lidos.reduce((m, e) => ((Number(e.totalPages) || 0) > (Number(m && m.totalPages) || 0) ? e : m), null), resenhas = L.filter((e) => { const rv = reviewOfLib(e); return rv && String(rv.texto || '').trim(); }).length, fila = L.filter((e) => e.status === 'QUERO').length, aband = L.filter((e) => e.status === 'ABANDONEI').length;
    const alvo = Number((db.yearGoals || {})[y]) || 0, pct = alvo ? Math.min(100, Math.round(lidosAno.length / alvo * 100)) : 0;
    const k = (n) => Number(n).toLocaleString('pt-BR');
    const cell = (n, t, go, extra = '', cls = '') => `<button type="button" class="${cls}" ${go ? `data-go="${go}"` : 'disabled'}><b>${n}</b><small>${t}</small>${extra}</button>`;
    nums.classList.add('yo-n7');
    nums.innerHTML = cell(k(lidos.length), lidos.length === 1 ? 'lido' : 'lidos', 'lidos')
      + cell(k(pags), 'páginas lidas', 'stats')
      + cell(avg ? avg.toFixed(1).replace('.', ',') : '–', 'nota média', 'stats')
      + cell(k(resenhas), resenhas === 1 ? 'resenha' : 'resenhas', 'resenhas')
      + cell(k(fila), 'quero ler', 'fila')
      + cell(k(aband), aband === 1 ? 'abandonado' : 'abandonados', 'aband')
      + cell(maior ? k(maior.totalPages) + ' pág.' : '–', maior ? 'mais longo' : 'mais longo', maior ? 'maior' : '', maior ? '<span class="tt">' + esc(maior.title) + '</span>' : '')
      + cell(alvo ? `${lidosAno.length} de ${alvo}` : '–', alvo ? `meta de ${y} · ${pct}%` : `sem meta de ${y}`, 'meta', alvo ? `<span class="mt"><i style="width:${pct}%"></i></span>` : '');
    const mark = () => { const N = S.nav; if (N && !N.st.length) N.st.push({ fn: () => goTab('eu'), tab: 'eu' }); };
    const shelf = (s) => { try { Object.assign(ESN(), { tab: 'bib', st: s, nota: '', fmt: '', gen: '', own: '' }); S.esnQ = ''; save(); } catch {} v.hidden = true; goTab('estante'); mark(); }; // Minha biblioteca já filtrada (Bia, 19/11)
    const go = { lidos: () => shelf('LIDO'), fila: () => shelf('QUERO'), aband: () => shelf('ABANDONEI'), resenhas: () => { mark(); openMyReviews(); }, maior: () => { if (maior) { mark(); openBookPage(maior); } }, stats: () => { v.hidden = true; goTab('progresso'); }, meta: () => { const before = JSON.stringify(db.yearGoals || {}); setYearGoal(y); let n = 0; const t = setInterval(() => { if (++n > 120 || JSON.stringify(db.yearGoals || {}) !== before) { clearInterval(t); myProfileNums(); } }, 500); } }; // meta abre o ajuste da meta do ano
    nums.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); (go[b.dataset.go] || (() => {}))(); }, true));
  } catch (err) { console.warn('números do perfil', err); }
}
// vale para o perfil aberto pela aba Perfil e para o próprio perfil aberto por outro caminho (tocar no seu nome na Rede, por exemplo)
{ const _om = openMyProfile; openMyProfile = async function () { const r = await _om.apply(this, arguments); myProfileNums(); return r; }; }
{ const _fp = friendPage; friendPage = async function (h) { const r = await _fp.apply(this, arguments); const d = S.fpData; if (d && d.self && d.handle === h) myProfileNums(); return r; }; }
// Resenhas (Bia, 16/11): a seção "Avaliações" sai do perfil; o número "resenhas" abre esta página com as suas resenhas.
{ const st = document.createElement('style'); st.textContent = `
.mr-it{display:grid;grid-template-columns:54px 1fr;gap:.7rem;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.65rem;margin-bottom:.55rem;text-align:left;width:100%;color:var(--ink);font:inherit}
.mr-it .cv{width:54px;height:81px;border-radius:3px 6px 6px 3px;font-size:.45rem}
.mr-it b{display:block;font-size:.92rem;line-height:1.25}.mr-it .mr-m{font-size:.75rem;color:var(--ink-2);font-weight:700;margin:.1rem 0 .3rem}
.mr-it p{margin:0;font-size:.85rem;line-height:1.45;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-line}
`; TR.append(st); }
function openMyReviews() {
  const v = $('#shelflist'); closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page');
  const list = lib().map((e) => ({ e, r: reviewOfLib(e) })).filter((x) => x.r && String(x.r.texto || '').trim()).sort((a, z) => String(z.e.finishedAt || '').localeCompare(String(a.e.finishedAt || '')));
  v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Minhas resenhas</b><span></span></div>'
    + '<p class="hint" style="margin:.1rem 0 .7rem">' + plural(list.length, 'resenha', 'resenhas') + '</p>'
    + (list.length ? list.map(({ e, r }, i) => '<button type="button" class="mr-it" data-i="' + i + '">' + cvh(e.title, e.cover, '') + '<span><b>' + esc(e.title) + '</b><span class="mr-m">' + [r.paws ? esc(pawTxt(r.paws)) : '', e.finishedAt ? fmt(String(e.finishedAt)) : '', r.share === false ? 'privada' : '', r.spoiler ? 'spoiler' : ''].filter(Boolean).join(' · ') + '</span><p>' + esc(r.texto) + '</p></span></button>').join('')
      : '<p class="sl-empty">Você ainda não escreveu nenhuma resenha. Ao avaliar um livro, conte o que achou no campo Resenha.</p>');
  try { paintCv(v); } catch {}
  v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; try { openMyProfile(); } catch {} });
  v.querySelectorAll('.mr-it').forEach((b) => b.addEventListener('click', () => { const x = list[+b.dataset.i]; rateForm(x.e, { logs: [] }, () => openMyReviews()); }));
  v.hidden = false; v.scrollTop = 0; S.navView = { t: 'myrev', a: [] };
}
// tira a seção "Avaliações" do próprio perfil
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData;
  if (!v.hidden && d && d.self && d.handle === h) { const hd = [...v.querySelectorAll('.v3-sh')].find((x) => /^Avalia/.test(x.textContent.trim())); if (hd) { let n = hd.nextElementSibling; while (n && !n.classList.contains('v3-sh')) { const nx = n.nextElementSibling; n.remove(); n = nx; } hd.remove(); } }
  return r;
}; }
// Perfil de outra pessoa (16/11): os mesmos números, vindos do resumo publicado (shelf.stats). Quem ainda não atualizou o app fica com os antigos.
function myStatsSnap() {
  const L = lib(), y = Number(todayISO().slice(0, 4)), Y = String(y), lidos = L.filter((e) => e.status === 'LIDO');
  const rated = lidos.filter((e) => (reviewOfLib(e) || {}).paws), maior = lidos.reduce((m, e) => ((Number(e.totalPages) || 0) > (Number(m && m.totalPages) || 0) ? e : m), null);
  return { lidos: lidos.length, paginas: lidos.reduce((a, e) => a + (Number(e.totalPages) || 0), 0), nota: rated.length ? Math.round(rated.reduce((a, e) => a + reviewOfLib(e).paws, 0) / rated.length * 10) / 10 : null,
    resenhas: L.filter((e) => { const r = reviewOfLib(e); return r && r.share !== false && String(r.texto || '').trim(); }).length, quero: L.filter((e) => e.status === 'QUERO').length,
    aband: L.filter((e) => e.status === 'ABANDONEI').length, maior: maior ? { p: Number(maior.totalPages) || 0, t: String(maior.title).slice(0, 120) } : null,
    meta: Number((db.yearGoals || {})[y]) ? { ano: y, alvo: Number(db.yearGoals[y]), feitos: lidos.filter((e) => String(e.finishedAt || '').slice(0, 4) === Y).length } : null };
}
{ const _ps2 = profShelvesSnap; profShelvesSnap = function (snapshot) { _ps2.apply(this, arguments); try { snapshot.shelf.stats = myStatsSnap(); } catch {} }; }
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData;
  try {
    if (v.hidden || !d || d.self || d.handle !== h) return r;
    const nums = v.querySelector('.yo-nums'); if (!nums || !d.shelf) return r;
    // resumo antigo (sem stats): monta com o que existe — contagens, leituras com data (páginas e notas) e avaliações visíveis
    const s = d.shelf.stats || (() => { const c = d.shelf.counts || {}, ano = d.shelf.ano || [], rated = ano.filter((x) => x.p), big = ano.reduce((m, x) => ((x.pg || 0) > ((m && m.pg) || 0) ? x : m), null);
      return { lidos: c.LIDO || ano.length, paginas: ano.reduce((t, x) => t + (x.pg || 0), 0), nota: rated.length ? Math.round(rated.reduce((t, x) => t + x.p, 0) / rated.length * 10) / 10 : null,
        resenhas: (d.reviews || []).filter((x) => String(x.text || '').trim()).length, quero: c.QUERO || 0, aband: c.ABANDONEI || 0, maior: big && big.pg ? { p: big.pg, t: big.t } : null, meta: null }; })();
    const k = (n) => Number(n || 0).toLocaleString('pt-BR');
    const cell = (n, t, extra = '') => `<button type="button" disabled><b>${n}</b><small>${t}</small>${extra}</button>`;
    const pct = s.meta ? Math.min(100, Math.round(s.meta.feitos / s.meta.alvo * 100)) : 0;
    nums.classList.add('yo-n7');
    nums.innerHTML = cell(k(s.lidos), s.lidos === 1 ? 'lido' : 'lidos') + cell(k(s.paginas), 'páginas lidas') + cell(s.nota ? String(s.nota).replace('.', ',') : '–', 'nota média') + cell(k(s.resenhas), s.resenhas === 1 ? 'resenha' : 'resenhas')
      + cell(k(s.quero), 'quero ler') + cell(k(s.aband), s.aband === 1 ? 'abandonado' : 'abandonados') + cell(s.maior ? k(s.maior.p) + ' pág.' : '–', 'mais longo', s.maior ? '<span class="tt">' + esc(s.maior.t) + '</span>' : '')
      + cell(s.meta ? `${s.meta.feitos} de ${s.meta.alvo}` : '–', s.meta ? `meta de ${s.meta.ano} · ${pct}%` : 'sem meta do ano', s.meta ? `<span class="mt"><i style="width:${pct}%"></i></span>` : '');
    if (s.maior) nums.children[6].title = s.maior.t;
  } catch (err) { console.warn('números do perfil de outra pessoa', err); }
  return r;
}; }
