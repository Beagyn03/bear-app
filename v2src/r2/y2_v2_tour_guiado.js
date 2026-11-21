// Tour guiado (Bia, 21/11; protótipo v170): cada etapa dos Primeiros passos abre um caminho nas telas REAIS do app, com um
// balão por elemento (aponta o próprio elemento, cita só o que está na tela), "passo X de N", "Pular" (marca a etapa como
// pulada) e × (sai). Nunca para sem o próximo balão: se o elemento não aparecer, o balão fica solto com "Continuar".
// Esc sai; foco vai para o balão; sem animação quando o sistema pede menos movimento.
{ const st = document.createElement('style'); st.textContent = `
.ppring{position:fixed;z-index:2147482995;pointer-events:none;border:2.5px solid var(--ppacc,#e0a060);border-radius:14px;box-shadow:0 0 0 4px color-mix(in srgb,var(--ppacc,#e0a060) 30%,transparent),0 0 0 200vmax rgba(8,6,16,.55)}
.ppscrim{position:fixed;inset:0;z-index:2147482994;pointer-events:none;background:rgba(8,6,16,.55)}
.ppbal{position:fixed;z-index:2147482996;left:12px;right:12px;max-width:440px;margin:0 auto;padding:14px 14px 12px;border-radius:18px;border:2px solid var(--ppacc,#e0a060);background:var(--ppsurf,#2b2540);color:var(--ppbal-ink,#fff);font-family:system-ui,sans-serif;box-shadow:0 18px 50px rgba(0,0,0,.6)}
.ppbal .top{display:flex;align-items:center;gap:8px}.ppbal .pn{flex:1;font-size:.74rem;font-weight:900;letter-spacing:.04em;color:var(--ppsub,#d8cfe8)}
.ppbal .x{width:40px;height:40px;border:0;background:none;color:inherit;display:grid;place-items:center;cursor:pointer;margin:-8px -6px -8px 0}
.ppbal svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round}
.ppbal .pb{height:4px;border-radius:9px;background:color-mix(in srgb,var(--ppink,#fff) 12%,transparent);margin:8px 0 10px;overflow:hidden}.ppbal .pb i{display:block;height:100%;background:var(--ppacc,#e0a060)}
.ppbal b{display:block;font-size:1.05rem;line-height:1.25}.ppbal p{margin:4px 0 0;font-size:.9rem;line-height:1.4;color:var(--ppsub,#e2daf0)}
.ppbal .bt{display:flex;gap:8px;justify-content:flex-end;align-items:center;margin-top:10px;flex-wrap:wrap}
.ppbal .bt button{min-height:42px;padding:0 1rem;border-radius:99px;border:1.5px solid var(--ppline,#3a3150);background:none;color:inherit;font:inherit;font-weight:800;font-size:.88rem;cursor:pointer}
.ppbal .bt button.p{background:var(--ppacc,#e0a060);border-color:var(--ppacc,#e0a060);color:var(--ppon,#2a1709)}
.ppbal .bt .sk{border:0;padding:0 .4rem;margin-right:auto;color:var(--ppsub,#d8cfe8);text-decoration:underline;font-weight:700}
.ppbal .bt button:not(.p):not(.sk){border-color:color-mix(in srgb,var(--ppbal-ink,#fff) 35%,transparent)}
.ppbal .ar{position:absolute;width:14px;height:14px;background:inherit;border-left:2px solid var(--ppacc,#e0a060);border-top:2px solid var(--ppacc,#e0a060);transform:rotate(45deg)}
.ppbal.dn .ar{top:-8px}.ppbal.up .ar{bottom:-8px;transform:rotate(225deg)}
@media (prefers-reduced-motion: no-preference){.ppbal{animation:ppbIn .22s ease both}@keyframes ppbIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}}
`; document.head.append(st); }
var ppG = null; // caminho guiado em andamento
// procura nos lugares onde o app desenha: documento, interface principal e as telas v4/v5/v6 (shadow roots internos)
function ppRoots() { const R = [document, TR]; try { TR.querySelectorAll('*').forEach((x) => { if (x.shadowRoot) R.push(x.shadowRoot); }); } catch {} return R; }
const ppVis = (x) => { if (!x || !x.isConnected || (x.closest && x.closest('#lista.v3-wait, #lista.v3-back, .lista-snap'))) return false; const r = x.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const cs = getComputedStyle(x); return cs.visibility !== 'hidden' && cs.display !== 'none' && r.bottom > 0 && r.top < innerHeight; };
function ppFind(sel, txt) { for (const r of ppRoots()) { let L; try { L = r.querySelectorAll(sel); } catch { continue; }
    for (const x of L) { if (x.closest && x.closest('.ppbal')) continue; if (txt && !(txt instanceof RegExp ? txt.test(x.textContent) : x.textContent.includes(txt))) continue; if (ppVis(x)) return x; } } return null; }
