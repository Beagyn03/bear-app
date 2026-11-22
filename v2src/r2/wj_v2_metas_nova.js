// Metas nova (Bia, 21/11; protótipo "Metas (nova)" aprovado): abas Dia · Mês · Ano com anel grande e "Editar meta".
// Dia: páginas ou minutos de hoje × meta diária (db.prefs.dailyGoal) + a Órbita integrada (dias seguidos, recorde, semana).
// Mês: livros do mês × meta do mês (db.prefs.monthGoal), capas e Resumo do mês. Ano: meta do ano de sempre (db.yearGoals),
// capas dos lidos e "Meu ano em livros". Embaixo: Lembrete para ler (lembrete da órbita), Prazos dos livros (e as metas
// com prazo antigas, sem perder nada) e Metas concluídas. A tela antiga da Órbita (calendário) continua acessível por
// "Ver calendário" na aba Dia; openOrbita() passa a abrir Metas na aba Dia.
{ const st = document.createElement('style'); st.textContent = `
.mtn svg.i{fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.mtn .mtabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;border-radius:14px;background:color-mix(in srgb,var(--line) 55%,transparent);margin:2px 0 16px}
.mtn .mtabs button{min-height:40px;border:0;border-radius:11px;background:none;color:var(--ink-2);font:inherit;font-weight:800;cursor:pointer}
.mtn .mtabs button.on{background:var(--panel);color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.14)}
.mtn .mring{position:relative;width:196px;height:196px;margin:4px auto 6px;display:grid;place-items:center}
.mtn .mring svg{position:absolute;inset:0;transform:rotate(-90deg)}.mtn .mring circle{fill:none;stroke-width:12;stroke-linecap:round}
.mtn .mring .bgc{stroke:color-mix(in srgb,var(--line) 80%,transparent)}.mtn .mring .fgc{stroke:var(--acc);transition:stroke-dashoffset .8s ease}
.mtn .mring .mc{display:grid;justify-items:center;gap:2px;text-align:center}
.mtn .mring .mc b{font-family:var(--v2-disp,Georgia,serif);font-size:40px;line-height:1;color:var(--ink)}.mtn .mring .mc b i{font-style:normal;color:var(--ink-2);font-size:26px;opacity:.8}
.mtn .mring .mc small{color:var(--ink-2);font-weight:700}
.mtn .mfr{text-align:center;margin:0 8px 6px;font-weight:700;color:var(--ink)}.mtn .mfr span{color:var(--acc)}
.mtn .medit{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:10px;margin:8px 0 2px}
.mtn .medit .ib{width:40px;height:40px;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:20px;font-weight:800;cursor:pointer}
.mtn .medit b{min-width:72px;text-align:center;font-size:18px;color:var(--ink)}
.mtn .medit .ok{min-height:40px;padding:0 16px;border:0;border-radius:999px;background:var(--acc);color:#fff;font:inherit;font-weight:800;cursor:pointer}
.mtn .mchips{display:flex;justify-content:center;gap:6px;margin:6px 0 0}
.mtn .mchips button{min-height:36px;padding:0 14px;border-radius:999px;border:1px solid var(--line);background:none;color:var(--ink);font:inherit;font-weight:800;cursor:pointer}
.mtn .mchips button.on{background:var(--acc);border-color:var(--acc);color:#fff}
.mtn .mlink{display:block;margin:6px auto 0;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;min-height:40px;cursor:pointer}
.mtn .orbs{margin-top:14px;padding:12px 14px;border-radius:16px;border:1px solid var(--line);background:var(--panel)}
.mtn .orbs .hd{display:flex;align-items:center;gap:8px;color:var(--ink)}.mtn .orbs .hd svg{color:color-mix(in srgb,var(--acc) 55%,#7e63c9)}
.mtn .orbs .hd b{font-size:15px}.mtn .orbs .hd small{margin-left:auto;color:var(--ink-2);font-weight:700}
.mtn .orbd{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:10px}
.mtn .orbd span{display:grid;justify-items:center;gap:4px;font-size:11px;font-weight:800;color:var(--ink-2)}
.mtn .orbd i{width:30px;height:30px;border-radius:50%;border:2px dashed var(--line);display:grid;place-items:center}
.mtn .orbd .on i{border:0;background:color-mix(in srgb,#7e63c9 80%,var(--panel));box-shadow:0 0 10px color-mix(in srgb,#7e63c9 45%,transparent)}
.mtn .orbd .on i::after{content:'';width:8px;height:8px;border-radius:50%;background:#fff}
.mtn .orbd .off i{border-style:dotted;opacity:.6}.mtn .orbd .hj{color:var(--acc)}.mtn .orbd .hj i{border-color:var(--acc)}
.mtn .orbs p{margin:10px 0 0;font-size:13px;color:var(--ink-2)}
.mtn .orbs .mlink{margin:4px 0 0;padding:0;min-height:36px}
.mtn .mcv{display:flex;gap:6px;overflow-x:auto;padding:8px 2px 4px;margin-top:6px}.mtn .mcv .mt-cv{flex:none;width:48px;height:72px;border-radius:6px;overflow:hidden}
.mtn .msec{margin:22px 2px 8px;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
.mtn .mrow{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:10px 12px;border-radius:14px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer;margin-bottom:8px}
.mtn .mrow .t{display:grid;gap:2px;flex:1;min-width:0}.mtn .mrow .t b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mtn .mrow small{color:var(--ink-2)}
.mtn .mrow>svg{color:var(--acc);flex:none}.mtn .mrow .mt-cv{flex:none;width:36px;height:54px;border-radius:5px;overflow:hidden}
.mtn .mrow .pbar{height:5px;border-radius:5px;background:color-mix(in srgb,var(--line) 80%,transparent);overflow:hidden;margin-top:4px}.mtn .mrow .pbar i{display:block;height:100%;background:var(--acc)}
.mtn .mrow.done>svg{color:#3f9a64}.mtn .mempty{margin:0 4px 8px;color:var(--ink-2);font-size:13.5px}
.mtn .madd{display:block;margin:2px 4px 0;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;min-height:40px;padding:0;cursor:pointer}
.mtn .msec-h{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}
.mtn .mhadd{flex:none;min-height:44px;padding:0 14px;border-radius:999px;border:1.5px solid color-mix(in srgb,var(--acc) 55%,var(--line));background:none;color:var(--acc);font:inherit;font-size:14px;font-weight:900;letter-spacing:0;text-transform:none;cursor:pointer}
@media (prefers-reduced-motion: reduce){.mtn .mring .fgc{transition:none}}
`; TR.append(st); }
const MTN_MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const mtnP = () => (db.prefs || (db.prefs = {}));
const mtnDaily = () => { const g = mtnP().dailyGoal; return g && g.n > 0 ? g : null; };
const mtnMonth = () => { const n = Number(mtnP().monthGoal) || 0; return n > 0 ? n : 0; };
function mtnToday() { const t = todayISO(); let pages = 0, minutes = 0;
  try { for (const x of readingEvents()) if (String(x.date || '').slice(0, 10) === t) pages += Number(x.pages) || 0; } catch {}
  for (const f of db.focus || []) if (String(f.date || '').slice(0, 10) === t) minutes += Number(f.minutes) || 0;
  return { pages, minutes }; }
