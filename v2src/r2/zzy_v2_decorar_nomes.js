// ---------- Decorar: nome curto embaixo de cada ícone da coluna (Bia, 23/11: "pode ajustar") ----------
// Uma palavra por botão. A coluna fica um pouco mais larga só no Decorar; a estante reserva o espaço dela.
const FLN1_SHORT = { 'Leitor digital': 'Leitor', 'Mais opções': 'Mais', 'Arraste para mudar a coluna de lado': '' };
{ const _c = flColHTML; flColHTML = function () { let h = _c.apply(this, arguments); try { if (SHX_MODE !== 'deco') return h;
    h = h.replace(/<span class="flbl" aria-hidden="true">([^<]*)<\/span>/g, (m, l) => { const s = FLN1_SHORT[l] != null ? FLN1_SHORT[l] : l; return s ? `<span class="flbl fln1" aria-hidden="true">${s}</span>` : ''; }); } catch (err) { console.warn('decorar: nomes', err); } return h; }; }
const FLN1_CSS = `.v4ler .flcol.fldk{gap:2px;padding:5px;border-radius:22px;max-height:calc(100vh - 150px)}
.v4ler .flcol.fldk .flcb{width:56px!important;height:44px!important;min-height:44px;border-radius:13px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;padding:3px 2px!important}
.v4ler .flcol.fldk .flcb svg{width:19px;height:19px;flex:none}
.v4ler .flcol.fldk .flcb .flbl.fln1{position:static!important;transform:none!important;opacity:1!important;background:none!important;color:inherit!important;padding:0!important;margin:0!important;box-shadow:none!important;border-radius:0!important;font-size:9.5px!important;font-weight:800!important;line-height:1.05!important;letter-spacing:0;white-space:nowrap;max-width:54px;overflow:hidden;pointer-events:none}
.v4ler .flcol.fldk .flgrip{width:56px!important}
.v5est.flmode.flcolR.fldeco .bsh.flx{margin-right:62px!important}.v5est.flmode.flcolL.fldeco .bsh.flx{margin-left:62px!important}
.v5est.fldeco .flpop.cR{right:calc(80px + env(safe-area-inset-right,0px))}.v5est.fldeco .flpop.cL{left:calc(80px + env(safe-area-inset-left,0px))}
.v4ler.v5est.fldeco .dkpan.flcar.cR{right:calc(80px + env(safe-area-inset-right,0px))!important;left:auto!important}.v4ler.v5est.fldeco .dkpan.flcar.cL{left:calc(80px + env(safe-area-inset-left,0px))!important;right:auto!important}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-fln1]')) { const st = document.createElement('style'); st.dataset.fln1 = 1; st.textContent = FLN1_CSS; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-fln1]')) { const st = document.createElement('style'); st.dataset.fln1 = 1; st.textContent = FLN1_CSS; sr.append(st); } }); } catch {}
// a estante sabe que no Decorar a coluna é mais larga (marca a raiz antes de medir)
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { const R = flQ('.v5est'); if (R) R.classList.toggle('fldeco', SHX_MODE === 'deco' && flActive()); } catch {} return r; }; }
{ const _bw = flBW; flBW = function () { let w = _bw.apply(this, arguments); try { const R = flQ('.v5est'), dk = SHX_MODE === 'deco' && flActive(), has = R && R.classList.contains('fldeco') && R.classList.contains('flmode'); if (dk && !has) w -= 18; else if (!dk && has) w += 18; } catch {} return Math.max(200, w); }; }
