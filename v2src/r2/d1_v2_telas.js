// v2 etapa 3 (19/11, branch livroverso-2): telas internas no padrão novo.
//  Metas, Estatísticas, Conquistas, Órbita, Trechos, Histórico de leituras, Presentes, Resumo, Notificações, conversa,
//  Ajustes/Editar perfil, estados vazios, carregando, aviso (toast) e popup de instalar.
//  Só visual: classes que já existem ganham o cartão, a serifa, as pílulas e os botões do c0/c6.
{ const st = document.createElement('style'); st.textContent = `
/* ---------- cabeçalho das páginas internas ---------- */
#shelflist .sl-top{gap:.6rem!important;margin-bottom:.8rem!important}
#shelflist .sl-top .sl-back{width:40px!important;height:40px!important;border-radius:50%!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important}
#shelflist .sl-body > h2,#shelflist .sl-body h3:not(.v2-keep){font-family:var(--v2-disp)!important;letter-spacing:0!important}
/* ---------- estados vazios: um cartão suave com estrela, sem tracejado ---------- */
#shelflist .sl-empty,.nt-empty,.rd-empty,.sx-empty,.yx-empty,#shelflist .mt-empty{position:relative;border:1px solid var(--line)!important;border-style:solid!important;border-radius:var(--v2-r,20px)!important;background:color-mix(in srgb,var(--acc) 5%,var(--panel))!important;
  padding:2.6rem 1.2rem 1.3rem!important;text-align:center!important;color:var(--ink-2)!important;font-size:.88rem!important;font-weight:700!important;line-height:1.45!important;box-shadow:var(--v2-sh)}
#shelflist .sl-empty::before,.nt-empty::before,.rd-empty::before,.sx-empty::before,.yx-empty::before{content:"";position:absolute;left:50%;top:.9rem;width:22px;height:22px;margin-left:-11px;opacity:.85;
  background:var(--acc);-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2c1 5.2 2.8 7 8 8-5.2 1-7 2.8-8 8-1-5.2-2.8-7-8-8 5.2-1 7-2.8 8-8z'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2c1 5.2 2.8 7 8 8-5.2 1-7 2.8-8 8-1-5.2-2.8-7-8-8 5.2-1 7-2.8 8-8z'/%3E%3C/svg%3E") center/contain no-repeat}
#shelflist div[style*="dashed"],#shelflist .gf-empty,#shelflist .mt-none{border-style:solid!important}
/* carregando */
#shelflist p.sl-empty:only-child{min-height:0}
/* ---------- botões soltos das telas internas ---------- */
.fl-add,.mt-btns button,.nt-all,.st-see,#shelflist .bt-ghost{border-radius:999px!important;font-weight:900!important}
.fl-add{border:1.5px dashed color-mix(in srgb,var(--acc) 55%,var(--line))!important;background:color-mix(in srgb,var(--acc) 6%,var(--panel))!important;color:var(--acc)!important;min-height:44px}
.mt-btns button.pri,#shelflist .pri:not(.v2-keep){background:var(--v2-pri)!important;border-color:transparent!important;color:var(--on-acc,#fff)!important;box-shadow:var(--v2-pri-sh)!important}
#shelflist select,label.ach-f select{border-radius:14px!important;border:1px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;font:inherit!important;font-weight:800!important;min-height:42px;padding:0 .8rem!important}
label.ach-f{display:flex!important;align-items:center;gap:.6rem;font-weight:900!important;font-size:.72rem!important;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)!important}
#shelflist input[type=checkbox],#editor input[type=checkbox]{accent-color:var(--acc);width:18px;height:18px;vertical-align:-3px}
/* ---------- Metas ---------- */
.mt-y{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important;padding:1rem 1.05rem!important}
.mt-y h3{font-family:var(--v2-disp)!important;font-size:1.1rem!important}
.mt-y .mt-big{font-family:var(--v2-disp)!important;color:var(--acc)}
.mt-y i.mt-bar{height:10px!important;border-radius:99px!important}
.mt-y i.mt-bar > i{border-radius:99px!important;background:var(--v2-pri)!important}
.mt-h{font-family:var(--v2-disp)!important;font-size:1.12rem!important;font-weight:700!important;margin:1.2rem .1rem .55rem!important}
/* ---------- Estatísticas (mesma paleta do app nos gráficos) ---------- */
.sx-c,.sx-sum > *,.sx-pies > *{border-radius:var(--v2-r,20px)!important}
.sx-c h3,.sx-pies h3,.sx-c > b{font-family:var(--v2-disp)!important;font-size:1.05rem!important;font-weight:700!important;letter-spacing:0!important}
.sx-sum .pg-st{border-radius:18px!important;box-shadow:var(--v2-sh)!important}
.sx-sum .pg-st b{font-family:var(--v2-disp)!important;font-size:1.7rem!important;color:var(--acc)!important}
.sx-bars i{border-radius:6px 6px 3px 3px!important;background:var(--v2-pri)!important}
.sx-bars i.s{background:color-mix(in srgb,var(--acc) 26%,var(--panel))!important}
.sx-row .tr{height:10px!important}.sx-row .tr i:not(.m5){background:var(--v2-pri)!important;border-radius:99px}
.sx-yr button,.yx-yr button{box-shadow:var(--v2-sh)}
/* ---------- Conquistas ---------- */
.ach-grid{gap:.6rem!important}
.ach-cell{border-radius:18px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important;transition:transform .15s}
.ach-cell:active{transform:scale(.97)}
.ach-cell.locked{background:color-mix(in srgb,var(--ink) 3%,var(--panel))!important}
.ach-cell b{font-family:var(--v2-disp)!important;font-weight:700!important}
.ach-pg button{border-radius:50%!important;box-shadow:var(--v2-sh)}
/* ---------- Órbita ---------- */
.orb-hero,.ob-hero,.orb-cal,.ob-cal{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important}
.orb-hero b,.ob-hero b{font-family:var(--v2-disp)!important}
/* ---------- Trechos / Histórico ---------- */
.qt-card,.qa-card,.qb-card,.aq-bk,.aq-it,.hq-card,.fx-card{border-radius:18px!important;box-shadow:var(--v2-sh)!important}
.aq-bk b,.qt-card b{font-family:var(--v2-disp)!important}
#shelflist .hist-help,#shelflist .hi-help{border-radius:18px!important}
/* ---------- Notificações ---------- */
.nt-list{display:grid;gap:.5rem}
.nt-list > *:not(.nt-sec){border-radius:16px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)}
.nt-sec{color:var(--acc)!important;letter-spacing:.1em!important;margin-top:1rem!important}
.nt-fd{border-radius:16px!important;box-shadow:var(--v2-sh)}
/* ---------- conversa ---------- */
.cht{gap:.45rem!important}
.bub{border-radius:20px!important;padding:.6rem .85rem!important;box-shadow:0 2px 8px rgba(40,20,0,.06)}
.bub.me{background:var(--v2-pri)!important;border-bottom-right-radius:6px!important}
.bub.ot{border-bottom-left-radius:6px!important}
.cht-day{background:color-mix(in srgb,var(--ink) 6%,transparent);padding:.15rem .6rem;border-radius:99px}
.cht-in{border-top:1px solid var(--line)!important;padding:.6rem .8rem!important;box-shadow:0 -8px 20px rgba(30,15,0,.06)}
.cht-in textarea{border-radius:22px!important;padding:.65rem 1rem!important;background:var(--panel)!important}
.cht-in button.send{border-radius:22px!important;background:var(--v2-pri)!important;box-shadow:var(--v2-pri-sh)}
.cht-bk{border-radius:99px!important}
.th-row{border-radius:18px!important;box-shadow:var(--v2-sh)!important}
/* ---------- Ajustes e Editar perfil ---------- */
.aj-sec,.set-sec,.cfg-sec,.pf-sec,.aj-card,.pf-group{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important;border:1px solid var(--line)!important;background:var(--panel)!important}
.aj-g,.aj-h,.set-h,.cfg-h,.pf-h,.pf-lb{color:var(--acc)!important;letter-spacing:.1em!important}
/* ---------- aviso rápido e popup de instalar ---------- */
.toast{border-radius:16px!important;box-shadow:0 12px 30px rgba(20,10,0,.28)!important;font-weight:800!important;padding:.75rem 1rem!important}
.inst-pop{border-radius:22px!important;background:linear-gradient(135deg,#2a1f4a,#4a3585)!important;box-shadow:0 18px 40px rgba(20,10,40,.4)!important}
.inst-pop b{font-family:Georgia,'Times New Roman',serif!important;font-size:1.05rem!important}
.inst-pop .inst-yes{background:linear-gradient(135deg,#ffd6a3,#e0ad3a)!important;color:#2a1505!important}
`; TR.append(st);
  // toast e popup de instalar moram fora da tela principal (document.body)
  const out = document.createElement('style'); out.textContent = `
.inst-pop{border-radius:22px!important;background:linear-gradient(135deg,#2a1f4a,#4a3585)!important;box-shadow:0 18px 40px rgba(20,10,40,.4)!important}
.inst-pop b{font-family:Georgia,'Times New Roman',serif!important;font-size:1.05rem!important}
.inst-pop .inst-yes{background:linear-gradient(135deg,#ffd6a3,#e0ad3a)!important;color:#2a1505!important}
.toast{border-radius:16px!important;box-shadow:0 12px 30px rgba(20,10,0,.28)!important;font-weight:800!important}
`; document.head.append(out); }
{ const st = document.createElement('style'); st.textContent = `
.aj-row{min-height:56px!important;padding:.7rem 1rem!important}
.aj-row b{font-weight:800!important}
.aj-row:active{background:color-mix(in srgb,var(--acc) 8%,var(--panel))!important}
.aj-me{background:var(--panel);border:1px solid var(--line);border-radius:var(--v2-r,20px);padding:.9rem 1rem;box-shadow:var(--v2-sh)}
.aj-me b{font-family:var(--v2-disp)!important;font-size:1.2rem!important}
.aj-av{box-shadow:0 0 0 3px var(--panel),0 0 0 5.5px color-mix(in srgb,var(--acc) 60%,#e45f9b)}
`; TR.append(st); }
