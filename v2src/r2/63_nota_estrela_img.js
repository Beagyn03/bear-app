// Marca-página da nota com as estrelas desenhadas (Bia, 17/11): fita + estrela por nível (5 arco-íris, 4–4,5 ouro, 3–3,5 prata,
// abaixo bronze); a nota continua escrita pelo app no miolo da estrela. Vale na Biblioteca (.mk-bear) e em Leituras por mês (.ys-mk).
{ const st = document.createElement('style'); st.textContent = `
.mk-bear,.ys-mk{width:34px!important;height:56px!important;top:-12px!important;left:4px!important;background:var(--nimg) center bottom/contain no-repeat!important;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))!important}
#shelflist .esv-grid > .es-bk > .mk-bear{top:-26px!important}
.mk-bear::before,.ys-mk::before,.mk-bear b::before,.mk-bear b::after,.ys-mk b::before,.ys-mk b::after{display:none!important}
.mk-bear b,.ys-mk b{clip-path:none!important;background:none!important;animation:none!important;position:absolute!important;left:0!important;right:0!important;top:68%!important;bottom:auto!important;width:auto!important;height:auto!important;padding:0!important;transform:translateY(-50%);font:900 9.5px/1 Nunito,system-ui,sans-serif!important;letter-spacing:-.3px;text-align:center;color:#3a2410!important;text-shadow:0 0 2px rgba(255,255,255,.9),0 0 1px rgba(255,255,255,.9)!important}
.mk-bear.t-5,.ys-bk.ys-5 .ys-mk{--nimg:url("img/nota_5.webp");filter:drop-shadow(0 0 4px rgba(255,190,90,.75)) drop-shadow(0 1px 1.5px rgba(0,0,0,.3))!important}
.mk-bear.t-ouro,.ys-bk.ys-ouro .ys-mk{--nimg:url("img/nota_ouro.webp")}
.mk-bear.t-prata,.ys-bk.ys-prata .ys-mk{--nimg:url("img/nota_prata.webp")}
.mk-bear.t-bronze,.ys-bk.ys-bronze .ys-mk{--nimg:url("img/nota_bronze.webp")}
`; TR.append(st); }
