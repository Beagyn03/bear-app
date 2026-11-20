// "Quando quer terminar?" mais arrumado (Bia, 17/11): seções com título (Data · Plano · Lembrete), atalhos numa linha
// com o escolhido destacado, data embaixo, lembrete com interruptor, e Salvar fixo no rodapé. Sem espaços vazios.
{ const st = document.createElement('style'); st.textContent = `
.due-sh form{gap:0!important;padding-bottom:84px!important;align-content:start!important;grid-auto-rows:auto!important}.due-sh .ds-q .dq{height:auto!important;align-self:center}
.due-sh form > *{margin:0!important}
.due-sh .dp-top{margin:0 0 .25rem!important}
.due-sh .ds-bk{display:grid!important;grid-template-columns:52px minmax(0,1fr);gap:.75rem;align-items:center;padding:.65rem .75rem;margin:.2rem 0 .2rem!important;border-radius:16px;background:var(--panel);border:1px solid var(--line)}.due-sh .ds-bk .cv{width:52px!important;height:78px!important;border-radius:5px!important;background-size:cover!important;background-position:center!important;font-size:.42rem!important;box-shadow:0 2px 6px rgba(0,0,0,.18)}.due-sh .ds-bk .cv{display:flex;align-items:center;justify-content:center;text-align:center;padding:4px;box-sizing:border-box;background-color:var(--c,#8a6e55);color:#fff;font-weight:900;line-height:1.05}.due-sh .ds-bk b{display:block;font-size:.98rem;line-height:1.2}.due-sh .ds-bk small{display:block;font-size:.78rem;color:var(--ink-2);font-weight:700;margin-top:.1rem}.due-sh .ds-bk em{display:block;font-style:normal;font-size:.78rem;font-weight:800;color:var(--acc);margin-top:.3rem}
.due-sh .ds-t{display:block;margin:.95rem 0 .45rem!important;font-size:.68rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}
.due-sh .ds-q{display:flex!important;gap:.4rem!important;flex-wrap:nowrap!important;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.due-sh .ds-q::-webkit-scrollbar{display:none}
html .due-sh .ds-q .dq{flex:none;padding:.5rem .9rem!important;font-size:.84rem!important;border-radius:99px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font-weight:800!important}
html .due-sh .ds-q .dq.on{background:var(--acc)!important;border-color:var(--acc)!important;color:var(--on-acc,#fff)!important}
.due-sh .ds-date{display:flex!important;align-items:center;gap:.6rem;margin-top:.55rem!important;font-size:.82rem;font-weight:700;color:var(--ink-2)}
.due-sh .ds-date input{flex:1;min-width:0;margin:0!important;border-radius:12px!important}
.due-sh .dp:empty{display:none}
.due-sh .dp{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:.75rem .8rem}
.due-sh .rem-box{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:.35rem .8rem!important;padding:.75rem .85rem!important;border-radius:16px!important;background:var(--panel)!important}
.due-sh .rem-box > label.ck-row{grid-column:1;display:block!important;font-size:.88rem;line-height:1.3;cursor:pointer}
.due-sh .rem-box > label.ck-row input{position:absolute;opacity:0;pointer-events:none}
.due-sh .rem-box .ds-sw{grid-column:2;grid-row:1;width:46px;height:28px;border-radius:99px;background:color-mix(in srgb,var(--ink) 18%,transparent);position:relative;cursor:pointer;transition:background .2s}
.due-sh .rem-box .ds-sw::after{content:"";position:absolute;top:3px;left:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:transform .2s}
.due-sh .rem-box.on .ds-sw{background:var(--acc)}.due-sh .rem-box.on .ds-sw::after{transform:translateX(18px)}
.due-sh .rem-box > label:not(.ck-row){grid-column:1/-1;font-size:.84rem!important;color:var(--ink-2)}
.due-sh .rem-box:not(.on) > label:not(.ck-row){opacity:.45;pointer-events:none}
.due-sh .rem-box select{border-radius:99px!important;padding:0 .8rem!important;font-weight:800}
.due-sh .rem-box .hint{grid-column:1/-1}
.due-sh button.primary{position:fixed!important;left:16px;right:16px;bottom:max(16px,env(safe-area-inset-bottom));max-width:608px;margin:0 auto!important;z-index:3;height:50px!important;border-radius:14px!important;box-shadow:0 6px 16px rgba(0,0,0,.18)}
html .due-sh .dx{margin-top:.8rem!important;justify-self:center}
`; document.head.append(st); }
{ const _ds = dueSheet; dueSheet = function (e) {
    const r = _ds.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet.due-sh')].pop(); if (!wrap) return r;
      const f = wrap.querySelector('form'), inp = f.querySelector('input[name=due]'), dq = f.querySelector('.dq'), qrow = dq && dq.parentElement;
      // livro no topo: capa, título e quantas páginas faltam (Bia, 18/11)
      const hint = f.querySelector('.dp-top + .hint'); if (hint) { const inf = (() => { try { return readingInfo(e); } catch { return {}; } })(), tot = inf.total || Number(e.totalPages) || 0, now = inf.now || 0;
        const bk = document.createElement('div'); bk.className = 'ds-bk'; bk.innerHTML = cvh(e.title, e.cover, '') + '<span><b>' + esc(e.title) + '</b><small>' + esc(e.author || '') + '</small><em>' + (tot ? 'pág. ' + now + ' de ' + tot + ' · faltam ' + Math.max(0, tot - now) : '') + '</em></span>';
        hint.replaceWith(bk); try { paintCv(bk); } catch {} }
      const T = (txt) => { const x = document.createElement('b'); x.className = 'ds-t'; x.textContent = txt; return x; };
      if (qrow) { qrow.classList.add('ds-q'); qrow.removeAttribute('style'); qrow.before(T('Até quando')); }
      const lab = inp && inp.closest('label'); if (lab) { lab.classList.add('ds-date'); if (lab.firstChild && lab.firstChild.nodeType === 3) lab.firstChild.textContent = 'ou escolha a data'; }
      const dp = f.querySelector('.dp'); if (dp) dp.before(Object.assign(T('Seu plano'), { className: 'ds-t ds-plan' }));
      const rb = f.querySelector('.rem-box'); if (rb) { rb.before(T('Lembrete'));
        const ck = rb.querySelector('input[name=rem]'), sw = document.createElement('span'); sw.className = 'ds-sw'; sw.setAttribute('role', 'switch');
        rb.querySelector('label.ck-row').after(sw); const sync = () => { rb.classList.toggle('on', ck.checked); sw.setAttribute('aria-checked', ck.checked); };
        sw.addEventListener('click', () => { ck.checked = !ck.checked; sync(); }); ck.addEventListener('change', sync); sync(); }
      const mark = () => { f.querySelectorAll('.dq').forEach((b) => b.classList.toggle('on', b.dataset.d === inp.value));
        const pl = f.querySelector('.ds-plan'); if (pl) pl.style.display = inp.value ? '' : 'none'; };
      inp.addEventListener('input', mark); f.querySelectorAll('.dq').forEach((b) => b.addEventListener('click', () => setTimeout(mark, 0))); mark();
    } catch (err) { console.warn('tela do prazo', err); }
    return r;
  }; }
