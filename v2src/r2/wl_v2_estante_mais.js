// Estante — parte 3 (Bia, 21/11): toque para pegar e toque para pôr, posições (em pé · deitado · de frente · inclinado),
// "Arrumar por", "Esvaziar e arrumar" com bandeja, plaquinhas, lombada fácil de achar, parede de madeira,
// luzinhas com modelos e lugares (até 3 cordões), acabamento das luzes/objetos/madeira, leitor digital,
// e a aba Estante das Leituras por mês com a mesma estante (ordem de leitura + plaquinha por mês).
var SHX_PQT = '', SHX_PICK = null, SHX_PKP = 'pe', SHX_TRF = 'todos', SHX_TRS = 'ord', SHX_LBP = 0, SHX_PQE = -1, SHX_PQS = 'mad', SHX_LTE = 0, SHX_LTN = 0, SHX_PQD = null;
SH_CAT.push(['leitor', 'Leitor digital']); SH_DN.leitor = 'Leitor digital'; SH_DW.leitor = 50; SH_DH.leitor = 84;

const SHX_CSS3 = `
.v4ler .bsh,.v4ler .bsh *{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent}
.v4ler .bsh.org .brow,.v4ler .bsh.org .bpl{touch-action:pan-y}
.v4ler .bsh.org .sp,.v4ler .bsh.org .pb,.v4ler .bsh.org .face{touch-action:none}
.v4ler .bsh .face,.v4ler .bsh.org .face{transform:none}
.v4ler .bsh .sp.cvs{background-image:linear-gradient(90deg,rgba(0,0,0,.20),rgba(255,255,255,.10) 18%,rgba(255,255,255,0) 40%,rgba(0,0,0,.08) 85%,rgba(0,0,0,.24)),repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 1px,transparent 1px 3px)!important;background-size:auto!important}
.v4ler .bsh .sp .cb{position:absolute;left:0;right:0;top:0;background-size:cover;background-position:0 0;box-shadow:inset 0 -1px 0 rgba(0,0,0,.25),0 1px 0 rgba(255,255,255,.12);z-index:0;filter:saturate(1.05)}
.v4ler .bsh .sp.cvs .tt,.v4ler .bsh .sp.cvs .au{color:var(--k);text-shadow:none}
.v4ler .bsh .sp .tp{display:none}
/* toque para pegar */
.v4ler .bsh.org [data-bid].pk{outline:3px solid var(--acc)!important;outline-offset:2px;transform:translateY(-8px);box-shadow:0 10px 16px rgba(0,0,0,.3)}
.v4ler .bsh .ins{flex:none;position:relative;width:0;align-self:stretch;z-index:6}
.v4ler .bsh .ins button{position:absolute;left:-13px;bottom:var(--ib,26px);width:26px;height:40px;border-radius:10px;border:2px solid #fff;background:var(--acc);color:#fff;font:900 20px/1 system-ui,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.35);cursor:pointer;padding:0}
.v4ler .bsh .ins.hi{--ib:84px}
.v4ler .bsh .ins.wide{width:auto;flex:1;display:flex;align-items:flex-end;justify-content:center}
.v4ler .bsh .ins.wide button{position:static;width:auto;padding:0 18px;margin-bottom:34px;font-size:14px}
.v4ler .bsh .pile .insp{position:absolute;left:50%;top:-50px;margin-left:-22px;width:44px;height:40px;border-radius:10px;border:2px solid #fff;background:color-mix(in srgb,var(--acc) 82%,#000);color:#fff;font:900 18px/1 system-ui;z-index:6;box-shadow:0 3px 10px rgba(0,0,0,.35)}
.v4ler .shban2 small{max-width:none}
.v4ler .shorg{display:flex;flex-wrap:wrap;gap:6px;margin:-2px 0 10px}
.v4ler .shorg button{min-height:40px;padding:0 14px;border-radius:99px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-size:13px;font-weight:800;cursor:pointer}
.v4ler .shorg button b{color:var(--acc)}
.v4ler .shnote{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:9px 12px;border-radius:14px;background:color-mix(in srgb,var(--acc) 12%,var(--card));font-size:13px;font-weight:700}
.v4ler .shnote span{flex:1}
.v4ler .shnote button,.v4ler .shpk .pkx,.v4ler .shtr .trh button{min-height:38px;padding:0 14px;border:0;border-radius:10px;background:var(--acc);color:#fff;font:inherit;font-weight:800;cursor:pointer}
.v4ler .shpk,.v4ler .shtr{position:fixed;left:0;right:0;bottom:var(--shx-tab,0px);z-index:9400;max-width:560px;margin:0 auto;box-sizing:border-box;background:var(--card);color:var(--ink);border-radius:20px 20px 0 0;box-shadow:0 -12px 32px rgba(0,0,0,.28);padding:10px max(14px,env(safe-area-inset-left,0px)) calc(12px + env(safe-area-inset-bottom,0px));max-height:46%;overflow-y:auto}
.v4ler .shpk .pkh,.v4ler .shtr .trh{display:flex;align-items:center;gap:10px}
.v4ler .shpk .pkh b,.v4ler .shtr .trh b{flex:1;font-size:14.5px;line-height:1.2}
.v4ler .shpk .pkh small,.v4ler .shtr small{display:block;font-size:11.5px;font-weight:600;color:var(--ink2);margin-top:2px}
.v4ler .shpk .pkh .pkc{width:34px;height:50px;border-radius:3px;background:var(--c,#999) center/cover;flex:none;box-shadow:0 2px 6px rgba(0,0,0,.25)}
.v4ler .shpk .pkx.s,.v4ler .shtr .trh button.s{background:var(--soft);color:var(--ink)}
.v4ler .shpk .dchips button,.v4ler .shtr .dchips button{min-height:34px;padding:0 11px;font-size:12px}
.v4ler .shtr .trh{flex-wrap:wrap}.v4ler .shtr .trh b{flex-basis:100%}.v4ler .shtr .trh button{min-height:34px;padding:0 12px;font-size:12.5px}
.v4ler .pkl{margin:8px 0 4px;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3)}
.v4ler .dchips{display:flex;flex-wrap:wrap;gap:6px}
.v4ler .dchips button{min-height:38px;padding:0 13px;border-radius:99px;border:1px solid var(--line);background:none;font:inherit;font-size:12.5px;font-weight:800;color:var(--ink);cursor:pointer}
.v4ler .dchips button.on{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.v4ler .pklb{display:flex;gap:10px;align-items:flex-start}
.v4ler .pklb .lbv{flex:none;width:40px;height:84px;overflow:hidden;border-radius:6px;background:var(--soft);display:flex;align-items:flex-end;justify-content:center;padding-bottom:3px;box-sizing:border-box}
.v4ler .bsh.pkprev{margin:0!important;padding:0!important;background:none!important;zoom:.48;display:flex}
.v4ler .shtr .trl{display:flex;gap:8px;overflow-x:auto;padding:8px 2px 4px;scrollbar-width:none}
.v4ler .shtr .trb{flex:none;width:58px;border:0;background:none;padding:0;font:inherit;font-size:10.5px;font-weight:700;color:var(--ink2);text-align:center;cursor:pointer}
.v4ler .shtr .trb .tc{display:block;width:58px;height:86px;border-radius:4px;background:var(--c,#8a7a66) center/cover;box-shadow:0 2px 6px rgba(0,0,0,.25);margin-bottom:4px;color:#fff;font-size:9px;padding:4px;box-sizing:border-box;overflow:hidden;text-align:left}
.v4ler .shtr .trb span:last-child{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v4ler .shtr .trb.on .tc{outline:3px solid var(--acc);outline-offset:2px;transform:translateY(-4px)}
.v4ler .shtr .trp{margin-top:8px;padding:9px 10px;border-radius:12px;background:color-mix(in srgb,var(--acc) 12%,var(--card));font-size:12.5px;font-weight:700}
/* plaquinhas */
.v4ler .bsh .bpl .plq{position:absolute;top:1px;transform:translateX(-50%);z-index:5;max-width:46%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:800 9px/1.25 system-ui,sans-serif;padding:2px 8px;border-radius:2px;letter-spacing:.05em;pointer-events:none}
.v4ler .bsh.deco .bpl .plq.u{pointer-events:auto;cursor:grab;touch-action:none;outline:1.5px dashed color-mix(in srgb,var(--acc) 80%,transparent);outline-offset:2px}
.v4ler .bsh .bpl .plq.ed{outline:2.5px solid var(--acc)}
.v4ler .bsh .bpl .plq.mk{transform:none;font-size:8px;padding:2px 6px;text-transform:uppercase;letter-spacing:.14em}
.v4ler .plq.s-mad{background:linear-gradient(180deg,#b08254,#80582f 60%,#6c4826);color:#2e1a08;text-shadow:0 1px 0 rgba(255,222,176,.4);box-shadow:inset 0 1px 0 rgba(255,232,196,.4),inset 0 -1px 1px rgba(0,0,0,.35),0 2px 3px rgba(0,0,0,.32);font-family:var(--f-disp,Georgia,serif)!important;font-style:italic;font-weight:700}
.v4ler .plq.s-latao{background:radial-gradient(circle at 4px 50%,#6f5018 0 1px,transparent 1.5px),radial-gradient(circle at calc(100% - 4px) 50%,#6f5018 0 1px,transparent 1.5px),linear-gradient(180deg,#fbe9ac,#d8ae52 48%,#a77a26);color:#3f2c0a;text-shadow:0 1px 0 rgba(255,246,214,.6);box-shadow:inset 0 0 0 .6px rgba(90,60,10,.6),0 2px 3px rgba(0,0,0,.3);text-transform:uppercase;letter-spacing:.14em!important;padding:2px 10px!important}
.v4ler .plq.s-lousa{background:radial-gradient(60% 80% at 30% 30%,rgba(255,255,255,.06),transparent),#2c3a33;color:#f4f1e8;border:2px solid #a87b4b;box-shadow:0 2px 3px rgba(0,0,0,.32);font-family:'Segoe Print','Bradley Hand','Comic Sans MS',cursive!important;font-weight:700;font-size:9.5px!important;text-shadow:0 0 1px rgba(255,255,255,.7);padding:0 7px!important;letter-spacing:.02em!important}
.v4ler .plq.s-kraft{background:repeating-linear-gradient(35deg,rgba(255,255,255,.07) 0 2px,transparent 2px 5px),#c9a26b;color:#33240f;font-family:'Courier New',monospace!important;font-weight:700;box-shadow:0 2px 3px rgba(0,0,0,.28);transform:translateX(-50%) rotate(-2deg)!important}
.v4ler .pqin{display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:12px;padding:0 10px;margin-bottom:8px}
.v4ler .pqin input{flex:1;min-width:0;min-height:44px;border:0;background:none;font:inherit;font-size:15px;color:var(--ink);outline:none}
.v4ler .pqin .cnt{font-size:11px;font-weight:800;color:var(--ink3)}
.v4ler .pqsw{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.v4ler .pqsw button{display:grid;place-items:center;min-height:52px;border-radius:12px;border:1px solid var(--line);background:var(--soft);cursor:pointer;padding:6px 2px;gap:4px;font:inherit;font-size:11px;font-weight:700;color:var(--ink)}
.v4ler .pqsw button.on{border-color:var(--acc);box-shadow:inset 0 0 0 1.5px var(--acc)}
.v4ler .pqsw .plq{position:static;transform:none!important;display:inline-block;font-size:9px;padding:2px 7px;border-radius:2px}
.v4ler .dkrow{display:flex;gap:8px;margin-top:10px}.v4ler .dkrow .btn{flex:1;min-height:44px;justify-content:center}
.v4ler .dkpan .dtabs.six{grid-template-columns:repeat(3,1fr)}
.v4ler .dkpan .dkh.on{color:var(--acc);font-weight:800}
.v4ler .dkpan .ltc{display:block;width:100%;text-align:left;padding:9px 12px;margin-bottom:6px;border-radius:12px;border:1px solid var(--line);background:none;font:inherit;font-size:13.5px;font-weight:800;color:var(--ink);cursor:pointer}
.v4ler .dkpan .ltc small{display:block;font-size:11.5px;font-weight:600;color:var(--ink2)}
.v4ler .dkpan .ltc.on{border-color:var(--acc);box-shadow:inset 0 0 0 1.5px var(--acc)}
/* madeira e profundidade (luz principal: topo à esquerda) */
.v4ler .bsh .bpl{background:linear-gradient(180deg,rgba(255,246,226,.55) 0,rgba(255,246,226,0) 1.5px),linear-gradient(180deg,transparent 4px,rgba(255,236,204,.38) 4px 5px,transparent 7px),repeating-linear-gradient(178deg,rgba(60,30,10,.06) 0 1px,transparent 1px 3px,rgba(255,230,190,.04) 3px 4px,transparent 4px 7px),linear-gradient(180deg,var(--bk-top) 0,var(--bk-top) 4px,var(--bk-w1) 4px,var(--bk-w2) 70%,var(--bk-w3));box-shadow:0 8px 10px -4px var(--bk-sh),inset 0 -1.5px 0 rgba(0,0,0,.28)}
.v4ler .bsh .bay::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.17),rgba(0,0,0,0) 18px,rgba(0,0,0,0) calc(100% - 22px),rgba(0,0,0,.22)),linear-gradient(0deg,rgba(0,0,0,.13),rgba(0,0,0,0) 9px),radial-gradient(36px 28px at 0 0,rgba(0,0,0,.20),transparent),radial-gradient(36px 28px at 100% 0,rgba(0,0,0,.24),transparent)}
.v4ler .bsh .case{position:relative}
.v4ler .bsh .brow>.dec>svg,.v4ler .bsh .pile>.dec>svg{filter:drop-shadow(-.7px -.7px 0 rgba(255,248,230,.38)) drop-shadow(2px 2.5px 1.6px rgba(0,0,0,.30))}
.v4ler .bsh .dec.lk{pointer-events:auto;cursor:pointer}
.v4ler .bsh.w-madeira{--bk-wall:color-mix(in srgb,var(--bk-w3) 72%,#160c05);--bk-back:color-mix(in srgb,var(--bk-w2) 70%,#22130a);--bk-hint:#f1dfc4;background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.14) 0 1px,transparent 1px 46px),repeating-linear-gradient(90deg,rgba(255,236,206,.03) 0 3px,transparent 3px 11px)}
.v4ler .bsh.w-madeira .bay{background:linear-gradient(180deg,rgba(0,0,0,.36),rgba(0,0,0,0) 26px),radial-gradient(120% 60% at 50% 105%,var(--bk-glow),transparent 70%),repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 1px,transparent 1px 44px),repeating-linear-gradient(90deg,rgba(255,232,196,.04) 0 2px,transparent 2px 7px,rgba(0,0,0,.035) 7px 9px,transparent 9px 13px),var(--bk-back)}
/* leitor digital */
.v4ler .erd{position:relative;display:block}
.v4ler .erd .bz{position:absolute;left:7%;right:7%;top:0;bottom:11%;border-radius:5px;background:linear-gradient(155deg,#55555b,#2c2c31 38%,#1c1c20);box-shadow:inset 0 0 0 .7px rgba(255,255,255,.16),inset 1px 1px 0 rgba(255,255,255,.12),2px 3px 5px rgba(0,0,0,.38);transform:perspective(160px) rotateX(4deg);transform-origin:50% 100%}
.v4ler .erd .scr{position:absolute;left:9%;right:9%;top:7%;bottom:15%;background:#e8e5dc;border-radius:1px;overflow:hidden;box-shadow:inset 0 0 2px rgba(0,0,0,.45)}
.v4ler .erd .im{position:absolute;inset:0;background-size:cover;background-position:center;filter:grayscale(1) contrast(1.18) brightness(1.06);mix-blend-mode:multiply;opacity:.92}
.v4ler .erd.cor .im{filter:saturate(.9);mix-blend-mode:normal;opacity:1}
.v4ler .erd .tx{position:absolute;inset:12% 10%;font:italic 600 7px/1.2 var(--f-disp,Georgia,serif);color:#2a2a2a;text-align:center;display:grid;place-items:center}
.v4ler .erd .scr::after{content:'';position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.05) .5px,transparent .8px) 0 0/2.5px 2.5px,linear-gradient(125deg,rgba(255,255,255,.34),rgba(255,255,255,0) 34%,rgba(255,255,255,0) 70%,rgba(255,255,255,.08))}
.v4ler .erd .st{position:absolute;left:24%;right:24%;bottom:0;height:13%;background:linear-gradient(180deg,#45454a,#202024);clip-path:polygon(16% 0,84% 0,100% 100%,0 100%);border-radius:1px}
/* luzinhas: miolo claro, halo em camadas, luz que cai na madeira e nas lombadas */
.v4ler .bsh .lgt{position:absolute;pointer-events:none;z-index:3}
.v4ler .bsh .lgt.w-f{left:4px;right:4px;top:6px;height:22px;z-index:4}
.v4ler .bsh .lgt.w-sob{left:8px;right:8px;top:0;height:100%;z-index:2}
.v4ler .bsh .lgt.w-varal{left:2px;right:2px;top:0;height:100%;z-index:2}
.v4ler .bsh .lgt.w-cortina{left:6px;right:6px;top:0;height:100%;z-index:0}
.v4ler .bsh .lgt.w-moldura{left:-12px;right:-12px;top:-6px;bottom:-4px;z-index:6}
.v4ler .bsh .lgt svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}
.v4ler .bsh .lgt i{position:absolute;width:6px;height:9px;margin:-1px 0 0 -3px;background:linear-gradient(#3b2b1d,#3b2b1d) 50% 0/3px 2.5px no-repeat}
.v4ler .bsh .lgt i::after{content:'';position:absolute;left:.5px;right:.5px;top:2px;bottom:0;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 40%,#fff 0 24%,var(--lb) 62%,color-mix(in srgb,var(--lb) 72%,#8a4a12));box-shadow:0 0 2px .5px rgba(var(--lg),.95),0 0 6px 1px rgba(var(--lg),.45)}
.v4ler .bsh .lgt i::before{content:'';position:absolute;left:50%;top:60%;width:var(--hs,26px);height:var(--hs,26px);margin:calc(var(--hs,26px) / -2) 0 0 calc(var(--hs,26px) / -2);border-radius:50%;background:radial-gradient(circle,rgba(var(--lg),.55) 0,rgba(var(--lg),.24) 28%,rgba(var(--lg),.08) 52%,transparent 70%)}
.v4ler .bsh:not(.dk):not(.w-ceu):not(.w-madeira) .lgt i::before{--hs:18px;opacity:.7}
.v4ler .bsh.dk .lgt i::before,.v4ler .bsh.w-ceu .lgt i::before{--hs:34px}
.v4ler .bsh .lgt i.tw::before{animation:shlt var(--t) ease-in-out var(--d) infinite alternate}
@keyframes shlt{0%{opacity:.45;transform:scale(.86)}100%{opacity:1;transform:scale(1.05)}}
.v4ler .bsh .lgt.m-var i{width:10px;height:15px;margin:1px 0 0 -5px;background:linear-gradient(90deg,#2a2018,#6a5440 50%,#2a2018) 50% 0/5px 4px no-repeat}
.v4ler .bsh .lgt.m-var i::after{top:3.5px;border-radius:50% 50% 46% 46%/58% 58% 42% 42%}
.v4ler .bsh .lgt.m-var i::before{--hs:40px}
.v4ler .bsh:not(.dk) .lgt.m-var i::before{--hs:28px}
.v4ler .bsh .lgt.m-est i{width:10px;height:10px;margin:-3px 0 0 -5px;background:none}
.v4ler .bsh .lgt.m-est i::after{inset:0;border-radius:0;clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%);background:radial-gradient(circle at 50% 55%,#fff 0 22%,var(--lb) 66%);box-shadow:none}
.v4ler .bsh .lgt.m-lua i{width:10px;height:10px;margin:-2px 0 0 -5px;background:none}
.v4ler .bsh .lgt.m-lua i::after{inset:0;border-radius:50%;background:none;box-shadow:inset 3px -1.5px 0 0 var(--lb);filter:drop-shadow(0 0 2px rgba(var(--lg),.9))}
.v4ler .bsh .lgt.m-lan i{width:11px;height:15px;margin:0 0 0 -5.5px;background:linear-gradient(#5a3a1e,#5a3a1e) 50% 0/6px 2px no-repeat,linear-gradient(#5a3a1e,#5a3a1e) 50% 100%/4px 1.5px no-repeat}
.v4ler .bsh .lgt.m-lan i::after{top:2px;bottom:1.5px;border-radius:45%/32%;background:repeating-linear-gradient(180deg,rgba(90,40,10,.16) 0 .8px,transparent .8px 2.6px),radial-gradient(circle at 50% 48%,#fffaf0 0 16%,var(--lb) 58%,color-mix(in srgb,var(--lb) 70%,#7a3a10))}
.v4ler .bsh .lgt.m-lan i::before{--hs:38px}
.v4ler .bsh .lgt .strip{position:absolute;left:0;right:0;top:1px;height:3px;border-radius:2px;background:var(--lb);box-shadow:0 0 3px 1px rgba(var(--lg),.95),0 0 12px 3px rgba(var(--lg),.45)}
.v4ler .bsh .lgt .strip.v{left:auto;right:auto;top:0;width:3px;height:auto}
.v4ler .bsh .lgt .mw{position:absolute;inset:0;border:1px solid rgba(40,28,18,.55);border-radius:8px}
.v4ler .bsh .lgt .mw.led{border:3px solid var(--lb);box-shadow:0 0 4px 1px rgba(var(--lg),.9),0 0 14px 3px rgba(var(--lg),.4),inset 0 0 12px 2px rgba(var(--lg),.3)}
.v4ler .bsh .lgt .spl{position:absolute;pointer-events:none;mix-blend-mode:soft-light;opacity:.95}
.v4ler .bsh.dk .lgt .spl,.v4ler .bsh.w-ceu .lgt .spl,.v4ler .bsh.w-madeira .lgt .spl{mix-blend-mode:screen;opacity:.85}
.v4ler .bsh .lgt.w-f .spl{left:-4px;right:-4px;top:4px;height:92px;background:radial-gradient(34% 100% at 16.7% 0,rgba(var(--lg),var(--sa,.42)),transparent 72%),radial-gradient(34% 100% at 50% 0,rgba(var(--lg),var(--sa,.42)),transparent 72%),radial-gradient(34% 100% at 83.3% 0,rgba(var(--lg),var(--sa,.42)),transparent 72%)}
.v4ler .bsh.dk .lgt,.v4ler .bsh.w-ceu .lgt,.v4ler .bsh.w-madeira .lgt{--sa:.62}
.v4ler .bsh .lgt.w-sob .spl{left:-8px;right:-8px;top:0;height:92%;background:linear-gradient(180deg,rgba(var(--lg),.30),rgba(var(--lg),.10) 40%,transparent 78%)}
.v4ler .bsh .lgt.w-varal .spl{left:0;right:0;top:0;height:80%;background:radial-gradient(30% 60% at 25% 18%,rgba(var(--lg),.34),transparent 72%),radial-gradient(30% 60% at 75% 18%,rgba(var(--lg),.34),transparent 72%)}
.v4ler .bsh .lgt.w-cortina .spl{inset:0;background:radial-gradient(70% 70% at 50% 35%,rgba(var(--lg),.30),transparent 72%)}
.v4ler .bsh .lgt.w-moldura .spl{inset:-10px;background:radial-gradient(closest-side,transparent 86%,rgba(var(--lg),.22))}
/* vela: chama com gradiente e luz projetada */
.v4ler .vlw{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(255,206,120,.55),rgba(255,180,90,.20) 38%,rgba(255,170,80,.06) 58%,transparent 72%);mix-blend-mode:screen}
.v4ler .bsh:not(.dk) .vlw{mix-blend-mode:soft-light;opacity:.95}
.v4ler .vfl{transform-box:fill-box;transform-origin:50% 100%;animation:shfl 2.6s ease-in-out infinite alternate}
.v4ler .vlw{animation:shvg 3.4s ease-in-out infinite alternate}
@keyframes shfl{0%{transform:scale(1,1) skewX(0)}40%{transform:scale(.95,1.05) skewX(2deg)}70%{transform:scale(1.03,.97) skewX(-1.5deg)}100%{transform:scale(.97,1.03) skewX(1deg)}}
@keyframes shvg{0%{opacity:.78}100%{opacity:1}}
@media (prefers-reduced-motion:reduce){.v4ler .bsh .lgt i::before,.v4ler .vfl,.v4ler .vlw{animation:none!important}}
/* Leituras por mês: a mesma estante */
.v4ler.yvr .bsh{margin:0!important;padding:10px 0 12px!important;border-radius:18px;overflow:hidden}
.v4ler.yvr .bsh .hint{display:none}
.v4ler.yvr .bsh .bay:not(:has(.sp,.pile,.face)),.v4ler.yvr .bsh .bay:not(:has(.sp,.pile,.face)) + .bpl{display:none}
.v4ler .pfsh .pfbox .bsh:has(.brow.few){padding:10px 0 12px}
.v4ler .pfsh .pfbox .brow.few{justify-content:center;gap:1px}
/* busca de livro (visor do leitor) */
.v4ler .shbp{position:fixed;inset:0;z-index:9850;background:rgba(0,0,0,.45);display:grid;align-items:end}
.v4ler .shbp>div{background:var(--bg,var(--card));color:var(--ink);border-radius:20px 20px 0 0;padding:14px max(16px,env(safe-area-inset-left,0px)) calc(14px + env(safe-area-inset-bottom,0px));max-width:560px;width:100%;margin:0 auto;box-sizing:border-box;max-height:76vh;display:flex;flex-direction:column;gap:8px}
.v4ler .shbp input{min-height:44px;border:1px solid var(--line);border-radius:12px;padding:0 12px;font:inherit;font-size:15px;background:var(--card);color:var(--ink)}
.v4ler .shbp .bl{overflow-y:auto;display:grid;gap:4px}
.v4ler .shbp .bl button{display:flex;align-items:center;gap:10px;min-height:52px;border:0;border-radius:12px;background:none;text-align:left;font:inherit;font-size:14px;font-weight:700;color:var(--ink);padding:4px 6px;cursor:pointer}
.v4ler .shbp .bl button.on{background:var(--soft)}
.v4ler .shbp .bl .tc{width:30px;height:44px;border-radius:3px;background:var(--c,#8a7a66) center/cover;flex:none}
.v4ler .shbp .bl small{display:block;font-weight:600;color:var(--ink2);font-size:12px}
`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-shx3]')) { const st = document.createElement('style'); st.dataset.shx3 = '1'; st.textContent = SHX_CSS3; sr.append(st); } } catch {} }; }