function ppClose() { document.querySelectorAll('.ppbal,.ppring,.ppscrim').forEach((x) => x.remove()); if (ppClose.raf) cancelAnimationFrame(ppClose.raf); ppClose.raf = 0; }
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
    if (!el || !el.isConnected) { document.querySelector('.ppring')?.remove(); if (!document.querySelector('.ppscrim')) { const sc = document.createElement('div'); sc.className = 'ppscrim'; document.body.append(sc); }
      b.style.top = Math.max(12, H - bh - 96) + 'px'; b.classList.remove('up', 'dn'); b.querySelector('.ar').hidden = true; return; }
    document.querySelector('.ppscrim')?.remove();
    const r = el.getBoundingClientRect(); let ring = document.querySelector('.ppring');
    if (o.bottom) { if (!ring) { ring = document.createElement('div'); ring.className = 'ppring'; ppVars(ring); document.body.append(ring); }
      Object.assign(ring.style, { left: Math.max(4, r.left - 4) + 'px', top: Math.max(4, r.top - 4) + 'px', width: Math.max(0, Math.min(innerWidth - 4, r.right + 4) - Math.max(4, r.left - 4)) + 'px', height: Math.max(0, r.height + 8) + 'px' });
      b.style.top = Math.max(12, H - bh - 96) + 'px'; b.classList.remove('up', 'dn'); b.querySelector('.ar').hidden = true; return; } if (!ring) { ring = document.createElement('div'); ring.className = 'ppring'; ppVars(ring); document.body.append(ring); }
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
// antes de cada passo, fecha folhas e menus que não fazem parte dele (Bia, 21/11, item D)
function ppCloseLayers() { try { if (typeof closePop === 'function') closePop(); } catch {}
  for (const r of ppRoots()) { try { r.querySelectorAll('.veil[data-a=close]').forEach((x) => { if (ppVis(x)) x.click(); });
      r.querySelectorAll('.esn-sheet').forEach((x) => { const c = x.querySelector('[data-a=close],.cancel,.x,[aria-label=Fechar]'); if (c) c.click(); else x.remove(); }); } catch {} }
  document.querySelectorAll('body > .sheet').forEach((x) => x.remove()); }
// o alvo está à vista e não coberto? (o que está no centro dele é ele mesmo ou algo dentro dele)
function ppOnTop(el) { try { const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + Math.min(r.height / 2, 30); if (y < 0 || y > innerHeight) return false;
    let t = document.elementFromPoint(x, y); for (let k = 0; k < 8 && t && t.shadowRoot; k++) { const u = t.shadowRoot.elementFromPoint(x, y); if (!u || u === t) break; t = u; }
    if (!t) return false; if (t === el || el.contains(t) || (t.closest && t.closest('.ppbal'))) return true; const host = el.getRootNode && el.getRootNode().host; return !!(host && (t === host || (t.getRootNode && t.getRootNode() === el.getRootNode() && el.contains(t)))); } catch { return true; } }
// dicas antigas da tela somem enquanto o tour mostra a dele (item E)
function ppHideTips(on) { for (const r of ppRoots()) { try { r.querySelectorAll(on ? '.tip, .v3tip' : '[data-pphid]').forEach((x) => { if (on) { if (!x.hidden && !x.closest('.ppbal')) { x.hidden = true; x.dataset.pphid = '1'; } } else { x.hidden = false; delete x.dataset.pphid; } }); } catch {} } }
function ppStop() { if (ppG && ppG.tm) clearInterval(ppG.tm); ppG = null; ppClose(); ppHideTips(false); }
function ppFinish(how) { const g = ppG; ppStop(); if (!g) return; if (g.stage) ppDone(g.stage, how === 'skip' ? 'skip' : undefined);
  if (how !== 'skip' && g.then) { setTimeout(() => ppGuide(g.then, g.thenStage || g.stage), 500); return; }
  try { goTab('inicio'); } catch {} if (how !== 'skip') toast('Etapa concluída'); }
