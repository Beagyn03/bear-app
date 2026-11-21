// Prazo para terminar a leitura atual (Bia, 16/11): "quero terminar até sábado" → o app calcula quantas páginas por dia faltam,
// mostra no cartão "Lendo agora" do Hoje e lista o plano dia a dia. Guardado no livro (e.dueAt = AAAA-MM-DD).
{ const st = document.createElement('style'); st.textContent = `
.due-ln{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:.45rem;font-size:.8rem;font-weight:800;color:var(--ink-2);width:100%}
.due-ln b{color:var(--acc)}.due-ln button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.78rem;padding:0;flex:none}
.due-ln.late b{color:#c0392b}

`; TR.append(st); }
{ const st2 = document.createElement('style'); st2.textContent = `.dp-sum{display:grid;justify-items:center;text-align:center;margin:.2rem 0 .5rem}.dp-sum b{font-size:2rem;font-weight:900;color:var(--acc);line-height:1}.dp-sum small{color:var(--ink-2);font-size:.8rem;font-weight:700}
.dp-days{display:flex;gap:.3rem;overflow-x:auto;padding-bottom:.3rem;scrollbar-width:none}
.dp-d{flex:1 0 44px;display:grid;justify-items:center;gap:.15rem;border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:12px;padding:.35rem .2rem;font:inherit}
.dp-d small{font-size:.65rem;font-weight:800;color:var(--ink-2);text-transform:uppercase}.dp-d i{display:flex;align-items:flex-end;width:14px;height:46px;border-radius:7px;background:var(--line);overflow:hidden}.dp-d u{display:block;width:100%;background:var(--acc);border-radius:7px}
.dp-d b{font-size:.8rem;font-weight:900}.dp-d em{font-style:normal;font-size:.62rem;color:var(--ink-2)}
.dp-d.off{opacity:.55;border-style:dashed}.dp-d.off b{font-size:.68rem;color:var(--ink-2)}.dp-d.hoje{border-color:var(--acc)}
.due-sh .box{overflow-x:hidden}.due-sh form{min-width:0;max-width:100%}.due-sh form > *{min-width:0;max-width:100%}.due-sh .dp{min-width:0;max-width:100%;overflow:hidden}.due-sh .dp-days{max-width:100%}.due-sh .hint{overflow-wrap:anywhere}
.dp-d em{white-space:nowrap}
.dk-rib{position:relative;display:block;width:22px;height:46px;background:color-mix(in srgb,var(--ink) 12%,transparent);clip-path:polygon(0 0,100% 0,100% 100%,50% 80%,0 100%);overflow:hidden}
.dk-rib i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(var(--acc),color-mix(in srgb,var(--acc) 70%,#000));transition:height .4s ease}
.dk-rib.ok i{background:linear-gradient(#ffe08a,#e2a92c)}.dk-rib.off{background:none;outline:1.5px dashed var(--line);outline-offset:-2px;clip-path:none;border-radius:3px}
.dk-rib u{position:absolute;left:0;right:0;top:4px;text-align:center;text-decoration:none;font-size:.7rem;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4)}.dk-rib u.fim{color:var(--acc);text-shadow:none}
.dk-row{display:flex;gap:.35rem;overflow-x:auto;padding:.1rem 0 .35rem;scrollbar-width:none;max-width:100%}.dk-row::-webkit-scrollbar{display:none}
html .dk{flex:0 0 62px;display:grid;justify-items:center;gap:.12rem;border:1px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;border-radius:12px!important;padding:.35rem .2rem!important;font:inherit;height:auto!important;min-height:0!important;box-shadow:none!important;cursor:pointer}
.dk small{font-size:.62rem;font-weight:900;text-transform:uppercase;color:var(--ink-2)}.dk em{font-style:normal;font-size:.62rem;font-weight:700;color:var(--ink-2)}
.dk-c{position:relative;width:38px;height:56px;border-radius:5px;overflow:hidden;display:block}.dk-c > .dk-cv{position:absolute;inset:0}
.dk-c .dk-cv{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;width:100%!important;height:100%!important;margin:0!important;border-radius:0!important;box-shadow:none!important;font-size:.36rem!important}.dk-c .dk-cv img{width:100%;height:100%;object-fit:cover}
.dk-c > .dk-gray{position:absolute;left:0;right:0;top:0;bottom:auto;z-index:1;-webkit-backdrop-filter:grayscale(1) brightness(.95);backdrop-filter:grayscale(1) brightness(.95);background:rgba(128,128,128,.18);transition:height .4s ease}
.dk-c u{position:absolute;top:1px;right:2px;z-index:2;text-decoration:none;font-size:.7rem;color:#f5b84a;text-shadow:0 1px 2px rgba(0,0,0,.6)}
.dk b{font-size:.68rem;font-weight:900;white-space:nowrap}.dk i{font-style:normal;font-size:.6rem;font-weight:800;color:var(--acc);white-space:nowrap}
html .dk.hoje{border:2px solid var(--acc)!important}html .dk.off{border-style:dashed!important;background:none!important;opacity:.6}html .dk.ok{border-color:#2f8a52!important}.dk.ok b{color:#2f8a52}
.dc{margin:.2rem 0 .35rem;display:grid;gap:.6rem}.dc-m[hidden]{display:none!important}.dc-mn{display:flex;align-items:center;justify-content:space-between;font-size:.86rem;font-weight:900;color:var(--ink);text-transform:capitalize;margin:0 0 .3rem}
html .dc-nav{display:grid!important;place-items:center!important;width:32px!important;height:32px!important;min-height:0!important;border-radius:50%!important;border:1px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font:inherit!important;font-size:1.1rem!important;font-weight:900!important;padding:0!important;line-height:1!important;cursor:pointer}html .dc-nav:disabled{opacity:.3;cursor:default}
.dc-hs,.dc-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.dc-hs{margin-bottom:3px}
.dc-h{border:0;background:none;color:var(--ink-2);font:inherit;font-size:.66rem;font-weight:800;padding:.2rem 0;border-radius:8px;cursor:pointer}.dc-h.off{opacity:.45;text-decoration:line-through}
.dc-d{position:relative;display:grid;place-items:center;min-width:0;height:48px;border:1px solid transparent;background:color-mix(in srgb,var(--ink) 5%,transparent);color:var(--ink);border-radius:9px;padding:0;font:inherit;cursor:pointer;overflow:hidden}
.dc-d i{position:absolute;top:3px;left:5px;font-style:normal;font-size:.62rem;font-weight:800;color:var(--ink-2)}
.dc-d b{font-size:.78rem;font-weight:900;color:var(--acc);margin-top:8px}.dc-d small{font-size:.6rem;font-weight:800;color:var(--ink-2);margin-top:8px}
.dc-d em{position:absolute;bottom:2px;left:0;right:0;font-style:normal;font-size:.5rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:var(--acc)}
.dc-d.blank{background:none;cursor:default}.dc-d.out{background:none;cursor:default}.dc-d.out i{opacity:.45}
.dc-d.off{border:1px dashed var(--line);background:none}.dc-d.hoje{border:2px solid var(--acc)}.dc-d.fim{background:color-mix(in srgb,var(--acc) 22%,var(--panel));border-color:var(--acc)}.dc-d.fim b{margin-top:0}
.dc-leg{margin:.1rem 0 0;font-size:.7rem;color:var(--ink-2)}`; document.head.append(st2); } // a folha do prazo fica fora do app (document.body)
const DOW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function duePlan(e, due, offIn) {
  const off = offIn || e.dueOff || [], info = readingInfo(e), total = info.total || Number(e.totalPages) || 0, now = info.now || 0, rem = Math.max(0, total - now);
  const t = todayISO(), dd = Math.round((Date.parse(due) - Date.parse(t)) / 864e5) + 1; // hoje conta
  if (!total || dd < 1) return { rem, days: Math.max(0, dd), work: 0, perDay: 0, late: dd < 1 && rem > 0, list: [], todayOff: false };
  const all = []; for (let i = 0; i < dd; i++) { const d = new Date(Date.parse(t) + i * 864e5); all.push({ iso: d.toISOString().slice(0, 10), w: d.getUTCDay(), dow: DOW[d.getUTCDay()], off: off.includes(d.getUTCDay()) }); }
  let work = all.filter((x) => !x.off).length; if (!work) { all.forEach((x) => { x.off = false; }); work = all.length; } // todos de folga: ignora a folga
  const per = Math.ceil(rem / work); let left = rem;
  for (const x of all) { x.n = x.off ? 0 : Math.min(per, left); left -= x.n; }
  return { rem, days: dd, work, perDay: per, late: false, list: all, todayOff: all[0].off };
}
// até qual página ler hoje: parte da página em que o dia começou + a cota do dia (dias de folga não contam)
function dueToday(e) {
  const info = readingInfo(e), total = info.total || Number(e.totalPages) || 0, now = info.now || 0, t = todayISO();
  const readToday = (e.readLog || []).filter((l) => l.date === t).reduce((a, l) => a + (Number(l.pages) || 0), 0);
  const start = Math.max(0, now - readToday), off = e.dueOff || [];
  const dd = Math.round((Date.parse(e.dueAt) - Date.parse(t)) / 864e5) + 1; if (!total || dd < 1) return null;
  const ws = Array.from({ length: dd }, (_, i) => new Date(Date.parse(t) + i * 864e5).getUTCDay()); let work = ws.filter((w) => !off.includes(w)).length; const todayOff = work > 0 && off.includes(ws[0]); if (!work) work = dd;
  const per = Math.ceil(Math.max(0, total - start) / work), target = todayOff ? start : Math.min(total, start + per);
  return { total, now, start, per, target, todayOff, done: now >= target };
}
const dueLong = (iso) => { const d = new Date(iso + "T12:00:00Z"); return ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"][d.getUTCDay()] + ", " + iso.slice(8, 10) + "/" + iso.slice(5, 7); };
const dueLabel = (iso) => { const d = new Date(iso + 'T12:00:00Z'); return `${DOW[d.getUTCDay()]} ${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}`; };
// cartão de um dia: o = { iso, w, off, tg (meta de páginas), r (lidas), ate, hoje, fim, fut }
function dueCard(e, o, btn) {
  const DD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'], dm = o.iso.slice(8, 10) + '/' + o.iso.slice(5, 7);
  const pct = o.off ? 0 : o.tg ? Math.max(0, Math.min(1, (o.r || 0) / o.tg)) : 0, ok = !o.off && o.tg && (o.r || 0) >= o.tg;
  const pg = o.off ? 'folga' : o.fut ? o.tg + ' pág.' : (o.r || 0) + ' de ' + o.tg;
  const tag = btn ? 'button type="button"' : 'span', end = btn ? 'button' : 'span';
  return '<' + tag + ' class="dk' + (o.off ? ' off' : '') + (o.hoje ? ' hoje' : '') + (o.fim ? ' fim' : '') + (ok ? ' ok' : '') + '" data-w="' + o.w + '" title="' + (o.off ? 'folga' : 'meta ' + o.tg + ' pág. · ler até a pág. ' + o.ate) + '">'
    + '<small>' + (o.hoje ? 'hoje' : DD[o.w]) + '</small>' + (o.compact ? '' : '<em>' + dm + '</em>')
    + '<span class="dk-rib' + (ok ? ' ok' : '') + (o.off ? ' off' : '') + (o.hoje ? ' hj' : '') + '"><i style="height:' + Math.round(pct * 100) + '%"></i>' + (ok ? '<u>★</u>' : o.fim ? '<u class="fim">★</u>' : '') + '</span>'
    + (o.compact ? '<b>' + (o.off ? 'folga' : o.fut ? (o.ate || '') : (o.r || 0) + '/' + o.tg) + '</b>' : '<b>' + pg + '</b>' + (o.off ? '' : '<i>até ' + o.ate + '</i>')) + '</' + end + '>';
}
function dueRow(p, e) {
  const t = todayISO(), last = p.list.length ? p.list[p.list.length - 1].iso : t;
  const readT = (e.readLog || []).filter((l) => l.date === t).reduce((a, l) => a + (Number(l.pages) || 0), 0);
  const h = (() => { try { return e.dueAt ? dueToday(e) : null; } catch { return null; } })();
  return '<div class="dk-row">' + p.list.map((x) => dueCard(e, { iso: x.iso, w: x.w, off: x.off, tg: x.iso === t && h && !x.off ? h.per : x.n, r: x.iso === t ? readT : 0, ate: x.iso === t && h && !x.off ? h.target : x.ate, hoje: x.iso === t, fim: x.iso === last, fut: x.iso > t }, true)).join('') + '</div>';
}
function dueCal(p) {
  const t = todayISO(), last = p.list.length ? p.list[p.list.length - 1].iso : t, byIso = new Map(p.list.map((x) => [x.iso, x]));
  const offW = new Set(p.list.filter((x) => x.off).map((x) => x.w)), MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const ORD = [1, 2, 3, 4, 5, 6, 0], NOME = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const head = '<div class="dc-hs">' + ORD.map((w) => '<button type="button" class="dc-h' + (offW.has(w) ? ' off' : '') + '" data-w="' + w + '" aria-label="' + DOW[w] + (offW.has(w) ? ': folga' : '') + '">' + NOME[w] + '</button>').join('') + '</div>';
  const months = []; for (let y = Number(t.slice(0, 4)), m = Number(t.slice(5, 7)) - 1; ; m++) { if (m > 11) { m = 0; y++; } const key = y + '-' + String(m + 1).padStart(2, '0'); months.push([y, m]); if (key >= last.slice(0, 7)) break; }
  const cur = Math.max(0, Math.min(months.length - 1, window.__dcM || 0));
  return '<div class="dc">' + months.map(([y, m], mi) => {
    const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate(), lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7; const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span class="dc-d blank"></span>');
    for (let d = 1; d <= days; d++) { const iso = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0'), x = byIso.get(iso);
      if (!x) { cells.push('<span class="dc-d out"><i>' + d + '</i></span>'); continue; }
      cells.push('<button type="button" class="dc-d' + (x.off ? ' off' : '') + (iso === t ? ' hoje' : '') + (iso === last ? ' fim' : '') + '" data-w="' + x.w + '" title="' + (x.off ? 'folga' : 'até a pág. ' + x.ate) + '"><i>' + d + '</i>' + (x.off ? '<small>folga</small>' : '<b>' + x.ate + '</b>') + (iso === last ? '<em>prazo</em>' : '') + '</button>'); }
    return '<div class="dc-m" data-i="' + mi + '"' + (mi === cur ? '' : ' hidden') + '>' + (months.length > 1 ? '<div class="dc-mn"><button type="button" class="dc-nav" data-s="-1"' + (mi === 0 ? ' disabled' : '') + ' aria-label="Mês anterior">‹</button><span>' + MES[m] + ' ' + y + '</span><button type="button" class="dc-nav" data-s="1"' + (mi === months.length - 1 ? ' disabled' : '') + ' aria-label="Próximo mês">›</button></div>' : '') + head + '<div class="dc-g">' + (() => { const rows = []; for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7)); while (rows.length > 1 && !rows[0].some((c) => c.startsWith('<button'))) rows.shift(); return rows.flat().join(''); })() + '</div></div>';
  }).join('') + '<p class="dc-leg">O número em cada dia é a página até onde ler.</p></div>';
}
function dueSheet(e) {
  const t = todayISO(), add = (n) => new Date(Date.parse(t) + n * 864e5).toISOString().slice(0, 10);
  const nextDow = (w) => { const d0 = new Date(t + 'T12:00:00Z').getUTCDay(); let n = (w - d0 + 7) % 7; if (n === 0) n = 7; return add(n); };
  const endMonth = (() => { const d = new Date(t + 'T12:00:00Z'); return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).toISOString().slice(0, 10); })();
  const quick = [['Sábado', nextDow(6)], ['Domingo', nextDow(0)], ['Em 1 semana', add(7)], ['Fim do mês', endMonth]];
  const wrap = document.createElement('div'); wrap.className = 'sheet due-sh';
  wrap.innerHTML = `<div class="box"><form class="form"><h3>Quando quer terminar?</h3><p class="hint"></p>
    <div style="display:flex;gap:.4rem;flex-wrap:wrap">${quick.map(([n, d]) => `<button type="button" class="dq" data-d="${d}" style="border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.35rem .8rem;font:inherit;font-weight:800;font-size:.84rem">${n}</button>`).join('')}</div>
    <label>Data<input type="date" name="due" min="${t}"></label><div class="dp" style="font-size:.86rem;line-height:1.5"></div>
    <button type="submit" class="primary">Salvar prazo</button>${e.dueAt ? '<button type="button" class="dx">Tirar o prazo</button>' : ''}<button type="button" class="cancel">Cancelar</button></form></div>`;
  const f = wrap.querySelector('form'), inp = f.querySelector('input[name=due]'), out = f.querySelector('.dp');
  f.querySelector('.hint').textContent = `“${e.title}”: o app divide as páginas que faltam pelos dias até lá.`;
  let off = [...(e.dueOff || [])];
  const show = () => { const v = inp.value; if (!v) { out.innerHTML = ''; return; } const p = duePlan(e, v, off);
    if (!p.rem) { out.innerHTML = 'Você já está na última página.'; return; } if (p.days < 1) { out.innerHTML = 'Escolha hoje ou um dia depois.'; return; }
    const mx = Math.max(1, ...p.list.map((x) => x.n)); { let acc = (readingInfo(e).now || 0); for (const x of p.list) { acc += x.n; x.ate = Math.min(acc, readingInfo(e).total || Number(e.totalPages) || acc); } }
    out.innerHTML = `<div class="dp-sum"><b>${p.perDay}</b> páginas por dia<small>${p.rem} páginas em ${plural(p.work, 'dia de leitura', 'dias de leitura')}${p.work < p.days ? ' · ' + plural(p.days - p.work, 'folga', 'folgas') : ''}</small></div>
      ${dueRow(p, e)}
      <small class="hint" style="margin:0">Toque num dia para marcar folga (vale para esse dia da semana até o prazo).</small>`;
    out.querySelectorAll('.dk[data-w], .dc-d[data-w], .dc-h[data-w]').forEach((b) => b.addEventListener('click', () => { const w = Number(b.dataset.w); off = off.includes(w) ? off.filter((x) => x !== w) : [...off, w]; show(); })); };
  inp.value = e.dueAt || ''; show(); inp.addEventListener('input', show);
  f.querySelectorAll('.dq').forEach((b) => b.addEventListener('click', () => { inp.value = b.dataset.d; show(); }));
  const close = () => wrap.remove(); wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); }); f.querySelector('.cancel').addEventListener('click', close);
  f.querySelector('.dx')?.addEventListener('click', () => { delete e.dueAt; delete e.dueSince; delete e.dueStartPage; delete e.dueOff; save(); close(); try { renderHome(todayISO()); } catch {} toast('Prazo removido'); });
  f.addEventListener('submit', (ev) => { ev.preventDefault(); if (!inp.value || inp.value < t) return toast('Escolha hoje ou um dia depois'); if (e.dueAt !== inp.value || !e.dueSince) { e.dueSince = todayISO(); e.dueSetAt = new Date().toISOString(); e.dueStartPage = readingInfo(e).now || 0; } e.dueAt = inp.value; if (off.length) e.dueOff = off; else delete e.dueOff; save(); close(); try { renderHome(todayISO()); } catch {} toast(`Prazo: ${dueLabel(e.dueAt)}`); });
  document.body.append(wrap);
}
// cartão "Lendo agora" do Hoje: linha do prazo (ou convite para definir)
{ let tm = 0; const paint = () => {
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R || !R.e || R.e.status !== 'LENDO') return;
    TR.querySelectorAll('.lx-now .lx-nt, .v3-now:not(.empty)').forEach((card) => {
      if (card.querySelector('.due-ln')) return;
      const e = R.e, row = document.createElement('div'); row.className = 'due-ln';
      if (e.dueAt) { const p = duePlan(e, e.dueAt); row.classList.toggle('late', p.late);
        row.innerHTML = p.late ? `<span>Prazo de ${dueLabel(e.dueAt)} passou · <b>faltam ${p.rem} pág.</b></span><button type="button">Novo prazo</button>`
          : !p.rem ? `<span>Pronto para terminar até ${dueLabel(e.dueAt)}</span><button type="button">Mudar</button>`
          : p.todayOff ? `<span>Hoje é folga.<br>Prazo: ${dueLong(e.dueAt)}</span><button type="button">Mudar</button>`
          : (() => { const h = dueToday(e); return h && h.done ? `<span><b>Meta de hoje cumprida</b>.<br>Prazo: ${dueLong(e.dueAt)}</span><button type="button">Mudar</button>` : (() => { const falta = h ? Math.max(0, h.target - h.now) : 0, lidoHoje = h ? h.now - h.start : 0; return `<span><b>Leia até a pág. ${h ? h.target : '—'}</b> para bater a meta de ${h ? h.per : 0} páginas hoje${lidoHoje > 0 ? ` (faltam ${falta})` : ''}.<br>Prazo: ${dueLong(e.dueAt)}</span>`; })() + `<button type="button">Mudar</button>`; })();
      } else row.innerHTML = '<span></span><button type="button">+ Prazo para terminar</button>';
      const acts = card.querySelector('.v3-now-acts'); if (acts) acts.before(row); else card.append(row);
      row.querySelector('button').addEventListener('click', (ev) => { ev.stopPropagation(); dueSheet(e); });
    });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 80); }).observe(TR, { childList: true, subtree: true });
  setTimeout(paint, 1500);
}
