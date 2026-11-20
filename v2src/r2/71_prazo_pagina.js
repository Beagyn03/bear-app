// Prazo vira página própria (Bia, 17/11): ocupa a tela inteira com seta de voltar no topo, tudo mais compacto,
// e o calendário não herda o "botão marrom" do tema escuro.
{ const st = document.createElement('style'); st.textContent = `
.sheet.due-sh{background:var(--bg)!important;padding:0!important;align-items:stretch!important}
.sheet.due-sh .box{position:fixed!important;inset:0!important;width:100%!important;max-width:640px!important;margin:0 auto!important;height:100%!important;max-height:none!important;border-radius:0!important;overflow:auto!important;padding:10px 16px max(20px,env(safe-area-inset-bottom))!important;box-sizing:border-box;background:var(--bg)!important;box-shadow:none!important}
.due-sh form{gap:.5rem!important}
.due-sh .dp-top{display:flex;align-items:center;gap:.5rem;margin:0 0 .1rem}.due-sh .dp-top h3{margin:0;font-size:1.05rem}
.due-sh .dp-top .dp-back{flex:none}
.due-sh .hint{font-size:.76rem!important;margin:0!important}
html .due-sh .dq{padding:.25rem .65rem!important;font-size:.76rem!important;height:auto!important;min-height:0!important}
.due-sh label input[type=date]{height:40px!important;padding:.3rem .6rem!important}
.due-sh .dp-sum{margin:.1rem 0 .3rem!important}.due-sh .dp-sum b{font-size:1.5rem!important}.due-sh .dp-sum small{font-size:.72rem!important}
html .due-sh .dc-h,html .due-sh .dc-d.blank,html .due-sh .dc-d.out{background:none!important;color:var(--ink-2)!important;border-color:transparent!important;box-shadow:none!important}
html .due-sh .dc-h{height:auto!important;min-height:0!important;padding:.15rem 0!important}
html .due-sh .dc-d{height:40px!important;min-height:0!important;box-shadow:none!important}
html .due-sh button.dc-d{background:color-mix(in srgb,var(--ink) 7%,transparent)!important;color:var(--ink)!important}
html .due-sh button.dc-d.off{background:none!important;border:1px dashed var(--line)!important}
html .due-sh button.dc-d.hoje{border:2px solid var(--acc)!important}
html .due-sh button.dc-d.fim{background:color-mix(in srgb,var(--acc) 24%,transparent)!important;border:1px solid var(--acc)!important}
.due-sh .dc-leg{display:none}.due-sh .dc-d.fim em{display:none}.due-sh .dc-d.fim i::after{content:" ★";color:var(--acc)}
.due-sh .rem-box{padding:.45rem .6rem!important;gap:.2rem!important;font-size:.84rem}.due-sh .rem-box select{height:34px!important;padding:0 .4rem!important}.due-sh .rem-box .hint{font-size:.68rem!important}
.due-sh button.primary{height:44px!important;min-height:0!important;padding:0 1rem!important;font-size:.92rem!important}
html .due-sh .dx{background:none!important;border:0!important;color:#c0392b!important;height:auto!important;min-height:0!important;padding:.3rem 0!important;font-weight:800;box-shadow:none!important}
.due-sh .cancel{display:none!important}`; document.head.append(st); }
{ const _ds = dueSheet; dueSheet = function (e) {
    const r = _ds.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet.due-sh')].pop(); if (!wrap) return r;
      const f = wrap.querySelector('form'), h3 = f.querySelector('h3');
      const top = document.createElement('div'); top.className = 'dp-top'; top.innerHTML = '<button type="button" class="dp-back">Voltar</button>'; h3.before(top); top.append(h3);
      top.querySelector('.dp-back').addEventListener('click', () => wrap.remove());
      window.__dcM = 0; // abre sempre no mês de hoje
      wrap.addEventListener('click', (ev) => { const nb = ev.target.closest && ev.target.closest('.dc-nav'); if (!nb || nb.disabled) return; ev.preventDefault();
        const ms = [...wrap.querySelectorAll('.dc-m')], n = ms.length, cur = Math.max(0, Math.min(n - 1, (window.__dcM || 0) + Number(nb.dataset.s))); window.__dcM = cur;
        ms.forEach((m) => { m.hidden = Number(m.dataset.i) !== cur; }); });
      const rb = [...f.children].find((x) => x.querySelector && x.querySelector('input[name=rem]')); if (rb) rb.classList.add('rem-box');
      const dx = f.querySelector('.dx'); if (dx) dx.textContent = 'Tirar o prazo';
    } catch (err) { console.warn('prazo em página', err); }
    return r;
  }; }