function mtnRing(v, n, sub) { const r = 84, c = 2 * Math.PI * r, p = Math.max(0, Math.min(1, n ? v / n : 0));
  return `<div class="mring" role="img" aria-label="${v} de ${n || 'sem meta'} ${esc(sub)}"><svg viewBox="0 0 196 196" aria-hidden="true"><circle class="bgc" cx="98" cy="98" r="${r}"/><circle class="fgc" cx="98" cy="98" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${(c * (1 - p)).toFixed(1)}"/></svg><div class="mc"><b>${v}<i>/${n || '–'}</i></b><small>${esc(sub)}</small></div></div>`; }
const mtnCv = (e) => { try { return cvh(e.title, e.cover, 'mt-cv'); } catch { return ''; } };
function mtnEdit(k, val, unit) {
  if (S.mtnEd !== k) return `<button type="button" class="mlink" data-mt="edit" data-k="${k}">${val ? 'Editar meta' : 'Definir meta'}</button>`;
  return `<div class="medit"><button type="button" class="ib" data-mt="step" data-v="-1" aria-label="Diminuir">−</button><b aria-live="polite">${S.mtnVal} ${esc(unit)}</b><button type="button" class="ib" data-mt="step" data-v="1" aria-label="Aumentar">+</button><button type="button" class="ok" data-mt="save">Salvar</button></div>`;
}
function mtnDia() {
  const g = mtnDaily(), u = S.mtnEd === 'dia' ? S.mtnU : (g ? g.u : 'pag'), pagU = u !== 'min', T = mtnToday(), v = pagU ? T.pages : T.minutes, n = g ? (g.u === u ? g.n : 0) : 0;
  const falta = n ? n - v : 0;
  let h = mtnRing(v, n, pagU ? 'páginas hoje' : 'minutos hoje')
    + `<p class="mfr">${!n ? 'Defina quanto quer ler por dia' : falta > 0 ? `Faltam <span>${falta} ${pagU ? (falta === 1 ? 'página' : 'páginas') : (falta === 1 ? 'minuto' : 'minutos')}</span> para a meta de hoje` : 'Meta de hoje cumprida'}</p>`;
  if (S.mtnEd === 'dia') h += `<div class="mchips" role="group" aria-label="Contar em">${[['pag', 'Páginas'], ['min', 'Minutos']].map(([k, l]) => `<button type="button" class="${u === k ? 'on' : ''}" data-mt="unit" data-k="${k}" aria-pressed="${u === k}">${l}</button>`).join('')}</div>`;
  h += mtnEdit('dia', g, pagU ? 'pág./dia' : 'min/dia');
  // Órbita integrada
  let s = null; try { s = orbStats(); } catch {}
  if (s) { const t = todayISO(), dias = [];
    for (let i = 6; i >= 0; i--) { const d = orbAddDays(t, -i), w = new Date(d + 'T12:00:00').getDay(); let off = false; try { off = orbIsOff(d); } catch {}
      dias.push(`<span class="${s.days.has(d) ? 'on' : off ? 'off' : ''}${i === 0 ? ' hj' : ''}" title="${s.days.has(d) ? 'leu' : off ? 'folga' : 'sem leitura'}"><i></i>${i === 0 ? 'hoje' : 'dstqqss'[w]}</span>`); }
    const nxt = s.today ? '' : `Leia 1 página hoje para chegar a ${s.cur + 1} ${s.cur + 1 === 1 ? 'dia' : 'dias'}.`;
    h += `<div class="orbs"><div class="hd">${v4ic('orb', 20)}<b>Órbita · ${s.cur} ${s.cur === 1 ? 'dia seguido' : 'dias seguidos'}</b><small>recorde ${s.best}</small></div><div class="orbd">${dias.join('')}</div>`
      + `<p>${s.today ? 'Leitura de hoje registrada. ' : nxt + ' '}Dias de folga do prazo não quebram a órbita.</p><button type="button" class="mlink" data-mt="cal">Ver calendário ›</button></div>`; }
  return h;
}
function mtnMes() {
  const now = new Date(), ym = todayISO().slice(0, 7), nome = MTN_MES[now.getMonth()], n = mtnMonth();
  let d = { fin: [], pages: 0 }; try { d = v2RsData(ym); } catch {}
  const v = d.fin.length, falta = n ? n - v : 0;
  let h = mtnRing(v, n, `${v === 1 ? 'livro' : 'livros'} em ${nome}`)
    + `<p class="mfr">${!n ? `Defina quantos livros quer terminar em ${nome}` : falta > 0 ? `${falta === 1 ? 'Falta' : 'Faltam'} <span>${falta} ${falta === 1 ? 'livro' : 'livros'}</span> para a meta de ${nome}` : `Meta de ${nome} cumprida`}${d.pages ? ` · ${Number(d.pages).toLocaleString('pt-BR')} páginas no mês` : ''}</p>`
    + mtnEdit('mes', n, 'livros/mês');
  if (d.fin.length) h += `<div class="mcv" aria-label="Livros terminados em ${nome}">${d.fin.map(mtnCv).join('')}</div>`;
  h += `<button type="button" class="mrow" data-mt="resumo">${v4ic('cal', 20)}<span class="t"><b>Resumo do mês</b><small>seu mês em livros, para guardar e compartilhar</small></span>${v4ic('chev', 16)}</button>`;
  return h;
}
function mtnAno() {
  let Y = { y: todayISO().slice(0, 4), target: 0, done: 0 }; try { Y = yearInfo(); } catch {}
  const lidos = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(Y.y)).sort((a, b) => String(b.finishedAt).localeCompare(String(a.finishedAt)));
  let h = mtnRing(Y.done, Y.target, `${Y.done === 1 ? 'livro' : 'livros'} em ${Y.y}`)
    + `<p class="mfr">${!Y.target ? `Quantos livros você quer ler em ${Y.y}?` : Y.left > 0 ? `${Y.left === 1 ? 'Falta' : 'Faltam'} <span>${Y.left} ${Y.left === 1 ? 'livro' : 'livros'}</span> · ${esc(Y.paceTxt || '')}` : 'Meta do ano batida!'}${Y.shelf ? ` · estante “${esc(Y.shelf)}”` : ''}</p>`
    + mtnEdit('ano', Y.target, 'livros/ano');
  if (Y.target && (db.shelves || []).length) h += `<button type="button" class="mlink" data-mt="conta">O que conta na meta</button>`;
  if (lidos.length) h += `<div class="mcv" aria-label="Livros lidos em ${Y.y}">${lidos.map(mtnCv).join('')}</div>`;
  if (lidos.length) h += `<button type="button" class="mrow" data-mt="ano">${v4ic('stats', 20)}<span class="t"><b>Meu ano em livros</b><small>retrospectiva de ${Y.y} para compartilhar</small></span>${v4ic('chev', 16)}</button>`;
  if (Y.target) h += `<button type="button" class="mrow" data-mt="det">${v4ic('meta', 20)}<span class="t"><b>Detalhes da meta</b><small>ritmo, livros por mês e anos anteriores</small></span>${v4ic('chev', 16)}</button>`;
  return h;
}
function mtnBaixo() {
  const o = (() => { try { return v4orb(); } catch { return null; } })();
  const lem = o && o.on ? `todo dia às ${v4hhmm(o.hour, o.minute)}${(o.off || []).length ? ' · com folgas' : ''}` : 'desligado';
  let h = `<div class="msec">Lembrete</div><button type="button" class="mrow" data-mt="lem">${v4ic('sino', 20)}<span class="t"><b>Lembrete para ler</b><small>${esc(lem)}</small></span>${v4ic('chev', 16)}</button>`;
  // prazos dos livros
  const t = todayISO(), comPrazo = lib().filter((e) => e.status === 'LENDO' && e.dueAt && e.dueAt >= t);
  // adicionar fica no cabeçalho da seção (Bia, 22/11: a lista pode ser enorme e o botão no fim obrigava a rolar)
  h += '<div class="msec msec-h"><span>Prazos dos livros</span><button type="button" class="mhadd" data-mt="novo" aria-label="Novo prazo ou meta com prazo">+ Novo</button></div>';
  if (comPrazo.length) h += comPrazo.map((e) => { const tot = Number(e.totalPages) || 0, pg = Number(libProgress(e)) || 0, left = Math.max(0, tot - pg), dias = Math.max(1, Math.round((new Date(e.dueAt + 'T12:00:00') - new Date(t + 'T12:00:00')) / 86400000) + 1), pct = tot ? Math.round(pg / tot * 100) : 0;
    const dt = new Date(e.dueAt + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `<button type="button" class="mrow" data-mt="prazo" data-id="${esc(e.id)}">${mtnCv(e)}<span class="t"><b>${esc(e.title)}</b><small>até ${dt}${tot ? ` · faltam ${left} pág. · ${Math.ceil(left / dias)} por dia` : ''}</small><span class="pbar"><i style="width:${pct}%"></i></span></span>${v4ic('chev', 16)}</button>`; }).join('');
  else h += '<p class="mempty">Nenhum livro com prazo agora.</p>';
  // metas com prazo antigas (listas de livros com data): continuam aqui, nada se perde
  const gs = (db.goals || []).filter((g) => g && g.targetDate), ativas = [], feitas = [];
  for (const g of gs) { const tot = g.books.reduce((a, b) => a + (b.totalPages || 0), 0); let dn = 0; try { dn = g.books.reduce((a, b) => a + pagesOf(g, b), 0); } catch {}
    const pct = tot ? Math.round(dn / tot * 100) : 0; (pct >= 100 ? feitas : ativas).push({ g, pct, tot, dn }); }
  if (ativas.length) h += ativas.map(({ g, pct, tot, dn }) => `<button type="button" class="mrow" data-mt="goal" data-g="${esc(g.id)}">${v4ic('meta', 20)}<span class="t"><b>${esc(g.name)}</b><small>${plural(g.books.length, 'livro', 'livros')} · ${dn} de ${tot} pág.${g.targetDate ? ' · até ' + new Date(g.targetDate + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : ''}</small><span class="pbar"><i style="width:${pct}%"></i></span></span>${v4ic('chev', 16)}</button>`).join('');
  // metas concluídas
  const done = [], cy = todayISO().slice(0, 4);
  for (const [y, n] of Object.entries(db.yearGoals || {})) { if (y >= cy || !(Number(n) > 0)) continue; const c = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(y)).length; if (c >= Number(n)) done.push([`Meta de ${y}`, `${c} de ${n} livros`, '']); }
  try { const Y = yearInfo(); if (Y.target && Y.done >= Y.target) done.unshift([`Meta de ${Y.y}`, `${Y.done} de ${Y.target} livros`, '']); } catch {}
  for (const { g } of feitas) done.push([g.name, 'concluída', g.id]);
  lib().filter((e) => e.status === 'LIDO' && e.dueAt && e.finishedAt && String(e.finishedAt).slice(0, 10) <= e.dueAt).slice(-6).forEach((e) => done.push([`${e.title} até ${new Date(e.dueAt + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`, 'cumprida em ' + new Date(String(e.finishedAt).slice(0, 10) + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), '']));
  h += '<div class="msec">Metas concluídas</div>' + (done.length ? done.map(([n, s, gid]) => `<button type="button" class="mrow done"${gid ? ` data-mt="goal" data-g="${esc(gid)}"` : ' data-mt="nada"'}>${v4ic('ok', 20)}<span class="t"><b>${esc(n)}</b><small>${esc(s)}</small></span></button>`).join('') : '<p class="mempty">Nenhuma ainda. As metas cumpridas aparecem aqui.</p>');
  return h;
}
function mtnHTML() {
  const t = S.mtnTab || 'ano';
  const tabs = `<div class="mtabs" role="tablist" aria-label="Período">${[['dia', 'Dia'], ['mes', 'Mês'], ['ano', 'Ano']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${t === k}" class="${t === k ? 'on' : ''}" data-mt="tab" data-k="${k}">${l}</button>`).join('')}</div>`;
  let body = ''; try { body = t === 'dia' ? mtnDia() : t === 'mes' ? mtnMes() : mtnAno(); } catch (err) { console.warn('metas', err); }
  return `<div class="mtn">${tabs}${body}${mtnBaixo()}</div>`;
}
function mtnDraw(first) {
  const v = $('#shelflist'); if (!v) return; const sc = v.scrollTop;
  if (first) v4Page('Metas', mtnHTML(), () => openMetasV2(S.mtnTab));
  else { const body = v.querySelector('.sl-body'); const box = body && body.querySelector('.mtn'); if (box) box.outerHTML = mtnHTML(); else v4Page('Metas', mtnHTML()); try { paintCv(v); } catch {} v.scrollTop = sc; }
  S.listRedraw = () => mtnDraw(false); S.navView = { t: 'metas', a: [S.mtnTab] };
}
function mtnNovoPrazo() { const L = lib().filter((e) => e.status === 'LENDO'); if (!L.length) return; if (L.length === 1) { try { dueSheet(L[0]); } catch {} return; }
  try { sheet('Prazo para qual livro?', L.map((e) => [e.title, () => dueSheet(e)])); } catch {} }
function openMetasV2(tab) { S.mtnTab = tab || S.mtnTab || 'ano'; S.mtnEd = null; mtnDraw(true); }
openGoalsV4 = function () { openMetasV2('ano'); };
{ const _orbCal = openOrbita; window.__orbCal = _orbCal; openOrbita = function () { openMetasV2('dia'); }; }
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('.mtn [data-mt]'); if (!b) return; ev.stopPropagation();
  const a = b.dataset.mt, k = b.dataset.k;
  if (a === 'tab') { S.mtnTab = k; S.mtnEd = null; return mtnDraw(false); }
  if (a === 'edit') { S.mtnEd = k;
    if (k === 'dia') { const g = mtnDaily(); S.mtnU = g ? g.u : 'pag'; S.mtnVal = g ? g.n : 20; }
    else if (k === 'mes') S.mtnVal = mtnMonth() || 2;
    else { let Y = {}; try { Y = yearInfo(); } catch {} S.mtnVal = Y.target || 24; }
    return mtnDraw(false); }
  if (a === 'unit') { S.mtnU = k; S.mtnVal = k === 'min' ? 20 : 20; return mtnDraw(false); }
  if (a === 'step') { const kk = S.mtnEd, step = kk === 'dia' ? 5 : 1, max = kk === 'dia' ? 600 : kk === 'mes' ? 60 : 1000; S.mtnVal = Math.max(1, Math.min(max, (S.mtnVal || 1) + Number(b.dataset.v) * step)); return mtnDraw(false); }
  if (a === 'save') { const kk = S.mtnEd, n = S.mtnVal;
    if (kk === 'dia') mtnP().dailyGoal = { n, u: S.mtnU || 'pag' };
    else if (kk === 'mes') mtnP().monthGoal = n;
    else if (kk === 'ano') { const y = todayISO().slice(0, 4); db.yearGoals = { ...(db.yearGoals || {}) }; db.yearGoals[y] = n; db.yearGoalSet = { ...(db.yearGoalSet || {}) }; if (!db.yearGoalSet[y]) db.yearGoalSet[y] = todayISO(); }
    S.mtnEd = null; save(); try { renderHome(todayISO()); } catch {} toast('Meta salva'); return mtnDraw(false); }
  if (a === 'cal') { try { (window.__orbCal || (() => {}))(); } catch {} return; }
  if (a === 'resumo') { try { v2ResumoOpen(0); } catch { toast('Resumo do mês indisponível agora'); } return; }
  if (a === 'ano') { try { shareYear(); } catch {} return; }
  if (a === 'det') { try { openGoalPage(Number(todayISO().slice(0, 4))); } catch {} return; }
  if (a === 'conta') { try { yearShelfSheet(todayISO().slice(0, 4)); } catch {} return; }
  if (a === 'lem') { try { openLembretes(); } catch {} return; }
  if (a === 'prazo') { const e = lib().find((x) => x.id === b.dataset.id); if (e) try { dueSheet(e); } catch {} return; }
  if (a === 'novo') { const temLendo = lib().some((e) => e.status === 'LENDO'), nova = () => { try { openGoalNew(); } catch {} };
    if (!temLendo) return nova();
    try { sheet('Adicionar', [['Prazo para um livro', () => mtnNovoPrazo()], ['Meta para vários livros', nova]]); } catch {} return; }
  if (a === 'novoprazo') return mtnNovoPrazo();
  if (a === 'goal') { const g = (db.goals || []).find((x) => x.id === b.dataset.g); const v = $('#shelflist'); if (v) v.hidden = true; try { screen('desafios'); if (g) setTimeout(() => open(g), 60); } catch {} return; }
}, true);
