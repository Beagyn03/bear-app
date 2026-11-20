// Leituras por mês: livro de 5 patas ganha destaque próprio — faixa furta-cor que brilha e estrelinhas piscando em cima da capa.
{ const st = document.createElement('style'); st.textContent = `
.ys-bk.ys-5::before{height:5px!important;background:linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff,#f6c94a)!important;background-size:300% 100%!important;animation:ys5Flow 3s linear infinite;box-shadow:0 0 6px rgba(255,190,90,.9)}
.ys-bk.ys-5 .cv{box-shadow:0 0 0 1.5px #f6c94a,0 0 10px 1px rgba(246,201,74,.55)!important}
.ys-bk.ys-5::after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);background-size:250% 100%;animation:ys5Shine 3.2s ease-in-out infinite;border-radius:2px 4px 0 0}
.ys-bk .ys-sp{position:absolute;z-index:4;pointer-events:none;color:#ffd75e;font-size:11px;line-height:1;text-shadow:0 0 4px rgba(255,215,94,.95);animation:ys5Tw 1.8s ease-in-out infinite}
.ys-bk ..ys-bk .ys-sp.b{top:-4px;left:-4px;font-size:8px;animation-delay:.6s;color:#ffb3dc}.ys-bk .ys-sp.c{top:18px;right:-5px;font-size:7px;animation-delay:1.2s;color:#cfe9ff}
.ys-row{padding-top:12px!important}.ys-bk .ys-sp.a{top:-11px;right:-4px}
@keyframes ys5Flow{to{background-position:300% 0}}
@keyframes ys5Shine{0%,55%{background-position:150% 0}100%{background-position:-100% 0}}
@keyframes ys5Tw{0%,100%{opacity:.15;transform:scale(.6) rotate(0)}50%{opacity:1;transform:scale(1.15) rotate(20deg)}}
.ys-leg i.ys-5i{background:linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff)!important;box-shadow:0 0 4px rgba(246,201,74,.8)}
.ys-leg .ys-5l{font-weight:800;color:var(--ink)}.ys-leg .ys-5l::after{content:' ✦';color:#e0a526}
@media (prefers-reduced-motion:reduce){.ys-bk.ys-5::before,.ys-bk.ys-5::after,.ys-bk .ys-sp{animation:none}.ys-bk .ys-sp{opacity:.9}}
`; TR.append(st); }
{ const _ys = yearShelfHTML; yearShelfHTML = function () {
  const h = _ys.apply(this, arguments); if (!h) return h;
  return h.replace(/(class="es-bk ys-bk paw ys-5"[^>]*>)/g, '$1<span class="ys-sp a">✦</span><span class="ys-sp b">✦</span><span class="ys-sp c">✦</span>')
    .replace(/<div class="ys-leg">[\s\S]*?<\/div>/, '<div class="ys-leg"><span class="ys-lt">Nota</span><span class="ys-5l"><i class="ys-mi n5"></i>5</span><span><i class="ys-mi ouro"></i>4 e 4,5</span><span><i class="ys-mi prata"></i>3 e 3,5</span><span><i class="ys-mi bronze"></i>menos de 3</span></div>');
}; }
// Medalhas abaixo do 5 (escolha da Bia, 15/11): ouro 4,5 · prata 4 · bronze 3 a 3,5 · ferro abaixo de 3.
// Faixa metálica no topo; ouro e prata com contorno e reflexo lento, bronze só contorno leve, ferro discreto.
{ const st = document.createElement('style'); st.textContent = `
.ys-bk.ys-ouro{--m:linear-gradient(90deg,#a87a12,#f7dc6f,#c9971c,#fff1a8,#a87a12);--mc:rgba(212,165,32,.8)}
.ys-bk.ys-prata{--m:linear-gradient(90deg,#8d959c,#eef2f5,#a9b1b8,#ffffff,#8d959c);--mc:rgba(170,180,190,.85)}
.ys-bk.ys-bronze{--m:linear-gradient(90deg,#7a4419,#d9935a,#9a5a26,#e8b07c,#7a4419);--mc:rgba(170,100,45,.7)}
.ys-bk.ys-ferro{--m:linear-gradient(90deg,#3d4146,#8a9096,#4d5257,#9aa0a6,#3d4146);--mc:rgba(80,86,92,.6)}
.ys-bk:is(.ys-ouro,.ys-prata,.ys-bronze,.ys-ferro)::before{height:5px!important;background:var(--m)!important;background-size:200% 100%!important}
.ys-bk:is(.ys-ouro,.ys-prata)::before{animation:ys5Flow 5s linear infinite;box-shadow:0 0 5px var(--mc)}
.ys-bk.ys-ouro .cv{box-shadow:0 0 0 1.5px #d4a520,0 0 7px rgba(212,165,32,.4)!important}
.ys-bk.ys-prata .cv{box-shadow:0 0 0 1.5px #b9c1c8,0 0 6px rgba(185,193,200,.45)!important}
.ys-bk.ys-bronze .cv{box-shadow:0 0 0 1px rgba(170,100,45,.75)!important}
.ys-bk:is(.ys-ouro,.ys-prata)::after{content:'';position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.32) 50%,transparent 60%);background-size:250% 100%;animation:ys5Shine 5.5s ease-in-out infinite;border-radius:2px 4px 0 0}
.ys-bk.ys-prata::after{animation-delay:1.5s}
.ys-leg i.ys-mi.ouro{background:linear-gradient(90deg,#a87a12,#f7dc6f,#c9971c)!important}
.ys-leg i.ys-mi.prata{background:linear-gradient(90deg,#8d959c,#eef2f5,#a9b1b8)!important}
.ys-leg i.ys-mi.bronze{background:linear-gradient(90deg,#7a4419,#d9935a,#9a5a26)!important}
.ys-leg i.ys-mi.ferro{background:linear-gradient(90deg,#3d4146,#8a9096,#4d5257)!important}
.ys-leg{gap:.2rem .55rem!important;font-size:.64rem!important}
@media (prefers-reduced-motion:reduce){.ys-bk:is(.ys-ouro,.ys-prata)::before,.ys-bk:is(.ys-ouro,.ys-prata)::after{animation:none}}
`; TR.append(st); }
