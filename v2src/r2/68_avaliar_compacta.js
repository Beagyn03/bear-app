// Avaliação mais compacta (Bia, 17/11): a resenha vira um campo curto que abre um editor grande ao tocar; os blocos
// de Terminei/Abandonei e do spoiler ficam mais baixos, para caber tudo sem rolar tanto.
{ const st = document.createElement('style'); st.textContent = `
.rtf-rv-mini{width:100%;box-sizing:border-box;min-height:56px;max-height:84px;overflow:hidden;text-align:left;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit;font-size:.9rem;padding:.6rem .75rem;cursor:text;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;white-space:pre-wrap}
.rtf-rv-mini.ph{color:var(--ink-2);font-weight:600}
.rv-editor{position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center}
.rv-editor .rv-card{width:100%;max-width:640px;height:min(62vh,520px);box-sizing:border-box;background:var(--bg);border-radius:20px 20px 0 0;display:grid;grid-template-rows:auto 1fr auto;gap:.6rem;padding:14px 16px max(14px,env(safe-area-inset-bottom));box-shadow:0 -8px 30px rgba(0,0,0,.25)}
.rv-editor header{display:flex;justify-content:space-between;align-items:center}.rv-editor header b{font-size:1.05rem;color:var(--ink)}.rv-editor header small{color:var(--ink-2);font-size:.75rem;font-weight:700}.rv-editor header small.lim{color:#c0392b}
.rv-editor textarea{width:100%;height:100%;box-sizing:border-box;resize:none;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);font:inherit;font-size:1rem;line-height:1.5;padding:.8rem}
.rv-editor .rv-ok{height:48px;border:0;border-radius:14px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;font-size:1rem}
.rtf-end{margin:.1rem 0 .5rem!important}.rtf-end button{padding:.4rem .3rem!important}
.rtf-hd > :first-child{width:64px!important;height:96px!important;min-width:0!important;flex:none!important;font-size:.7rem!important;overflow:hidden!important}.rtf-hd > :first-child *{font-size:.56rem!important;line-height:1.1!important;overflow-wrap:anywhere}
.rtf-hd{grid-template-columns:64px 1fr!important;column-gap:.75rem!important}.rtf-hd.has-end .rtf-st{display:none!important}.rtf-hd .rtf-info{min-width:0!important}.rtf-hd .rtf-info b{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.rtf-end.seg{display:flex!important;gap:0!important;border:1.5px solid var(--line);border-radius:99px;padding:3px;margin:.1rem 0 .55rem!important;background:var(--panel)}.rtf-end.seg button{flex:1;border:0!important;border-radius:99px!important;background:none!important;padding:.45rem .3rem!important;font-size:.84rem!important}.rtf-end.seg button small{display:inline!important;margin:0 0 0 .3rem!important;font-size:.7rem!important}.rtf-end.seg button.on[data-v=fim]{background:#2f8a52!important;color:#fff!important}.rtf-end.seg button.on[data-v=ab]{background:#c0392b!important;color:#fff!important}.rtf-end.seg button.on small{color:rgba(255,255,255,.85)!important}

.sheet .rtf-nr .rate-paws{justify-content:flex-start!important;gap:.1rem!important}.sheet .rtf-nr .rate-paws button{width:34px!important;height:34px!important}.sheet .rtf-nr .rate-paws svg{width:26px!important;height:26px!important}.sheet .rtf-nr .rate-paws > button > *{transform:none!important}
.sheet .rtf-nr .paw-lbl{white-space:normal!important;text-align:left;font-size:.74rem!important;line-height:1.2!important}
.rtf-rs2 button small{display:none!important}.rtf-rs2 button{padding:.55rem .6rem!important}
label.rtf-sp{padding:.45rem .7rem!important}label.rtf-sp .rtf-sp-h{font-size:.68rem!important}`; document.head.append(st); }
{ const _rf = rateForm; rateForm = function () {
    const r = _rf.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form'); if (!form) return r;
      const ta = [...form.querySelectorAll('textarea')].find((t) => /O que você achou/.test(t.placeholder || '')); if (!ta || ta.dataset.mini) return r;
      ta.dataset.mini = 1; ta.style.setProperty('display', 'none', 'important');
      const mini = document.createElement('button'); mini.type = 'button'; mini.className = 'rtf-rv-mini'; ta.after(mini);
      const paint = () => { const v = ta.value.trim(); mini.textContent = v || 'Toque para escrever o que achou (opcional)'; mini.classList.toggle('ph', !v); };
      mini.addEventListener('click', () => {
        const ed = document.createElement('div'); ed.className = 'rv-editor'; ed.setAttribute('role', 'dialog');
        ed.innerHTML = '<div class="rv-card"><header><b>Resenha</b><small class="rv-cnt"></small></header><textarea maxlength="2000" placeholder="O que você achou? Conte do seu jeito."></textarea><button type="button" class="rv-ok">Concluir</button></div>';
        const t2 = ed.querySelector('textarea'), cnt = ed.querySelector('.rv-cnt'); t2.value = ta.value.slice(0, 2000);
        const upd = () => { const n = t2.value.length; cnt.textContent = n + '/2000'; cnt.classList.toggle('lim', n >= 1900); };
        t2.addEventListener('input', upd); upd();
        const done = () => { ta.value = t2.value; ta.dispatchEvent(new Event('input', { bubbles: true })); paint(); ed.remove(); };
        ed.querySelector('.rv-ok').addEventListener('click', done); ed.addEventListener('click', (ev) => { if (ev.target === ed) done(); });
        document.body.append(ed); setTimeout(() => { t2.focus(); t2.setSelectionRange(t2.value.length, t2.value.length); }, 50);
      });
      paint();
      const hd = form.closest('.box')?.querySelector('.rtf-hd') || wrap.querySelector('.rtf-hd'), end = wrap.querySelector('.rtf-end');
      if (hd && end) { hd.classList.add('has-end'); end.classList.add('seg'); end.querySelector('[data-v=fim] small') && (end.querySelector('[data-v=fim] small').textContent = '· 100%'); const ab = end.querySelector('[data-v=ab] small'); if (ab) ab.textContent = '· ' + ab.textContent.replace('parei na ', ''); }
      const nr = wrap.querySelector('.rate-paws')?.parentElement; if (nr && nr.classList.contains('rate-nota')) nr.classList.add('rtf-nr');
      const sh = form.querySelector('label.rtf-sp .rtf-sp-h'); if (sh) sh.textContent = 'Quem não leu verá um aviso antes.';
    } catch (err) { console.warn('avaliação compacta', err); }
    return r;
  }; }
