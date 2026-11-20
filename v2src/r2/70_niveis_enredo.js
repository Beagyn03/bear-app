// Níveis do enredo (Bia, 17/11): na avaliação, ao lado das estrelas, a pessoa marca quanto o livro tem de cada elemento
// (Romance, Hot, Suspense, Terror…) de 1 a 5. Fica na avaliação (review.niveis = { chave: nível }).
const NIVEIS = [['romance', 'Romance'], ['hot', 'Hot'], ['suspense', 'Suspense'], ['misterio', 'Mistério'], ['terror', 'Terror'], ['fantasia', 'Fantasia'],
  ['drama', 'Drama'], ['choro', 'Me fez chorar'], ['humor', 'Humor'], ['acao', 'Ação'], ['plot', 'Reviravoltas'], ['tensao', 'Tensão'], ['angst', 'Angústia'], ['slow', 'Slow burn']];
const nivDots = (n) => '<span class="nv-dots">' + [1, 2, 3, 4, 5].map((i) => '<i' + (i <= n ? ' class="on"' : '') + '></i>').join('') + '</span>';
{ const st = document.createElement('style'); st.textContent = `
.rtf-nota-wrap{display:flex;align-items:center;justify-content:space-between;gap:.6rem;margin:.2rem 0 .5rem}
.sheet .rate-nota.rtf-nr{flex-direction:column!important;align-items:flex-start!important;gap:.15rem!important;margin:0!important}
.sheet .rtf-nr .rate-paws button{width:38px!important;height:38px!important}.sheet .rtf-nr .rate-paws svg{width:31px!important;height:31px!important}
.sheet .rtf-nr .paw-lbl{padding-left:.25rem}
.nv-btn{flex:none;border:1.5px dashed var(--acc);background:none;color:var(--acc);border-radius:12px;padding:.45rem .6rem;font:inherit;font-size:.76rem;font-weight:800;line-height:1.15;text-align:center;cursor:pointer;max-width:116px}
.nv-btn.has{border-style:solid;background:color-mix(in srgb,var(--acc) 12%,var(--panel))}
.nv-sum{display:flex;flex-wrap:wrap;gap:.3rem;margin:-.2rem 0 .5rem}.nv-sum span.nv-tag{display:inline-flex;align-items:center;gap:.3rem;border:1px solid var(--line);border-radius:99px;padding:.15rem .5rem;font-size:.72rem;font-weight:800;background:var(--panel);color:var(--ink)}
.nv-dots{display:inline-flex;gap:2px}.nv-dots i{width:7px;height:7px;border-radius:50%;background:var(--line)}.nv-dots i.on{background:var(--acc)}
.nv-sheet .box{max-height:86vh;overflow:auto}.nv-list{display:grid;gap:.15rem;margin:.4rem 0 .7rem}
.nv-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.35rem 0;border-bottom:1px solid var(--line)}.nv-row b{font-size:.9rem;color:var(--ink)}
.nv-lv{display:flex;gap:.25rem}.nv-lv button{width:30px;height:30px;border-radius:50%;border:1.5px solid var(--line);background:var(--panel);color:var(--ink-2);font:inherit;font-size:.78rem;font-weight:800;padding:0;cursor:pointer}
.nv-lv button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}`; document.head.append(st); }
{ const _rf = rateForm; rateForm = function (b) {
    const r = _rf.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form'); if (!form) return r;
      const nr = wrap.querySelector('.rate-paws')?.parentElement; if (!nr) return r;
      let niv = { ...(((typeof reviewOfLib === 'function' && lib().includes(b) ? reviewOfLib(b) : b.review) || {}).niveis || {}) };
      const row = document.createElement('div'); row.className = 'rtf-nota-wrap'; nr.before(row); row.append(nr);
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'nv-btn'; row.append(btn);
      const sum = document.createElement('div'); sum.className = 'nv-sum'; row.after(sum);
      const paint = () => { const ks = NIVEIS.filter(([k]) => niv[k] > 0); btn.textContent = ks.length ? 'Níveis do enredo · ' + ks.length : '+ Níveis do enredo'; btn.classList.toggle('has', ks.length > 0);
        sum.innerHTML = ks.map(([k, n]) => '<span class="nv-tag">' + esc(n) + nivDots(niv[k]) + '</span>').join(''); sum.hidden = !ks.length; };
      btn.addEventListener('click', () => {
        const sh = document.createElement('div'); sh.className = 'sheet nv-sheet'; const tmp = { ...niv };
        const draw = () => { sh.innerHTML = '<div class="box"><h3>Níveis do enredo</h3><p class="hint">Quanto o livro tem de cada coisa. Toque no nível; toque de novo para tirar.</p><div class="nv-list">'
          + NIVEIS.map(([k, n]) => '<div class="nv-row"><b>' + esc(n) + '</b><div class="nv-lv">' + [1, 2, 3, 4, 5].map((i) => '<button type="button" data-k="' + k + '" data-n="' + i + '"' + ((tmp[k] || 0) >= i ? ' class="on"' : '') + '>' + i + '</button>').join('') + '</div></div>').join('')
          + '</div><button type="button" class="primary nv-ok">Pronto</button></div>';
          sh.querySelectorAll('.nv-lv button').forEach((x) => x.addEventListener('click', () => { const k = x.dataset.k, n = Number(x.dataset.n); if (tmp[k] === n) delete tmp[k]; else tmp[k] = n; draw(); }));
          sh.querySelector('.nv-ok').addEventListener('click', () => { niv = tmp; paint(); sh.remove(); }); };
        sh.addEventListener('click', (ev) => { if (ev.target === sh) sh.remove(); }); draw(); document.body.append(sh);
      });
      paint();
      form.addEventListener('submit', () => { try {
        const clean = Object.fromEntries(Object.entries(niv).filter(([, n]) => n > 0));
        const tgt = b.review || (Object.keys(clean).length ? (b.review = { paws: 0, mel: [], frase: '' }) : null); if (!tgt) return;
        if (Object.keys(clean).length) tgt.niveis = clean; else delete tgt.niveis; save();
      } catch {} });
    } catch (err) { console.warn('níveis do enredo', err); }
    return r;
  }; }
