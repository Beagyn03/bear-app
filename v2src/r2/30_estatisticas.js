// Estatísticas novas (segunda rodada, proposta aprovada pela Bia): um seletor de ano no topo e tudo daquele ano.
// Sai: card de meta, calendário, quadrados zerados e gráficos de registro. Entra: resumo com comparação ao ano anterior,
// livros por mês, Leituras por mês, notas, gêneros, autores, formatos, tamanho e abandonos; hábito só quando há registro.
{ const st = document.createElement('style'); st.textContent = `
.sx-yr{display:flex;align-items:center;justify-content:center;gap:.6rem;margin:.1rem 0 .8rem}.sx-yr b{font-size:1.15rem;min-width:3.2rem;text-align:center;color:var(--ink)}
.sx-yr button{width:34px;height:34px;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:900;padding:0}.sx-yr button:disabled{opacity:.3}
.sx-sum{display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin-bottom:.8rem}
.sx-sum .pg-st em{display:block;font-style:normal;font-size:.7rem;font-weight:800;margin-top:.15rem;color:var(--ink-2)}.sx-sum .pg-st em.up{color:#2e8a52}.sx-sum .pg-st em.dn{color:#b4532a}
.sx-c{margin-bottom:.8rem}.sx-c h3{margin:0 0 .6rem;font-size:.95rem;color:var(--ink)}
.sx-bars{display:grid;grid-template-columns:repeat(12,1fr);gap:4px;align-items:end;height:96px}
.sx-bars div{display:grid;grid-template-rows:auto 1fr auto;justify-items:center;height:100%;font-size:.6rem;color:var(--ink-2);font-weight:800}
.sx-pies{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}.sx-pies .sx-c{margin:0}.sx-pie{display:grid;justify-items:center;align-content:start;gap:.55rem}.sx-pie h3{justify-self:start}
.pie{position:relative;width:104px;height:104px;border-radius:50%;display:grid;place-items:center}.pie::after{content:'';position:absolute;inset:22px;border-radius:50%;background:var(--panel)}.pie span{position:relative;z-index:1;font-weight:900;font-size:1.1rem}
.pie-l{list-style:none;margin:0;padding:0;display:grid;gap:.2rem;width:100%;font-size:.76rem;font-weight:700}.pie-l li{display:grid;grid-template-columns:10px 1fr auto;gap:.4rem;align-items:center}.pie-l i{width:10px;height:10px;border-radius:3px}.pie-l b{font-weight:900}
.sx-dual .sx-stack{position:relative;align-self:end;width:100%;max-width:16px;margin:0 auto;display:block}.sx-dual .sx-stack i{position:absolute;left:0;right:0;bottom:0;max-width:none;border-radius:5px 5px 2px 2px}.sx-dual .sx-stack i.s{top:0;height:100%}.sx-dual .sx-stack i.f{background:var(--acc)}
.sx-dual .sx-pair{display:flex;gap:2px;align-items:flex-end;justify-content:center;width:100%;height:100%}.sx-dual .sx-pair i{flex:1;max-width:9px;height:auto}
.sx-dual .sx-nums{display:flex;gap:2px;font-size:.52rem}.sx-dual .sx-nums em{font-style:normal;min-width:7px;text-align:center}.sx-dual .sx-nums em.s{color:color-mix(in srgb,var(--acc) 55%,var(--ink-2))}
.sx-bars i.s{background:color-mix(in srgb,var(--acc) 40%,var(--panel))}
.sx-leg2{display:flex;gap:.8rem;justify-content:center;margin-top:.5rem;font-size:.72rem;font-weight:800;color:var(--ink-2)}.sx-leg2 i{display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--acc);margin-right:.3rem;vertical-align:-1px}.sx-leg2 i.s{background:color-mix(in srgb,var(--acc) 40%,var(--panel))}
.sx-bars i{align-self:end;width:100%;max-width:18px;border-radius:5px 5px 2px 2px;background:var(--acc);min-height:2px}.sx-bars i.z{background:var(--line)}
.sx-rows{display:grid;gap:.45rem}
.sx-row{display:grid;grid-template-columns:minmax(0,7.5rem) 1fr auto;gap:.5rem;align-items:center;font-size:.8rem;color:var(--ink);font-weight:700}
.sx-row span:first-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.sx-row .tr{height:9px;border-radius:99px;background:color-mix(in srgb,var(--line) 70%,transparent);overflow:hidden}.sx-row .tr i{display:block;height:100%;border-radius:99px;background:var(--acc)}
.sx-row b{font-size:.78rem;min-width:1.4rem;text-align:right}
.sx-row .tr i.m5{background:linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff)}.sx-row .tr i.mo{background:linear-gradient(90deg,#a87a12,#f7dc6f,#c9971c)}.sx-row .tr i.mp{background:linear-gradient(90deg,#8d959c,#eef2f5,#a9b1b8)}.sx-row .tr i.mb{background:linear-gradient(90deg,#7a4419,#d9935a,#9a5a26)}.sx-row .tr i.mf{background:linear-gradient(90deg,#3d4146,#8a9096,#4d5257)}
.sx-note{font-size:.76rem;color:var(--ink-2);margin:.55rem 0 0}
.sx-two{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}
#lista:has(.sx-yr) .ys .ys-y > button,#lista:has(.sx-yr) .ys .ys-y > b{display:none}
.sx-empty{text-align:center;color:var(--ink-2);font-size:.88rem;padding:1.4rem .5rem}
`; TR.append(st); }
drawProgresso = function (box) {
  const L = lib(), cur = Number(todayISO().slice(0, 4));
  const yOf = (e) => Number(String(e.finishedAt || '').slice(0, 4));
  const read = L.filter((e) => e.status === 'LIDO' && e.finishedAt);
  const years = [...new Set([cur, ...read.map(yOf).filter(Boolean)])].sort((a, b) => b - a);
  let y = S.stY && years.includes(S.stY) ? S.stY : cur; S.stY = y;
  const fin = read.filter((e) => yOf(e) === y), prev = read.filter((e) => yOf(e) === y - 1);
  const paws = (e) => (reviewOfLib(e) || {}).paws || 0;
  const pagesOfList = (arr) => arr.reduce((s, e) => s + (Number(e.totalPages) || 0), 0);
  const pg = pagesOfList(fin), pgPrev = pagesOfList(prev);
  const rated = fin.filter((e) => paws(e)), avg = rated.length ? rated.reduce((s, e) => s + paws(e), 0) / rated.length : 0;
  const cmp = (a, b) => { if (y === cur && !b) return ''; if (!b) return ''; const d = a - b; return d === 0 ? `<em>igual a ${y - 1}</em>` : `<em class="${d > 0 ? 'up' : 'dn'}">${d > 0 ? '+' : ''}${d.toLocaleString('pt-BR')} vs ${y - 1}</em>`; };
  const stat = (v, t, s = '') => `<div class="pg-st"><b>${v}</b><small>${t}</small>${s}</div>`;
  const longest = fin.reduce((m, e) => ((Number(e.totalPages) || 0) > (Number(m && m.totalPages) || 0) ? e : m), null);
  const row = (label, n, max, cls = '') => `<div class="sx-row"><span title="${esc(label)}">${esc(label)}</span><span class="tr"><i class="${cls}" style="width:${max && n ? Math.max(4, Math.round((n / max) * 100)) : 0}%"></i></span><b>${n}</b></div>`;
  const top = (arr, n = 5) => Object.entries(arr.reduce((m, k) => { if (k) m[k] = (m[k] || 0) + 1; return m; }, {})).sort((a, b) => b[1] - a[1]).slice(0, n);
  // pizzas de notas e formato
  const PIE_C = { m5: '#b78cff', mo: '#e2b53e', mp: '#a9b3bc', mb: '#c07a43', mf: '#7d848b' }, PIE_F = { 'Físico': '#c46f2b', 'E-book': '#4f97d1', 'Audiolivro': '#4fae78', 'Outro': '#999' };
  const pieHTML = (parts) => { const tot = parts.reduce((a, x) => a + x[1], 0) || 1; let acc = 0; const segs = parts.filter((x) => x[1]).map(([, n, c]) => { const a0 = acc; acc += n / tot * 360; return `${c} ${a0.toFixed(1)}deg ${acc.toFixed(1)}deg`; }).join(','); return `<div class="pie" style="background:conic-gradient(${segs || 'var(--line) 0 360deg'})"><span>${tot}</span></div><ul class="pie-l">${parts.filter((x) => x[1]).map(([l, n, c]) => `<li><i style="background:${c}"></i>${esc(l)}<b>${n}</b></li>`).join('')}</ul>`; };
  // autores e editoras: 5 primeiros + Outros
  const CAT = ['#c46f2b', '#4f97d1', '#4fae78', '#b78cff', '#e2b53e', '#a9b3bc'];
  const pieTop = (vals0) => { const nm = new Map(); const vals = vals0.map((x) => { const v = String(x).replace(/\s+/g, ' ').trim(), k = normT(v); if (!nm.has(k)) nm.set(k, v); return nm.get(k); }); const t = top(vals, 999), head = t.slice(0, 5), rest = t.slice(5).reduce((a, x) => a + x[1], 0); return [...head, ...(rest ? [['Outros', rest]] : [])].map(([k, n], i) => [k, n, CAT[i % CAT.length]]); };
  const autP = pieTop(fin.map((e) => String(e.author || '').split(',')[0].trim()).filter(Boolean));
  const pubOf = (e) => String(e.publisher || (e.meta && e.meta.pub) || '').trim();
  const pubP = pieTop(fin.map(pubOf).filter(Boolean)), noPub = fin.filter((e) => !pubOf(e)).length;
  // livros por mês
  const perM = Array.from({ length: 12 }, (_, i) => fin.filter((e) => !e.dateApprox && Number(String(e.finishedAt).slice(5, 7)) === i + 1).length);
  const perS = Array.from({ length: 12 }, (_, i) => { const m0 = `${y}-${String(i + 1).padStart(2, '0')}-01`, m1 = `${y}-${String(i + 1).padStart(2, '0')}-31`; return lib().filter((e) => { if (!['LIDO', 'LENDO', 'ABANDONEI', 'HIBERNANDO'].includes(e.status)) return false; const ini = e.startedAt || (e.status === 'LIDO' && !e.dateApprox ? e.finishedAt : null); if (!ini) return false; const fim = e.status === 'LIDO' ? (e.finishedAt || ini) : (e.statusAt && e.status !== 'LENDO' ? e.statusAt : todayISO()); return String(ini) <= m1 && String(fim) >= m0; }).length; }), maxM = Math.max(1, ...perM, ...perS);
  const ML = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  // notas
  const tiers = [['Nota 5', (p) => p >= 5, 'm5'], ['4 e 4,5', (p) => p >= 4 && p < 5, 'mo'], ['3 e 3,5', (p) => p >= 3 && p < 4, 'mp'], ['menos de 3', (p) => p > 0 && p < 3, 'mb']];
  const tierN = tiers.map(([l, f, c]) => [l, rated.filter((e) => f(paws(e))).length, c]), maxT = Math.max(1, ...tierN.map((x) => x[1]));
  // gêneros, autores, formatos, tamanho
  const gen = top(fin.map((e) => e.genre)), maxG = gen.length ? gen[0][1] : 1;
  const aut = top(fin.flatMap((e) => String(e.author || '').split(',').map((a) => a.trim()).filter(Boolean))).filter((x) => x[1] > 1 || fin.length <= 6), maxA = aut.length ? aut[0][1] : 1;
  const FMT = { FISICO: 'Físico', EBOOK: 'E-book', AUDIO: 'Audiolivro' };
  const fmt = top(fin.map((e) => FMT[e.format || 'FISICO'] || 'Outro'), 3), maxF = fmt.length ? fmt[0][1] : 1;
  const withP = fin.filter((e) => Number(e.totalPages) > 0);
  const size = [['Até 200 páginas', withP.filter((e) => e.totalPages <= 200).length], ['201 a 400 páginas', withP.filter((e) => e.totalPages > 200 && e.totalPages <= 400).length], ['Mais de 400', withP.filter((e) => e.totalPages > 400).length]], maxS = Math.max(1, ...size.map((x) => x[1]));
  // abandonos do ano (pela data em que parou, quando houver)
  const abY = L.filter((e) => e.status === 'ABANDONEI' && Number(String(e.abandonedAt || e.stoppedAt || e.updatedAt || e.addedAt || '').slice(0, 4)) === y).length;
  // hábito: só se houver registro de páginas no ano
  let hab = '';
  try {
    const by = pagesByDay(), days = Object.keys(by).filter((d) => d.startsWith(String(y)) && by[d] > 0).sort();
    if (days.length) {
      let best = 0, run = 0, pv = null; for (const d of days) { run = pv && between(pv, d) === 1 ? run + 1 : 1; best = Math.max(best, run); pv = d; }
      const tot = days.reduce((s, d) => s + by[d], 0), wk = [0, 0, 0, 0, 0, 0, 0]; days.forEach((d) => { wk[new Date(d + 'T12:00:00').getDay()] += by[d]; });
      const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'], fav = wk.indexOf(Math.max(...wk));
      hab = `<section class="v3c sx-c"><h3>Hábito de leitura</h3><div class="sx-two">${stat(plural(days.length, 'dia', 'dias'), 'com leitura registrada')}${stat(plural(best, 'dia', 'dias'), 'maior sequência')}${stat(Math.round(tot / days.length), 'páginas por dia lido')}${stat(WD[fav], 'dia em que mais lê')}</div></section>`;
      // tempo de leitura (Bia, 20/11): tempo e ritmo só das sessões com cronômetro (o Ler); páginas sem cronômetro à parte;
      // nunca ritmo com tempo zero.
      const F = (db.focus || []).filter((f) => String(f.date || '').startsWith(String(y))), fm = F.reduce((a2, f) => a2 + (Number(f.minutes) || 0), 0), fp = F.reduce((a2, f) => a2 + (Number(f.pages) || 0), 0);
      const semP = Math.max(0, tot - fp), hh = Math.floor(fm / 60), mn = fm % 60, tt = fm ? (hh ? hh + ' h' + (mn ? ' ' + mn + ' min' : '') : mn + ' min') : '';
      const fpm = F.filter((f) => Number(f.minutes) > 0 && Number(f.pages) > 0), rm = fpm.reduce((a2, f) => a2 + Number(f.minutes), 0), rp = fpm.reduce((a2, f) => a2 + Number(f.pages), 0);
      let rit = rm >= 30 && rp ? Math.round((rp / rm) * 60) : 0; if (rit > 150) rit = 0; // ritmo só com 30 min de cronômetro e sem valor impossível (teste 20/11 item 38: 219 pág./h)
      if (fm || semP) hab += '<section class="v3c sx-c"><h3>Tempo de leitura</h3><div class="sx-two"' + (fm && semP ? '' : ' style="grid-template-columns:1fr"') + '>'
        + (fm ? stat(tt + (rit ? ' · ' + rit + ' pág./h' : ''), 'com cronômetro · das sessões no Ler') : '')
        + (semP ? stat(semP.toLocaleString('pt-BR') + ' páginas', 'sem cronômetro · atualizações fora do Ler') : '')
        + '</div><small class="sx-note">' + tot.toLocaleString('pt-BR') + ' páginas registradas em atualizações no ano. As ' + 'páginas lidas lá em cima somam os livros terminados.</small></section>';
    }
  } catch {}
  const yi = years.indexOf(y);
  box.innerHTML = `<header class="v3-top"><h1>Estatísticas</h1><div class="v3-acts"><button type="button" class="v3-bell" id="v3-bell" aria-label="Notificações">${MN('notificacoes', 'ico-g')}${unread() ? `<u>${unread() > 9 ? '9+' : unread()}</u>` : ''}</button></div></header>
    <div class="sx-yr"><button type="button" data-sy="${years[yi + 1] || ''}" ${years[yi + 1] ? '' : 'disabled'} aria-label="Ano anterior">‹</button><b>${y}</b><button type="button" data-sy="${years[yi - 1] || ''}" ${years[yi - 1] ? '' : 'disabled'} aria-label="Ano seguinte">›</button></div>
    ${fin.length ? `
    <div class="sx-sum">${stat(fin.length, fin.length === 1 ? 'livro lido' : 'livros lidos', cmp(fin.length, prev.length))}${stat(pg.toLocaleString('pt-BR'), 'páginas lidas', cmp(pg, pgPrev))}${stat(avg ? avg.toLocaleString('pt-BR', { maximumFractionDigits: 1 }) : '—', 'nota média', '')}${stat(longest && longest.totalPages ? Number(longest.totalPages).toLocaleString('pt-BR') : '—', 'páginas no mais longo', longest && longest.totalPages ? `<em>${esc(longest.title)}</em>` : '')}</div>
    <div id="sx-ys"></div>
    <section class="v3c sx-c"><h3>Livros por mês</h3><div class="sx-bars sx-dual">${perM.map((n, i) => { const c = Math.max(perS[i], n), h = (k) => (k ? Math.max(8, Math.round((k / maxM) * 100)) : 2); return `<div title="${ML[i]}: leu ${c}, terminou ${n}"><span class="sx-nums">${c ? `<em>${c}</em>` : ''}</span><span class="sx-stack" style="height:${h(c)}%"><i class="s${c ? '' : ' z'}"></i>${n ? `<i class="f" style="height:${Math.round((n / c) * 100)}%"></i>` : ''}</span><span>${ML[i]}</span></div>`; }).join('')}</div><div class="sx-leg2"><span><i class="s"></i>lendo no mês</span><span><i></i>terminados</span></div></section>
    ${(rated.length || fmt.length) ? `<div class="sx-pies">${rated.length ? `<section class="v3c sx-c sx-pie"><h3>Notas</h3>${pieHTML(tierN.map(([l, n, c]) => [l, n, PIE_C[c] || '#999']))}${fin.length - rated.length ? `<p class="sx-note">${plural(fin.length - rated.length, 'livro', 'livros')} sem nota</p>` : ''}</section>` : ''}${fmt.length ? `<section class="v3c sx-c sx-pie"><h3>Formato</h3>${pieHTML(fmt.map(([k, n]) => [k, n, PIE_F[k] || '#999']))}</section>` : ''}</div>` : ''}
    ${gen.length ? `<section class="v3c sx-c"><h3>Gêneros</h3><div class="sx-rows">${gen.map(([k, n]) => row(k, n, maxG)).join('')}</div></section>` : ''}
    ${(autP.length || fin.length) ? `<div class="sx-pies">${autP.length ? `<section class="v3c sx-c sx-pie"><h3>Autores</h3>${pieHTML(autP)}</section>` : ''}<section class="v3c sx-c sx-pie"><h3>Editoras</h3>${pubP.length ? pieHTML(pubP) : '<p class="sx-note" style="margin:.2rem 0 0">Buscando as editoras dos seus livros…</p>'}${pubP.length && noPub ? `<p class="sx-note">${plural(noPub, 'livro', 'livros')} sem editora</p>` : ''}</section></div>` : ''}
    ${withP.length ? `<section class="v3c sx-c"><h3>Tamanho dos livros</h3><div class="sx-rows">${size.map(([k, n]) => row(k, n, maxS)).join('')}</div></section>` : ''}
    ${abY ? `<section class="v3c sx-c"><h3>Abandonados</h3><p class="sx-note" style="margin:0">${plural(abY, 'livro abandonado', 'livros abandonados')} em ${y}. Tudo bem largar o que não está bom.</p></section>` : ''}
    ${hab}` : `<p class="sx-empty">Nenhum livro terminado em ${y} ainda.${hab ? '' : ' Quando você marcar um livro como lido, os números aparecem aqui.'}</p>${hab}`}`;
  $('#v3-bell', box)?.addEventListener('click', openNotif);
  $$('[data-sy]', box).forEach((b) => b.addEventListener('click', () => { if (!b.dataset.sy) return; S.stY = Number(b.dataset.sy); S.ysYear = S.stY; drawProgresso(box); }));
  const a = $('#sx-ys', box); if (a) { S.ysYear = y; mountYearShelf(box, a, ysItems(), true); a.remove(); }
  paintCv(box);
};

// Editoras: busca a ficha (que traz a editora) dos lidos que ainda não têm, poucos por vez, e redesenha as Estatísticas
{ let busy = false; const tried = new Set();
  const fillPubs = async () => {
    if (busy || S.tab !== 'progresso') return; busy = true;
    try {
      const need = lib().filter((e) => e.status === 'LIDO' && !e.publisher && !(e.meta && e.meta.pub) && !tried.has(e.id)).slice(0, 6);
      let got = 0; for (const e of need) { tried.add(e.id); try { await fetchBookMeta(e); if (e.meta && e.meta.pub) got++; } catch {} }
      if (got) { save(); const v = $('#shelflist'); if ((!v || v.hidden) && S.tab === 'progresso') { const y = window.scrollY; drawTab(); window.scrollTo(0, y); } }
      if (need.length === 6) setTimeout(() => { busy = false; fillPubs(); }, 1500); else busy = false;
    } catch { busy = false; }
  };
  const _dt = drawTab; drawTab = function () { const r = _dt.apply(this, arguments); if (S.tab === 'progresso') setTimeout(fillPubs, 800); return r; };
}
