// Tour guiado (Bia, 21/11; protótipo v170): cada etapa dos Primeiros passos abre um caminho nas telas REAIS do app, com um
// balão por elemento (aponta o próprio elemento, cita só o que está na tela), "passo X de N", "Pular" (marca a etapa como
// pulada) e × (sai). Nunca para sem o próximo balão: se o elemento não aparecer, o balão fica solto com "Continuar".
// Esc sai; foco vai para o balão; sem animação quando o sistema pede menos movimento.
{ const st = document.createElement('style'); st.textContent = `
.ppring{position:fixed;z-index:2147482995;pointer-events:none;border:2.5px solid var(--ppacc,#e0a060);border-radius:14px;box-shadow:0 0 0 4px color-mix(in srgb,var(--ppacc,#e0a060) 25%,transparent)}
.ppbal{position:fixed;z-index:2147482996;left:12px;right:12px;max-width:440px;margin:0 auto;padding:14px 14px 12px;border-radius:18px;border:1px solid var(--ppline,#3a3150);background:var(--pppan,#1f1a2e);color:var(--ppink,#f3ecff);font-family:system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.35)}
.ppbal .top{display:flex;align-items:center;gap:8px}.ppbal .pn{flex:1;font-size:.74rem;font-weight:900;letter-spacing:.04em;color:var(--ppink2,#b9aecf)}
.ppbal .x{width:40px;height:40px;border:0;background:none;color:inherit;display:grid;place-items:center;cursor:pointer;margin:-8px -6px -8px 0}
.ppbal svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round}
.ppbal .pb{height:4px;border-radius:9px;background:color-mix(in srgb,var(--ppink,#fff) 12%,transparent);margin:8px 0 10px;overflow:hidden}.ppbal .pb i{display:block;height:100%;background:var(--ppacc,#e0a060)}
.ppbal b{display:block;font-size:1.05rem;line-height:1.25}.ppbal p{margin:4px 0 0;font-size:.9rem;line-height:1.4;color:var(--ppink2,#cfc4e3)}
.ppbal .bt{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:10px;flex-wrap:wrap}
.ppbal .bt button{min-height:42px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--ppline,#3a3150);background:none;color:inherit;font:inherit;font-weight:800;font-size:.88rem;cursor:pointer}
.ppbal .bt button.p{background:var(--ppacc,#e0a060);border-color:var(--ppacc,#e0a060);color:var(--ppon,#2a1709)}
.ppbal .bt .sk{border:0;padding:0 .4rem;margin-right:auto;color:var(--ppink2,#b9aecf);text-decoration:underline;font-weight:700}
.ppbal .ar{position:absolute;width:14px;height:14px;background:inherit;border-left:1px solid var(--ppline,#3a3150);border-top:1px solid var(--ppline,#3a3150);transform:rotate(45deg)}
.ppbal.dn .ar{top:-8px}.ppbal.up .ar{bottom:-8px;transform:rotate(225deg)}
@media (prefers-reduced-motion: no-preference){.ppbal{animation:ppbIn .22s ease both}@keyframes ppbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}}
`; document.head.append(st); }
var ppG = null; // caminho guiado em andamento
// procura nos lugares onde o app desenha: documento, interface principal e as telas v4/v5/v6 (shadow roots internos)
function ppRoots() { const R = [document, TR]; try { TR.querySelectorAll('*').forEach((x) => { if (x.shadowRoot) R.push(x.shadowRoot); }); } catch {} return R; }
const ppVis = (x) => { if (!x || !x.isConnected || (x.closest && x.closest('#lista.v3-wait, #lista.v3-back, .lista-snap'))) return false; const r = x.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(x); return cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight; };
function ppFind(sel, txt) { for (const r of ppRoots()) { let L; try { L = r.querySelectorAll(sel); } catch { continue; }
    for (const x of L) { if (x.closest && x.closest('.ppbal')) continue; if (txt && !(txt instanceof RegExp ? txt.test(x.textContent) : x.textContent.includes(txt))) continue; if (ppVis(x)) return x; } } return null; }
function ppClose() { document.querySelectorAll('.ppbal,.ppring').forEach((x) => x.remove()); if (ppClose.raf) cancelAnimationFrame(ppClose.raf); ppClose.raf = 0; }
// um balão: { t, x, el?, n?, N?, btns:[[label, fn, pri?]], skip?, onX?, solo? }
function ppBalloon(o) {
  ppClose(); const b = document.createElement('div'); b.className = 'ppbal'; b.setAttribute('role', 'dialog'); b.setAttribute('aria-label', o.t); ppVars(b);
  b.innerHTML = `${o.N ? `<div class="top"><span class="pn">passo ${o.n} de ${o.N}</span><button type="button" class="x" aria-label="Sair do guia">${v4ic('x', 18)}</button></div><div class="pb"><i style="width:${Math.round((o.n / o.N) * 100)}%"></i></div>` : ''}
    <b>${esc(o.t)}</b><p>${esc(o.x)}</p><div class="bt">${o.skip ? '<button type="button" class="sk">Pular</button>' : ''}${(o.btns || []).map(([l], i) => `<button type="button" data-i="${i}" class="${i === (o.btns.length - 1) ? 'p' : ''}">${esc(l)}</button>`).join('')}</div><i class="ar" aria-hidden="true"></i>`;
  b.addEventListener('click', (ev) => { const t = ev.target.closest('button'); if (!t) return; ev.stopPropagation();
    if (t.classList.contains('x')) return (o.onX || ppClose)(); if (t.classList.contains('sk')) return o.skip();
    const f = o.btns[+t.dataset.i]; if (f) f[1](); });
  document.body.append(b);
  const el = o.el, place = () => { if (!b.isConnected) return; const H = innerHeight, bh = b.offsetHeight;
    if (!el || !el.isConnected) { b.style.top = Math.max(12, H - bh - 96) + 'px'; b.classList.remove('up', 'dn'); b.querySelector('.ar').hidden = true; return; }
    const r = el.getBoundingClientRect(); let ring = document.querySelector('.ppring'); if (!ring) { ring = document.createElement('div'); ring.className = 'ppring'; ppVars(ring); document.body.append(ring); }
    const L = Math.max(4, r.left - 4), T = Math.max(4, r.top - 4), W = Math.min(innerWidth - 4, r.right + 4) - L, Hh = Math.min(H - 4, r.bottom + 4) - T;
    Object.assign(ring.style, { left: L + 'px', top: T + 'px', width: Math.max(0, W) + 'px', height: Math.max(0, Hh) + 'px' });
    const below = r.bottom + 14 + bh < H - 8 || r.top - 14 - bh < 8; const top = below ? Math.min(H - bh - 8, r.bottom + 14) : r.top - 14 - bh;
    b.style.top = Math.max(8, top) + 'px'; b.classList.toggle('dn', below); b.classList.toggle('up', !below);
    const br = b.getBoundingClientRect(), ar = b.querySelector('.ar'); ar.hidden = false; ar.style.left = Math.min(Math.max(r.left + r.width / 2 - br.left - 7, 16), br.width - 30) + 'px'; };
  if (el) { try { const r = el.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight - 120) el.scrollIntoView({ block: 'center' }); } catch {} }
  const loop = () => { place(); ppClose.raf = requestAnimationFrame(loop); }; loop();
  if (!o.solo) setTimeout(() => { const f = b.querySelector('.bt button.p') || b.querySelector('.x'); if (f) f.focus({ preventScroll: true }); }, 30);
  return b;
}
document.addEventListener('keydown', (ev) => { if (ev.key !== 'Escape' || !document.querySelector('.ppbal')) return; ev.stopPropagation(); if (ppG) ppStop(); else ppClose(); }, true);
// toque no elemento destacado avança o passo
document.addEventListener('click', (ev) => { if (!ppG || !ppG.tapEl) return; const path = ev.composedPath ? ev.composedPath() : []; if (path.includes(ppG.tapEl)) { const g = ppG, i = g.i; g.tapEl = null; setTimeout(() => { if (ppG === g && g.i === i) ppNext(); }, 450); } }, true);
document.addEventListener('contextmenu', (ev) => { if (!ppG || !ppG.tapEl || !ppG.hold) return; const path = ev.composedPath ? ev.composedPath() : []; if (path.includes(ppG.tapEl)) { const g = ppG, i = g.i; g.tapEl = null; setTimeout(() => { if (ppG === g && g.i === i) ppNext(); }, 450); } }, true);
function ppStop() { if (ppG && ppG.tm) clearInterval(ppG.tm); ppG = null; ppClose(); }
function ppFinish(how) { const g = ppG; ppStop(); if (!g) return; if (g.stage) ppDone(g.stage, how === 'skip' ? 'skip' : undefined);
  if (how !== 'skip' && g.then) { setTimeout(() => ppGuide(g.then, g.thenStage || g.stage), 500); return; }
  try { goTab('inicio'); } catch {} if (how !== 'skip') toast('Etapa concluída'); }
function ppNext() { if (!ppG) return; ppG.i++; ppStep(); }
function ppStep() {
  const g = ppG; if (!g) return; if (g.tm) { clearInterval(g.tm); g.tm = 0; } ppClose();
  const s = g.steps[g.i]; if (!s) return ppFinish();
  try { s.go && s.go(); } catch (e) { console.warn('guia', e); }
  const N = g.steps.filter((x) => !x.hidden).length, n = g.steps.slice(0, g.i + 1).filter((x) => !x.hidden).length;
  let waited = 0, shown = null;
  const show = (el) => { const btns = (s.btns || (s.adv === 'btn' ? [[s.btn || 'Continuar', () => ppNext()]] : [])).map(([l, f]) => [l, f === 'next' ? () => ppNext() : f]);
    if (!el && !btns.length) btns.push(['Continuar', () => ppNext()]);
    shown = ppBalloon({ t: s.t, x: s.x, el, n, N, btns, skip: () => ppFinish('skip'), onX: () => ppStop() });
    g.tapEl = el && !s.adv ? el : null; g.hold = !!s.hold; };
  const tick = () => { if (ppG !== g) return clearInterval(g.tm);
    if (s.until && (() => { try { return s.until(); } catch { return false; } })()) { clearInterval(g.tm); g.tm = 0; return ppNext(); }
    const el = s.sel ? (typeof s.sel === 'function' ? s.sel() : ppFind(s.sel, s.txt)) : null;
    if (el) { if (!shown || g.cur !== el) { g.cur = el; show(el); } return; }
    waited += 300;
    if (shown && g.cur && !g.cur.isConnected) { g.cur = null; shown = null; }
    if (!shown && (!s.sel || waited >= (s.opt ? 1200 : 3500))) { if (!s.sel && s.hidden) return; if (s.opt && s.sel && waited < 2500) return; if (s.opt && s.sel) { clearInterval(g.tm); g.tm = 0; return ppNext(); } g.cur = null; show(null); } };
  g.cur = null; g.tm = setInterval(tick, 300); tick();
}
// ---------- caminhos ----------
const ppTab = (t) => { try { if (S.tab !== t) goTab(t); } catch {} };
const ppLibN = () => { try { return lib().length; } catch { return 0; } };
const ppHas = (st) => { try { return lib().some((e) => e.status === st); } catch { return false; } };
function ppImportPage() { // a tela "Trazer de outro app" com o texto aprovado fixo (Bia, 21/11)
  const ov = document.createElement('div'); ov.className = 'ppab ppimp'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Trazer de outro app'); ppVars(ov);
  ov.style.cssText += ';place-items:start center';
  ov.innerHTML = `<div class="in" style="text-align:left;justify-items:stretch;padding-top:calc(18px + env(safe-area-inset-top))">
    <div style="display:flex;align-items:center;gap:8px"><button type="button" data-x aria-label="Voltar" style="width:44px;height:44px;border:0;background:none;color:inherit;cursor:pointer;display:grid;place-items:center">${v4ic('back', 20)}</button><h2 style="flex:1;font-size:1.3rem">Trazer de outro app</h2></div>
    <p>Apps de leitura deixam baixar seu histórico de leitura num arquivo (.csv). No Goodreads, pelo site no computador: My Books › Import and export › Export Library. Em outros apps, procure por exportar nas configurações. Depois é só voltar aqui e selecionar o arquivo baixado.</p>
    <a href="https://www.goodreads.com/review/import" target="_blank" rel="noopener" style="color:var(--ppacc);font-weight:800">Abrir o Goodreads</a>
    <button type="button" class="ok" data-f>Escolher o arquivo</button></div>`;
  ov.querySelectorAll('svg').forEach((s) => { s.style.cssText += ';width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:1.9'; });
  ov.querySelector('[data-x]').addEventListener('click', () => { ov.remove(); if (ppG && ppG.id === 'imp') ppStop(); });
  ov.querySelector('[data-f]').addEventListener('click', () => { setTimeout(() => ov.remove(), 300); try { importCSV(); } catch (e) { console.warn('importar', e); } });
  document.body.append(ov); return ov;
}
const PP_BUSCA = (lendo) => [
  { go: () => { const i = ppFind('#ct-q'); if (!i) { const f = ppFind('#g-find'); if (f) f.click(); } }, sel: '#ct-q', t: 'Busque um livro', x: 'Digite título, autor ou ISBN.', adv: 'none', until: () => !!ppFind('.ct-it') },
  { sel: '.ct-it', t: 'Toque no livro', x: 'Toque para ver o livro ou segure para adicionar direto.', until: () => !!ppFind('#shelflist .bp-hero') || !!ppFind('.sheet button', 'Quero ler') },
  { sel: '#shelflist [data-v9=add]', t: 'Adicionar à Biblioteca', x: 'Toque aqui e escolha como ele está.', until: () => !!ppFind('.sheet button', 'Quero ler') },
  { sel: () => { const b = ppFind('.sheet button', 'Quero ler'); return b ? b.parentElement : null; }, t: 'Como está para você?', x: lendo ? 'Escolha Lendo para começar agora. Dá para mudar depois.' : 'Quero ler, Lendo ou Já li. Dá para mudar depois.', adv: 'none',
    go: () => { ppG.n0 = ppLibN(); }, until: () => !ppFind('.sheet button', 'Quero ler') && ppLibN() > (ppG.n0 || 0) },
];
const PP_PAGINA = [
  { sel: '#shelflist .v8nc', opt: 1, t: 'Números do livro', x: 'Quantas pessoas leram, querem ler e a média das avaliações.', adv: 'btn' },
  { sel: '#shelflist .bp-tabs', opt: 1, t: 'Abas do livro', x: 'Sobre: sinopse e ficha. Minha leitura: progresso, trechos e anotações. Comunidade: avaliações sem spoiler.', adv: 'btn' },
  { sel: '#shelflist .v5hdots, #shelflist [data-v9=more], #shelflist .v5dots', opt: 1, t: 'Mais opções', x: 'Mais opções deste livro.', adv: 'btn', btn: 'Concluir' },
];
const PP_HOJE = [
  { go: () => ppTab('inicio'), sel: '#lista:not(.lista-snap) .v3ring', t: 'Seu progresso', x: 'O anel mostra quanto você já leu. Toque nele para abrir o livro.', adv: 'btn' },
  { sel: () => { const b = ppFind('#lista:not(.lista-snap) .v3qa.p'); return b ? b.parentElement : null; }, t: 'Atalhos do livro', x: 'Atualizar: diga a página se leu fora do app. Ao lado: Terminei, Trecho, Ler junto e Mais.', adv: 'btn' },
  { sel: '#tabbar [data-tab=ler]', t: 'Ler', x: 'Abre a sessão de leitura: conta o tempo e silencia o resto. No caminho, ecos de quem já passou.', adv: 'btn',
    btns: [['Depois', () => ppFinish()], ['Experimentar agora', () => { ppG.steps.push(...PP_SESSAO); ppNext(); }]] },
];
const PP_SESSAO = [
  { go: () => { if (!ppFind('[data-a=lerfoco]') && !ppFind('[data-a=start]')) { const t = ppFind('#tabbar [data-tab=ler]'); if (t) t.click(); } }, sel: '[data-a=lerfoco]', opt: 1, t: 'Entrar no silêncio', x: 'Abre a sessão de leitura.' },
  { sel: '[data-a=start]', t: 'Começar a ler', x: 'Conta o tempo e silencia o resto. No fim, você diz a página.' },
  { sel: '[data-a=ecoed]', t: 'Ecos', x: 'Frases de quem já passou por esta página aparecem aqui. Em Deixar um eco, você deixa o seu.', adv: 'btn' },
  { sel: '.v6luzb', opt: 1, t: 'Luz', x: 'Esmaece a tela para ler no escuro.', adv: 'btn' },
  { sel: '[data-a=sheet]', txt: 'Encerrar', t: 'Encerrar', x: 'No fim, diga a página em que parou.' },
  { sel: () => ppFind('[aria-label="Deslizar até a página"]') || ppFind('[data-a=ust]'), t: 'Diga a página e salve', x: 'Ajuste a página em que parou e salve. Descartar não guarda nada.', adv: 'none',
    until: () => !ppFind('[data-a=ust]') && !ppFind('[data-a=ecoed]') },
  { go: () => ppTab('inicio'), sel: '#lista:not(.lista-snap) .v3qa.p', t: 'Leu fora da sessão?', x: 'Toque em Atualizar e diga onde parou.', adv: 'btn', btn: 'Concluir' },
];
function ppPaths(id) {
  if (id === 'imp') return [
    { go: () => { if (!document.querySelector('.ppimp')) ppImportPage(); }, sel: '.ppimp [data-f]', t: 'Traga seu histórico', x: 'Siga o texto acima e toque em Escolher o arquivo.', until: () => !!ppFind('.lvdlg button', 'Importar') },
    { sel: '.lvdlg button', txt: 'Importar', t: 'Confira e importe', x: 'É isto que vai entrar. Resenhas ficam só para você.', adv: 'none', until: () => !!ppFind('button', /Conferir/) || !!ppFind('.v4fx') },
    { sel: () => ppFind('button', /Conferir/), opt: 1, t: 'Seus livros chegaram', x: 'Alguns vieram sem data ou páginas. Toque em Conferir minhas leituras.', until: () => !!ppFind('.v4fx') || !!ppFind('button', 'Completar agora') },
    { sel: 'button', txt: 'Completar agora', opt: 1, t: 'Complete agora ou depois', x: 'Toque em Completar agora para conferir. Dá para fazer depois.', until: () => !!ppFind('.v4fx') },
    { sel: () => { const r = ppFind('.v4fx'); const s = r && r.getRootNode().querySelector('.v4seg'); return s && ppVis(s) ? s : null; }, opt: 1, t: 'O que falta', x: 'Cada aba mostra o que veio sem dado. Completar acerta estatísticas e meta.', adv: 'btn' },
    { sel: '.v4fx .fld', opt: 1, t: 'Complete um livro', x: 'Preencha aqui; salva sozinho. O que ficar em branco espera aqui.', adv: 'btn' },
    { go: () => { try { $('#shelflist').hidden = true; } catch {} ppTab('estante'); }, sel: '[data-a=v5book]', t: 'Segure a capa', x: 'Abre o menu do livro: mude o status ou coloque numa estante.', adv: 'btn', btn: 'Concluir' },
  ];
  if (id === 'busca1') return [...PP_BUSCA(false), ...PP_PAGINA];
  if (id === 'busca2') return [...PP_BUSCA(true),
    { hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { if (ppHas('LENDO')) { ppG.steps.splice(ppG.i + 1, 0, ...PP_HOJE); } else { ppG.steps.splice(ppG.i + 1, 0, ...PP_MENU_LER); } } }];
  if (id === 'bib2') return [
    { go: () => ppTab('estante'), sel: () => { const L = lib().filter((e) => e.status === 'QUERO' || e.status === 'HIBERNANDO'); for (const e of L) { const b = ppFind('[data-a=v5book]', e.title); if (b) return b; } return ppFind('[data-a=v5book]'); },
      t: 'Segure a capa', x: 'Abre as opções do livro.', hold: 1, until: () => !!ppFind('button', /^\s*Começar a ler/) && !ppFind('[data-a=start]'),
      btns: [['Abrir as opções', () => { const el = ppG && ppG.cur; if (el) el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true })); }]] },
    ...PP_MENU_LER];
  if (id === 'hoje2') return [...PP_HOJE];
  if (id === 'fim') return [
    { go: () => ppTab('inicio'), sel: '#lista:not(.lista-snap) [data-h3=fim]', t: 'Toque em Terminei', x: 'Abre a nota, as datas e o que sentiu.', until: () => !!ppFind('[data-a=fimn]') },
    { go: () => { ppG.f0 = lib().filter((e) => e.status === 'LIDO').length; }, sel: () => { const s = ppFind('[data-a=fimn]'); return s ? s.parentElement : null; }, t: 'Dê a nota e salve', x: 'Toque nas estrelas (meia vale) e salve.', adv: 'none',
      until: () => lib().filter((e) => e.status === 'LIDO').length > (ppG.f0 || 0) && !ppFind('[data-a=fimn]') },
    { go: () => ppTab('inicio'), sel: null, t: 'Sua avaliação', x: 'Aparece na Comunidade do livro e em Minha leitura. No ••• dela, edite ou apague.', adv: 'btn', btn: 'Concluir' },
  ];
  if (id === 'gente') return [
    { go: () => ppTab('comunidade'), sel: '[data-a=v6new]', t: 'Comente sem spoiler', x: 'Se contar do enredo, marque até que página vai o spoiler.', adv: 'btn' },
    { sel: '#g-find', t: 'Encontre leitores', x: 'Na lupa, procure pessoas que leem o que você lê.', until: () => !!ppFind('#ct-q') },
    { sel: 'button', txt: 'Leitores', opt: 1, t: 'Leitores', x: 'Toque em Leitores para procurar pessoas.' },
    { sel: '#ct-q, input[type=search]', opt: 1, t: 'Procure pelo nome ou @', x: 'Digite o nome ou o @ de alguém e toque na pessoa para pedir amizade.', adv: 'btn' },
    { sel: null, t: 'Ler junto', x: 'Leia o mesmo livro com uma amizade e conversem sem spoiler. Fica no cartão do livro, no Hoje.', adv: 'btn', btn: 'Concluir' },
  ];
  return [];
}
const PP_MENU_LER = [
  { sel: () => ppFind('button', /^\s*Começar a ler\s*$/) || ppFind('button', /Começar a ler/), t: 'Começar a ler', x: 'O livro vai para o Hoje.', until: () => ppHas('LENDO') && !ppFind('button', /^\s*Começar a ler/) },
  { hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { ppG.steps.splice(ppG.i + 1, 0, ...PP_HOJE); } },
];
function ppGuide(id, stage) {
  ppStop(); const steps = ppPaths(id); if (!steps.length) return;
  ppG = { id, stage, steps: steps.slice(), i: 0 };
  // o caminho da busca na etapa 1 encadeia a etapa 2 quando o livro entra como Lendo
  if (id === 'busca1') ppG.steps.push({ hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { if (ppHas('LENDO') && !ppArr('done').includes('ler')) { ppG.then = 'hoje2'; ppG.thenStage = 'ler'; } } });
  ppStep();
}