// ---------- objetos com volume (luz do topo à esquerda) ----------
SH_DEC.vela = (s) => `<span class="vlw" style="width:${78 * s}px;height:${78 * s}px;left:${-22 * s}px;top:${-26 * s}px"></span><svg width="${34 * s}" height="${56 * s}" viewBox="0 0 34 56" aria-hidden="true" style="position:relative"><defs><linearGradient id="bkvj" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".22" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".24"/></linearGradient><linearGradient id="bkvw" x1="0" x2="1"><stop offset="0" stop-color="#f6ecd6"/><stop offset=".35" stop-color="#fffaf0"/><stop offset="1" stop-color="#d4c09c"/></linearGradient><radialGradient id="bkvf" cx="50%" cy="72%" r="62%"><stop offset="0" stop-color="#fff"/><stop offset=".32" stop-color="#ffefb8"/><stop offset=".72" stop-color="#ffac40"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient></defs><path d="M5 24h24v27a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="#f4ecdc" fill-opacity=".28" stroke="rgba(255,255,255,.55)" stroke-width=".6"/><path d="M7 31h20v19a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3z" fill="url(#bkvw)"/><ellipse cx="17" cy="31" rx="10" ry="1.7" fill="#fff6dc"/><ellipse cx="17" cy="31" rx="4" ry=".9" fill="#ffd98a" fill-opacity=".8"/><path d="M17 31v-4.5" stroke="#2b1d12" stroke-width="1" stroke-linecap="round"/><g class="vfl"><path d="M17 12.5c3.4 3.8 3.8 8.6 0 13-3.8-4.4-3.4-9.2 0-13z" fill="url(#bkvf)"/><path d="M17 18.6c1.3 1.7 1.3 3.9 0 5.6-1.3-1.7-1.3-3.9 0-5.6z" fill="#fff" fill-opacity=".9"/></g><path d="M5 24h24v27a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" fill="url(#bkvj)"/></svg>`;
SH_DEC.planta = (s) => `<svg width="${62 * s}" height="${120 * s}" viewBox="0 0 62 120" aria-hidden="true" style="margin-bottom:${-34 * s}px"><defs><linearGradient id="bkpp" x1="0" x2="1"><stop offset="0" stop-color="#faf6ee"/><stop offset=".5" stop-color="#e4dbcb"/><stop offset="1" stop-color="#b3a68f"/></linearGradient><linearGradient id="bkpl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#86c991"/><stop offset="1" stop-color="#2d6a3b"/></linearGradient><linearGradient id="bkpl2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a6dcab"/><stop offset="1" stop-color="#3b7d49"/></linearGradient></defs><g fill="none" stroke="#3a6a43" stroke-width="1.3" stroke-linecap="round"><path d="M20 64c-8 8-12 22-10 38s4 14 2 16"/><path d="M42 64c6 10 9 24 8 36"/></g><g fill="url(#bkpl)"><ellipse cx="11" cy="76" rx="5" ry="3" transform="rotate(-30 11 76)"/><ellipse cx="9" cy="92" rx="5" ry="3" transform="rotate(20 9 92)"/><ellipse cx="12" cy="108" rx="4.6" ry="2.8" transform="rotate(-20 12 108)"/><ellipse cx="48" cy="78" rx="5" ry="3" transform="rotate(30 48 78)"/><ellipse cx="51" cy="94" rx="4.6" ry="2.8" transform="rotate(-25 51 94)"/></g><g fill="url(#bkpl)"><path d="M31 60C21 51 15 39 17 24c9 8 14 21 14 36z"/><path d="M31 60c10-9 16-21 14-36-9 8-14 21-14 36z"/><path d="M31 60c-11-5-21-6-28-2 8 6 19 7 28 2z"/></g><g fill="url(#bkpl2)"><path d="M31 60c-2-15 0-31 6-43 4 15 1 31-6 43z"/><path d="M31 60c11-5 21-6 28-2-8 6-19 7-28 2z"/></g><g stroke="rgba(255,255,255,.38)" stroke-width=".6" fill="none" stroke-linecap="round"><path d="M31 59C25 49 21 39 19 29"/><path d="M31 59c6-11 10-21 12-31"/><path d="M31 59c1-13 2-26 5-37"/></g><path d="M16 60h30l-3 26H19z" fill="url(#bkpp)"/><path d="M15 57.5h32v4.5H15z" fill="#f3ede2"/><path d="M15 57.5h32" stroke="#fff" stroke-opacity=".8" stroke-width=".8"/><path d="M16 62h30l-.4 3H16.4z" fill="rgba(0,0,0,.12)"/><path d="M19 86h24" stroke="rgba(0,0,0,.18)"/></svg>`;
SH_DEC.leitor = (s, d) => { const b = shLeitorBook(d || {}), w = 50 * s, h = 84 * s;
  const scr = b && b.img ? `<span class="im" style="background-image:${cssUrl(b.img)}"></span>` : `<span class="tx">${esc(b ? b.t : 'Leitor digital')}</span>`;
  return `<span class="erd${d && d.cor ? ' cor' : ''}" style="width:${w}px;height:${h}px" aria-hidden="true"><span class="bz"><span class="scr">${scr}</span></span><span class="st"></span></span>`; };
