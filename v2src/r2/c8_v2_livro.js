// v2 etapa 2 (19/11): página do livro (da estante e do catálogo) no padrão novo.
//  - Topo: cartão com fundo suave no tom do acento, capa grande com sombra de livro, título em serifa, autor em
//    destaque (continua tocável), selos em pílula.
//  - "Meu exemplar" e "Onde comprar" viram dois blocos lado a lado (só CSS: os blocos deles se reposicionam sozinhos).
//  - Abas em pílula (c6); seções (sinopse, ficha, minha leitura, diário, avaliação, ajustes, trechos, ressaca…) em
//    cartões do padrão, com títulos em serifa e números em blocos.
// Só visual: nenhum botão muda de ação.
{ const st = document.createElement('style'); st.textContent = `
#shelflist .bp-hero{position:relative;display:grid!important;grid-template-columns:auto 1fr!important;gap:1rem!important;align-items:end!important;padding:1.1rem 1rem 1.05rem!important;margin:.2rem 0 .9rem!important;border-radius:24px!important;border:1px solid var(--line)!important;background:radial-gradient(120% 90% at 0% 0%,color-mix(in srgb,var(--acc) 16%,var(--panel)),var(--panel) 70%)!important;box-shadow:var(--v2-sh)!important;overflow:visible}
#shelflist .bp-hero .bp-cv{width:112px!important;height:168px!important;border-radius:5px 11px 11px 5px!important;box-shadow:0 18px 32px rgba(40,20,5,.3),0 3px 8px rgba(40,20,5,.18)!important;margin-top:-1.6rem!important;transform:rotate(-2deg);transition:transform .2s}
#shelflist .bp-hero .bp-cv:hover{transform:rotate(0) translateY(-3px)}
#shelflist .bp-hero .bp-cv::before{content:"";position:absolute;left:0;top:0;bottom:0;width:8px;background:linear-gradient(90deg,rgba(0,0,0,.25),rgba(255,255,255,.1) 60%,transparent);border-radius:5px 0 0 5px;z-index:1;pointer-events:none}
#shelflist .bp-ht h2{font-family:var(--v2-disp)!important;font-style:normal!important;font-size:1.32rem!important;line-height:1.15!important;font-weight:700!important;color:var(--ink)!important;margin:0 0 .3rem!important}
#shelflist .bp-ht > small,#shelflist .bp-ht > a,#shelflist .bp-ht .bp-au{display:inline-block;font-size:.84rem!important;font-weight:800!important;color:var(--acc)!important;text-decoration:none!important}
#shelflist .bp-chips{gap:.3rem!important;margin-top:.55rem!important;flex-wrap:wrap}
#shelflist .bp-chip{border-radius:999px!important;border:0!important;background:color-mix(in srgb,var(--ink) 7%,var(--panel))!important;color:var(--ink)!important;font-size:.72rem!important;font-weight:900!important;padding:.25rem .65rem!important}
#shelflist .bp-chip:first-child{background:color-mix(in srgb,var(--acc) 16%,var(--panel))!important;color:var(--acc)!important}
/* exemplar e onde comprar lado a lado */
#shelflist .sl-body:has(> .bp-hero){grid-template-columns:1fr 1fr!important;column-gap:.55rem!important}
#shelflist .sl-body:has(> .bp-hero) > *{grid-column:1/-1}
#shelflist .sl-body:has(> .bp-hero) > :is(.bp-ex,.bp-buy){grid-column:auto!important}
#shelflist .sl-body > :is(.bp-ex,.bp-buy){display:grid!important;width:auto!important;margin:0 0 .2rem!important;grid-template-columns:auto 1fr!important;align-items:center;gap:.5rem!important;text-align:left;border-radius:18px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.7rem .75rem!important;min-height:64px}
#shelflist .sl-body > :is(.bp-ex,.bp-buy) > em{display:none!important}
#shelflist .sl-body > :is(.bp-ex,.bp-buy) i{width:34px;height:34px;border-radius:12px;display:grid!important;place-items:center;background:color-mix(in srgb,var(--acc) 12%,var(--panel));font-style:normal;font-size:1rem}
#shelflist .sl-body > :is(.bp-ex,.bp-buy) b{display:block;font-size:.84rem!important;font-weight:900!important;color:var(--ink)}
#shelflist .sl-body > :is(.bp-ex,.bp-buy) small{display:block;font-size:.68rem!important;line-height:1.25;color:var(--ink-2)!important;font-weight:700;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
#shelflist .bp-tabs{margin:.2rem 0 .9rem!important;overflow-x:auto;scrollbar-width:none}
#shelflist .bp-tabs > button{flex:1 0 auto!important;font-size:.8rem!important;padding:0 .7rem!important}
#shelflist .bp-tabs::-webkit-scrollbar{display:none}
/* seções */
#shelflist .bp-sec,#shelflist .bp-card,#shelflist .bp-dl{border-radius:var(--v2-r)!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;padding:.95rem 1rem!important;margin:0 0 .85rem!important}
#shelflist .bp-desc{font-size:.93rem!important;line-height:1.6!important;color:var(--ink)}
#shelflist .bp-more{border:0!important;background:none!important;color:var(--acc)!important;font-weight:900!important;padding:.3rem 0 0!important}
#shelflist .bp-load{color:var(--ink-2);font-weight:700;text-align:center;padding:.6rem 0}
#shelflist .bp-dl{display:grid!important;grid-template-columns:auto 1fr!important;gap:.45rem 1rem!important}
#shelflist .bp-dl dt{font-size:.72rem!important;font-weight:900!important;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)!important;align-self:center}
#shelflist .bp-dl dd{margin:0!important;font-weight:800!important;color:var(--ink)!important}
#shelflist .bp-row > span:first-child{font-family:var(--v2-disp)!important;font-size:1.05rem!important;font-weight:700!important;color:var(--ink)!important}
#shelflist > .sl-body > .bp-row{margin:1.1rem .1rem .45rem!important}
#shelflist .bp-link{border:0!important;background:none!important;color:var(--acc)!important;font-weight:900!important}
#shelflist .bp-stats{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:.45rem!important}
#shelflist .bp-stats > div{border-radius:14px!important;border:0!important;background:color-mix(in srgb,var(--ink) 4%,var(--panel))!important;padding:.6rem .65rem!important}
#shelflist .bp-stats b{font-size:1rem!important;font-weight:900!important;color:var(--ink)}
#shelflist .bp-stats small{font-size:.66rem!important;font-weight:800!important;color:var(--ink-2)!important}
#shelflist .bp-st{border-radius:999px!important;border:1.5px solid var(--line)!important;background:var(--bg)!important;font-weight:900!important;padding:.35rem .8rem!important}
#shelflist .rc-prog .mt-bar{height:8px!important;border-radius:9px!important}
#shelflist .bp-btn{height:48px!important;width:100%;font-size:.95rem!important}
#shelflist .bp-adj{border-radius:14px!important;border:0!important;background:color-mix(in srgb,var(--ink) 3.5%,var(--panel))!important;padding:.75rem .85rem!important;margin-top:.35rem!important}
#shelflist .bp-adj:hover{background:color-mix(in srgb,var(--acc) 9%,var(--panel))!important}
#shelflist .dy-it{border-radius:14px;background:color-mix(in srgb,var(--ink) 3.5%,var(--panel));padding:.65rem .75rem;margin-top:.45rem;border:0!important}
#shelflist .bq{border-radius:14px!important;border:0!important;border-left:3px solid var(--acc)!important;background:color-mix(in srgb,var(--acc) 6%,var(--panel))!important;padding:.75rem .85rem!important}
#shelflist .bq q{font-family:var(--v2-disp);font-style:italic;font-size:.98rem;line-height:1.45}
#shelflist .bp-src{font-size:.72rem;color:var(--ink-2);text-align:center;margin:.2rem 0 .6rem}
#shelflist .sl-top .es-dots{width:40px!important;height:40px!important;border-radius:50%!important;border:1.5px solid var(--line)!important;background:var(--panel)!important}
/* avaliação em página inteira (Sua avaliação / Avaliar) — fica no document.body */
.rt-view .rtf-top,.rt-full .rtf-top{background:var(--bg)}
.rtf-top b{font-family:var(--v2-disp)!important;font-size:1.25rem!important;font-weight:700!important;color:var(--ink)}
.rtf-x{width:40px;height:40px;border-radius:50%!important;border:1.5px solid var(--line)!important}
.rtf-hd{border-radius:24px!important;border:1px solid var(--line)!important;background:radial-gradient(120% 90% at 0% 0%,color-mix(in srgb,var(--acc) 16%,var(--panel)),var(--panel) 70%)!important;box-shadow:var(--v2-sh)!important;padding:1rem!important}
.rtf-hd .cv{border-radius:4px 9px 9px 4px!important;box-shadow:0 12px 24px rgba(40,20,5,.26)!important}
.rtf-info b{font-family:var(--v2-disp)!important;font-size:1.2rem!important;font-weight:700!important;line-height:1.2}
.rtf-ed{background:var(--v2-pri)!important;color:var(--on-acc,#fff)!important;box-shadow:var(--v2-pri-sh)!important;border-radius:999px!important}
.rtf-lb{font-family:var(--v2-disp)!important;font-size:1.05rem!important;font-weight:700!important}
.rv-dates > *{border-radius:16px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important}
.rv-paws{font-family:var(--v2-disp)}
.rtf-view .rv-txt{border-radius:var(--v2-r);border:1px solid var(--line);background:var(--panel);box-shadow:var(--v2-sh);padding:.9rem 1rem;line-height:1.55}
/* Atualizar leitura (diário): abas em pílula, status em pílulas, atalhos em blocos, Salvar no degradê */
#editor .ss-title{font-family:var(--v2-disp)!important;font-size:1.22rem!important;font-weight:700!important;color:var(--ink)!important}
#editor .ss-hd{border-radius:18px;background:color-mix(in srgb,var(--acc) 7%,var(--panel));padding:.6rem .7rem}
#editor .ss-hd .cv{border-radius:3px 7px 7px 3px!important;box-shadow:0 6px 14px rgba(40,20,5,.22)!important}
#editor .tl-tabs,#editor .up-seg{display:flex!important;gap:.25rem!important;padding:.25rem!important;border-radius:14px!important;background:var(--v2-seg)!important;border:0!important}
#editor .tl-tabs > button,#editor .up-seg > button{flex:1 1 0;height:36px!important;border:0!important;border-radius:11px!important;background:none!important;color:var(--ink-2)!important;font-weight:900!important;box-shadow:none!important}
#editor .tl-tabs > button.on,#editor .up-seg > button.on{background:var(--panel)!important;color:var(--ink)!important;box-shadow:0 1px 4px rgba(0,0,0,.09)!important}
#editor .ss-chips{gap:.35rem!important}
#editor .ss-chips > button{border-radius:999px!important;border:1.5px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font-weight:800!important}
#editor .ss-chips > button.on{background:var(--ink)!important;border-color:var(--ink)!important;color:var(--bg)!important}
#editor .lz-acts{gap:.45rem!important}
#editor .lz-acts > button{border-radius:16px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important}
#editor .up-big input{border-radius:18px!important;font-family:var(--v2-disp)}
#editor .up-save{background:var(--v2-pri)!important;color:var(--on-acc,#fff)!important;border:0!important;border-radius:16px!important;box-shadow:var(--v2-pri-sh)!important;font-weight:900!important}
#editor .up-fin{border-radius:16px!important;border:1.5px solid #2f8a52!important;background:var(--panel)!important;color:#2f8a52!important;font-weight:900!important}
`; TR.append(st);
  // a avaliação em página inteira (.rtf-*) vive no document.body: as mesmas regras valem lá
  const hd = document.createElement('style'); hd.textContent = st.textContent; document.head.append(hd); }
