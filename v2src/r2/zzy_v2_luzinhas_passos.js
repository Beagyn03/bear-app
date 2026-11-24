// ---------- Decorar › Luzinhas em dois passos (Bia, 23/11: "pode ajustar") ----------
// Passo 1: os cordões (cada um pelo modelo, com cor e lugar embaixo), "+ Cordão" e "Apagar todas"; sem cordão nenhum,
// os modelos para começar. Passo 2: tocar num cordão mostra só as opções dele, com "‹ Cordões" no começo para voltar.
let FLZ_STEP = 0;
const flzNm = (A, k) => (A.find((x) => x[0] === k) || ['', ''])[1];
function flzBody() { const C0 = shc(), Ls = shLights(C0), e = Ls[SHX_LTE] ? SHX_LTE : 0, L = Ls[e];
  if (!Ls.length) return SH_LTM.map(([k, n]) => `<button type="button" class="flzc" data-a="dkltnew" data-k="${k}"><b>${esc(n)}</b><small>Pôr este cordão</small></button>`).join('');
  if (FLZ_STEP !== 1 || !L) return Ls.map((x, i) => `<button type="button" class="flzc${i === e && FLZ_STEP === 1 ? ' on' : ''}" data-a="dkltpick" data-i="${i}"><b>${esc(flzNm(SH_LTM, x.m) || 'Cordão')}</b><small>${esc(flzNm(SH_LTC, x.c))} · ${esc(flzNm(SH_LTW, x.w))}</small></button>`).join('')
    + (Ls.length < 3 ? '<button type="button" class="flzc flzadd" data-a="dkltadd"><b>+ Cordão</b><small>até 3</small></button>' : '')
    + '<button type="button" class="flzc flzoff" data-a="dkltoff"><b>Apagar todas</b><small>tira os cordões</small></button>';
  const nR = Math.max(3, (shBibRoot()?.querySelectorAll('.bsh:not(.sm) .bay').length) || 3), rr = [['todas', 'Todas'], ['alt', 'Alternadas']].concat(Array.from({ length: Math.min(nR, 9) }, (_, i) => [String(i), (i + 1) + 'ª']));
  return '<button type="button" class="flzback" data-a="dkltback" aria-label="Voltar aos cordões">‹ Cordões</button>'
    + `<div class="dsec">Modelo</div>${shChips('dkltset', L.m, SH_LTM, ' data-f="m"')}<div class="dsec">Cor</div>${shChips('dkltset', L.c, SH_LTC, ' data-f="c"')}<div class="dsec">Lugar</div>${shChips('dkltset', L.w, SH_LTW, ' data-f="w"')}`
    + (L.w === 'moldura' ? '' : `<div class="dsec">Prateleiras</div>${shChips('dkltset', String(L.r), rr, ' data-f="r"')}`)
    + `<div class="dsec">Brilho</div>${shChips('dkltset', L.b ? '1' : '0', [['1', 'Cintilar'], ['0', 'Fixo']], ' data-f="b"')}`
    + '<button type="button" class="flzc flzoff" data-a="dkltrm"><b>Tirar este</b><small>só este cordão</small></button>'; }
{ const _dk = dkPanel; dkPanel = function () { const h = _dk.apply(this, arguments); try { if ((SHX_DKT || 'enf') !== 'luz' || typeof FLX === 'undefined' || FLX.car !== 'luz') return h;
    const a = h.indexOf('<div class="dbody">'); if (a < 0) return h; const f = h.indexOf('<div class="dkfoot">', a);
    return h.slice(0, a) + `<div class="dbody flzstep${FLZ_STEP}">${flzBody()}</div>` + (f >= 0 ? h.slice(f) : '</div>'); } catch (err) { console.warn('luzinhas', err); } return h; }; }
