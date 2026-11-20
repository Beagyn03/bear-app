// "Sua semana" do Início vira o placar do prazo (Bia, 16/11): com a leitura atual com prazo, cada dia mostra a meta do dia
// (contorno) e o que foi lido nele (preenchido), do dia em que o prazo foi marcado até o prazo. Sem prazo, continua o gráfico da semana.
{ const st = document.createElement('style'); st.textContent = `
.pz-wk{display:flex;gap:.25rem;overflow-x:auto;scrollbar-width:none;padding:.2rem 0 .1rem}.pz-wk::-webkit-scrollbar{display:none}
.pz-d{flex:1 0 36px;display:grid;justify-items:center;gap:.12rem;font-size:.6rem;font-weight:800;color:var(--ink-2);text-transform:uppercase;border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:.35rem .1rem}.pz-d.hj{border-color:var(--acc);border-width:1.5px}.pz-d.off{border-style:dashed}.pz-d .dw{order:-1}.pz-d em{font-style:normal;font-size:.6rem;color:var(--ink-2);text-transform:none}
.pz-d .bx{position:relative;width:14px;height:50px;display:flex;align-items:flex-end;justify-content:center}
.pz-d .tg{position:absolute;bottom:0;left:0;right:0;border:1.5px dashed color-mix(in srgb,var(--acc) 70%,var(--line));border-radius:6px;box-sizing:border-box}
.pz-d .rd{position:relative;width:100%;border-radius:6px;background:var(--acc)}.pz-d.ok .rd{background:#2f8a52}
.pz-d b{font-size:.74rem;color:var(--ink);text-transform:none}.pz-d.off b{font-size:.6rem;color:var(--ink-2)}.pz-d.hj .dw{color:var(--acc)}.pz-d.off .bx{opacity:.4}.pz-d.fut b{color:var(--ink-2);font-weight:700}
.pz-ft{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-top:.5rem;font-size:.8rem;font-weight:700;color:var(--ink-2)}.pz-ft b{color:var(--ink)}
.pz-ft button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;padding:0}
.pz-lg{display:flex;gap:.8rem;font-size:.68rem;font-weight:800;color:var(--ink-2);margin-top:.35rem}.pz-lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:.25rem;vertical-align:-1px}
`; TR.append(st); }
{ const _isw = inSemana; inSemana = function () {
  try {
    const R = reading(), e = R && R.e, t = todayISO();
    if (!e || e.status !== 'LENDO' || !e.dueAt || e.dueAt < t) return _isw.apply(this, arguments);
    const read = new Map(bookSeries(e).map((x) => [x.d, x.p]));
    const since = e.dueSince && e.dueSince <= t ? e.dueSince : t, off = e.dueOff || [];
    const total = R.total || Number(e.totalPages) || 0, now = R.now || readingInfo(e).now || 0;
    // meta dos dias que já passaram: a conta do dia em que o prazo foi marcado
    const all = []; for (let d = since; d <= e.dueAt; d = inAddDays(d, 1)) all.push(d);
    const work0 = all.filter((d) => !off.includes(new Date(d + 'T12:00:00Z').getUTCDay())).length || all.length;
    const base = total ? Math.ceil(Math.max(0, total - (e.dueStartPage || 0)) / work0) : 0;
    // de hoje em diante: o que faltava quando o dia começou, dividido pelos dias de leitura que sobram (hoje conta)
    const ahead = all.filter((d) => d >= t), workA = ahead.filter((d) => !off.includes(new Date(d + 'T12:00:00Z').getUTCDay())).length || ahead.length;
    const perA = total ? Math.ceil(Math.max(0, total - (now - (read.get(t) || 0))) / workA) : 0;
    let days = all; if (days.length > 14) { const i = days.indexOf(t); days = days.slice(Math.max(0, i - 3), Math.max(0, i - 3) + 14); }
    const rows = days.map((d) => { const w = new Date(d + 'T12:00:00Z').getUTCDay(), isOff = off.includes(w), r = read.get(d) || 0;
      const tg = isOff ? 0 : d < t ? base : perA; return { d, w, isOff, r, tg, fut: d > t }; });
    const mx = Math.max(1, ...rows.map((x) => Math.max(x.tg, x.r)));
    const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'], hoje = rows.find((x) => x.d === t) || { r: 0, tg: 0 };
    return `<section class="in-sec" data-in="semana"><div class="in-h"><b>Rumo a ${esc(dueLabel(e.dueAt))}</b></div><div class="in-card">
      <div class="pz-wk">${rows.map((x) => `<span class="pz-d${x.d === t ? ' hj' : ''}${x.isOff ? ' off' : ''}${x.fut ? ' fut' : ''}${!x.fut && x.tg && x.r >= x.tg ? ' ok' : ''}" title="${x.isOff ? 'folga' : `leu ${x.r} de ${x.tg}`}">
        <span class="bx">${x.tg ? `<i class="tg" style="height:${Math.round(x.tg / mx * 100)}%"></i>` : ''}${x.r ? `<i class="rd" style="height:${Math.max(6, Math.round(x.r / mx * 100))}%"></i>` : ''}</span>
        <span class="dw">${x.d === t ? 'hoje' : WD[x.w]}</span><b>${x.isOff ? 'folga' : x.fut ? x.tg : x.r}</b><em>${x.d.slice(8, 10)}</em></span>`).join('')}</div>
      <div class="pz-lg"><span><i style="border:1.5px dashed var(--acc)"></i>meta do dia</span><span><i style="background:var(--acc)"></i>lido</span><span><i style="background:#2f8a52"></i>bateu a meta</span></div>
      <div class="pz-ft"><span>${hoje.tg ? (() => { const h = dueToday(e); return hoje.r >= hoje.tg ? `Meta de hoje batida! <b>${hoje.r} de ${hoje.tg}</b> páginas` : `Hoje: leia até a <b>pág. ${h ? h.target : '—'}</b> · faltam ${hoje.tg - hoje.r}`; })() : 'Hoje é folga'}</span><button type="button" class="pz-plan">Ver plano</button></div></div></section>`;
  } catch (err) { console.warn('semana do prazo', err); return _isw.apply(this, arguments); }
}; }
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { TR.querySelectorAll('.pz-plan:not([data-b])').forEach((b) => { b.dataset.b = 1; b.addEventListener('click', () => { const R = reading(); if (R) dueSheet(R.e); }); }); }, 100); }).observe(TR, { childList: true, subtree: true }); }
