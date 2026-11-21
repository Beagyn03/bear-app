// Histórico no Diário de leitura (Bia, 17/11): embaixo das ações, uma linha do tempo do livro, do mais novo para o mais antigo.
// Cada dia é uma estrela da constelação: dourada quando bateu a meta, lilás quando leu (mais forte quanto mais perto da meta), vazada na folga
// e o que aconteceu: páginas lidas, emoções, comentários, trechos, início da leitura e prazo definido.
{ const st = document.createElement('style'); st.textContent = `
#editor .tl{margin:.2rem 0 .4rem}
#editor .ed-body:not(.tl-on) > .tl{display:none!important}
#editor .ed-body.tl-on:has(> .tl) > :not(.ss-title):not(.up-x):not(.ss-hd):not(.tl-tabs):not(.tl){display:none!important}
#editor .tl-tabs{display:flex;border-bottom:1.5px solid var(--line);margin:.2rem 0 .75rem}
#editor .tl-tabs button{flex:1;border:0!important;background:none!important;box-shadow:none!important;font:inherit;font-size:.86rem;font-weight:800;color:var(--ink-2)!important;padding:.5rem 0!important;margin-bottom:-1.5px;border-bottom:2.5px solid transparent!important;border-radius:0!important;min-height:0!important;height:auto!important}
#editor .tl-tabs button.on{color:var(--acc)!important;border-bottom-color:var(--acc)!important}
#editor .tl-flow{position:relative}#editor .tl-flow::before{content:"";position:absolute;left:14px;top:.6rem;bottom:1.2rem;border-left:2px dashed color-mix(in srgb,var(--acc) 40%,var(--line));z-index:0}#editor .tl-flow .tl-d::before{display:none!important}#editor .tl-flow .tl-st{position:relative;z-index:1;width:30px;height:30px;border-radius:50%;background:var(--panel,#fffaf3)}#editor .tl-flow .tl-day{margin-left:2.6rem;position:relative}#editor .tl-flow .tl-day::before{content:"";position:absolute;left:calc(-2.6rem + 9px);top:50%;width:12px;height:12px;margin-top:-6px;border-radius:50%;background:var(--panel,#fffaf3);border:2px solid color-mix(in srgb,var(--acc) 55%,var(--line));box-sizing:border-box}
#editor .tl-eh .tl-evt{color:var(--ink-2)!important;font-weight:800;font-size:.8rem}
#editor .tl-sum{display:flex;flex-wrap:wrap;gap:.3rem .9rem;align-items:center;padding:.55rem .75rem;margin:0 0 .4rem;border-radius:12px;background:color-mix(in srgb,var(--acc) 9%,transparent);font-size:.78rem;font-weight:700;color:var(--ink-2)}#editor .tl-sum b{color:var(--ink);font-weight:900}#editor .tl-h small{font-size:.7rem;color:var(--ink-2);font-weight:700}
#editor .tl-d{display:grid;grid-template-columns:30px minmax(0,1fr);gap:.65rem;position:relative;padding-bottom:.85rem}
#editor .tl-d::before{content:"";position:absolute;left:14px;top:30px;bottom:-2px;width:0;border-left:2px dashed color-mix(in srgb,var(--acc) 35%,var(--line))}
#editor .tl-d.ok-ok::before{border-left:2px solid #f2c94c}
#editor .tl-st{display:block;width:30px;text-align:center;font-size:24px;line-height:28px;color:color-mix(in srgb,var(--ink) 22%,transparent)}
#editor .tl-st.ok{color:#f2c94c;text-shadow:0 0 8px rgba(242,201,76,.8),0 0 2px rgba(242,201,76,.9)}
#editor .tl-st.mid{color:#b69cff}
#editor .tl-st.off{font-size:20px}
#editor .tl-st.ev{font-size:14px}
#editor .tl-d:last-child::before{display:none}
#editor .tl-rib{position:relative;display:block;width:24px;height:46px;margin:2px auto 0;background:color-mix(in srgb,var(--ink) 12%,transparent);clip-path:polygon(0 0,100% 0,100% 100%,50% 80%,0 100%);overflow:hidden}
#editor .tl-rib i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(var(--acc),color-mix(in srgb,var(--acc) 70%,#000))}
#editor .tl-rib.ok i{background:linear-gradient(#ffe08a,#e2a92c)}
#editor .tl-rib.off{background:none;outline:1.5px dashed var(--line);outline-offset:-2px;clip-path:none;border-radius:3px}
#editor .tl-rib.dot{width:12px;height:12px;border-radius:50%;clip-path:none;margin-top:6px;background:var(--acc)}
#editor .tl-rib u{position:absolute;left:0;right:0;top:4px;text-align:center;text-decoration:none;font-size:.72rem;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4)}
#editor .tl-t{font-size:.78rem;font-weight:900;color:var(--ink)}#editor .tl-t small{font-weight:700;color:var(--ink-2);margin-left:.3rem}
#editor .tl-pg{font-size:.76rem;font-weight:800;color:var(--acc);margin-top:.1rem}#editor .tl-pg.ok{color:#c08a12}
#editor .tl-it{margin-top:.35rem;font-size:.82rem;line-height:1.4;color:var(--ink)}
#editor .tl-it small{display:block;font-size:.66rem;font-weight:800;color:var(--ink-2);text-transform:uppercase;letter-spacing:.04em}
#editor .tl-it p{margin:.1rem 0 0;white-space:pre-line}#editor .tl-it q{font-style:italic}
#editor .tl-fe{display:flex;gap:.25rem;flex-wrap:wrap;margin-top:.15rem}#editor .tl-fe span{font-size:.68rem;font-weight:800;padding:.1rem .45rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 14%,transparent);color:var(--acc)}
#editor .tl-ev{font-size:.76rem;font-weight:700;color:var(--ink-2);margin-top:.3rem}
#editor .tl-c{display:grid;grid-template-columns:22px minmax(0,1fr);gap:.45rem;align-items:start;margin-top:.4rem;padding:.5rem .65rem;border-radius:12px;background:color-mix(in srgb,var(--ink) 4%,transparent);border:1px solid color-mix(in srgb,var(--ink) 7%,transparent)}
#editor .tl-ic{font-size:.95rem;line-height:1.25rem;text-align:center}
#editor .tl-ct{font-size:.8rem;font-weight:800;color:var(--ink);line-height:1.25rem}#editor .tl-ct span{font-weight:700;color:var(--ink-2);font-size:.72rem;margin-left:.25rem}
#editor .tl-c p{margin:.15rem 0 0;font-size:.84rem;line-height:1.4;white-space:pre-line;color:var(--ink)}#editor .tl-c p.tl-q{font-style:italic}#editor .tl-c p.tl-q::before{content:'“'}#editor .tl-c p.tl-q::after{content:'”'}
#editor .tl-cs{font-size:.72rem;font-weight:800;color:var(--ink-2);margin-top:.1rem}#editor .tl-cs.ok{color:#c08a12}
#editor .tl-c .tl-fe{margin-top:.3rem}
#editor .tl-ct{display:flex;align-items:baseline;gap:.25rem}#editor .tl-edit{margin-left:auto!important;border:0!important;background:none!important;box-shadow:none!important;color:var(--acc)!important;font:inherit!important;font-size:.72rem!important;font-weight:800!important;padding:0!important;min-height:0!important;height:auto!important;cursor:pointer}
#editor .tl-ed textarea{width:100%;box-sizing:border-box;min-height:4rem;border-radius:10px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:.86rem;padding:.45rem .55rem;margin-top:.35rem;resize:vertical}
#editor .tl-ed input{width:5rem;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;padding:.25rem .4rem}
#editor .tl-ed label{display:flex;align-items:center;gap:.4rem;font-size:.74rem;font-weight:700;color:var(--ink-2);margin-top:.35rem}
#editor .tl-eb{display:flex;gap:.4rem;margin-top:.45rem}#editor .tl-eb button{flex:1;border-radius:10px!important;padding:.4rem!important;min-height:0!important;height:auto!important;font:inherit!important;font-size:.78rem!important;font-weight:800!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;box-shadow:none!important}#editor .tl-eb button.sv{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--on-acc,#fff)!important}#editor .tl-eb button.rm{color:#c0392b!important}
#editor .tl-fe.ed span{cursor:pointer;opacity:.45}#editor .tl-fe.ed span.on{opacity:1}
#editor .tl-t{font-size:.82rem;margin-top:.2rem}
#editor .tl-more{width:100%;border:1.5px dashed var(--line);background:none;color:var(--ink-2);font:inherit;font-weight:800;font-size:.78rem;border-radius:12px;padding:.45rem}
#editor .tl-empty{font-size:.78rem;color:var(--ink-2);margin:0}
#editor .tl-day{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2rem .55rem;margin:.9rem 0 .35rem;padding-bottom:.3rem;border-bottom:1px solid var(--line)}#editor .tl-day:first-of-type{margin-top:.1rem}
#editor .tl-day b{font-size:.86rem;color:var(--ink)}#editor .tl-day span{font-size:.72rem;font-weight:700;color:var(--ink-2)}#editor .tl-day em{margin-left:auto;font-style:normal;font-size:.72rem;font-weight:800;color:var(--ink-2)}#editor .tl-day em.ok{color:#c08a12}
#editor .tl-evl{font-size:.74rem;font-weight:700;color:var(--ink-2);margin:.15rem 0 .35rem 2.6rem}
#editor .tl-eh{display:flex;flex-wrap:wrap;align-items:baseline;gap:.15rem .5rem;line-height:28px}#editor .tl-eh b{font-size:.84rem;color:var(--ink)}#editor .tl-eh span{font-size:.8rem;font-weight:800;color:var(--acc)}#editor .tl-eh i{font-style:normal;font-size:.72rem;font-weight:700;color:var(--ink-2)}#editor .tl-eh em{font-style:normal;font-size:.7rem;font-weight:900;color:#c08a12}
#editor .tl-d{padding-bottom:.55rem}#editor .tl-d .tl-c:first-of-type{margin-top:.1rem}
`; TR.append(st); }
// recarregar o navegador com o diário aberto (Bia, 17/11): o app lembra o livro e a aba (Atualizar/Histórico) e reabre
const TL_KEY = 'lv.diarioAberto';
const tlRemember = (e, tab) => { try { sessionStorage.setItem(TL_KEY, JSON.stringify({ id: e.id, tab })); } catch {} };
const TL_BOOT = (() => { try { return JSON.parse(sessionStorage.getItem(TL_KEY) || 'null'); } catch { return null; } })();
const TL_DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const tlDay = (iso) => { const t = todayISO(); if (iso === t) return 'Hoje'; if (iso === new Date(Date.parse(t) - 864e5).toISOString().slice(0, 10)) return 'Ontem'; const d = new Date(iso + 'T12:00:00Z'); return TL_DOW[d.getUTCDay()] + ', ' + iso.slice(8, 10) + '/' + iso.slice(5, 7); };
function tlEvents(e) {
  const info = (() => { try { return readingInfo(e); } catch { return { now: 0, total: 0 }; } })(), now = info.now || 0, total = info.total || Number(e.totalPages) || 0;
  const days = new Map(), day = (d) => { if (!days.has(d)) days.set(d, { d, pages: 0, items: [], ev: [] }); return days.get(d); };
  (e.readLog || []).forEach((l) => { if (l && l.date) day(String(l.date).slice(0, 10)).pages += Number(l.pages) || 0; });
  (e.diary || []).forEach((x) => { if (x && x.d) day(String(x.d).slice(0, 10)).items.push({ k: 'dy', x }); });
  (e.quotes || []).forEach((x) => { if (x && x.at) day(String(x.at).slice(0, 10)).items.push({ k: 'qt', x }); });
  if (e.startedAt) day(String(e.startedAt).slice(0, 10)).ev.push('Começou a ler');
  if (e.dueSince && e.dueAt) day(String(e.dueSince).slice(0, 10)).ev.push('Prazo definido: ' + tlDay(e.dueAt).replace(/^Hoje$/, 'hoje'));
  const list = [...days.values()].sort((a, b) => b.d.localeCompare(a.d));
  // página em que cada dia terminou: volta da página atual descontando o que foi lido nos dias seguintes
  let after = 0; list.forEach((x) => { x.end = Math.max(0, now - after); x.start = Math.max(0, x.end - x.pages); after += x.pages; });
  const maxP = Math.max(1, ...list.map((x) => x.pages)), off = e.dueOff || [];
  // meta dos dias passados: a mesma conta dos marca-páginas do Hoje (feita no dia em que o prazo foi marcado)
  let workAll = 0; if (e.dueAt && e.dueSince) for (let d = String(e.dueSince).slice(0, 10); d <= e.dueAt; d = new Date(Date.parse(d) + 864e5).toISOString().slice(0, 10)) if (!off.includes(new Date(d + 'T12:00:00Z').getUTCDay())) workAll++;
  const base = total && workAll ? Math.ceil(Math.max(0, total - (e.dueStartPage || 0)) / workAll) : 0;
  list.forEach((x) => {
    const w = new Date(x.d + 'T12:00:00Z').getUTCDay();
    x.inDue = !!(e.dueAt && e.dueSince && x.d >= String(e.dueSince).slice(0, 10) && x.d <= e.dueAt);
    if (x.inDue && total) {
      x.off = off.includes(w) && workAll > 0; const hj = x.d === todayISO() ? (() => { try { return dueToday(e); } catch { return null; } })() : null;
      x.per = x.off ? 0 : hj ? hj.per : base;
      x.ok = !x.off && x.per > 0 && x.pages >= x.per; x.fill = x.off ? 0 : x.per ? Math.min(1, x.pages / x.per) : 0;
    } else x.fill = x.pages / maxP;
  });
  return list;
}
// cada vez que a pessoa salva vira um registro: hora, página, o que leu desde o último e o que anotou junto (comentário, trecho, emoções).
// Registros antigos (de antes de o app guardar a hora) ficam juntos num registro só daquele dia.
const tlHM = (at) => { try { const d = new Date(at); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); } catch { return ''; } };
function tlEntries(e) {
  const days = new Map(tlEvents(e).map((x) => [x.d, x])), raw = [];
  (e.readLog || []).forEach((l) => { if (l && l.date) raw.push({ at: l.at || null, d: String(l.date).slice(0, 10), k: 'rl', pages: Number(l.pages) || 0, page: Number(l.page) || 0 }); });
  (e.diary || []).forEach((x) => { if (x && x.d) raw.push({ at: x.at || null, d: String(x.d).slice(0, 10), k: 'dy', x, page: Number(x.page) || 0 }); });
  (e.quotes || []).forEach((x) => { if (x && x.at) raw.push({ at: x.at, d: String(x.at).slice(0, 10), k: 'qt', x, page: Number(x.p) || 0 }); });
  (e.notes || []).forEach((x) => { if (x && x.at) raw.push({ at: String(x.at).length > 10 ? x.at : null, d: String(x.at).slice(0, 10), k: 'nt', x, page: Number(x.p) || 0 }); });
  const out = [], legacy = new Map();
  raw.filter((r) => !r.at).forEach((r) => { if (!legacy.has(r.d)) legacy.set(r.d, { d: r.d, at: null, rs: [] }); legacy.get(r.d).rs.push(r); });
  raw.filter((r) => r.at).sort((a, b) => String(a.at).localeCompare(String(b.at))).forEach((r) => {
    const c = out[out.length - 1];
    if (c && c.d === r.d && Math.abs(Date.parse(r.at) - Date.parse(c.last)) <= 120000) { c.rs.push(r); c.last = r.at; } else out.push({ d: r.d, at: r.at, last: r.at, rs: [r] });
  });
  const all = [...legacy.values(), ...out];
  all.forEach((c) => { c.pages = c.rs.filter((r) => r.k === 'rl').reduce((a, r) => a + r.pages, 0); c.page = Math.max(0, ...c.rs.map((r) => r.page)); const dy = days.get(c.d); if (!c.at && !c.page && dy) c.page = dy.end; c.day = dy; });
  // estrela de cada registro: dourada quando, somando o que já tinha lido no dia, chegou na meta do dia
  const byDay = new Map(); all.forEach((c) => { if (!byDay.has(c.d)) byDay.set(c.d, []); byDay.get(c.d).push(c); });
  byDay.forEach((cs) => { cs.sort((a, b) => String(a.at || '').localeCompare(String(b.at || ''))); let acc = 0; cs.forEach((c) => { acc += c.pages; const dy = c.day; c.ok = !!(dy && dy.per && acc >= dy.per); c.hit = c.ok && acc - c.pages < dy.per; c.fill = dy && dy.per ? Math.min(1, acc / dy.per) : (c.pages ? 0.7 : 0); }); });
  // início da leitura e prazo viram registros próprios (Bia, 18/11): com a hora quando o app guardou; sem hora, ficam no começo do dia
  const day10 = (x) => String(x || '').slice(0, 10);
  if (e.startedAt) all.push({ d: day10(e.startedAt), at: e.startedTs && day10(e.startedTs) === day10(e.startedAt) ? e.startedTs : null, ev: 'start', rs: [], pages: 0 });
  if (e.dueSince && e.dueAt) all.push({ d: day10(e.dueSince), at: e.dueSetAt && day10(e.dueSetAt) === day10(e.dueSince) ? e.dueSetAt : null, ev: 'due', rs: [], pages: 0 });
  const sk = (c) => c.d + (c.at || (c.ev === 'start' ? '' : c.ev === 'due' ? ' ' : '  '));
  return all.sort((a, b) => sk(b).localeCompare(sk(a)));
}
function tlHTML(e, all) {
  const ents = tlEntries(e), dayList = tlEvents(e);
  if (!ents.length && !dayList.length) return '<div class="tl"><p class="tl-empty">Cada vez que você atualizar a leitura, o registro aparece aqui, com a hora e a página.</p></div>';
  const names = (fe) => (fe || []).map((k) => (QT_FEELS.find((y) => y[0] === k) || [, k])[1]);
  const card = (ic, tt, body, ref) => '<div class="tl-c"' + (ref ? ' data-ref="' + ref + '"' : '') + '><span class="tl-ic">' + ic + '</span><div><div class="tl-ct">' + tt + (ref ? '<button type="button" class="tl-edit">Editar</button>' : '') + '</div>' + (body || '') + '</div></div>';
  const dayInfo = new Map(dayList.map((x) => [x.d, x]));
  const days = [...new Set([...ents.map((c) => c.d), ...dayList.map((x) => x.d)])].sort((a, b) => b.localeCompare(a));
  const showDays = all ? days : days.slice(0, 10);
  let html = '';
  showDays.forEach((d) => {
    const dy = dayInfo.get(d) || {}, cs = ents.filter((c) => c.d === d);
    const meta = dy.inDue && dy.off ? 'dia de folga' : dy.inDue && dy.per ? (dy.ok ? '★ meta do dia batida' : 'meta do dia: ' + dy.per + ' pág.') : '';
    html += '<div class="tl-day"><b>' + tlDay(d) + '</b>' + (dy.pages ? '<span>' + dy.pages + ' pág. no dia</span>' : '') + (meta ? '<em class="' + (dy.ok ? 'ok' : '') + '">' + meta + '</em>' : '') + '</div>';
    cs.forEach((c) => {
      if (c.ev) { html += '<div class="tl-d tl-evd"><span class="tl-st ev">✦</span><div><div class="tl-eh">' + (c.at ? '<b>' + tlHM(c.at) + '</b>' : '') + '<span class="tl-evt">' + (c.ev === 'start' ? '<i class=v3e data-i=play></i>Começou a ler' : '<i class=v3e data-i=cal></i>Prazo definido: ' + esc(tlDay(e.dueAt).replace(/^Hoje$/, 'hoje'))) + '</span></div></div></div>'; return; }
      const st = c.ok ? '<span class="tl-st ok">★</span>' : c.pages ? '<span class="tl-st mid" style="opacity:' + (0.45 + 0.55 * c.fill).toFixed(2) + '">★</span>' : '<span class="tl-st ev">✦</span>';
      const head = '<div class="tl-eh"><b>' + (c.at ? tlHM(c.at) : 'Neste dia') + '</b>' + (c.page ? '<span>pág. ' + c.page + '</span>' : '') + (c.pages ? '<i>+' + c.pages + ' pág.</i>' : '') + (c.hit ? '<em>bateu a meta</em>' : '') + '</div>';
      const its = c.rs.filter((r) => r.k !== 'rl').map((r) => r.k === 'nt' ? card('<i class=v3e data-i=lock></i>', 'Anotação' + (r.x.p ? ' <span>pág. ' + r.x.p + '</span>' : ''), '<p>' + esc(r.x.t) + '</p>', 'nt:' + (e.notes || []).indexOf(r.x)) : r.k === 'qt' ? card('❝', 'Trecho' + (r.x.p ? ' <span>pág. ' + r.x.p + '</span>' : ''), '<p class="tl-q">' + esc(r.x.t) + '</p>', 'qt:' + (e.quotes || []).indexOf(r.x))
        : card(r.x.text ? '<i class=v3e data-i=reply></i>' : '<i class=v3e data-i=heart></i>', r.x.text ? 'Comentário' : 'Emoções', (r.x.text ? '<p>' + esc(r.x.text) + '</p>' : '') + (r.x.fe && r.x.fe.length ? '<div class="tl-fe">' + names(r.x.fe).map((n) => '<span>' + esc(n) + '</span>').join('') + '</div>' : ''), 'dy:' + (e.diary || []).indexOf(r.x))).join('');
      html += '<div class="tl-d' + (c.ok ? ' ok-ok' : '') + '">' + st + '<div>' + head + its + '</div></div>';
    });
  });
  const hit = dayList.filter((x) => x.ok).length, dueN = dayList.filter((x) => x.inDue && !x.off && x.per && x.d <= todayISO()).length;
  return '<div class="tl">' + (e.dueAt ? '<div class="tl-sum"><span><i class=v3e data-i=cal></i>Prazo: <b>' + esc(tlDay(e.dueAt).replace(/^Hoje$/, 'hoje')) + '</b></span><span>★ meta batida em <b>' + hit + ' de ' + Math.max(dueN, hit) + '</b> ' + (Math.max(dueN, hit) === 1 ? 'dia' : 'dias') + '</span></div>' : '') + '<div class="tl-flow">' + html + '</div>'
    + (!all && days.length > showDays.length ? '<button type="button" class="tl-more">Ver tudo (' + days.length + ' dias)</button>' : '') + '</div>';
}
// ao salvar a leitura: guarda a hora e a página nos registros novos de hoje (páginas lidas e comentário/emoções)
{ const ed = $('#editor');
  ed.addEventListener('click', (ev) => {
    const t = ev.target.closest && ev.target.closest('#up-save, #up-fin'); if (!t || t.disabled) return;
    const e = S.tlE; if (!e) return; const at = new Date().toISOString(), today = todayISO();
    setTimeout(() => { try {
      const now = (readingInfo(e) || {}).now || 0; let ch = false;
      (e.readLog || []).forEach((l) => { if (l && !l.at && String(l.date).slice(0, 10) === today) { l.at = at; l.page = now; ch = true; } });
      (e.diary || []).forEach((x) => { if (x && !x.at && String(x.d).slice(0, 10) === today) { x.at = at; ch = true; } });
      if (ch) save();
    } catch {} }, 150);
  }, true);
}
// abas também na tela de status (Lido, Pausado, Quero ler, Abandonei), ao trocar o status dentro do diário ou ao abrir direto (Bia, 18/11)
{ const _ss = statusSheet; statusSheet = function (e, want) { if (e && !(want === 'LENDO' && e.status === 'LENDO')) { if (!S.tlE || S.tlE.id !== e.id) { S.tlAll = false; S.tlTab = 'up'; } S.tlE = e; } const r = _ss.apply(this, arguments); try { TL_PAINT(); } catch {} return r; }; }
{ const _el = editLeitura; editLeitura = function () { try { const R = reading(); S.tlE = R && R.e; S.tlAll = false; S.tlTab = S.tlTabNext || 'up'; S.tlTabNext = null; } catch {} return _el.apply(this, arguments); }; }
let TL_PAINT = () => {};
{ const ed = $('#editor'); let tm = 0;
  const paint = TL_PAINT = () => {
    const body = ed.querySelector('.ed-body'); if (ed.hidden || !body || !(body.querySelector('#up-save') || body.querySelector('.ss-chips')) || body.querySelector('.tl')) return;
    const e = S.tlE; if (!e) return;
    body.querySelectorAll('.tl-tabs').forEach((x) => x.remove());
    const tabs = document.createElement('div'); tabs.className = 'tl-tabs'; tabs.innerHTML = '<button type="button" data-t="up">Atualizar página</button><button type="button" data-t="hist">Histórico</button>';
    const set = (k) => { S.tlTab = k; tlRemember(e, k); body.classList.toggle('tl-on', k === 'hist'); tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.t === k)); };
    tabs.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => set(b.dataset.t)));
    const hd = body.querySelector('.ss-hd'); if (hd) hd.after(tabs); else body.prepend(tabs); set(S.tlTab || 'up');
    const t = document.createElement('div'); t.innerHTML = tlHTML2(e, S.tlAll); const tl = t.firstElementChild; body.append(tl);
    const more = tl.querySelector('.tl-more'); if (more) more.addEventListener('click', () => { S.tlAll = true; tl.remove(); paint(); });
    tl.addEventListener('click', (ev) => tlEditClick(ev, e, () => { tl.remove(); paint(); }));
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 40); }).observe(ed, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}

