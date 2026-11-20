// "+ Nova meta" (15/11): abre uma página própria no padrão novo, com "‹ Voltar" para Metas com prazo,
// em vez da tela antiga com "Nenhuma meta... toque em Nova meta" em cima do formulário.
// Os campos são copiados para o formulário original (#f-goal), que continua criando a meta.
{ const st = document.createElement('style'); st.textContent = `
.nm-f{display:grid;gap:.75rem;margin-top:.3rem}
.nm-f label{display:grid;gap:.3rem;font-size:.86rem;font-weight:700}
.nm-f input[type=text],.nm-f input[type=date],.nm-f input[type=number]{font:inherit;font-size:1rem;height:44px;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);padding:0 .7rem;width:100%;min-width:0}
.nm-2{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}
.nm-ck{display:flex!important;grid-template-columns:none;align-items:flex-start;gap:.55rem!important;font-weight:700}
.nm-ck input{margin-top:.2rem;width:18px;height:18px;flex:none}
.nm-plan{display:grid;gap:.6rem;border:1px solid var(--line);border-radius:12px;padding:.7rem;background:var(--panel)}
.nm-plan p{margin:0;font-size:.8rem;opacity:.75;font-weight:600}
.nm-wk{display:grid;grid-template-columns:repeat(7,1fr);gap:.3rem}
.nm-wk label{font-size:.72rem;text-align:center;gap:.2rem}
.nm-wk input{font:inherit;height:38px;border:1px solid var(--line);border-radius:10px;background:var(--bg,#fff);color:var(--ink);text-align:center;width:100%;min-width:0;padding:0}
.nm-ok{height:46px;border-radius:12px;border:0;background:var(--acc);color:#fff;font-weight:800;font-size:1rem}
.nm-no{height:40px;border:0;background:none;color:var(--ink);font-weight:700;opacity:.75}
`; TR.append(st); }
function openGoalNew() {
  const v = $('#shelflist'), fg = document.querySelector('#f-goal'); if (!fg) return newChallenge();
  const F = fg.elements, wk = [...document.querySelectorAll('#week input')];
  const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Nova meta</b><span></span></div>
    <form class="nm-f" id="nm-f" novalidate>
      <label>Nome <input type="text" name="name" maxlength="80" placeholder="Fim de ano 2026" required></label>
      <div class="nm-2"><label>Começa em <input type="date" name="startDate" value="${esc(F.startDate.value || todayISO())}"></label>
        <label>Termina em <input type="date" name="targetDate" value="${esc(F.targetDate.value)}"></label></div>
      <label class="nm-ck"><input type="checkbox" name="plan"><span>Calcular quantas páginas ler por dia para terminar no prazo</span></label>
      <div class="nm-plan" id="nm-plan" hidden>
        <label>Margem de folga (páginas) <input type="number" name="tol" min="0" value="${esc(F.tolerancePages.value || '10')}"></label>
        <p>Peso de cada dia: 1 é um dia normal, 2 é o dobro, 0,5 é metade e 0 é folga.</p>
        <div class="nm-wk">${wk.map((x, i) => `<label>${days[i] || ''}<input type="text" inputmode="decimal" data-w="${i}" value="${esc(x.value)}"></label>`).join('')}</div>
      </div>
      ${(db.shelves || []).length ? `<div class="nm-sh"><b style="font-size:.86rem">Livros da meta</b>
        <label><input type="radio" name="src" value="" checked> Escolher os livros depois</label>
        <label><input type="radio" name="src" value="sh"> Usar uma estante</label>
        <select name="shelf" disabled>${db.shelves.map((s) => `<option value="${esc(s.id)}">${esc(s.name)} (${(s.bookIds || []).length})</option>`).join('')}</select>
        <small>Com estante, a meta acompanha: livro que entra na estante entra na meta, e o que sai, sai.</small></div>` : ''}
      <button type="submit" class="nm-ok">Criar meta</button>
      <button type="button" class="nm-no" id="nm-no">Cancelar</button>
    </form>`;
  const f = $('#nm-f', v), back = () => $('.sl-back', v).click();
  $$('input[name=src]', v).forEach((r) => r.addEventListener('change', () => { if (f.elements.shelf) f.elements.shelf.disabled = !$('input[name=src][value=sh]', v).checked; }));
  f.elements.plan.addEventListener('change', () => { $('#nm-plan', v).hidden = !f.elements.plan.checked; });
  $('#nm-no', v).addEventListener('click', back);
  v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
  f.addEventListener('submit', (ev) => {
    ev.preventDefault(); const E = f.elements, name = E.name.value.trim();
    if (!name) { toast('Dê um nome para a meta'); return E.name.focus(); }
    if (!E.startDate.value || !E.targetDate.value) return toast('Escolha as duas datas');
    if (E.targetDate.value < E.startDate.value) return toast('A data final precisa ser depois da inicial');
    F.name.value = name; F.startDate.value = E.startDate.value; F.targetDate.value = E.targetDate.value;
    F.plan.checked = E.plan.checked; F.tolerancePages.value = E.tol.value || '0';
    $$('[data-w]', v).forEach((x) => { const t = wk[+x.dataset.w]; if (t) t.value = x.value; });
    S.nav.st = []; S.nav.cur = null; v.hidden = true; screen('desafios');
    const useSh = E.shelf && !E.shelf.disabled ? E.shelf.value : null, n0 = (db.goals || []).length;
    if (fg.requestSubmit) fg.requestSubmit(); else fg.dispatchEvent(new Event('submit', { cancelable: true }));
    const g = (db.goals || []).length > n0 ? db.goals[db.goals.length - 1] : null;
    if (g && useSh) { g.shelfId = useSh; syncGoalShelf(g); save(); setTimeout(() => { try { open(g); setGMode('meta'); } catch {} toast('Meta criada com os livros da estante'); }, 120); }
  });
  S.listRedraw = null; S.navView = { t: 'goalnew', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); v.hidden = false; v.scrollTop = 0; syncTopTitle();
  setTimeout(() => { try { f.elements.name.focus(); } catch {} }, 60);
}
{ const _o = openGoalNew; openGoalNew = function () { navEnter(() => openGoalNew()); S.nav.depth++; try { return _o.apply(this, arguments); } finally { S.nav.depth--; } }; }
// o botão da lista de metas abre a página nova
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('#shelflist #gl-new'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault(); openGoalNew(); }, true);
