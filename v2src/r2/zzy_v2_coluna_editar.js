// ---------- Estante: "Editar" no lugar do •••, ferramentas só na edição, coluna recolhível (Bia, 24/11) ----------
// Na visualização da Prateleira fica um botão só, "Editar", que entra direto no Organizar (a coluna de ferramentas é a da
// edição). Adicionar livro e Ajuda, que moravam no ••• da visualização, entram na coluna do Organizar; Decorar já está lá.
// Tocar na alça "—" recolhe a coluna num botão pequeno ("Abrir"); a estante não encolhe na edição (a coluna flutua por cima).
const FLE_PEN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/></svg>';
const FLE_TOOLS = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
const FLE_ADD = '<svg viewBox="0 0 24 24" width="19" height="19" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
// visualização: só "Editar"
flnHTML = function () { const side = (() => { try { return v5P().flCol === 'L' ? 'L' : 'R'; } catch { return 'R'; } })();
  return `<div class="flncol ${side} fled1" role="toolbar" aria-label="Estante"><button type="button" class="tg fled" data-a="shmode" data-v="org" aria-label="Editar a estante">${FLE_PEN}<span class="fledl">Editar</span></button></div>`; };
// edição: Adicionar e Ajuda na coluna do Organizar; coluna recolhida vira um botão
{ const _c = flColHTML; flColHTML = function () { const md = SHX_MODE;
    if ((md === 'org' || md === 'deco') && FLX.colMin) return `<div class="flcol ${flColSide()} flmin" role="toolbar" aria-label="Ferramentas"><button type="button" class="flcb" data-fl="colmax" aria-label="Mostrar as ferramentas">${FLE_TOOLS}<span class="flbl" aria-hidden="true">Mostrar as ferramentas</span></button></div>`;
    let h = _c.apply(this, arguments); try { if (md !== 'org') return h;
      const B = (a, ic, lab) => `<button type="button" class="flcb" ${a} aria-label="${lab}">${ic}<span class="flbl" aria-hidden="true">${lab}</span></button>`;
      const add = B('data-a="sheet" data-s="v5add"', FLE_ADD, 'Adicionar livro'), help = B('data-a="shxsheet" data-s="shxleg"', '<b style="font-size:17px;font-weight:900;line-height:1">?</b>', 'Como ler a estante');
      h = h.replace(/(<button[^>]*data-fl="redo"[\s\S]*?<\/button>)/, `$1${add}`).replace(/(<button[^>]*data-fl="more"[\s\S]*?<\/button>)/, `${help}$1`); } catch (err) { console.warn('coluna: extras', err); } return h; }; }
{ const _a = flAct; flAct = function (k, el) { if (k === 'colmax') { FLX.colMin = false; return flRender(); } return _a.apply(this, arguments); }; }
{ const _x = shExitEdit; shExitEdit = function () { FLX.colMin = false; return _x.apply(this, arguments); }; }
window.addEventListener('click', (ev) => { try { const T = ev.composedPath()[0], b = T && T.closest && T.closest('[data-a="shdone"]'); if (b) FLX.colMin = false; } catch {} }, true);
const FLE_CSS = `.v4ler .flncol.fled1{padding:0;background:none;box-shadow:none;-webkit-backdrop-filter:none;backdrop-filter:none}
.v4ler .flncol .tg.fled{width:auto!important;height:44px!important;padding:0 16px 0 13px!important;border-radius:22px!important;display:inline-flex!important;align-items:center;gap:7px;font:inherit;font-weight:800;font-size:14px;background:var(--card)!important;color:var(--ink)!important;border:1px solid var(--line)!important;box-shadow:0 4px 14px rgba(0,0,0,.28)!important}
.v4ler .flncol .tg.fled .fledl{position:static;opacity:1;pointer-events:none}
.v4ler .flcol.flmin{padding:4px}
.v4ler .flcol{background:color-mix(in srgb,var(--card) 80%,transparent);box-shadow:0 8px 24px rgba(0,0,0,.3)}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-fle]')) { const st = document.createElement('style'); st.dataset.fle = 1; st.textContent = FLE_CSS; sr.append(st); } } catch {} }; }
try { SHX_ROOTS.forEach((sr) => { if (sr && !sr.querySelector('style[data-fle]')) { const st = document.createElement('style'); st.dataset.fle = 1; st.textContent = FLE_CSS; sr.append(st); } }); } catch {}