function shLeitorBook(d) { let b = d && d.bk ? shById(String(d.bk)) : null; if (b) return b;
  if (SHX_VB) { const ks = Object.keys(SHX_VB); const k = ks.find((x) => SHX_VB[x].st === 'lendo') || ks[0]; return k ? shById(k) : null; }
  try { const L = lib(), e = L.find((x) => x.status === 'LENDO') || L[0]; return e ? shB(e) : null; } catch { return null; } }

// ---------- luzinhas: até 3 cordões, cada um com modelo, cor, lugar e prateleira ----------
const SH_LTM = [['bol', 'Bolinhas'], ['est', 'Estrelinhas'], ['var', 'Lâmpadas de varal'], ['led', 'Fita de LED'], ['lan', 'Lanterninhas'], ['lua', 'Luas']];
const SH_LTC = [['quente', 'Quente'], ['fria', 'Fria'], ['cor', 'Colorida'], ['ambar', 'Âmbar'], ['rosa', 'Rosa']];
const SH_LTW = [['f', 'Na borda'], ['sob', 'Embaixo da prateleira'], ['varal', 'Pendurado no topo'], ['cortina', 'Cortina no fundo'], ['moldura', 'Contorno da estante']];
const SH_LTCOL = { quente: ['#ffd27e', '255,186,92'], fria: ['#d9ecff', '165,205,255'], ambar: ['#ffae45', '255,148,40'], rosa: ['#ffa6c6', '255,128,178'] };
const SH_LTMIX = [['#ffa3b8', '255,120,150'], ['#a2f0bc', '110,220,150'], ['#abc6ff', '125,160,255'], ['#ffd27e', '255,186,92']];
function shLights(C0) { C0 = C0 || shc(); if (Array.isArray(C0.lights)) return C0.lights; if (C0.lt && C0.lt.on === 0) return []; return [{ m: 'bol', c: (C0.lt && C0.lt.c) || 'quente', w: 'f', r: 'alt', b: 1 }]; }
const shLtOn = (L, k) => L.r === 'todas' || L.r == null || (L.r === 'alt' ? k % 2 === 0 : +L.r === k);
const shLtCol = (L, j) => L.c === 'cor' ? SH_LTMIX[j % 4] : (SH_LTCOL[L.c] || SH_LTCOL.quente);
function shBulb(L, j, x, y) { const [lb, lg] = shLtCol(L, j), tw = !!L.b && SHX_LTN < 40; if (tw) SHX_LTN++;
  const t = (2.4 + ((j * 7) % 11) * 0.29).toFixed(2), dl = (-((j * 13) % 17) * 0.33).toFixed(2);
  return `<i${tw ? ' class="tw"' : ''} style="left:${x};top:${y};--lb:${lb};--lg:${lg};--t:${t}s;--d:${dl}s"></i>`; }
