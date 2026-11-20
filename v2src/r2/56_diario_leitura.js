// Diário de leitura (Bia, 16/11): ao atualizar a leitura, comentário e emoções daquele ponto (opcionais).
// Fica no livro (e.diary) e aparece em "Minha leitura"; se "Postar na Rede" estiver marcado, vira um comentário na Rede
// com a % de leitura e spoiler protegido até a página em que a pessoa está.
{ const st = document.createElement('style'); st.textContent = `
.up-note{display:grid;gap:.45rem;margin:.7rem 0 .2rem}
.up-note textarea{width:100%;min-height:3.4rem;border-radius:12px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:.9rem;padding:.55rem .7rem;box-sizing:border-box;resize:vertical}
.up-fe{display:flex;gap:.3rem;flex-wrap:wrap}.up-fe button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.25rem .65rem;font:inherit;font-weight:700;font-size:.78rem}
.up-fe button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.up-pub{display:flex;gap:.45rem;align-items:center;font-size:.82rem;font-weight:700;color:var(--ink-2)}.up-pub{flex-wrap:wrap;row-gap:0}.up-pub small{flex-basis:100%;padding-left:1.7rem;font-weight:600;font-size:.7rem}.up-pub[hidden]{display:none!important}
.up-vis{display:flex;align-items:center;justify-content:space-between;gap:.5rem;font-size:.8rem;font-weight:800;color:var(--ink-2)}
.up-vs{display:flex;border:1.5px solid var(--line);border-radius:99px;padding:2px;background:var(--panel)}
.up-vs button{border:0!important;background:none!important;color:var(--ink-2)!important;border-radius:99px!important;height:28px!important;min-height:0!important;padding:0 .7rem!important;font:inherit!important;font-size:.76rem!important;font-weight:800!important;box-shadow:none!important}
.up-vs button.on{background:var(--acc)!important;color:var(--on-acc,#fff)!important}
.dy{display:grid;gap:.5rem}.dy-it{border-left:3px solid var(--acc);padding:.15rem 0 .15rem .65rem}.dy-it small{display:block;font-size:.72rem;font-weight:800;color:var(--ink-2)}.dy-it p{margin:.15rem 0 0;font-size:.88rem;line-height:1.45;white-space:pre-line}
.dy-fe{font-size:.75rem;font-weight:800;color:var(--acc)}
`; TR.append(st); }
S.upNote = { text: '', fe: [], vis: (() => { try { const v = localStorage.getItem('lv.upVis'); return v === 'friends' ? 'friends' : 'public'; } catch { return 'public'; } })(), sp: false };
{ const ed = $('#editor');
  const inject = () => {
    const body = ed.querySelector('.ed-body'); if (ed.hidden || !body || !body.querySelector('#up-save') || body.querySelector('.up-note')) return;
    const N = S.upNote, wrap = document.createElement('div'); wrap.className = 'up-note';
    wrap.innerHTML = `<textarea maxlength="280" placeholder="O que está achando desta parte? (opcional)"></textarea>
      <div class="up-fe">${QT_PICK.map(([k, n]) => `<button type="button" data-f="${k}" class="${N.fe.includes(k) ? 'on' : ''}">${esc(n)}</button>`).join('')}</div>
      <div class="up-vis"><span>Quem vê</span><div class="up-vs">${[['friends', 'Amigos'], ['public', 'Todos']].map(([k, n]) => `<button type="button" data-v="${k}" class="${N.vis === k ? 'on' : ''}">${n}</button>`).join('')}</div></div>
      <label class="up-pub"><input type="checkbox" ${N.sp ? 'checked' : ''}> Contém spoiler <small>(quem não chegou nesta página vê embaçado)</small></label>`;
    const ta = wrap.querySelector('textarea'); ta.value = N.text; ta.addEventListener('input', () => { N.text = ta.value; });
    wrap.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.f; if (N.fe.includes(k)) N.fe = N.fe.filter((x) => x !== k); else if (N.fe.length < 3) N.fe.push(k); else return toast('Até 3 emoções'); b.classList.toggle('on', N.fe.includes(k)); }));
    wrap.querySelector('.up-pub input').addEventListener('change', (ev) => { N.sp = ev.target.checked; });
    wrap.querySelectorAll('.up-vs button').forEach((b) => b.addEventListener('click', () => { N.vis = b.dataset.v; try { localStorage.setItem('lv.upVis', N.vis); } catch {}
      wrap.querySelectorAll('.up-vs button').forEach((x) => x.classList.toggle('on', x === b)); }));
    const row = body.querySelector('.up-row'); if (row) row.before(wrap); else body.append(wrap);
  };
  new MutationObserver(inject).observe(ed, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  // ao salvar: guarda no diário e posta (antes do editor fechar)
  ed.addEventListener('click', (ev) => {
    const t = ev.target.closest && ev.target.closest('#up-save, #up-fin'); if (!t || t.disabled) return;
    const N = S.upNote, text = String(N.text || '').trim(), fe = [...N.fe]; S.upNote = { text: '', fe: [], vis: N.vis === 'me' ? 'public' : N.vis, sp: false };
    if (!text && !fe.length) return;
    const R = (() => { try { return reading(); } catch { return null; } })(); if (!R) return;
    const r = $('#up-r', ed), page = t.id === 'up-fin' ? R.total : Math.max(0, Math.min(R.total, Number(r && r.value) || R.now)), pct = R.total ? Math.round(page / R.total * 100) : 0;
    const e = R.e; e.diary = [...(e.diary || []), { d: todayISO(), page, pct, text, fe }].slice(-200); save();
    if (text && N.vis !== 'me' && connected() && socialProfile) { // só o comentário escrito vai para a Rede; emoções sozinhas ficam no diário
      const names = fe.map((k) => (QT_FEELS.find((x) => x[0] === k) || [, k])[1]);
      sapi('POST', '/v1/posts', { kind: 'comment', text: (text || names.join(' · ')).slice(0, 280), feelings: fe.slice(0, 3), visibility: N.vis === 'friends' ? 'friends' : 'public', readerPct: Math.min(100, pct),
        book: { title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: /^https:\/\//.test(e.cover || '') ? e.cover : null },
        ...(N.sp ? (page > 0 && page < R.total ? { spoiler: { kind: 'page', at: page } } : page >= R.total ? { spoiler: { kind: 'end' } } : { spoiler: { kind: 'yes' } }) : {}) })
        .then((x) => { if (x.status === 201) toast('Comentário postado na Comunidade'); else if (x.status >= 400) toast('Salvo no seu diário (não deu para postar agora)'); }).catch(() => {});
    }
  }, true);
}
// "Minha leitura" mostra o diário do livro
{ const v = $('#shelflist'); let tm = 0;
  const paint = () => {
    const body = v.querySelector('.sl-body'); if (!body || v.hidden || !body.querySelector('.bp-stats') || body.querySelector('.dy-card')) return;
    const title = (body.querySelector('.bp-hero h2') || {}).textContent || '', e = lib().find((x) => normT(x.title) === normT(title)); if (!e || !(e.diary || []).length) return;
    const names = (fe) => (fe || []).map((k) => (QT_FEELS.find((x) => x[0] === k) || [, k])[1]).join(' · ');
    const card = document.createElement('section'); card.className = 'bp-card dy-card';
    card.innerHTML = `<div class="bp-row"><span>Diário de leitura</span></div><div class="dy">${[...e.diary].reverse().map((x) => `<div class="dy-it"><small>${fmt(x.d)} · pág. ${x.page} (${x.pct}%)</small>${x.fe && x.fe.length ? `<span class="dy-fe">${esc(names(x.fe))}</span>` : ''}${x.text ? `<p>${esc(x.text)}</p>` : ''}</div>`).join('')}</div>`;
    const first = body.querySelector('.bp-card'); if (first) first.after(card); else body.append(card);
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 80); }).observe(v, { childList: true, subtree: true });
}
