// v2 Hoje refeito (Bia, 19/11, branch livroverso-2): a cara do protótipo com os dados reais.
//  - Topo: data + "Boa tarde, <nome>"; o livro atual grande dentro do anel de progresso, com a lua onde a leitura está.
//  - "Atualizar página" como botão principal (a sessão de leitura fica só no Ler do menu de baixo, 19/11), "•••" (o menu do livro de sempre). Vários livros em leitura: troca rápida.
//  - Embaixo, nesta ordem: prazo da semana (o cartão antigo enxuto), Pergunta do dia, Órbita + Meta lado a lado,
//    Qual leio agora + Na fila, e o resto (indicações, Comunidade…). O cartão grande "Lendo agora" e a "Próxima conquista" saem.
//  - A ordem vem do CSS (grid + order); Personalizar Hoje continua ligando e desligando as seções.
{ const st = document.createElement('style'); st.textContent = `
.v3-colA.v2h{display:grid!important;grid-template-columns:1fr 1fr;column-gap:.75rem;align-items:start}
.v3-colA.v2h > *{grid-column:1/-1;order:20;min-width:0}
.v3-colA.v2h > .v2hero{order:1}
.v3-colA.v2h > .v3-now{order:2}
.v3-colA.v2h > .v2-qd{order:3}
.v3-colA.v2h > .orb-row{display:contents}
.v3-colA.v2h > .orb-row > *{order:4;grid-column:auto;min-width:0;margin:0 0 var(--v2-gap)!important}
.v3-colA.v2h > .orb-row > .v2-conq{display:none!important}
.v3-colA.v2h > .v2-meta-t{order:5;grid-column:auto}
.v3-colA.v2h > .v2-meta-t.in-sec:not(.v2-solo){display:flex!important;flex-direction:column;align-items:flex-start;gap:.55rem;font-size:.82rem;padding:.8rem!important}
.v3-colA.v2h > .v2-meta-t:not(.v2-solo) > *{display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:.5rem!important;border:0!important;padding:0!important;margin:0!important;box-shadow:none!important;background:none!important;width:100%}
.v3-colA.v2h > .v2-meta-t:not(.v2-solo) *{white-space:normal}
.v3-colA.v2h > .v2-meta-t.in-sec:not(.v2-solo) button{margin:0!important;padding:.45rem .8rem!important;font-size:.78rem!important}
.v3-colA.v2h > .v2-solo,.v3-colA.v2h > .orb-row > .v2-solo{grid-column:1/-1!important}
.v3-colA.v2h > .v2-qn{order:6}
.v3-colA.v2h > .v2-fila{order:7}
.v3-colA.v2h > .v2-hide{display:none!important}
/* o cartão antigo vira só o prazo da semana */
.v3-colA.v2h > .v3-now > :not(.due-cards):not(.due-ln){display:none!important}
.v3-colA.v2h > .v3-now:not(:has(.due-cards)):not(:has(.due-ln)){display:none!important}
.v3-colA.v2h > .v3-now{padding:.75rem .85rem!important;margin-bottom:var(--v2-gap)!important}
.v3-colA.v2h > .v3-now .due-cards{border-top:0!important;padding-top:0!important;margin-top:0!important}
.v3-colA.v2h > .v3-now .due-cards > *{transform:scale(.92);transform-origin:top center}
.v3-colA.v2h > .v3-now::before{content:"Seu prazo";display:block;font-family:var(--v2-disp);font-weight:700;font-size:1rem;color:var(--ink);margin:0 0 .35rem}
/* herói */
.v2hero{position:relative;padding:.4rem .1rem 1rem;text-align:center}
.v2hero .eb{text-align:left;font-size:.68rem;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2)}
.v2hero h1{text-align:left;margin:.15rem 0 .6rem;font-family:var(--v2-disp);font-size:1.7rem;line-height:1.1;color:var(--ink)}
.v2hero .ring{position:relative;width:176px;height:176px;margin:.3rem auto .4rem;display:block;border:0;background:none;padding:0;cursor:pointer}
.v2hero .ring svg{position:absolute;inset:0}
.v2hero .ring .v2h-cv{position:absolute;left:50%;top:50%;width:76px;height:114px;transform:translate(-50%,-50%);border-radius:4px 7px 7px 4px;box-shadow:0 10px 24px rgba(40,20,5,.28);overflow:hidden;object-fit:cover}
.v2hero .ring .moon{position:absolute;width:15px;height:15px;margin:-7.5px 0 0 -7.5px;border-radius:50%;background:#e0ad3a;border:3px solid var(--bg,#fbf6ee);box-shadow:0 0 0 1.5px #e0ad3a,0 0 10px rgba(224,173,58,.7)}
.v2hero .bt{display:block;font-family:var(--v2-disp);font-size:1.25rem;font-weight:700;line-height:1.2;color:var(--ink);margin:.2rem auto 0;max-width:300px}
.v2hero .au{display:block;font-size:.8rem;color:var(--ink-2);font-weight:700;margin-top:.1rem}
.v2hero .pg{display:block;font-size:.8rem;color:var(--ink-2);font-weight:800;margin-top:.3rem;font-variant-numeric:tabular-nums}
.v2hero .due{display:inline-flex;align-items:center;gap:.35rem;margin-top:.45rem;padding:.3rem .7rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc);font-size:.76rem;font-weight:900}
.v2hero .acts{display:flex;justify-content:center;align-items:center;gap:.45rem;margin-top:.85rem}
.v2hero .go{border:0;border-radius:16px;background:linear-gradient(135deg,#e9a35c,#c46f2e);color:#fff;font:inherit;font-weight:900;font-size:.92rem;padding:.6rem 1.05rem;white-space:nowrap;box-shadow:0 6px 16px rgba(196,111,46,.3);display:inline-flex;align-items:center;gap:.4rem}
.v2hero .go svg{width:18px;height:18px}
.v2hero .lk{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.84rem;text-decoration:underline;text-underline-offset:3px}
.v2hero .mo{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);display:grid;place-items:center;padding:0}
.v2hero .mo svg{width:20px;height:20px}
.v2hero .sw{display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-top:.9rem}
.v2hero .sw small{width:100%;font-size:.68rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
.v2hero .sw button{display:inline-flex;align-items:center;gap:.4rem;max-width:170px;border:1px solid var(--line);background:var(--panel);border-radius:99px;padding:.25rem .7rem .25rem .25rem;font:inherit;font-size:.76rem;font-weight:800;color:var(--ink)}
.v2hero .sw button .v2h-mini{width:24px;height:36px;border-radius:3px;flex:none;overflow:hidden;object-fit:cover}
.v2hero .sw button span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v2hero .empty{margin:.6rem auto 0;max-width:300px;padding:1.2rem 1rem;border:1.5px dashed var(--line);border-radius:var(--v2-r)}
.v2hero .empty b{display:block;font-family:var(--v2-disp);font-size:1.15rem;color:var(--ink)}
.v2hero .empty p{margin:.3rem 0 .8rem;font-size:.82rem;color:var(--ink-2)}
`; TR.append(st); }
Object.assign(V2I, { pag: '<path class="d" d="M6 3.5h9l3.5 3.5v13.5H6z"/><path d="M6 3.5h9l3.5 3.5v13.5H6zM15 3.5V7h3.5M9 12h6M9 15.5h4"/>', ok: '<circle class="d" cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.8 2.8L16.5 9"/>', junto: '<circle class="d" cx="9" cy="8" r="3.5"/><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.9-3.4 3.6-5 6.5-5s5.6 1.6 6.5 5M18 8v6M15 11h6"/>' });
const V2H_DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function v2hGreet() { const h = new Date().getHours(); return h < 5 || h >= 18 ? 'Boa noite' : h < 12 ? 'Bom dia' : 'Boa tarde'; }
function v2hName() { const n = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || (NAME && NAME !== 'Você' ? NAME : ''); return String(n || '').trim().split(/\s+/)[0]; }
function v2hDate() { try { return new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); } catch { return todayISO(); } }
function v2hModel() {
  const R = reading(), off = (() => { try { return homePrefs().off; } catch { return []; } })();
  const others = lib().filter((x) => x.status === 'LENDO' && (!R || x.id !== R.e.id)).slice(0, 4);
  let due = null; if (R && R.e.dueAt) { try { const d = dueToday(R.e); if (d) { const dd = new Date(R.e.dueAt + 'T12:00:00Z'); due = `Prazo: ${V2H_DOW[dd.getUTCDay()].slice(0, 3)}, ${R.e.dueAt.slice(8, 10)}/${R.e.dueAt.slice(5, 7)} · ${d.todayOff ? 'hoje é folga' : d.per + (d.per === 1 ? ' página' : ' páginas') + ' por dia'}`; } } catch {} }
  const ses = (() => { try { return v2SesGet(); } catch { return null; } })();
  return { R, others: off.includes('tambem') ? [] : others, due, ses: !!(ses && R && ses.libId === R.e.id), name: v2hName() };
}
function v2hHTML(m) {
  const head = `<div class="eb">${esc(v2hDate())}</div><h1>${v2hGreet()}${m.name ? ', ' + esc(m.name) : ''}</h1>`;
  if (!m.R) return `<section class="v2hero">${head}<div class="empty"><b>Escolha sua próxima leitura</b><p>Nenhum livro em leitura agora.</p><button type="button" class="go" data-h="pick">Qual leio agora?</button></div></section>`;
  const { e, now, total, pct } = m.R, p = total ? Math.min(1, now / total) : 0, a = p * 2 * Math.PI - Math.PI / 2, mx = 88 + 78 * Math.cos(a), my = 88 + 78 * Math.sin(a);
  return `<section class="v2hero">${head}
    <button type="button" class="ring" data-h="book" aria-label="Abrir ${esc(e.title)}"><svg viewBox="0 0 176 176"><circle cx="88" cy="88" r="78" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="88" cy="88" r="78" fill="none" stroke="#c46f2e" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(p * 490.1).toFixed(1)} 491" transform="rotate(-90 88 88)"/></svg>
      ${cvh(e.title, e.cover, 'v2h-cv')}<span class="moon" style="left:${mx.toFixed(1)}px;top:${my.toFixed(1)}px"></span></button>
    <b class="bt">${esc(e.title)}</b>${e.author ? `<span class="au">${esc(e.author)}</span>` : ''}
    ${total ? `<span class="pg">pág. ${now} de ${total} · ${pct}% lido</span>` : ''}
    ${m.due ? `<span class="due">${esc(m.due)}</span>` : ''}
    <div class="acts"><button type="button" class="go" data-h="upd" aria-label="Atualizar página">${V2SVG('pag', 18)}Atualizar</button><button type="button" class="mo" data-h="fim" aria-label="Concluir: terminei o livro" title="Concluir">${V2SVG('ok', 20)}</button><button type="button" class="mo" data-h="inv" aria-label="Convidar para ler junto" title="Ler junto">${V2SVG('junto', 20)}</button><button type="button" class="mo" data-h="more" aria-label="Mais opções do livro">${V2SVG('dots', 20)}</button></div>
    ${m.others.length ? `<div class="sw"><small>Também lendo</small>${m.others.map((x) => `<button type="button" data-h="sw" data-id="${esc(x.id)}">${cvh(x.title, x.cover, 'v2h-mini')}<span>${esc(x.title)}</span></button>`).join('')}</div>` : ''}
  </section>`;
}
function v2hBind(h) {
  h.addEventListener('click', (ev) => { const b = ev.target.closest('[data-h]'); if (!b) return; ev.stopPropagation(); const k = b.dataset.h, R = reading();
    if (k === 'book' && R) return openBookPage(R.e);
    if (k === 'ler' && R) { try { return v2SesGet() ? v2Ler() : v2SesStart(R.e); } catch { return v2Ler(); } }
    if (k === 'upd' && R) { if (S.madrugada) return wakeBear('upd'); return editLeitura(); }
    if (k === 'more' && R) return bookQuickMenu(b, { e: R.e, title: R.e.title });
    if (k === 'fim' && R) { if (typeof statusSheet === 'function') return statusSheet(R.e, 'LIDO'); const q = TR.querySelector('.v3-now [data-q=fim]'); return q && q.click(); }
    if (k === 'inv' && R) { const q = TR.querySelector('.v3-now .v3-inv-ic'); if (q) return q.click(); return bookQuickMenu(b, { e: R.e, title: R.e.title }); }
    if (k === 'sw') { setCurrent(b.dataset.id); try { renderHome(todayISO()); } catch {} return; }
    if (k === 'pick') { const q = TR.querySelector('.v2-qn'); if (q) return q.click(); return goTab('estante'); }
  });
}
{ let tm = 0, busy = false;
  const mark = (col) => {
    col.classList.add('v2h');
    col.querySelectorAll(':scope > .orb-row > *').forEach((c) => { if (/Próxima conquista/.test(c.textContent)) c.classList.add('v2-conq'); });
    [...col.children].forEach((c) => { const t = c.textContent.trim();
      if ((c.id === 'ini-meta' || (c.classList.contains('in-sec') && /Quantos livros|meta/i.test(t)))) c.classList.add('v2-meta-t');
      if (c.classList.contains('v3-sh') && /^Também lendo/.test(t)) { c.classList.add('v2-hide'); const n = c.nextElementSibling; if (n && n.classList.contains('es-row')) n.classList.add('v2-hide'); }
      if (c.classList.contains('yo-fsh')) { c.classList.add('v2-fila'); const n = c.nextElementSibling; if (n && n.classList.contains('es-row')) n.classList.add('v2-fila'); } });
    // Órbita e Meta lado a lado; se só existir um, ocupa a linha toda
    const orb = [...col.querySelectorAll(':scope > .orb-row > *')].filter((c) => !c.classList.contains('v2-conq') && getComputedStyle(c).display !== 'none');
    const meta = col.querySelector(':scope > .v2-meta-t');
    // meta do ano com capas precisa da linha inteira; lado a lado só o convite curto (19/11)
    const solo = (orb.length + (meta ? 1 : 0)) === 1 || !!(meta && meta.id === 'ini-meta'); [...orb, meta].filter(Boolean).forEach((c) => c.classList.toggle('v2-solo', solo));
  };
  const put = () => { if (busy) return; const col = TR.querySelector('.v3-colA'); if (!col || !col.querySelector(':scope > .v3-now')) return; busy = true;
    try { mark(col); const m = v2hModel(), html = v2hHTML(m), key = html.length + '|' + html.slice(0, 40) + (m.R ? m.R.e.id + m.R.now + m.R.total : '') + m.due + m.ses + m.others.map((x) => x.id).join(',');
      let h = col.querySelector(':scope > .v2hero');
      if (!h || h.dataset.k !== key) { const w = document.createElement('div'); w.innerHTML = html; const n = w.firstElementChild; n.dataset.k = key; v2hBind(n); if (h) h.replaceWith(n); else col.prepend(n); paintCv(n); }
    } finally { busy = false; } };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 50); }).observe(TR, { childList: true, subtree: true }); setTimeout(put, 900); }
