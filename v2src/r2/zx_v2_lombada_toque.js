// Toque na lombada (Bia, 22/11): fora do Organizar/Decorar, o 1º toque levanta o livro uns 30% e mostra a capa no lugar,
// no tamanho do próprio livro (como o livro que sobe na faixa "Por mês"); 2º toque abre a página do livro.
// Tocar fora, voltar ou Esc devolve o livro; tocar noutra lombada troca. Segurar continua abrindo o menu.
// De frente: só levanta um pouco. Deitado (pilha): desliza um pouco para fora. Vale na Biblioteca e na estante do perfil.
(() => {
  // mora na raiz do app (TR) como ".pop": o Voltar do celular e o "sair fecha tudo" já sabem fechar
  const CSS = `
.pop.lvlift{position:fixed!important;inset:0!important;z-index:9990!important;background:transparent!important;margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;max-height:none!important;width:auto!important;height:auto!important;animation:none!important;touch-action:none;transform:none!important;backdrop-filter:none!important}
.lvlift .lvl-cv{position:fixed;border-radius:3px 6px 6px 3px;overflow:hidden;box-shadow:0 14px 26px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.35);transform-origin:50% 100%;cursor:pointer;background:#2a2433}
.lvlift .lvl-cv > *{width:100%!important;height:100%!important;max-width:none!important;border-radius:0!important;display:block}
.lvlift .lvl-cv img{width:100%;height:100%;object-fit:cover;display:block}
.lvlift .lvl-gen{display:flex;align-items:center;justify-content:center;text-align:center;padding:8%;box-sizing:border-box;font:700 12px/1.15 var(--f-disp,Georgia,serif);color:#fff}
.lvlift .lvl-tag{position:fixed;transform:translateX(-50%);max-width:min(240px,80vw);padding:6px 11px;border-radius:12px;background:rgba(20,16,28,.92);color:#fff;font:600 12.5px/1.25 Nunito,system-ui,sans-serif;text-align:center;box-shadow:0 6px 16px rgba(0,0,0,.35);pointer-events:none}
.lvlift .lvl-tag b{display:block;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.lvlift .lvl-tag small{display:block;opacity:.82;font-size:11.5px}
.lvlift .lvl-tag i{display:block;opacity:.6;font-style:normal;font-size:10.5px;margin-top:1px}
`;
  const ensureCss = () => { try { if (TR && !TR.querySelector('style[data-lvlift]')) { const st = document.createElement('style'); st.dataset.lvlift = 1; st.textContent = CSS; TR.append(st); } } catch {} };
  // a lombada fica noutra raiz (estante): esconder/levantar com estilo direto no elemento
  const SAVE = ['visibility', 'transform', 'transition', 'filter', 'position', 'z-index'];
  const setSt = (el, o) => { el.__lvlSt = el.__lvlSt || SAVE.map((k) => [k, el.style.getPropertyValue(k), el.style.getPropertyPriority(k)]); for (const k in o) el.style.setProperty(k, o[k], 'important'); };
  const resetSt = (el) => { const sv = el.__lvlSt; if (!sv) return; sv.forEach(([k, v, pr]) => { if (v) el.style.setProperty(k, v, pr); else el.style.removeProperty(k); }); delete el.__lvlSt; };
  const RM = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
  const ACTS = new Set(['v5book', 'shxvb']);
  let L = null, downAt = 0, downXY = null;
  const fmtN = (n) => String(Math.round(n * 2) / 2).replace('.', ',');
  function info(id) { let t = '', s = '';
    try { const e = typeof v5Book === 'function' ? v5Book(id) : null;
      if (e) { t = e.title || ''; const S = e.status;
        if (S === 'LENDO') { let p = 0; try { p = Math.round(readingInfo(e).pct || 0); } catch {} s = 'Lendo' + (p > 0 ? ' · ' + Math.min(100, p) + '%' : ''); }
        else if (S === 'LIDO') { const pw = Number(e.review && e.review.paws) || 0; s = pw ? '★ ' + fmtN(pw) : 'Lido'; }
        else s = { QUERO: 'Quero ler', PAUSADO: 'Pausado', ABANDONADO: 'Abandonado' }[S] || ''; return { t, s, img: e.cover || null, a: e.author || '' }; } } catch {}
    try { const b = typeof shById === 'function' ? shById(id) : null; if (b) return { t: b.t, s: b.st === 'lido' ? 'Lido' : b.st === 'lendo' ? 'Lendo' : '', img: b.img || null, a: b.a || '' }; } catch {}
    return { t: '', s: '', img: null, a: '' }; }
  function cleanup(back) { const l = L; if (!l) return; L = null; l.box.style.pointerEvents = 'none';
    try { resetSt(l.el); } catch {}
    try { l.mo && l.mo.disconnect(); } catch {} removeEventListener('scroll', l.onScroll, true); removeEventListener('keydown', l.onKey, true);
    if (l.box.isConnected) { if (back && l.cv && !RM() && l.cv.animate) { const a = l.cv.animate([{ transform: l.t1 || 'translateY(0) rotateY(0)', opacity: 1 }, { transform: l.t0 || `translateY(${l.dy}px) rotateY(80deg)`, opacity: .2 }], { duration: 180, easing: 'ease-in' }); a.onfinish = () => l.box.remove(); } else l.box.remove(); } }
  function lift(el, a, ev) { if (L && L.el === el) return; cleanup(false);
    const id = el.dataset.id || el.dataset.bid; if (!id) return; const kind = el.closest('.pile') ? 'pile' : el.classList.contains('face') ? 'face' : 'spine'; // .pb também é a lombada brochura: pilha é quem está dentro de .pile
    const r = el.getBoundingClientRect(); if (!r.width) return; const I = info(id);
    const box = document.createElement('div'); box.className = 'pop lvlift'; ensureCss(); box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', (I.t || 'Livro') + ': toque de novo para abrir');
    const l = L = { el, a, id, box, dy: 0 };
    let cvEl = null, top = r.top, h = r.height, cx = r.left + r.width / 2;
    if (kind === 'pile') { // deitado (Bia 24/11): a capa sai do livro deitado, em pé, no tamanho do livro, logo acima da pilha
      const bk = shById(id) || {}; let H = 0; try { H = spnGeo(bk, false).h; } catch {} H = Math.max(80, H || Math.round(r.width / 0.86)); const w = Math.round(H * 0.66), lft = Math.max(6, Math.min(innerWidth - w - 6, cx - w / 2));
      top = Math.max(64, Math.min(r.top - H - 6, innerHeight - H - 90)); h = H;
      cvEl = document.createElement('div'); cvEl.className = 'lvl-cv'; cvEl.style.cssText = `left:${lft}px;top:${top}px;width:${w}px;height:${H}px;transform-origin:50% 100%`;
      let html = ''; try { html = typeof v4cv === 'function' ? v4cv({ title: I.t, author: I.a, cover: I.img }) : ''; } catch {}
      cvEl.innerHTML = html || (I.img ? `<img alt="" src="${esc(I.img)}">` : `<span class="lvl-gen" style="background:${getComputedStyle(el).getPropertyValue('--c') || '#4b3f66'}">${esc(I.t)}</span>`);
      box.append(cvEl); l.cv = cvEl; cx = lft + w / 2;
      { const gen = () => { try { cvEl.innerHTML = typeof v4cv === 'function' ? v4cv({ title: I.t, author: I.a, cover: null }) : `<span class="lvl-gen">${esc(I.t)}</span>`; } catch {} }; const im = cvEl.querySelector('img'); if (im) { im.addEventListener('error', gen, { once: true }); if (im.complete && !im.naturalWidth) gen(); } }
      l.t0 = `translate(${Math.round(r.left + r.width / 2 - cx)}px,${Math.round(r.bottom - (top + H))}px) scale(${(r.width / w).toFixed(3)},${(r.height / H).toFixed(3)})`; l.t1 = 'translate(0,0) scale(1,1)'; setSt(el, { visibility: 'hidden' });
      if (!RM() && cvEl.animate) cvEl.animate([{ transform: l.t0, opacity: .7 }, { transform: l.t1, opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.2,1.2,.4,1)' }); }
    else if (kind === 'spine') { // capa no tamanho do livro, levantada ~30% e girando no lugar
      const w = Math.round(h * 0.66), lft = Math.max(6, Math.min(innerWidth - w - 6, cx - w / 2)); l.dy = Math.round(h * 0.3); top = Math.max(r.top - l.dy, Math.min(r.top, 64)); l.dy = Math.round(r.top - top);
      cvEl = document.createElement('div'); cvEl.className = 'lvl-cv'; cvEl.style.cssText = `left:${lft}px;top:${top}px;width:${w}px;height:${h}px`;
      let html = ''; try { html = typeof v4cv === 'function' ? v4cv({ title: I.t, author: I.a, cover: I.img }) : ''; } catch {}
      cvEl.innerHTML = html || (I.img ? `<img alt="" src="${esc(I.img)}">` : `<span class="lvl-gen" style="background:${getComputedStyle(el).getPropertyValue('--c') || '#4b3f66'}">${esc(I.t)}</span>`);
      box.append(cvEl); l.cv = cvEl;
      // capa que falha ao carregar vira a capa gerada (com o título); a animação não espera a imagem
      { const gen = () => { try { cvEl.innerHTML = typeof v4cv === 'function' ? v4cv({ title: I.t, author: I.a, cover: null }) : `<span class="lvl-gen">${esc(I.t)}</span>`; } catch {} }; const im = cvEl.querySelector('img'); if (im) { im.addEventListener('error', gen, { once: true }); if (im.complete && !im.naturalWidth) gen(); } } setSt(el, { visibility: 'hidden' }); cx = lft + w / 2;
      if (!RM() && cvEl.animate) cvEl.animate([{ transform: `translateY(${l.dy}px) rotateY(80deg) scaleX(${(r.width / w).toFixed(3)})`, opacity: .6 }, { transform: 'translateY(0) rotateY(0) scaleX(1)', opacity: 1 }], { duration: 300, easing: 'cubic-bezier(.2,1.3,.4,1)' }); }
    else { setSt(el, { transform: kind === 'pile' ? 'translateX(22%)' : 'translateY(-12%)', transition: RM() ? 'none' : 'transform .26s cubic-bezier(.2,1.3,.4,1)', filter: 'drop-shadow(0 8px 10px rgba(0,0,0,.35))', position: 'relative', 'z-index': '5' }); const hit = document.createElement('div'); hit.className = 'lvl-cv'; hit.style.cssText = `left:${r.left + (kind === 'pile' ? r.width * 0.22 : 0)}px;top:${r.top - (kind === 'pile' ? 0 : r.height * 0.12)}px;width:${r.width}px;height:${r.height}px;background:transparent;box-shadow:none`; box.append(hit); l.cv = null; l.hit = hit; top = r.top - (kind === 'pile' ? 0 : r.height * 0.12); }
    const tag = document.createElement('div'); tag.className = 'lvl-tag'; tag.innerHTML = `<b>${esc(I.t || 'Livro')}</b>${I.s ? `<small>${esc(I.s)}</small>` : ''}<i>toque de novo para abrir</i>`;
    box.append(tag); TR.append(box);
    const th = tag.offsetHeight || 52, above = top - th - 8; tag.style.left = Math.max(10 + 120, Math.min(innerWidth - 130, cx)) + 'px'; tag.style.left = Math.max(tag.offsetWidth / 2 + 8, Math.min(innerWidth - tag.offsetWidth / 2 - 8, cx)) + 'px';
    tag.style.top = (above > 60 ? above : top + h + 8) + 'px';
    try { navigator.vibrate && navigator.vibrate(6); } catch {}
    // tocar: na capa abre; fora devolve (e se for outra lombada, troca)
    let pd = null;
    // segurar a capa levantada: a capa volta e abre o menu do livro (Bia 23/11), nunca os dois juntos
    let hold = 0, held = false; const menu = () => { clearTimeout(hold); if (L !== l) return; held = true; cleanup(false); setTimeout(() => { try { if (el.dataset.long === 'bm' && typeof v5Menu === 'function' && typeof v5Book === 'function') { try { navigator.vibrate && navigator.vibrate(12); } catch {} v5Menu(v5Book(el.dataset.id)); } else el.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, composed: true, cancelable: true })); } catch (err) { console.warn('segurar capa', err); } }, 180); };
    box.addEventListener('pointerdown', (e) => { pd = { x: e.clientX, y: e.clientY }; held = false; clearTimeout(hold); const onCv = (l.cv && l.cv.contains(e.target)) || (l.hit && l.hit.contains(e.target)); if (onCv) hold = setTimeout(menu, 450); });
    const stop = () => clearTimeout(hold); box.addEventListener('pointerup', stop); box.addEventListener('pointercancel', stop);
    box.addEventListener('pointermove', (e) => { if (pd && Math.hypot(e.clientX - pd.x, e.clientY - pd.y) > 12) { pd = null; stop(); cleanup(true); } });
    box.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); if (held) return; const onCv = (l.cv && l.cv.contains(e.target)) || (l.hit && l.hit.contains(e.target));
      if (onCv) { cleanup(false); try { el.dataset.lvlGo = '1'; el.click(); } finally { delete el.dataset.lvlGo; } return; }
      const x = e.clientX, y = e.clientY; cleanup(true);
      // outra lombada embaixo do dedo? levanta ela
      setTimeout(() => { const t = deepAt(x, y); const o = t && pick(t); if (o && o.el !== l.el) lift(o.el, o.a); }, 0); });
    l.onScroll = () => cleanup(false); addEventListener('scroll', l.onScroll, true);
    l.onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); cleanup(true); } }; addEventListener('keydown', l.onKey, true);
    // o Voltar do celular (01_voltar) e o closePop removem o ".pop": devolve o livro
    // abriu outra coisa por cima (menu do livro ao segurar, folha, página): a capa levantada sai junto (Bia 23/11)
    l.mo = new MutationObserver((ms) => { if (L !== l) return; if (!box.isConnected) return cleanup(false);
      for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && n !== box && n.tagName !== 'STYLE' && n.tagName !== 'SCRIPT' && !/toast|snack/i.test(n.className || '')) return cleanup(false); });
    l.mo.observe(TR, { childList: true });
    box.addEventListener('contextmenu', (e) => { e.preventDefault(); if (!held) menu(); }); }
  function deepAt(x, y) { let e = document.elementFromPoint(x, y); for (let i = 0; i < 6 && e && e.shadowRoot; i++) { const n = e.shadowRoot.elementFromPoint(x, y); if (!n || n === e) break; e = n; } return e; }
  function pick(t) { const el = t.closest && t.closest('[data-a]'); if (!el || !ACTS.has(el.dataset.a)) return null; if (!el.closest('.bsh') || el.closest('.dec')) return null;
    if (typeof shMode === 'function' && shMode()) return null; if (!(el.classList.contains('sp') || el.classList.contains('face') || el.classList.contains('pb'))) return null; return { el, a: el.dataset.a }; }
  addEventListener('pointerdown', (e) => { downAt = Date.now(); downXY = [e.clientX, e.clientY]; }, true);
  addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : []; const t = p[0]; if (!t || !t.closest) return; const o = pick(t); if (!o) return;
    if (o.el.dataset.lvlGo) return; // 2º toque (na capa): deixa abrir
    if (Date.now() - downAt > 450) return; // foi segurar: o menu cuida
    ev.preventDefault(); ev.stopImmediatePropagation(); lift(o.el, o.a, ev); }, true);
})();
