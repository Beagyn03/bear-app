// Tela parada (causa raiz do tremor, 22/11): cada atualização em segundo plano (poll do feed, syncSocial3, capas, mapBuddies,
// sincronizações) chamava drawTab e a aba inteira era refeita do zero: innerHTML novo, decorações reaplicadas um pouco depois,
// rolagem/foco/estado aberto perdidos, e o conteúdo pulava algumas vezes por minuto (Bia: "ta tremendo a tela").
// Agora, quando o redesenho NÃO vem de um gesto da pessoa, a aba é montada numa cópia invisível e comparada com o que está na tela:
// - igual (o caso comum): a cópia é descartada, a tela fica intocada e os temporizadores que o redesenho agendou são cancelados;
// - diferente: a tela nova termina de montar por trás (invisível, com as decorações e o Hoje novo já aplicados) e troca de uma vez,
//   mantendo a rolagem; se a pessoa tocar enquanto isso, a tela atual fica e o redesenho volta logo depois.
// Enquanto a pessoa digita num campo da aba, o redesenho de fundo espera o campo perder o foco.
// Redesenho causado por toque/clique/tecla/voltar continua como sempre (síncrono e completo).
{
  const SKIP_CLS = /^(v3-wait|v3-back|lista-snap|rr-tmp)$/;
  let userTs = -1e9;
  const mark = () => { userTs = performance.now(); };
  ['click', 'keydown', 'input', 'change', 'submit', 'popstate'].forEach((t) => window.addEventListener(t, mark, true));
  const userPath = () => performance.now() - userTs < 700;
  // assinatura "no momento do desenho": HTML do nó mais o conteúdo de shadow roots dentro dele
  const shadowTxt = (n) => { let s = ''; if (n.shadowRoot) s += '#sr{' + n.shadowRoot.innerHTML + shadowAll(n.shadowRoot) + '}'; return s; };
  const shadowAll = (root) => { let s = ''; root.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) s += shadowTxt(e); }); return s; };
  const SIG = new WeakMap(); const sigNoV6 = (x) => String(x).replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  const record = (box) => { try { SIG.set(box, box.innerHTML + shadowAll(box)); } catch {} };
  // temporizadores agendados durante um redesenho de fundo: só valem se a tela nova for usada
  const realST = window.setTimeout, realCT = window.clearTimeout, realRAF = window.requestAnimationFrame, realCAF = window.cancelAnimationFrame;
  let held = null, fid = -1, prevST = null, prevRAF = null; const fmap = new Map();
  window.clearTimeout = function (id) { if (typeof id === 'number' && id < 0) { if (fmap.has(id)) { const r = fmap.get(id); fmap.delete(id); if (r != null) return realCT(r); } if (held) held = held.filter((h) => h.id !== id); return; } return realCT(id); };
  window.cancelAnimationFrame = function (id) { if (typeof id === 'number' && id < 0) { if (fmap.has(id)) { const r = fmap.get(id); fmap.delete(id); if (r != null) return realCAF(r); } if (held) held = held.filter((h) => h.id !== id); return; } return realCAF(id); };
  const hold = () => { held = []; prevST = window.setTimeout; prevRAF = window.requestAnimationFrame;
    window.setTimeout = function (fn, ms, ...a) { const id = fid--; held.push({ id, k: 't', fn, ms, a }); fmap.set(id, null); return id; };
    window.requestAnimationFrame = function (fn) { const id = fid--; held.push({ id, k: 'r', fn }); fmap.set(id, null); return id; }; };
  const release = (run) => { const h = held || []; held = null; window.setTimeout = prevST || realST; window.requestAnimationFrame = prevRAF || realRAF;
    for (const x of h) { if (!fmap.has(x.id)) continue; if (!run) { fmap.delete(x.id); continue; } const r = x.k === 't' ? window.setTimeout(x.fn, x.ms, ...x.a) : window.requestAnimationFrame(x.fn); fmap.set(x.id, r); } };
  // montagem por trás do Hoje: os enfeites dele chegam em etapas com espera (250 ms, 500 ms, 1 s...). Enquanto a cópia invisível
  // monta, essas esperas encadeadas a partir do redesenho rodam já (0 ms), para a troca acontecer em poucos quadros.
  let BUILD = 0; const taint = (fn) => (typeof fn !== 'function' ? fn : function () { BUILD++; try { return fn.apply(this, arguments); } finally { BUILD--; } });
  { const st0 = window.setTimeout; window.setTimeout = function (fn, ms, ...a) { if (BUILD > 0 && P && !held) return st0(taint(fn), 0, ...a); if (RR_TX.build > 0 && RR_TX.fast > 0) return st0(rrTx(fn), 0, ...a); return st0.call(this, fn, ms, ...a); };
    const raf0 = window.requestAnimationFrame; window.requestAnimationFrame = function (fn) { if (BUILD > 0 && P && !held) return raf0(taint(fn)); if (RR_TX.build > 0 && RR_TX.fast > 0) return raf0(rrTx(fn)); return raf0.call(this, fn); }; }
  const releaseFast = () => { const h = held || []; held = null; window.setTimeout = prevST || realST; window.requestAnimationFrame = prevRAF || realRAF;
    for (const x of h) { if (!fmap.has(x.id)) continue; const r = x.k === 't' ? window.setTimeout(taint(x.fn), 0, ...x.a) : window.requestAnimationFrame(taint(x.fn)); fmap.set(x.id, r); } };
  const editing = (box) => { const a = (TR.activeElement || document.activeElement); return !!(a && box.contains(a) && (a.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]), textarea, [contenteditable=true], [contenteditable=""]'))); };
  const scrollers = (box) => { const out = []; const walk = (p) => { for (const c of p.children) { if (c.scrollTop || c.scrollLeft) out.push([c, c.scrollTop, c.scrollLeft]); if (c.shadowRoot) walk(c.shadowRoot); if (c.children.length) walk(c); } }; walk(box); return out; }; // entra nas raízes sombra (estante, faixas)
  let pend = false, P = null; // P: tela nova montando por trás (invisível) até assentar
  const L = () => TR.querySelector('#lista:not(.lista-snap):not(.rr-tmp)');
  const _dt = drawTab;
  const keepCls = (old, from) => { const cls = [...from.classList].filter((c) => !SKIP_CLS.test(c)); old.className = [...new Set([...cls, ...[...old.classList].filter((c) => /^(v3-wait|v3-back)$/.test(c))])].join(' '); };
  const shadowStyles = (old, tmp) => { try { const hosts = (r) => [...r.querySelectorAll('*')].filter((n) => n.shadowRoot); const olds = hosts(old), used = new Set();
    for (const h of hosts(tmp)) { if (olds.includes(h)) continue; const o = olds.find((x) => !used.has(x) && x.tagName === h.tagName && x.className === h.className); if (!o) continue; used.add(o);
      const have = new Set([...h.shadowRoot.querySelectorAll('style')].map((x) => x.textContent));
      for (const st of o.shadowRoot.querySelectorAll(':scope > style, :scope > link[rel=stylesheet]')) if (!have.has(st.textContent)) { h.shadowRoot.append(st.cloneNode(true)); have.add(st.textContent); }
      try { const a = o.shadowRoot.adoptedStyleSheets || [], b = h.shadowRoot.adoptedStyleSheets || []; const miss = a.filter((x) => !b.includes(x)); if (miss.length) h.shadowRoot.adoptedStyleSheets = [...b, ...miss]; } catch {} } } catch {} };
  const swap = (p) => { // troca a tela de uma vez, já com as decorações aplicadas
    if (!p || P !== p) return; P = null; clearTimeout(p.hard); p.mo.disconnect();
    const { old, tmp } = p; if (!tmp.isConnected || !old.isConnected) { tmp.remove(); return; }
    const wy = window.scrollY, oy = old.scrollTop, inner = scrollers(old);
    const innerT = scrollers(tmp); // rolagem que a tela nova já tinha (ex.: faixa do Decorar): mover os nós zera, então volta depois (Bia 23/11)
    shadowStyles(old, tmp); keepCls(old, tmp); old.replaceChildren(...tmp.childNodes); tmp.remove();
    if (old.scrollTop !== oy) old.scrollTop = oy; for (const [n, t, l] of inner) if (n.isConnected) { n.scrollTop = t; n.scrollLeft = l; } for (const [n, t, l] of innerT) if (n.isConnected && (n.scrollTop !== t || n.scrollLeft !== l)) { n.scrollTop = t; n.scrollLeft = l; }
    if (Math.abs(window.scrollY - wy) > 1) window.scrollTo(0, wy);
    SIG.set(old, p.sig); };
  const abort = () => { const p = P; if (!p) return; P = null; clearTimeout(p.hard); p.mo.disconnect(); p.tmp.remove(); if (p.v6keep && p.v6keep.isConnected) S.__v6host = p.v6keep; // a pessoa tocou: a tela atual fica e o redesenho volta depois
    clearTimeout(abort.t); abort.t = realST(function again() { if (performance.now() - userTs < 1200) { abort.t = realST(again, 600); return; } try { drawTab(); } catch {} }, 1300); };
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach((t) => window.addEventListener(t, abort, true));
  const stable = function (self, args) {
    if (P) { const p = P; P = null; clearTimeout(p.hard); p.mo.disconnect(); p.tmp.remove(); if (p.v6keep && p.v6keep.isConnected) S.__v6host = p.v6keep; } // um redesenho mais novo substitui o que ainda montava
    const old = L();
    if (!old || old.hidden || !old.childElementCount || !SIG.has(old)) { const r = _dt.apply(self, args); try { const b = L(); if (b) record(b); } catch {} return r; }
    if (editing(old)) { if (!pend) { pend = true; old.addEventListener('focusout', () => realST(() => { pend = false; try { drawTab(); } catch {} }, 60), { once: true }); } return; }
    const wy0 = window.scrollY, oy0 = old.scrollTop, inner0 = scrollers(old); const tabWas = S.tab, owned = new Set(); old.querySelectorAll('*').forEach((n) => owned.add(n));
    const tmp = document.createElement('div'); tmp.id = 'lista'; tmp.className = [...old.classList].filter((c) => !SKIP_CLS.test(c)).join(' ') + ' rr-tmp';
    tmp.setAttribute('aria-hidden', 'true'); tmp.inert = true;
    const cs = getComputedStyle(old);
    for (const [k, v] of [['position', 'absolute'], ['left', '0'], ['top', '0'], ['width', cs.width], ['box-sizing', cs.boxSizing], ['visibility', 'hidden'], ['pointer-events', 'none'], ['opacity', '0']]) tmp.style.setProperty(k, v, 'important');
    old.before(tmp);
    // raízes sombra que a tela reaproveita (Comunidade, Desafio): registra o que o redesenho muda dentro delas, para desfazer se nada mudou
    const sroots = [...old.querySelectorAll('*')].filter((n) => n.shadowRoot).map((h) => { const mo = new MutationObserver(() => {}); mo.observe(h.shadowRoot, { childList: true, subtree: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true }); return { h, mo, parent: h.parentNode, next: h.nextSibling }; });
    // Comunidade/Desafio reaproveitam a raiz sombra da tela (S.__v6host): no redesenho de fundo, a cópia invisível ganha uma raiz
    // própria (monta e recebe os estilos por trás); a antiga volta a valer se nada mudou ou se a montagem for cancelada.
    const v6keep = null;
    let r, ok = false; hold();
    try { r = _dt.apply(self, args); ok = true; } catch (err) { console.warn('render estável', err); }
    try {
      const moved = [...tmp.querySelectorAll('*')].some((n) => owned.has(n)), sig = tmp.innerHTML + shadowAll(tmp);
      const v6new = S.__v6host; const v6back = () => { if (v6keep && v6keep.isConnected) S.__v6host = v6keep; };
      if (!ok || (!tmp.childElementCount && !moved)) { tmp.remove(); release(false); v6back(); if (!ok) { try { const r2 = _dt.apply(self, args); record(L()); return r2; } catch {} } return r; }
      const srecs = sroots.map((x) => { const rr = x.mo.takeRecords(); x.mo.disconnect(); return [x, rr]; });
      if (!moved && S.tab === tabWas && (sig === SIG.get(old) || sigNoV6(sig) === sigNoV6(SIG.get(old) || ''))) { tmp.remove(); release(false); v6back(); for (const [, rr] of srecs) { try { rrUndo(rr); } catch {} } return r; } // nada mudou: tela intocada
      if (moved && ok && S.tab === tabWas) { // reaproveitou a raiz (Comunidade/Desafio): desfaz por dentro e devolve a raiz ao lugar. Essas telas
        // se repintam sozinhas quando os dados delas chegam; o redesenho de fundo só as fazia passar por "Carregando…" e voltar.
        try { for (const [, rr] of srecs) rrUndo(rr); for (const [x] of srecs) if (!old.contains(x.h)) { if (x.next && x.next.parentNode === x.parent) x.parent.insertBefore(x.h, x.next); else x.parent.append(x.h); }
          tmp.remove(); release(false); if (old.scrollTop !== oy0) old.scrollTop = oy0; for (const [n, t, l] of inner0) if (n.isConnected) { n.scrollTop = t; n.scrollLeft = l; } if (Math.abs(window.scrollY - wy0) > 1) window.scrollTo(0, wy0); return r; } catch (e) { console.warn('render estável (raiz)', e); } }
      if (moved || S.tab !== tabWas) { // a tela reaproveitou um pedaço da antiga (ex.: Comunidade): aplica já
        keepCls(old, tmp); old.replaceChildren(...tmp.childNodes); tmp.remove(); if (old.scrollTop !== oy0) old.scrollTop = oy0; for (const [n, t, l] of inner0) if (n.isConnected) { n.scrollTop = t; n.scrollLeft = l; } if (Math.abs(window.scrollY - wy0) > 1) window.scrollTo(0, wy0); SIG.set(old, sig); release(true); return r; }
      // mudou: a tela nova termina de montar por trás (decorações, estilos, Hoje novo) e só então troca, de uma vez
      const p = { old, tmp, sig, last: performance.now(), t0: performance.now(), v6keep, v6new }; P = p;
      p.mo = new MutationObserver(() => { p.last = performance.now(); }); p.mo.observe(tmp, { childList: true, subtree: true, attributes: true, characterData: true });
      BUILD++; try { releaseFast(); } finally { BUILD--; }
      const tick = () => { if (P !== p) return; const now = performance.now(); if (now - p.t0 >= 600 && now - p.last >= 350) return swap(p); p.hard = realST(tick, 16); };
      p.hard = realST(tick, 30); realST(() => { if (P === p) swap(p); }, 2200);
    } catch (err) { console.warn('render estável (aplicar)', err); try { tmp.remove(); } catch {} P = null; release(true); }
    return r;
  };
  drawTab = function () {
    if (held) return _dt.apply(this, arguments); // reentrada durante a montagem
    if (userPath()) { if (P) { const p = P; P = null; clearTimeout(p.hard); p.mo.disconnect(); p.tmp.remove(); if (p.v6keep && p.v6keep.isConnected) S.__v6host = p.v6keep; } const r = _dt.apply(this, arguments); try { const b = L(); if (b) record(b); } catch {} return r; }
    return stable(this, arguments);
  };
  // troca de aba é sempre gesto da pessoa (mesmo quando chamada por código depois de um toque)
  const _gt = goTab; goTab = function () { mark(); return _gt.apply(this, arguments); };
}
// Aviso "Instale o Livroverso": enquanto aparece, reserva o espaço no fim da lista (não cobre o último cartão);
// e se a pessoa não responder em 20 s, sai sozinho até a próxima abertura do app (sem contar como "Agora não").
// Toast (24/11): sobe para cima do aviso enquanto ele aparece (não se mistura com o cartão) e ocupa a largura do texto
// (com left:50% ele encolhia para metade da tela e quebrava em várias linhas).
{ const st = document.createElement('style'); st.textContent = ':host([data-inst]) #lista{padding-bottom:calc(var(--inst-h, 0px) + 12px)!important}'; TR.append(st);
  { const s2 = document.createElement('style'); s2.textContent = '#toast.toast{width:max-content!important;max-width:calc(100vw - 32px)!important}'
      + 'html[data-inst] #toast.toast{bottom:calc(78px + env(safe-area-inset-bottom, 0px) + var(--inst-h, 0px) + 10px)!important}'; document.head.append(s2); }
  const host = document.getElementById('toca-host'), H = document.documentElement;
  const sync = () => { const w = document.querySelector('.inst-pop'); if (w) { const ih = Math.round(w.getBoundingClientRect().height) + 'px'; host.style.setProperty('--inst-h', ih); host.setAttribute('data-inst', ''); H.style.setProperty('--inst-h', ih); H.setAttribute('data-inst', ''); } else { host.removeAttribute('data-inst'); H.removeAttribute('data-inst'); } };
  let seen = null;
  new MutationObserver(() => { sync(); const w = document.querySelector('.inst-pop'); if (w && w !== seen) { seen = w; setTimeout(() => { if (w.isConnected) { w.style.transition = 'transform .3s ease, opacity .3s ease'; w.style.transform = 'translateY(30px)'; w.style.opacity = '0'; setTimeout(() => { w.remove(); }, 320); } }, 20000); } }).observe(document.body, { childList: true }); }