// editar um registro do histórico (Bia, 17/11): comentário (texto e emoções), trecho (frase e página) ou apagar.
// Só muda o diário do livro; um comentário que já foi para a Rede continua lá como foi postado.
function tlEditClick(ev, e, redraw) {
  const b = ev.target.closest && ev.target.closest('.tl-edit, .tl-eb button, .tl-fe.ed span'); if (!b) return;
  const c = b.closest('.tl-c'); if (!c || !c.dataset.ref) return; const [k, ix] = c.dataset.ref.split(':'), arr = k === 'qt' ? (e.quotes || []) : k === 'nt' ? (e.notes || []) : (e.diary || []), x = arr[Number(ix)]; if (!x) return;
  if (b.classList.contains('tl-edit')) {
    const box = c.querySelector(':scope > div'); const N = { fe: [...(x.fe || [])] };
    const feH = () => '<div class="tl-fe ed">' + QT_PICK.map(([kk, n]) => '<span data-f="' + kk + '" class="' + (N.fe.includes(kk) ? 'on' : '') + '">' + esc(n) + '</span>').join('') + '</div>';
    box.innerHTML = '<div class="tl-ct">' + (k === 'qt' ? 'Editar trecho' : k === 'nt' ? 'Editar anotação' : 'Editar comentário') + '</div><div class="tl-ed"><textarea maxlength="' + (k === 'qt' ? 600 : k === 'nt' ? 2000 : 280) + '">' + esc(k === 'qt' || k === 'nt' ? x.t || '' : x.text || '') + '</textarea>'
      + (k === 'qt' || k === 'nt' ? '<label>Página <input type="number" min="1" inputmode="numeric" value="' + (x.p || '') + '"></label>' : feH())
      + '<div class="tl-eb"><button type="button" class="rm" data-a="rm">Apagar</button><button type="button" data-a="cx">Cancelar</button><button type="button" class="sv" data-a="sv">Salvar</button></div></div>';
    c._N = N; return;
  }
  if (b.matches('.tl-fe.ed span')) { const N = c._N, kk = b.dataset.f; if (N.fe.includes(kk)) N.fe = N.fe.filter((y) => y !== kk); else if (N.fe.length < 3) N.fe.push(kk); else return toast('Até 3 emoções'); b.classList.toggle('on', N.fe.includes(kk)); return; }
  const a = b.dataset.a;
  if (a === 'cx') return redraw();
  if (a === 'rm') { if (!b.dataset.ok) { b.dataset.ok = '1'; b.textContent = 'Toque de novo para apagar'; setTimeout(() => { if (b.isConnected) { delete b.dataset.ok; b.textContent = 'Apagar'; } }, 4000); return; } arr.splice(Number(ix), 1); if (k === 'nt') { const L = e.notes || []; if (L.length) e.note = L[L.length - 1].t; else delete e.note; } save(); toast('Apagado'); return redraw(); }
  if (a === 'sv') { const t = (c.querySelector('textarea') || {}).value || '';
    if (k === 'qt' || k === 'nt') { if (!t.trim()) return toast(k === 'nt' ? 'Escreva a anotação ou toque em Apagar' : 'Escreva o trecho ou toque em Apagar'); x.t = t.trim(); const p = Number((c.querySelector('.tl-ed input') || {}).value) || 0; if (p > 0) x.p = Math.round(p); else delete x.p; }
    else { const N = c._N || { fe: x.fe || [] }; if (!t.trim() && !N.fe.length) return toast('Escreva algo, escolha uma emoção ou toque em Apagar'); x.text = t.trim(); x.fe = N.fe; }
    if (k === 'nt') { const L = e.notes || []; if (L.length) e.note = L[L.length - 1].t; } save(); toast('Salvo'); return redraw(); }
}

