// Sessão de leitura (Bia, 20/11): o céu vai de ponta a ponta (a cor da barra do navegador acompanha o topo do céu e volta
// ao sair), botão "Luz" ao lado de Som ambiente (camada escura por cima, 0% a 85%, lembra a última escolha; escurece o
// app, não o brilho do aparelho) e tela acesa durante a sessão (Wake Lock, tolerando recusa).
{ const SKY = '#2c2152';
  const KEY = 'bear.v6luz'; const getLuz = () => { try { return Math.min(85, Math.max(0, Number(localStorage.getItem(KEY)) || 0)); } catch { return 0; } };
  const setLuz = (v) => { try { localStorage.setItem(KEY, String(v)); } catch {} };
  const CSS = `.ses{background:radial-gradient(120% 70% at 50% 0,#3b2a6b,#17112c 60%,#0d0a1a),${SKY}!important}
.ses .top{background:transparent!important}
.ses .top .v6luzb{border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:99px;padding:8px 12px;font-size:12.5px;font-weight:900;display:inline-flex;gap:6px;align-items:center;margin-left:auto;margin-right:8px}
.ses .top .v6luzb svg{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2}
.v6dim{position:absolute;inset:0;background:#000;pointer-events:none;z-index:40}
.v6luzp{position:absolute;right:16px;top:calc(env(safe-area-inset-top,0px) + 60px);z-index:60;width:min(280px,calc(100% - 32px));background:rgba(20,15,40,.96);border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:12px 14px;color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.45)}
.v6luzp b{font-size:13px}.v6luzp input{width:100%;accent-color:#e0ad3a;margin:10px 0 4px}.v6luzp small{display:block;font-size:11px;color:rgba(255,255,255,.65)}
.v6luzp .r{display:flex;justify-content:space-between;align-items:center}
.v6pgl{display:flex;align-items:center;gap:6px;margin:6px 0 2px;font-weight:800;font-size:13px}.v6pgl input{width:64px;text-align:center;font:inherit;font-weight:900;border:1.5px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:inherit;border-radius:10px;padding:5px}.v6pgl button{width:30px;height:30px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:inherit;font-weight:900}.v6pgx{display:block;opacity:.7;font-size:11.5px;margin-bottom:6px}.v6pgup{margin-top:10px}`;
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  let lock = null, prevTheme = null, on = false;
  const meta = () => { let m = document.querySelector('meta[name="theme-color"]'); if (!m) { m = document.createElement('meta'); m.name = 'theme-color'; document.head.append(m); } return m; };
  const wake = async () => { try { if (navigator.wakeLock && document.visibilityState === 'visible' && !lock) { lock = await navigator.wakeLock.request('screen'); lock.addEventListener('release', () => { lock = null; }); } } catch { lock = null; } };
  const unwake = () => { try { lock && lock.release(); } catch {} lock = null; };
  const root = () => { const h = [...TR.children].find((n) => n.classList && n.classList.contains('v4host')); return h && h.shadowRoot; };
  const enter = () => { on = true; const m = meta(); if (prevTheme == null) prevTheme = m.getAttribute('content') || ''; m.setAttribute('content', SKY); wake(); };
  const leave = () => { on = false; if (prevTheme != null) { meta().setAttribute('content', prevTheme); prevTheme = null; } unwake(); };
  const decorate = (sr) => {
    if (!sr.querySelector('style[data-v6luz]')) { const s = document.createElement('style'); s.dataset.v6luz = 1; s.textContent = CSS; sr.append(s); }
    const ses = sr.querySelector('.v4ler .ses'); if (!ses) return;
    const top = ses.querySelector('.top'); if (top && !top.querySelector('.v6luzb')) { const b = document.createElement('button'); b.className = 'v6luzb'; b.type = 'button'; b.setAttribute('aria-label', 'Luz da tela'); b.innerHTML = MOON + 'Luz';
      const amb = top.querySelector('[data-s=amb]'); amb ? amb.before(b) : top.append(b);
      b.addEventListener('click', (ev) => { ev.stopPropagation(); const p = ses.querySelector('.v6luzp'); if (p) return p.remove(); const v = getLuz();
        const d = document.createElement('div'); d.className = 'v6luzp'; d.innerHTML = `<div class="r"><b>Luz</b><span data-v>${v}% mais escuro</span></div><input type="range" min="0" max="85" step="5" value="${v}" aria-label="Escurecer a tela"><small>Escurece o app, não o brilho do aparelho.</small>`;
        d.addEventListener('click', (e2) => e2.stopPropagation()); const r = d.querySelector('input');
        r.addEventListener('input', () => { setLuz(+r.value); d.querySelector('[data-v]').textContent = r.value + '% mais escuro'; paint(ses); });
        ses.append(d); setTimeout(() => { const out = (e3) => { if (!d.isConnected) return sr.removeEventListener('pointerdown', out, true); if (!e3.composedPath().includes(d) && !e3.composedPath().includes(b)) { d.remove(); sr.removeEventListener('pointerdown', out, true); } }; sr.addEventListener('pointerdown', out, true); }, 0); }); }
    paint(ses);
  };
  const paint = (ses) => { let dim = ses.querySelector(':scope > .v6dim'); const v = getLuz(); if (!v) { dim && dim.remove(); return; } if (!dim) { dim = document.createElement('div'); dim.className = 'v6dim'; ses.append(dim); } dim.style.opacity = String(v / 100); };
  let tm = 0;
  const check = () => { tm = 0; const sr = root(); const ses = sr && sr.querySelector('.v4ler .ses'); if (ses) { if (!on) enter(); decorate(sr); } else if (on) leave(); };
  const watch = () => { const sr = root(); if (!sr || sr.v6luzw) return; sr.v6luzw = 1; new MutationObserver(() => { if (!tm) tm = setTimeout(check, 50); }).observe(sr, { childList: true, subtree: true }); check(); };
  new MutationObserver(() => watch()).observe(TR, { childList: true }); watch();
  document.addEventListener('visibilitychange', () => { if (on && document.visibilityState === 'visible') wake(); });
}
// Folhas da camada v4 (Encerrar, Atualizar...): arrastar a folha para baixo fecha como tocar fora; na sessão, volta para ela
// (nunca encerra: encerrar de fato só com "Salvar").
{ const arm = () => { const h = [...TR.children].find((n) => n.classList && n.classList.contains('v4host')); const sr = h && h.shadowRoot; if (!sr || sr.v6drag) return; sr.v6drag = 1;
    let y0 = null, sh = null;
    sr.addEventListener('pointerdown', (ev) => { const p = ev.composedPath(); sh = p.find((n) => n.classList && n.classList.contains('sheet')); if (!sh) return; const r = sh.getBoundingClientRect(); y0 = ev.clientY - r.top < 56 ? ev.clientY : null; }, true);
    sr.addEventListener('pointermove', (ev) => { if (y0 == null || !sh) return; const dy = Math.max(0, ev.clientY - y0); sh.style.transform = dy ? `translateY(${dy}px)` : ''; }, true);
    const end = (ev) => { if (y0 == null || !sh) return; const dy = ev.clientY - y0; const s2 = sh; y0 = null; sh = null; s2.style.transform = ''; if (dy > 90) { const v = s2.parentElement && s2.parentElement.querySelector('.veil'); if (v) v.click(); } };
    sr.addEventListener('pointerup', end, true); sr.addEventListener('pointercancel', end, true); };
  new MutationObserver(arm).observe(TR, { childList: true }); arm(); }