const shWirePath = (sag, n, y0) => { let d = `M0 ${y0}`; const w = 300 / n; for (let i = 0; i < n; i++) d += ` Q${(i + 0.5) * w} ${y0 + 2 * sag} ${(i + 1) * w} ${y0}`; return d; };
const shWireSvg = (d, vb) => `<svg viewBox="${vb}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" fill="none" stroke="rgba(0,0,0,.14)" stroke-width="1.4" transform="translate(0 1.4)" vector-effect="non-scaling-stroke"/><path d="${d}" fill="none" stroke="rgba(38,26,16,.62)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
function shLtWire(L, wh) { const [lb, lg0] = shLtCol(L, 1), lg = L.c === 'cor' ? '255,214,190' : lg0, led = L.m === 'led', st = `--lb:${L.c === 'cor' ? 'linear-gradient(90deg,#ffa3b8,#a2f0bc,#abc6ff,#ffd27e,#ffa3b8)' : lb};--lg:${lg}`;
  const ledBg = L.c === 'cor' ? 'background:linear-gradient(90deg,#ffa3b8,#a2f0bc,#abc6ff,#ffd27e,#ffa3b8)' : '';
  let h = '';
  if (wh === 'f' || wh === 'sob' || wh === 'varal') {
    const swags = wh === 'varal' ? 2 : 3, sag = wh === 'sob' ? 0 : wh === 'varal' ? (L.m === 'var' ? 30 : 24) : (L.m === 'var' ? 12 : 9), y0 = wh === 'sob' ? 3 : 1;
    if (led) h = `<b class="strip" style="top:${wh === 'sob' ? 1 : 6}px;${ledBg}"></b>`;
    else { const n = L.m === 'var' ? (wh === 'varal' ? 6 : 7) : L.m === 'lan' ? 6 : wh === 'varal' ? 8 : 10, hang = L.m === 'var' || L.m === 'lan' ? 1 : 0;
      h = shWireSvg(sag ? shWirePath(sag, swags, y0) : `M0 ${y0} L300 ${y0}`, `0 0 300 ${wh === 'varal' ? 120 : 22}`);
      for (let i = 0; i < n; i++) { const x = (i + 0.5) / n, t = (x * swags) % 1, y = y0 + sag * Math.sin(Math.PI * t) * (wh === 'varal' ? 1.0 : 0.96) + hang;
        h += shBulb(L, i, (x * 100).toFixed(2) + '%', wh === 'varal' ? (y / 120 * 100).toFixed(2) + '%' : y.toFixed(1) + 'px'); } }
    h += `<b class="spl"></b>`; }
  if (wh === 'cortina') { const N = 6;
    for (let s = 0; s < N; s++) { const x = (s + 0.5) / N * 100, len = 52 + ((s * 37) % 26);
      h += led ? `<b class="strip v" style="left:${x.toFixed(1)}%;height:${len}%;${ledBg}"></b>` : `<svg viewBox="0 0 10 100" preserveAspectRatio="none" style="left:${(x - 2).toFixed(1)}%;width:4%" aria-hidden="true"><path d="M5 0 L5 ${len}" stroke="rgba(38,26,16,.5)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
      if (!led) for (let q = 0; q < 4; q++) h += shBulb(L, s * 4 + q, x.toFixed(1) + '%', ((q + 0.8) / 4 * len).toFixed(1) + '%'); }
    h += `<b class="spl"></b>`; }
  if (wh === 'moldura') { h = led ? `<b class="mw led" style="${L.c === 'cor' ? 'border-image:linear-gradient(90deg,#ffa3b8,#a2f0bc,#abc6ff,#ffd27e) 1' : ''}"></b>` : `<b class="mw"></b>`;
    if (!led) { let j = 0; const T = 9, S = 11; for (let i = 0; i < T; i++) { const x = ((i + 0.5) / T * 100).toFixed(1) + '%'; h += shBulb(L, j++, x, '0%') + shBulb(L, j++, x, 'calc(100% - 8px)'); }
      for (let i = 0; i < S; i++) { const y = ((i + 0.5) / S * 100).toFixed(1) + '%'; h += shBulb(L, j++, '0%', y) + shBulb(L, j++, '100%', y); } }
    h += `<b class="spl"></b>`; }
  return `<span class="lgt m-${esc(L.m || 'bol')} w-${wh}" style="${st}" aria-hidden="true">${h}</span>`; }
function shLtRow(k, sm, where) { if (sm) return ''; const Ls = shLights(); let h = '';
  Ls.forEach((L) => { if (!shLtOn(L, k)) return; if (where === 'f' && L.w === 'f') h += shLtWire(L, 'f'); if (where === 'b' && (L.w === 'sob' || L.w === 'cortina' || L.w === 'varal')) h += shLtWire(L, L.w); });
  return h; }
function shLtFrame(sm) { if (sm) return ''; return shLights().filter((L) => L.w === 'moldura').map((L) => shLtWire(L, 'moldura')).join(''); }

// ---------- arrumação: congelar a automática, guardar e desfazer ----------
function shFreezeAuto() { const C0 = shc(); if (C0.manual) return; const sr = shBibRoot(); C0.lay = C0.lay || {}; C0.pos = C0.pos || {};
  if (sr) { sr.querySelectorAll('.bsh:not(.sm) .pile [data-bid]').forEach((e) => { C0.lay[e.dataset.bid] = 1; });
    sr.querySelectorAll('.bsh:not(.sm) .face[data-bid]').forEach((e) => { C0.pos[e.dataset.bid] = 'face'; });
    const ids = [...new Set([...sr.querySelectorAll('.bsh:not(.sm) [data-bid]')].map((e) => e.dataset.bid))];
    if (ids.length && !(C0.ord && C0.ord.length)) C0.ord = ids.concat(shAllIds().filter((x) => !ids.includes(x))); }
  C0.manual = 1; }
const SHX_BKK = ['ord', 'lay', 'pos', 'manual', 'arr', 'myOrd', 'tray', 'trayBk'];
function shBk() { const C0 = shc(), o = {}; SHX_BKK.forEach((k) => { if (C0[k] !== undefined) o[k] = C0[k]; }); return JSON.parse(JSON.stringify(o)); }
function shRestore(bk) { const C0 = shc(); SHX_BKK.forEach((k) => { if (bk[k] === undefined) delete C0[k]; else C0[k] = JSON.parse(JSON.stringify(bk[k])); }); C0.lay = C0.lay || {}; SHX_PICK = null; shSave(); v5Redraw(); }
const shUndo = (bk) => ({ label: 'Desfazer', fn: () => shRestore(bk) });
const shInTray = (id) => { const T = shc().tray; return Array.isArray(T) && T.includes(id); };
function shTrayTail() { const C0 = shc(), T = new Set(C0.tray || []); if (!T.size || !C0.ord) return; C0.ord = C0.ord.filter((x) => !T.has(x)).concat(C0.ord.filter((x) => T.has(x))); }
function shFaceOther(id) { const sr = shBibRoot(); if (!sr) return null; const el = [...sr.querySelectorAll('.bsh:not(.sm) [data-bid]')].find((e) => e.dataset.bid === id), bay = el && el.closest('.bay');
  const f = bay && [...bay.querySelectorAll('.face[data-bid]')].find((x) => x.dataset.bid !== id); return f ? f.dataset.bid : null; }
// depois de redesenhar: duas de frente na mesma prateleira? a recém-posta volta a ficar em pé
function shFaceCheck(id) { const C0 = shc(); if (!C0.pos || C0.pos[id] !== 'face') return; const o = shFaceOther(id); if (!o) return; delete C0.pos[id]; shSave(); v5Redraw(); toast('Essa prateleira já tem um livro de frente; este ficou em pé'); }
function shPlace(ref, after, pile) { const C0 = shc(), id = SHX_PICK; if (!id) return; shFreezeAuto(); const bk = shBk(), tr = shInTray(id); C0.lay = C0.lay || {}; C0.pos = C0.pos || {};
  if (ref === '' || ref == null) shMove(id, null, true); else shMove(id, ref, after);
  if (pile) { C0.lay[id] = 1; delete C0.pos[id]; }
  else if (tr) { delete C0.lay[id]; delete C0.pos[id]; if (SHX_PKP === 'dei') C0.lay[id] = 1; if (SHX_PKP === 'fre') C0.pos[id] = 'face'; }
  if (tr) { C0.tray = C0.tray.filter((x) => x !== id); shTrayTail(); }
  C0.arr = null; delete C0.myOrd; C0.manual = 1; SHX_PICK = null; const left = tr ? C0.tray.length : -1; if (tr && !left) { delete C0.tray; delete C0.trayBk; }
  shSave(); v5Redraw(); shFaceCheck(id);
  toast(tr ? (left ? `Guardado · faltam ${left}` : 'Todos os livros guardados') : pile ? 'Livro deitado na pilha' : 'Livro no novo lugar', shUndo(bk)); }
function shSetPos(id, k) { const C0 = shc(), b = shById(id); if (!b) return; if (shInTray(id)) { SHX_PKP = k; return v5Redraw(); }
  shFreezeAuto(); const bk = shBk(); C0.lay = C0.lay || {}; C0.pos = C0.pos || {};
  const done = (msg) => { C0.manual = 1; shSave(); v5Redraw(); toast(msg, shUndo(bk)); };
  if (k === 'fre') { if (!b.img) return toast('Este livro não tem capa para ficar de frente');
    const o = shFaceOther(id); if (o) return shX('Já tem um livro de frente nesta prateleira', [['Trocar: “' + shTitle(id).slice(0, 28) + '” fica de frente', () => { delete C0.pos[o]; delete C0.lay[id]; C0.pos[id] = 'face'; done('Livro de frente trocado'); }]]);
    delete C0.lay[id]; C0.pos[id] = 'face'; return done('Livro de frente, com a capa à mostra'); }
  if (k === 'pe') { delete C0.lay[id]; delete C0.pos[id]; return done('Livro em pé'); }
  if (k === 'dei') { C0.lay[id] = 1; delete C0.pos[id]; return done('Livro deitado'); }
  if (k === 'inc') { delete C0.lay[id]; C0.pos[id] = 'lean'; return done('Livro inclinado'); }
  if (k === 'dir') { delete C0.pos[id]; return done('Livro endireitado'); } }
const shPosOf = (id) => { const C0 = shc(); if (C0.lay && C0.lay[id]) return 'dei'; const p = C0.pos && C0.pos[id]; if (p === 'face') return 'fre'; if (p === 'lean') return 'inc'; const sr = shBibRoot(), el = sr && [...sr.querySelectorAll('.bsh:not(.sm) [data-bid]')].find((e) => e.dataset.bid === id); if (el && el.closest('.pile')) return 'dei'; if (el && el.classList.contains('face')) return 'fre'; return 'pe'; };

// ---------- Arrumar por ----------
const SH_ARR = [['cor', 'Cor (arco-íris)'], ['autor', 'Autor'], ['titulo', 'Título'], ['altura', 'Altura'], ['sit', 'Situação'], ['data', 'Data de leitura']];
const shHsl = (hex) => { const m = String(hex || '').replace('#', ''); if (!/^[0-9a-f]{6}$/i.test(m)) return [0, 0, 0.5]; const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0; if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, s, l]; };
const shColOf = (b) => { const C0 = shc(), spM = (C0.spb && C0.spb[b.id]) || C0.spMode; const smp = b.img && spM !== 'desenho' ? shSampled(b) : null; return smp ? smp.c : spnColors(b)[0]; };
function shArrange(k) { const C0 = shc(); shFreezeAuto(); const bk = shBk(); if (!C0.arr) C0.myOrd = JSON.parse(JSON.stringify({ ord: C0.ord, lay: C0.lay, pos: C0.pos }));
  if (k === 'mine') { const m = C0.myOrd || {}; C0.ord = m.ord || null; C0.lay = m.lay || {}; C0.pos = m.pos || {}; C0.arr = null; delete C0.myOrd; C0.manual = 1; shSave(); v5Redraw(); return toast('De volta à minha ordem', shUndo(bk)); }
  const ids = shAllIds(), B = ids.map((id, i) => ({ ...shById(id), i })).filter((b) => b.id), col = (x, y) => String(x).localeCompare(String(y), 'pt', { sensitivity: 'base' });
  const last = (a) => String(a || '').trim().split(/\s+/).slice(-1)[0] || '~';
  const raw = (id) => { try { return v5Book(id) || {}; } catch { return {}; } };
  let S = B;
  if (k === 'cor') { const key = (b) => { const [h, s, l] = shHsl(shColOf(b)); return s < 0.16 || l < 0.1 || l > 0.92 ? [1, -l] : [0, (h + 12) % 360, -l]; };
    S = B.map((b) => [b, key(b)]).sort((x, y) => x[1][0] - y[1][0] || x[1][1] - y[1][1] || (x[1][2] || 0) - (y[1][2] || 0)).map((x) => x[0]); }
  if (k === 'autor') S = B.slice().sort((x, y) => col(last(x.a), last(y.a)) || col(x.a, y.a) || col(x.t, y.t));
  if (k === 'titulo') S = B.slice().sort((x, y) => col(x.t.replace(/^(o|a|os|as|um|uma|the)\s+/i, ''), y.t.replace(/^(o|a|os|as|um|uma|the)\s+/i, '')));
  if (k === 'altura') S = B.slice().sort((x, y) => spnGeo(y, false).h - spnGeo(x, false).h || x.i - y.i);
  if (k === 'sit') { const o = { lendo: 0, quero: 1, lido: 2, pausado: 3, abandonado: 4 }; S = B.slice().sort((x, y) => (o[x.st] ?? 5) - (o[y.st] ?? 5) || x.i - y.i); }
  if (k === 'data') { const d = (b) => { const e = raw(b.id); return String(e.finishedAt || e.startedAt || ''); }; S = B.slice().sort((x, y) => (d(y) ? 1 : 0) - (d(x) ? 1 : 0) || d(y).localeCompare(d(x)) || x.i - y.i); }
  const T = new Set(C0.tray || []), so = S.map((b) => b.id); C0.ord = so.filter((x) => !T.has(x)).concat(so.filter((x) => T.has(x)));
  C0.lay = {}; C0.manual = 1; C0.arr = k; SHX_PICK = null; shSave(); v5Redraw(); toast('Arrumada por ' + (SH_ARR.find((x) => x[0] === k) || ['', ''])[1].toLowerCase(), shUndo(bk)); }
function shArrMenu() { const C0 = shc(), items = SH_ARR.map(([k, n]) => [(C0.arr === k ? '✓ ' : '') + n, () => shArrange(k)]); if (C0.arr && C0.myOrd) items.push(['Minha ordem', () => shArrange('mine')]); shX('Arrumar por', items); }

// ---------- Esvaziar e arrumar ----------
function shEmpty() { const C0 = shc(); shFreezeAuto(); const bk = shBk(); C0.trayBk = bk; C0.tray = shAllIds().slice(); SHX_PICK = null; SHX_TRF = 'todos'; shSave(); v5Redraw(); toast('Estante vazia: guarde os livros um a um', { label: 'Desfazer', fn: shTrayUndo }); }
function shTrayUndo() { const C0 = shc(), bk = C0.trayBk; if (bk) { shRestore(bk); delete C0.tray; delete C0.trayBk; } else { delete C0.tray; } SHX_PICK = null; shSave(); v5Redraw(); toast('A estante voltou como estava'); }
function shTrayList() { const C0 = shc(); let L = (C0.tray || []).map(shById).filter(Boolean); const f = SHX_TRF;
  if (f !== 'todos') L = L.filter((b) => (f === 'outros' ? !['lendo', 'quero', 'lido'].includes(b.st) : b.st === f));
  const col = (x, y) => String(x).localeCompare(String(y), 'pt', { sensitivity: 'base' });
  if (SHX_TRS === 'cor') L = L.map((b) => { const [h, s, l] = shHsl(shColOf(b)); return [b, s < 0.16 || l < 0.1 || l > 0.92 ? 999 - l : (h + 12) % 360]; }).sort((x, y) => x[1] - y[1]).map((x) => x[0]);
  if (SHX_TRS === 'autor') L.sort((x, y) => col(String(x.a).split(' ').slice(-1)[0], String(y.a).split(' ').slice(-1)[0]));
  if (SHX_TRS === 'titulo') L.sort((x, y) => col(x.t, y.t));
  return L; }

// ---------- painéis do Organizar ----------
const shChips = (a, cur, opts, extra) => `<div class="dchips" role="radiogroup">${opts.map(([k, n]) => `<button type="button" role="radio" aria-checked="${cur === k}" class="${cur === k ? 'on' : ''}" data-a="${a}" data-k="${esc(k)}"${extra || ''}>${esc(n)}</button>`).join('')}</div>`;
const shMini = (b) => b && b.img ? `style="background-image:${cssUrl(b.img)}"` : `style="--c:${b ? spnColors(b)[0] : '#8a7a66'}"`;
function shSpPrev(b) { const C0 = shc(), m0 = SHX_MODE; SHX_MODE = null; let s = ''; try { s = spnHTML({ ...b, lean: 0 }, false).replace(/ data-a="[^"]*"| data-id="[^"]*"| data-long="[^"]*"| data-bid="[^"]*"/g, '').replace('<button type="button"', '<span').replace(/<\/button>$/, '</span>'); } finally { SHX_MODE = m0; }
  return `<span class="lbv"><span class="bsh pkprev${shDark() ? ' dk' : ''}" style="${shWoodVars(C0.wood)}">${s}</span></span>`; }
function shOrgBanner() { const C0 = shc(), pk = SHX_PICK, tr = Array.isArray(C0.tray) && C0.tray.length;
  const nm = C0.arr ? (SH_ARR.find((x) => x[0] === C0.arr) || ['', ''])[1].replace(' (arco-íris)', '') : 'Minha ordem';
  return `<div class="shban shban2" role="status"><b>${pk ? 'Toque num + para pôr o livro' : tr ? 'Guarde os livros na estante' : 'Toque num livro para pegar'}<small>${pk ? 'ou toque em outro livro para pôr antes dele' : tr ? 'Toque num livro da bandeja e depois num + da estante' : 'ou segure e arraste até o lugar'}</small></b><button type="button" data-a="shdone">Concluir</button></div>
  ${pk ? '' : `<div class="shorg"><button type="button" data-a="sharr">Arrumar por: <b>${esc(nm)}</b> ▾</button>${tr ? '' : '<button type="button" data-a="shempty">Esvaziar e arrumar</button>'}${C0.manual && !tr ? '<button type="button" data-a="shreset">Automática</button>' : ''}</div>`}`; }
function shOrgPanel() { const C0 = shc(), pk = SHX_PICK, tr = Array.isArray(C0.tray) && C0.tray.length;
  if (pk && !shInTray(pk)) { const b = shById(pk); if (!b) return ''; const p = shPosOf(pk), spM = (C0.spb && C0.spb[pk]) || 'def', ed = (C0.ed && C0.ed[pk]) ? SH_EDN[C0.ed[pk].t] : 'Automática';
    return `<div class="shpk" role="region" aria-label="Livro na mão"><div class="pkh"><span class="pkc" ${shMini(b)}></span><b>${esc(b.t)}<small>Toque num + na estante para mudar de lugar</small></b><button type="button" class="pkx" data-a="shpkx">Pronto</button></div>
      <div class="pkl">Posição</div>${shChips('shpos', p === 'inc' ? 'inc' : p, [['pe', 'Em pé'], ['dei', 'Deitado'], ['fre', 'De frente'], [p === 'inc' ? 'dir' : 'inc', p === 'inc' ? 'Endireitar' : 'Inclinado']])}
      <div class="pkl">Mover para</div>${shChips('shpkend', '', [['0', 'Começo da estante'], ['1', 'Fim da estante']])}
      <div class="pkl">Lombada</div><div class="pklb">${shSpPrev(b)}<div style="flex:1;display:grid;gap:6px">${shChips('shlbst', spM, [['def', 'Padrão'], ['capa', 'Da capa'], ['desenho', 'Desenhada']])}${shChips('shpklb', '', [['ed', 'Edição: ' + ed], ['sp', 'Foto da lombada']])}</div></div></div>`; }
  if (tr) { const L = shTrayList(), n = C0.tray.length, pb = pk && shById(pk);
    return `<div class="shtr" role="region" aria-label="Livros para guardar"><div class="trh"><b>Livros para guardar (${n})<small>Toque num livro e depois num + da estante</small></b><button type="button" class="s" data-a="shtrayall">Desfazer tudo</button><button type="button" data-a="shtrayx">Fechar</button></div>
      <div style="display:flex;gap:6px;margin-top:8px;overflow-x:auto;scrollbar-width:none">${shChips('shtrayf', SHX_TRF, [['todos', 'Todos'], ['lendo', 'Lendo'], ['quero', 'Quero ler'], ['lido', 'Lidos'], ['outros', 'Outros']])}</div>
      <div style="margin-top:6px">${shChips('shtrays', SHX_TRS, [['ord', 'Ordem atual'], ['cor', 'Cor'], ['autor', 'Autor'], ['titulo', 'Título']])}</div>
      <div class="trl">${L.length ? L.map((b) => `<button type="button" class="trb${pk === b.id ? ' on' : ''}" data-a="shpk" data-id="${esc(b.id)}" aria-label="Pegar ${esc(b.t)}"><span class="tc" ${shMini(b)}>${b.img ? '' : esc(b.t)}</span><span>${esc(b.t)}</span></button>`).join('') : '<p class="mut" style="margin:8px 2px">Nenhum livro com esse filtro.</p>'}</div>
      ${pb ? `<div class="trp">${esc(pb.t)} na mão · toque num + na estante<div class="pkl" style="margin-top:8px">Vai ficar</div>${shChips('shpos', SHX_PKP, [['pe', 'Em pé'], ['dei', 'Deitado'], ['fre', 'De frente']])}</div>` : ''}</div>`; }
  return ''; }

