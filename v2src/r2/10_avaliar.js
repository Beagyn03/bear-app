// Ficha de avaliação mais compacta: título curto, patas em destaque no topo, datas numa linha (toque para alterar),
// spoiler e compartilhar lado a lado, ressaca literária numa linha, Agora não e Salvar lado a lado.
{ const st = document.createElement('style'); st.textContent = `
.sheet.rt2 .form{gap:.6rem!important}
.sheet.rt2 .rate-h{margin:0;font-size:1rem;line-height:1.25}.sheet.rt2 .rate-h small{display:block;font-size:.7rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.65;margin-bottom:.1rem}
.sheet.rt2 .rate-nota{display:flex;flex-direction:column;align-items:center;gap:.15rem;margin:.1rem 0 .2rem}
.sheet.rt2 .rate-nota > .lbl{display:none}
.sheet.rt2 .rate-paws{display:flex;gap:.35rem;justify-content:center}.sheet.rt2 .rate-paws button{width:46px;height:46px;padding:0}.sheet.rt2 .rate-paws svg{width:34px;height:34px}
.sheet.rt2 .rate-paws > button > *{transform:scale(1.35)}
.sheet.rt2 .paw-lbl{font-size:.78rem;opacity:.75}
.sheet.rt2 .rt-dates{display:flex;align-items:center;justify-content:space-between;gap:.5rem;font-size:.82rem;opacity:.9;border:0;background:none;padding:.2rem 0;color:inherit;font-family:inherit;text-align:left;width:100%}
.sheet.rt2 .rt-dates b{font-weight:800}.sheet.rt2 .rt-dates span:last-child{font-weight:800;color:#c46f2b;flex:none}
.sheet.rt2 .rate-dates[hidden]{display:none!important}
.sheet.rt2 textarea{background:rgba(255,255,255,.7)!important;min-height:4.6rem}
.sheet.rt2 .rt-opts{display:flex;flex-wrap:wrap;gap:.4rem .9rem;align-items:center}
.sheet.rt2 .rt-opts .ck-line,.sheet.rt2 .rt-opts .ck-row{margin:0}
.sheet.rt2 .rt-ress{display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}.sheet.rt2 .rt-ress .lbl{margin:0;flex:1 1 auto;font-size:.86rem}
.sheet.rt2 .rt-ress .yn{display:flex;gap:.35rem;flex:none}.sheet.rt2 .rt-ress .yn button{min-height:36px;padding:0 1rem}
.sheet.rt2 .rt-btns{display:grid;grid-template-columns:auto 1fr;gap:.5rem;align-items:center}.sheet.rt2 .rt-btns .cancel{margin:0;padding:0 1rem}
`; document.head.append(st); }
{
  const _rf = rateForm;
  rateForm = function (b) {
    const r = _rf.apply(this, arguments);
    try {
      const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form.form'); if (!form || wrap.classList.contains('rt2')) return r;
      wrap.classList.add('rt2');
      const h = form.querySelector('.rate-h'); if (h) h.innerHTML = `<small>${b.review && b.review.paws ? 'Sua avaliação' : 'Avaliar'}</small>${esc(b.title)}`;
      const ta = form.querySelector('textarea'), tl = ta && ta.closest('label'); if (tl && tl.firstChild && tl.firstChild.nodeType === 3) tl.firstChild.textContent = '';
      const nota = form.querySelector('.rate-nota'); if (h && nota) h.after(nota);
      const dates = form.querySelector('.rate-dates');
      if (dates) {
        const [i, f] = [...dates.querySelectorAll('input')];
        const txt = () => (i.value && f.value ? `Lido de <b>${fmt(i.value)}</b> a <b>${fmt(f.value)}</b>` : f.value ? `Terminei em <b>${fmt(f.value)}</b>` : i.value ? `Comecei em <b>${fmt(i.value)}</b>` : 'Sem datas');
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'rt-dates';
        const paint = () => { btn.innerHTML = `<span>${txt()}</span><span>${dates.hidden ? 'Alterar' : 'Pronto'}</span>`; };
        dates.hidden = true; paint(); nota.after(btn); btn.after(dates);
        btn.addEventListener('click', () => { dates.hidden = !dates.hidden; paint(); });
        [i, f].forEach((x) => x.addEventListener('change', paint));
      }
      const spoil = form.querySelector('.ck-line'), share = [...form.querySelectorAll(':scope > .ck-row')].pop();
      if (spoil && share) { const row = document.createElement('div'); row.className = 'rt-opts'; spoil.before(row); row.append(spoil, share); }
      const yn = form.querySelector('.yn'), ylbl = yn && yn.previousElementSibling;
      if (yn && ylbl) { const row = document.createElement('div'); row.className = 'rt-ress'; ylbl.textContent = 'Ressaca literária'; ylbl.before(row); row.append(ylbl, yn); }
      const ok = form.querySelector('button[type=submit]'), no = form.querySelector('button.cancel');
      if (ok && no) { const row = document.createElement('div'); row.className = 'rt-btns'; ok.before(row); row.append(no, ok); ok.textContent = 'Salvar'; }
    } catch (err) { console.error('ficha', err); }
    return r;
  };
}