// abrir a faixa Luzinhas começa sempre pelos cordões
{ const _a = flAct; flAct = function (k, el) { if (k === 'car') { FLZ_STEP = 0; try { FLC_SCR.luz = 0; } catch {} } return _a.apply(this, arguments); }; }
const flzGo = (step, i) => { if (i != null) SHX_LTE = i; FLZ_STEP = step; try { const b = flQ('.dkpan.flcar .dbody'); if (b) b.scrollLeft = 0; } catch {} try { FLC_SCR.luz = 0; } catch {} v5Redraw(); };
window.addEventListener('click', (ev) => { try { const T = ev.composedPath()[0], b = T && T.closest && T.closest('[data-a="dkltpick"],[data-a="dkltback"],[data-a="dkltnew"]'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const a = b.dataset.a; if (a === 'dkltpick') return flzGo(1, +b.dataset.i); if (a === 'dkltback') return flzGo(0);
  if (a === 'dkltnew') { const bk = shBk(); shLtSave((Ls) => { Ls.push({ m: b.dataset.k, c: 'quente', w: 'f', r: 'alt', b: 1 }); }); SHX_LTE = shLights().length - 1; flzGo(1); return toast('Cordão ' + flzNm(SH_LTM, b.dataset.k) + ' na estante', shUndo(bk)); } } catch (e) { console.warn('luzinhas', e); } }, true);
// "+ Cordão" já abre as opções do cordão novo; tirar um cordão volta à lista
window.addEventListener('click', (ev) => { try { const T = ev.composedPath()[0], b = T && T.closest && T.closest('[data-a="dkltadd"],[data-a="dkltrm"],[data-a="dkltoff"]'); if (!b) return; const a = b.dataset.a;
  setTimeout(() => { if (a === 'dkltadd') { SHX_LTE = Math.max(0, shLights().length - 1); FLZ_STEP = 1; } else FLZ_STEP = 0; try { v5Redraw(); } catch {} }, 0); } catch {} }, true);
const FLZ_CSS = `.v4ler .dkpan.flcar .dbody,.v4ler.v5est .dkpan.flcar .dbody{scroll-snap-type:none!important} /* o snap puxava de volta e o botão cortado na borda não vinha para a vista */
.v4ler .dkpan.flcar.fc-luz .dbody button.flzc{flex:none;width:112px!important;height:64px!important;min-height:64px!important;max-height:64px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:3px;padding:8px 10px!important;border-radius:14px!important;text-align:left;white-space:normal}
.v4ler .dkpan.flcar.fc-luz .dbody button.flzc b{font-size:13px;font-weight:800;line-height:1.1}.v4ler .dkpan.flcar.fc-luz .dbody button.flzc small{font-size:11px;font-weight:700;color:var(--ink2);line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.v4ler .dkpan.flcar.fc-luz .dbody button.flzc.on{outline:2px solid var(--acc);outline-offset:-2px}.v4ler .dkpan.flcar.fc-luz .dbody button.flzoff b{color:#e5675a}
.v4ler .dkpan.flcar.fc-luz .dbody button.flzback{flex:none;width:auto!important;height:44px!important;min-height:44px!important;max-height:44px!important;align-self:center;padding:0 14px!important;border-radius:22px!important;font-weight:800;font-size:13px;display:flex!important;align-items:center;justify-content:center;white-space:nowrap;background:var(--ink)!important;color:var(--bg)!important;border-color:var(--ink)!important}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-flz]')) { const st = document.createElement('style'); st.dataset.flz = 1; st.textContent = FLZ_CSS; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-flz]')) { const st = document.createElement('style'); st.dataset.flz = 1; st.textContent = FLZ_CSS; sr.append(st); } }); } catch {}
// a faixa guarda a rolagem também quando rola sem toque (teclado, leitor de tela, scrollIntoView): antes só guardava no
// pointerdown e um redesenho de fundo a devolvia para a posição velha, tirando o botão de baixo do dedo (falha antiga)
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { const sr = shBibRoot(); if (sr && !sr.__flzScr) { sr.__flzScr = 1;
      sr.addEventListener('scroll', (e) => { try { const t = e.target; if (t && t.classList && t.classList.contains('dbody') && t.closest('.dkpan.flcar') && FLX.car) FLC_SCR[FLX.car] = t.scrollLeft; } catch {} }, true); } } catch {} return r; }; }
// depois da troca do render estável (a tela nova entra no lugar), a faixa volta à rolagem mais recente que a pessoa deixou
{ let q = 0; const mo = new MutationObserver(() => { if (q || SHX_MODE !== 'deco' || typeof FLX === 'undefined' || !FLX.car) return; q = 1;
    requestAnimationFrame(() => { q = 0; try { const sr = shBibRoot(), b = sr && sr.querySelector('.dkpan.flcar .dbody'), v = FLC_SCR[FLX.car]; if (b && v != null && Math.abs(b.scrollLeft - v) > 2) b.scrollLeft = v; } catch {} }); });
  try { mo.observe(TR, { childList: true, subtree: true }); } catch {} }
