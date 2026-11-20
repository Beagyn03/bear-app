// Ajustes da Bia (15/11 e 16/11): a faixa da nota nas Leituras por mês vira barrinha arredondada EM CIMA do livro (fora da capa, sobre a parte visível da lombada);
// só 5 patas e ouro brilham (prata, bronze e ferro ficam quietos); o reflexo tem a cor da nota (dourado no ouro, furta-cor no 5).
{ const st = document.createElement('style'); st.textContent = `
.ys-bk.paw::before{top:-9px!important;left:4px!important;right:auto!important;width:36px!important;height:4px!important;border-radius:99px!important;z-index:3!important;box-shadow:0 0 0 1px rgba(255,255,255,.5)!important}
.ys-g{gap:1rem!important}
.ys-bk.ys-5::before{box-shadow:0 0 0 1px rgba(255,255,255,.55),0 0 6px rgba(255,190,90,.9)!important}
.ys-bk.ys-ouro::before{box-shadow:0 0 0 1px rgba(255,255,255,.5),0 0 5px rgba(212,165,32,.8)!important}
.ys-bk.ys-prata::before,.ys-bk.ys-bronze::before,.ys-bk.ys-ferro::before{animation:none!important}
.ys-bk.ys-prata::after,.cv.rt-prata::before{content:none!important;animation:none!important}
.ys-bk.ys-prata .cv,.cv.rt-prata{box-shadow:0 0 0 1.5px #b9c1c8!important}
.ys-bk.ys-5::after,.cv.rt-5::before{background-image:linear-gradient(115deg,transparent 34%,rgba(255,214,110,.55) 44%,rgba(255,150,210,.5) 50%,rgba(150,200,255,.5) 56%,transparent 66%)!important;background-size:250% 100%!important}
.ys-bk.ys-ouro::after,.cv.rt-ouro::before{background-image:linear-gradient(115deg,transparent 40%,rgba(255,210,80,.55) 50%,transparent 60%)!important;background-size:250% 100%!important}
`; TR.append(st); }
// Bia (16/11): o 5 continua furta-cor, com brilho e estrelinhas; 4,5 ouro, 4 prata, 3 a 3,5 bronze e abaixo de 3 ferro, metalizados (brilho em cima, sombra embaixo, reflexo devagar).
// A barrinha fica colada no topo da capa, na largura toda (o livro seguinte cobre a ponta, como cobre a capa).
{ const st = document.createElement('style'); st.textContent = `
.ys-bk{--nb:var(--line)}
.ys-bk.ys-ouro{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#8a6210,#e9c45a 18%,#fff3b8 30%,#c9971c 45%,#f7dc6f 62%,#9c7314 80%,#e9c45a)}
.ys-bk.ys-prata{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#6f7880,#cfd6dc 18%,#ffffff 30%,#9aa3ab 45%,#e9eef2 62%,#7c858d 80%,#cfd6dc)}
.ys-bk.ys-bronze{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#6b3a14,#c98448 18%,#f3c08e 30%,#94562a 45%,#d99a62 62%,#74401a 80%,#c98448)}
.ys-bk.ys-ferro{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#3a3f45,#7d848b 25%,#b4bac0 35%,#5a6067 55%,#8a9096 75%,#3a3f45)}
.ys-bk.paw::before{top:-5px!important;left:0!important;right:0!important;width:auto!important;height:5px!important;border-radius:3px 3px 0 0!important;background:var(--nb)!important;background-size:100% 100%,220% 100%!important;box-shadow:0 1px 2px rgba(0,0,0,.35)!important;animation:ysMetal 6s ease-in-out infinite!important}
.ys-bk.ys-prata::before{animation-delay:-2s!important}.ys-bk.ys-bronze::before{animation-delay:-4s!important}.ys-bk.ys-ferro::before{animation:none!important}
@keyframes ysMetal{0%,100%{background-position:0 0,0% 0}50%{background-position:0 0,100% 0}}
.ys-bk.ys-5::before{top:-5px!important;height:5px!important;background:linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff,#f6c94a)!important;background-size:300% 100%!important;animation:ys5Flow 3s linear infinite!important;box-shadow:0 0 6px rgba(255,190,90,.9)!important}
.ys-bk.ys-ouro::after,.ys-bk.ys-prata::after{content:""!important;position:absolute;inset:0;z-index:2;pointer-events:none;background-image:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.5) 50%,transparent 62%)!important;background-size:250% 100%!important;animation:ys5Shine 4.5s ease-in-out infinite!important;border-radius:2px 4px 0 0}
.ys-bk.ys-prata::after{animation-delay:-1.5s!important}
.ys-bk.ys-ouro .cv{box-shadow:0 0 0 1.5px #d4a520,0 0 7px rgba(212,165,32,.4)!important}.ys-bk.ys-prata .cv{box-shadow:0 0 0 1.5px #b9c1c8,0 0 6px rgba(185,193,200,.45)!important}.ys-bk.ys-bronze .cv{box-shadow:inset -2px 0 3px rgba(0,0,0,.25)!important}
.ys-bk + .ys-bk.ys-bronze .cv{box-shadow:-4px 0 6px -2px rgba(0,0,0,.45),inset -2px 0 3px rgba(0,0,0,.25)!important}
.ys-g{gap:.75rem!important}
.ys-leg i.ys-mi,.ys-leg i.ys-mi.ouro,.ys-leg i.ys-mi.prata,.ys-leg i.ys-mi.bronze,.ys-leg i.ys-mi.ferro{background:var(--nb)!important;box-shadow:none!important}
.ys-leg i.ys-mi.n5{background:linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff)!important;box-shadow:0 0 4px rgba(246,201,74,.8)!important}
.ys-leg i.ys-mi.ouro{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#8a6210,#e9c45a 18%,#fff3b8 30%,#c9971c 45%,#f7dc6f 62%,#9c7314 80%,#e9c45a)}.ys-leg i.ys-mi.prata{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#6f7880,#cfd6dc 18%,#ffffff 30%,#9aa3ab 45%,#e9eef2 62%,#7c858d 80%,#cfd6dc)}.ys-leg i.ys-mi.bronze{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#6b3a14,#c98448 18%,#f3c08e 30%,#94562a 45%,#d99a62 62%,#74401a 80%,#c98448)}.ys-leg i.ys-mi.ferro{--nb:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.28)),linear-gradient(90deg,#3a3f45,#7d848b 25%,#b4bac0 35%,#5a6067 55%,#8a9096 75%,#3a3f45)}
.ys-leg .ys-lt{font-weight:800;color:var(--ink)}
.ys-bk.ys-5::after{content:""!important;position:absolute;inset:0;z-index:2;pointer-events:none;background-image:linear-gradient(115deg,transparent 35%,rgba(255,255,255,.6) 50%,transparent 65%)!important;background-size:250% 100%!important;animation:ys5Shine 3.2s ease-in-out infinite!important;border-radius:2px 4px 0 0}
@media (prefers-reduced-motion:reduce){.ys-bk.ys-5::before,.ys-bk.ys-5::after,.ys-bk.paw::before,.ys-bk.ys-ouro::after,.ys-bk.ys-prata::after{animation:none!important}}
`; TR.append(st); }
// Marca-página em estrela (16/11; urso trocado por estrela em 17/11): fitinha saindo do topo da capa e estrela com a nota, na cor da faixa (5 furta-cor, ouro, prata, bronze).
{ const st = document.createElement('style'); st.textContent = `
.ys-bk.paw::before{display:none!important}
.ys-mk{position:absolute;top:-6px;left:6px;width:26px;height:42px;z-index:5;pointer-events:none;filter:drop-shadow(0 1.5px 1.5px rgba(0,0,0,.4))}
.ys-mk::before{content:"";position:absolute;left:11px;top:0;width:4px;height:22px;background:var(--mk);background-size:100% 100%,220% 100%;clip-path:polygon(0 0,100% 0,100% 100%,0 100%)}
.ys-mk b{position:absolute;left:0;bottom:0;width:26px;height:25px;clip-path:polygon(50% 0%,62% 34%,98% 36%,69% 58%,80% 94%,50% 73%,20% 94%,31% 58%,2% 36%,38% 34%);padding-top:3px;box-sizing:border-box;background:var(--mk);background-size:100% 100%,220% 100%;font:900 8.5px/19px Nunito,system-ui,sans-serif;letter-spacing:-.2px;text-align:center;color:var(--mkt,#2b2018);text-shadow:0 1px 0 rgba(255,255,255,.35)}
.ys-mk b::before,.ys-mk b::after{display:none;content:"";position:absolute;top:-3px;width:8px;height:8px;border-radius:50%;background:var(--mk);background-size:100% 100%,220% 100%;z-index:-1}
.ys-mk b::before{left:0}.ys-mk b::after{right:0}
.ys-bk.ys-ouro .ys-mk{--mk:linear-gradient(180deg,rgba(255,255,255,.5),rgba(255,255,255,0) 55%,rgba(0,0,0,.2)),linear-gradient(90deg,#9c7314,#e9c45a 25%,#fff3b8 40%,#c9971c 60%,#f7dc6f 80%,#9c7314)}
.ys-bk.ys-prata .ys-mk{--mk:linear-gradient(180deg,rgba(255,255,255,.55),rgba(255,255,255,0) 55%,rgba(0,0,0,.2)),linear-gradient(90deg,#7c858d,#cfd6dc 25%,#ffffff 40%,#9aa3ab 60%,#e9eef2 80%,#7c858d)}
.ys-bk.ys-bronze .ys-mk{--mk:linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,0) 55%,rgba(0,0,0,.25)),linear-gradient(90deg,#74401a,#c98448 25%,#f3c08e 40%,#94562a 60%,#d99a62 80%,#74401a);--mkt:#fff8ef}
.ys-bk.ys-bronze .ys-mk b{text-shadow:0 1px 1px rgba(0,0,0,.45)}
.ys-bk.ys-5 .ys-mk{--mk:linear-gradient(180deg,rgba(255,255,255,.35),rgba(255,255,255,0) 60%),linear-gradient(90deg,#f6c94a,#ff8fc8,#b78cff,#6fd3ff,#f6c94a);--mkt:#fff;filter:drop-shadow(0 0 4px rgba(255,190,90,.9)) drop-shadow(0 1.5px 1.5px rgba(0,0,0,.35))}
.ys-bk.ys-5 .ys-mk b{text-shadow:0 1px 2px rgba(80,30,90,.7)}
.ys-bk.ys-5 .ys-mk::before,.ys-bk.ys-5 .ys-mk b,.ys-bk.ys-5 .ys-mk b::before,.ys-bk.ys-5 .ys-mk b::after{animation:ysMkFlow 3s linear infinite}
@keyframes ysMkFlow{to{background-position:0 0,220% 0}}
.ys-row{padding-top:14px!important}.ys-g{gap:.85rem!important}
.ys-bk .ys-sp.a{top:-12px!important;right:-3px!important}
@media (prefers-reduced-motion:reduce){.ys-bk.ys-5 .ys-mk *,.ys-bk.ys-5 .ys-mk::before{animation:none!important}}
`; TR.append(st); }
// Reflexo no 5 (furta-cor) e no ouro, notas 4 e 4,5 (dourado); prata e bronze sem reflexo (16/11)
{ const st = document.createElement('style'); st.textContent = `
.ys-bk.ys-prata::after,.ys-bk.ys-bronze::after,.cv.rt-prata::before,.cv.rt-bronze::before{content:none!important;animation:none!important}
.ys-bk.ys-ouro::after{content:""!important;position:absolute;inset:0;z-index:2;pointer-events:none;border-radius:2px 4px 0 0;animation:ys5Shine 4.5s ease-in-out infinite!important}
.ys-bk.ys-ouro::after,.cv.rt-ouro::before{background-image:linear-gradient(115deg,transparent 38%,rgba(255,214,90,.6) 50%,transparent 62%)!important;background-size:250% 100%!important}
.ys-bk.ys-5::after,.cv.rt-5::before{background-image:linear-gradient(115deg,transparent 34%,rgba(255,214,110,.6) 44%,rgba(255,150,210,.55) 50%,rgba(150,200,255,.55) 56%,transparent 66%)!important;background-size:250% 100%!important}
`; TR.append(st); }
