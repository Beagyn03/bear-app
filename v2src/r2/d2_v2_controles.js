// v2 etapa 3 (19/11, branch livroverso-2): controles e Comunidade no padrão novo.
//  - Caixas de marcar e opções redondas desenhadas pelo app (antes: quadrado escuro do navegador e rádio roxo).
//  - Botão principal em degradê também nos formulários antigos (Criar meta, Salvar das folhas antigas).
//  - Comunidade: filtros em pílula no acento, posts em cartão do padrão, conversa da leitura conjunta e respostas.
{ const CHK = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12.5l4.5 4.5L19 7.5'/%3E%3C/svg%3E\")";
  const css = `
input[type=checkbox]:not(.v2-raw){-webkit-appearance:none;appearance:none;width:22px!important;height:22px!important;flex:none;margin:0;border:2px solid color-mix(in srgb,var(--ink) 28%,var(--line));border-radius:7px;background:var(--panel);display:inline-grid;place-items:center;cursor:pointer;vertical-align:-5px;transition:background .15s,border-color .15s}
input[type=checkbox]:not(.v2-raw):checked{background:var(--acc) ${CHK} center/15px no-repeat;border-color:var(--acc)}
input[type=checkbox]:not(.v2-raw):focus-visible,input[type=radio]:focus-visible{outline:3px solid color-mix(in srgb,var(--acc) 35%,transparent);outline-offset:2px}
input[type=radio]{-webkit-appearance:none;appearance:none;width:22px!important;height:22px!important;flex:none;margin:0;border:2px solid color-mix(in srgb,var(--ink) 28%,var(--line));border-radius:50%;background:var(--panel);cursor:pointer;vertical-align:-5px;transition:box-shadow .15s,border-color .15s}
input[type=radio]:checked{border-color:var(--acc);box-shadow:inset 0 0 0 4.5px var(--panel),inset 0 0 0 12px var(--acc)}
/* formulários antigos: botão principal e campos */
button.primary,.nm-ok,.row.end button.pri,#shelflist form button[type=submit],#editor form button[type=submit]{background:var(--v2-pri)!important;border:0!important;color:var(--on-acc,#fff)!important;border-radius:16px!important;box-shadow:var(--v2-pri-sh)!important;font-weight:900!important;min-height:48px}
.row.end button:not(.pri),#pz-cancel,#es-cancel,#es-bcancel{border-radius:16px!important;font-weight:800!important}
#shelflist form input:not([type=checkbox]):not([type=radio]):not([type=range]),#shelflist form select,#shelflist form textarea{border-radius:14px!important;border:1px solid var(--line)!important;background:var(--panel)!important;color:var(--ink)!important;min-height:46px}
#shelflist form input:focus,#shelflist form textarea:focus,#shelflist form select:focus{outline:0!important;border-color:var(--acc)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 22%,transparent)!important}
#shelflist form label,#shelflist form .lb{font-weight:800!important;color:var(--ink-2)!important;font-size:.8rem!important}
/* ---------- Comunidade ---------- */
.rd-fl{gap:.4rem!important;padding:.1rem 0 .2rem}
.rd-fl button{border-radius:99px!important;min-height:36px!important;padding:0 1rem!important;font-weight:800!important;background:var(--panel)!important;border:1px solid var(--line)!important;color:var(--ink-2)!important}
.rd-fl button.on{background:var(--v2-pri)!important;border-color:transparent!important;color:var(--on-acc,#fff)!important;box-shadow:var(--v2-pri-sh)}
.rd-day{font-family:var(--v2-disp)!important;font-size:1rem!important;letter-spacing:0!important;text-transform:none!important;color:var(--ink)!important;font-weight:700!important;margin:1.1rem .15rem .5rem!important}
.rd-card{padding:.95rem 1rem!important;margin-bottom:.75rem!important}
.rd-card .rd-who b{font-weight:900}
.rd-card .rd-book b,.rd-card .rd-book .t{font-family:var(--v2-disp)!important}
.rd-card .rd-q,.rd-card blockquote{border-radius:14px!important;background:color-mix(in srgb,var(--acc) 6%,var(--bg))!important;border:0!important}
.rd-tag,.rd-kind{border-radius:99px!important;font-weight:900!important}
.rd-like,.rd-save,.rd-share,.rd-rp{border-radius:99px!important}
.rd-veil{border-radius:16px!important;backdrop-filter:blur(8px)}
.rd-new,.rdc,.rdc2{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important}
.rdc2-tools button,.rdc2-tags button,.rdc-chips button{border-radius:99px!important;font-weight:800!important}
.rd-form{border-top:1px solid var(--line)!important;box-shadow:0 -8px 20px rgba(30,15,0,.05)}
.rd-form textarea{border-radius:18px!important}
.rd-send{border-radius:16px!important;background:var(--v2-pri)!important;color:var(--on-acc,#fff)!important;border:0!important}
.rd-seg{border-radius:99px!important}
/* leitura conjunta */
.bud-card,.bud-top,.bd-card,.bd-prog{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important}
.bud-card b,.bd-card b{font-family:var(--v2-disp)!important}
/* amizades e pedidos */
.fr-row,.fr-req,.pp-row,.ppl-row,.fd-row{border-radius:18px!important;box-shadow:var(--v2-sh)!important}
.fr-row b,.pp-row b{font-weight:900}
/* página do autor */
.au-hero,.ap-hero{border-radius:var(--v2-r,20px)!important;box-shadow:var(--v2-sh)!important}
.au-hero b,.ap-hero h2,.au-hero h2{font-family:var(--v2-disp)!important}
`;
  const st = document.createElement('style'); st.textContent = css; TR.append(st);
  // folhas e avaliação que moram fora da tela principal
  const out = document.createElement('style'); out.textContent = `
body > * input[type=checkbox]:not(.v2-raw){-webkit-appearance:none;appearance:none;width:22px;height:22px;border:2px solid rgba(120,90,60,.35);border-radius:7px;display:inline-grid;vertical-align:-5px}
body > * input[type=checkbox]:not(.v2-raw):checked{background:#c46f2e ${CHK} center/15px no-repeat;border-color:#c46f2e}
`; document.head.append(out); }
{ const st = document.createElement('style'); st.textContent = `
/* botões Salvar das folhas antigas e pílulas escuras antigas viram o acento */
#editor button.pri,#editor button[id$="-save"]:not(:disabled),#editor button.sv,#shelflist button.sv{background:var(--v2-pri)!important;border:0!important;border-bottom:0!important;color:var(--on-acc,#fff)!important;border-radius:16px!important;box-shadow:var(--v2-pri-sh)!important;font-weight:900!important}
.esn-seg button.on,#lista .esn-seg > button.on,#editor .ss-chips > button.on{background:var(--v2-pri)!important;border-color:transparent!important;color:var(--on-acc,#fff)!important}
#editor .ss-chips > button{border-radius:99px!important}
/* tour e órbita: títulos em serifa */
.tour h3,.tour b.t,.tr-card h3,.tr-card b:first-child,.tour-card h3,.tour-card b:first-child{font-family:var(--v2-disp)!important;font-size:1.12rem!important}
.ob-big,.orb-big,.ob-n,.orb-n{font-family:var(--v2-disp)!important}
/* composer: escolher livro e publicar no padrão */
.rdc2-pick,.rdc-pick{border-style:solid!important;border-radius:16px!important}
.rdc2-foot button.p,.rdc2-foot .pub,.rdc2 button[type=submit],.rdc2-foot button:last-child{background:var(--v2-pri)!important;border:0!important;color:var(--on-acc,#fff)!important;box-shadow:var(--v2-pri-sh)!important;border-radius:16px!important}
`; TR.append(st); }
// folhas antigas (.sheet) com formulário: o botão principal também no degradê (dentro e fora da tela principal)
{ const css = `.sheet button.primary,.sheet .pv2-btns button.primary,.sheet button[type=submit]{background:linear-gradient(135deg,color-mix(in srgb,var(--acc,#c46f2e) 62%,#ffd6a3),var(--acc,#c46f2e))!important;border:0!important;border-bottom:0!important;color:var(--on-acc,#fff)!important;border-radius:16px!important;box-shadow:0 8px 18px color-mix(in srgb,var(--acc,#c46f2e) 32%,transparent)!important;font-weight:900!important;min-height:48px}
.sheet .pv2-btns button.cancel{border-radius:16px!important;font-weight:800!important}`;
  const a = document.createElement('style'); a.textContent = css; TR.append(a);
  const b = document.createElement('style'); b.textContent = css; document.head.append(b); }
{ const css = `.sheet h3,.sheet .pv2 > b:first-child,.sheet .box h2{font-family:Georgia,'Times New Roman',serif!important;font-weight:700!important;font-size:1.2rem!important;letter-spacing:0!important}`;
  const a = document.createElement('style'); a.textContent = css; TR.append(a); const b = document.createElement('style'); b.textContent = css; document.head.append(b); }
