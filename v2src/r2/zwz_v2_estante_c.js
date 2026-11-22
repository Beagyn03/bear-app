// ---------- v2: prateleira parte C (Bia, 22/11) ----------
// 1) Decorar: as 7 abas em 2 linhas compactas (nenhuma escondida fora da tela).
// 2) Modo normal da Biblioteca › Livros: os botões do topo (grade, organizar, decorar, adicionar, legenda) saem do topo
//    e vão para uma coluna lateral flutuante RECOLHIDA num botão. Fica do lado escolhido no Organizar, acima do botão Ler.
//    O "Todos ▾ · N livros" fica como linha fina (filtro + contagem). Não aparece na estante do perfil.
const FLN_CSS = `
.v4ler .dkpan.flp .dtabs,.v4ler .dkpan.flp .dtabs.six{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:4px;overflow:visible;margin-bottom:6px}
.v4ler .dkpan.flp .dtabs button{padding:0 4px!important;min-height:36px!important;font-size:12.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v5est .shtop.fln .shic{display:none}
.v5est .shtop.fln{min-height:0;padding-block:2px}
.flncol{position:fixed;top:40%;transform:translateY(-50%);z-index:9400;display:grid;gap:8px;padding:6px;border-radius:30px;background:color-mix(in srgb,var(--card) 72%,transparent);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 6px 20px rgba(0,0,0,.22)}
.flncol.R{right:max(6px,env(safe-area-inset-right,0px))}.flncol.L{left:max(6px,env(safe-area-inset-left,0px))}
.flncol:not(.open){padding:4px;background:transparent;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.flncol:not(.open) .fni{display:none}
.flncol button{position:relative;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--card);color:var(--ink);display:grid;place-items:center;cursor:pointer;padding:0;box-shadow:0 1px 3px rgba(0,0,0,.15);font:inherit;font-weight:900;font-size:17px}
.flncol button.tg{box-shadow:0 3px 10px rgba(0,0,0,.28)}.flncol.open button.tg{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.flncol button:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.flncol .flbl{position:absolute;top:50%;transform:translateY(-50%);white-space:nowrap;padding:6px 10px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:12.5px;font-weight:800;pointer-events:none;opacity:0;transition:opacity .15s;box-shadow:0 3px 10px rgba(0,0,0,.25)}
.flncol.R .flbl{right:54px}.flncol.L .flbl{left:54px}
.flncol.lbls .flbl,.flncol button.lb1 .flbl{opacity:1}
@media (prefers-reduced-motion:reduce){.flncol .flbl{transition:none}}`;
let FLN_OPEN = false;
function flnCss(sr) { if (!sr || sr.__flnCss) return; sr.__flnCss = 1; const st = document.createElement('style'); st.textContent = FLN_CSS; sr.appendChild(st); }
function flnHTML() { const side = (() => { try { return v5P().flCol === 'L' ? 'L' : 'R'; } catch { return 'R'; } })();
  const I = (a, ic, lab) => `<button type="button" class="fni" ${a} aria-label="${lab}">${ic}<span class="flbl" aria-hidden="true">${lab}</span></button>`;
  const tg = `<button type="button" class="tg" data-fn="tg" aria-expanded="${FLN_OPEN}" aria-label="${FLN_OPEN ? 'Fechar opções da estante' : 'Opções da estante'}">${FLN_OPEN ? '×' : v4ic('dots', 20)}<span class="flbl" aria-hidden="true">${FLN_OPEN ? 'Fechar' : 'Opções'}</span></button>`;
  const items = [I('data-a="shxview" data-v="grade"', v4ic('grid', 19), 'Ver em grade'), I('data-a="shmode" data-v="org"', v4ic('sort', 19), 'Organizar'), I('data-a="shmode" data-v="deco"', v4ic('lua', 19), 'Decorar'),
    I('data-a="sheet" data-s="v5add"', v4ic('plus', 19), 'Adicionar livro'), I('data-a="shxsheet" data-s="shxleg"', '?', 'Ajuda')];
  return `<div class="flncol ${side}${FLN_OPEN ? ' open' : ''}" role="toolbar" aria-orientation="vertical" aria-label="Opções da estante">${tg}${items.join('')}</div>`; }
