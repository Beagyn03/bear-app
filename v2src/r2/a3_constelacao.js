// Histórico como constelação (Bia, 18/11): cada acontecimento é uma estrela própria, ligada à anterior por uma linha.
// O cartão tem o nome do que aconteceu (Leitura atualizada, Nova anotação, Novo trecho, Novo comentário, Começou a ler,
// Prazo definido) com data e hora; dentro, a página e o texto. Estrela grande = leitura (dourada quando bateu a meta do dia).
{ const st = document.createElement('style'); st.textContent = `
#editor .cs-flow{position:relative;padding:.2rem 0 .4rem}
#editor .cs-lines{position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:0}
#editor .cs-n{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr);gap:.35rem;align-items:start;margin-bottom:.6rem}
#editor .cs-s{position:relative;z-index:1;display:block;width:22px;height:22px;margin:.55rem 0 0 var(--x,10px);line-height:22px;text-align:center;font-size:13px;color:#c9b8ff;text-shadow:0 0 6px rgba(182,156,255,.7)}
#editor .cs-s.big{font-size:22px;color:#b69cff}
#editor .cs-s.ok{color:#f2c94c;text-shadow:0 0 10px rgba(242,201,76,.9),0 0 3px rgba(242,201,76,1)}
#editor .cs-s.ev{color:color-mix(in srgb,var(--acc) 75%,#fff);text-shadow:0 0 6px color-mix(in srgb,var(--acc) 60%,transparent)}
#editor .cs-n .tl-c{margin-top:0}
#editor .cs-n .tl-ct{flex-wrap:wrap}
#editor .tl-ct .cs-w{font-size:.72rem;font-weight:700;color:var(--ink-2);margin-left:.3rem}
#editor .cs-pg{font-size:.76rem;font-weight:800;color:var(--acc);margin-top:.25rem}#editor .cs-pg i{font-style:normal;font-weight:700;color:var(--ink-2);margin-left:.35rem}#editor .cs-pg em{font-style:normal;color:#c08a12;margin-left:.35rem}
#editor .cs-n .tl-c p{margin-top:.25rem}
#editor .cs-sky{position:absolute;left:0;top:0;bottom:0;width:52px;z-index:0;background-image:radial-gradient(1px 1px at 8px 30px,color-mix(in srgb,var(--ink) 25%,transparent) 50%,transparent 51%),radial-gradient(1px 1px at 40px 90px,color-mix(in srgb,var(--ink) 20%,transparent) 50%,transparent 51%),radial-gradient(1.5px 1.5px at 22px 150px,color-mix(in srgb,var(--ink) 18%,transparent) 50%,transparent 51%);background-size:52px 180px;opacity:.8}
`; TR.append(st); }
const CS_X = [8, 24, 14, 28, 6, 20];
const csWhen = (d, at) => { const t = todayISO(), y = new Date(Date.parse(t) - 864e5).toISOString().slice(0, 10); const dd = d === t ? 'Hoje' : d === y ? 'Ontem' : d.slice(8, 10) + '/' + d.slice(5, 7) + (d.slice(0, 4) !== t.slice(0, 4) ? '/' + d.slice(0, 4) : ''); return dd + (at ? ' às ' + tlHM(at) : ''); };
function csEvents(e) {
  const days = new Map(tlEvents(e).map((x) => [x.d, x])), ev = [], d10 = (x) => String(x || '').slice(0, 10);
  (e.readLog || []).forEach((l, i) => { if (l && l.date) ev.push({ k: 'rl', d: d10(l.date), at: l.at && d10(l.at) === d10(l.date) ? l.at : null, pages: Number(l.pages) || 0, ix: i }); });
  (e.diary || []).forEach((x) => { if (x && x.d) ev.push({ k: 'dy', d: d10(x.d), at: x.at || null, x, page: Number(x.page) || 0 }); });
  (e.quotes || []).forEach((x) => { if (x && x.at) ev.push({ k: 'qt', d: d10(x.at), at: String(x.at).length > 10 ? x.at : null, x }); });
  (e.notes || []).forEach((x) => { if (x && x.at) ev.push({ k: 'nt', d: d10(x.at), at: String(x.at).length > 10 ? x.at : null, x }); });
  if (e.startedAt) ev.push({ k: 'start', d: d10(e.startedAt), at: e.startedTs && d10(e.startedTs) === d10(e.startedAt) ? e.startedTs : null });
  if (e.dueSince && e.dueAt) ev.push({ k: 'due', d: d10(e.dueSince), at: e.dueSetAt && d10(e.dueSetAt) === d10(e.dueSince) ? e.dueSetAt : null });
  if (e.status === 'LIDO' && e.finishedAt) ev.push({ k: 'fin', d: d10(e.finishedAt), at: null });
  // ordem dentro do dia: sem hora, o início fica no começo e o resto no fim; a conclusão é sempre a última
  const key = (c) => c.d + 'T' + (c.k === 'fin' ? '99' : c.at ? new Date(c.at).toISOString().slice(11, 19) : c.k === 'start' ? '00:00:00' : c.k === 'due' ? '00:00:01' : '23:59:59');
  ev.sort((a, b) => key(a).localeCompare(key(b)));
  // leitura: página em que parou e se bateu a meta do dia (somando o que já tinha lido no dia)
  // página de cada registro: soma, na ordem, o que foi lido; a última bate com a página atual do livro
  const now = (() => { try { return readingInfo(e).now || 0; } catch { return 0; } })(), sum = ev.reduce((a, c) => a + (c.k === 'rl' ? c.pages : 0), 0);
  let cum = Math.max(0, now - sum);
  const acc = new Map(); ev.forEach((c) => { if (c.k !== 'rl') return; cum += c.pages; c.page = Math.max(0, cum); const dy = days.get(c.d) || {}; const a = (acc.get(c.d) || 0) + c.pages; acc.set(c.d, a); c.ok = !!(dy.per && a >= dy.per); c.hit = c.ok && a - c.pages < dy.per; });
  return ev.reverse();
}
function tlHTML2(e, all) {
  const ev = csEvents(e);
  if (!ev.length) return '<div class="tl"><p class="tl-empty">Cada vez que você atualizar a leitura, uma estrela nova aparece aqui, com a data, a hora e a página.</p></div>';
  const names = (fe) => (fe || []).map((k) => (QT_FEELS.find((y) => y[0] === k) || [, k])[1]);
  const card = (ic, tt, when, body, ref) => '<div class="tl-c"' + (ref ? ' data-ref="' + ref + '"' : '') + '><span class="tl-ic">' + ic + '</span><div><div class="tl-ct">' + tt + '<span class="cs-w">· ' + when + '</span>' + (ref ? '<button type="button" class="tl-edit">Editar</button>' : '') + '</div>' + (body || '') + '</div></div>';
  const pg = (p) => (p ? '<div class="cs-pg">pág. ' + p + '</div>' : '');
  const show = all ? ev : ev.slice(0, 25);
  const html = show.map((c, i) => {
    const w = csWhen(c.d, c.at), x = CS_X[i % CS_X.length];
    let star = '<span class="cs-s">✦</span>', body = '';
    if (c.k === 'rl') { star = '<span class="cs-s big' + (c.ok ? ' ok' : '') + '">★</span>'; body = card('📖', 'Leitura atualizada', w, '<div class="cs-pg">' + (c.page ? 'pág. ' + c.page : 'leitura registrada') + (c.pages ? '<i>' + (c.pages > 0 ? '+' : '') + c.pages + ' pág.</i>' : '') + (c.hit ? '<em>bateu a meta do dia</em>' : '') + '</div>', 'rl:' + c.ix); }
    else if (c.k === 'nt') body = card('🔒', 'Nova anotação', w, pg(c.x.p) + '<p>' + esc(c.x.t) + '</p>', 'nt:' + (e.notes || []).indexOf(c.x));
    else if (c.k === 'qt') body = card('❝', 'Novo trecho', w, pg(c.x.p) + '<p class="tl-q">' + esc(c.x.t) + '</p>', 'qt:' + (e.quotes || []).indexOf(c.x));
    else if (c.k === 'dy') body = card(c.x.text ? '💬' : '✨', c.x.text ? 'Novo comentário' : 'Emoções', w, pg(c.page) + (c.x.text ? '<p>' + esc(c.x.text) + '</p>' : '') + (c.x.fe && c.x.fe.length ? '<div class="tl-fe">' + names(c.x.fe).map((n) => '<span>' + esc(n) + '</span>').join('') + '</div>' : ''), 'dy:' + (e.diary || []).indexOf(c.x));
    else if (c.k === 'start') { star = '<span class="cs-s big ev">✦</span>'; const d = c.d; body = card('🚀', 'Começou a ler', 'em ' + d.slice(8, 10) + '/' + d.slice(5, 7) + '/' + d.slice(0, 4) + (c.at ? ' às ' + tlHM(c.at) : ''), ''); }
    else if (c.k === 'fin') { star = '<span class="cs-s big ok">★</span>'; let D = null; try { D = retroData(e); } catch {}
      body = '<div class="tl-c cs-fin"><span class="tl-ic">🏁</span><div><div class="tl-ct">Leitura concluída<span class="cs-w">· ' + w + '</span></div>'
        + (D ? '<div class="cs-mini"><span>' + RT_DIA(D.days) + '</span>' + (D.pages ? '<span>' + D.pages + ' pág.</span>' : '') + (D.paws ? '<span>nota ' + String(D.paws).replace('.', ',') + '</span>' : '') + '</div>' : '')
        + '<button type="button" class="cs-retro" data-id="' + esc(e.id) + '">✦ Ver sua retrospectiva</button></div></div>'; }
    else if (c.k === 'due') { star = '<span class="cs-s ev">✦</span>'; body = card('⏳', 'Prazo definido', w, '<div class="cs-pg">ler até ' + esc(tlDay(e.dueAt).replace(/^Hoje$/, 'hoje')) + '</div>'); }
    return '<div class="cs-n" style="--x:' + x + 'px">' + star + body + '</div>';
  }).join('');
  const dayList = tlEvents(e), hit = dayList.filter((x) => x.ok).length, dueN = dayList.filter((x) => x.inDue && !x.off && x.per && x.d <= todayISO()).length;
  return '<div class="tl">' + (e.dueAt ? '<div class="tl-sum"><span>⏳ Prazo: <b>' + esc(tlDay(e.dueAt).replace(/^Hoje$/, 'hoje')) + '</b></span><span>★ meta batida em <b>' + hit + ' de ' + Math.max(dueN, hit) + '</b> ' + (Math.max(dueN, hit) === 1 ? 'dia' : 'dias') + '</span></div>' : '')
    + '<div class="cs-flow"><span class="cs-sky"></span><svg class="cs-lines"></svg>' + html + '</div>'
    + (!all && ev.length > show.length ? '<button type="button" class="tl-more">Ver tudo (' + ev.length + ')</button>' : '') + '</div>';
}
// linhas da constelação: ligam o centro de cada estrela ao da seguinte; refeitas quando o tamanho muda (editar um cartão, girar a tela)
function csLines(tl) {
  const f = tl && tl.querySelector('.cs-flow'), svg = f && f.querySelector('.cs-lines'); if (!svg) return;
  const fr = f.getBoundingClientRect(), pts = [...f.querySelectorAll('.cs-s')].map((s) => { const r = s.getBoundingClientRect(); return [r.left - fr.left + r.width / 2, r.top - fr.top + r.height / 2]; });
  svg.setAttribute('width', fr.width); svg.setAttribute('height', fr.height);
  svg.innerHTML = pts.length > 1 ? '<polyline points="' + pts.map((p) => p.map((n) => n.toFixed(1)).join(',')).join(' ') + '" fill="none" stroke="#b69cff" stroke-opacity=".55" stroke-width="1.4" stroke-linejoin="round"/>' : '';
}
{ const ed = $('#editor'); let ro = null;
  new MutationObserver(() => { const tl = ed.querySelector('.ed-body > .tl'); if (!tl || tl._cs) return; tl._cs = 1; requestAnimationFrame(() => csLines(tl));
    try { ro && ro.disconnect(); ro = new ResizeObserver(() => csLines(tl)); ro.observe(tl); } catch {} }).observe(ed, { childList: true, subtree: true }); }
