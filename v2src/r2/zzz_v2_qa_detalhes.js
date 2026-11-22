// ---------- Detalhes finais do teste completo (Bia, 22/11) ----------
// 1) área de toque ≥ 44 px sem mudar o visual: pseudo-elemento invisível em volta do alvo pequeno,
//    limitado pela metade do espaço até o vizinho (as áreas ampliadas não se sobrepõem);
// 2) contraste pelos tokens: --tx-ok (verde de texto) por tema; autor da lombada sem opacidade
//    (o título e o autor já usam o tom claro/escuro escolhido pela cor da lombada); "Apagar avaliação" e "só com resenha";
// 3) ids repetidos dentro dos enfeites SVG da prateleira (dois vasos iguais = dois "bkpl"): renomeia por instância;
// 4) sinopse recolhida termina com reticências em vez de cortar a linha no meio.
{
  const CSS = `
:host,:root{--tx-ok:color-mix(in srgb,#2e9e5b 52%,var(--ink,#222))}
[data-hit="a"]::after,[data-hit="b"]::before{content:"";position:absolute;top:calc(-1 * var(--hy, 0px));bottom:calc(-1 * var(--hy, 0px));left:calc(-1 * var(--hx, 0px));right:calc(-1 * var(--hx, 0px));background:none;border:0;pointer-events:auto}
.avh small{color:var(--tx-ok)!important}
em.up{color:var(--tx-ok)!important}
[data-a="fimdel"]{color:var(--tx-dng,var(--red,#d9534f))!important}
.avsp small{color:color-mix(in srgb,var(--ink) 82%,var(--panel,var(--bg)))!important}
.v4ler .bsh .sp .au{opacity:1!important}
.rdc2-q textarea{min-height:104px}
#shelflist .bp-desc:not(.open),.bp-desc:not(.open){display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;max-height:none;-webkit-mask-image:none;mask-image:none}
`;
  const put = (root) => { if (!root || root.querySelector?.(':scope > style[data-qa8]')) return; const s = document.createElement('style'); s.dataset.qa8 = '1'; s.textContent = CSS; (root === document ? document.head : root).append(s); };
  const roots = () => { const R = [TR]; const st = [TR]; while (st.length) { const n = st.shift(); n.querySelectorAll('*').forEach((e) => { if (e.shadowRoot) { R.push(e.shadowRoot); st.push(e.shadowRoot); } }); } return R; };
  put(document); put(TR);

  // ---- área de toque ----
  const SEL = 'button, a[href], [role=button], [role=tab], summary, [data-a], input[type=checkbox], input[type=radio]';
  const MIN = 44;
  const vis = (r) => r.width > 0 && r.height > 0;
  const hit = () => {
    const RS = roots(); RS.forEach(put); const els = [];
    for (const r of [...RS, document]) for (const e of r.querySelectorAll(SEL)) { if (e.closest('.rr-cover, [aria-hidden="true"]')) continue; const b = e.getBoundingClientRect(); if (vis(b)) els.push([e, b]); }
    for (const [e, b] of els) {
      const needX = Math.max(0, (MIN - b.width) / 2), needY = Math.max(0, (MIN - b.height) / 2);
      if (!needX && !needY) { if (e.dataset.hit) { delete e.dataset.hit; e.style.removeProperty('--hx'); e.style.removeProperty('--hy'); } continue; }
      if (e.dataset.hit === undefined) {
        const cs = getComputedStyle(e); if (cs.display === 'inline' && e.parentElement && (e.parentElement.textContent || '').trim().length > (e.textContent || '').trim().length + 20) continue; // link no meio do texto
        if (cs.overflow !== 'visible') continue; // o pseudo-elemento seria cortado pelo próprio alvo
        const fa = getComputedStyle(e, '::after').content, fb = getComputedStyle(e, '::before').content;
        const k = (!fa || fa === 'none' || fa === 'normal') ? 'a' : (!fb || fb === 'none' || fb === 'normal') ? 'b' : ''; if (!k) continue;
        if (cs.position === 'static') e.style.position = 'relative';
        e.dataset.hit = k;
      }
      let hx = needX, hy = needY;
      for (const [o, c] of els) { if (o === e || o.contains(e) || e.contains(o)) continue;
        const ovY = c.top < b.bottom + hy && c.bottom > b.top - hy, ovX = c.left < b.right + hx && c.right > b.left - hx;
        if (Math.abs(c.top - b.top) > 120 || Math.abs(c.left - b.left) > 400) continue;
        if (ovY && hx) { const g = c.left >= b.right ? c.left - b.right : b.left >= c.right ? b.left - c.right : -1; if (g >= 0 && g < hx * 2) hx = g / 2; }
        if (ovX && hy) { const g = c.top >= b.bottom ? c.top - b.bottom : b.top >= c.bottom ? b.top - c.bottom : -1; if (g >= 0 && g < hy * 2) hy = g / 2; } }
      const vx = Math.floor(hx) + 'px', vy = Math.floor(hy) + 'px';
      if (e.style.getPropertyValue('--hx') !== vx) e.style.setProperty('--hx', vx);
      if (e.style.getPropertyValue('--hy') !== vy) e.style.setProperty('--hy', vy);
    }
  };

  // ---- ids repetidos nos enfeites SVG ----
  let uid = 0;
  const ids = () => { let seen = null; let lastR = null;
    for (const R0 of roots()) for (const svg of R0.querySelectorAll('svg')) { if (lastR !== R0) { lastR = R0; seen = new Set(); } const own = svg.querySelectorAll('[id]'); if (!own.length) continue;
      const ren = {}; own.forEach((n) => { if (seen.has(n.id)) { const nid = n.id + '-q' + (++uid); ren[n.id] = nid; n.id = nid; } seen.add(n.id); });
      if (!Object.keys(ren).length) continue;
      svg.querySelectorAll('*').forEach((n) => { for (const at of ['fill', 'stroke', 'filter', 'clip-path', 'mask', 'href', 'xlink:href', 'style']) { const v = n.getAttribute(at); if (!v || !v.includes('#')) continue; let w = v; for (const [o, nn] of Object.entries(ren)) w = w.split('#' + o + ')').join('#' + nn + ')').split('#' + o + '"').join('#' + nn + '"'); if (at.endsWith('href') && ren[v.slice(1)]) w = '#' + ren[v.slice(1)]; if (w !== v) n.setAttribute(at, w); } }); } };

  // ---- autor da lombada: claro ou escuro pelo contraste com a cor da lombada ----
  const rgb = (c) => { const m = String(c).match(/[\d.]+/g); return m && m.length >= 3 ? m.slice(0, 3).map(Number) : null; };
  const L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const auth = () => { for (const r of roots()) for (const au of r.querySelectorAll('.bsh .sp .au')) { const sp = au.parentElement; const bg = rgb(getComputedStyle(sp).backgroundColor); if (!bg) continue; const key = bg.join(',');
      if (au.dataset.qc === key) continue; au.dataset.qc = key; au.style.removeProperty('color'); const fg = rgb(getComputedStyle(au).color); if (!fg || cr(fg, bg) >= 4.5) continue;
      au.style.color = cr([255, 255, 255], bg) >= cr([17, 17, 17], bg) ? '#fff' : '#111'; } };

  let t = 0; const run = () => { t = 0; try { ids(); auth(); hit(); } catch (err) { console.warn('detalhes qa', err); } };
  const later = () => { if (!t) t = setTimeout(() => requestAnimationFrame(run), 250); };
  new MutationObserver(later).observe(TR, { subtree: true, childList: true });
  new MutationObserver(later).observe(document.body, { childList: true });
  addEventListener('resize', later); later();
}