function flnMount() { try { const sr = shBibRoot(); if (!sr) return; flnCss(sr); const R = sr.querySelector('.v5est'); if (!R) return;
  R.querySelectorAll(':scope > .flncol').forEach((e) => e.remove());
  const top = R.querySelector('.shtop'); const S5 = v5S();
  if (SHX_MODE) FLN_OPEN = false;
  if (SHX_MODE || !top || S5.tab !== 'livros' || S5.sub || shView() !== 'prat') { if (top) top.classList.remove('fln'); return; }
  top.classList.add('fln'); R.insertAdjacentHTML('beforeend', flnHTML());
  if (FLN_OPEN) { let seen = 1; try { seen = +localStorage.getItem('lv.flnhint') || 0; if (!seen) localStorage.setItem('lv.flnhint', '1'); } catch {}
    if (!seen) { const c = R.querySelector(':scope > .flncol'); c.classList.add('lbls'); setTimeout(() => c.classList.remove('lbls'), 3200); } }
} catch (err) { console.warn('coluna normal', err); } }
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); flnMount(); return r; }; }
function flnSet(o) { FLN_OPEN = !!o; flnMount(); if (o) { const sr = shBibRoot(), b = sr && sr.querySelector('.flncol .fni'); if (b && document.activeElement && document.activeElement.closest && document.activeElement.closest('.flncol')) b.focus(); } }
// toque: abre/fecha; tocar fora recolhe; toque longo mostra o rótulo
{ let LP = null, ate = 0;
  window.addEventListener('pointerdown', (ev) => { const sr = shBibRoot(); if (!sr) return; const T = ev.composedPath()[0]; const col = T && T.closest && T.closest('.flncol');
    if (!col) { if (FLN_OPEN) flnSet(false); return; }
    const b = T.closest('button'); if (!b) return; LP = { b, t: setTimeout(() => { b.classList.add('lb1'); ate = Date.now() + 600; }, 450) }; }, true);
  const end = () => { if (LP) { clearTimeout(LP.t); const b = LP.b; setTimeout(() => b.classList.remove('lb1'), 900); LP = null; } };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true);
  window.addEventListener('click', (ev) => { const T = ev.composedPath()[0]; const b = T && T.closest && T.closest('.flncol button'); if (!b) return;
    if (Date.now() < ate) { ev.stopPropagation(); ev.preventDefault(); return; }
    if (b.dataset.fn === 'tg') { ev.stopPropagation(); ev.preventDefault(); flnSet(!FLN_OPEN); return; }
    FLN_OPEN = false; setTimeout(flnMount, 0); }, true);
  window.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && FLN_OPEN) { flnSet(false); ev.stopPropagation(); } }, true); }