// ---------- escolher um livro (visor do leitor digital) ----------
function shPickBook(title, cur, cb) { const sr = shBibRoot(), R = sr && sr.querySelector('.v5est'); if (!R) return; R.querySelectorAll('.shbp').forEach((x) => x.remove());
  const all = lib().map(shB).sort((x, y) => (x.st === 'lendo' ? 0 : 1) - (y.st === 'lendo' ? 0 : 1));
  const w = document.createElement('div'); w.className = 'shbp'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', title);
  const list = (q) => { const n = String(q || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); return all.filter((b) => !n || (b.t + ' ' + b.a).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(n)).slice(0, 60)
    .map((b) => `<button type="button" data-id="${esc(b.id)}" class="${cur === b.id ? 'on' : ''}"><span class="tc" ${shMini(b)}></span><span>${esc(b.t)}<small>${esc(b.a || '')}${b.st === 'lendo' ? ' · lendo' : ''}</small></span></button>`).join('') || '<p class="mut">Nenhum livro encontrado.</p>'; };
  w.innerHTML = `<div><b style="font-size:17px">${esc(title)}</b><input type="search" placeholder="Buscar na Biblioteca" aria-label="Buscar na Biblioteca"><div class="bl">${list('')}</div><button type="button" class="btn" data-x="1" style="min-height:46px;justify-content:center">Cancelar</button></div>`;
  w.addEventListener('input', (ev) => { if (ev.target.matches('input')) w.querySelector('.bl').innerHTML = list(ev.target.value); });
  w.addEventListener('click', (ev) => { ev.stopPropagation(); const t = ev.target.closest('[data-id],[data-x]'); if (ev.target === w || (t && t.dataset.x)) return w.remove(); if (!t) return; w.remove(); cb(t.dataset.id); });
  R.append(w); }

// ---------- folha "Lombada e edição" ----------
function shLbHTML() { const id = String(v4State().sheetE || ''), b = shById(id); if (!b) return '<p class="mut">Livro não encontrado.</p>'; const C0 = shc(), spM = (C0.spb && C0.spb[id]) || 'def', ed = C0.ed && C0.ed[id] ? SH_EDN[C0.ed[id].t] : 'Automática (pelo formato)', ph = C0.sp && C0.sp[id];
  const prev = `<div class="bsh shprev${shDark() ? ' dk' : ''} w-${C0.wall || 'linho'}" style="${shWoodVars(C0.wood)}"><div class="case"><div class="crown"></div><div class="bay"><div class="brow">${(() => { const m0 = SHX_MODE; SHX_MODE = null; try { return spnHTML({ ...b, lean: 0 }, false).replace(/ data-a="[^"]*"| data-id="[^"]*"| data-long="[^"]*"/g, '').replace('<button type="button"', '<span').replace(/<\/button>$/, '</span>'); } finally { SHX_MODE = m0; } })()}</div></div><div class="bpl"></div></div></div>`;
  const row = (a, ic, t, sm) => `<button type="button" class="li" data-a="${a}">${v4ic(ic, 20)}<span class="t">${t}<small>${sm}</small></span><span class="r">${v4ic('chev', 16)}</span></button>`;
  return `<h3 style="margin-bottom:2px">Lombada e edição</h3><p class="mut" style="margin:0 0 6px">${esc(b.t)} · como aparece na Prateleira</p>${prev}
    <div class="lbl" style="margin:10px 0 6px">Estilo deste livro</div><div class="edopt" role="radiogroup" aria-label="Estilo da lombada">${[['def', 'Padrão da estante', C0.spMode === 'desenho' ? 'desenhada' : 'da capa'], ['capa', 'Da capa', 'cor e faixa da capa'], ['desenho', 'Desenhada', 'tipografia e cores']].map(([k, l, sm]) => `<button type="button" role="radio" aria-checked="${spM === k}" class="${spM === k ? 'on' : ''}" data-a="shlbst" data-k="${k}">${l}<small>${sm}</small></button>`).join('')}</div>
    <div style="margin-top:10px">${row('shxed', 'estante', 'Edição', ed)}${row('shxsp', 'scan', 'Foto da lombada', ph ? 'a foto do seu exemplar está na estante' : 'fotografe a lombada do seu exemplar')}</div>`; }
{ const _s2 = shSheetHTML2; shSheetHTML2 = function (k) { if (k === 'shxlb') { try { return shLbHTML(); } catch (err) { console.warn('lombada', err); return '<p class="mut">Não deu para abrir.</p>'; } } return _s2.apply(this, arguments); }; }
{ const _vc = shV4Click; shV4Click = function (ev) { const t = ev.target.closest && ev.target.closest('[data-a]'); if (t && (t.dataset.a === 'shxlb' || t.dataset.a === 'shlbst')) { ev.stopImmediatePropagation(); ev.preventDefault();
      const id = String(v4State().sheetE || ''), C0 = shc();
      if (t.dataset.a === 'shxlb') { const e = v5Book(id); return shOpen('shxlb', { e }); }
      C0.spb = C0.spb || {}; if (t.dataset.k === 'def') delete C0.spb[id]; else C0.spb[id] = t.dataset.k; shSave(); v4Draw(); v5Redraw(); return toast(t.dataset.k === 'def' ? 'Lombada no padrão da estante' : t.dataset.k === 'capa' ? 'Lombada da capa' : 'Lombada desenhada'); }
    return _vc.apply(this, arguments); }; }
