// Título e Voltar das páginas que fugiam da regra (Bia, 20/11; protótipo: toda página interna tem Voltar e o próprio título):
// - Busca e Avisos mostravam a marca no topo: o título antigo (syncTopTitle) não sabe delas. Aqui o próprio elemento do
//   título troca a marca pelo nome da página enquanto ela estiver aberta (sem brigar com o temporizador antigo).
// - Estatísticas (aba "progresso") e Busca ganham o Voltar do topo.
{ const pageTitle = () => {
    const v = TR.querySelector('#shelflist'), ed = TR.querySelector('#editor');
    if (ed && !ed.hidden && ed.classList.contains('ntpage')) return 'Avisos';
    if (v && !v.hidden && v.querySelector('.sl-body > .ct-form') && !v.querySelector('.ct-book, .au-hero, .bp-hero')) return 'Buscar';
    return '';
  };
  const hook = () => { const t = TR.querySelector('#g-t'); if (!t || t.dataset.v4t) return; t.dataset.v4t = '1';
    const td = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent'), cl = t.classList, tog = cl.toggle;
    Object.defineProperty(t, 'textContent', { configurable: true, get() { return td.get.call(this); }, set(x) { const p = pageTitle(); td.set.call(this, p || x); } });
    cl.toggle = function (c, f) { if (c === 'g-brand' && pageTitle()) f = false; return tog.call(this, c, f); };
    let was = false; const fix = () => { const p = pageTitle(); if (p) { was = true; if (td.get.call(t) !== p) td.set.call(t, p); tog.call(cl, 'g-brand', false); } else if (was) { was = false; try { syncTopTitle(); } catch {} } };
    let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; fix(); }, 80); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); fix(); };
  hook(); setTimeout(hook, 1000); }
// Voltar no topo para Estatísticas e Busca (abertas como aba, sem a linha de voltar própria)
{ const st = document.createElement('style'); st.textContent = '.v4back2{display:inline-grid;place-items:center;width:36px;height:36px;border:0;background:none;color:var(--ink);margin-right:.15rem}.v4back2 svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}'; TR.append(st);
  const need = () => { const v = TR.querySelector('#shelflist'), main = !!TR.querySelector('.gtop .v4back:not([hidden])'); if (main) return false;
    if (S.tab === 'progresso' && (!v || v.hidden)) return true;
    return !!(v && !v.hidden && v.querySelector('.sl-body > .ct-form') && !v.querySelector('.ct-book, .au-hero, .bp-hero')); };
  const sync = () => { const top = TR.querySelector('.gtop'); if (!top) return; let b = top.querySelector('.v4back2');
    if (need()) { if (!b) { b = document.createElement('button'); b.type = 'button'; b.className = 'v4back2'; b.setAttribute('aria-label', 'Voltar'); b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
        b.addEventListener('click', () => { const v = TR.querySelector('#shelflist'); if (v && !v.hidden) v.hidden = true; try { goTab(S.v4lastTab || 'inicio'); } catch {} }); (top.querySelector('#g-t') || top.firstElementChild).before(b); } b.hidden = false; }
    else if (b) b.hidden = true; };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 70); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }
