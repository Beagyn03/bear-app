// Prateleira, parte 2 (Bia, 21/11; porta do protótipo v186): Organizar, Decorar, edição do exemplar e foto da lombada.
// 1) Edição do exemplar: Brochura · Capa dura · Edição especial (filetes e corte dourados) · Bordas pintadas (cor do corte).
// 2) Foto da lombada (menu do livro › Mais): tirar foto, galeria ou foto de exemplo, com editor de corte na proporção da
//    lombada. Sai um JPEG pequeno (até 300 px de altura, ~10 KB) guardado em prefs.shx.sp; no máximo 60 fotos.
// 3) Organizar: arrastar entre posições e prateleiras com prévia no lugar; por cima de uma pilha deita o livro nela; segurar
//    0,6 s no meio de um livro em pé empilha os dois; tocar num livro abre Deitar/Levantar e Mover para o começo/fim.
// 4) Decorar: enfeites do universo do app (pôr, trocar, tirar, arrastar), madeira, parede, luzinhas e lombadas da capa/desenhadas.
const SHX_CSS2 = `.v4ler .bsh .sp.cvs{background-color:var(--c);background-size:auto 100%;background-position:0 0;background-repeat:no-repeat}
.v4ler .bsh .sp.cvs .tp{position:absolute;left:13%;right:13%;border-radius:1px;background:color-mix(in srgb,var(--c) 84%,transparent);box-shadow:0 0 0 .5px rgba(255,255,255,.14),0 1px 2px rgba(0,0,0,.25)}
.v4ler .bsh .sp.cvs .tt{text-shadow:0 0 1.5px rgba(0,0,0,.25)}
.v4ler .bsh .sp.cvs .au{text-shadow:0 0 2px rgba(0,0,0,.7)}
.v4ler .bsh .sp.ph{background-color:#333;background-size:100% 100%;background-position:center}
.v4ler .bsh .sp.ph::after{display:none}
.v4ler .bsh .sp .eg{position:absolute;left:0;right:0;top:0;height:3px;border-radius:1.5px 1.5px 0 0;background:var(--eg);box-shadow:inset 0 -1px 0 rgba(0,0,0,.25);z-index:2}
.v4ler .bsh .sp.ep{border-radius:2.5px 2.5px 1px 1px}
.v4ler .bsh .sp.ep .fb{background:#e2bd62;opacity:.95}
.v4ler .bsh .sp .orn{position:absolute;left:50%;width:5px;height:5px;margin-left:-3.5px;border:1px solid #e2bd62;transform:rotate(45deg);z-index:1}
.v4ler .bsh .pb.fe{background:var(--eg);background-image:repeating-linear-gradient(0deg,rgba(255,255,255,.22) 0 .6px,transparent .6px 1.8px),linear-gradient(180deg,var(--c) 0 2px,transparent 2px calc(100% - 2px),var(--c) calc(100% - 2px))}
.v4ler .bsh .pb.fe::before{background:linear-gradient(180deg,rgba(255,255,255,.12),rgba(0,0,0,0) 40%,rgba(0,0,0,.18))}
.v4ler .bsh.org .sp,.v4ler .bsh.org .pb,.v4ler .bsh.org .face{cursor:grab;touch-action:none;outline:1px dashed color-mix(in srgb,var(--acc) 70%,transparent);outline-offset:1px}
.v4ler .bsh.org .sp:hover{transform:translateY(-4px)}
.v4ler .bsh .drg{opacity:.25}
.v4ler .bsh.deco .dec.u{pointer-events:auto;cursor:grab;touch-action:none;border-radius:6px;outline:1.5px dashed color-mix(in srgb,var(--acc) 75%,transparent);outline-offset:3px}
.v4ler .bsh.deco .dec.u:focus-visible{outline-style:solid}
.v4ler .shghost{position:fixed;z-index:9999;pointer-events:none;margin:0;transform:rotate(-3deg) scale(1.06);filter:drop-shadow(0 12px 14px rgba(0,0,0,.45));opacity:.96}
.v4ler .shind{position:fixed;z-index:10000;width:4px;border-radius:2px;background:var(--acc);box-shadow:0 0 10px var(--acc);pointer-events:none}
.v4ler .shtools{display:flex;gap:8px;margin:0 2px 10px}
.v4ler .shtools button{flex:1;display:flex;align-items:center;justify-content:center;gap:7px;min-height:42px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-weight:800;font-size:14px;cursor:pointer}
.v4ler .shtools svg{width:18px;height:18px}
.v4ler .shban{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:10px 12px;border-radius:14px;background:var(--ink);color:var(--bg);box-shadow:0 8px 18px rgba(0,0,0,.22)}
.v4ler .shban b{flex:1;font-size:13.5px;line-height:1.25}
.v4ler .shban small{display:block;font-weight:600;opacity:.82;font-size:11.5px;margin-top:2px}
.v4ler .shban>button{min-height:38px;padding:0 15px;border:0;border-radius:10px;background:var(--acc);color:#fff;font:inherit;font-weight:800;cursor:pointer;flex:none}
.v4ler .shban small button{background:none;border:0;padding:0;color:inherit;text-decoration:underline;font:inherit;font-weight:800;cursor:pointer}
.v4ler .bsh.w-linho{background-image:repeating-linear-gradient(0deg,rgba(0,0,0,.024) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(0,0,0,.018) 0 1px,transparent 1px 4px)}
.v4ler .bsh.w-ceu{--bk-wall:#111a36;--bk-back:#0b1230;--bk-hint:#bdb4dc;background-image:radial-gradient(1.2px 1.2px at 12% 18%,rgba(255,255,255,.55),transparent 70%),radial-gradient(1px 1px at 38% 62%,rgba(255,255,255,.4),transparent 70%),radial-gradient(1.5px 1.5px at 72% 26%,rgba(255,248,220,.7),transparent 70%),radial-gradient(1px 1px at 88% 78%,rgba(255,255,255,.45),transparent 70%),radial-gradient(1px 1px at 55% 8%,rgba(255,255,255,.4),transparent 70%);background-size:140px 140px}
.v4ler .bsh.w-ceu .bay{background:linear-gradient(180deg,rgba(0,0,0,.32),rgba(0,0,0,0) 22px),radial-gradient(120% 60% at 50% 105%,var(--bk-glow),transparent 70%),radial-gradient(1px 1px at 20% 30%,rgba(255,255,255,.45),transparent 70%),radial-gradient(1px 1px at 65% 55%,rgba(255,255,255,.35),transparent 70%),radial-gradient(1.3px 1.3px at 85% 20%,rgba(255,246,214,.6),transparent 70%),var(--bk-back);background-size:auto,auto,110px 90px,110px 90px,110px 90px,auto}
.v4ler .bsh.w-liso{--bk-wall:var(--bg);--bk-back:color-mix(in srgb,var(--bg) 90%,#000)}
.v4ler .bsh.w-papel{background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g fill='none' stroke='%23b08a4a' stroke-opacity='.3' stroke-width='.8'><path d='M14 20l18 10 16-6 10 14'/><path d='M70 82l16-8 14 12 8-10'/></g><g fill='%23b08a4a' fill-opacity='.5'><circle cx='14' cy='20' r='1.5'/><circle cx='32' cy='30' r='1.1'/><circle cx='48' cy='24' r='1.4'/><circle cx='58' cy='38' r='1'/><circle cx='70' cy='82' r='1.3'/><circle cx='86' cy='74' r='1'/><circle cx='100' cy='86' r='1.5'/><circle cx='108' cy='76' r='1'/><circle cx='96' cy='18' r='.8'/><circle cx='24' cy='96' r='.8'/></g></svg>");background-size:120px 120px}
.v4ler .bsh.lt-off{--bk-glow:transparent}
.v4ler .bsh.lt-fria{--bk-glow:rgba(170,205,255,.14)}
.v4ler .bsh.lt-fria .lt i{background:radial-gradient(circle at 50% 40%,#fff,#d6ebff 55%,#86b4ea);box-shadow:0 0 4px 1px rgba(175,212,255,.7),0 0 12px 4px rgba(150,195,255,.2)}
.v4ler .bsh.lt-cor{--bk-glow:rgba(255,170,210,.12)}
.v4ler .bsh.lt-cor .lt i:nth-of-type(4n+1){background:radial-gradient(circle at 50% 40%,#fff,#ffa3b1 55%,#e0506a);box-shadow:0 0 4px 1px rgba(255,120,150,.6),0 0 10px 3px rgba(255,120,150,.18)}
.v4ler .bsh.lt-cor .lt i:nth-of-type(4n+2){background:radial-gradient(circle at 50% 40%,#fff,#a6f0bf 55%,#3fae6a);box-shadow:0 0 4px 1px rgba(110,220,150,.6),0 0 10px 3px rgba(110,220,150,.18)}
.v4ler .bsh.lt-cor .lt i:nth-of-type(4n+3){background:radial-gradient(circle at 50% 40%,#fff,#a9c8ff 55%,#4b7ee0);box-shadow:0 0 4px 1px rgba(120,160,255,.6),0 0 10px 3px rgba(120,160,255,.18)}
.v4ler .dkpan{position:fixed;left:0;right:0;bottom:var(--shx-tab,0px);z-index:9400;max-width:560px;margin:0 auto;box-sizing:border-box;background:var(--card);color:var(--ink);border-radius:20px 20px 0 0;box-shadow:0 -12px 32px rgba(0,0,0,.28);padding:8px max(14px,env(safe-area-inset-left,0px)) calc(12px + env(safe-area-inset-bottom,0px));max-height:52%;display:flex;flex-direction:column}
.v4ler .dkpan .grab{width:38px;height:4px;border-radius:2px;background:var(--line);margin:0 auto 8px}
.v4ler .dkpan .dtabs{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px;border-radius:13px;background:var(--soft);margin-bottom:8px}
.v4ler .dkpan .dtabs button{min-height:38px;border:0;border-radius:10px;background:none;color:var(--ink2);font:inherit;font-weight:800;font-size:13px;cursor:pointer}
.v4ler .dkpan .dtabs button.on{background:var(--card);color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.12)}
.v4ler .dkpan .dbody{overflow-y:auto;padding:2px 1px 4px;scrollbar-width:none}
.v4ler .dkpan .dkh{margin:0 0 8px;font-size:12.5px;color:var(--ink2);font-weight:600}
.v4ler .dkgrid{display:flex;gap:8px;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;margin:0 -2px;padding:0 2px 2px}
.v4ler .dkgrid::-webkit-scrollbar{display:none}
.v4ler .dkgrid button{flex:0 0 82px;scroll-snap-align:start;display:grid;justify-items:center;align-content:end;gap:4px;padding:8px 2px 7px;border-radius:12px;border:1px solid var(--line);background:var(--soft);font:inherit;font-size:10.5px;font-weight:700;line-height:1.15;color:var(--ink);cursor:pointer;min-height:92px;text-align:center}
.v4ler .dkgrid .th{height:50px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.v4ler .dkgrid .th svg{margin:0!important}
.v4ler .dkgrid button .n{display:inline-block;min-width:16px;padding:0 4px;border-radius:8px;background:var(--acc);color:#fff;font-size:10px}
.v4ler .dsw{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.v4ler .dsw button{display:grid;gap:6px;justify-items:center;padding:7px 4px;border-radius:12px;border:1px solid var(--line);background:none;font:inherit;font-size:12px;font-weight:700;color:var(--ink);cursor:pointer}
.v4ler .dsw .sw{width:100%;height:44px;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.v4ler .dsw button.on,.v4ler .dkgrid button.on{border-color:var(--acc);box-shadow:inset 0 0 0 1.5px var(--acc)}
.v4ler .dkpan .dsec{margin:12px 0 6px;font-size:11.5px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink3)}
.v4ler .dkfoot{display:flex;gap:8px;margin-top:8px}
.v4ler .dkfoot .btn{flex:1;min-height:44px}
.v4ler .shprev{margin:4px 0 10px!important;padding:12px 0 0!important;border-radius:14px;overflow:hidden}
.v4ler .shprev .case{margin:0 auto!important;width:max-content;min-width:150px}
.v4ler .shprev .brow{justify-content:center;height:176px!important}
.v4ler .edopt{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.v4ler .edopt button{display:grid;gap:2px;text-align:left;padding:10px 12px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-weight:800;font-size:14px;cursor:pointer}
.v4ler .edopt button small{font-weight:600;color:var(--ink2);font-size:11.5px}
.v4ler .edopt button.on{border-color:var(--acc);box-shadow:inset 0 0 0 1.5px var(--acc)}
.v4ler .edcor{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 2px}
.v4ler .edcor button{width:36px;height:36px;border-radius:50%;border:2px solid var(--card);box-shadow:0 0 0 1px var(--line);cursor:pointer}
.v4ler .edcor button.on{box-shadow:0 0 0 2.5px var(--acc)}
.v4ler .spl{display:grid;gap:8px}
.v4ler .spl label,.v4ler .spl button{display:flex;align-items:center;gap:12px;min-height:50px;padding:0 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-weight:800;font-size:14.5px;cursor:pointer;text-align:left}
.v4ler .spl svg{width:20px;height:20px;flex:none}
.v4ler .spl .dng{color:var(--danger,#c0392b)}
.v4ler .shcrop{position:fixed;inset:0;z-index:9999;background:#0c0a12;color:#fff;display:flex;flex-direction:column;align-items:stretch;gap:10px;padding:14px max(16px,env(safe-area-inset-left,0px)) calc(14px + env(safe-area-inset-bottom,0px))}
.v4ler .shcrop .shc-top{display:grid;gap:2px;text-align:center}
.v4ler .shcrop .shc-top b{font-size:17px}
.v4ler .shcrop .shc-top small{opacity:.75;font-size:12.5px}
.v4ler .shcrop .shc-stage{position:relative;flex:1;overflow:hidden;touch-action:none;border-radius:12px;background:#000;cursor:grab}
.v4ler .shcrop .shc-stage img{position:absolute;left:0;top:0;max-width:none;user-select:none;-webkit-user-drag:none;pointer-events:none;transform-origin:0 0}
.v4ler .shcrop .shc-frame{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);box-shadow:0 0 0 9999px rgba(0,0,0,.62);outline:1.5px solid #fff;border-radius:2px;pointer-events:none}
.v4ler .shcrop .shc-frame::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent 33%,rgba(255,255,255,.25) 33% calc(33% + 1px),transparent calc(33% + 1px) 66%,rgba(255,255,255,.25) 66% calc(66% + 1px),transparent calc(66% + 1px))}
.v4ler .shcrop .shc-ctl{display:flex;align-items:center;gap:10px}
.v4ler .shcrop .shc-ctl input{flex:1;accent-color:#e9b56a}
.v4ler .shcrop .shc-bt{display:flex;gap:8px}
.v4ler .shcrop .shc-bt .btn{flex:1;min-height:48px}
.v4ler .shcrop .btn.s{background:#1f1b2a;border-color:#3a3350;color:#fff}
@media (prefers-reduced-motion: reduce){.v4ler .shghost{transform:none}
}

.v4ler .bsh .spph{display:inline-block;align-self:flex-end;flex:none;border-radius:3px;border:2px dashed var(--acc);background:color-mix(in srgb,var(--acc) 14%,transparent);animation:shphIn .16s ease-out}
.v4ler .bsh .pbph{display:block;border-radius:3px;border:2px dashed var(--acc);background:color-mix(in srgb,var(--acc) 22%,transparent);animation:shphIn2 .16s ease-out;margin-left:4px}
.v4ler .bsh .pile.pdrop{filter:drop-shadow(0 0 6px color-mix(in srgb,var(--acc) 70%,transparent))}
.v4ler .bsh .sp.hold,.v4ler .bsh .face.hold{outline:3px solid var(--acc);outline-offset:2px;border-radius:3px}
.v4ler .shholdtip{position:fixed;z-index:10001;padding:6px 10px;border-radius:999px;background:var(--ink);color:var(--bg);font-size:12px;font-weight:800;pointer-events:none;white-space:nowrap;transform:translate(-50%,-130%)}
@keyframes shphIn{from{width:0;opacity:0}}
@keyframes shphIn2{from{transform:scaleX(.3);opacity:0}}
@media (prefers-reduced-motion: reduce){.v4ler .bsh .spph,.v4ler .bsh .pbph{animation:none}
}

`;
let SHX_DKT = 'enf', SHX_DKS = null, SHX_EDT = null, SHX_JD = 0;
const SH_EDN = { pb: 'Brochura', hc: 'Capa dura', ep: 'Edição especial', bp: 'Bordas pintadas' };
const shTitle = (id) => { const b = shById(id); return b ? b.t : 'Livro'; };
// ----- painel Decorar -----
function shDecoInit() { const C0 = shc(); if (C0.deco) return; const DECS = ['planta', 'lua', null, 'globo', 'quadro', null, 'telescopio', 'lua', null, 'vela'];
  const sr = shBibRoot(), domN = sr ? sr.querySelectorAll('.bsh:not(.sm) .bay').length : 0, n = domN || Math.max(3, Math.ceil(lib().length / 12));
  C0.deco = []; for (let r = 0; r < n; r++) { const d = DECS[r % DECS.length]; if (d) C0.deco.push({ k: d, r, p: (d === 'lua' || r % 2) ? 99 : 0 }); } }
