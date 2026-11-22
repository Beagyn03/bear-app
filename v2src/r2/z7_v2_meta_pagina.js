// Página de uma meta com prazo no padrão v2 (Bia, 22/11): abria a tela antiga, com "‹ Metas", a marca e o avatar no topo,
// as abas antigas e sem a barra de baixo. As funções dessa tela (registrar, livros, calendário, ajustes) moram no app antigo,
// fora da camada v2, e dependem dos estilos de lá; por isso a tela continua sendo a mesma, mas ganha a moldura v2:
// topo com "‹" e o nome da meta (como as páginas internas), a barra de baixo da v2 (uma cópia, que leva para a aba tocada),
// e Voltar/voltar do celular levam de volta para Metas.
{
  const D = document, body = D.body;
  const css = D.createElement('style'); css.textContent = `
body.v11meta > main .topbar .brand,body.v11meta #home-gear,body.v11meta #sync-status,body.v11meta #toca-back,body.v11meta #htabs,body.v11meta #g-title{display:none!important}
body.v11meta > main .topbar{position:sticky;top:0;z-index:30;display:flex;align-items:center;min-height:56px;padding:.35rem .2rem;margin-bottom:.6rem;background:var(--bg);border-bottom:1px solid var(--line)}
body.v11meta #nav{display:flex!important;align-items:center;gap:.25rem;min-width:0;flex:1}
body.v11meta #back{background:none!important;border:0!important;box-shadow:none!important;min-width:44px;min-height:44px;font-size:1.6rem;line-height:1;padding:0 .4rem;color:var(--ink)}
body.v11meta #v11gt{font-family:'Noto Serif',Georgia,serif;font-weight:800;font-size:1.2rem;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
html[data-theme="dark"] body.v11meta #v-goal .bar{background:color-mix(in srgb,var(--ink) 16%,transparent)}
body.v11meta > main{padding-bottom:calc(96px + env(safe-area-inset-bottom,0px))!important}
#v11tbh{display:none}body.v11meta #v11tbh{display:block;position:fixed;left:0;right:0;bottom:0;z-index:40}`;
  D.head.append(css);
  let on = false, tbh = null, mk = null, after = null, fromTab = '';
  // a aba marcada na hora do toque que abriu a meta (a lista de Metas some antes da meta abrir)
  window.addEventListener('click', (ev) => { const t = ev.composedPath ? ev.composedPath()[0] : ev.target; if (t && t.closest && t.closest('[data-mt="goal"]')) { const o = TR.querySelector('#tabbar .on[data-tab]'); fromTab = o ? o.dataset.tab : ''; } }, true);
  const bar = () => {
    const src = TR.querySelector('#tabbar'); if (!src) return;
    if (!tbh) { tbh = D.createElement('div'); tbh.id = 'v11tbh'; body.append(tbh); const sr = tbh.attachShadow({ mode: 'open' });
      // os mesmos estilos da camada v2, para a barra ficar idêntica
      sr.innerHTML = [...TR.querySelectorAll('style')].map((s) => '<style>' + s.textContent + '</style>').join('') + '<div class="v11w"></div>';
      sr.addEventListener('click', (ev) => { const b = ev.target.closest('[data-tab]'); if (!b) return; ev.preventDefault(); ev.stopPropagation(); const k = b.dataset.tab; exitTo(() => go(k)); }); }
    const w = tbh.shadowRoot.querySelector('.v11w'); w.innerHTML = ''; const c = src.cloneNode(true); w.append(c);
    // a barra marca a aba de onde a meta foi aberta
    const from = fromTab || S.tab; c.querySelectorAll('[data-tab]').forEach((b) => { const k = b.dataset.tab === from; b.classList.toggle('on', k); b.setAttribute('aria-current', String(k)); });
  };
  const leave = () => { if (!on) return; on = false; body.classList.remove('v11meta');
    const b = D.querySelector('#back'); if (b) { b.textContent = '‹ Metas'; b.removeAttribute('aria-label'); }
    D.querySelector('#v11gt')?.remove(); try { show('goals'); } catch {} };
  const toMetas = () => { leave(); body.classList.add('at-home'); try { openMetasV2(); } catch {} };
  const go = (tab) => { leave(); body.classList.add('at-home'); setTimeout(() => { const t = TR.querySelector('#tabbar [data-tab="' + tab + '"]'); if (t) t.click(); }, 0); };
  const enter = (g) => {
    on = true; body.classList.add('v11meta'); body.classList.remove('at-home');
    const b = D.querySelector('#back'); if (b) { b.textContent = '‹'; b.setAttribute('aria-label', 'Voltar para Metas'); }
    let t = D.querySelector('#v11gt'); if (!t) { t = D.createElement('span'); t.id = 'v11gt'; D.querySelector('#nav')?.append(t); } t.textContent = g.name || 'Meta';
    bar(); window.scrollTo(0, 0);
    // conta como uma camada para o voltar do celular (o app conta "body > .sheet"): voltar tira a marca e volta para Metas
    if (!mk || !mk.isConnected) { mk = D.createElement('div'); mk.className = 'sheet v11mk'; mk.hidden = true; mk.style.display = 'none'; body.append(mk); }
  };
  const _open = open;
  open = function (g) { const r = _open.apply(this, arguments); try { if (g) enter(g); } catch (e) { console.warn('página da meta', e); } return r; };
  // Voltar do topo, voltar do celular e a barra de baixo: todos tiram a marca; quem tirou decide para onde ir
  new MutationObserver(() => { if (on && mk && !mk.isConnected) { const f = after; after = null; mk = null; if (f) f(); else toMetas(); } }).observe(body, { childList: true });
  const exitTo = (f) => { after = f; if (mk && mk.isConnected) mk.remove(); else { after = null; f(); } };
  D.addEventListener('click', (ev) => { if (on && ev.target.closest && ev.target.closest('#back')) { ev.stopImmediatePropagation(); ev.preventDefault(); exitTo(toMetas); } }, true);
}