function ppNext() { if (!ppG) return; ppG.i++; ppStep(); }
function ppStep() {
  const g = ppG; if (!g) return; if (g.tm) { clearInterval(g.tm); g.tm = 0; } ppClose();
  const s = g.steps[g.i]; if (!s) return ppFinish();
  if (!s.keep) ppCloseLayers();
  try { s.go && s.go(); } catch (e) { console.warn('guia', e); }
  // contagem fixa (teste real 21/11, item 9): N vem do plano do caminho; cada passo não oculto conta, mesmo se pulado
  let n, N; if (s.sub) { g.sn = (g.sn || 0) + 1; n = g.sn; N = PP_SESSAO.length; } else { if (!s.hidden) g.n = (g.n || 0) + 1; n = Math.min(g.n || 1, g.N); N = g.N; }
  let waited = 0, shown = null;
  const show = (el) => { const btns = (s.btns || (s.adv === 'btn' ? [[s.btn || 'Continuar', () => ppNext()]] : [])).map(([l, f]) => [l, f === 'next' ? () => ppNext() : f]);
    if (!el && !btns.length) btns.push(['Continuar', () => ppNext()]);
    shown = ppBalloon({ t: s.sub ? 'Sessão · ' + s.t : s.t, x: s.x, el, n, N, btns, bottom: !!s.bottom, skip: () => ppFinish('skip'), onX: () => ppStop() });
    g.tapEl = el && !s.adv ? el : null; g.hold = !!s.hold; };
  const tick = () => { if (ppG !== g) return clearInterval(g.tm);
    if (s.until && (() => { try { return s.until(); } catch { return false; } })()) { clearInterval(g.tm); g.tm = 0; return ppNext(); }
    ppHideTips(true);
    let el = s.sel ? (typeof s.sel === 'function' ? s.sel() : ppFind(s.sel, s.txt)) : null;
    // alvo coberto por outra camada: tenta rolar até ele; se continuar coberto, segue para o próximo passo (item D)
    if (el && !ppOnTop(el)) { g.cov = (g.cov || 0) + 300; if (g.cov === 300) { try { el.scrollIntoView({ block: 'center' }); } catch {} } if (g.cov < 2400) { if (shown) { ppClose(); shown = null; g.cur = null; } return; } g.cov = 0; clearInterval(g.tm); g.tm = 0; return ppNext(); }
    g.cov = 0;
    if (el) { if (!shown || g.cur !== el) { g.cur = el; show(el); } return; }
    waited += 300;
    if (shown && g.cur && !g.cur.isConnected) { g.cur = null; shown = null; }
    if (!shown && (!s.sel || waited >= (s.opt ? 1200 : (s.wait || 3500)))) { if (!s.sel && s.hidden) return; if (s.opt && s.sel && waited < 2500) return; if (s.opt && s.sel) { clearInterval(g.tm); g.tm = 0; return ppNext(); } g.cur = null; show(null); } };
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
  { keep: 1, sel: () => { const b = ppFind('.sheet button', 'Quero ler'); return b ? b.parentElement : null; }, t: 'Como está para você?', x: lendo ? 'Escolha Lendo para começar agora. Dá para mudar depois.' : 'Quero ler, Lendo ou Já li. Dá para mudar depois.', adv: 'none',
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
    btns: [['Depois', () => ppFinish()], ['Experimentar agora', () => { ppG.sn = 0; ppG.steps.push(...PP_SESSAO); ppNext(); }]] },
];
const PP_SESSAO0 = [
  { go: () => { if (!ppFind('[data-a=lerfoco]') && !ppFind('[data-a=start]')) { const t = ppFind('#tabbar [data-tab=ler]'); if (t) t.click(); } }, sel: '[data-a=lerfoco]', opt: 1, t: 'Entrar no silêncio', x: 'Abre a sessão de leitura.' },
  { sel: '[data-a=start]', t: 'Começar a ler', x: 'Conta o tempo e silencia o resto. No fim, você diz a página.' },
  { sel: '[data-a=ecoed]', t: 'Ecos', x: 'Frases de quem já passou por esta página aparecem aqui. Em Deixar um eco, você deixa o seu.', adv: 'btn' },
  { sel: '.v6luzb', opt: 1, t: 'Luz', x: 'Esmaece a tela para ler no escuro.', adv: 'btn' },
  { sel: '[data-a=sheet]', txt: 'Encerrar', t: 'Encerrar', x: 'No fim, diga a página em que parou.' },
  { keep: 1, sel: () => ppFind('[aria-label="Deslizar até a página"]') || ppFind('[data-a=ust]'), t: 'Diga a página e salve', x: 'Ajuste a página em que parou e salve. Descartar não guarda nada.', adv: 'none',
    until: () => !ppFind('[data-a=ust]') && !ppFind('[data-a=ecoed]') },
  // fecha a tela Ler e aponta o Atualizar do cartão no Hoje (teste real 21/11, item 3)
  { go: () => { try { if (S.v4 && typeof v4Close === 'function') v4Close(); } catch {} ppTab('inicio'); }, wait: 9000, sel: () => (S.v4 ? null : ppFind('#lista:not(.lista-snap) .v3qa.p')), t: 'Leu fora da sessão?', x: 'Toque em Atualizar e diga onde parou.', adv: 'btn', btn: 'Concluir' },
];
const PP_SESSAO = PP_SESSAO0.map((x) => ({ ...x, sub: 1 }));
function ppPaths(id) {
  if (id === 'imp') return [
    { go: () => { if (!document.querySelector('.ppimp')) ppImportPage(); }, sel: '.ppimp [data-f]', t: 'Traga seu histórico', x: 'Siga o texto acima e toque em Escolher o arquivo.', until: () => !!ppFind('.lvdlg button', 'Importar') },
    { sel: '.lvdlg button', txt: 'Importar', t: 'Confira e importe', x: 'É isto que vai entrar. Resenhas ficam só para você.', adv: 'none', until: () => !!ppFind('button', /Conferir/) || !!ppFind('.v4fx') },
    { sel: () => ppFind('.lvdlg button', /Conferir|Ver minha Biblioteca/), opt: 1, t: 'Seus livros chegaram', x: 'Toque no botão para continuar.', until: () => !!ppFind('.v4fx') || !ppFind('.lvdlg') },
    { sel: () => { const r = ppFind('.v4fx'); const s = r && r.getRootNode().querySelector('.v4seg'); return s && ppVis(s) ? s : null; }, opt: 1, t: 'O que falta', x: 'Cada aba mostra o que veio sem dado. Completar acerta estatísticas e meta.', adv: 'btn' },
    { sel: '.v4fx .fld', opt: 1, t: 'Complete um livro', x: 'Preencha aqui; salva sozinho. O que ficar em branco espera aqui.', adv: 'btn' },
    { go: () => { try { $('#shelflist').hidden = true; } catch {} ppTab('estante'); }, sel: '[data-a=v5book]', t: 'Segure a capa', x: 'Abre o menu do livro: mude o status ou coloque numa estante.', adv: 'btn', btn: 'Concluir' },
  ];
  if (id === 'busca1') return [...PP_BUSCA(false), ...PP_PAGINA];
  if (id === 'busca2') return [...PP_BUSCA(true),
    { hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { if (ppHas('LENDO')) { ppG.n = (ppG.n || 0) + 1; ppG.steps.splice(ppG.i + 1, 0, ...PP_HOJE); } else { ppG.steps.splice(ppG.i + 1, 0, ...PP_MENU_LER); } } }];
  if (id === 'bib2') return [
    { go: () => ppTab('estante'), sel: () => { const L = lib().filter((e) => e.status === 'QUERO' || e.status === 'HIBERNANDO'); for (const e of L) { const b = ppFind('[data-a=v5book]', e.title); if (b) return b; } return ppFind('[data-a=v5book]'); },
      t: 'Segure a capa', x: 'Abre as opções do livro.', hold: 1, until: () => !!ppFind('button', /^\s*Começar a ler/) && !ppFind('[data-a=start]'),
      btns: [['Abrir as opções', () => { const el = ppG && ppG.cur; if (el) el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true })); }]] },
    ...PP_MENU_LER];
  if (id === 'hoje2') return [...PP_HOJE];
  if (id === 'fim') return [
    { go: () => ppTab('inicio'), sel: '#lista:not(.lista-snap) [data-h3=fim]', t: 'Toque em Terminei', x: 'Abre a nota, as datas e o que sentiu.', until: () => !!ppFind('[data-a=fimn]') },
    { keep: 1, go: () => { ppG.f0 = lib().filter((e) => e.status === 'LIDO').length; }, sel: () => ppStars(), t: 'Dê a nota e salve', x: 'Toque nas estrelas (meia vale) e salve.', adv: 'none',
      until: () => lib().filter((e) => e.status === 'LIDO').length > (ppG.f0 || 0) && !ppFind('[data-a=fimn]') },
    { go: () => { try { ppDone('fim'); } catch {} const L = lib().filter((e) => e.status === 'LIDO').sort((a, b) => String(b.finishedAt || '').localeCompare(String(a.finishedAt || '')));
        const e = L[0]; if (e) { try { openBookPage(e); } catch {} } }, sel: '#shelflist .bp-tabs button', txt: 'Minha leitura', opt: 1, t: 'Minha leitura', x: 'Seu progresso e sua avaliação ficam aqui.', adv: 'none', until: () => !!ppAval() },
    { sel: () => ppAval(), t: 'Sua avaliação', x: 'Fica aqui. Toque para editar ou apagar.', adv: 'btn', btn: 'Concluir' },
  ];
  if (id === 'gente') return [
    { go: () => ppTab('comunidade'), sel: '[data-a=v6new]', t: 'Comente sem spoiler', x: 'Se contar do enredo, marque até que página vai o spoiler.', adv: 'btn' },
    { sel: '#g-find', t: 'Encontre leitores', x: 'Na lupa, procure pessoas que leem o que você lê.', until: () => !!ppFind('#ct-q') },
    { sel: 'button', txt: 'Leitores', opt: 1, t: 'Leitores', x: 'Toque em Leitores para procurar pessoas.' },
    { go: () => { const i = ppFind('#ct-q') || ppFind('input[type=search]'); if (i && i.value) { i.value = ''; i.dispatchEvent(new Event('input', { bubbles: true })); } }, sel: '#ct-q, input[type=search]', opt: 1, bottom: 1, t: 'Procure pelo nome ou @', x: 'Digite o nome ou o @ de alguém e toque na pessoa para pedir amizade.', adv: 'btn' },
    { sel: null, t: 'Ler junto', x: 'Leia o mesmo livro com uma amizade e conversem sem spoiler. Fica no cartão do livro, no Hoje.', adv: 'btn', btn: 'Concluir' },
  ];
  return [];
}
// onde a avaliação aparece na página do livro (linha "Minha avaliação" de Minha leitura, ou o cartão antigo com Avaliar/Editar)
function ppAval() { const has = (x) => { const r = x.getBoundingClientRect(); return r.width > 2 && r.height > 2 && getComputedStyle(x).visibility !== 'hidden'; }; // pode estar abaixo da dobra: o balão rola até ele
  for (const x of TR.querySelectorAll('#shelflist:not([hidden]) .bp-row')) if (/Minha avaliação/.test(x.textContent) && has(x)) return x;
  const b = [...TR.querySelectorAll('#shelflist:not([hidden]) [data-a=rate]')].find(has); return b ? (b.closest('.bp-card') || b) : null; }
