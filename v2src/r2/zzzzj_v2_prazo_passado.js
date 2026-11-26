// ---------- v2: dias que já passaram no plano do prazo (Bia, 26/11: "os dias do prazo vão sumindo; não sei se ontem
// bati a meta") ----------
// O plano (dueRow) só mostra de hoje em diante. Acima dele entra "Dias anteriores": cada dia desde que o prazo foi
// marcado até ontem, com as páginas lidas, a meta daquele dia e se bateu (estrela) ou não. Folga aparece como folga.
// A meta de cada dia passado é a mesma conta do histórico (tlEvents): o total dividido pelos dias de leitura do prazo.
{ const st = document.createElement('style'); st.textContent = `
.dpp{margin:.2rem 0 .7rem}.dpp > small{display:block;font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:0 0 .35rem}
.dpp .r{display:flex;gap:.35rem;overflow-x:auto;scrollbar-width:none;padding-bottom:.2rem}
.dpp .c{flex:0 0 auto;min-width:64px;display:grid;justify-items:center;gap:.1rem;padding:.45rem .5rem;border-radius:12px;border:1px solid var(--line);background:var(--panel);font-size:.72rem;color:var(--ink-2)}
.dpp .c b{font-size:.82rem;color:var(--ink)}.dpp .c.ok{border-color:color-mix(in srgb,var(--acc) 60%,var(--line))}.dpp .c.ok i{color:var(--acc)}
.dpp .c.no i{color:var(--ink-2)}.dpp .c.off{border-style:dashed;opacity:.7}.dpp .c i{font-style:normal;font-weight:900}
`; document.head.append(st); try { TR.append(st.cloneNode(true)); } catch {} }
function duePastHTML(e) {
  if (!e || !e.dueAt || !e.dueSince) return '';
  const t = todayISO(), since = String(e.dueSince).slice(0, 10); if (since >= t) return '';
  let L = []; try { L = tlEvents(e) || []; } catch {}
  const byD = new Map(L.map((x) => [x.d, x])), off = e.dueOff || [];
  // meta base, igual ao tlEvents
  let total = 0; try { total = readingInfo(e).total || Number(e.totalPages) || 0; } catch {}
  let work = 0; for (let d = since; d <= e.dueAt; d = new Date(Date.parse(d) + 864e5).toISOString().slice(0, 10)) if (!off.includes(new Date(d + 'T12:00:00Z').getUTCDay())) work++;
  const base = total && work ? Math.ceil(Math.max(0, total - (e.dueStartPage || 0)) / work) : 0;
  const DOW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'], out = [];
  for (let d = since; d < t && out.length < 31; d = new Date(Date.parse(d) + 864e5).toISOString().slice(0, 10)) {
    const w = new Date(d + 'T12:00:00Z').getUTCDay(), x = byD.get(d), pages = x ? x.pages : 0, isOff = off.includes(w) && work > 0, per = isOff ? 0 : (x && x.per) || base;
    const ok = !isOff && per > 0 && pages >= per, lab = `${DOW[w]} ${d.slice(8, 10)}/${d.slice(5, 7)}`;
    out.push(`<div class="c ${isOff ? 'off' : ok ? 'ok' : 'no'}" aria-label="${lab}: ${isOff ? 'folga' : `${pages} de ${per} páginas, ${ok ? 'meta batida' : 'meta não batida'}`}"><span>${lab}</span>${isOff ? '<b>folga</b>' : `<b>${pages} de ${per}</b><i>${ok ? '★ bateu' : 'não bateu'}</i>`}</div>`);
  }
  return out.length ? `<div class="dpp"><small>Dias anteriores</small><div class="r">${out.join('')}</div></div>` : '';
}
{ const _dr = dueRow; dueRow = function (p, e) { const r = _dr.apply(this, arguments); try { return duePastHTML(e) + r; } catch (err) { console.warn('dias anteriores', err); return r; } }; }
