// Avaliar um livro que ainda não está como Lido (Bia, 17/11): quem avalia normalmente acabou de parar de ler.
// Pergunta como terminou: Terminei (data de hoje, livro vai a 100% e vira Lido), Abandonei (data de hoje como "Parei em",
// mantém a página e vira Abandonado) ou Ainda estou lendo (não mexe em nada).
{ const st = document.createElement('style'); st.textContent = `
.rtf-end{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin:.2rem 0 .7rem}
.rtf-end button{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:12px;padding:.55rem .3rem;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer;line-height:1.15}
.rtf-end button small{display:block;font-size:.66rem;font-weight:600;color:var(--ink-2);margin-top:.1rem}
.rtf-end button.on[data-v=fim]{border-color:#2f8a52;background:color-mix(in srgb,#2f8a52 16%,var(--panel))}
.rtf-end button.on[data-v=ab]{border-color:#c0392b;background:color-mix(in srgb,#c0392b 14%,var(--panel))}
.rtf-end button.on[data-v=lendo]{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,var(--panel))}`; document.head.append(st); }
{ const _rf = rateForm; rateForm = function (b) {
    const r = _rf.apply(this, arguments);
    try {
      const e = lib().find((x) => x === b || x.id === b.id); if (!e || e.status === 'LIDO' || e.status === 'ABANDONEI') return r;
      const wrap = [...document.querySelectorAll('body > .sheet')].pop(), form = wrap && wrap.querySelector('form'); if (!form) return r;
      const dEnd = form.querySelector('input[name=fim]'), dLbl = dEnd && dEnd.closest('label'); if (!dEnd) return r;
      const lblTxt = (t) => { for (const n of dLbl.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { n.textContent = t; return; } };
      const info = (() => { try { return readingInfo(e); } catch { return { now: 0, total: 0 }; } })();
      const pick = document.createElement('div'); pick.className = 'rtf-end'; pick.setAttribute('role', 'group'); pick.setAttribute('aria-label', 'Como terminou a leitura');
      pick.innerHTML = '<button type="button" data-v="fim">Terminei<small>vai para 100%</small></button><button type="button" data-v="ab">Abandonei<small>parei na pág. ' + (info.now || 0) + '</small></button>';
      let choice = 'fim'; const today = todayISO();
      const paint = () => { pick.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x.dataset.v === choice));
        if (choice === 'lendo') { lblTxt('Terminei em'); if (dEnd.value === today && !e.finishedAt) dEnd.value = ''; dLbl.style.opacity = '.45'; }
        else { lblTxt(choice === 'ab' ? 'Parei em' : 'Terminei em'); if (!dEnd.value) dEnd.value = today; dLbl.style.opacity = ''; } };
      pick.querySelectorAll('button').forEach((x) => x.addEventListener('click', () => { choice = x.dataset.v; paint(); }));
      const dates = dEnd.closest('.rate-dates') || dLbl.parentElement; dates.before(pick); paint();
      form.addEventListener('submit', () => { // roda depois do salvar original (que já guardou datas e avaliação)
        try {
          const when = dEnd.value || today;
          if (choice === 'fim') {
            const tot = Number(e.totalPages) || info.total || 0, now = Number(e.currentPage) || info.now || 0;
            if (tot && now < tot) { e.readLog = [...(e.readLog || []), { id: uid(), date: today, pages: tot - now }]; e.currentPage = tot; }
            setLibStatus(e, 'LIDO'); e.finishedAt = when;
          } else if (choice === 'ab') { setLibStatus(e, 'ABANDONEI'); e.abandonedAt = when; delete e.finishedAt; }
          if (choice !== 'lendo') { save(); try { renderHome(todayISO()); } catch {} try { refresh(); } catch {} }
        } catch (err) { console.warn('como terminou', err); }
      });
    } catch (err) { console.warn('avaliar: como terminou', err); }
    return r;
  }; }