// Telas por cima (#shelflist: página do livro, listas, Você em tela cheia etc.): o refresh() de fundo chamava S.listRedraw() e a
// tela era refeita do zero. Agora o redesenho de fundo roda "em transação": se o resultado é igual ao que está na tela,
// as mudanças do DOM são desfeitas na hora (mesmos nós, rolagem e estado), antes de qualquer pintura.
{
  const realST = window.setTimeout;
  const shadowAll = (root) => { let s = ''; root.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) s += '#sr{' + e.shadowRoot.innerHTML + shadowAll(e.shadowRoot) + '}'; }); return s; };
  const sigOf = (v) => v.innerHTML + shadowAll(v);
  const LSIG = RR_LSIG; let userTs = -1e9;
  ['click', 'keydown', 'input', 'change', 'submit', 'popstate'].forEach((t) => window.addEventListener(t, () => { userTs = performance.now(); }, true));
  const userPath = () => performance.now() - userTs < 700;
  const scrollers = (v) => { const out = [[v, v.scrollTop, v.scrollLeft]]; v.querySelectorAll('*').forEach((c) => { if (c.scrollTop || c.scrollLeft) out.push([c, c.scrollTop, c.scrollLeft]); }); return out; };
  const undo = rrUndo;
  const cvNorm = (html) => { const t = document.createElement('template'); t.innerHTML = html; t.content.querySelectorAll('.cv').forEach((n) => { n.replaceWith(document.createElement('cv')); }); return t.innerHTML; };
  const cvOnly = (a, b) => { if (a === b || a.includes('#sr{') || b.includes('#sr{')) return false; try { return cvNorm(a) === cvNorm(b); } catch { return false; } };
  const txn = (v, fn) => {
    const a = TR.activeElement || document.activeElement;
    if (a && v.contains(a) && a.matches('input:not([type=checkbox]):not([type=radio]):not([type=button]), textarea, [contenteditable=true], [contenteditable=""]')) return; // digitando: não refaz por baixo
    RR_SKIP = 1; const before = LSIG.get(v) || sigOf(v), sc = scrollers(v), wy = window.scrollY;
    const mo = new MutationObserver(() => {}); mo.observe(v, { childList: true, subtree: true, attributes: true, attributeOldValue: true, characterData: true, characterDataOldValue: true });
    const realT = window.setTimeout, realR = window.requestAnimationFrame; const held = [];
    window.setTimeout = function (f, ms, ...x) { held.push(() => realT(f, ms, ...x)); return 0; }; window.requestAnimationFrame = function (f) { held.push(() => realR(f)); return 0; };
    let err = null; try { fn(); } catch (e) { err = e; } finally { window.setTimeout = realT; window.requestAnimationFrame = realR; }
    const recs = mo.takeRecords(); mo.disconnect();
    if (!err && recs.length && sigOf(v) === before) { try { undo(recs); } catch (e) { console.warn('render estável (desfazer)', e); held.forEach((h) => h()); } }
    else if (!err && recs.length && cvOnly(before, sigOf(v))) {
      // só capas mudaram (ex.: a capa chegou do catálogo): a página fica e só as capas são trocadas no lugar, sem recriar nada
      const nsig = sigOf(v), fresh = [...v.querySelectorAll('.cv')].map((n) => n.cloneNode(true)); try { undo(recs); } catch {}
      const live = [...v.querySelectorAll('.cv')];
      if (live.length === fresh.length) live.forEach((o, i) => { const n = fresh[i]; if (o.outerHTML === n.outerHTML) return; if (o.classList.contains('img') && !n.classList.contains('img')) return; // capa com imagem não volta a ser a gerada
        for (const at of [...o.attributes]) if (!n.hasAttribute(at.name)) o.removeAttribute(at.name);
        for (const at of [...n.attributes]) if (o.getAttribute(at.name) !== at.value) o.setAttribute(at.name, at.value);
        if (o.innerHTML !== n.innerHTML) o.innerHTML = n.innerHTML; });
      LSIG.set(v, nsig); }
    else if (!err && recs.length && !v.querySelector('.v4host, .v5host, .v6host') && ![...v.querySelectorAll('*')].some((n) => n.shadowRoot)) {
      // mudou de verdade: a tela atual fica congelada por cima (cópia) enquanto a nova termina de montar por baixo; troca quando assenta
      const nsig = sigOf(v); try { undo(recs); } catch {}
      const cover = v.cloneNode(true); cover.classList.add('rr-cover'); cover.setAttribute('aria-hidden', 'true'); cover.style.setProperty('pointer-events', 'none', 'important');
      v.after(cover); cover.scrollTop = v.scrollTop; [...cover.querySelectorAll('*')].forEach(() => {}); 
      held.length = 0; window.setTimeout = function (f, ms, ...x) { held.push(() => realT(rrTx(f), 0, ...x)); return 0; }; window.requestAnimationFrame = function (f) { held.push(() => realR(rrTx(f))); return 0; };
      try { fn(); } catch (e) { err = e; } finally { window.setTimeout = realT; window.requestAnimationFrame = realR; }
      LSIG.set(v, nsig); RR_TX.fast++; RR_TX.build++; try { held.forEach((h) => h()); } finally { RR_TX.build--; }
      for (const [n, t, l] of sc) if (n.isConnected && (n.scrollTop !== t || n.scrollLeft !== l)) { n.scrollTop = t; n.scrollLeft = l; }
      let last = performance.now(); const t0 = last; const m2 = new MutationObserver(() => { last = performance.now(); }); m2.observe(v, { childList: true, subtree: true, attributes: true, characterData: true });
      const done = () => { if (!cover.isConnected) return; RR_TX.fast = Math.max(0, RR_TX.fast - 1); m2.disconnect(); cover.remove(); window.removeEventListener('pointerdown', done, true); window.removeEventListener('touchstart', done, true); window.removeEventListener('keydown', done, true); };
      ['pointerdown', 'touchstart', 'keydown'].forEach((t) => window.addEventListener(t, done, true));
      const tick = () => { if (!cover.isConnected) return; const now = performance.now(); if ((now - t0 >= 60 && now - last >= 50) || now - t0 > 1500 || v.hidden) return done(); realT(tick, 16); }; realT(tick, 30);
      if (err) throw err; return; }
    else { LSIG.set(v, sigOf(v)); held.forEach((h) => h()); }
    for (const [n, t, l] of sc) if (n.isConnected && (n.scrollTop !== t || n.scrollLeft !== l)) { n.scrollTop = t; n.scrollLeft = l; }
    if (Math.abs(window.scrollY - wy) > 1) window.scrollTo(0, wy);
    if (err) throw err;
  };
  refresh = function () {
    try { drawAll(); const v = $('#shelflist'); if (v && !v.hidden && S.listRedraw) { if (userPath()) { S.listRedraw(); LSIG.set(v, sigOf(v)); } else { txn(v, () => S.listRedraw());
        // vários pontos fazem "refresh(); S.listRedraw()" logo em seguida (ex.: capas completadas do catálogo): a 2ª chamada, na mesma
        // tarefa, refazia a tela inteira por fora da transação. Ela vira nada até o fim desta tarefa (a tela já está atualizada).
        const orig = S.listRedraw, skip = function () {}; S.listRedraw = skip; queueMicrotask(() => { if (S.listRedraw === skip) S.listRedraw = orig; }); } } } catch (err) { console.error('toca', err); }
  };
  void realST;
}
// O botão do menu no topo era refeito a cada atualização (o ícone trocava e voltava): só desenha quando ainda não está lá.
{ const _pg = paintGtop; paintGtop = function () { const av = $('#g-av'), keep = av && av.classList.contains('g-menu') && av.querySelector('svg') ? [...av.childNodes] : null; const r = _pg.apply(this, arguments); if (keep && av.isConnected) av.replaceChildren(...keep); return r; }; }
// Folha do editor (ex.: Ajustes › Silenciadas) ficava aberta depois do voltar: o voltar agora fecha a folha do editor também
// (se tiver texto digitado, ela fica: nada se perde).
window.addEventListener('popstate', () => { try { const ed = $('#editor'); if (!ed || ed.hidden) return;
  if ([...ed.querySelectorAll('textarea, input[type=text], input:not([type])')].some((t) => t.value && t.value !== t.defaultValue)) return;
  closeEd(); } catch {} }, true);
