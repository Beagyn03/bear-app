// Capa padrão gerada (Bia, 21/11; ideia vinda do Bookly, sem copiar): livro sem capa ganha uma capa de UNIVERSO em SVG
// (planeta com anel, lua crescente, constelação, nebulosa, cometa, órbitas, céu com horizonte, eclipse; Bia, 21/11) com os tons do tema e variação por livro (semente = título + autor, sempre a mesma).
// O título continua sendo o texto do próprio elemento (fonte do app); o autor entra numa linha menor quando a capa é grande.
// Vale para todo .cv sem imagem, no app e nas telas v4 (sombra própria). Quando a capa de verdade carrega (.img), ela manda.
{
  const CSS = `
.cv.cv-gen{background-size:cover!important;background-position:center!important;color:#fff!important;text-shadow:0 1px 3px rgba(0,0,0,.55),0 0 1px rgba(0,0,0,.6)!important}
.cv.cv-gen.img{text-shadow:none!important}
.cv.cv-gen{flex-wrap:wrap;align-content:flex-end}
.cv .cva{display:block;flex-basis:100%;width:100%;margin-top:.35em;font-family:inherit;font-style:normal;font-weight:700;font-size:.62em;letter-spacing:.02em;opacity:.92;line-height:1.15;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.cv.img .cva{visibility:hidden}`;
  const styled = new WeakSet(), watched = new WeakSet();
  const addCss = (root) => { if (styled.has(root)) return; styled.add(root); const st = document.createElement('style'); st.textContent = CSS; root.append(st); };
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => () => { seed = (Math.imul(seed ^ (seed >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return (seed >>> 8) / 16777216; };
  const hexToHsl = (hex) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim()); if (!m) return [28, 60, 46]; const n = parseInt(m[1], 16);
    const r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
    if (mx === mn) return [0, 0, l * 100]; const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    const h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); return [h * 60, s * 100, l * 100]; };
  let theme = null;
  const themeNow = () => { const cs = getComputedStyle(document.documentElement); const acc = cs.getPropertyValue('--acc').trim() || '#c46f2b';
    const dark = document.documentElement.getAttribute('data-theme') === 'dark'; return { acc, dark, key: acc + (dark ? 'd' : 'l') }; };
  const hsl = (h, s, l, a = 1) => `hsla(${Math.round(((h % 360) + 360) % 360)},${Math.round(s)}%,${Math.round(l)}%,${a})`;
  const cache = new Map();
  function coverSvg(title, author) {
    const th = theme || (theme = themeNow()), key = th.key + '|' + title + '|' + (author || '');
    if (cache.has(key)) return cache.get(key);
    const R = rng(hash(normT(title || '') + '|' + normT(author || '')));
    const [ah] = hexToHsl(th.acc);
    // tons do céu derivados do tema: fundo profundo (título branco legível), brilhos claros na cor de destaque
    const hs = [0, -30, 30, 200, 230, 260][Math.floor(R() * 6)];
    // céu sem verde-oliva: matizes entre 55° e 170° vão para azul/violeta (o céu do app)
    const sky = (h) => { h = ((h % 360) + 360) % 360; return h > 55 && h < 170 ? h + 140 : h; };
    const h1 = sky(ah + hs + (R() * 14 - 7)), h2 = sky(h1 + 30 + R() * 40);
    const L0 = th.dark ? 12 + R() * 8 : 20 + R() * 10;
    const sky1 = hsl(h1, 45 + R() * 20, L0 + 6), sky2 = hsl(h2, 50 + R() * 20, L0 - 4);
    const glow = hsl(ah + (R() * 40 - 20), 80, 70), glow2 = hsl(h2 + 120, 65, 72), pale = hsl(ah, 60, 88);
    const r1 = (a, b) => a + R() * (b - a);
    let stars = ''; for (let i = 0; i < 46; i++) { const big = R() < 0.12; stars += `<circle cx="${r1(0, 200).toFixed(1)}" cy="${r1(0, 300).toFixed(1)}" r="${big ? r1(1.1, 1.8).toFixed(1) : r1(0.35, 0.8).toFixed(2)}" fill="#fff" opacity="${r1(0.35, 0.95).toFixed(2)}"/>`; }
    const sparkle = (x, y, r, c = '#fff') => `<path d="M${x} ${y - r}L${x + r * 0.22} ${y - r * 0.22}L${x + r} ${y}L${x + r * 0.22} ${y + r * 0.22}L${x} ${y + r}L${x - r * 0.22} ${y + r * 0.22}L${x - r} ${y}L${x - r * 0.22} ${y - r * 0.22}Z" fill="${c}"/>`;
    const kind = Math.floor(R() * 8); let art = '', defs = '';
    if (kind === 0) { // planeta com anel
      const cx = r1(60, 140), cy = r1(70, 130), r = r1(34, 48), rot = r1(-30, -8);
      defs += `<radialGradient id="p" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${pale}"/><stop offset=".55" stop-color="${glow}"/><stop offset="1" stop-color="${hsl(h1, 50, 20)}"/></radialGradient>`;
      art += `<ellipse cx="${cx}" cy="${cy}" rx="${r * 1.9}" ry="${r * 0.48}" fill="none" stroke="${glow2}" stroke-width="5" opacity=".55" transform="rotate(${rot} ${cx} ${cy})"/>`;
      art += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#p)"/>`;
      art += `<path d="M${cx - r * 1.9} ${cy} A ${r * 1.9} ${r * 0.48} 0 0 0 ${cx + r * 1.9} ${cy}" fill="none" stroke="${glow2}" stroke-width="5" opacity=".9" transform="rotate(${rot} ${cx} ${cy})"/>`;
    } else if (kind === 1) { // lua crescente
      const cx = r1(70, 140), cy = r1(60, 120), r = r1(30, 42), d = r * r1(0.45, 0.6);
      defs += `<mask id="m"><rect width="200" height="300" fill="#fff"/><circle cx="${cx + d}" cy="${cy - d * 0.5}" r="${r}" fill="#000"/></mask><radialGradient id="h"><stop offset="0" stop-color="${pale}" stop-opacity=".45"/><stop offset="1" stop-color="${pale}" stop-opacity="0"/></radialGradient>`;
      art += `<circle cx="${cx}" cy="${cy}" r="${r * 2}" fill="url(#h)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${pale}" mask="url(#m)"/>`;
      art += sparkle(r1(20, 60), r1(150, 200), 6) + sparkle(r1(140, 185), r1(170, 230), 4);
    } else if (kind === 2) { // constelação
      const pts = []; let x = r1(25, 55), y = r1(40, 80); for (let i = 0; i < 6; i++) { pts.push([x, y]); x = Math.min(185, Math.max(15, x + r1(-10, 45))); y = Math.min(250, y + r1(18, 42)); }
      art += `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${pale}" stroke-width="1.2" opacity=".75"/>`;
      pts.forEach(([px, py], i) => { art += `<circle cx="${px}" cy="${py}" r="${i % 2 ? 2.4 : 3.2}" fill="#fff"/>` + (i % 3 === 0 ? sparkle(px, py, 7, pale) : ''); });
    } else if (kind === 3) { // nebulosa
      defs += `<radialGradient id="n1"><stop offset="0" stop-color="${glow}" stop-opacity=".75"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient><radialGradient id="n2"><stop offset="0" stop-color="${glow2}" stop-opacity=".65"/><stop offset="1" stop-color="${glow2}" stop-opacity="0"/></radialGradient>`;
      art += `<ellipse cx="${r1(60, 140)}" cy="${r1(80, 140)}" rx="${r1(70, 100)}" ry="${r1(45, 70)}" fill="url(#n1)" transform="rotate(${r1(-40, 40)} 100 120)"/>`;
      art += `<ellipse cx="${r1(70, 150)}" cy="${r1(130, 200)}" rx="${r1(55, 85)}" ry="${r1(35, 55)}" fill="url(#n2)" transform="rotate(${r1(-40, 40)} 100 160)"/>`;
      art += sparkle(r1(60, 140), r1(100, 170), 8);
    } else if (kind === 4) { // cometa
      const x = r1(120, 165), y = r1(50, 100);
      defs += `<linearGradient id="t" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${pale}" stop-opacity=".95"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></linearGradient>`;
      art += `<path d="M${x} ${y} L${x - 130} ${y + 120} L${x - 118} ${y + 128} Z" fill="url(#t)" opacity=".85"/><path d="M${x} ${y} L${x - 100} ${y + 120}" stroke="url(#t)" stroke-width="2" opacity=".7"/>`;
      art += `<circle cx="${x}" cy="${y}" r="6" fill="#fff"/><circle cx="${x}" cy="${y}" r="13" fill="${pale}" opacity=".3"/>`;
    } else if (kind === 5) { // órbitas concêntricas
      const cx = r1(70, 130), cy = r1(90, 150);
      art += `<circle cx="${cx}" cy="${cy}" r="12" fill="${glow}"/><circle cx="${cx}" cy="${cy}" r="22" fill="${glow}" opacity=".25"/>`;
      for (let i = 1; i <= 4; i++) { const rx = 22 + i * 20, ry = rx * 0.55, a = R() * Math.PI * 2;
        art += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${pale}" stroke-width=".9" opacity=".55"/>`;
        art += `<circle cx="${(cx + rx * Math.cos(a)).toFixed(1)}" cy="${(cy + ry * Math.sin(a)).toFixed(1)}" r="${r1(3, 6).toFixed(1)}" fill="${i % 2 ? glow2 : pale}"/>`; }
    } else if (kind === 6) { // céu estrelado com horizonte
      const y = r1(205, 235);
      art += `<circle cx="${r1(40, 160)}" cy="${r1(50, 90)}" r="${r1(10, 16)}" fill="${pale}" opacity=".9"/>`;
      art += `<path d="M0 ${y} C 50 ${y - r1(10, 30)}, 110 ${y + r1(5, 20)}, 200 ${y - r1(5, 25)} L200 300 L0 300Z" fill="${hsl(h1, 35, Math.max(6, L0 - 8))}"/>`;
      art += `<path d="M0 ${y + 25} C 60 ${y + 10}, 130 ${y + 35}, 200 ${y + 18} L200 300 L0 300Z" fill="${hsl(h2, 30, Math.max(4, L0 - 12))}"/>`;
    } else { // eclipse
      const cx = r1(70, 130), cy = r1(80, 130), r = r1(28, 38);
      defs += `<radialGradient id="c"><stop offset=".55" stop-color="${pale}" stop-opacity="0"/><stop offset=".62" stop-color="${pale}" stop-opacity=".95"/><stop offset=".75" stop-color="${glow}" stop-opacity=".45"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient>`;
      art += `<circle cx="${cx}" cy="${cy}" r="${r * 1.75}" fill="url(#c)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${hsl(h1, 40, 6)}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2=".6" y2="1"><stop offset="0" stop-color="${sky1}"/><stop offset="1" stop-color="${sky2}"/></linearGradient>`
      + `<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".55" stop-color="#000" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>${defs}</defs>`
      + `<rect width="200" height="300" fill="url(#g)"/>${stars}${art}<rect width="200" height="300" fill="url(#v)"/><rect x="0" y="0" width="6" height="300" fill="#000" opacity=".2"/></svg>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    if (cache.size > 600) cache.clear(); cache.set(key, url); return url;
  }
  const authorOf = (t) => { try { const k = normT(t || ''); const e = lib().find((x) => normT(x.title || '') === k); return e ? e.author || '' : ''; } catch { return ''; } };
  const titleOf = (n) => n.dataset.t || n.getAttribute('data-v9t') || (n.querySelector('.cvt') || n).textContent.replace(/\s+/g, ' ').trim();
  function paint(n) {
    if (n.classList.contains('img')) return;
    if (n.style.backgroundImage && /^url\((?!"data:image\/svg)/.test(n.style.backgroundImage)) return; // capa de verdade sendo pintada
    const t = titleOf(n); if (!t || t === '?') return;
    const a = n.getAttribute('data-v9a') || n.dataset.a || authorOf(t);
    const k = (theme && theme.key) + '|' + t + '|' + a; if (n.dataset.gk === k) return; n.dataset.gk = k;
    n.style.backgroundImage = coverSvg(t, a); n.classList.add('cv-gen');
    if (a && !n.querySelector('.cva') && (n.offsetWidth || 0) >= 72) { const s = document.createElement('span'); s.className = 'cvt cva'; s.textContent = a; n.append(s); }
  }
  // capa com link quebrado (telas v5/v4 pintam o fundo direto, sem o tratamento de falha do paintCv): testa uma vez por link
  const urlOk = new Map();
  function checkImg(n) {
    const m = /url\(["']?(https?:[^"')]+)/.exec(n.style.backgroundImage || ''); if (!m) return; const u = m[1];
    const fallback = () => { if (!n.isConnected || !n.classList.contains('img')) return; const bi = n.style.backgroundImage || ''; if (!bi.includes(u)) return; n.classList.remove('img'); n.style.backgroundImage = ''; delete n.dataset.gk; paint(n); };
    const st = urlOk.get(u); if (st === false) return fallback(); if (st === true || st === 'wait') { if (st === 'wait') setTimeout(() => urlOk.get(u) === false && fallback(), 4000); return; }
    urlOk.set(u, 'wait'); const im = new Image(); im.onload = () => urlOk.set(u, im.naturalWidth > 2); im.onerror = () => { urlOk.set(u, false); fallback(); }; im.src = u;
    setTimeout(() => { if (im.naturalWidth <= 2 && urlOk.get(u) !== true) { urlOk.set(u, false); fallback(); } }, 8000); }
  let q = 0; const pending = new Set();
  const run = () => { q = 0; for (const root of pending) { try { root.querySelectorAll('.cv:not(.img)').forEach(paint); root.querySelectorAll('.cv.img').forEach(checkImg); } catch {} } pending.clear(); };
  const schedule = (root) => { pending.add(root); if (!q) q = requestAnimationFrame(run); };
  function watch(root) { if (!root || watched.has(root)) return; watched.add(root); addCss(root); schedule(root);
    new MutationObserver((ms) => { for (const m of ms) { if (m.type === 'childList' && m.addedNodes.length) { schedule(root); for (const n of m.addedNodes) if (n.shadowRoot) watch(n.shadowRoot); }
      else if (m.type === 'attributes' && m.target.classList && m.target.classList.contains('cv') && !m.target.classList.contains('img')) {
        // capa que falhou: o app limpa o fundo (style) sem mudar a classe; repinta a gerada
        if (m.attributeName === 'style' && m.target.style.backgroundImage) continue;
        delete m.target.dataset.gk; schedule(root); } } })
      .observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] }); }
  watch(TR); [...TR.children].forEach((n) => { if (n.shadowRoot) watch(n.shadowRoot); });
  // tema mudou: refaz as capas geradas com a paleta nova
  new MutationObserver(() => { const t = themeNow(); if (theme && t.key === theme.key) return; theme = t; [TR, ...[...TR.children].filter((n) => n.shadowRoot).map((n) => n.shadowRoot)].forEach((r) => { r.querySelectorAll('.cv.cv-gen').forEach((n) => { delete n.dataset.gk; }); schedule(r); }); })
    .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-pal', 'style'] });
  window.lvCapaGerada = coverSvg;
}
