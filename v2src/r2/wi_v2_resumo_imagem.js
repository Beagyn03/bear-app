// Resumo do mês como imagem (Bia, 21/11): "Compartilhar o resumo" abre uma prévia com Stories (1080×1920) ou Quadrado
// (1080×1080), no universo do Livroverso (céu escuro, nebulosa, estrelas, constelação dourada ligando as capas do mês).
// Mesma técnica da Retrospectiva da produção (canvas, rtLoadCover, logo escuro, Playfair); capa sem imagem usa a capa
// gerada do app. Só dados da própria pessoa. Compartilhar (Web Share com arquivo) e Baixar imagem.
{
  const st = document.createElement('style'); st.textContent = `
.v2ri{position:fixed;inset:0;z-index:9500;background:rgba(8,6,18,.86);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.8rem;padding:max(14px,env(safe-area-inset-top)) 16px max(14px,env(safe-area-inset-bottom))}
.v2ri .pv{max-height:68vh;max-width:100%;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.6);background:#140f2c}
.v2ri .tg{display:flex;gap:.4rem;background:rgba(255,255,255,.08);border-radius:999px;padding:4px}
.v2ri .tg button{border:0;border-radius:999px;padding:.5rem 1rem;font:inherit;font-weight:800;color:#e4dcff;background:none;min-height:40px;cursor:pointer}
.v2ri .tg button[aria-pressed=true]{background:#f2c94c;color:#241a10}
.v2ri .ac{display:flex;gap:.6rem;width:100%;max-width:420px}
.v2ri .ac button{flex:1;min-height:48px;border-radius:14px;font:inherit;font-weight:900;cursor:pointer;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff}
.v2ri .ac button.pri{background:#f2c94c;border-color:#f2c94c;color:#241a10}
.v2ri .x{position:absolute;top:max(10px,env(safe-area-inset-top));right:12px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:1.4rem;cursor:pointer}
.v2ri .ld{color:#e4dcff;font-weight:800}`; TR.append(st);

  const MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const seeded = (n) => { let s = n % 233280; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); };
  const loadImg = (src) => new Promise((res) => { if (!src) return res(null); const im = new Image(); let done = false; const end = (v) => { if (!done) { done = true; res(v); } };
    im.onload = () => end(im.naturalWidth > 2 ? im : null); im.onerror = () => end(null); im.src = src; setTimeout(() => end(null), 5000); });
  const genCover = async (e) => { try { const u = typeof window.lvCapaGerada === 'function' ? String(window.lvCapaGerada(e.title || '', e.author || '') || '') : ''; const m = u.match(/data:image\/svg\+xml[^"]+/); return m ? await loadImg(m[0]) : null; } catch { return null; } };
  const wrap = (x, t, w, n) => (typeof rtWrap === 'function' ? rtWrap(x, t, w, n) : [String(t)]);

  function extra(ym, d) {
    // nota média, emoção do mês e maior sequência de dias seguidos no mês
    const notas = d.fin.map((e) => Number(e.review && e.review.paws) || 0).filter((n) => n > 0);
    const nota = notas.length ? Math.round((notas.reduce((a, b) => a + b, 0) / notas.length) * 10) / 10 : 0;
    const cnt = new Map(); const add = (k) => { if (k) cnt.set(k, (cnt.get(k) || 0) + 1); };
    lib().forEach((e) => (e.diary || []).forEach((x) => { if (String(x.d || '').startsWith(ym)) (x.fe || []).forEach(add); }));
    d.fin.forEach((e) => { const r = e.review || {}; (r.emo || r.fe || r.f || []).forEach && (r.emo || r.fe || r.f || []).forEach(add); });
    const top = [...cnt.entries()].sort((a, b) => b[1] - a[1])[0]; let emo = '';
    if (top) { try { const q = (typeof QT_FEELS !== 'undefined' ? QT_FEELS : []).find((y) => y[0] === top[0]); emo = q ? q[1] : String(top[0]); } catch { emo = String(top[0]); } }
    const dias = new Set(); lib().forEach((e) => { (e.readLog || []).forEach((l) => { if (String(l.date || '').startsWith(ym) && Number(l.pages) > 0) dias.add(l.date); }); (e.diary || []).forEach((x) => { if (String(x.d || '').startsWith(ym)) dias.add(x.d); }); });
    (db.goals || []).forEach((g) => (g.logs || []).forEach((l) => { if (String(l.date || '').startsWith(ym)) dias.add(l.date); }));
    const sorted = [...dias].sort(); let best = 0, run = 0, prev = null;
    sorted.forEach((s) => { const t = Date.parse(s + 'T12:00:00Z'); run = prev != null && t - prev === 864e5 ? run + 1 : 1; best = Math.max(best, run); prev = t; });
    return { nota, emo, orbita: best, dias: dias.size };
  }

  async function draw(M, d, fmt) {
    const SQ = fmt === 'quadrado', W = 1080, H = SQ ? 1080 : 1920, K = SQ ? 0.78 : 1;
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    try { if (typeof rtFontsReady === 'function') await rtFontsReady('classica'); } catch {}
    try { await document.fonts.load('900 40px Nunito'); } catch {}
    const DISP = (it, s) => (it ? 'italic 700 ' : '700 ') + Math.round(s) + 'px "Playfair Display", Georgia, serif';
    const SANS = (w, s) => w + ' ' + Math.round(s) + 'px Nunito, "Segoe UI", sans-serif';
    const ex = extra(M.ym, d), rnd = seeded([...M.ym].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7));
    // céu: gradiente profundo + nebulosas + estrelas
    const gr = x.createLinearGradient(0, 0, W * .35, H); gr.addColorStop(0, '#0d0a20'); gr.addColorStop(.55, '#1d1542'); gr.addColorStop(1, '#2e1f55'); x.fillStyle = gr; x.fillRect(0, 0, W, H);
    for (const [nx, ny, nr, col] of [[W * .15, H * .2, W * .7, 'rgba(126,99,201,.28)'], [W * .9, H * .55, W * .65, 'rgba(242,201,76,.12)'], [W * .4, H * .92, W * .8, 'rgba(203,95,160,.16)']]) {
      const g = x.createRadialGradient(nx, ny, 10, nx, ny, nr); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    for (let i = 0; i < (SQ ? 160 : 260); i++) { x.globalAlpha = .2 + rnd() * .75; x.fillStyle = rnd() < .12 ? '#ffe7a8' : '#ffffff'; x.beginPath(); x.arc(rnd() * W, rnd() * H, .7 + rnd() * 2.1, 0, 7); x.fill(); }
    const spark = (cx, cy, r, col) => { x.fillStyle = col; x.beginPath(); for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, rr = k % 2 ? r * .2 : r; x.lineTo(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); } x.closePath(); x.fill(); };
    x.globalAlpha = .85; for (let i = 0; i < 9; i++) { let sx = rnd() * W; const sy = rnd() * H; if (sx > W * .12 && sx < W * .88) sx = sx < W / 2 ? W * .06 + rnd() * W * .06 : W * .88 + rnd() * W * .06; spark(sx, sy, 8 + rnd() * 12, i % 3 ? '#fff' : '#f2c94c'); } x.globalAlpha = 1;
    // lua no canto
    const mx = W - 130 * K, my = 130 * K; const mg = x.createRadialGradient(mx, my, 20, mx, my, 220 * K); mg.addColorStop(0, 'rgba(255,230,160,.35)'); mg.addColorStop(1, 'rgba(255,230,160,0)'); x.fillStyle = mg; x.fillRect(0, 0, W, H);
    x.fillStyle = '#fbe7b5'; x.beginPath(); x.arc(mx, my, 46 * K, 0, 7); x.fill(); x.fillStyle = '#16113a'; x.beginPath(); x.arc(mx + 20 * K, my - 12 * K, 42 * K, 0, 7); x.fill();

    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    let y = SQ ? 110 : 190;
    x.fillStyle = '#f2c94c'; x.font = SANS(900, 30 * K); x.letterSpacing = '8px'; x.fillText(('Meu ' + M.nome + ' em livros').toUpperCase(), W / 2, y); x.letterSpacing = '0px';
    y += SQ ? 96 : 130;
    const head = d.fin.length ? d.fin.length + (d.fin.length === 1 ? ' livro lido' : ' livros lidos') : d.pages ? d.pages.toLocaleString('pt-BR') + ' páginas' : 'Um mês tranquilo';
    x.fillStyle = '#fff'; x.font = DISP(false, (SQ ? 84 : 104)); x.fillText(head, W / 2, y);
    y += SQ ? 50 : 70; x.fillStyle = '#d9cffc'; x.font = DISP(true, 40 * K); x.fillText(M.nome + ' de ' + M.ano, W / 2, y);

    // capas em arco, ligadas por uma constelação dourada
    const books = d.fin.slice(0, 5), more = d.fin.length - books.length;
    y += SQ ? 60 : 110;
    if (books.length) {
      const imgs = await Promise.all(books.map(async (e) => { let im = null; try { im = typeof rtLoadCover === 'function' ? await rtLoadCover(e) : null; } catch {} return { e, im, gen: im ? null : await genCover(e) }; }));
      const n = imgs.length, gap = Math.round((n <= 3 ? 40 : 16) * K), cw = Math.round(Math.min((n <= 2 ? 300 : n === 3 ? 260 : 210) * K, (W - 110 - gap * (n - 1)) / n)), ch = Math.round(cw * 1.5);
      const total = n * cw + (n - 1) * gap, x0 = (W - total) / 2, pts = [];
      imgs.forEach((b, i) => { const t = n === 1 ? 0 : (i / (n - 1)) * 2 - 1, cx = x0 + i * (cw + gap), cy = y + Math.round(Math.abs(t) * 46 * K), rot = t * 0.07; pts.push([cx + cw / 2, cy + ch / 2, rot, cx, cy, b]); });
      x.save(); x.strokeStyle = 'rgba(242,201,76,.75)'; x.lineWidth = 3; x.setLineDash([2, 10]); x.lineCap = 'round'; x.beginPath(); pts.forEach((p, i) => (i ? x.lineTo(p[0], p[1] - ch / 2 - 34 * K) : x.moveTo(p[0], p[1] - ch / 2 - 34 * K))); x.stroke(); x.restore();
      pts.forEach((p) => spark(p[0], p[1] - ch / 2 - 34 * K, 14 * K, '#f2c94c'));
      pts.forEach(([mxp, myp, rot, cx, cy, b]) => { x.save(); x.translate(mxp, myp); x.rotate(rot); x.translate(-mxp, -myp);
        x.shadowColor = 'rgba(242,201,76,.45)'; x.shadowBlur = 40; x.fillStyle = '#000'; x.beginPath(); x.roundRect(cx, cy, cw, ch, 14); x.fill(); x.shadowBlur = 0;
        x.save(); x.beginPath(); x.roundRect(cx, cy, cw, ch, 14); x.clip();
        const im = b.im || b.gen; if (im) { const ir = im.width / im.height, tr = cw / ch; let sx = 0, sy = 0, sw = im.width, sh = im.height; if (ir > tr) { sw = im.height * tr; sx = (im.width - sw) / 2; } else { sh = im.width / tr; sy = (im.height - sh) / 2; } x.drawImage(im, sx, sy, sw, sh, cx, cy, cw, ch); }
        else { const g2 = x.createLinearGradient(cx, cy, cx + cw, cy + ch); g2.addColorStop(0, '#3b2a73'); g2.addColorStop(1, '#1b1338'); x.fillStyle = g2; x.fillRect(cx, cy, cw, ch); }
        if (!b.im) { const gg = x.createLinearGradient(0, cy + ch * .45, 0, cy + ch); gg.addColorStop(0, 'rgba(0,0,0,0)'); gg.addColorStop(1, 'rgba(0,0,0,.65)'); x.fillStyle = gg; x.fillRect(cx, cy, cw, ch);
          x.fillStyle = '#fff'; x.font = DISP(false, Math.max(18, cw / 9)); x.textAlign = 'left'; const L = wrap(x, b.e.title || '', cw - 28, 3); L.forEach((l, k) => x.fillText(l, cx + 14, cy + ch - 18 - (L.length - 1 - k) * Math.max(20, cw / 8.2))); x.textAlign = 'center'; }
        x.restore(); x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; x.beginPath(); x.roundRect(cx, cy, cw, ch, 14); x.stroke(); x.restore(); });
      y += ch + Math.round(46 * K) + (n > 1 ? 46 * K : 0);
      if (more > 0) { x.fillStyle = '#f2c94c'; x.font = SANS(900, 34 * K); x.fillText('+' + more + (more === 1 ? ' livro' : ' livros'), W / 2, y); y += 50 * K; }
      if (!SQ && n <= 2 && imgs.every((b) => b.im)) { x.fillStyle = '#e4dcff'; x.font = DISP(true, 38); wrap(x, books.map((e) => e.title).join(' · '), W - 200, 2).forEach((l) => { x.fillText(l, W / 2, y); y += 50; }); }
    } else {
      // sem livro terminado: um planeta com anel no lugar das capas
      const pr = 150 * K, px = W / 2, py = y + pr + 20; const ring = (a0, a1) => { x.strokeStyle = 'rgba(242,201,76,.85)'; x.lineWidth = 8 * K; x.beginPath(); x.ellipse(px, py, pr * 1.7, pr * .42, -0.25, a0, a1); x.stroke(); };
      ring(Math.PI, Math.PI * 2); const pg = x.createRadialGradient(px - pr * .4, py - pr * .4, 10, px, py, pr); pg.addColorStop(0, '#9a7ce0'); pg.addColorStop(1, '#3b2a73'); x.fillStyle = pg; x.beginPath(); x.arc(px, py, pr, 0, 7); x.fill(); ring(0, Math.PI);
      y = py + pr + 70 * K; x.fillStyle = '#e4dcff'; x.font = DISP(true, 40 * K); x.fillText(d.pages ? 'Cada página conta.' : 'O céu de ' + M.nome + ' esteve calmo.', W / 2, y); y += 60 * K;
    }

    // números do mês em cartões de vidro
    const fmtN = (n) => Number(n || 0).toLocaleString('pt-BR');
    const items = [d.fin.length ? [fmtN(d.pages), 'páginas'] : null, [fmtN(ex.dias || d.days), (ex.dias || d.days) === 1 ? 'dia de leitura' : 'dias de leitura']];
    for (let i = items.length - 1; i >= 0; i--) if (!items[i]) items.splice(i, 1);
    if (ex.nota) items.push([String(ex.nota).replace('.', ','), 'nota média', true]);
    if (ex.orbita > 1) items.push([String(ex.orbita), 'dias seguidos']);
    else if (d.minutes) items.push([d.minutes >= 60 ? Math.round(d.minutes / 60) + 'h' : d.minutes + 'min', 'em sessões']);
    const cols = items.length > 2 ? 2 : items.length, bw = Math.round((SQ ? 400 : 430)), bh = Math.round(150 * K), gx = 28, rows = Math.ceil(items.length / cols);
    y += SQ ? 20 : 40; const tx0 = (W - (cols * bw + (cols - 1) * gx)) / 2;
    items.forEach(([n, l, star], i) => { const last = i === items.length - 1 && items.length % cols === 1 && cols > 1, cxp = last ? (W - bw) / 2 : tx0 + (i % cols) * (bw + gx), cyp = y + Math.floor(i / cols) * (bh + 22);
      x.fillStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.roundRect(cxp, cyp, bw, bh, 26); x.fill(); x.strokeStyle = 'rgba(242,201,76,.28)'; x.lineWidth = 2; x.stroke();
      x.fillStyle = '#fff'; x.font = DISP(false, 64 * K); x.fillText((star ? '★ ' : '') + n, cxp + bw / 2, cyp + bh * .55); x.fillStyle = '#d9cffc'; x.font = SANS(800, 28 * K); x.fillText(l, cxp + bw / 2, cyp + bh * .84); });
    y += rows * (bh + 22) + (SQ ? 16 : 30);
    // gênero e emoção do mês
    const chips = [d.genre ? 'Gênero do mês: ' + d.genre : '', ex.emo ? 'Sentimento do mês: ' + ex.emo : ''].filter(Boolean).slice(0, SQ ? 1 : 2);
    x.font = SANS(800, 30 * K); chips.forEach((t) => { if (y > H - (SQ ? 175 : 300)) return; const w = Math.min(W - 160, x.measureText(t).width + 70); x.fillStyle = 'rgba(242,201,76,.14)'; x.beginPath(); x.roundRect((W - w) / 2, y - 42 * K, w, 62 * K, 31 * K); x.fill(); x.fillStyle = '#ffe7a8'; x.fillText(t, W / 2, y); y += 80 * K; });
    if (!SQ && d.quote && y < H - 420) { x.fillStyle = '#fff'; x.font = DISP(true, 40); const L = wrap(x, '“' + d.quote.t + '”', W - 220, 3); y += 20; L.forEach((l) => { x.fillText(l, W / 2, y); y += 54; }); x.fillStyle = '#d9cffc'; x.font = SANS(800, 26); x.fillText(d.quote.b, W / 2, y + 6); }
    // marca no rodapé
    const lg = typeof RT_LOGO !== 'undefined' ? RT_LOGO.escuro : null;
    if (lg && lg.complete && lg.naturalWidth) { const lh = SQ ? 64 : 84, lw = lh * lg.naturalWidth / lg.naturalHeight; x.globalAlpha = .92; x.drawImage(lg, (W - lw) / 2, H - lh - (SQ ? 34 : 60), lw, lh); x.globalAlpha = 1; }
    else { x.fillStyle = '#ffe7a8'; x.font = DISP(true, SQ ? 38 : 46); x.fillText('Livroverso', W / 2, H - (SQ ? 54 : 84)); }
    x.fillStyle = 'rgba(217,207,252,.75)'; x.font = SANS(700, SQ ? 20 : 24); x.fillText('organizador de leituras', W / 2, H - (SQ ? 18 : 34));
    return c;
  }
  window.v2RsDraw = draw; // usado pelos testes

  const toBlob = (c) => new Promise((r) => c.toBlob(r, 'image/png'));
  v2RsShare = async function (M, d) {
    TR.querySelector('.v2ri')?.remove();
    const ov = document.createElement('div'); ov.className = 'v2ri'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Compartilhar o resumo do mês');
    ov.innerHTML = '<button type="button" class="x" aria-label="Fechar">×</button><div class="tg" role="group" aria-label="Formato"><button type="button" data-f="stories" aria-pressed="true">Stories</button><button type="button" data-f="quadrado" aria-pressed="false">Quadrado</button></div><div class="ld">Montando sua imagem…</div><img class="pv" alt="Prévia do resumo do mês" hidden><div class="ac"><button type="button" class="dl">Baixar imagem</button><button type="button" class="pri sh">Compartilhar</button></div>';
    TR.append(ov); let fmt = 'stories', cur = null, tok = 0;
    const pv = ov.querySelector('.pv'), ld = ov.querySelector('.ld');
    const render = async () => { const my = ++tok; ld.hidden = false; pv.hidden = true; const c = await draw(M, d, fmt); if (my !== tok) return; cur = c; pv.src = c.toDataURL('image/png'); pv.hidden = false; ld.hidden = true; };
    const close = () => { ov.remove(); document.removeEventListener('keydown', esc1, true); };
    const esc1 = (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(); } };
    document.addEventListener('keydown', esc1, true);
    ov.querySelector('.x').addEventListener('click', close);
    ov.addEventListener('click', (ev) => { if (ev.target === ov) close(); });
    ov.querySelectorAll('.tg button').forEach((b) => b.addEventListener('click', () => { fmt = b.dataset.f; ov.querySelectorAll('.tg button').forEach((y) => y.setAttribute('aria-pressed', String(y === b))); render(); }));
    const name = () => 'livroverso-' + M.ym + (fmt === 'quadrado' ? '-quadrado' : '') + '.png';
    const download = (blob) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name(); document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast('Imagem salva'); };
    ov.querySelector('.dl').addEventListener('click', async () => { if (!cur) return; const b = await toBlob(cur); if (b) download(b); else toast('Não consegui gerar a imagem'); });
    ov.querySelector('.sh').addEventListener('click', async () => { if (!cur) return; const b = await toBlob(cur); if (!b) return toast('Não consegui gerar a imagem');
      const file = new File([b], name(), { type: 'image/png' });
      try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Meu ' + M.nome + ' em livros' }); return; } } catch (err) { if (err && err.name === 'AbortError') return; }
      download(b); });
    ov.querySelector('.sh').focus();
    render();
  };
  window.v2RsShareImg = v2RsShare; // usado pelos testes
}
