// Folga do prazo só de propósito (Bia, 21/11: Nunca minta ficou com sex, sáb e dom de folga sem ela marcar; o cartão do Hoje
// mostrava "folga" em todos os dias e, ao mesmo tempo, "leia até a pág. 173 para bater a meta de hoje").
// Causa: no plano do "Quando quer terminar?", os cartões dos dias parecem botões de escolher o dia; um toque marca folga.
// 1) Tocar num dia não marca mais folga: é preciso ligar "Marcar folgas" (o texto muda para avisar que está no modo folga).
// 2) Nunca todos os dias restantes de folga: o toque que deixaria todos de folga é recusado com aviso.
// 3) Limpeza: livro cujo prazo tem todos os dias restantes de folga perde as folgas (o app já tratava assim no plano, mas o
//    Hoje, a semana e o calendário mostravam tudo de folga). Corrige também os dados que já ficaram assim.
const offAllRemaining = (e, off, due) => { if (!due || !off || !off.length) return false; const t = todayISO(); if (due < t) return false;
  for (let d = t; d <= due; d = new Date(Date.parse(d) + 864e5).toISOString().slice(0, 10)) if (!off.includes(new Date(d + 'T12:00:00Z').getUTCDay())) return false; return true; };
{ const SEL = '.dk[data-w], .dc-d[data-w], .dc-h[data-w]';
  const formOf = (el) => el.closest && el.closest('form');
  document.addEventListener('click', (ev) => {
    const card = ev.target.closest && ev.target.closest(SEL); if (!card) return; const f = formOf(card); if (!f || !f.querySelector('input[name=due]')) return;
    if (!f.dataset.folga) { ev.stopPropagation(); ev.preventDefault(); toast('Para marcar folga, toque em "Marcar folgas"'); return; }
    // simula o efeito do toque para recusar "todos de folga"
    const due = f.querySelector('input[name=due]').value, w = Number(card.dataset.w);
    let cur; try { cur = JSON.parse(f.dataset.off || '[]'); } catch { cur = []; }
    const next = cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w];
    if (offAllRemaining(null, next, due)) { ev.stopPropagation(); ev.preventDefault(); toast('Deixe pelo menos um dia de leitura até o prazo'); return; }
    f.dataset.off = JSON.stringify(next);
  }, true);
  const decorate = () => {
    document.querySelectorAll('form').forEach((f) => {
      const inp = f.querySelector('input[name=due]'); if (!inp) return;
      const hint = [...f.querySelectorAll('small.hint')].find((x) => /marcar folga|folga/i.test(x.textContent)); if (!hint || hint.dataset.v2folga) return;
      hint.dataset.v2folga = '1';
      if (!f.dataset.off) { try { const e = (window.__dueBook || null); f.dataset.off = JSON.stringify((e && e.dueOff) || []); } catch { f.dataset.off = '[]'; } }
      const b = document.createElement('button'); b.type = 'button'; b.className = 'lnk v2-folga-bt';
      b.style.cssText = 'margin:.3rem 0 0;font:inherit;font-weight:800;font-size:.84rem;color:var(--acc);background:none;border:0;padding:.5rem 0;min-height:40px;cursor:pointer';
      const paint = () => { b.textContent = f.dataset.folga ? 'Pronto, terminei de marcar' : 'Marcar folgas'; hint.textContent = f.dataset.folga ? 'Toque nos dias em que não vai ler (vale para esse dia da semana até o prazo).' : 'Dias de folga não contam no plano.'; };
      b.addEventListener('click', () => { if (f.dataset.folga) delete f.dataset.folga; else f.dataset.folga = '1'; paint(); });
      hint.after(b); paint();
    });
  };
  // guarda o livro da folha aberta para saber as folgas atuais
  const _ds = dueSheet; dueSheet = function (e) { window.__dueBook = e; const r = _ds.apply(this, arguments); setTimeout(decorate, 0); return r; };
  let raf = 0; new MutationObserver(() => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; decorate(); }); }).observe(document.body, { childList: true, subtree: true });
}
// limpeza: prazo com todos os dias restantes de folga → sem folga (e o lembrete reenviado)
{ const fix = () => { try { let n = 0; for (const e of lib()) if (e.dueAt && offAllRemaining(e, e.dueOff, e.dueAt)) { delete e.dueOff; if (e.remind) e.remind.sent = ''; n++; } if (n) save(); } catch {} };
  setTimeout(fix, 3000); setInterval(fix, 60000);
  // ao salvar o prazo, aplica na hora (a folha ignora "todos de folga" e mostrava o plano sem folga, mas gravava o dueOff antigo)
  document.addEventListener('submit', (ev) => { const f = ev.target; if (f && f.querySelector && f.querySelector('input[name=due]')) setTimeout(() => { fix(); try { const R = reading(); if (R && R.e && R.e.remind) { R.e.remind.sent = ''; } } catch {} }, 200); }, true); }
