// Folha de Nova/Editar estante mais enxuta (Cancelar e Criar lado a lado, principal preenchido, descrição menor)
// e meta da estante (opcional): "ler todos até [data]". O bloco da estante mostra "meta: X de Y até dd/mm" com barrinha.
{ const st = document.createElement('style'); st.textContent = `
#editor .shf-f{display:grid;grid-template-columns:1fr 1fr;column-gap:.5rem;row-gap:.35rem}
#editor .shf-f > *{grid-column:1/-1}
#editor .shf-f > h3{margin:0 0 .2rem;text-align:left}
#editor .shf-f textarea{min-height:2.8rem;height:2.8rem}
#editor .shf-f .cnt{margin-top:-.2rem}
#editor .shf-f #shf-x{grid-column:auto;order:2;margin:0}
#editor .shf-f #shf-ok{grid-column:auto;order:3;margin:0;background:var(--acc)!important;border-color:var(--acc)!important;justify-content:center;text-align:center}
#editor .shf-f #shf-ok b{color:var(--on-acc,#fff)!important}
#editor .shf-f > *:not(#shf-x):not(#shf-ok){order:1}
.shf-goal{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;font-size:.86rem;color:var(--ink)}
.shf-goal input[type=checkbox]{width:20px;height:20px;accent-color:var(--acc)}
.shf-goal input[type=date]{flex:1;min-width:9rem;height:40px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--ink);font:inherit;padding:0 .5rem}
.es5-goal{display:block;margin:.1rem 0 .5rem;font-size:.74rem;font-weight:800;color:var(--ink-2)}
.es5-goal i{display:block;height:5px;border-radius:3px;background:var(--line);margin-top:.25rem;overflow:hidden}.es5-goal i i{height:100%;margin:0;border-radius:3px;background:var(--sc,var(--acc))}
`; TR.append(st); }
{
  const ed = $('#editor');
  let editing = null; // estante sendo editada (null = nova)
  const addGoal = () => {
    const f = ed.querySelector('.shf-f'); if (!f || f.querySelector('.shf-goal')) return;
    const g = ed.dataset.g !== undefined ? JSON.parse(ed.dataset.g || 'null') : (editing && editing.goal) || null;
    const ok = f.querySelector('#shf-ok'); if (!ok) return;
    ok.insertAdjacentHTML('beforebegin', `<label>Meta da estante (opcional)</label><div class="shf-goal"><label style="display:flex;align-items:center;gap:.4rem"><input type="checkbox" id="shf-gon" ${g ? 'checked' : ''}>Ler todos até</label><input type="date" id="shf-gby" value="${esc((g && g.by) || `${todayISO().slice(0, 4)}-12-31`)}" ${g ? '' : 'disabled'}></div>`);
    const on = $('#shf-gon', f), by = $('#shf-gby', f);
    const keep = () => { ed.dataset.g = on.checked ? JSON.stringify({ by: by.value }) : ''; by.disabled = !on.checked; };
    on.addEventListener('change', keep); by.addEventListener('change', keep);
  };
  new MutationObserver(addGoal).observe(ed, { childList: true, subtree: true });
  const _sf = shelfEditForm;
  shelfEditForm = function (s) { editing = s || null; delete ed.dataset.g; return _sf.apply(this, arguments); };
  // salvar: depois do salvar original, grava a meta na estante criada/editada
  TR.addEventListener('click', (ev) => {
    if (!(ev.target.closest && ev.target.closest('#shf-ok'))) return;
    const on = ed.querySelector('#shf-gon'), by = ed.querySelector('#shf-gby');
    const goal = on && on.checked && by && by.value ? { by: by.value } : null, before = (db.shelves || []).length, target = editing;
    setTimeout(() => {
      if (!ed.hidden) return; // não salvou (ex.: sem nome)
      const x = target || ((db.shelves || []).length > before ? db.shelves[db.shelves.length - 1] : null); if (!x) return;
      if (goal) x.goal = goal; else delete x.goal;
      delete ed.dataset.g; save(); refresh();
    }, 0);
  }, true);
  // mostra a meta no bloco da estante
  const _de = drawEstante;
  drawEstante = function (box) {
    const r = _de.apply(this, arguments);
    (db.shelves || []).forEach((s) => {
      if (!s.goal || !s.goal.by) return;
      const sec = box.querySelector(`.es5[data-shelf="sh:${CSS.escape(s.id)}"]`); if (!sec || sec.querySelector('.es5-goal')) return;
      const list = shelfBooks('sh:' + s.id), lidos = list.filter((e) => e.status === 'LIDO').length, pct = list.length ? Math.round((lidos / list.length) * 100) : 0;
      const days = between(todayISO(), s.goal.by), when = days < 0 ? `prazo era ${fmt(s.goal.by)}` : days === 0 ? 'termina hoje' : `até ${fmt(s.goal.by)} · ${plural(days, 'dia', 'dias')}`;
      const txt = !list.length ? `Meta: ler todos ${when}` : lidos >= list.length ? 'Meta cumprida' : `Meta: ${lidos} de ${list.length} lidos · ${when}`;
      sec.querySelector('.es5-c')?.insertAdjacentHTML('afterend', `<span class="es5-goal">${txt}<i><i style="width:${pct}%"></i></i></span>`);
    });
    return r;
  };
}
