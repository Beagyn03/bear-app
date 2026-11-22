// Minha leitura (Bia, 21/11): uma ordem que faz sentido de leitora e nada duplicado.
// progresso/situação → Ver histórico → Minha avaliação → Trechos → Anotação → Páginas por dia → Meu exemplar (+ formato e páginas) → Meus ecos
// (os ecos ficam no fim porque o bloco t0 mantém essa seção como última; não brigar com ele).
// Sai o cartão "Ajustes do livro" (Edição e Remover já estão no ••• do livro; Formato e Total de páginas vão para junto do Meu exemplar).
// Trechos e Anotação ganham título próprio; sem conteúdo, só uma linha discreta (nada de cartão vazio nem botão amarelo gigante).
{ const st = document.createElement('style'); st.textContent = `
#shelflist .v7h{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;margin:0 0 .45rem}
#shelflist .v7h b{font-size:.95rem;font-weight:900}#shelflist .v7h small{font-size:.74rem;color:var(--ink-2);font-weight:700}
#shelflist .v7add{border:0;background:none;padding:.4rem .1rem;min-height:40px;font:inherit;font-weight:800;font-size:.86rem;color:var(--acc);cursor:pointer;text-align:left}
#shelflist .v7tq .bq:last-of-type{margin-bottom:0}
#shelflist .v7exg{display:grid;gap:.1rem;margin:-.2rem 0 .85rem}
#shelflist .v7exg .bp-adj{min-height:44px}
`; TR.append(st); }
{ const vSel = '#shelflist:not([hidden])'; let cur = null; const _ob = openBookPage; openBookPage = function (e) { cur = e; return _ob.apply(this, arguments); };
  const mk = (h) => { const t = document.createElement('div'); t.innerHTML = h.trim(); return t.firstElementChild; };
  const run = () => {
    const v = TR.querySelector(vSel); if (!v) return; const on = v.querySelector('.bp-tabs button[data-t=minha].on'); if (!on) return;
    const nav = on.closest('.bp-tabs'), body = nav && nav.parentElement; if (!body) return;
    const kids = () => [...body.children];
    // 1. Ajustes do livro → Formato e Total de páginas ficam; Edição e Remover saem (estão no •••)
    const adj = kids().find((c) => c.matches('section.bp-card') && c.querySelector('[data-a=fmt]'));
    if (adj) {
      const g = mk('<section class="v7exg" aria-label="Detalhes do meu exemplar"></section>');
      adj.querySelectorAll('[data-a=fmt],[data-a=pages]').forEach((b) => g.append(b));
      adj.replaceWith(g);
    }
    // 2. Trechos: título próprio + contador; sem trechos, linha discreta
    const oldQ = kids().find((c) => c.matches('section.bp-card') && !c.classList.contains('v7tq') && c.querySelector('[data-a=quote]'));
    if (oldQ) {
      const items = [...oldQ.querySelectorAll('.bq')];
      const btn = oldQ.querySelector('[data-a=quote]'); btn.className = 'v7add'; btn.textContent = items.length ? '+ Trecho' : '+ Salvar um trecho';
      const s = mk(`<section class="bp-card v7tq"><div class="v7h"><b>Trechos${items.length ? ' · ' + items.length : ''}</b></div></section>`);
      items.forEach((q) => s.append(q));
      if (items.length) s.firstElementChild.append(btn); else s.append(btn);
      oldQ.replaceWith(s);
    }
    kids().filter((c) => c.matches('.bp-row') && /Meus trechos/.test(c.textContent)).forEach((c) => c.remove());
    // 3. Anotação: título próprio, "só você vê"; sem anotação, linha discreta
    let note = kids().find((c) => c.classList.contains('v7note'));
    if (!note) {
      const had = kids().find((c) => c.matches('section.bp-card') && c.querySelector('.bq-note'));
      if (had) { had.classList.add('v7note'); const r = had.querySelector('.bp-row span'); if (r && !r.querySelector('small')) r.insertAdjacentHTML('beforeend', ' <small style="font-weight:700;color:var(--ink-2);font-size:.74rem">· só você vê</small>'); note = had; }
      else { note = mk('<section class="bp-card v7note"><div class="v7h"><b>Anotação</b><small>só você vê</small></div><button type="button" class="v7add" data-a="note">+ Escrever anotação</button></section>'); body.append(note);
        note.querySelector('button').addEventListener('click', () => { const e = cur && byId(cur.id); if (e) editNote(e); }); }
    }
    // 4. ordem
    const pick = (f) => kids().find(f);
    const seq = [
      pick((c) => c.matches('section.bp-card') && c.querySelector('.bp-st')),
      pick((c) => c.classList.contains('v6histlink')),
      pick((c) => c.matches('section.bp-card') && c.querySelector('[data-a=rate]')),
      pick((c) => c.classList.contains('v7tq')),
      note,
      pick((c) => c.matches('section.bp-card') && /Páginas por dia/.test((c.querySelector('.bp-row') || {}).textContent || '')),
      pick((c) => c.classList.contains('bp-ex')),
      pick((c) => c.classList.contains('bp-buy')),
      pick((c) => c.classList.contains('v7exg')),
    ].filter(Boolean);
    let a = nav; for (const el of seq) { if (a.nextElementSibling !== el) a.after(el); a = el; }
  };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try { run(); } catch (err) { console.warn('minha leitura', err); } }, 90); }).observe(TR, { childList: true, subtree: true }); }