function shThumb(k) { const h = SH_DH[k] || 60; return SH_DEC[k](Math.min(1, 48 / h)); }
function dkPanel() { const C0 = shc(), t = SHX_DKT || 'enf', cnt = {}; (C0.deco || []).forEach((d) => { cnt[d.k] = (cnt[d.k] || 0) + 1; });
  const tabs = [['enf', 'Enfeites'], ['mad', 'Madeira'], ['par', 'Parede'], ['luz', 'Luzinhas']].map(([k, l]) => `<button type="button" role="tab" aria-selected="${t === k}" class="${t === k ? 'on' : ''}" data-a="dktab" data-k="${k}">${l}</button>`).join('');
  let body = '';
  if (t === 'enf') body = `<p class="dkh">${SHX_DKS != null ? 'Escolha o enfeite que entra no lugar.' : 'Toque para pôr na estante. Lá, toque num enfeite para trocar ou tirar, ou arraste.'}</p><div class="dkgrid">${SH_CAT.map(([k, n]) => `<button type="button" data-a="dkadd" data-k="${k}" aria-label="${SHX_DKS != null ? 'Trocar por' : 'Pôr na estante:'} ${esc(n)}${cnt[k] ? ', ' + cnt[k] + ' na estante' : ''}"><span class="th">${shThumb(k)}</span>${esc(n)}${cnt[k] ? ` <span class="n">${cnt[k]}</span>` : ''}</button>`).join('')}</div>`;
  if (t === 'mad') { const W0 = C0.wood || 'auto';
    const sw = [['auto', 'Do tema', 'linear-gradient(135deg,#d6aa76 50%,#6b4a32 50%)'], ['clara', 'Clara', 'linear-gradient(180deg,#e8c597,#d6aa76 30%,#b98551)'], ['escura', 'Escura', 'linear-gradient(180deg,#7d5a3e,#6b4a32 30%,#4d3322)'], ['branca', 'Branca', 'linear-gradient(180deg,#fcfaf6,#f2eee7 30%,#ddd6ca)'], ['tema', 'Cor do app', 'linear-gradient(180deg,color-mix(in srgb,var(--acc) 50%,#f3d7a8),color-mix(in srgb,var(--acc) 58%,#6b4a2a) 30%,color-mix(in srgb,var(--acc) 44%,#3e2716))']];
    body = `<div class="dsw" role="radiogroup" aria-label="Madeira">${sw.map(([k, l, g]) => `<button type="button" role="radio" aria-checked="${W0 === k}" class="${W0 === k ? 'on' : ''}" data-a="dkwood" data-k="${k}"><span class="sw" style="background:${g}"></span>${l}</button>`).join('')}</div>
    <div class="dsec">Lombadas</div><div class="dsw" style="grid-template-columns:1fr 1fr" role="radiogroup" aria-label="Lombadas">${[['capa', 'Da capa', 'a cor e a faixa da capa de cada livro'], ['desenho', 'Desenhadas', 'tipografia e cores de lombada']].map(([k, l, s]) => `<button type="button" role="radio" aria-checked="${(C0.spMode || 'capa') === k}" class="${(C0.spMode || 'capa') === k ? 'on' : ''}" data-a="dksp" data-k="${k}" style="text-align:center"><b>${l}</b><small style="font-weight:600;color:var(--ink2);font-size:11px">${s}</small></button>`).join('')}</div>`; }
  if (t === 'par') { const W0 = C0.wall || 'linho';
    const sw = [['linho', 'Linho', 'repeating-linear-gradient(0deg,rgba(0,0,0,.05) 0 1px,transparent 1px 3px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 1px,transparent 1px 4px),#efe7da'], ['ceu', 'Céu noturno', 'radial-gradient(1.4px 1.4px at 20% 30%,#fff,transparent 70%),radial-gradient(1px 1px at 70% 60%,#fff,transparent 70%),radial-gradient(1.2px 1.2px at 45% 80%,#fff8e0,transparent 70%),#111a36'], ['liso', 'Lisa', 'var(--bg)'], ['papel', 'Papel de parede', `url(&quot;data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><g fill='none' stroke='#b08a4a' stroke-opacity='.5' stroke-width='.8'><path d='M6 8l10 6 10-3 6 9'/></g><g fill='#b08a4a'><circle cx='6' cy='8' r='1.2'/><circle cx='16' cy='14' r='1'/><circle cx='26' cy='11' r='1.2'/><circle cx='32' cy='20' r='.9'/></g></svg>")}&quot;),#efe7da`], ['madeira', 'Madeira', 'repeating-linear-gradient(90deg,rgba(0,0,0,.10) 0 1px,transparent 1px 9px),linear-gradient(180deg,var(--bk-w1,#b98551),var(--bk-w2,#8a5f3a))']];
    body = `<div class="dsw" role="radiogroup" aria-label="Parede">${sw.map(([k, l, g]) => `<button type="button" role="radio" aria-checked="${W0 === k}" class="${W0 === k ? 'on' : ''}" data-a="dkwall" data-k="${k}"><span class="sw" style="background:${g}"></span>${l}</button>`).join('')}</div>`; }
  if (t === 'luz') { const L = C0.lt || { on: 1, c: 'quente' }, cur = L.on === 0 ? 'off' : L.c;
    body = `<p class="dkh">O cordão aceso na borda das prateleiras.</p><div class="dsw" role="radiogroup" aria-label="Luzinhas">${[['off', 'Apagadas', 'linear-gradient(90deg,transparent 48%,rgba(120,110,100,.5) 48% 52%,transparent 52%),#2a2233'], ['quente', 'Quentes', 'radial-gradient(circle at 30% 50%,#ffd37a 3px,transparent 4px),radial-gradient(circle at 70% 50%,#ffd37a 3px,transparent 4px),#2a2233'], ['fria', 'Frias', 'radial-gradient(circle at 30% 50%,#d6ebff 3px,transparent 4px),radial-gradient(circle at 70% 50%,#d6ebff 3px,transparent 4px),#2a2233'], ['cor', 'Coloridas', 'radial-gradient(circle at 20% 50%,#ff8fa3 3px,transparent 4px),radial-gradient(circle at 45% 50%,#8fe0ae 3px,transparent 4px),radial-gradient(circle at 70% 50%,#9ab8ff 3px,transparent 4px),radial-gradient(circle at 90% 50%,#ffd37a 3px,transparent 4px),#2a2233']].map(([k, l, g]) => `<button type="button" role="radio" aria-checked="${cur === k}" class="${cur === k ? 'on' : ''}" data-a="dkltc" data-k="${k}"><span class="sw" style="background:${g}"></span>${l}</button>`).join('')}</div>`; }
  return `<div class="dkpan" role="region" aria-label="Decorar a estante"><div class="grab"></div><div class="dtabs" role="tablist">${tabs}</div><div class="dbody">${body}</div><div class="dkfoot"><button type="button" class="btn s" data-a="dkreset">Restaurar padrão</button><button type="button" class="btn p" data-a="shdone">Concluir</button></div></div>`; }
