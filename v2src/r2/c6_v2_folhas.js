// v2 etapa 2 (19/11, branch livroverso-2): folhas, menus flutuantes, botões e campos no padrão novo, no app inteiro.
//  - Folhas (#editor compacto, .sheet antiga, painel de filtro): cantos 26px em cima, puxador, título em serifa,
//    linhas de opção com raio 14px e toque suave.
//  - Menus flutuantes (.pop, .bkm do livro, painel da Estante): cartão de 18px, sombra macia, itens com raio 12px.
//  - Botões: principal em degradê do acento (o mesmo do "Ler agora"); secundário claro com borda.
//  - Campos: raio 14px, fundo do tema, foco com anel do acento.
//  - Abas em pílula (segmentado), iguais às de Avisos, para todas as telas que usam .v3-seg.
// Só visual: nenhuma função muda de lugar.
{ const st = document.createElement('style'); st.textContent = `
:host{--v2-pri:linear-gradient(135deg,color-mix(in srgb,var(--acc) 62%,#ffd6a3),var(--acc));--v2-pri-sh:0 8px 18px color-mix(in srgb,var(--acc) 32%,transparent);--v2-seg:color-mix(in srgb,var(--line) 55%,var(--bg))}
/* ---------- folhas ---------- */
#editor.compact .ed-body{border-radius:26px 26px 0 0!important;padding-top:1.55rem!important;box-shadow:0 -14px 40px rgba(20,10,0,.22)!important}
#editor.compact .ed-body::before,.sheet .box::before{content:"";position:absolute;left:50%;top:.55rem;width:42px;height:4.5px;margin-left:-21px;border-radius:9px;background:color-mix(in srgb,var(--ink) 18%,transparent)}
#editor .ed-body > h3,#editor .ed-body h3:first-child,.sheet .box > h3{font-family:var(--v2-disp)!important;font-size:1.22rem!important;font-weight:700!important;letter-spacing:0!important;color:var(--ink)!important;margin:0 0 .2rem!important;text-align:left}
.sheet .box{position:relative;border-radius:26px 26px 0 0!important;padding:1.55rem 1rem calc(1rem + env(safe-area-inset-bottom,0px))!important;background:var(--panel)!important;border:0!important;box-shadow:0 -14px 40px rgba(20,10,0,.22)!important;display:grid;gap:.35rem}
.sheet .box > button{border:0!important;border-radius:14px!important;background:var(--bg)!important;color:var(--ink)!important;font:inherit;font-weight:800!important;text-align:left;padding:.85rem 1rem!important;min-height:48px}
.sheet .box > button.cancel{background:none!important;text-align:center;color:var(--ink-2)!important}
.bm-list{display:grid;gap:.3rem}
#editor .bm-it{border:0!important;border-radius:14px!important;background:color-mix(in srgb,var(--ink) 3.5%,var(--panel))!important;padding:.8rem .95rem!important;min-height:50px;font-weight:800!important;color:var(--ink)!important;transition:background .15s}
#editor .bm-it:hover,#editor .bm-it:active{background:color-mix(in srgb,var(--acc) 10%,var(--panel))!important}
#editor .bm-it.on{background:color-mix(in srgb,var(--acc) 14%,var(--panel))!important;color:var(--acc)!important}
#editor .bm-it.danger{color:#c0392b!important}
#editor .bm-it small{color:var(--ink-2)!important;font-weight:700!important}
#editor .bm-list hr,.pop hr,.bkm hr{border:0!important;border-top:1px solid var(--line)!important;margin:.25rem .4rem!important}
#editor .bm-close{border-radius:14px!important}
/* ---------- menus flutuantes ---------- */
.pop,.bkm{border-radius:18px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:0 18px 44px rgba(20,10,0,.24),0 2px 6px rgba(20,10,0,.08)!important;padding:.35rem!important;overflow:hidden}
.pop .pop-it,.bkm button{border-radius:12px!important;border:0!important;background:none;color:var(--ink);transition:background .12s}
.pop .pop-it{padding:.62rem .75rem!important;min-height:44px}
.pop .pop-it:hover,.bkm button:hover,.pop .pop-it:active,.bkm button:active{background:color-mix(in srgb,var(--acc) 9%,var(--panel))!important}
.pop .pop-it.on{color:var(--acc)!important;background:color-mix(in srgb,var(--acc) 11%,var(--panel))!important}
.pop .pop-it small{color:var(--ink-2)!important}
.bkm > header,.bkm .bkm-h{border-radius:12px;background:color-mix(in srgb,var(--acc) 6%,var(--panel))}
.esn-sheet.esn-pop .box{border-radius:20px!important;box-shadow:0 18px 44px rgba(20,10,0,.24)!important}
.esn-sheet.esn-pop .box h3{font-family:var(--v2-disp)!important;font-size:1.08rem!important}
/* ---------- botões ---------- */
#editor .op,#editor button.p,#editor .bp-btn.pri,.bp-btn.pri,.esn-sheet .acts .p,#editor .rv-ok,#editor .sv-ok,#editor button.pri,.ct-go,.v2-btn-pri{background:var(--v2-pri)!important;color:var(--on-acc,#fff)!important;border:0!important;border-radius:16px!important;font-weight:900!important;box-shadow:var(--v2-pri-sh)!important}
#editor .cn,#editor button.ghost,.esn-sheet .acts button:not(.p),.bp-btn:not(.pri){border-radius:16px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font-weight:800!important;box-shadow:none!important}
#editor .op *,#editor button.p *,#editor .bp-btn.pri *,#editor button.pri *,.ct-go *{color:inherit!important}
#editor .op:disabled,#editor button.p:disabled,#editor button.pri:disabled{opacity:.55!important}
/* ---------- campos ---------- */
#editor input[type=text],#editor input[type=number],#editor input[type=search],#editor input[type=date],#editor input:not([type]),#editor textarea,#editor select,.fs-input,#lista input#esn-q{border-radius:14px!important;border:1.5px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important;font:inherit;transition:border-color .15s,box-shadow .15s}
#editor input:focus,#editor textarea:focus,#editor select:focus,.fs-input:focus{outline:none!important;border-color:var(--acc)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 18%,transparent)!important}
#editor label > b,#editor .lb,#editor .fld > span{font-size:.7rem;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}
/* ---------- abas em pílula ---------- */
.v3-seg,.esn-tabs,.bp-tabs{display:flex!important;gap:.25rem!important;padding:.25rem!important;border-radius:14px!important;background:var(--v2-seg)!important;border:0!important;box-shadow:none!important}
.v3-seg > button,.esn-tabs > button,.bp-tabs > button{flex:1 1 0;min-width:0;height:38px!important;border:0!important;border-radius:11px!important;background:none!important;color:var(--ink-2)!important;font:inherit;font-size:.84rem!important;font-weight:900!important;white-space:nowrap;box-shadow:none!important;padding:0 .5rem!important}
.v3-seg > button::after,.esn-tabs > button::after,.bp-tabs > button::after{display:none!important}
.v3-seg > button.on,.esn-tabs > button.on,.bp-tabs > button.on{background:var(--panel)!important;color:var(--ink)!important;box-shadow:0 1px 4px rgba(0,0,0,.09)!important}
`; TR.append(st);
  // a folha antiga (sheet) e a avaliação em página inteira ficam no document.body, fora do shadow root: mesmo estilo lá
  const hd = document.createElement('style'); hd.textContent = ":root{--v2-r:20px;--v2-sh:0 1px 2px rgba(60,35,10,.05),0 8px 22px rgba(60,35,10,.06);--v2-disp:Georgia,'Times New Roman',serif}" + st.textContent.replace(/:host{/g, ':root{'); document.head.append(hd); }