// 3) Lombada "Capa desfocada" (variante D aprovada): a capa vira o fundo da lombada, borrada e escurecida conforme a
//    luminância, com o título por cima. O borrão é feito uma vez por capa num canvas minúsculo (8×24), que o navegador
//    amplia suavizando; nada de CSS filter ao vivo. Sem capa (ou capa que não pôde ser lida), fica a cor da lombada.
const DSF = new Map(), DSFq = new Set();
const DSF_CSS = `.bsh .sp.dsf .dsfb{position:absolute;inset:0;border-radius:inherit;background-size:100% 100%;background-repeat:no-repeat;z-index:0;pointer-events:none;box-shadow:inset 3px 0 4px rgba(0,0,0,.38),inset -2px 0 3px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.12)}
.bsh .sp.dsf .tt,.bsh .sp.dsf .au,.bsh .sp.dsf .sr,.bsh .sp.dsf .rb,.bsh .sp.dsf .fb,.bsh .sp.dsf .orn{z-index:1}
.bsh .sp.dsf .tt{text-shadow:0 1px 2px rgba(0,0,0,.35)}.bsh .sp.dsf.dk .tt{text-shadow:0 1px 1px rgba(255,255,255,.35)}
.bsh .sp.dsf .cs,.bsh .sp.dsf .tb,.bsh .sp.dsf .lb{display:none}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-dsf]')) { const st = document.createElement('style'); st.dataset.dsf = 1; st.textContent = DSF_CSS; sr.append(st); } } catch {} }; }
function dsfMake(u, key) { if (DSFq.has(key)) return; DSFq.add(key); const im = new Image(); if (!/^data:/.test(u)) im.crossOrigin = 'anonymous';
  im.onerror = () => DSF.set(key, 0);
  im.onload = () => { try { const W = 8, H = 24, cn = document.createElement('canvas'); cn.width = W; cn.height = H; const x = cn.getContext('2d');
    const iw = im.naturalWidth, ih = im.naturalHeight, sw = Math.min(iw, ih * (W / H) * 2.2), sx = (iw - sw) / 2; x.drawImage(im, sx, 0, sw, ih, 0, 0, W, H);
    const d = x.getImageData(0, 0, W, H).data; let s = 0; for (let i = 0; i < d.length; i += 4) s += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; const lum = s / (d.length / 4) / 255;
    // escurecimento adaptativo: capa muito clara ganha véu claro e texto escuro (não fica cinza); o resto escurece até ~0,3
    let dark; if (lum > 0.72) { x.fillStyle = 'rgba(255,250,240,.18)'; x.fillRect(0, 0, W, H); dark = true; } else { const a = Math.max(0.12, Math.min(0.6, (lum - 0.28) / Math.max(0.01, lum))); x.fillStyle = `rgba(10,8,14,${a.toFixed(2)})`; x.fillRect(0, 0, W, H); dark = false; }
    const v = { url: cn.toDataURL('image/png'), dark }; DSF.set(key, v);
    SHX_ROOTS.forEach((R) => { try { R.querySelectorAll(`.bsh .sp.dsf[data-dsk="${key}"]`).forEach((el) => dsfApply(el, v)); } catch {} }); } catch { DSF.set(key, 0); } };
  im.src = typeof coverCanvasUrl === 'function' ? coverCanvasUrl(u) : u; }
function dsfApply(el, v) { if (!v) return; let s = el.querySelector(':scope > .dsfb'); if (!s) { s = document.createElement('span'); s.className = 'dsfb'; s.setAttribute('aria-hidden', 'true'); el.prepend(s); }
  s.style.backgroundImage = `url("${v.url}")`; el.classList.toggle('dk', v.dark); el.style.setProperty('--k', v.dark ? '#1f150d' : '#f7efe2'); }
{ const _sp = spnHTML; spnHTML = function (b, sm) { const h = _sp.apply(this, arguments); try { const C0 = shc(), photo = C0.sp && C0.sp[b.id], spM = (C0.spb && C0.spb[b.id]) || C0.spMode;
    if (spM !== 'desfoque' || photo || !b.img) return h; const key = spnHash(b.img), v = DSF.get(key); if (v === undefined) setTimeout(() => dsfMake(b.img, key), 0);
    let out = h.replace(/class="sp /, 'class="sp dsf' + (v && v.dark ? ' dk' : '') + ' ').replace(/ data-bid=/, ` data-dsk="${key}" data-bid=`);
    if (v) out = out.replace(/--k:[^;"]*/, '--k:' + (v.dark ? '#1f150d' : '#f7efe2')).replace(/(<(?:button|span)[^>]*class="sp [^>]*>)/, `$1<span class="dsfb" aria-hidden="true" style="background-image:url(&quot;${v.url}&quot;)"></span>`);
    return out; } catch { return h; } }; }
{ const _dp = dkPanel; dkPanel = function () { let h = _dp.apply(this, arguments); try { if ((SHX_DKT || 'enf') === 'lomb') { const sp = shc().spMode || 'capa';
    h = h.replace('grid-template-columns:1fr 1fr" role="radiogroup" aria-label="Lombadas">', `grid-template-columns:1fr 1fr 1fr" role="radiogroup" aria-label="Lombadas">`).replace(/(aria-label="Lombadas">[\s\S]*?)(<\/div>)/, `$1<button type="button" role="radio" aria-checked="${sp === 'desfoque'}" class="${sp === 'desfoque' ? 'on' : ''}" data-a="dksp" data-k="desfoque" style="text-align:center"><b>Capa desfocada</b><small style="font-weight:600;color:var(--ink2);font-size:11px">a capa no fundo</small></button>$2`); } } catch {} return h; }; }