// ----- menu do livro › Mais: Edição na estante · Foto da lombada -----
{ const _bm = v5BmHTML; v5BmHTML = function (e) { let h = _bm.apply(this, arguments);
    try { const row = (a, ic, t, sm) => `<button type="button" class="li" data-a="${a}">${v4ic(ic, 20)}<span class="t">${t}<small>${sm}</small></span><span class="r">${v4ic('chev', 16)}</span></button>`;
      h = h.replace(/(<button class="li v5more[^>]*>[\s\S]*?<small>)([^<]*)(<\/small>)/, (m, a, b, c) => a + b + (b ? ' · ' : '') + 'Edição na estante · Foto da lombada' + c);
      if (v4State().v5more) { const i = h.indexOf('<button class="li dng" data-a="sheet" data-s="v5rm"'); const add = row('shxed', 'estante', 'Edição na estante', 'brochura, capa dura, especial ou bordas pintadas') + row('shxsp', 'scan', 'Foto da lombada', 'a lombada do seu exemplar na Prateleira');
        h = i >= 0 ? h.slice(0, i) + add + h.slice(i) : h + add; } } catch (err) { console.warn('menu da estante', err); }
    return h; }; }
// ----- folhas: Edição do seu exemplar · Foto da lombada -----
function shSheetHTML2(k) { const id = String(v4State().sheetE || ''), b = shById(id); if (!b) return '<p class="mut">Livro não encontrado.</p>'; const C0 = shc(); let h = '';
  const prev = () => { const m0 = SHX_MODE; SHX_MODE = null; const html = `<div class="bsh shprev${shDark() ? ' dk' : ''} w-${C0.wall || 'linho'}" style="${shWoodVars(C0.wood)}"><div class="case"><div class="crown"></div><div class="bay"><div class="brow">${spnHTML({ ...b, lean: 0 }, false).replace(/ data-a="[^"]*"| data-id="[^"]*"| data-long="[^"]*"/g, '').replace('<button type="button"', '<span').replace(/<\/button>$/, '</span>')}</div></div><div class="bpl"></div></div></div>`; SHX_MODE = m0; return html; };
  if (k === 'shxed') { const ov = shEdOf(b), cur = SHX_EDT || (SHX_EDT = { t: ov.t === 'auto' ? (spnGeo(b).hc ? 'hc' : 'pb') : ov.t, e: ov.e || '#b3283f' });
    const keep = C0.ed[b.id]; C0.ed[b.id] = { t: cur.t, e: cur.e }; const pv = prev(); if (keep) C0.ed[b.id] = keep; else delete C0.ed[b.id];
    h = `<h3 style="margin-bottom:2px">Edição do seu exemplar</h3><p class="mut" style="margin:0 0 6px">${esc(b.t)} · muda a lombada na Prateleira</p>${pv}
      <div class="edopt" role="radiogroup" aria-label="Tipo de edição">${[['pb', 'Brochura', 'capa mole, a mais comum'], ['hc', 'Capa dura', 'mais alta, com filetes'], ['ep', 'Edição especial', 'douração e corte dourado'], ['bp', 'Bordas pintadas', 'corte das páginas colorido']].map(([k2, l, sm]) => `<button type="button" role="radio" aria-checked="${cur.t === k2}" class="${cur.t === k2 ? 'on' : ''}" data-a="shedt" data-k="${k2}">${l}<small>${sm}</small></button>`).join('')}</div>
      ${cur.t === 'bp' ? `<div class="lbl" style="margin-top:12px">Cor do corte</div><div class="edcor" role="radiogroup" aria-label="Cor do corte">${[['#b3283f', 'vinho'], ['#d9534a', 'coral'], ['#e9a83a', 'mostarda'], ['#3f8f6b', 'verde'], ['#2f6fb0', 'azul'], ['#6a4fb3', 'violeta'], ['#e58fb0', 'rosa'], ['#1d1d1f', 'preto']].map(([c2, n]) => `<button type="button" role="radio" aria-checked="${cur.e === c2}" aria-label="${n}" class="${cur.e === c2 ? 'on' : ''}" data-a="shedc" data-k="${c2}" style="background:${c2}"></button>`).join('')}</div>` : ''}
      <div class="row" style="gap:8px;margin-top:14px"><button type="button" class="btn s" style="flex:1" data-a="shedauto">Automática</button><button type="button" class="btn p" style="flex:2" data-a="shedok">Salvar</button></div>`; }
  if (k === 'shxsp') { const has = C0.sp && C0.sp[b.id];
    h = `<h3 style="margin-bottom:2px">Foto da lombada</h3><p class="mut" style="margin:0 0 6px">${has ? 'Esta é a lombada do seu exemplar na estante.' : 'Fotografe a lombada do seu exemplar; ela entra no lugar da lombada da capa.'}</p>${prev()}
      <div class="spl"><label>${v4ic('scan', 20)}Tirar foto<input type="file" accept="image/*" capture="environment" data-shin="${esc(b.id)}" data-nosrc="1" hidden></label><label>${v4ic('estante', 20)}Escolher da galeria<input type="file" accept="image/*" data-shin="${esc(b.id)}" data-nosrc="1" hidden></label><button type="button" data-a="shspex" data-id="${esc(b.id)}">${v4ic('eye', 20)}Ver com uma foto de exemplo</button>${has ? `<button type="button" class="dng" data-a="shsprm" data-id="${esc(b.id)}">${v4ic('x', 20)}Tirar a foto e voltar à lombada da capa</button>` : ''}</div>`; }
  return h; }
// ----- editor de corte da foto da lombada (proporção alta e estreita, a da lombada do livro) -----
function shCrop(src, id) { const b = shById(id); if (!b) return; const G = spnGeo(b, false), ar = G.w / G.h; const R0 = v4Root(), SR = R0.getRootNode(); SR.querySelectorAll('.shcropw').forEach((x) => x.remove());
  const wrapC = document.createElement('div'); wrapC.className = 'v4ler shxr shcropw';
  const ov = document.createElement('div'); ov.className = 'shcrop'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Ajustar a foto da lombada');
  ov.innerHTML = `<div class="shc-top"><b>Ajuste a lombada</b><small>Arraste para posicionar · aproxime com dois dedos ou a barra</small></div><div class="shc-stage"><img alt=""><div class="shc-frame"></div></div><div class="shc-ctl"><button type="button" class="btn s" data-c="rot" aria-label="Girar 90 graus">↻ Girar</button><input type="range" min="1" max="5" step="0.01" value="1" aria-label="Aproximar"></div><div class="shc-bt"><button type="button" class="btn s" data-c="x">Cancelar</button><button type="button" class="btn p" data-c="ok">Usar foto</button></div>`;
  wrapC.append(ov); SR.append(wrapC); const st = ov.querySelector('.shc-stage'), im = ov.querySelector('img'), fr = ov.querySelector('.shc-frame'), rg = ov.querySelector('input');
  let FW = 0, FH = 0, iw = 0, ih = 0, s0 = 1, z = 1, tx = 0, ty = 0; const ptrs = new Map(); let pinch = null;
  const layout = () => { const R = st.getBoundingClientRect(); FH = Math.min(R.height - 24, 520); FW = Math.max(28, Math.round(FH * ar)); fr.style.width = FW + 'px'; fr.style.height = FH + 'px'; return R; };
  const clamp = () => { const s = s0 * z, W2 = iw * s, H2 = ih * s; tx = Math.min(0, Math.max(FW - W2, tx)); ty = Math.min(0, Math.max(FH - H2, ty)); };
  const paint = () => { const R = st.getBoundingClientRect(), fl = (R.width - FW) / 2, ft = (R.height - FH) / 2, s = s0 * z; clamp(); im.style.width = iw * s + 'px'; im.style.height = ih * s + 'px'; im.style.transform = `translate(${fl + tx}px,${ft + ty}px)`; };
  const load = (u) => { im.onload = () => { iw = im.naturalWidth; ih = im.naturalHeight; layout(); s0 = Math.max(FW / iw, FH / ih); z = 1; rg.value = 1; tx = (FW - iw * s0) / 2; ty = (FH - ih * s0) / 2; paint(); }; im.src = u; };
  const zoomAt = (nz, cx, cy) => { const R = st.getBoundingClientRect(), fl = (R.width - FW) / 2, ft = (R.height - FH) / 2, px = cx - R.left - fl, py = cy - R.top - ft, s1 = s0 * z; nz = Math.max(1, Math.min(5, nz)); const s2 = s0 * nz; tx = px - (px - tx) * s2 / s1; ty = py - (py - ty) * s2 / s1; z = nz; rg.value = z; paint(); };
  st.addEventListener('pointerdown', (e) => { st.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) { const [a, c] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - c.x, a.y - c.y), z }; } });
  st.addEventListener('pointermove', (e) => { const p = ptrs.get(e.pointerId); if (!p) return; if (ptrs.size === 1) { tx += e.clientX - p.x; ty += e.clientY - p.y; p.x = e.clientX; p.y = e.clientY; paint(); return; }
    p.x = e.clientX; p.y = e.clientY; const [a, c] = [...ptrs.values()]; if (pinch) zoomAt(pinch.z * Math.hypot(a.x - c.x, a.y - c.y) / pinch.d, (a.x + c.x) / 2, (a.y + c.y) / 2); });
  const up = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; }; st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  st.addEventListener('wheel', (e) => { e.preventDefault(); zoomAt(z * (e.deltaY < 0 ? 1.08 : 1 / 1.08), e.clientX, e.clientY); }, { passive: false });
  rg.addEventListener('input', () => { const R = st.getBoundingClientRect(); zoomAt(+rg.value, R.left + R.width / 2, R.top + R.height / 2); });
  const onRs = () => { if (wrapC.isConnected && iw) { layout(); paint(); } };
  const close = () => { wrapC.remove(); document.removeEventListener('keydown', esc1); window.removeEventListener('resize', onRs); }; const esc1 = (e) => { if (e.key === 'Escape') close(); }; document.addEventListener('keydown', esc1);
  ov.addEventListener('click', (e) => { const k = e.target.closest('[data-c]'); if (!k) return; e.stopPropagation(); const c = k.dataset.c;
    if (c === 'x') return close();
    if (c === 'rot') { const cn = document.createElement('canvas'); cn.width = ih; cn.height = iw; const x = cn.getContext('2d'); x.translate(ih, 0); x.rotate(Math.PI / 2); x.drawImage(im, 0, 0); return load(cn.toDataURL('image/jpeg', 0.92)); }
    if (c === 'ok') { const C0 = shc(); C0.sp = C0.sp || {}; if (!C0.sp[id] && Object.keys(C0.sp).length >= 60) return toast('Limite de 60 fotos de lombada. Tire uma antes.');
      // foto pequena: vai junto com a conta (prefs), então sai com até 300 px de altura e no máximo ~40 KB
      const s = s0 * z, enc = (H, q) => { const ch = H, cw = Math.max(8, Math.round(H * FW / FH)), cn = document.createElement('canvas'); cn.width = cw; cn.height = ch; const x = cn.getContext('2d'); x.drawImage(im, -tx / s, -ty / s, FW / s, FH / s, 0, 0, cw, ch); return cn.toDataURL('image/jpeg', q); };
      let u = enc(300, 0.8); if (u.length > 40000) u = enc(240, 0.66); if (u.length > 40000) u = enc(180, 0.6);
      C0.sp[id] = u; shSave(); close(); v5SheetClose(); v5Redraw(); toast('Foto da lombada salva'); } });
  window.addEventListener('resize', onRs);
  load(src); setTimeout(() => ov.querySelector('[data-c="ok"]')?.focus(), 50); }
