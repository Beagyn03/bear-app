// Capa padrão gerada (Bia, 21/11; ideia vinda do Bookly, sem copiar): livro sem capa ganha uma capa abstrata em SVG
// (círculos, ondas, anéis, pontilhado) com a paleta do tema e variação por livro (semente = título + autor, sempre a mesma).
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
    const shifts = [0, -28, 32, 155, 200, -60, 60];
    const h1 = ah + shifts[Math.floor(R() * shifts.length)] + (R() * 16 - 8), h2 = h1 + 25 + R() * 50, h3 = h1 + 150 + R() * 60;
    const L0 = th.dark ? 22 + R() * 10 : 32 + R() * 12; // fundo escuro o bastante para o título branco (AA com o véu)
    const bg1 = hsl(h1, 45 + R() * 20, L0), bg2 = hsl(h2, 40 + R() * 25, L0 - 8);
    const c1 = hsl(h2, 55 + R() * 25, L0 + 22 + R() * 12, 0.9), c2 = hsl(h3, 50 + R() * 30, L0 + 30 + R() * 14, 0.85), c3 = hsl(h1 + 40, 70, 78, 0.75);
    const kind = Math.floor(R() * 4); let art = '';
    if (kind === 0) { // círculos grandes
      art += `<circle cx="${40 + R() * 120}" cy="${40 + R() * 90}" r="${60 + R() * 50}" fill="${c1}"/>`;
      art += `<circle cx="${60 + R() * 120}" cy="${170 + R() * 90}" r="${35 + R() * 40}" fill="${c2}"/>`;
      art += `<circle cx="${R() * 200}" cy="${R() * 300}" r="${14 + R() * 18}" fill="none" stroke="${c3}" stroke-width="3"/>`;
    } else if (kind === 1) { // ondas
      for (let i = 0; i < 3; i++) { const y = 70 + i * 70 + R() * 30, a = 18 + R() * 26;
        art += `<path d="M-10 ${y} C 40 ${y - a}, 90 ${y + a}, 140 ${y} S 230 ${y - a}, 230 ${y} L230 320 L-10 320Z" fill="${i % 2 ? c2 : c1}" opacity="${0.55 + i * 0.12}"/>`; }
    } else if (kind === 2) { // anéis concêntricos (arco)
      const cx = R() < 0.5 ? 0 : 200, cy = 60 + R() * 180;
      for (let i = 0; i < 7; i++) art += `<circle cx="${cx}" cy="${cy}" r="${24 + i * 22}" fill="none" stroke="${i % 2 ? c1 : c2}" stroke-width="${6 + R() * 6}" opacity=".8"/>`;
      art += `<circle cx="${200 - cx * 0.8}" cy="${40 + R() * 60}" r="${18 + R() * 14}" fill="${c3}"/>`;
    } else { // blocos + pontilhado
      art += `<rect x="${-20 + R() * 40}" y="${R() * 60}" width="${120 + R() * 80}" height="${110 + R() * 60}" rx="${R() * 60}" fill="${c1}" transform="rotate(${R() * 30 - 15} 100 150)"/>`;
      art += `<path d="M0 ${200 + R() * 40} Q 100 ${150 + R() * 60} 200 ${210 + R() * 50} L200 300 L0 300Z" fill="${c2}"/>`;
      const ox = 20 + R() * 110, oy = 30 + R() * 200;
      for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) art += `<circle cx="${ox + i * 11}" cy="${oy + j * 11}" r="2.2" fill="${c3}"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>`
      + `<linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".12"/><stop offset=".5" stop-color="#000" stop-opacity=".5"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>`
      + `<rect width="200" height="300" fill="url(#g)"/>${art}<rect width="200" height="300" fill="url(#v)"/><rect x="0" y="0" width="7" height="300" fill="#000" opacity=".18"/></svg>`;
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