// menu do livro › Mais: "Lombada e edição" no topo (substitui as duas linhas antigas)
{ const _bm = v5BmHTML; v5BmHTML = function () { let h = _bm.apply(this, arguments);
    try { h = h.replace('Edição na estante · Foto da lombada', 'Lombada e edição').replace(/(<small>)([^<]*?) · Lombada e edição(<\/small>)/, (m, a, b, c) => a + 'Lombada e edição · ' + b + c);
      h = h.replace(/<button type="button" class="li" data-a="shx(ed|sp)">[\s\S]*?<\/button>/g, '');
      if (v4State().v5more) { const row = `<button type="button" class="li" data-a="shxlb">${v4ic('estante', 20)}<span class="t">Lombada e edição<small>como o livro aparece na Prateleira</small></span><span class="r">${v4ic('chev', 16)}</span></button>`;
        h = h.replace(/(<button class="li v5more[^>]*>[\s\S]*?<\/button>)/, '$1' + row); } } catch (err) { console.warn('menu: lombada', err); }
    return h; }; }

// ---------- Decorar: abas Enfeites · Plaquinhas · Lombadas · Madeira · Parede · Luzinhas ----------
const SH_PQST = [['mad', 'Madeira'], ['latao', 'Latão'], ['lousa', 'Lousa'], ['kraft', 'Kraft']];
{ const _dk = dkPanel; dkPanel = function () { const C0 = shc(), t = SHX_DKT || 'enf';
    const tabs = [['enf', 'Enfeites'], ['plq', 'Plaquinhas'], ['lomb', 'Lombadas'], ['mad', 'Madeira'], ['par', 'Parede'], ['luz', 'Luzinhas']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${t === k}" class="${t === k ? 'on' : ''}" data-a="dktab" data-k="${k}">${l}</button>`).join('');
    let body = '';
    if (t === 'enf' || t === 'mad' || t === 'par') { const h0 = _dk.apply(this, arguments), m = h0.match(/<div class="dbody">([\s\S]*)<\/div><div class="dkfoot">/); body = m ? m[1] : '';
      if (t === 'mad') body = body.replace(/<div class="dsec">Lombadas<\/div>[\s\S]*$/, ''); }
    if (t === 'plq') { const L = C0.plq || [], ed = SHX_PQE >= 0 && L[SHX_PQE] ? L[SHX_PQE] : null, s = ed ? ed.s || 'mad' : SHX_PQS, txt = ed ? ed.t : SHX_PQT;
      body = `<p class="dkh">${ed ? 'Editando. Arraste a plaquinha na borda da prateleira, ou toque na borda onde ela vai ficar.' : 'Até 24 letras. Ela vai para a borda da prateleira; depois é só arrastar.'}</p>
        <div class="pqin"><input id="shpqt" maxlength="24" value="${esc(txt)}" placeholder="Ex.: Fantasia, Para reler" aria-label="Texto da plaquinha" autocomplete="off"><span class="cnt">${txt.length}/24</span></div>
        <div class="pqsw" role="radiogroup" aria-label="Estilo">${SH_PQST.map(([k, n]) => `<button type="button" role="radio" aria-checked="${s === k}" class="${s === k ? 'on' : ''}" data-a="dkpqs" data-k="${k}"><span class="plq s-${k}">Aa</span>${n}</button>`).join('')}</div>
        <div class="dkrow">${ed ? '<button type="button" class="btn s" data-a="dkpqrm">Tirar</button><button type="button" class="btn s" data-a="dkpqnew">Nova</button><button type="button" class="btn p" data-a="dkpqok">Salvar</button>' : '<button type="button" class="btn p" data-a="dkpqok">Pôr na estante</button>'}</div>
        ${L.length ? `<div class="dsec">Na estante</div><div class="dchips">${L.map((q, i) => `<button type="button" class="${i === SHX_PQE ? 'on' : ''}" data-a="dkpq" data-i="${i}">${esc(q.t)} · ${q.r + 1}ª</button>`).join('')}</div>` : ''}`; }
    if (t === 'lomb') { const sp = C0.spMode || 'capa';
      body = `<p class="dkh">O estilo de todas as lombadas. Um livro pode ter o dele.</p><div class="dsw" style="grid-template-columns:1fr 1fr" role="radiogroup" aria-label="Lombadas">${[['capa', 'Da capa', 'cor e faixa da capa'], ['desenho', 'Desenhadas', 'tipografia e cores']].map(([k, l, s2]) => `<button type="button" role="radio" aria-checked="${sp === k}" class="${sp === k ? 'on' : ''}" data-a="dksp" data-k="${k}" style="text-align:center"><b>${l}</b><small style="font-weight:600;color:var(--ink2);font-size:11px">${s2}</small></button>`).join('')}</div>
        <div class="dkrow"><button type="button" class="btn${SHX_LBP ? ' p' : ''}" data-a="dklbp">${SHX_LBP ? 'Toque no livro na estante…' : 'Editar a lombada de um livro'}</button></div>${SHX_LBP ? '<p class="dkh on" style="margin-top:8px">Toque no livro: abre a lombada, a edição e a foto dele.</p>' : ''}`; }
    if (t === 'luz') { const Ls = shLights(C0), e = Ls[SHX_LTE] ? SHX_LTE : 0, L = Ls[e], nm = (A, k) => (A.find((x) => x[0] === k) || ['', ''])[1];
      const nR = Math.max(3, (shBibRoot()?.querySelectorAll('.bsh:not(.sm) .bay').length) || 3), rr = [['todas', 'Todas'], ['alt', 'Alternadas']].concat(Array.from({ length: Math.min(nR, 9) }, (_, i) => [String(i), (i + 1) + 'ª']));
      body = `<p class="dkh">Até 3 cordões, cada um com o seu modelo, cor e lugar.</p>${Ls.map((x, i) => `<button type="button" class="ltc${i === e ? ' on' : ''}" data-a="dklt" data-i="${i}">Cordão ${i + 1}<small>${nm(SH_LTM, x.m)} · ${nm(SH_LTC, x.c)} · ${nm(SH_LTW, x.w)}${x.w === 'moldura' ? '' : ' · ' + (x.r === 'todas' ? 'todas' : x.r === 'alt' ? 'alternadas' : (+x.r + 1) + 'ª prateleira')}</small></button>`).join('')}
        <div class="dkrow">${Ls.length < 3 ? '<button type="button" class="btn s" data-a="dkltadd">+ Cordão</button>' : ''}${Ls.length ? '<button type="button" class="btn s" data-a="dkltrm">Tirar este</button><button type="button" class="btn s" data-a="dkltoff">Apagar todas</button>' : ''}</div>
        ${L ? `<div class="dsec">Modelo</div>${shChips('dkltset', L.m, SH_LTM, ' data-f="m"')}<div class="dsec">Cor</div>${shChips('dkltset', L.c, SH_LTC, ' data-f="c"')}<div class="dsec">Lugar</div>${shChips('dkltset', L.w, SH_LTW, ' data-f="w"')}${L.w === 'moldura' ? '' : `<div class="dsec">Prateleiras</div>${shChips('dkltset', String(L.r), rr, ' data-f="r"')}`}<div class="dsec">Brilho</div>${shChips('dkltset', L.b ? '1' : '0', [['1', 'Cintilar devagar'], ['0', 'Fixo']], ' data-f="b"')}` : ''}`; }
    return `<div class="dkpan" role="region" aria-label="Decorar a estante"><div class="grab"></div><div class="dtabs six" role="tablist">${tabs}</div><div class="dbody">${body}</div><div class="dkfoot"><button type="button" class="btn s" data-a="dkreset">Restaurar padrão</button><button type="button" class="btn p" data-a="shdone">Concluir</button></div></div>`; }; }
function shLtSave(fn) { const C0 = shc(), Ls = JSON.parse(JSON.stringify(shLights(C0))); fn(Ls); C0.lights = Ls.slice(0, 3); C0.lt = { on: C0.lights.length ? 1 : 0, c: (C0.lights[0] && C0.lights[0].c) || 'quente' }; shSave(); v5Redraw(); }

// ---------- toques: Organizar (pegar/pôr), Decorar (plaquinhas, lombada, leitor) ----------
{ const _sc = shClick; shClick = function (ev, sr) { const md = SHX_MODE, T = ev.target;
    if (SHX_JD || (T.closest && T.closest('.shx-sx,.shbp'))) return _sc.apply(this, arguments);
    const stop = () => { ev.stopImmediatePropagation(); ev.preventDefault(); };
    const a0 = T.closest && T.closest('[data-a]'), a = a0 && a0.dataset.a, d = a0 ? a0.dataset : {}, C0 = shc();
    const mine = ['shpk', 'shpkx', 'shpos', 'shpkend', 'shpklb', 'shlbst', 'sharr', 'shempty', 'shtrayf', 'shtrays', 'shtrayx', 'shtrayall', 'shtraygo', 'dkpq', 'dkpqs', 'dkpqok', 'dkpqrm', 'dkpqnew', 'dklbp', 'dklt', 'dkltadd', 'dkltrm', 'dkltoff', 'dkltset'];
    if (a && mine.includes(a)) { stop();
      if (a === 'shpk') { SHX_PICK = SHX_PICK === d.id ? null : d.id; SHX_PKP = 'pe'; return v5Redraw(); }
      if (a === 'shpkx') { SHX_PICK = null; return v5Redraw(); }
      if (a === 'shpos') return SHX_PICK && shSetPos(SHX_PICK, d.k);
      if (a === 'shpkend') { if (!SHX_PICK) return; shFreezeAuto(); const bk = shBk(), id = SHX_PICK; shMove(id, null, d.k === '1'); C0.arr = null; delete C0.myOrd; SHX_PICK = null; shSave(); v5Redraw(); return toast(d.k === '1' ? 'Livro no fim da estante' : 'Livro no começo da estante', shUndo(bk)); }
      if (a === 'shpklb') { const e = v5Book(SHX_PICK); if (!e) return; if (d.k === 'ed') { SHX_EDT = null; return shOpen('shxed', { e }); } return shOpen('shxsp', { e }); }
      if (a === 'shlbst') { const id = SHX_PICK; if (!id) return; C0.spb = C0.spb || {}; if (d.k === 'def') delete C0.spb[id]; else C0.spb[id] = d.k; shSave(); return v5Redraw(); }
      if (a === 'sharr') return shArrMenu();
      if (a === 'shempty') return shEmpty();
      if (a === 'shtrayf') { SHX_TRF = d.k; return v5Redraw(); }
      if (a === 'shtrays') { SHX_TRS = d.k; return v5Redraw(); }
      if (a === 'shtrayall') return shTrayUndo();
      if (a === 'shtrayx') { SHX_MODE = null; SHX_PICK = null; shSave(); v5Redraw(); return toast(`Faltam ${(C0.tray || []).length} livros para guardar · continue quando quiser`); }
      if (a === 'shtraygo') { SHX_MODE = 'org'; SHX_PICK = null; v5Redraw(); shScrollToShelf(84); return; }
      if (a === 'dkpqs') { if (SHX_PQE >= 0 && C0.plq && C0.plq[SHX_PQE]) { C0.plq[SHX_PQE].s = d.k; shSave(); } else SHX_PQS = d.k; return v5Redraw(); }
      if (a === 'dkpq') { SHX_PQE = +d.i; return v5Redraw(); }
      if (a === 'dkpqnew') { SHX_PQE = -1; return v5Redraw(); }
      if (a === 'dkpqrm') { const i = SHX_PQE; if (i < 0) return; const bk = JSON.parse(JSON.stringify(C0.plq || [])); C0.plq.splice(i, 1); SHX_PQE = -1; shSave(); v5Redraw(); return toast('Plaquinha tirada', { label: 'Desfazer', fn: () => { C0.plq = bk; shSave(); v5Redraw(); } }); }
      if (a === 'dkpqok') { const inp = sr.querySelector('#shpqt'), txt = String(inp ? inp.value : '').trim().slice(0, 24); if (!txt) { inp && inp.focus(); return toast('Escreva o texto da plaquinha'); }
        C0.plq = C0.plq || []; if (SHX_PQE >= 0 && C0.plq[SHX_PQE]) { C0.plq[SHX_PQE].t = txt; shSave(); v5Redraw(); return toast('Plaquinha salva'); }
        if (C0.plq.length >= 24) return toast('A estante já tem 24 plaquinhas');
        const nR = Math.max(1, sr.querySelectorAll('.bsh:not(.sm) .bay').length), cnt = Array.from({ length: nR }, (_, r) => C0.plq.filter((q) => q.r === r).length); let r = 0; cnt.forEach((c, i) => { if (c < cnt[r]) r = i; });
        C0.plq.push({ t: txt, s: SHX_PQS, r, p: 0.5 }); SHX_PQT = ''; SHX_PQE = C0.plq.length - 1; shSave(); v5Redraw(); const el = shBibRoot()?.querySelector(`.bsh .bpl[data-r="${r}"]`); if (el) el.scrollIntoView({ block: 'center' }); return toast('Plaquinha na ' + (r + 1) + 'ª prateleira · arraste para mudar de lugar'); }
      if (a === 'dklbp') { SHX_LBP = SHX_LBP ? 0 : 1; return v5Redraw(); }
      if (a === 'dklt') { SHX_LTE = +d.i; return v5Redraw(); }
      if (a === 'dkltadd') { return shLtSave((Ls) => { if (Ls.length < 3) { Ls.push({ m: ['est', 'var', 'led'][Ls.length] || 'bol', c: 'quente', w: ['f', 'varal', 'sob'][Ls.length] || 'f', r: 'todas', b: 1 }); SHX_LTE = Ls.length - 1; } }); }
      if (a === 'dkltrm') { return shLtSave((Ls) => { Ls.splice(SHX_LTE, 1); SHX_LTE = 0; }); }
      if (a === 'dkltoff') { const bk = JSON.parse(JSON.stringify(shLights(C0))); shLtSave((Ls) => { Ls.length = 0; }); return toast('Luzinhas apagadas', { label: 'Desfazer', fn: () => shLtSave((Ls) => { Ls.push(...bk); }) }); }
      if (a === 'dkltset') { return shLtSave((Ls) => { const L = Ls[SHX_LTE] || Ls[0]; if (!L) return; L[d.f] = d.f === 'b' ? +d.k : d.k; }); }
      return; }
    if (a === 'shdone' || a === 'shmode') { SHX_PICK = null; SHX_LBP = 0; SHX_PQE = -1; }
    if (a === 'dktab') { SHX_LBP = 0; if (d.k !== 'plq') SHX_PQE = -1; }
    if (a === 'dkreset') { delete C0.lights; }
    if (a === 'shreset' && Array.isArray(C0.tray)) { delete C0.tray; delete C0.trayBk; }
    const inA = (x) => !a0 || a0.contains(x); // botão de dentro manda; um contêiner com data-a em volta da estante não
    if (md === 'org') {
      const ins = T.closest('[data-ins],[data-insp]'); if (ins && SHX_PICK && inA(ins)) { stop(); return ins.dataset.insp != null ? shPlace(ins.dataset.insp, true, true) : shPlace(ins.dataset.ins, ins.dataset.af === '1', false); }
      const el = T.closest('.bsh:not(.sm) [data-bid]'); if (el && inA(el)) { stop(); const id = el.dataset.bid;
        if (SHX_PICK === id) { SHX_PICK = null; return v5Redraw(); }
        if (SHX_PICK) return shPlace(id, false, !!el.closest('.pile'));
        SHX_PICK = id; SHX_PKP = 'pe'; try { navigator.vibrate && navigator.vibrate(8); } catch {} return v5Redraw(); } }
    if (md === 'org' && a0 && a0.matches('[data-ins],[data-insp]')) { stop(); if (!SHX_PICK) return; return a0.dataset.insp != null ? shPlace(a0.dataset.insp, true, true) : shPlace(a0.dataset.ins, a0.dataset.af === '1', false); }
    if (md === 'deco') {
      if (SHX_LBP) { const el = T.closest('.bsh:not(.sm) [data-bid]'); if (el) { stop(); SHX_LBP = 0; v5Redraw(); const e = v5Book(el.dataset.bid); return e && shOpen('shxlb', { e }); } }
      const pq = T.closest('.plq.u[data-pq]'); if (pq) { stop(); SHX_PQE = +pq.dataset.pq; SHX_DKT = 'plq'; return v5Redraw(); }
      const bpl = T.closest('.bsh:not(.sm) .bpl[data-r]'); if (bpl && SHX_PQE >= 0 && C0.plq && C0.plq[SHX_PQE]) { stop(); const R0 = bpl.getBoundingClientRect(); C0.plq[SHX_PQE].r = +bpl.dataset.r; C0.plq[SHX_PQE].p = Math.max(0.04, Math.min(0.96, (ev.clientX - R0.left) / R0.width)); shSave(); return v5Redraw(); }
      const dk = T.closest('.bsh .dec[data-dk]'); const dd = dk && C0.deco && C0.deco[+dk.dataset.dk];
      if (dd && dd.k === 'leitor') { stop(); const i = +dk.dataset.dk, cur = shLeitorBook(dd);
        return shX('Leitor digital', [['Escolher livro do visor', () => shPickBook('Escolher livro do visor', cur && cur.id, (id) => { C0.deco[i].bk = id; shSave(); v5Redraw(); toast('“' + shTitle(id).slice(0, 40) + '” no visor'); })], [dd.cor ? 'Visor em tons de cinza' : 'Mostrar a capa colorida', () => { C0.deco[i].cor = dd.cor ? 0 : 1; shSave(); v5Redraw(); }], ['Trocar por outro enfeite', () => { SHX_DKS = i; SHX_DKT = 'enf'; v5Redraw(); }], ['Tirar da estante', () => { C0.deco.splice(i, 1); shSave(); v5Redraw(); toast('Enfeite tirado'); }]]); } }
    return _sc.apply(this, arguments); }; }

// ---------- arrastar plaquinha (Decorar) ----------
function shPqArm(sr) { if (!sr || sr.__pq) return; sr.__pq = 1;
  sr.addEventListener('pointerdown', (ev) => { if (SHX_MODE !== 'deco') return; const el = ev.target.closest && ev.target.closest('.plq.u[data-pq]'); if (!el) return; if (ev.cancelable) ev.preventDefault(); SHX_PQD = { el, i: +el.dataset.pq, x: ev.clientX, y: ev.clientY, on: false, pid: ev.pointerId, r: null, p: null, sr }; }, true);
  sr.addEventListener('input', (ev) => { if (ev.target && ev.target.id === 'shpqt') { if (SHX_PQE < 0) SHX_PQT = ev.target.value; const c = ev.target.closest('.pqin')?.querySelector('.cnt'); if (c) c.textContent = ev.target.value.length + '/24'; } }, true);
  if (window.__shpqw) return; window.__shpqw = 1;
  window.addEventListener('pointermove', (ev) => { const D = SHX_PQD; if (!D || ev.pointerId !== D.pid) return; if (!D.on) { if (Math.hypot(ev.clientX - D.x, ev.clientY - D.y) < 6) return; D.on = true; D.el.style.pointerEvents = 'none'; D.el.classList.add('ed'); }
    ev.preventDefault(); const under = D.sr.elementFromPoint(ev.clientX, ev.clientY), bpl = under && (under.closest('.bsh:not(.sm) .bpl[data-r]') || under.closest('.bsh:not(.sm) .bay')?.nextElementSibling); if (!bpl || !bpl.matches('.bpl[data-r]')) return;
    const R0 = bpl.getBoundingClientRect(), p = Math.max(0.04, Math.min(0.96, (ev.clientX - R0.left) / R0.width)); if (D.el.parentElement !== bpl) bpl.append(D.el); D.el.style.left = (p * 100).toFixed(1) + '%'; D.r = +bpl.dataset.r; D.p = p; }, { passive: false });
  const end = (ev) => { const D = SHX_PQD; if (!D || (ev && ev.pointerId !== D.pid)) return; SHX_PQD = null; if (!D.on) return; SHX_JD = 1; setTimeout(() => { SHX_JD = 0; }, 350);
    const C0 = shc(); if (D.r != null && C0.plq && C0.plq[D.i]) { C0.plq[D.i].r = D.r; C0.plq[D.i].p = D.p; SHX_PQE = D.i; SHX_DKT = 'plq'; shSave(); } v5Redraw(); };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true); }

// ---------- desenho: faixa do Organizar, painel de baixo, aviso da bandeja ----------
{ const _sd = shDraw; shDraw = function (box) { const r = _sd.apply(this, arguments); try { shDrawMais(box); } catch (err) { console.warn('estante: organizar', err); } return r; }; }
function shDrawMais(box) { const host = box && box.querySelector(':scope > .v5host'), sr = host && host.shadowRoot, R = sr && sr.querySelector('.v5est'); if (!R) return; shPqArm(sr);
  const md = SHX_MODE, C0 = shc(); if (md !== 'org') SHX_PICK = null; if (md !== 'deco') { SHX_LBP = 0; }
  if (!R.querySelector('.bsh:not(.sm)')) return;
  if (md === 'org') { const ban = R.querySelector('.shban'); if (ban) ban.outerHTML = shOrgBanner();
    R.querySelectorAll('.bsh .brow').forEach((br) => { let j = 0; br.querySelectorAll(':scope > .ins:not(.wide)').forEach((x) => { if (j++ % 2) x.classList.add('hi'); }); });
    if (SHX_PICK) R.querySelectorAll('.bsh:not(.sm) [data-bid]').forEach((e) => { if (e.dataset.bid === SHX_PICK) e.classList.add('pk'); });
    const p = shOrgPanel(); if (p) { R.insertAdjacentHTML('beforeend', p); R.querySelector('.shtopw')?.insertAdjacentHTML('beforeend', '<div style="height:48vh" aria-hidden="true"></div>'); } }
  shToastLift(R);
  if (md === 'deco' && SHX_PQE >= 0) R.querySelector(`.bsh .plq[data-pq="${SHX_PQE}"]`)?.classList.add('ed');
  if (!md && Array.isArray(C0.tray) && C0.tray.length) { const n = C0.tray.length; R.querySelector('.shtop')?.insertAdjacentHTML('afterend', `<div class="shnote" role="status"><span>Faltam ${n} livro${n > 1 ? 's' : ''} para guardar</span><button type="button" data-a="shtraygo">Continuar</button></div>`); } }

// ---------- Perfil: estante com poucos livros fica compacta, centrada e com enfeites dos dois lados ----------
{ const _ph = shProfHTML; shProfHTML = function (L, mine, key, wBox) { try { const k = SHX_PF[key] == null || SHX_PF[key] >= L.length ? 'all' : SHX_PF[key], ids = k === 'all' ? [...new Set(L.flatMap((x) => x[1]))] : (L[k] ? L[k][1] : []);
      if (ids.length && ids.length < 8) { const C0 = shc(), mine0 = (C0.deco || []).map((d) => d.k).filter((x) => SH_DEC[x] && x !== 'leitor'), a = mine0[0] || 'planta', b = mine0.find((x) => x !== a) || (a === 'globo' ? 'lua' : 'globo');
        const c0 = SHX_CTX; SHX_CTX = { ...C0, deco: [{ k: a, r: 0, p: 0 }, { k: b, r: 0, p: 99 }], minR: 1, plq: [] }; try { return _ph.apply(this, arguments); } finally { SHX_CTX = c0; } } } catch (err) { console.warn('perfil compacto', err); }
    return _ph.apply(this, arguments); }; }

// ---------- Leituras por mês › Estante: a mesma estante, em ordem de leitura, com plaquinha por mês ----------
const SHX_YM = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
function shYearShelf(sec, row, list, y, own) {
  const B = {}, ids = [], mk = {}, eid = {}; let lastM = 0;
  list.filter((x) => !x.ap).forEach((x, i) => { const e = own && x.id ? v5Book(String(x.id)) : null, id = (e ? String(e.id) : 'y') + '#' + i;
    B[id] = { t: (e && e.title) || x.t || '', a: (e && e.author) || x.a || '', st: 'lido', tot: Number(e && e.totalPages) || Number(x.pg) || 0, img: (e && e.cover) || x.c || null }; if (e) eid[id] = String(e.id);
    ids.push(id); const m = Number(String(x.d).slice(5, 7)); if (m && m !== lastM) { mk[id] = SHX_YM[m - 1]; lastM = m; } });
  const box = document.createElement('div'); box.className = 'yv-est yv-est2'; row.after(box);
  if (!ids.length) { box.innerHTML = '<p class="mut" style="margin:10px 2px">Nenhum livro lido neste ano ainda.</p>'; return; }
  const fp = !own && S.fpData && S.fpData.shelf && S.fpData.shelf.prat && S.fpData.shelf.prat.C, base = own ? shc() : (fp || {});
  const C = shDefaults({ ed: {}, sp: {}, wood: base.wood, wall: base.wall, lt: base.lt, lights: base.lights, spMode: base.spMode, ord: null, lay: {}, pos: {}, manual: 1, deco: [], plq: [], mk, mkS: 'latao', minR: 1 });
  if (own) { ids.forEach((id) => { const r = eid[id]; if (r && base.ed && base.ed[r]) C.ed[id] = base.ed[r]; if (r && base.sp && base.sp[r]) C.sp[id] = base.sp[r]; }); }
  const dk = (base.deco || []).map((d) => d.k).find((k) => SH_DEC[k] && k !== 'leitor' && k !== 'planta'); if (dk) C.deco = [{ k: dk, r: 0, p: 99 }];
  const host = document.createElement('div'); host.className = 'shxpf'; box.append(host);
  const sr = host.attachShadow({ mode: 'open' }); const st = document.createElement('style'); st.textContent = V4CSS + V4EXTRA; sr.append(st); shCss(sr); SHX_ROOTS.add(sr);
  const R = document.createElement('div'); R.className = 'v4ler shxr yvr'; sr.append(R);
  const w = Math.max(240, (sec.clientWidth || row.clientWidth || Math.min(innerWidth, 560) - 32) - 2);
  R.innerHTML = shWith({ vis: true, C, B }, () => pratHTML(ids.map((id) => ({ id, ...B[id] })), false, w)); shFit(R);
  R.addEventListener('click', (ev) => { const t = ev.target.closest('[data-a=shxvb]'); if (!t) return; const id = t.dataset.id, b = B[id]; if (!b) return;
    if (eid[id]) { const e = v5Book(eid[id]); if (e) return openBookPage(e); } try { openAnyBook(b.t, b.a, b.img); } catch {} }); }
{ yvShelf = function (sec, row, list, y, own) { try { return shYearShelf(sec, row, list, y, own); } catch (err) { console.warn('estante do ano', err); } }; }
// folha rápida e busca de livro por cima do aviso: o aviso some para não cobrir os botões
const shToasts = () => { const o = []; try { [document, TR].forEach((R) => R.querySelectorAll('#toast,.toast').forEach((t) => { if (!o.includes(t)) o.push(t); })); } catch {} return o; };
const shToastOff = () => shToasts().forEach((t) => t.classList.add('hidden'));
{ const _x = shX; shX = function () { shToastOff(); return _x.apply(this, arguments); }; }
{ const _pb = shPickBook; shPickBook = function () { shToastOff(); return _pb.apply(this, arguments); }; }
// com um painel embaixo (Organizar, bandeja, Decorar), o aviso vai para o topo da tela e não cobre a estante nem o painel
let SHX_TLI = 0;
function shToastLift(R) { const T = shToasts(); if (!T.length) return;
  const pan = () => { const p = R && R.isConnected && R.querySelector('.shpk,.shtr,.dkpan'); return p && p.getClientRects().length ? p : null; };
  const set = () => { const p = pan(); if (p) { T.forEach((t) => { t.style.setProperty('bottom', 'auto', 'important'); t.style.setProperty('top', 'calc(64px + env(safe-area-inset-top,0px))', 'important'); }); return true; } T.forEach((t) => { t.style.removeProperty('bottom'); t.style.removeProperty('top'); }); return false; };
  if (set() && !SHX_TLI) SHX_TLI = setInterval(() => { if (!set()) { clearInterval(SHX_TLI); SHX_TLI = 0; } }, 600); }