// editar "Leitura atualizada" (Bia, 18/11): data e páginas lidas, ou apagar. A página atual do livro acompanha a correção
// (soma ou tira a diferença), então os registros seguintes continuam batendo.
{ const _te = tlEditClick; tlEditClick = function (ev, e, redraw) {
  const b = ev.target.closest && ev.target.closest('.tl-edit, .tl-eb button'), c = b && b.closest('.tl-c');
  if (!c || !String(c.dataset.ref || '').startsWith('rl:')) return _te.apply(this, arguments);
  const ix = Number(c.dataset.ref.split(':')[1]), L = e.readLog || [], x = L[ix]; if (!x) return;
  const fix = (diff) => { if (e.link) return; const tot = Number(e.totalPages) || Infinity; e.currentPage = Math.max(0, Math.min(tot, (Number(e.currentPage) || 0) + diff));
    // o "pág. X de Y" do topo do diário acompanha
    const ed = $('#editor'); if (ed) { const w = document.createTreeWalker(ed, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (/pág\. \d+ de \d+/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/pág\. \d+ de/, 'pág. ' + e.currentPage + ' de'); } };
  if (b.classList.contains('tl-edit')) {
    c.querySelector(':scope > div').innerHTML = '<div class="tl-ct">Editar leitura</div><div class="tl-ed">'
      + '<label>Dia <input type="date" data-k="d" style="width:9.5rem" max="' + todayISO() + '" value="' + esc(String(x.date).slice(0, 10)) + '"></label>'
      + '<label>Páginas lidas <input type="number" data-k="p" inputmode="numeric" value="' + (Number(x.pages) || 0) + '"></label>'
      + '<div class="tl-eb"><button type="button" class="rm" data-a="rm">Apagar</button><button type="button" data-a="cx">Cancelar</button><button type="button" class="sv" data-a="sv">Salvar</button></div></div>';
    return;
  }
  const a = b.dataset.a;
  if (a === 'cx') return redraw();
  if (a === 'rm') { if (!b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Toque de novo para apagar'; setTimeout(() => { if (b.isConnected) { delete b.dataset.ok; b.textContent = 'Apagar'; } }, 4000); return; }
    L.splice(ix, 1); fix(-(Number(x.pages) || 0)); save(); toast('Leitura apagada'); return redraw(); }
  if (a === 'sv') {
    const d = (c.querySelector('[data-k=d]') || {}).value, p = Math.round(Number((c.querySelector('[data-k=p]') || {}).value));
    if (!d || d > todayISO()) return toast('Escolha um dia até hoje'); if (!Number.isFinite(p) || p === 0) return toast('Digite as páginas lidas ou toque em Apagar');
    const diff = p - (Number(x.pages) || 0); x.pages = p; delete x.page; if (String(x.date).slice(0, 10) !== d) { x.date = d; delete x.at; }
    fix(diff); save(); toast('Leitura corrigida'); return redraw();
  }
}; }
