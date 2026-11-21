// Foto: tirar na hora ou escolher da galeria, e ajustar antes de usar (Bia, 21/11).
// 1) Todo seletor de imagem do app (foto do post, capa do cadastro manual, capa da retrospectiva, capa do livro, foto de perfil)
//    pergunta antes: "Tirar foto" (capture) ou "Escolher da galeria". Perfil usa a câmera da frente (capture="user").
// 2) Depois de escolher, abre um editor simples (canvas, sem biblioteca): arrastar, pinça/zoom, proporção Livre · 1:1 · 4:5 · 2:3,
//    girar 90°, Cancelar / Usar foto. Padrão: post Livre, capa 2:3, perfil 1:1 com máscara redonda. Exporta JPEG com lado maior
//    até 1600 px. A orientação do celular (EXIF) já vem aplicada pelo navegador ao desenhar a imagem.
// Foto de trecho/anotação para leitura do texto (OCR) não passa pelo editor.
{ let FACE = null, KIND = null; // contexto do seletor aberto agora
  const isImg = (i) => i && i.type === 'file' && /image/.test(i.getAttribute('accept') || i.accept || '');
  const kindOf = (inp) => { if (KIND) return KIND; if (FACE === 'user') return 'perfil';
    try { if (inp.id === 'rdc-file') return 'post'; if (inp.classList.contains('rt-file')) return 'capa'; const f = inp.closest && inp.closest('form'); if (f && f.querySelector('[name=coverUrl]')) return 'capa'; } catch {}
    return 'post'; };
  const ORIG = new WeakMap(), LAST = {}; // input/tipo -> último arquivo original (para "Editar" de novo)
  const _click = HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () {
    if (!isImg(this) || (this.dataset && this.dataset.nosrc)) return _click.call(this);
    const inp = this, face = FACE || (inp.dataset && inp.dataset.face) || 'environment', kind = kindOf(inp);
    const go = (cam) => { if (cam) inp.setAttribute('capture', face); else inp.removeAttribute('capture'); if (kind !== 'ocr') lvArmEditor(inp, kind); _click.call(inp); };
    try { sheet('Adicionar foto', [['Tirar foto', () => go(true)], ['Escolher da galeria', () => go(false)]]); }
    catch { _click.call(inp); }
  };
  try { if (typeof pickPhoto === 'function') { const _pp = pickPhoto; pickPhoto = function () { FACE = 'user'; KIND = 'perfil'; try { return _pp.apply(this, arguments); } finally { setTimeout(() => { FACE = null; KIND = null; }, 0); } }; } } catch {}
  try { if (typeof pickCover === 'function') { const _pc = pickCover; pickCover = function () { KIND = 'capa'; try { return _pc.apply(this, arguments); } finally { setTimeout(() => { KIND = null; }, 0); } }; } } catch {}
  try { if (typeof v4PickPhoto === 'function') { const _vp = v4PickPhoto; v4PickPhoto = function () { KIND = 'ocr'; try { return _vp.apply(this, arguments); } finally { setTimeout(() => { KIND = null; }, 0); } }; } } catch {}

  // intercepta a escolha do arquivo (antes dos ouvintes do app), abre o editor e devolve o arquivo ajustado
  function lvArmEditor(inp, kind) {
    if (inp.__lvArmed) { inp.__lvKind = kind; return; } inp.__lvArmed = true; inp.__lvKind = kind;
    inp.addEventListener('change', (ev) => {
      if (inp.__lvPass) { inp.__lvPass = false; return; }
      const f = inp.files && inp.files[0]; if (!f || !/^image\//.test(f.type || 'image/')) return;
      ev.stopImmediatePropagation(); ORIG.set(inp, f); LAST[inp.__lvKind || 'post'] = f;
      lvEditPhoto(f, inp.__lvKind || 'post').then((out) => { if (!out) { try { inp.value = ''; } catch {} return; } lvDeliver(inp, out); });
    }, true);
  }
  function lvDeliver(inp, file) { try { const dt = new DataTransfer(); dt.items.add(file); inp.files = dt.files; } catch {} inp.__lvPass = true; inp.dispatchEvent(new Event('change', { bubbles: true })); }
  // "Editar" de novo (miniatura do post): reabre com o original guardado
  window.lvReeditPhoto = (inp, kind) => { const k = kind || inp.__lvKind || 'post', f = ORIG.get(inp) || LAST[k]; if (!f) return false; lvEditPhoto(f, k).then((out) => { if (out) lvDeliver(inp, out); }); return true; };

  const st = document.createElement('style'); st.textContent = `
.lvpe{position:fixed;inset:0;z-index:12000;display:grid;grid-template-rows:auto 1fr auto auto;background:#0b0a10;color:#f4eee6;font:inherit;padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0)}
.lvpe header{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px}
.lvpe header b{font-size:1.05rem}
.lvpe button{font:inherit;cursor:pointer}
.lvpe .lvpe-x{min-height:44px;padding:0 14px;border:0;background:none;color:inherit;font-weight:800}
.lvpe .lvpe-ok{min-height:44px;padding:0 18px;border:0;border-radius:99px;background:#e8b96a;color:#1b140c;font-weight:900}
.lvpe .lvpe-st{position:relative;overflow:hidden;touch-action:none}
.lvpe canvas{position:absolute;inset:0;width:100%;height:100%}
.lvpe .lvpe-rat{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:8px 12px}
.lvpe .lvpe-rat button{min-height:40px;padding:0 14px;border:1px solid #ffffff33;border-radius:99px;background:none;color:inherit;font-weight:800}
.lvpe .lvpe-rat button[aria-pressed=true]{background:#f4eee6;color:#1b140c}
.lvpe .lvpe-tools{display:flex;gap:8px;justify-content:center;padding:6px 12px 14px}
.lvpe .lvpe-tools button{min-width:48px;min-height:44px;border:1px solid #ffffff33;border-radius:12px;background:none;color:inherit;font-weight:800}
`; TR.append(st);

  const RATIOS = [['livre', 'Livre', null], ['1:1', '1:1', 1], ['4:5', '4:5', 4 / 5], ['2:3', '2:3', 2 / 3]];
  window.lvEditPhoto = lvEditPhoto;
  function lvEditPhoto(file, kind) {
    return new Promise((done) => {
      const url = URL.createObjectURL(file), img = new Image();
      img.onerror = () => { URL.revokeObjectURL(url); done(file); };
      img.onload = () => {
        const W0 = img.naturalWidth, H0 = img.naturalHeight; // já com a orientação do EXIF aplicada pelo navegador
        let rot = 0, ratio = kind === 'perfil' ? '1:1' : kind === 'capa' ? '2:3' : 'livre', zoom = 1, ox = 0, oy = 0;
        const round = kind === 'perfil';
        const box = document.createElement('div'); box.className = 'lvpe'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Ajustar foto');
        box.innerHTML = `<header><button class="lvpe-x" data-k="cancel">Cancelar</button><b>Ajustar foto</b><button class="lvpe-ok" data-k="ok">Usar foto</button></header>
          <div class="lvpe-st"><canvas></canvas></div>
          <div class="lvpe-rat" role="group" aria-label="Proporção">${(round ? RATIOS.filter((r) => r[0] === '1:1') : RATIOS).map(([k, l]) => `<button data-r="${k}" aria-pressed="${k === ratio}">${l}</button>`).join('')}</div>
          <div class="lvpe-tools"><button data-k="zout" aria-label="Diminuir zoom">−</button><button data-k="rot" aria-label="Girar 90 graus">↻ Girar</button><button data-k="zin" aria-label="Aumentar zoom">+</button></div>`;
        TR.append(box);
        const stage = box.querySelector('.lvpe-st'), cv = box.querySelector('canvas'), ctx = cv.getContext('2d');
        const dims = () => (rot % 180 ? [H0, W0] : [W0, H0]); // tamanho da imagem girada
        let frame = { x: 0, y: 0, w: 0, h: 0 }, base = 1;
        const layout = () => {
          const r = stage.getBoundingClientRect(), dpr = window.devicePixelRatio || 1; cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          const [iw, ih] = dims(), pad = 20, aw = r.width - pad * 2, ah = r.height - pad * 2;
          const rr = (RATIOS.find((x) => x[0] === ratio) || [])[2] || iw / ih;
          let fw = aw, fh = fw / rr; if (fh > ah) { fh = ah; fw = fh * rr; }
          frame = { x: (r.width - fw) / 2, y: (r.height - fh) / 2, w: fw, h: fh };
          base = Math.max(fw / iw, fh / ih); // cobre o quadro
          clamp(); draw();
        };
        const clamp = () => { const [iw, ih] = dims(), s = base * zoom, w = iw * s, h = ih * s;
          const maxX = Math.max(0, (w - frame.w) / 2), maxY = Math.max(0, (h - frame.h) / 2); ox = Math.min(maxX, Math.max(-maxX, ox)); oy = Math.min(maxY, Math.max(-maxY, oy)); };
        const draw = () => {
          const r = stage.getBoundingClientRect(), s = base * zoom, cx = frame.x + frame.w / 2 + ox, cy = frame.y + frame.h / 2 + oy;
          ctx.clearRect(0, 0, r.width, r.height); ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot * Math.PI / 180); ctx.scale(s, s); ctx.drawImage(img, -W0 / 2, -H0 / 2); ctx.restore();
          ctx.save(); ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.rect(0, 0, r.width, r.height);
          if (round) ctx.ellipse(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, 0, 0, Math.PI * 2, true); else { ctx.moveTo(frame.x, frame.y); ctx.lineTo(frame.x, frame.y + frame.h); ctx.lineTo(frame.x + frame.w, frame.y + frame.h); ctx.lineTo(frame.x + frame.w, frame.y); ctx.closePath(); }
          ctx.fill('evenodd'); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.beginPath();
          if (round) ctx.ellipse(frame.x + frame.w / 2, frame.y + frame.h / 2, frame.w / 2, frame.h / 2, 0, 0, Math.PI * 2); else ctx.rect(frame.x, frame.y, frame.w, frame.h); ctx.stroke(); ctx.restore();
        };
        // arrastar e pinça (toque e mouse); roda do mouse dá zoom
        const P = new Map(); let pinch0 = 0, zoom0 = 1;
        stage.addEventListener('pointerdown', (e) => { stage.setPointerCapture(e.pointerId); P.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (P.size === 2) { const [a, b] = [...P.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); zoom0 = zoom; } });
        stage.addEventListener('pointermove', (e) => { const p = P.get(e.pointerId); if (!p) return;
          if (P.size === 1) { ox += e.clientX - p.x; oy += e.clientY - p.y; }
          P.set(e.pointerId, { x: e.clientX, y: e.clientY });
          if (P.size === 2 && pinch0) { const [a, b] = [...P.values()]; zoom = Math.min(6, Math.max(1, zoom0 * Math.hypot(a.x - b.x, a.y - b.y) / pinch0)); }
          clamp(); draw(); });
        const up = (e) => { P.delete(e.pointerId); if (P.size < 2) pinch0 = 0; };
        stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
        stage.addEventListener('wheel', (e) => { e.preventDefault(); zoom = Math.min(6, Math.max(1, zoom * (e.deltaY < 0 ? 1.1 : 0.9))); clamp(); draw(); }, { passive: false });
        const close = (val) => { window.removeEventListener('resize', layout); document.removeEventListener('keydown', key, true); box.remove(); URL.revokeObjectURL(url); done(val); };
        const key = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(null); } };
        document.addEventListener('keydown', key, true); window.addEventListener('resize', layout);
        box.addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return;
          if (b.dataset.r) { ratio = b.dataset.r; box.querySelectorAll('[data-r]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); ox = oy = 0; zoom = 1; layout(); return; }
          const k = b.dataset.k;
          if (k === 'cancel') return close(null);
          if (k === 'rot') { rot = (rot + 90) % 360; ox = oy = 0; zoom = 1; layout(); return; }
          if (k === 'zin' || k === 'zout') { zoom = Math.min(6, Math.max(1, zoom * (k === 'zin' ? 1.2 : 1 / 1.2))); clamp(); draw(); return; }
          if (k === 'ok') {
            // recorte em pixels da imagem girada, lado maior até 1600
            const s = base * zoom, outW0 = frame.w / s, outH0 = frame.h / s, k2 = Math.min(1, 1600 / Math.max(outW0, outH0));
            const oc = document.createElement('canvas'); oc.width = Math.max(1, Math.round(outW0 * k2)); oc.height = Math.max(1, Math.round(outH0 * k2));
            const o = oc.getContext('2d'), sc = s * k2 / s; // escala do quadro para a saída
            o.fillStyle = '#fff'; o.fillRect(0, 0, oc.width, oc.height);
            o.translate(oc.width / 2 + ox * (oc.width / frame.w), oc.height / 2 + oy * (oc.height / frame.h)); o.rotate(rot * Math.PI / 180); o.scale(s * (oc.width / frame.w), s * (oc.width / frame.w)); o.drawImage(img, -W0 / 2, -H0 / 2);
            void sc;
            oc.toBlob((blob) => { if (!blob) return close(file); close(new File([blob], (file.name || 'foto').replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' })); }, 'image/jpeg', 0.86);
          }
        });
        requestAnimationFrame(() => { layout(); try { box.querySelector('.lvpe-ok').focus(); } catch {} });
      };
      img.src = url;
    });
  }
}