// foto de exemplo: uma lombada fotografada (tecido, douração, título), com fundo de estante ao redor para dar o que cortar
function shSamplePhoto(b) { const W = 360, H = 900, cn = document.createElement('canvas'); cn.width = W; cn.height = H; const x = cn.getContext('2d');
  const bg = x.createLinearGradient(0, 0, W, 0); bg.addColorStop(0, '#3b2a1e'); bg.addColorStop(0.5, '#5a3f2b'); bg.addColorStop(1, '#2e2117'); x.fillStyle = bg; x.fillRect(0, 0, W, H);
  x.fillStyle = '#7d4b2a'; x.fillRect(40, 40, 60, H - 80); x.fillStyle = '#244a55'; x.fillRect(262, 60, 56, H - 120);
  const sx = 120, sw = 120, sy = 40, sh = H - 70, g = x.createLinearGradient(sx, 0, sx + sw, 0); g.addColorStop(0, '#0f2a2e'); g.addColorStop(0.18, '#1f5158'); g.addColorStop(0.5, '#1a454b'); g.addColorStop(0.85, '#13363b'); g.addColorStop(1, '#0b2023');
  x.fillStyle = g; x.fillRect(sx, sy, sw, sh); for (let i = 0; i < 2400; i++) { x.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`; x.fillRect(sx + Math.random() * sw, sy + Math.random() * sh, 1, 1); }
  x.strokeStyle = '#d9b45a'; x.lineWidth = 2; [sy + 22, sy + 30, sy + sh - 30, sy + sh - 22].forEach((y) => { x.beginPath(); x.moveTo(sx + 10, y); x.lineTo(sx + sw - 10, y); x.stroke(); });
  x.save(); x.translate(sx + sw / 2, sy + 70); x.rotate(Math.PI / 2); x.fillStyle = '#e8c870'; x.font = 'bold 44px Georgia, serif'; x.textBaseline = 'middle'; x.fillText(String(b.t).toUpperCase().slice(0, 22), 0, 0); x.font = 'italic 28px Georgia, serif'; x.fillStyle = '#efdcae'; x.fillText(String(b.a || ''), Math.min(560, 40 + String(b.t).length * 30), 0); x.restore();
  x.fillStyle = '#e8c870'; x.beginPath(); x.arc(sx + sw / 2, sy + sh - 60, 10, 0, Math.PI * 2); x.fill(); x.fillStyle = '#1a454b'; x.beginPath(); x.arc(sx + sw / 2 + 5, sy + sh - 63, 8, 0, Math.PI * 2); x.fill();
  const vg = x.createRadialGradient(W / 2, H / 2, H / 4, W / 2, H / 2, H / 1.1); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.45)'); x.fillStyle = vg; x.fillRect(0, 0, W, H);
  return cn.toDataURL('image/jpeg', 0.9); }
// ----- toques da camada das folhas -----
function shV4Click(ev) { const t = ev.target.closest && ev.target.closest('[data-a]'); if (!t) return; const a = t.dataset.a, d = t.dataset;
  const own = ['shfil', 'shxed', 'shxsp', 'shedt', 'shedc', 'shedok', 'shedauto', 'shspex', 'shsprm']; if (!own.includes(a)) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const C0 = shc(), id = String(v4State().sheetE || '');
  if (a === 'shfil') { v5P().shF = d.k; v5Save(); v5SheetClose(); return v5Redraw(); }
  if (a === 'shxed') { const e = v5Book(id); SHX_EDT = null; return shOpen('shxed', { e }); }
  if (a === 'shxsp') { const e = v5Book(id); return shOpen('shxsp', { e }); }
  if (a === 'shedt') { SHX_EDT = { ...(SHX_EDT || {}), t: d.k }; if (!SHX_EDT.e) SHX_EDT.e = '#b3283f'; return v4Draw(); }
  if (a === 'shedc') { SHX_EDT = { ...(SHX_EDT || {}), e: d.k }; return v4Draw(); }
  if (a === 'shedok') { if (id && SHX_EDT) { C0.ed[id] = { t: SHX_EDT.t, ...(SHX_EDT.t === 'bp' ? { e: SHX_EDT.e } : {}) }; shSave(); } const nm = C0.ed[id] ? SH_EDN[C0.ed[id].t] : ''; SHX_EDT = null; v5SheetClose(); v5Redraw(); return toast('Edição salva: ' + nm); }
  if (a === 'shedauto') { if (id) { delete C0.ed[id]; shSave(); } SHX_EDT = null; v5SheetClose(); v5Redraw(); return toast('Edição automática, pelo formato do livro'); }
  if (a === 'shspex') { const b = shById(d.id); if (b) shCrop(shSamplePhoto(b), d.id); return; }
  if (a === 'shsprm') { delete C0.sp[d.id]; shSave(); v4Draw(); v5Redraw(); return toast('A lombada voltou a sair da capa'); } }
function shV4Change(ev) { const id = ev.target.dataset && ev.target.dataset.shin; if (!id) return; ev.stopImmediatePropagation(); const f = ev.target.files && ev.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => shCrop(rd.result, id); rd.readAsDataURL(f); }
// ----- folha de opções rápida (Organizar: deitar/levantar e mover; Decorar: trocar/tirar) -----
function shX(title, items) { const sr = shBibRoot(), R = sr && sr.querySelector('.v5est'); if (!R) return; R.querySelectorAll('.shx-sx').forEach((x) => x.remove());
  const w = document.createElement('div'); w.className = 'shx-sx'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-label', title);
  w.innerHTML = `<div><b>${esc(title)}</b>${items.map(([l], i) => `<button type="button" class="btn ${i === 0 ? 'p' : ''}" data-sx="${i}">${esc(l)}</button>`).join('')}<button type="button" class="btn" data-sx="x">Cancelar</button></div>`;
  w.addEventListener('click', (ev) => { ev.stopPropagation(); const t = ev.target.closest('[data-sx]'); if (ev.target === w || (t && t.dataset.sx === 'x')) return w.remove(); if (!t) return; w.remove(); items[+t.dataset.sx][1](); });
  R.append(w); w.querySelector('button')?.focus(); }
// ----- ordem: mover dentro do que está à vista (vale dentro do filtro) -----
function shMove(id, ref, after) { const C0 = shc(), sr = shBibRoot(), shown = [...new Set([...(sr ? sr.querySelectorAll('.bsh:not(.sm) [data-bid]') : [])].map((e) => e.dataset.bid))];
  const vis = shown.filter((x) => x !== id); let at = ref == null ? (after ? vis.length : 0) : vis.indexOf(ref) + (after ? 1 : 0); if (at < 0) at = vis.length; vis.splice(at, 0, id);
  let full = (C0.ord || []).slice(); shAllIds().concat(shown).forEach((x) => { if (!full.includes(x)) full.push(x); });
  const set = new Set(vis), slots = []; full.forEach((x, i) => { if (set.has(x)) slots.push(i); }); slots.forEach((i, j) => { full[i] = vis[j]; });
  C0.ord = full; C0.manual = 1; shSave(); }
// rolagem da página (a estante vive numa raiz própria): o primeiro ancestral que rola
function shScroller() { const sr = shBibRoot(); let n = sr && sr.host; while (n) { if (n.nodeType === 1) { const cs = getComputedStyle(n); if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight + 2) return n; } n = n.parentElement || (n.getRootNode && n.getRootNode().host) || null; } return document.scrollingElement || document.documentElement; }
function shScrollToShelf(off) { const sr = shBibRoot(), e = sr && sr.querySelector('.bsh:not(.sm)'); if (!e) return; const sc = shScroller(), top = sc === document.scrollingElement || sc === document.documentElement ? 0 : sc.getBoundingClientRect().top;
  sc.scrollTop = Math.max(0, e.getBoundingClientRect().top - top + sc.scrollTop - off); }
// ----- toques da Biblioteca (Prateleira) -----
function shClick(ev, sr) { const md = SHX_MODE;
  if (SHX_JD) { SHX_JD = 0; ev.stopImmediatePropagation(); ev.preventDefault(); return; }
  if (ev.target.closest && ev.target.closest('.shx-sx')) return;
  if (md === 'org') { const el = ev.target.closest('.bsh:not(.sm) [data-bid]'); if (el) { ev.stopImmediatePropagation(); ev.preventDefault(); const id = el.dataset.bid, C0 = shc(), lay = !!(C0.lay && C0.lay[id]);
      return shX(shTitle(id), [[lay ? 'Levantar (fica em pé)' : 'Deitar (vira pilha)', () => { C0.lay = C0.lay || {}; if (lay) delete C0.lay[id]; else C0.lay[id] = 1; C0.manual = 1; shSave(); v5Redraw(); toast(lay ? 'Livro em pé' : 'Livro deitado'); }], ['Mover para o começo da estante', () => { shMove(id, null, false); v5Redraw(); }], ['Mover para o fim da estante', () => { shMove(id, null, true); v5Redraw(); }]]); } }
  if (md === 'deco') { const el = ev.target.closest('.bsh .dec[data-dk]'); if (el) { ev.stopImmediatePropagation(); ev.preventDefault(); const i = +el.dataset.dk, C0 = shc(), d = C0.deco[i];
      return shX(SH_DN[d.k] || 'Enfeite', [['Trocar por outro', () => { SHX_DKS = i; SHX_DKT = 'enf'; v5Redraw(); }], ['Tirar da estante', () => { C0.deco.splice(i, 1); shSave(); v5Redraw(); toast('Enfeite tirado'); }]]); } }
  const t = ev.target.closest && ev.target.closest('[data-a]'); if (!t) return; const a = t.dataset.a, d = t.dataset, C0 = shc();
  const own = ['shxview', 'shxsheet', 'shmode', 'shdone', 'shreset', 'dktab', 'dkadd', 'dkwood', 'dkwall', 'dkltc', 'dksp', 'dkreset']; if (!own.includes(a)) return; ev.stopImmediatePropagation(); ev.preventDefault();
  if (a === 'shxview') return shGo(d.v);
  if (a === 'shxsheet') return shOpen(d.s);
  if (a === 'shmode') { SHX_MODE = d.v; if (d.v === 'deco') { shDecoInit(); SHX_DKT = SHX_DKT || 'enf'; SHX_DKS = null; } v5Redraw(); shScrollToShelf(d.v === 'org' ? 84 : 8); return; }
  if (a === 'shdone') { const was = SHX_MODE; SHX_MODE = null; SHX_DKS = null; shSave(); v5Redraw(); return toast(was === 'org' ? 'Ordem salva' : 'Estante decorada'); }
  if (a === 'shreset') { C0.ord = null; C0.lay = {}; C0.pos = {}; C0.manual = 0; shSave(); v5Redraw(); return toast('A estante voltou a se arrumar sozinha'); }
  if (a === 'dktab') { SHX_DKT = d.k; return v5Redraw(); }
  if (a === 'dkadd') { C0.deco = C0.deco || []; if (SHX_DKS != null && C0.deco[SHX_DKS]) { C0.deco[SHX_DKS].k = d.k; SHX_DKS = null; shSave(); v5Redraw(); return toast(SH_DN[d.k] + ' no lugar'); }
    const n = Math.max(3, sr.querySelectorAll('.bsh:not(.sm) .bay').length), cnt = Array.from({ length: n }, (_, r) => C0.deco.filter((x) => x.r === r).length);
    let r = -1, best = 9; cnt.forEach((c, i) => { if (c < best) { best = c; r = i; } }); if (best >= 2) return toast('As prateleiras já têm dois enfeites cada. Tire um antes.');
    C0.deco.push({ k: d.k, r, p: best ? 0 : 99 }); shSave(); v5Redraw(); const el = shBibRoot()?.querySelector(`.bsh .bay[data-r="${r}"]`); if (el) el.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); return toast(SH_DN[d.k] + ' na ' + (r + 1) + 'ª prateleira'); }
  if (a === 'dkwood') { C0.wood = d.k; shSave(); return v5Redraw(); }
  if (a === 'dkwall') { C0.wall = d.k; shSave(); return v5Redraw(); }
  if (a === 'dkltc') { C0.lt = d.k === 'off' ? { ...(C0.lt || { c: 'quente' }), on: 0 } : { on: 1, c: d.k }; shSave(); return v5Redraw(); }
  if (a === 'dksp') { C0.spMode = d.k; shSave(); return v5Redraw(); }
  if (a === 'dkreset') { C0.deco = null; C0.wood = 'auto'; C0.wall = 'linho'; C0.lt = { on: 1, c: 'quente' }; C0.spMode = 'capa'; shSave(); v5Redraw(); shDecoInit(); shSave(); v5Redraw(); return toast('Decoração padrão de volta'); } }
// ----- Organizar mais esperto: prévia no lugar, empilhar, desempilhar, segurar para empilhar -----
function shPrevClear(D) { const sr = shBibRoot(); if (sr) { sr.querySelectorAll('.bsh .spph,.bsh .pbph,.shholdtip').forEach((e) => e.remove()); sr.querySelectorAll('.bsh .pdrop,.bsh .hold').forEach((e) => e.classList.remove('pdrop', 'hold')); } if (D) { clearTimeout(D.holdT); D.holdT = 0; D.key = null; } }
function shOrgMove(D, ev, under) {
  if (under && (under.classList.contains('spph') || under.classList.contains('pbph'))) return; // em cima da própria prévia: mantém
  const pile = under && under.closest('.bsh:not(.sm) .pile');
  let t = under && under.closest('.bsh:not(.sm) [data-bid]'); if (t === D.el) t = null;
  // 1) por cima de uma pilha (ou de um livro deitado): prévia deitada em cima da pilha
  if (pile) { const books = [...pile.querySelectorAll('[data-bid]')].filter((e) => e !== D.el); const top = books[books.length - 1];
    if (top) { const key = 'p:' + top.dataset.bid; if (D.key === key) return; shPrevClear(D); D.key = key;
      if (books.length >= 5) { D.tgt = { kind: 'pile', ref: top.dataset.bid, full: 1 }; pile.classList.add('pdrop'); shTip(ev, 'Pilha cheia: soltar começa outra'); return; }
      const ph = document.createElement('span'); ph.className = 'pbph'; ph.style.width = Math.round(books[0].getBoundingClientRect().width * 0.92) + 'px'; ph.style.height = Math.max(13, Math.min(24, Math.round((D.lay0 ? D.h0 : D.w0 * 0.8) || 18))) + 'px';
      pile.insertBefore(ph, books[0]); pile.classList.add('pdrop'); D.tgt = { kind: 'pile', ref: top.dataset.bid }; return; } }
  // 2) por cima de um livro em pé: perto das bordas insere ao lado; no meio, segurar 0,6 s empilha os dois
  if (t && !t.closest('.pile')) { const r = t.getBoundingClientRect(), rel = (ev.clientX - r.left) / Math.max(1, r.width), mid = rel > 0.3 && rel < 0.7;
    if (mid) { const key = 'm:' + t.dataset.bid; if (D.key === key) return; shPrevClear(D); D.key = key; D.tgt = { kind: 'between', ref: t.dataset.bid, after: rel >= 0.5 };
      t.classList.add('hold'); const pt = { clientX: ev.clientX, clientY: ev.clientY };
      D.holdT = setTimeout(() => { if (D.key !== key) return; D.tgt = { kind: 'stack', ref: t.dataset.bid }; shTip(pt, 'Soltar para empilhar'); try { navigator.vibrate && navigator.vibrate(12); } catch (e) {} }, 600); return; }
    const after = rel >= 0.5, key = 'b:' + t.dataset.bid + (after ? '>' : '<'); if (D.key === key) return; shPrevClear(D); D.key = key;
    shSlot(D, t, after); D.tgt = { kind: 'between', ref: t.dataset.bid, after }; return; }
  // 3) vão vazio da prateleira: encosta no último livro dela
  const bay = under && under.closest('.bsh:not(.sm) .bay'); const its = bay ? [...bay.querySelectorAll('.brow > [data-bid], .brow > .pile')].filter((e) => e !== D.el && e.style.display !== 'none') : [];
  if (its.length) { const last = its[its.length - 1], lb = last.matches('[data-bid]') ? last : [...last.querySelectorAll('[data-bid]')].filter((e) => e !== D.el).pop(); if (!lb) return; const key = 'e:' + lb.dataset.bid; if (D.key === key) return; shPrevClear(D); D.key = key;
    shSlot(D, last, true); D.tgt = { kind: 'between', ref: lb.dataset.bid, after: true, end: 1 }; return; }
  if (D.key !== 'none') { shPrevClear(D); D.key = 'none'; D.tgt = null; } }
function shSlot(D, el, after) { const ph = document.createElement('span'); ph.className = 'spph'; ph.style.width = (D.lay0 ? 18 : D.w0 || 18) + 'px'; ph.style.height = (D.lay0 ? Math.round((D.w0 || 120) * 0.95) : D.h0 || 130) + 'px'; el.parentNode.insertBefore(ph, after ? el.nextSibling : el); }
function shTip(ev, txt) { const sr = shBibRoot(), R = sr && sr.querySelector('.v5est'); if (!R) return; R.querySelector('.shholdtip')?.remove(); const tp = document.createElement('div'); tp.className = 'shholdtip'; tp.textContent = txt; tp.style.left = ev.clientX + 'px'; tp.style.top = ev.clientY - 30 + 'px'; R.appendChild(tp); }
function shOrgDrop(d) { const C0 = shc(), id = d.el.dataset.bid, t = d.tgt; C0.lay = C0.lay || {}; if (!t) return;
  // 1ª arrumação manual: as pilhas que a estante montou sozinha viram pilhas da pessoa (nada pula de lugar)
  if (!C0.manual) shFreezeAuto(d.el);
  if (t.kind === 'pile') { shMove(id, t.ref, true); C0.lay[id] = 1; if (C0.pos) delete C0.pos[id]; C0.manual = 1; shSave(); v5Redraw(); return toast(t.full ? 'Pilha cheia: começou outra pilha' : 'Livro deitado na pilha'); }
  if (t.kind === 'stack') { shMove(id, t.ref, true); C0.lay[id] = 1; C0.lay[t.ref] = 1; if (C0.pos) { delete C0.pos[id]; delete C0.pos[t.ref]; } C0.manual = 1; shSave(); v5Redraw(); return toast('Pilha nova com os dois livros'); }
  const was = !!C0.lay[id]; shMove(id, t.ref, t.after); delete C0.lay[id]; C0.manual = 1; shSave(); v5Redraw(); toast(was ? 'Livro de pé no novo lugar' : 'Livro no novo lugar'); }
// ----- arrastar (Organizar: livros; Decorar: enfeites) -----
let SHX_D = null, SHX_DW = 0;
function shDragArm(sr) {
  sr.addEventListener('pointerdown', (ev) => { const md = SHX_MODE; if (!md || ev.button > 0) return;
    const el = md === 'org' ? ev.target.closest('.bsh:not(.sm) [data-bid]') : ev.target.closest('.bsh .dec[data-dk]'); if (!el) return;
    if (md === 'org' && typeof SHX_PICK !== 'undefined' && SHX_PICK) return; // com um livro pego, o toque é para escolher o lugar
    if (ev.cancelable) ev.preventDefault(); // celular: não seleciona texto nem abre o menu de copiar
    SHX_D = { el, md, x: ev.clientX, y: ev.clientY, on: false, pid: ev.pointerId, tgt: null, vy: 0 }; }, true);
  sr.addEventListener('contextmenu', (ev) => { if (SHX_MODE && ev.target.closest && ev.target.closest('.bsh')) ev.preventDefault(); }, true);
  sr.addEventListener('selectstart', (ev) => { if (ev.target.closest && ev.target.closest('.bsh')) ev.preventDefault(); }, true);
  if (SHX_DW) return; SHX_DW = 1; let raf = 0;
  // ouvintes da janela uma vez só; a raiz é sempre a da Biblioteca aberta agora
  const SRn = () => shBibRoot(), R = () => { const x = SRn(); return x && x.querySelector('.v5est'); };
  const ind = () => R().querySelector('.shind') || R().appendChild(Object.assign(document.createElement('div'), { className: 'shind' }));
  const stop = () => { cancelAnimationFrame(raf); const x = SRn(); if (x) x.querySelectorAll('.shind,.shghostw').forEach((n) => n.remove()); if (SHX_D && SHX_D.el) { SHX_D.el.classList.remove('drg'); SHX_D.el.style.display = ''; } shPrevClear(SHX_D); };
  const loop = () => { const D = SHX_D; if (!D || !D.on) return; const sc = shScroller(); if (sc && D.vy) sc.scrollTop += D.vy; raf = requestAnimationFrame(loop); };
  window.addEventListener('pointermove', (ev) => { const D = SHX_D; if (!D || ev.pointerId !== D.pid || !D.el.isConnected || !R()) return; const dx = ev.clientX - D.x, dy = ev.clientY - D.y;
    if (!D.on) { if (Math.hypot(dx, dy) < 7) return; D.on = true; const Rb = D.el.getBoundingClientRect(); D.R = Rb; const g = D.el.cloneNode(true); g.className += ' shghost'; g.removeAttribute('data-bid'); g.removeAttribute('data-dk');
      g.style.left = Rb.left + 'px'; g.style.top = Rb.top + 'px'; g.style.width = Rb.width + 'px'; g.style.height = Rb.height + 'px'; const wrap = document.createElement('div'); wrap.className = D.el.closest('.bsh').className.replace(/(org|deco)/g, ''); wrap.style.cssText = 'position:fixed;inset:0;pointer-events:none;background:none;margin:0;padding:0;z-index:9999'; wrap.appendChild(g); wrap.classList.add('shghostw');
      R().appendChild(wrap); D.g = g; D.el.classList.add('drg'); if (D.md === 'org') { D.lay0 = !!D.el.closest('.pile'); D.w0 = Math.round(Rb.width); D.h0 = Math.round(Rb.height); D.el.style.display = 'none'; } raf = requestAnimationFrame(loop); try { navigator.vibrate && navigator.vibrate(8); } catch (e) {} }
    ev.preventDefault(); D.g.style.left = D.R.left + dx + 'px'; D.g.style.top = D.R.top + dy + 'px';
    const sc = shScroller(), SR = sc && sc !== document.scrollingElement && sc !== document.documentElement ? sc.getBoundingClientRect() : { top: 0, bottom: innerHeight }; D.vy = ev.clientY < SR.top + 70 ? -10 : ev.clientY > SR.bottom - 90 ? 10 : 0;
    const under = SRn().elementFromPoint(ev.clientX, ev.clientY), I = ind();
    if (D.md === 'org') { I.style.display = 'none'; shOrgMove(D, ev, under); }
    else { const bay = under && under.closest('.bsh:not(.sm) .bay'); if (bay) { const br = bay.querySelector('.brow'), kids = [...br.children].filter((c) => !c.classList.contains('dec') && !c.classList.contains('ghost')), p = kids.filter((c) => { const r = c.getBoundingClientRect(); return r.left + r.width / 2 < ev.clientX; }).length, R2 = bay.getBoundingClientRect();
        D.tgt = { r: +bay.dataset.r, p }; I.style.left = Math.max(R2.left + 2, Math.min(R2.right - 4, ev.clientX)) + 'px'; I.style.top = R2.top + 8 + 'px'; I.style.height = R2.height - 10 + 'px'; I.style.display = 'block'; } else { D.tgt = null; I.style.display = 'none'; } } }, { passive: false });
  const end = (ev) => { const D = SHX_D; if (!D || (ev && ev.pointerId !== D.pid)) return; const d = D; stop(); SHX_D = null; if (!d.on) return; SHX_JD = 1; setTimeout(() => { SHX_JD = 0; }, 350);
    if (!d.tgt) return; const C0 = shc();
    if (d.md === 'org') { shOrgDrop(d); }
    else { const i = +d.el.dataset.dk, others = C0.deco.filter((x, j) => j !== i && x.r === d.tgt.r).length; if (others >= 2) return toast('Essa prateleira já tem dois enfeites');
      C0.deco[i] = { ...C0.deco[i], r: d.tgt.r, p: d.tgt.p }; shSave(); v5Redraw(); } };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true); }
