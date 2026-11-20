// "Sua avaliação" de livro lido (Bia, 18/11): atalhos para a retrospectiva (rever e compartilhar) e para o histórico da leitura,
// e os personagens marcados em "Mais sobre a leitura".
{ const st = document.createElement('style'); st.textContent = `
.rtf-view .rtf-rt{display:grid;grid-template-columns:1.2fr 1fr;gap:.5rem;margin-top:.2rem}
.rtf-view .rtf-rt button{border-radius:14px;padding:.75rem .6rem;font:inherit;font-weight:900;font-size:.88rem;cursor:pointer;border:1.5px solid var(--line);background:var(--panel);color:var(--ink)}
.rtf-view .rtf-rt button.go{border:0;color:#fff;background:radial-gradient(120% 160% at 0 0,#4a3585,#171030 70%);box-shadow:0 6px 16px rgba(23,16,48,.25)}
.rtf-view .rtf-rt button.go span{color:#f2c94c}
.rtf-view .rtf-pp{display:flex;flex-wrap:wrap;gap:.35rem .9rem;font-size:.84rem;color:var(--ink-2)}.rtf-view .rtf-pp b{color:var(--ink)}
`; document.head.append(st); }
{ const _rf = rateForm; rateForm = function (b) {
  const r = _rf.apply(this, arguments);
  try {
    const wrap = [...document.querySelectorAll('body > .sheet.rt-full')].pop(), view = wrap && wrap.querySelector('.rtf-view'); if (!view || view.querySelector('.rtf-rt')) return r;
    const e = lib().find((x) => x === b) || lib().find((x) => normT(x.title) === normT(b.title)); if (!e || e.status !== 'LIDO') return r;
    const F = e.fin || {};
    if (F.fav || F.hate) { const p = document.createElement('div'); p.className = 'rtf-pp'; p.innerHTML = (F.fav ? '<span>Personagem favorito: <b>' + esc(F.fav) + '</b></span>' : '') + (F.hate ? '<span>Amei odiar: <b>' + esc(F.hate) + '</b></span>' : ''); view.querySelector('.rv-tags') ? view.querySelector('.rv-tags').after(p) : view.append(p); }
    const row = document.createElement('div'); row.className = 'rtf-rt';
    row.innerHTML = '<button type="button" class="go"><span>✦</span> Ver retrospectiva</button><button type="button" class="hs">Histórico da leitura</button>';
    (view.querySelector('.rtf-pp') || view.querySelector('.rv-tags') || view.lastElementChild).after(row);
    row.querySelector('.go').addEventListener('click', () => { wrap.remove(); openRetro(e); });
    row.querySelector('.hs').addEventListener('click', () => { wrap.remove(); statusSheet(e, 'LIDO'); setTimeout(() => { const h = $('#editor .tl-tabs [data-t=hist]'); if (h) h.click(); }, 300); });
  } catch (err) { console.warn('avaliação retro', err); }
  return r;
}; }
// a avaliação publicada leva a situação do livro (Abandonou, Pausou…): quando a situação muda, publica de novo
{ const _sl = setLibStatus; setLibStatus = function (e, st) { const was = e && e.status; const r = _sl.apply(this, arguments); try { if (e && e.review && was !== e.status) setTimeout(() => { try { publishReview(e); } catch {} }, 300); } catch {} return r; }; }