// estrelas da folha de Terminei: o grupo inteiro (não uma estrela só)
function ppStars() { const s = ppFind('[data-a=fimn]'); if (!s) return null; let p = s.parentElement; while (p && p.querySelectorAll('[data-a=fimn]').length < 5 && p.parentElement) p = p.parentElement; return p; }
const PP_MENU_LER = [
  { keep: 1, sel: () => ppFind('button', /^\s*Começar a ler\s*$/) || ppFind('button', /Começar a ler/), t: 'Começar a ler', x: 'O livro vai para o Hoje.', until: () => ppHas('LENDO') && !ppFind('button', /^\s*Começar a ler/) },
  { hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { ppG.steps.splice(ppG.i + 1, 0, ...PP_HOJE); } },
];
function ppGuide(id, stage) {
  ppStop(); const steps = ppPaths(id); if (!steps.length) return;
  const PLAN = { imp: 6, busca1: 7, busca2: 8, bib2: 5, hoje2: 3, fim: 4, gente: 5 };
  ppG = { id, stage, steps: steps.slice(), i: 0, n: 0, N: PLAN[id] || steps.filter((x) => !x.hidden).length };
  // o caminho da busca na etapa 1 encadeia a etapa 2 quando o livro entra como Lendo
  if (id === 'busca1') ppG.steps.push({ hidden: 1, sel: null, t: '', x: '', until: () => true, go: () => { if (ppHas('LENDO') && !ppArr('done').includes('ler')) { ppG.then = 'hoje2'; ppG.thenStage = 'ler'; } } });
  ppStep();
}