{ const ed = $('#editor'); let tm = 0, booting = !!TL_BOOT;
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { if (!booting && (ed.hidden || !ed.querySelector('#up-save'))) { try { sessionStorage.removeItem(TL_KEY); } catch {} } }, 600); }).observe(ed, { attributes: true, attributeFilter: ['hidden'], childList: true });
  if (TL_BOOT) setTimeout(() => { try { const e = byId(TL_BOOT.id); if (e && e.status === 'LENDO' && $('#editor').hidden) { S.tlTabNext = TL_BOOT.tab; ssOpenUpdate(e); } } catch {} setTimeout(() => { booting = false; }, 800); }, 1800);
}
// guarda a hora em que o livro entrou em Lendo (para o "Começou a ler" do histórico)
{ const _sl = setLibStatus; setLibStatus = function (e, st) { const was = e && e.status; const r = _sl.apply(this, arguments); try { if (e && st === 'LENDO' && was !== 'LENDO' && e.status === 'LENDO') { e.startedTs = new Date().toISOString(); save(); } } catch {} return r; }; }
{ const _al = addToLibrary; addToLibrary = function () { const before = new Set(lib().map((x) => x.id)); const r = _al.apply(this, arguments);
    setTimeout(() => { try { let ch = false; lib().forEach((x) => { if (!before.has(x.id) && x.status === 'LENDO' && !x.startedTs) { x.startedTs = new Date().toISOString(); ch = true; } }); if (ch) save(); } catch {} }, 400); return r; }; }
