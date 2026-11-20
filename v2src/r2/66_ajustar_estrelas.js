// Ajustar leituras (Bia, 17/11): a nota vira estrelas (toque 2× = meia; na 1ª estrela, mais um toque zera) e a ressaca vira
// dois botões (Me deu / Curou; nenhum = tudo bem). As listas originais ficam escondidas e continuam salvando.
{ const st = document.createElement('style'); st.textContent = `
.fx-stars{display:flex;align-items:center;gap:.1rem;height:36px}.fx-stars button{border:0;background:none;padding:.1rem;cursor:pointer;line-height:0}
.fx-stars svg{width:26px;height:26px;display:block}.fx-stars small{margin-left:.35rem;font-size:.72rem;font-weight:700;color:var(--ink-2)}
.fx-rs2{display:flex;gap:.35rem;flex-wrap:wrap}.fx-rs2 button{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.35rem .65rem;font:inherit;font-size:.76rem;font-weight:800;cursor:pointer}
.fx-rs2 button[data-v=deu].on{border-color:#7a5cd6;background:color-mix(in srgb,#7a5cd6 18%,var(--panel))}.fx-rs2 button[data-v=curou].on{border-color:#2f8a52;background:color-mix(in srgb,#2f8a52 18%,var(--panel))}
.fx-f label:has(select[data-k=nota]),.fx-f label:has(select[data-k=rs]){grid-column:1/-1}`; TR.append(st); }
{ let tm = 0; const upgrade = () => {
    TR.querySelectorAll('select[data-k=nota]:not([data-up])').forEach((sel) => { sel.dataset.up = 1; sel.style.setProperty('display', 'none', 'important');
      const box = document.createElement('div'); box.className = 'fx-stars'; sel.after(box);
      const draw = () => { const v = Number(sel.value) || 0; box.replaceChildren(...[1, 2, 3, 4, 5].map((i) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'nota ' + i); b.append(paw(pawFill(v, i)));
          b.addEventListener('click', () => { const nv = v === i ? i - 0.5 : (i === 1 && v === 0.5) ? 0 : i; sel.value = nv ? String(nv) : ''; sel.dispatchEvent(new Event('change')); draw(); }); return b; }));
        const sm = document.createElement('small'); sm.textContent = v ? String(v).replace('.', ',') : 'sem nota'; box.append(sm); };
      draw(); });
    TR.querySelectorAll('select[data-k=rs]:not([data-up])').forEach((sel) => { sel.dataset.up = 1; sel.style.setProperty('display', 'none', 'important');
      const box = document.createElement('div'); box.className = 'fx-rs2'; box.innerHTML = '<button type="button" data-v="deu">Me deu ressaca</button><button type="button" data-v="curou">Curou minha ressaca</button>'; sel.after(box);
      const paint = () => box.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === sel.value));
      box.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => { sel.value = sel.value === b.dataset.v ? '' : b.dataset.v; sel.dispatchEvent(new Event('change')); paint(); })); paint(); });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(upgrade, 60); }).observe(TR, { childList: true, subtree: true }); }
