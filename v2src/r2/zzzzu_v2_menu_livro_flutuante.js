// ---------- v2: menu do livro flutuante (Bia, 27/11) ----------
// "Eu gosto do tamanho desse menu" (o menuzinho de livro fora da estante) → "Sim" para os livros dela também.
// O menu do livro (v5bm) deixa de ser folha de baixo para cima e abre como balão junto da capa (ou do "•••") que foi
// tocada: só o tamanho dos itens, sem cobrir a tela, fundo mais leve. Os itens e o que cada um faz não mudam; o que
// abre a partir dele (Prazo, Parar de ler, Estantes...) continua sendo folha. Sem um ponto de toque recente
// (ex.: aberto por código), o balão fica no meio da tela.
const V5POP_CSS = `.v4ler.v5pop .veil{background:rgba(10,6,20,.28)}
.v4ler.v5pop .sheet{right:auto;bottom:auto;width:min(340px,calc(100% - 24px));max-width:none;margin:0;max-height:calc(100% - 24px);border-radius:22px;padding:8px 8px 6px;box-shadow:0 18px 50px rgba(0,0,0,.45);border:1px solid var(--line);animation:v5popin .16s ease-out}
.v4ler.v5pop.v4keep .sheet{animation:none}
.v4ler.v5pop .sheet .grab{display:none}
.v4ler.v5pop .v5hd{background:var(--soft);border-radius:16px;padding:8px 10px;margin-bottom:4px}
.v4ler.v5pop .v5hd .sh-bk{margin:0;gap:10px}.v4ler.v5pop .v5hd .sh-bk .cv{width:40px!important;min-width:40px;height:60px!important}
.v4ler.v5pop .v5hd h3{font-size:15px;line-height:1.25;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v4ler.v5pop .v5hd .mut{font-size:12px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v4ler.v5pop .v5hd .sh-lk{font-size:12px}
.v4ler.v5pop .list .li{padding:9px 10px;border-bottom:0;border-radius:12px;font-size:14px;gap:11px;min-height:44px}
.v4ler.v5pop .list .li small{display:none}.v4ler.v5pop .list .li[data-a=v5prazo] small{display:block;font-size:12px}
.v4ler.v5pop .list .li:active{background:var(--soft)}
@keyframes v5popin{from{opacity:0;transform:scale(.96)}}`;
let V5POP_PT = null; // último toque: { el, t }
document.addEventListener('pointerdown', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : [ev.target]; const el = p.find((n) => n && n.nodeType === 1); V5POP_PT = el ? { el: el.closest('.cv, .es-cv, button, [role=button], .bk') || el, t: Date.now() } : null; } catch {} }, true);
let V5POP = null; // retângulo da capa que abriu o menu
{ const _m = v5Menu; v5Menu = function (e) {
    let r = null; try { const p = V5POP_PT; if (p && Date.now() - p.t < 2500 && p.el.isConnected) { const b = p.el.getBoundingClientRect(); if (b.width || b.height) r = { l: b.left, t: b.top, r: b.right, b: b.bottom }; } } catch {}
    V5POP = r || { mid: 1 };
    return _m.apply(this, arguments); }; }
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments);
    try { const R = V4; if (!R) return r; const st = v4State(), on = st.sheet === 'v5bm' && !!V5POP;
      if (!on) { if (st.sheet !== 'v5bm') V5POP = null; R.classList.remove('v5pop'); const sh = R.querySelector('.sheet'); if (sh && sh.dataset.v5pop) { sh.style.left = sh.style.top = ''; delete sh.dataset.v5pop; } return r; }
      const root = R.getRootNode && R.getRootNode(); if (root && root !== document && !root.querySelector('style.v5popcss')) { const s = document.createElement('style'); s.className = 'v5popcss'; s.textContent = V5POP_CSS; root.append(s); }
      R.classList.add('v5pop'); const sh = R.querySelector('.sheet'); if (!sh) return r; sh.dataset.v5pop = '1';
      const box = R.getBoundingClientRect(), W = box.width, H = box.height, w = sh.offsetWidth, h = sh.offsetHeight, a = V5POP, M = 12;
      let left, top;
      if (a.mid) { left = (W - w) / 2; top = (H - h) / 2; }
      else { const al = a.l - box.left, ar = a.r - box.left, at = a.t - box.top, ab = a.b - box.top;
        left = Math.min(Math.max(M, al), W - w - M);
        top = ab + 6; if (top + h > H - M) top = at - h - 6; if (top < M) top = Math.max(M, (H - h) / 2); }
      sh.style.left = Math.round(Math.max(M, left)) + 'px'; sh.style.top = Math.round(Math.max(M, top)) + 'px';
    } catch (err) { console.warn('menu flutuante', err); }
    return r; }; }
