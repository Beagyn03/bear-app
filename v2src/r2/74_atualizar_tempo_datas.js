// Atualizar leitura (Bia, 17/11): terceira opção "Tempo" (audiolivro: onde parou em horas e minutos, do total) e as datas
// "Comecei em" e "Lido em" lado a lado ("Lido em" permite registrar a leitura de outro dia).
{ const st = document.createElement('style'); st.textContent = `
.up-dates{display:grid;grid-template-columns:1fr 1fr;gap:.45rem;margin:.1rem 0 .55rem}.up-dates label{display:grid;gap:.15rem;font-size:.68rem;font-weight:800;color:var(--ink-2);text-align:left}
.up-dates input{height:36px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;font-size:.84rem;padding:0 .5rem;min-width:0}
.up-tempo{display:grid;justify-items:center;gap:.35rem;margin:.3rem 0 .5rem}.up-tempo .tp-in{display:flex;align-items:baseline;gap:.25rem}
.up-tempo .tp-in input{width:3.2ch!important;height:auto!important;min-height:0!important;border-radius:0!important;background:none!important;box-shadow:none!important;border:0;border-bottom:2px solid var(--acc);background:none;color:var(--ink);font:inherit;font-size:2.2rem;font-weight:900;text-align:center;padding:0}
.up-tempo .tp-in span{font-size:1.1rem;font-weight:800;color:var(--ink-2)}.up-tempo small{font-size:.76rem;color:var(--ink-2);font-weight:700}
.up-tempo .tp-ed{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.76rem;padding:0;cursor:pointer}
#editor.tempo .up-big{display:none!important}`; TR.append(st); }
{ const ST = { tempo: null, lido: null }; let tm = 0;
  const hm = (min) => ({ h: Math.floor(min / 60), m: Math.round(min % 60) });
  const askTotal = (e, done) => { const cur = e.audioMin ? hm(e.audioMin) : { h: '', m: '' };
    const h = prompt('Duração total do audiolivro (horas e minutos, ex.: 9:30)', cur.h !== '' ? cur.h + ':' + String(cur.m).padStart(2, '0') : ''); if (h == null) return;
    const mm = String(h).trim().match(/^(\d{1,3})(?::(\d{1,2}))?$/); if (!mm) return toast('Use o formato horas:minutos, ex.: 9:30');
    e.audioMin = Number(mm[1]) * 60 + Number(mm[2] || 0); if (!e.audioMin) return; save(); done(); };
  const enhance = () => {
    const ed = TR.querySelector('#editor'); if (!ed || ed.hidden) return; const seg = ed.querySelector('.up-seg'); if (!seg || seg.dataset.up) return;
    seg.dataset.up = 1; const R = (() => { try { return reading(); } catch { return null; } })(); if (!R) return; const e = R.e, today = todayISO();
    if (ST.tempo === null) ST.tempo = e.format === 'AUDIO';
    // datas lado a lado
    if (!ed.querySelector('.up-dates')) { const dt = document.createElement('div'); dt.className = 'up-dates';
      dt.innerHTML = '<label>Comecei em<input type="date" class="ud-ini" max="' + today + '" value="' + esc(e.startedAt || '') + '"></label><label>Lido em<input type="date" class="ud-lido" max="' + today + '" value="' + (ST.lido || today) + '"></label>';
      seg.before(dt);
      dt.querySelector('.ud-ini').addEventListener('change', (ev) => { if (ev.target.value) { e.startedAt = ev.target.value; save(); } });
      dt.querySelector('.ud-lido').addEventListener('change', (ev) => { ST.lido = ev.target.value && ev.target.value < today ? ev.target.value : null; }); }
    // opção Tempo
    const tb = document.createElement('button'); tb.type = 'button'; tb.dataset.m = 'tempo'; tb.textContent = 'Tempo'; seg.append(tb);
    const range = ed.querySelector('#up-r'), total = R.total;
    const box = document.createElement('div'); box.className = 'up-tempo'; ed.querySelector('.up-big')?.after(box);
    const paintT = () => {
      if (!e.audioMin) { box.innerHTML = '<small>Para usar o tempo, informe a duração total do audiolivro.</small><button type="button" class="tp-ed">Informar duração</button>'; box.querySelector('.tp-ed').addEventListener('click', () => askTotal(e, paintT)); return; }
      const pos = Math.round((Number(range.value) / total) * e.audioMin), a = hm(pos), T = hm(e.audioMin);
      box.innerHTML = '<div class="tp-in"><input class="tp-h" inputmode="numeric" value="' + a.h + '" aria-label="Horas"><span>h</span><input class="tp-m" inputmode="numeric" value="' + String(a.m).padStart(2, '0') + '" aria-label="Minutos"><span>min</span></div><small>de ' + T.h + 'h' + (T.m ? String(T.m).padStart(2, '0') : '') + ' · <button type="button" class="tp-ed">mudar duração</button></small>';
      const set = () => { const mins = (Number(box.querySelector('.tp-h').value) || 0) * 60 + (Number(box.querySelector('.tp-m').value) || 0);
        const pg = Math.max(0, Math.min(total, Math.round((Math.min(mins, e.audioMin) / e.audioMin) * total))); range.value = pg; range.dispatchEvent(new Event('input')); };
      box.querySelectorAll('input').forEach((i) => { i.addEventListener('input', set); i.addEventListener('focus', () => i.select()); });
      box.querySelector('.tp-ed').addEventListener('click', () => askTotal(e, paintT));
    };
    const apply = () => { ed.classList.toggle('tempo', !!ST.tempo); box.hidden = !ST.tempo; seg.querySelectorAll('button').forEach((b) => { if (ST.tempo) b.classList.toggle('on', b === tb); }); if (ST.tempo) paintT(); };
    tb.addEventListener('click', () => { ST.tempo = true; apply(); });
    seg.querySelectorAll('button:not([data-m=tempo])').forEach((b) => b.addEventListener('click', () => { ST.tempo = false; }, true));
    range?.addEventListener('input', () => { if (ST.tempo && e.audioMin && !box.contains(TR.activeElement)) paintT(); });
    // salvar com "Lido em" de outro dia: o registro vai para aquele dia
    ed.querySelector('#up-save')?.addEventListener('click', () => { const d = ST.lido; ST.lido = null; ST.tempo = null; if (!d) return;
      setTimeout(() => { const L = e.readLog || []; for (let i = L.length - 1; i >= 0; i--) if (L[i].date === today) { L[i].date = d; save(); try { refresh(); } catch {} break; } }, 0); });
    ed.querySelector('#up-cancel')?.addEventListener('click', () => { ST.lido = null; ST.tempo = null; });
    apply();
  };
  new MutationObserver(() => { try { enhance(); } catch {} }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
