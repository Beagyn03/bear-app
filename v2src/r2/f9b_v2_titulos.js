// Título e Voltar das páginas que fugiam da regra (Bia, 20/11; protótipo: toda página interna tem Voltar e o próprio título).
// Reescrito: o Voltar e o título são decididos pela PÁGINA aberta, não pela linha .sl-top antiga, para não sumir ao trocar
// de aba interna (Busca Livros/Leitores, Avisos Notificações/Mensagens).
// - O topo (#g-t) é redesenhado às vezes (paintGtop) e nasce sem gancho: o gancho é posto de novo sempre que faltar.
// - Busca é reconhecida pelas abas Livros/Leitores (.ct-mode), que existem nas duas abas.
const v4Busca = () => { const v = TR.querySelector('#shelflist'); return !!(v && !v.hidden && v.querySelector('.sl-body > .ct-mode') && !v.querySelector('.ct-book, .au-hero, .bp-hero')); };
const v4Avisos = () => { const ed = TR.querySelector('#editor'), v = TR.querySelector('#shelflist'); return !!((ed && !ed.hidden && ed.classList.contains('ntpage')) || (v && !v.hidden && v.querySelector('.sl-body > .av-tabs'))); };
const v4PageTitle = () => (v4Avisos() ? 'Avisos' : v4Busca() ? 'Buscar' : '');
{ const td = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent');
  // 'was' = uma página com título próprio está aberta; enquanto isso, a escrita antiga da marca (syncTopTitle a cada 1,5 s,
  // às vezes num instante em que a página ainda não foi reconhecida) é ignorada. Só o fix() decide quando a página fechou.
  let was = false;
  // outro bloco (guarda do h0, mais abaixo no arquivo) também redefine o textContent do #g-t e apagava este gancho: por isso
  // o gancho é conferido pelo próprio setter (marca __v4) e reposto sempre que outro tomar o lugar.
  const hook = (t) => { if (!t) return; const d0 = Object.getOwnPropertyDescriptor(t, 'textContent'); if (d0 && d0.set && d0.set.__v4) return; t.dataset.v4t = '1'; const cl = t.classList, tog = t.__tog || cl.toggle;
    const setter = function (x) { const p = v4PageTitle() || (was ? td.get.call(this) : ''), y = p || x; if (td.get.call(this) === String(y == null ? '' : y)) return; td.set.call(this, y); }; setter.__v4 = true;
    Object.defineProperty(t, 'textContent', { configurable: true, get() { return td.get.call(this); }, set: setter });
    cl.toggle = function (c, f) { if (c === 'g-brand' && (was || v4PageTitle())) f = false; return tog.call(this, c, f); }; t.__tog = tog; };
  const fix = () => { const t = TR.querySelector('#g-t'); if (!t) return; hook(t); const p = v4PageTitle();
    if (p) { was = true; if (td.get.call(t) !== p) td.set.call(t, p); (t.__tog || DOMTokenList.prototype.toggle).call(t.classList, 'g-brand', false); }
    else if (was) { was = false; try { syncTopTitle(); } catch {} } };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; fix(); }, 60); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  fix(); setTimeout(fix, 2000); }
// Voltar no topo para páginas abertas como aba ou com abas internas (Estatísticas, Busca, Avisos) quando o Voltar geral não aparece
{ const st = document.createElement('style'); st.textContent = '.v4back2{display:inline-grid;place-items:center;width:36px;height:36px;border:0;background:none;color:var(--ink);margin-right:.15rem}.v4back2 svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'; TR.append(st);
  const need = () => { if (TR.querySelector('.gtop .v4back:not([hidden])')) return false; const v = TR.querySelector('#shelflist');
    if (v4Avisos() || v4Busca()) return true; return S.tab === 'progresso' && (!v || v.hidden); };
  const back = () => { if (v4Avisos()) { const ed = TR.querySelector('#editor'); if (ed && !ed.hidden && ed.classList.contains('ntpage')) { try { closeEd(); } catch {} return; } }
    const v = TR.querySelector('#shelflist'); if (v && !v.hidden) v.hidden = true; const to = S.v4lastTab || 'inicio'; try { goTab(to); } catch {}
    // o Você abre por cima (página do perfil) e não troca S.tab: sem isso o topo continuava "Estatísticas"
    if (to === 'eu' && S.tab === 'progresso') { S.tab = 'eu'; try { syncTopTitle(); } catch {} } };
  const sync = () => { const top = TR.querySelector('.gtop'); if (!top) return; let b = top.querySelector('.v4back2');
    if (need()) { if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'v4back2'; b.setAttribute('aria-label', 'Voltar'); b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>'; b.addEventListener('click', back); (top.querySelector('#g-t') || top.firstElementChild).before(b); } b.hidden = false; }
    else if (b) b.hidden = true; };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 70); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }
