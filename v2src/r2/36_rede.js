// Rede (15/11, API 017): Comunidade ganha a aba "Rede" (a rede toda: posts sobre livros e avaliações públicas)
// ao lado de "Amigos" (o que já existia). Post: comentário, trecho, pergunta ou indicação; foto; spoiler por página,
// % ou final, liberado sozinho para quem já leu até ali. Curtir, responder, ocultar, silenciar livro, denunciar e bloquear.
{ const st = document.createElement('style'); st.textContent = `
.rd-seg{display:grid;grid-template-columns:1fr 1fr;gap:.25rem;background:var(--panel);border:1px solid var(--line);border-radius:999px;padding:.2rem;margin:.1rem 0 .8rem}
.rd-seg button{border:0;background:none;border-radius:999px;height:36px;font:inherit;font-weight:800;font-size:.88rem;color:var(--ink-2)}
.rd-seg button.on{background:var(--acc);color:var(--on-acc,#fff)}
#lista.rd-on > *:not(.rd-seg):not(#rd-host):not(.gtop-sp):not(.cm-new):not(.cm-row){display:none!important}
#rd-host{display:grid;gap:.7rem}
.rd-new{display:grid;grid-template-columns:auto 1fr;gap:.6rem;align-items:center;width:100%;text-align:left;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.75rem .85rem;color:var(--ink);font:inherit}
.rd-new b{display:block;font-size:.95rem}.rd-new small{font-size:.8rem;color:var(--ink-2)}
.rd-new i{width:38px;height:38px;border-radius:50%;background:var(--acc);color:var(--on-acc,#fff);display:grid;place-items:center;font-style:normal;font-size:1.3rem;font-weight:800}
.rd-opts{display:flex;gap:.4rem;flex-wrap:wrap}
.rd-opt{border:1px dashed var(--line);background:none;color:var(--ink-2);border-radius:999px;min-height:32px;padding:0 .7rem;font:inherit;font-weight:700;font-size:.76rem}
.rd-opt.on{border-style:solid;border-color:var(--acc);color:var(--acc);background:var(--panel)}
.rd-card{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.75rem .8rem .4rem;color:var(--ink)}
.rd-card header{display:grid;grid-template-columns:auto 1fr auto auto;gap:.5rem;align-items:center}
.rd-who{min-width:0;border:0;background:none;padding:0;text-align:left;font:inherit;color:var(--ink)}
.rd-who b{display:block;font-size:.88rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rd-who small{font-size:.74rem;color:var(--ink-2)}
.rd-kpct{display:block;text-align:right;font-size:.8rem;font-weight:900;color:var(--ink);margin-top:.1rem}
.rd-eye{display:block;width:34px;height:34px;margin:0 auto .2rem;background:url("img/ic_olho_spoiler.webp") center/contain no-repeat}
.rd-kind{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--acc)}
.rd-more{border:0;background:none;color:var(--ink-2);font-weight:900;width:36px;height:36px;font-size:1rem}
.rd-book{display:grid;grid-template-columns:auto 1fr;gap:.55rem;align-items:center;width:100%;border:0;background:none;padding:.5rem 0 .2rem;text-align:left;font:inherit;color:var(--ink)}
.rd-book .cv{width:34px;height:50px;border-radius:2px 5px 5px 2px;font-size:.45rem}
.rd-book b{font-size:.84rem;display:block}.rd-book small{font-size:.74rem;color:var(--ink-2)}
.rd-body{position:relative;padding:.25rem 0 .2rem}
.rd-body p{margin:.25rem 0;white-space:pre-wrap;word-break:break-word;font-size:.93rem;line-height:1.4}
.rd-q{margin:.35rem 0;padding:.5rem .7rem;border-left:3px solid var(--acc);background:var(--bg,#fff);border-radius:0 10px 10px 0;font-style:italic;font-size:.92rem;white-space:pre-wrap}
.rd-q small{display:block;font-style:normal;font-weight:700;color:var(--ink-2);font-size:.74rem;margin-top:.2rem}
.rd-rec{display:grid;grid-template-columns:1fr auto 1fr;gap:.4rem;align-items:center;margin:.35rem 0;font-size:.78rem}
.rd-rec > span{display:grid;justify-items:center;gap:.25rem;text-align:center}.rd-rec .cv{width:56px;height:82px;border-radius:2px 6px 6px 2px;font-size:.5rem}
.rd-rec em{font-style:normal;font-weight:900;color:var(--acc);font-size:1.2rem}
.rd-fe{display:flex;flex-wrap:wrap;gap:.3rem;margin:.3rem 0}.rd-fe span{display:inline-flex;align-items:center;gap:.25rem;font-size:.74rem;font-weight:700;border:1px solid var(--line);border-radius:999px;padding:.1rem .5rem}
.rd-fe img{width:16px;height:16px}
.rd-paws{font-size:.8rem;font-weight:800;color:var(--acc)}
.rd-img img{display:block;width:100%;max-height:360px;object-fit:cover;border-radius:12px;margin:.35rem 0}
.rd-img:empty{height:0}
.rd-body.spoil > *:not(.rd-veil){filter:blur(8px);user-select:none;pointer-events:none}
.rd-body.spoil .rd-img img{max-height:140px}
.rd-veil{position:absolute;inset:0;z-index:2;display:grid;place-content:center;justify-items:center;gap:.2rem;text-align:center;border:0;border-radius:12px;background:rgba(245,236,224,.6);color:var(--ink);font:inherit;padding:.5rem;min-height:72px}
.rd-veil b{font-size:.86rem}.rd-veil small{font-size:.76rem;color:var(--ink-2)}.rd-veil u{font-size:.78rem;font-weight:800;color:var(--acc);text-decoration:none}
.rd-body.spoil{min-height:80px}
.rd-card footer{display:flex;gap:.2rem;margin-top:.2rem;border-top:1px solid var(--line);padding-top:.15rem}
.rd-card footer button{border:0;background:none;color:var(--ink-2);font:inherit;font-weight:800;font-size:.8rem;min-height:40px;padding:0 .6rem;border-radius:10px}
.rd-card footer button.on{color:#c2410c}
.rd-empty{text-align:center;color:var(--ink-2);font-size:.88rem;padding:1rem .5rem}
.rd-moreb{border:1px solid var(--line);background:var(--panel);border-radius:12px;height:42px;font:inherit;font-weight:800;color:var(--ink)}
.rd-rep{border-top:1px solid var(--line);padding:.6rem 0;display:grid;grid-template-columns:auto 1fr auto;gap:.5rem;align-items:start}
.rd-rep p{margin:.15rem 0 0;font-size:.9rem;white-space:pre-wrap;word-break:break-word}
.rd-rep .rd-body.spoil{min-height:56px}
.rd-form{position:sticky;bottom:0;display:grid;gap:.4rem;background:var(--bg);padding:.6rem 0 .3rem;border-top:1px solid var(--line)}
.rd-form textarea,.rdc textarea,.rdc input[type=number],.rdc input[type=text]{font:inherit;font-size:.95rem;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);padding:.6rem .7rem;width:100%;min-width:0;resize:vertical}
.rd-row{display:flex;align-items:center;justify-content:space-between;gap:.5rem;font-size:.8rem;color:var(--ink-2)}
.rd-send{height:42px;border-radius:12px;border:0;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;padding:0 1.1rem}
.rd-send:disabled{opacity:.5}
.rdc{display:grid;gap:.75rem;padding-bottom:1rem}
.rdc-k{display:grid;grid-template-columns:repeat(4,1fr);gap:.3rem}
.rdc-k button{border:1.5px solid var(--line);background:var(--panel);border-radius:12px;min-height:54px;font:inherit;font-weight:800;font-size:.76rem;color:var(--ink);display:grid;place-items:center;gap:.1rem;padding:.3rem .2rem}
.rdc-k button span{font-size:1.1rem}
.rdc-k button.on{border-color:var(--acc);color:var(--acc)}
.rdc-l{font-size:.84rem;font-weight:800}
.rdc-bk{display:grid;grid-template-columns:auto 1fr auto;gap:.6rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.45rem .55rem;background:var(--panel)}
.rdc-bk .cv{width:36px;height:54px;border-radius:2px 5px 5px 2px;font-size:.45rem}.rdc-bk b{font-size:.88rem;display:block}.rdc-bk small{font-size:.76rem;color:var(--ink-2)}
.rdc-bk button,.rdc-pick{border:1px solid var(--line);background:none;border-radius:999px;font:inherit;font-weight:800;font-size:.78rem;color:var(--ink);min-height:36px;padding:0 .75rem}
.rdc-pick{width:100%;border-style:dashed;border-radius:12px;min-height:46px}
.rdc-cnt{font-size:.74rem;color:var(--ink-2);text-align:right}.rdc-cnt.over{color:#b3412e;font-weight:800}
.rdc-chips{display:flex;flex-wrap:wrap;gap:.35rem}
.rdc-chips button{border:1.5px solid var(--line);background:var(--panel);border-radius:999px;min-height:36px;padding:0 .75rem;font:inherit;font-weight:700;font-size:.8rem;color:var(--ink);display:inline-flex;align-items:center;gap:.25rem}
.rdc-chips button img{width:18px;height:18px}
.rdc-chips button.on{border-color:var(--acc);background:var(--acc);color:var(--on-acc,#fff)}
.rdc-sp{display:grid;gap:.45rem;border:1px solid var(--line);border-radius:12px;padding:.65rem;background:var(--panel)}
.rdc-sp label{display:flex;align-items:center;gap:.5rem;font-size:.86rem;font-weight:700}
.rdc-sp input[type=radio],.rdc-sp input[type=checkbox]{width:18px;height:18px;flex:none}
.rdc-sp input[type=number]{width:90px;height:38px;padding:0 .5rem}
.rdc-ph img{display:block;max-width:100%;max-height:220px;border-radius:12px}
.rdc-go{height:48px;border-radius:12px;border:0;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:800;font-size:1rem}
.rdc-go:disabled{opacity:.5}
.rdm-it{border:1px solid var(--line);border-radius:14px;padding:.6rem;display:grid;gap:.4rem;background:var(--panel)}
.rdm-it .rd-row button{border:1px solid var(--line);background:none;border-radius:999px;min-height:36px;padding:0 .8rem;font:inherit;font-weight:800}
.rd2.rd-card{border-radius:20px;padding:.85rem .9rem .35rem}
.rd2 header{grid-template-columns:auto minmax(0,1fr) auto auto;align-items:start}.rd2 header .av{margin-top:2px}
.rd2 .rd-kc{display:flex;flex-direction:column;align-items:center;gap:.2rem;min-width:70px;margin-left:0}
.rd-tag{display:block;min-width:70px;text-align:center;font-size:.72rem;font-weight:900;padding:.22rem .55rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 15%,transparent);color:var(--acc)}
.rd-tag.rv{background:var(--acc);color:var(--on-acc,#fff)}
.rd2 .rd-kpct{text-align:center;font-size:.84rem;line-height:1}
.rd2 .rd-kc .rd-mk{width:26px;height:42px}.rd2 .rd-kc .rd-mk b{font-size:.6rem}
.rd2 .rd-more{height:28px;margin-top:-2px}
.rd2 .rd-book{grid-template-columns:64px minmax(0,1fr);gap:.8rem;align-items:start;padding:.6rem 0 .3rem}
.rd2 .rd-book .cv{width:64px!important;height:96px!important;border-radius:5px!important;box-shadow:0 3px 8px rgba(0,0,0,.18);font-size:.5rem}
.rd2 .rd-book b{font-size:1rem;line-height:1.2;margin-top:.1rem}.rd2 .rd-book small{display:block;font-size:.8rem;font-weight:700;margin-top:.1rem}
.rd2 .rd-book em{display:block;font-style:normal;font-size:.76rem;font-weight:800;color:var(--ink-2);margin-top:.35rem}
.rd2 .rd-tx{background:color-mix(in srgb,var(--ink) 5%,transparent);border-radius:14px;padding:.55rem .7rem;margin:.35rem 0}
.rd2 .rd-tx p{margin:0;font-size:.92rem}.rd2 .rd-tx .rd-fe{margin:.4rem 0 0}
.rd2 .rd-q{border-radius:0 14px 14px 0;background:color-mix(in srgb,var(--ink) 3%,transparent)}
.rd2 footer{align-items:center}.rd2 footer .rd-like{min-width:46px;text-align:left}.rd2 footer .rd-sp{flex:1}
.rd2 footer .rd-save,.rd2 footer .rd-share{width:38px;padding:0;display:grid;place-items:center}
.rd2 footer svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.rd2 footer .rd-save.on{color:var(--acc)}.rd2 footer .rd-save.on svg{fill:currentColor}
.rd2 footer .rd-ql{border:1.5px solid var(--acc)!important;color:var(--acc)!important;border-radius:99px!important;min-height:32px!important;padding:0 .7rem!important;font-size:.76rem!important;margin-left:.2rem;white-space:nowrap}
.rd2 footer .rd-ql.in{border-color:var(--line)!important;color:var(--ink-2)!important}
.rd2 .rd-main{display:grid;grid-template-columns:64px minmax(0,1fr);gap:.8rem;align-items:start;padding:.6rem 0 .3rem}
.rd2 .rd-bcv{border:0;background:none;padding:0;cursor:pointer}.rd2 .rd-bcv .cv{width:64px!important;height:96px!important;border-radius:5px!important;box-shadow:0 3px 8px rgba(0,0,0,.18);font-size:.5rem}
.rd2 .rd-col{min-width:0}.rd2 .rd-bt{display:block;width:100%;border:0;background:none;padding:0;text-align:left;font:inherit;color:var(--ink);cursor:pointer}
.rd2 .rd-bt b{display:block;font-size:1rem;line-height:1.2;margin-top:.1rem}.rd2 .rd-bt small{display:block;font-size:.8rem;font-weight:700;color:var(--ink-2);margin-top:.1rem}
.rd2 .rd-bt em{display:block;font-style:normal;font-size:.76rem;font-weight:800;color:var(--ink-2);margin-top:.35rem}
.rd2 .rd-col .rd-body{padding:.15rem 0 0}.rd2 .rd-col .rd-tx{margin:.45rem 0 0}.rd2 .rd-col .rd-q{margin:.45rem 0 0}.rd2 .rd-col .rd-fe-out .rd-fe{margin:.35rem 0 0}
.rd2 .rd-kc .rd-nota{display:flex;align-items:center;gap:.45rem;flex-direction:row-reverse;margin-top:.15rem}.rd2 .rd-kc .rd-nota .rd-mk{width:34px;height:54px}.rd2 .rd-kc .rd-nota .rd-mk b{font-size:.72rem}.rd2 .rd-kc .rd-nota .rd-mk-t{text-align:right}.rd2 .rd-kc .rd-nota .rd-mk-t b{font-size:.95rem}.rd2 .rd-kc .rd-nota .rd-mk-t small{font-size:.76rem;color:var(--acc);font-weight:800;white-space:nowrap}.rd2 .rd-kc:has(.rd-nota){align-items:flex-end}
.rd2 .rd-lc{width:76px}.rd2 .rd-bcv{position:relative;display:block}.rd2 .rd-bcv .rd-mk{position:absolute;top:-6px;left:5px;width:28px;height:46px;z-index:2}.rd2 .rd-bcv .rd-mk b{font-size:.64rem}.rd2 .rd-ntx{display:block;margin-top:.35rem;font-size:.8rem;font-weight:800;color:var(--acc)}.rd2 .rd-bt .rd-ntx b{display:inline;font-size:inherit;margin:0;color:var(--ink);font-weight:900}.rd2 .rd-nlc{display:grid;justify-items:center;text-align:center;gap:.1rem;margin-top:.1rem}.rd2 .rd-nlc > span:not(.rd-mk){display:grid;justify-items:center}.rd2 .rd-nlc .rd-mk{width:34px;height:54px}.rd2 .rd-nlc .rd-mk b{font-size:.72rem}.rd2 .rd-nlc b{font-size:.82rem;font-weight:900;color:var(--ink);white-space:nowrap}.rd2 .rd-nlc small{font-size:.68rem;font-weight:800;color:var(--acc);line-height:1.15}.rd2 .rd-main{grid-template-columns:76px minmax(0,1fr)}.rd2 .rd-bcv .cv{width:76px!important;height:114px!important}
.rd-tag .rd-tn{display:inline-flex;align-items:center;gap:.15rem;margin-left:.35rem;padding-left:.35rem;border-left:1px solid color-mix(in srgb,var(--on-acc,#fff) 45%,transparent)}.rd-tag .rd-tn i{display:inline-block;width:16px;height:16px;background:center/contain no-repeat;filter:drop-shadow(0 0 1px rgba(0,0,0,.35))}.rd-tag:has(.rd-tn){display:inline-flex;align-items:center;min-width:0;white-space:nowrap}
.rd-selo{display:inline-flex;align-items:center;position:relative;margin-right:2px}
.rd-selo-f{position:relative;z-index:1;height:28px;display:flex;align-items:center;padding:0 24px 0 14px;margin-right:-18px;font-size:.84rem;font-weight:900;letter-spacing:.01em;color:#3a2410;background:var(--rib);clip-path:polygon(0 0,100% 0,100% 100%,0 100%,9px 50%);box-shadow:inset 0 -3px 0 rgba(0,0,0,.08);text-shadow:0 1px 0 rgba(255,255,255,.4)}
.rd-selo-s{position:relative;z-index:2;width:44px;height:44px;background:var(--nimg) center bottom/44px auto no-repeat;filter:drop-shadow(0 2px 3px rgba(0,0,0,.3));display:grid;place-items:center}
.rd-selo-s b{margin-top:5px;font-size:.92rem;font-weight:900;color:#2a1709;text-shadow:0 0 3px rgba(255,255,255,.9),0 0 1px rgba(255,255,255,.9)}
.rd-selo.t-5{--rib:linear-gradient(90deg,#ffd27a,#ff8fc8,#b78cff,#6fd3ff)}.rd-selo.t-ouro{--rib:linear-gradient(90deg,#f7dc6f,#e2a92c)}.rd-selo.t-prata{--rib:linear-gradient(90deg,#f3f5f7,#b9c1c8)}.rd-selo.t-bronze{--rib:linear-gradient(90deg,#efb989,#c07a45)}.rd-selo.t-bronze .rd-selo-f{color:#3a1d06}
.rd2 .rd-kc:has(.rd-selo){min-width:0;margin-top:-6px}
.rd-selo-s{background:none!important;width:42px!important;height:42px!important}
.rd-selo-s::before,.rd-selo-s::after{content:"";position:absolute;-webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1.6l3.15 6.55 7.2.95-5.3 5 1.38 7.15L12 17.8l-6.43 3.45 1.38-7.15-5.3-5 7.2-.95z' stroke='%23000' stroke-width='1.6' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat;mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 1.6l3.15 6.55 7.2.95-5.3 5 1.38 7.15L12 17.8l-6.43 3.45 1.38-7.15-5.3-5 7.2-.95z' stroke='%23000' stroke-width='1.6' stroke-linejoin='round'/%3E%3C/svg%3E") center/contain no-repeat}
.rd-selo-s::before{inset:0;background:var(--so,#8a4718)}
.rd-selo-s::after{inset:3px;background:var(--sg)}
.rd-selo-s b{position:relative;z-index:1;margin-top:4px!important;font-size:.86rem!important}
.rd-selo.t-5{--sg:linear-gradient(135deg,#ffe29a,#ff9fd0 38%,#c2a0ff 66%,#8fe0ff);--so:#b04fc8}.rd-selo.t-5 .rd-selo-s{filter:drop-shadow(0 0 5px rgba(255,143,200,.7)) drop-shadow(0 2px 2px rgba(0,0,0,.25))}
.rd-selo.t-ouro{--sg:linear-gradient(160deg,#fff3c2,#f4c94a 50%,#d8961c);--so:#a86a0c}
.rd-selo.t-prata{--sg:linear-gradient(160deg,#ffffff,#dde1e6 50%,#a3abb5);--so:#6c7480}
.rd-selo.t-bronze{--sg:linear-gradient(160deg,#ffdcbd,#e59d62 50%,#b5672f);--so:#86441a}

.rd-rehide{display:inline-flex;align-items:center;gap:.35rem;border:0;background:none;padding:.3rem 0 0;font:inherit;font-size:.76rem;font-weight:800;color:var(--ink-2);cursor:pointer}.rd-rehide .rd-eye{width:18px;height:18px;margin:0}
.rd-day{font-size:.74rem;font-weight:900;color:var(--ink-2);text-transform:uppercase;letter-spacing:.06em;margin:.4rem .2rem -.2rem}
.rd-fe-out .rd-fe{margin:.1rem 0 .3rem}
.rd-fl{display:flex;gap:.35rem;overflow-x:auto;scrollbar-width:none}.rd-fl::-webkit-scrollbar{display:none}
.rd-fl button{flex:none;border:1.5px solid var(--line);background:var(--panel);color:var(--ink-2);border-radius:99px;min-height:32px;padding:0 .8rem;font:inherit;font-weight:800;font-size:.78rem}
.rd-fl button.on{background:var(--ink);border-color:var(--ink);color:var(--bg)}
.rd-fl .rd-flt{position:relative;margin-left:auto;width:40px;padding:0;display:grid;place-items:center;font-weight:900;letter-spacing:1px}.rd-fl .rd-flt svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.rd-fl .rd-flt.on{background:var(--panel);border-color:var(--acc);color:var(--acc)}.rd-fl .rd-flt i{position:absolute;top:4px;right:5px;width:7px;height:7px;border-radius:50%;background:var(--acc)}
`; TR.append(st); }

S.rd = S.rd || { items: [], more: false, busy: false, at: 0, admin: false };
S.comSeg = S.comSeg || 'rede';
const RD_KINDS = [['comment', 'Comentário', '<i class=v3e data-i=reply></i>'], ['quote', 'Trecho', '❝'], ['question', 'Pergunta', '?'], ['rec', 'Indicação', '➜']];
const rdPrefs = () => { const p = db.prefs || {}; return { mute: p.rdMute || [], muteU: (p.rdMuteU || []).map((x) => String(x).toLowerCase()), hide: p.rdHide || [], hideReading: !!p.rdHideReading }; };
const rdSetPref = (k, v) => { db.prefs = { ...(db.prefs || {}), [k]: v }; save(); };
const myBookByKey = (k) => k ? lib().find((e) => normT(e.title) === k) : null;
function rdSpoil(it) { // null = pode mostrar; senão o aviso
  if (!it.spoiler || it.mine || (S.rdOpen && S.rdOpen.has(it.type + it.id))) return null;
  const sp = it.spoiler, e = myBookByKey(it.book && it.book.key);
  const where = sp.kind === 'page' ? `até a pág. ${sp.at}` : sp.kind === 'pct' ? `até ${sp.at}% do livro` : sp.kind === 'end' ? 'conta o final' : '';
  let note = '';
  if (e) {
    if (e.status === 'LIDO') return null;
    const pg = Number(libProgress(e)) || 0, tot = Number(e.totalPages) || 0;
    if (sp.kind === 'page' && pg >= sp.at) return null;
    if (sp.kind === 'pct' && tot && (pg / tot) * 100 >= sp.at) return null;
    if (e.status === 'LENDO' && pg) note = `Você está na pág. ${pg}`;
  }
  return { label: sp.kind === 'end' ? 'Spoiler do final' : where ? 'Spoiler ' + where : 'Contém spoiler', note }; // 17/11: sem o nome do livro (já está no cartão)
}
// nota nos cards da Rede com o marca-página de estrela (Bia, 17/11)
const rdMark = (p) => { const n = Number(p) || 0, t = n >= 5 ? '5' : n >= 4 ? 'ouro' : n >= 3 ? 'prata' : 'bronze', fr = { 0.5: 'Socorro, o que foi isso?', 1: 'Não foi pra mim', 1.5: 'Quase abandonei', 2: 'Fraquinho', 2.5: 'Teve seus momentos', 3: 'Bom, mas não marcou', 3.5: 'Gostei bastante', 4: 'Muito bom!', 4.5: 'Quase perfeito', 5: 'Favorito da vida!' }[n] || '';
  return '<span class="rd-mk" style="--nimg:url(img/nota_' + t + '.webp)"><b>' + String(n).replace('.', ',') + '</b></span><span class="rd-mk-t"><b>nota ' + String(n).replace('.', ',') + '</b>' + (fr ? '<small>' + fr + '</small>' : '') + '</span>'; };
{ const st = document.createElement('style'); st.textContent = '.rd-paws{display:flex!important;align-items:center;gap:.6rem;margin:.15rem 0 .3rem}.rd-mk{position:relative;flex:none;width:34px;height:56px;background:var(--nimg) center bottom/contain no-repeat;filter:drop-shadow(0 1px 1.5px rgba(0,0,0,.35))}.rd-mk b{position:absolute;left:0;right:0;top:66%;transform:translateY(-50%);text-align:center;font-size:.72rem;font-weight:900;color:#2a1709;text-shadow:0 0 2px rgba(255,255,255,.8)}.rd-kc{display:grid;justify-items:end;gap:.2rem;margin-left:auto}.rd-kmk{display:flex;align-items:center;gap:.35rem;flex-direction:row-reverse}.rd-kmk .rd-mk{width:26px;height:42px}.rd-kmk .rd-mk b{font-size:.62rem}.rd-kmk .rd-mk-t{text-align:right}.rd-kmk .rd-mk-t b{font-size:.8rem}.rd-kmk .rd-mk-t small{font-size:.68rem}.rd-mk-t{display:grid;line-height:1.15}.rd-mk-t b{font-size:.95rem;font-weight:900;color:var(--ink)}.rd-mk-t small{font-size:.76rem;font-weight:700;color:var(--ink-2)}'; TR.append(st); }
const pawsTxt = (p) => p ? `nota ${String(p).replace('.', ',')}` : '';
function readerPctOf(title) { const e = lib().find((x) => normT(x.title) === normT(title || '')); if (!e) return null; if (e.status === 'LIDO') return 100; try { const p = Math.round(readingInfo(e).pct || 0); return p > 0 ? Math.min(100, p) : (e.status === 'LENDO' ? 0 : null); } catch { return null; } }
const readerPctTxt = (p) => (p == null ? '' : p >= 100 ? 'terminou o livro' : p <= 0 ? 'começando o livro' : `em ${p}% do livro`);
const RD_FR = { 0.5: 'Socorro, o que foi isso?', 1: 'Não foi pra mim', 1.5: 'Quase abandonei', 2: 'Fraquinho', 2.5: 'Teve seus momentos', 3: 'Bom, mas não marcou', 3.5: 'Gostei bastante', 4: 'Muito bom!', 4.5: 'Quase perfeito', 5: 'Favorito da vida!' };
const rdMk = (p) => { const n = Number(p) || 0, t = n >= 5 ? '5' : n >= 4 ? 'ouro' : n >= 3 ? 'prata' : 'bronze'; return '<span class="rd-mk" style="--nimg:url(img/nota_' + t + '.webp)"><b>' + String(n).replace('.', ',') + '</b></span>'; };
const rdSavedList = () => ((db.prefs || {}).rdSaved || []);
const rdIsSaved = (it) => rdSavedList().some((x) => x.k === it.type + it.id);
function rdShelfBtn(it) {
  if (!it.book || it.book2) return '';
  const e = myBookByKey(it.book.key || normT(it.book.title));
  if (!e) return '<button type="button" class="rd-ql">＋ Quero ler</button>';
  const t = { LIDO: '<i class=v3e data-i=ok></i>Lido', QUERO: '<i class=v3e data-i=ok></i>Na sua fila', LENDO: 'Lendo', HIBERNANDO: 'Pausado', ABANDONEI: 'Abandonado' }[e.status] || 'Na estante';
  return '<button type="button" class="rd-ql in">' + t + '</button>';
}
function rdCardHTML(it, i, opts = {}) {
  const isRev = it.type === 'review';
  const isAct = it.type === 'activity', isAch = it.type === 'achievement';
  const revSt = !isRev ? null : it.bookStatus || (it.mine && it.book ? ((myBookByKey(it.book.key || normT(it.book.title)) || {}).status || null) : null) || (it.readerPct != null && it.readerPct < 100 ? 'PAROU' : null);
  const revLbl = ({ ABANDONEI: 'Abandonou', HIBERNANDO: 'Pausou', LENDO: 'Lendo', PAROU: 'Não terminou' })[revSt] || 'Avaliou';
  const kind = isAch ? 'Conquista' : isAct ? (it.act === 'FINISHED' ? 'Terminou' : 'Lendo') : isRev ? revLbl : it.kind === 'question' ? 'Pergunta' : it.kind === 'rec' ? 'Indicação' : 'Lendo';
  const sp = rdSpoil(it), u = it.user || {};
  const pct = it.readerPct != null && !it.paws && !(isAct && it.act === 'FINISHED') ? Math.max(0, Math.min(100, Math.round(it.readerPct))) : null;
  const fe = (it.feelings || []).length ? `<div class="rd-fe">${it.feelings.map((k) => qtFeel(k)).join('')}</div>` : '';
  const sp0 = rdSpoil(it); // com spoiler, as emoções ficam fora do embaçado (Bia, 17/11)
  const txt = it.text || (fe && !sp0) ? `<div class="rd-tx">${it.text ? `<p>${esc(it.text)}</p>` : ''}${sp0 ? '' : fe}</div>` : '';
  const body = `${txt}${it.quote ? `<div class="rd-q">“${esc(it.quote)}”${it.page ? `<small>pág. ${it.page}</small>` : ''}</div>` : ''}
    ${it.book2 ? `<div class="rd-rec"><span>${cvh(it.book.title, it.book.cover)}<b>${esc(it.book.title)}</b></span><em>➜</em><span>${cvh(it.book2.title, it.book2.cover)}<b>${esc(it.book2.title)}</b></span></div>` : ''}
    ${it.hasImage ? `<div class="rd-img" data-img="${esc(it.id)}"></div>` : ''}`;
  const fr = isRev && it.paws ? (RD_FR[Number(it.paws)] || '') : '';
  const fim = isRev && (it.readAt || it.postedAt) ? 'terminou em ' + String(it.readAt || it.postedAt).slice(8, 10) + '/' + String(it.readAt || it.postedAt).slice(5, 7) : '';
  const saved = rdIsSaved(it);
  const reHide = it.spoiler && !it.mine && S.rdOpen && S.rdOpen.has(it.type + it.id) ? '<button type="button" class="rd-rehide"><i class="rd-eye" aria-hidden="true"></i>Esconder o spoiler de novo</button>' : '';
  return `<article class="rd-card rd2${it.paws ? ' has-nota' : ''}" data-i="${i}">
    <header><span class="av sm" data-avh="${esc(u.handle || '')}" style="background:${friendColor(u.handle || '')}">${esc(initial(u.displayName))}</span>
      <button type="button" class="rd-who" data-h="${esc(u.handle || '')}"><b>${esc(u.displayName || '')}</b><small>@${esc(u.handle || '')} · ${esc(relTime(it.createdAt))}${it.visibility === 'friends' ? ' · só amizades' : ''}</small></button>
      <span class="rd-kc">${isRev && it.paws ? `<span class="rd-tag rv rd-nt" title="${revLbl} · nota ${String(it.paws).replace('.', ',')}">${esc(revLbl)} <i>★ ${String(it.paws).replace('.', ',')}</i></span>` : `<span class="rd-tag${isRev || isAch || (isAct && it.act === 'FINISHED') ? ' rv' : ''}${kind === 'Lendo' ? ' le' : ''}"${pct != null ? ` title="${esc(readerPctTxt(it.readerPct))}"` : ''}>${esc(kind)}${pct != null ? ' · ' + pct + '%' : ''}</span>`}</span><button type="button" class="rd-more" aria-label="Mais opções">•••</button></header>
    ${isAch ? `<div class="rd-ach">${it.reward && typeof DECO_IMG !== 'undefined' && DECO_IMG[it.reward] ? `<img src="${DECO_IMG[it.reward]}" alt="">` : '<span></span>'}<span><b>${esc(it.name || '')}</b><small>ganhou esta conquista</small></span></div>` : ''}
    ${it.book && !it.book2 ? `<div class="rd-main"><div class="rd-lc"><button type="button" class="rd-book rd-bcv" aria-label="Ver o livro">${cvh(it.book.title, it.book.cover)}</button></div><div class="rd-col"><button type="button" class="rd-book rd-bt"><b>${esc(it.book.title)}</b><small>${esc(it.book.author || '')}</small>${it.paws && fr ? `<span class="rd-ntx">${esc(fr)}</span>` : ''}${isAct ? `<em>${it.act === 'STARTED' ? 'começou a ler' : it.act === 'FINISHED' ? 'terminou o livro' : it.pages ? 'chegou na pág. ' + it.pages : 'avançou na leitura'}</em>` : ''}${fim ? `<em>${esc(fim)}</em>` : ''}</button>${(it.text || it.quote || it.hasImage || (it.feelings || []).length) ? `<div class="rd-body${sp ? ' spoil' : ''}">${body}${sp ? `<button type="button" class="rd-veil"><i class="rd-eye" aria-hidden="true"></i><b>${esc(sp.label)}</b>${sp.note ? `<small>${esc(sp.note)}</small>` : ''}<u>Mostrar mesmo assim</u></button>` : ''}</div>${sp && fe ? `<div class="rd-fe-out">${fe}</div>` : ''}${reHide}` : ''}</div></div>` : `<div class="rd-body${sp ? ' spoil' : ''}">${body}${sp ? `<button type="button" class="rd-veil"><i class="rd-eye" aria-hidden="true"></i><b>${esc(sp.label)}</b>${sp.note ? `<small>${esc(sp.note)}</small>` : ''}<u>Mostrar mesmo assim</u></button>` : ''}</div>${sp && fe ? `<div class="rd-fe-out">${fe}</div>` : ''}${reHide}`}
    ${opts.noFoot || isAch ? '' : isAct ? `<footer><span class="rd-sp"></span><button type="button" class="rd-save${saved ? ' on' : ''}" aria-pressed="${saved}" aria-label="Salvar"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg></button>${rdShelfBtn(it)}</footer>` : `<footer><button type="button" class="rd-like${it.liked ? ' on' : ''}" data-ic2="1" aria-label="Curtir" aria-pressed="${!!it.liked}"><img class="rd-hi" src="img/bt_curtir.webp" alt="">${it.likes || ''}</button><button type="button" class="rd-rp">Responder${it.replies ? ' · ' + it.replies : ''}</button>
      <span class="rd-sp"></span><button type="button" class="rd-save${saved ? ' on' : ''}" aria-pressed="${saved}" aria-label="${saved ? 'Tirar dos salvos' : 'Salvar post'}" title="${saved ? 'Salvo' : 'Salvar'}"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4.5L6 21z"/></svg></button><button type="button" class="rd-share" aria-label="Compartilhar" title="Compartilhar"><svg viewBox="0 0 24 24"><path d="M14 5l7 7-7 7M21 12H9a6 6 0 0 0-6 6"/></svg></button>${rdShelfBtn(it)}</footer>`}
  </article>`;
}
// salvar / compartilhar
function rdToggleSave(it) {
  const k = it.type + it.id, L = rdSavedList();
  if (L.some((x) => x.k === k)) { rdSetPref('rdSaved', L.filter((x) => x.k !== k)); toast('Tirado dos salvos'); return false; }
  const c = JSON.parse(JSON.stringify(it)); if (c.book && c.book.cover && String(c.book.cover).length > 600) delete c.book.cover;
  rdSetPref('rdSaved', [{ k, at: new Date().toISOString(), it: c }, ...L].slice(0, 200)); toast('Post salvo · veja em Salvos'); return true;
}
const RD_APP_URL = 'https://beagyn03.github.io/bear-app/';
function rdShareText(it) {
  const u = it.user || {}, bk = it.book ? it.book.title : '', who = u.displayName || ('@' + (u.handle || ''));
  const act = it.type === 'review' ? 'avaliou' : it.quote && !it.text ? 'guardou um trecho de' : 'comentou sobre';
  if (it.spoiler) return who + ' ' + act + ' ' + bk + ' (tem spoiler) no Livroverso';
  const ex = String(it.text || it.quote || '').trim(); return who + ' ' + act + ' ' + bk + ' no Livroverso' + (ex ? ': “' + (ex.length > 140 ? ex.slice(0, 137) + '…' : ex) + '”' : '');
}
function rdShareMenu(it, anchor) {
  const items = [{ label: 'Enviar para um amigo', fn: () => rdSendToFriend(it) }, { label: 'Compartilhar fora do app', fn: async () => {
    const text = rdShareText(it);
    try { if (navigator.share) { await navigator.share({ title: 'Livroverso', text, url: RD_APP_URL }); return; } } catch (err) { if (err && err.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(text + ' ' + RD_APP_URL); toast('Texto copiado'); } catch { toast('Não consegui compartilhar agora'); }
  } }];
  if (anchor && typeof popMenu === 'function') return popMenu(anchor, items);
  sheet('Compartilhar', items.map((x) => [x.label, x.fn]));
}
function rdPostToken(it) {
  const u = it.user || {}, b = it.book || {};
  const d = { t: it.type, id: it.id, h: u.handle || '', n: u.displayName || '', b: b.title || '', a: b.author || '', c: b.cover && String(b.cover).length < 300 ? b.cover : '', x: String(it.text || '').slice(0, 220), q: String(it.quote || '').slice(0, 220), pg: it.page || 0, p: it.readerPct != null ? Math.round(it.readerPct) : null, s: it.paws || 0, sp: it.spoiler || null, k: it.kind || '' };
  return '[lvp:' + btoa(unescape(encodeURIComponent(JSON.stringify(d)))) + ']';
}
function rdSendToFriend(it) {
  const fr = (SOC.fr && SOC.fr.friends) || [];
  if (!fr.length) return toast('Adicione amigos para enviar posts');
  sheet('Enviar para', fr.slice(0, 40).map((f) => [f.displayName || '@' + f.handle, async () => {
    const body = rdShareText(it) + '\n' + rdPostToken(it);
    if (body.length > 1000) return toast('Post grande demais para enviar');
    try { const r = await sapi('POST', '/v1/messages', { handle: f.handle, body, bookTitle: it.spoiler && it.book ? String(it.book.title).slice(0, 200) : null });
      toast(r.status === 201 ? 'Enviado para ' + (f.displayName || '@' + f.handle) : 'Não consegui enviar agora'); } catch { toast('Não consegui enviar agora'); }
  }]));
}
// na conversa, a mensagem com post vira um cartãozinho; tocar abre o post com as respostas
{ const st = document.createElement('style'); st.textContent = '.bub .rdm{display:grid;grid-template-columns:40px minmax(0,1fr);gap:.5rem;margin:.1rem 0 .2rem;padding:.45rem;border-radius:12px;background:color-mix(in srgb,var(--panel) 80%,transparent);border:1px solid var(--line);text-align:left;color:var(--ink);font:inherit;width:100%;cursor:pointer}.bub .rdm .cv{width:40px!important;height:60px!important;border-radius:4px!important;font-size:.36rem!important}.bub .rdm b{display:block;font-size:.8rem}.bub .rdm small{display:block;font-size:.7rem;color:var(--ink-2)}.bub .rdm p{margin:.2rem 0 0;font-size:.78rem;line-height:1.3;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}'; TR.append(st);
  let tm = 0; const paint = () => TR.querySelectorAll('.bub').forEach((b) => {
    if (b.dataset.rdm) return; const m = b.textContent.match(/\[lvp:([A-Za-z0-9+/=]+)\]/); if (!m) return; b.dataset.rdm = '1';
    let d = null; try { d = JSON.parse(decodeURIComponent(escape(atob(m[1])))); } catch { return; }
    const it = { type: d.t, id: d.id, kind: d.k, user: { handle: d.h, displayName: d.n }, book: { title: d.b, author: d.a, cover: d.c || null, key: normT(d.b) }, text: d.x, quote: d.q, page: d.pg, readerPct: d.p, paws: d.s, spoiler: d.sp, createdAt: new Date().toISOString() };
    const sm = b.querySelector('small'), time = sm ? sm.outerHTML : '';
    b.innerHTML = '<button type="button" class="rdm">' + cvh(d.b, d.c || null, '') + '<span><b>' + esc(d.b) + '</b><small>' + esc((d.n || '@' + d.h) + (d.t === 'review' ? ' · avaliou' : ' · post na Comunidade')) + '</small>' + (d.sp ? '<p>Tem spoiler · toque para abrir</p>' : (d.x || d.q ? '<p>' + esc(d.x || '“' + d.q + '”') + '</p>' : '')) + '</span></button>' + time;
    try { paintCv(b); } catch {}
    b.querySelector('.rdm').addEventListener('click', () => { try { $('#shelflist').hidden = false; openRdThread(it); } catch {} });
  });
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 60); }).observe(TR, { childList: true, subtree: true }); }
async function rdLoadImages(root) {
  S.rdImg = S.rdImg || {};
  for (const n of $$('[data-img]', root)) {
    const id = n.dataset.img; if (n.dataset.done) continue; n.dataset.done = '1';
    if (!S.rdImg[id]) { try { const r = await sapi('GET', `/v1/posts/${id}/image`); if (r.status === 200 && r.data && /^data:image\//.test(r.data.image)) S.rdImg[id] = r.data.image; } catch {} }
    if (S.rdImg[id]) { const im = document.createElement('img'); im.alt = 'Foto do post'; im.src = S.rdImg[id]; n.append(im); }
  }
}
function rdBind(root, list, after) { // liga os botões dos cartões
  $$('.rd-card', root).forEach((c) => {
    const it = list[+c.dataset.i]; if (!it) return;
    c.querySelector('.rd-veil')?.addEventListener('click', () => { (S.rdOpen = S.rdOpen || new Set()).add(it.type + it.id); after(); });
    c.querySelector('.rd-rehide')?.addEventListener('click', () => { S.rdOpen && S.rdOpen.delete(it.type + it.id); after(); });
    c.querySelector('.rd-who')?.addEventListener('click', () => { if (it.user && it.user.handle) friendPage(it.user.handle); });
    c.querySelectorAll('.rd-book').forEach((x) => x.addEventListener('click', () => openAnyBook(it.book.title, it.book.author, it.book.cover)));
    c.querySelector('.rd-more')?.addEventListener('click', (ev) => rdMenu(it, after, ev.currentTarget));
    c.querySelector('.rd-like')?.addEventListener('click', async (ev) => {
      const b = ev.currentTarget, on = !it.liked; it.liked = on; it.likes = Math.max(0, (it.likes || 0) + (on ? 1 : -1));
      b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.innerHTML = '<img class="rd-hi" src="img/bt_curtir.webp" alt="">' + (it.likes || '');
      const base = it.type === 'review' ? `/v1/reviews/${it.id}/like` : `/v1/posts/${it.id}/like`;
      try { const r = await sapi(on ? 'POST' : 'DELETE', base); if (r.status >= 300) throw 0; } catch { toast('Não consegui agora'); }
    });
    c.querySelector('.rd-rp')?.addEventListener('click', () => openRdThread(it));
    c.querySelector('.rd-save')?.addEventListener('click', (ev) => { const on = rdToggleSave(it), b = ev.currentTarget; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); if (!on && S.rdF === 'salvos') after(); });
    c.querySelector('.rd-share')?.addEventListener('click', (ev) => rdShareMenu(it, ev.currentTarget));
    c.querySelector('.rd-ql')?.addEventListener('click', (ev) => { const b = ev.currentTarget; if (b.classList.contains('in')) return openAnyBook(it.book.title, it.book.author, it.book.cover);
      try { addToLibrary({ title: it.book.title, author: it.book.author || null, cover: it.book.cover || null }, null, 'QUERO'); } catch {} b.classList.add('in'); b.textContent = '✓ Na sua fila'; });
  });
  paintCv(root); rdLoadImages(root);
}
function rdVisible(items) {
  const P = rdPrefs(), reading = new Set(lib().filter((e) => e.status === 'LENDO').map((e) => normT(e.title)));
  return items.filter((it) => !P.hide.includes(it.type + it.id) && !(it.book && P.mute.includes(it.book.key)) && !(it.user && it.user.handle && P.muteU.includes(String(it.user.handle).toLowerCase())) && !(P.hideReading && !it.mine && it.book && reading.has(it.book.key)));
}
async function rdLoad(more) {
  if (!connected() || !socialProfile || S.rd.busy) return; S.rd.busy = true;
  const before = more && S.rd.items.length ? S.rd.items[S.rd.items.length - 1].createdAt : null;
  try {
    const r = await sapi('GET', '/v1/rede' + (before ? '?before=' + encodeURIComponent(before) : ''));
    if (r.status === 200 && r.data) { const seen = new Set(more ? S.rd.items.map((x) => x.type + x.id) : []); const neu = (r.data.items || []).filter((x) => !seen.has(x.type + x.id));
      S.rd.items = more ? [...S.rd.items, ...neu] : neu; S.rd.more = !!r.data.more && neu.length > 0; S.rd.admin = !!r.data.admin; S.rd.at = Date.now(); S.rd.err = false; }
    else S.rd.err = true;
  } catch { S.rd.err = true; } finally { S.rd.busy = false; }
  paintRede();
}
const RD_PROMPTS = ['Que página te pegou hoje?', 'Qual personagem você levaria para casa?', 'Um trecho que você não esquece', 'Que livro você indicaria para quem amou o último que leu?', 'Que final te deixou sem chão?', 'Pergunte à comunidade o que ler depois'];
const RD_DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function rdDayLbl(iso) { const d = new Date(iso); if (isNaN(d)) return ''; const k = (x) => x.getFullYear() + '-' + x.getMonth() + '-' + x.getDate(), now = new Date(), y = new Date(Date.now() - 864e5);
  if (k(d) === k(now)) return 'Hoje'; if (k(d) === k(y)) return 'Ontem'; const diff = (now - d) / 864e5; return diff < 7 ? RD_DOW[d.getDay()] : String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + (d.getFullYear() !== now.getFullYear() ? '/' + d.getFullYear() : ''); }
function rdDays(list) { let last = ''; return list.map((it, i) => { const d = rdDayLbl(it.createdAt), h = d && d !== last ? '<div class="rd-day">' + esc(d) + '</div>' : ''; if (d) last = d; return h + rdCardHTML(it, i); }).join(''); }
function rdFiltersSheet() {
  const P = rdPrefs(), wrap = document.createElement('div'); wrap.className = 'sheet rdf-sheet';
  wrap.innerHTML = '<div class="box"><h3>Comunidade</h3>'
    + '<label class="rdf-row"><span><b>Esconder livros que estou lendo</b><small>Tira da Comunidade os posts sobre os livros que você está lendo, mesmo os que não foram marcados como spoiler.</small></span><input type="checkbox" id="rdf-hr"' + (P.hideReading ? ' checked' : '') + '></label>'
    + '<button type="button" class="rdf-row" id="rdf-mu"><span><b>Pessoas silenciadas</b><small>' + (P.muteU.length ? P.muteU.length + (P.muteU.length > 1 ? ' pessoas · toque para rever' : ' pessoa · toque para rever') : 'Ninguém silenciado. Para silenciar, use o ••• do post.') + '</small></span><em>›</em></button>'
    + (S.rd.admin ? '<button type="button" class="rdf-row" id="rdf-mod"><span><b>Denúncias</b><small>Moderação: posts denunciados para revisar</small></span><em>›</em></button>' : '')
    + '<button type="button" class="cancel" id="rdf-ok">Pronto</button></div>';
  const close = () => { wrap.remove(); paintRede(); try { if (S.comSeg === 'amigos') paintAmigos(); } catch {} };
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });
  document.body.append(wrap);
  wrap.querySelector('#rdf-hr').addEventListener('change', (e) => rdSetPref('rdHideReading', e.target.checked));
  wrap.querySelector('#rdf-ok').addEventListener('click', close);
  wrap.querySelector('#rdf-mod')?.addEventListener('click', () => { wrap.remove(); openRdMod(); });
  wrap.querySelector('#rdf-mu').addEventListener('click', () => { const M = rdPrefs().muteU; if (!M.length) return; wrap.remove();
    sheet('Silenciados · toque para voltar a ver', M.map((h) => ['@' + h, () => { rdSetPref('rdMuteU', rdPrefs().muteU.filter((x) => x !== h)); toast('Você voltou a ver @' + h); paintRede(); }])); });
}
{ const st = document.createElement('style'); st.textContent = '.rdf-sheet .rdf-row{display:flex;align-items:center;gap:.8rem;width:100%;text-align:left;padding:.75rem .2rem;border:0;border-bottom:1px solid var(--line,#e8d9c6);background:none;font:inherit;color:inherit;cursor:pointer}.rdf-sheet .rdf-row span{flex:1}.rdf-sheet .rdf-row b{display:block;font-size:.95rem}.rdf-sheet .rdf-row small{display:block;font-size:.78rem;opacity:.75;margin-top:.15rem;line-height:1.3}.rdf-sheet .rdf-row input{width:22px;height:22px;flex:none;accent-color:var(--acc,#c46f2b)}.rdf-sheet .rdf-row em{font-style:normal;font-weight:900;opacity:.6}'; document.head.append(st); }
function paintRede() {
  const host = $('#lista #rd-host'); if (!host) return;
  if (!connected() || !socialProfile) { host.innerHTML = `<p class="rd-empty">Entre na sua conta para ver e postar na Comunidade.</p>`; return; }
  const F = S.rdF || 'tudo', base = F === 'salvos' ? rdSavedList().map((x) => x.it) : rdVisible(S.rd.items);
  const P = rdPrefs(), list = F === 'lendo' ? base.filter((x) => x.type !== 'review') : F === 'aval' ? base.filter((x) => x.type === 'review') : base, pr = RD_PROMPTS[Math.floor(Date.now() / 3600000) % RD_PROMPTS.length];
  host.innerHTML = `<button type="button" class="rd-new" id="rd-new"><i>+</i><span><b>${esc(pr)}</b><small>Comentário, trecho, pergunta ou indicação</small></span></button>
    <div class="rd-fl">${[['tudo', 'Tudo'], ['lendo', 'Lendo'], ['aval', 'Avaliações'], ['salvos', 'Salvos']].map(([k, n]) => `<button type="button" data-f="${k}" class="${F === k ? 'on' : ''}">${n}</button>`).join('')}</div>
    ${list.length ? rdDays(list) : `<p class="rd-empty">${F === 'salvos' ? 'Toque no marca-página de um post para guardar e voltar nele depois.' : S.rd.busy || !S.rd.at ? 'Carregando a Comunidade…' : S.rd.err ? 'Não consegui carregar agora. Tente de novo em instantes.' : F !== 'tudo' ? 'Nada por aqui ainda.' : 'Ainda não tem nada aqui. Que tal começar a conversa?'}</p>`}
    ${S.rd.more && F !== 'salvos' ? '<button type="button" class="rd-moreb" id="rd-moreb">Ver mais</button>' : ''}`;
  $$('.rd-fl [data-f]', host).forEach((b) => b.addEventListener('click', () => { S.rdF = b.dataset.f; paintRede(); }));
  $('#rd-new', host).addEventListener('click', () => openRdComposer());

  $('#rd-moreb', host)?.addEventListener('click', () => rdLoad(true));
  rdBind(host, list, paintRede);
}
function rdMenu(it, after, anchor) {
  const u = it.user || {}, items = [];
  if (it.type === 'activity' || it.type === 'achievement') {
    if (!it.mine) { items.push(['Ocultar', () => { rdSetPref('rdHide', [...rdPrefs().hide, it.type + it.id].slice(-300)); toast('Ocultado'); after(); }]);
      if (u.handle) items.push([`Silenciar @${u.handle}`, () => { rdSetPref('rdMuteU', [...new Set([...rdPrefs().muteU, String(u.handle).toLowerCase()])].slice(-300)); toast(`Você não verá mais os posts de @${u.handle}`); after(); }]); }
    if (it.book) items.push(['Ver o livro', () => openAnyBook(it.book.title, it.book.author, it.book.cover)]);
    if (!items.length) return;
    if (anchor && typeof popMenu === 'function') return popMenu(anchor, items.map(([label, fn]) => ({ label, fn })));
    return sheet('Novidade', items);
  }
  // minha avaliação: editar direto daqui (Bia, 17/11)
  if (it.mine && it.type === 'review') { const le = lib().find((x) => x.id === it.libId) || lib().find((x) => it.book && bookKeyRede(x.title) === bookKeyRede(it.book.title)); if (le) items.push(['Editar avaliação', () => rateForm(le, { logs: [] }, () => { try { after(); } catch {} })]); }
  if (it.mine || S.rd.admin) items.push([it.mine ? 'Apagar' : 'Apagar (moderação)', async () => {
    if (!confirm('Apagar este post?')) return;
    const r = it.type === 'review' ? (it.mine ? await sapi('DELETE', `/v1/reviews/${encodeURIComponent(it.libId)}`) : await sapi('POST', `/v1/admin/review/${it.id}/remove`)) : await sapi('DELETE', `/v1/posts/${it.id}`);
    if (r.status < 300) { S.rd.items = S.rd.items.filter((x) => !(x.type === it.type && x.id === it.id)); toast('Apagado'); after(); } else toast('Não consegui apagar agora');
  }, 'danger']);
  if (!it.mine) {
    items.push(['Ocultar este post', () => { rdSetPref('rdHide', [...rdPrefs().hide, it.type + it.id].slice(-300)); toast('Post ocultado'); after(); }]);
    if (u.handle) items.push([`Silenciar @${u.handle}`, () => { rdSetPref('rdMuteU', [...new Set([...rdPrefs().muteU, String(u.handle).toLowerCase()])].slice(-300)); toast(`Você não verá mais os posts de @${u.handle}`); after(); }]); // silenciar = parar de ver a pessoa (Bia, 17/11)
    items.push(['Denunciar', () => sheet('Por que denunciar?', [['Spoiler sem aviso', 'spoiler'], ['Ofensa ou ataque', 'ofensa'], ['Spam ou propaganda', 'spam'], ['Outro motivo', 'outro']].map(([t, k]) => [t, async () => {
      const r = await sapi('POST', `/v1/report/${it.type}/${it.id}`, { reason: k }); toast(r.status < 300 ? 'Denúncia enviada. Vamos analisar.' : 'Não consegui enviar agora');
      if (r.status < 300) { rdSetPref('rdHide', [...rdPrefs().hide, it.type + it.id].slice(-300)); after(); } }]))]);
    if (u.handle) items.push([`Bloquear @${u.handle}`, async () => {
      if (!confirm(`Bloquear @${u.handle}? Vocês deixam de ver os posts um do outro e a amizade é desfeita.`)) return;
      const r = await sapi('POST', `/v1/blocks/${encodeURIComponent(u.handle)}`);
      if (r.status < 300) { S.rd.items = S.rd.items.filter((x) => !(x.user && x.user.handle === u.handle)); toast(`@${u.handle} bloqueado`); after(); } else toast('Não consegui agora');
    }, 'danger']);
  }
  if (it.book) items.push(['Ver o livro', () => openAnyBook(it.book.title, it.book.author, it.book.cover)]);
  if (anchor && typeof popMenu === 'function') return popMenu(anchor, items.map(([label, fn, cls]) => ({ label, fn, danger: cls === 'danger' })));
  sheet(it.type === 'review' ? 'Avaliação' : 'Post', items);
}
// ---------- fio de respostas ----------
function openRdThread(it) {
  const v = $('#shelflist'); let reps = null, busy = false;
  const isRev = it.type === 'review';
  const load = async () => {
    try { const r = await sapi('GET', isRev ? `/v1/reviews/${it.id}/comments` : `/v1/posts/${it.id}/replies`); reps = r.status === 200 && r.data ? (r.data.items || []).map((x) => ({ type: 'reply', ...x, user: x.user || {}, createdAt: x.createdAt })) : []; } catch { reps = []; }
    draw();
  };
  const repHTML = (x, i) => { const sp = x.spoiler && !x.mine && !(S.rdOpen && S.rdOpen.has('reply' + x.id)) ? rdSpoil({ ...x, type: 'reply', book: it.book, spoiler: x.spoiler }) : null;
    return `<div class="rd-rep" data-r="${i}"><span class="av sm" data-avh="${esc(x.user.handle || '')}" style="background:${friendColor(x.user.handle || '')}">${esc(initial(x.user.displayName))}</span>
      <div><b style="font-size:.84rem">${esc(x.user.displayName || '')}</b> <small style="color:var(--ink-2);font-size:.74rem">@${esc(x.user.handle || '')} · ${esc(relTime(x.createdAt))}</small>
      <div class="rd-body${sp ? ' spoil' : ''}"><p>${esc(x.text || '')}</p>${sp ? `<button type="button" class="rd-veil" data-ro="${i}"><i class="rd-eye" aria-hidden="true"></i><b>${esc(sp.label)}</b><u>Mostrar mesmo assim</u></button>` : ''}</div></div>
      ${x.canDelete ? `<button type="button" class="rd-more" data-del="${i}" aria-label="Apagar resposta">×</button>` : '<span></span>'}</div>`; };
  const draw = () => {
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Conversa</b><span></span></div>
      ${rdCardHTML(it, 0, { noFoot: true })}
      <div>${reps === null ? '<p class="rd-empty">Carregando respostas…</p>' : reps.length ? reps.map(repHTML).join('') : '<p class="rd-empty">Ninguém respondeu ainda.</p>'}</div>
      <form class="rd-form" id="rd-f"><textarea id="rd-t" rows="2" maxlength="${isRev ? 500 : 280}" placeholder="Responder…"></textarea>
        <div class="rd-row">${isRev ? '<span></span>' : '<label style="display:flex;gap:.35rem;align-items:center"><input type="checkbox" id="rd-sp"> Minha resposta tem spoiler</label>'}<button type="submit" class="rd-send">Enviar</button></div></form>`;
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    rdBind(v, [it], draw);
    $$('[data-ro]', v).forEach((b) => b.addEventListener('click', () => { (S.rdOpen = S.rdOpen || new Set()).add('reply' + reps[+b.dataset.ro].id); draw(); }));
    $$('[data-del]', v).forEach((b) => { b.setAttribute('aria-label', 'Apagar resposta'); b.addEventListener('click', () => { const x = reps[+b.dataset.del]; v9Ask(b, 'Apagar resposta', async () => {
      const r = await sapi('DELETE', isRev ? `/v1/comments/${x.id}` : `/v1/posts/${x.id}`); if (r.status < 300) { reps.splice(reps.indexOf(x), 1); it.replies = Math.max(0, (it.replies || 1) - 1); draw(); toast('Resposta apagada'); } else toast('Não consegui apagar agora'); }); }); });
    $('#rd-f', v).addEventListener('submit', async (ev) => {
      ev.preventDefault(); if (busy) return; const t = $('#rd-t', v).value.trim(); if (!t) return;
      busy = true; const sp = !isRev && $('#rd-sp', v).checked;
      try {
        const r = await sapi('POST', isRev ? `/v1/reviews/${it.id}/comments` : `/v1/posts/${it.id}/replies`, isRev ? { text: t } : { text: t, ...(sp ? { spoiler: { kind: it.spoiler && it.spoiler.kind !== 'yes' ? it.spoiler.kind === 'end' ? 'end' : 'yes' : 'yes' } } : {}) });
        if (r.status === 403) toast('Só amizades podem responder avaliações'); else if (r.status >= 300) toast('Não consegui enviar agora');
        else { it.replies = (it.replies || 0) + 1; await load(); }
      } catch { toast('Não consegui enviar agora'); } finally { busy = false; }
    });
    paintCv(v);
  };
  S.listRedraw = draw; S.navView = { t: 'rdthread', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0; syncTopTitle(); load();
}
{ const _o = openRdThread; openRdThread = function () { navEnter(() => openRdThread(...arguments)); S.nav.depth++; try { return _o.apply(this, arguments); } finally { S.nav.depth--; } }; }
// ---------- postar ----------
const RD_SPOIL_RE = /\b(morre|morreu|morrem|mata|matou|assassin[oa] (é|era)|no final|o final|final (é|foi)|descobre que|revela que|reviravolta|plot twist|termina com|acaba com|no fim)\b/i;
function rdPlaceholder(k, b) {
  if (!b && (k === 'comment' || !k)) return 'O que você quer compartilhar?'; // post sem livro (Bia, 21/11)
  const t = b ? `“${b.title}”` : 'esse livro';
  return k === 'quote' ? 'O que esse trecho fez com você?' : k === 'question' ? (b ? `Pergunte à comunidade sobre ${t}` : 'Alguém leu…? Me indiquem um…') : k === 'rec' ? 'Por que quem gostou de um vai gostar do outro?' : `O que ${t} te fez sentir?`;
}
function rdPickBook(title, onPick) {
  const L = lib().filter((e) => e.title), byS = (s) => L.filter((e) => e.status === s);
  const opts = [...byS('LENDO'), ...byS('LIDO').slice(-8).reverse(), ...byS('QUERO_LER').slice(0, 4)].slice(0, 12);
  const asBook = (e) => ({ title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: smallCoverOk(e.cover) });
  sheet(title, [...opts.map((e) => [`${e.title}${e.status === 'LENDO' ? ' · lendo' : ''}`, () => onPick(asBook(e))]),
    ['Buscar outro livro…', () => searchSheet({ title, onPick: (it) => onPick({ title: String(it.title).slice(0, 200), author: it.author ? String(it.author).slice(0, 120) : null, cover: smallCoverOk(it.cover) }) })]]);
}
const smallCoverOk = (c) => (typeof c === 'string' && (/^https:\/\//.test(c) || (/^data:image\/(jpeg|png|webp);base64,/.test(c) && c.length <= 60000))) ? c : null;
function rdShrink(file) { // foto: no máximo 1280 px, JPEG, até ~300 KB
  return new Promise((res, rej) => { const fr = new FileReader(); fr.onerror = rej; fr.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => {
    let w = im.width, h = im.height; const m = Math.max(w, h); if (m > 1280) { w = Math.round(w * 1280 / m); h = Math.round(h * 1280 / m); }
    const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h);
    let q = 0.82, out = c.toDataURL('image/jpeg', q); while (out.length > 390000 && q > 0.4) { q -= 0.1; out = c.toDataURL('image/jpeg', q); }
    if (out.length > 390000) { const c2 = document.createElement('canvas'); c2.width = Math.round(w * .7); c2.height = Math.round(h * .7); c2.getContext('2d').drawImage(c, 0, 0, c2.width, c2.height); out = c2.toDataURL('image/jpeg', .7); }
    res(out); }; im.src = fr.result; }; fr.readAsDataURL(file); });
}
// Spoiler do post (Bia, 21/11): um interruptor só; o app decide até onde cobre. Trecho compartilhado é sempre spoiler.
function rdAutoSp(R) {
  if (R.kind === 'quote' && R.book) { const pg = Math.round(Number(R.page)) || 0; return { on: true, forced: true, spoiler: pg > 0 ? { kind: 'page', at: pg } : { kind: 'yes' }, line: 'Trechos compartilhados ficam cobertos para quem ainda não chegou nesta parte.' }; }
  if (!R.sp) return { on: false, line: R.book ? 'Ligue se o post contar algo do enredo.' : 'Ligue se o post contar algo de algum livro.' };
  const e = R.book ? myBookByKey(normT(R.book.title)) : null;
  if (e && e.status === 'LENDO') { const pg = Number(libProgress(e)) || 0; if (pg > 0) return { on: true, spoiler: { kind: 'page', at: pg }, line: `Fica coberto para quem ainda não chegou na pág. ${pg}.` }; }
  return { on: true, spoiler: e && e.status === 'LIDO' ? { kind: 'end' } : { kind: 'yes' }, line: 'Fica coberto para quem não terminou o livro.' };
}
function openRdComposer(pre = {}) {
  const v = $('#shelflist');
  const R = Object.assign({ kind: 'comment', book: null, book2: null, text: '', quote: '', page: '', feelings: [], paws: null, image: null, vis: 'public', sp: false, spk: 'page', spat: '' }, pre);
  let busy = false;
  // post num campo só (Bia, 18/11): livro, texto e uma fileira de "acrescentar" (trecho, pergunta, indicar outro livro,
  // sentimentos, nota, foto, spoiler). O tipo do post sai do que foi acrescentado; nada de escolher entre 4 tipos antes.
  const OPEN = { fe: R.feelings.length > 0, pw: !!R.paws };
  const HINT = { comment: 'Comentário sobre o livro.', quote: 'Trecho: a frase do livro aparece em destaque, com a página.', question: 'Pergunta: quem lê pode responder no post.', rec: 'Indicação: “se você gostou de um, leia o outro”.' };
  const draw = () => {
    const cur = $('#rdc-t', v); if (cur) R.text = cur.value; const q = $('#rdc-q', v); if (q) R.quote = q.value; const pg = $('#rdc-pg', v); if (pg) R.page = pg.value; const sa = $('#rdc-spat', v); if (sa) R.spat = sa.value;
    const bkLine = (b, id, lbl) => b ? `<div class="rdc2-bk">${cvh(b.title, b.cover)}<span><b>${esc(b.title)}</b><small>${esc(b.author || '')}</small></span><button type="button" data-pick="${id}" class="rdc2-sw">Trocar</button></div>`
      : `<button type="button" class="rdc2-pick" data-pick="${id}"><span><i class=v3e data-i=ler></i></span>${lbl}</button>`;
    const stars = [1, 2, 3, 4, 5].map((n) => `<button type="button" data-pw="${n}" class="${R.paws && n <= R.paws ? 'on' : ''}" aria-label="nota ${n}">★</button>`).join('');
    const tool = (k, ic, n, on, dis) => `<button type="button" class="rdc2-t${on ? ' on' : ''}" data-t="${k}"${dis ? ' disabled' : ''}><span>${ic}</span>${n}</button>`;
    const fNames = R.feelings.map((k) => (QT_FEELS.find((y) => y[0] === k) || [, k])[1]);
    let me = ''; try { me = socialProfile && socialProfile.handle ? '@' + socialProfile.handle : ''; } catch {}
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Novo post</b><span></span></div>
      <div class="rdc2">
        ${bkLine(R.book, 1, R.kind === 'quote' || R.kind === 'rec' || R.paws || R.feelings.length ? 'Escolher o livro' : 'Escolher livro (opcional)')}
        ${R.kind === 'rec' ? `<div class="rdc2-rec"><span>Se você gostou deste, leia:</span>${bkLine(R.book2, 2, 'Escolher o livro indicado')}</div>` : ''}
        ${R.kind === 'quote' ? `<div class="rdc2-q"><textarea id="rdc-q" rows="3" maxlength="600" placeholder="Copie aqui a frase do livro">${esc(R.quote)}</textarea><label>pág. <input type="number" id="rdc-pg" min="1" inputmode="numeric" value="${esc(R.page)}"></label></div>` : ''}
        ${R.desafio ? `<div class="rdc2-tags rdc-des"><span>${typeof V6DEB !== "undefined" ? V6DEB.nome : "Debate semanal"} · ${esc(R.desafio)}<button type="button" id="rdc-desx" aria-label="Tirar a marca do debate">×</button></span></div>` : ''}
        <div class="rdc2-tx"><textarea id="rdc-t" rows="4" maxlength="320" placeholder="${esc(rdPlaceholder(R.kind, R.book))}">${esc(R.text)}</textarea><div class="rdc-cnt" id="rdc-c"></div></div>
        ${fNames.length && !OPEN.fe ? `<div class="rdc2-tags">${fNames.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : ''}
        ${R.paws && !OPEN.pw ? `<div class="rdc2-tags"><span>★ nota ${R.paws}</span></div>` : ''}
        ${R.image ? `<div class="rdc2-ph"><img src="${R.image}" alt="Foto escolhida"><button type="button" id="rdc-rmph" aria-label="Tirar a foto">×</button><button type="button" id="rdc-edph" class="rdc-edph">Editar</button></div>` : ''}
        <div class="rdc2-l">Acrescentar</div>
        <div class="rdc2-tools">
          ${tool('quote', '<i class=v3e data-i=quote></i>', 'Trecho', R.kind === 'quote')}${tool('question', '<i class=v3e data-i=ask></i>', 'Pergunta', R.kind === 'question')}${tool('rec', '<i class=v3e data-i=arrow></i>', 'Indicar outro livro', R.kind === 'rec')}
          ${tool('fe', '<i class=v3e data-i=heart></i>', R.feelings.length ? 'Sentimentos · ' + R.feelings.length : 'Sentimentos', OPEN.fe || R.feelings.length > 0, R.kind === 'question' || !R.book)}${tool('pw', '<i class=v3e data-i=star></i>', 'Nota', OPEN.pw || !!R.paws, R.kind !== 'comment' || !R.book)}
          ${tool('ph', '<i class=v3e data-i=scan></i>', 'Foto', !!R.image)}
        </div>
        <p class="rdc2-hint">${HINT[R.kind]}</p>
        ${OPEN.fe && R.kind !== 'question' ? `<div class="rdc2-box"><div class="rdc2-l">O que você sentiu? <small>(até 3)</small></div><div class="rdc-chips" id="rdc-fe">${QT_PICK.map((y) => qtFeel(y[0], 'rdf', R.feelings.includes(y[0]))).join('')}</div></div>` : ''}
        ${OPEN.pw && R.kind === 'comment' ? `<div class="rdc2-box"><div class="rdc2-l">Sua nota <small>(toque de novo para tirar)</small></div><div class="rdc2-st">${stars}</div></div>` : ''}
        <input type="file" id="rdc-file" accept="image/*" hidden>
        ${(() => { const A = rdAutoSp(R); return `<div class="rdc2-box rdc-sp"><label class="rdc-spt"><span><b>Tem spoiler</b><small id="rdc-spl">${esc(A.line)}</small></span><input type="checkbox" id="rdc-sp" role="switch"${A.on ? ' checked' : ''}${A.forced ? ' disabled' : ''}></label></div>`; })()}
        <div class="rdc2-foot"><button type="button" class="rdc2-vis" id="rdc-vis" aria-label="Quem vê: ${R.vis === 'friends' ? 'Só amizades' : 'Toda a comunidade'}">${R.vis === 'friends' ? '<i class=v3e data-i=friends></i>Amizades' : '<i class=v3e data-i=globe></i>Comunidade'} <i>▾</i></button><button type="button" class="rdc-go" id="rdc-go">Publicar</button></div>
        ${me ? `<p class="rdc2-me">Publicando como ${esc(me)}</p>` : ''}
      </div>`;
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    const t = $('#rdc-t', v), cnt = $('#rdc-c', v), go = $('#rdc-go', v);
    const upd = () => { const n = t.value.length; cnt.textContent = n ? `${n}/280` : ''; cnt.classList.toggle('over', n > 280); go.disabled = n > 280; };
    t.addEventListener('input', upd); upd();
    $$('.rdc2-t', v).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.t;
      if (k === 'quote' || k === 'question' || k === 'rec') { R.kind = R.kind === k ? 'comment' : k; if (R.kind === 'question') { R.feelings = []; OPEN.fe = false; } if (R.kind !== 'comment') { R.paws = null; OPEN.pw = false; } }
      else if (k === 'fe') OPEN.fe = !OPEN.fe; else if (k === 'pw') OPEN.pw = !OPEN.pw;
      else if (k === 'ph') { if (R.image) R.image = null; else return $('#rdc-file', v).click(); }
      else if (k === 'sp') { R.sp = !R.sp; if (R.sp && !R.spk) R.spk = 'page'; }
      draw(); if (k === 'quote' && R.kind === 'quote') setTimeout(() => $('#rdc-q', v)?.focus(), 30); }));
    $$('[data-pick]', v).forEach((b) => b.addEventListener('click', () => rdPickBook(b.dataset.pick === '2' ? 'Livro indicado' : 'Escolha o livro', (bk) => { if (b.dataset.pick === '2') R.book2 = bk; else R.book = bk; draw(); })));
    $$('#rdc-fe [data-fe]', v).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.fe; if (R.feelings.includes(k)) R.feelings = R.feelings.filter((x) => x !== k); else if (R.feelings.length < 3) R.feelings.push(k); else return toast('Até 3 sentimentos'); draw(); }));
    $$('[data-pw]', v).forEach((b) => b.addEventListener('click', () => { const n = +b.dataset.pw; R.paws = R.paws === n ? null : n; draw(); }));
    $('#rdc-vis', v).addEventListener('click', (ev) => popMenu(ev.currentTarget, [{ label: '<i class=v3e data-i=globe></i>Toda a comunidade', fn: () => { R.vis = 'public'; draw(); } }, { label: '<i class=v3e data-i=friends></i>Só amizades', fn: () => { R.vis = 'friends'; draw(); } }]));
    $('#rdc-sp', v)?.addEventListener('change', (ev) => { R.sp = ev.target.checked; draw(); });
    $('#rdc-pg', v)?.addEventListener('change', () => { if (R.kind === 'quote') draw(); });
    $('#rdc-rmph', v)?.addEventListener('click', () => { R.image = null; draw(); });
    $('#rdc-edph', v)?.addEventListener('click', () => { const i = $('#rdc-file', v); if (!(window.lvReeditPhoto && i && window.lvReeditPhoto(i, 'post'))) i && i.click(); });
    $('#rdc-desx', v)?.addEventListener('click', () => { R.desafio = null; draw(); });
    $('#rdc-file', v).addEventListener('change', async (ev) => { const f = ev.target.files && ev.target.files[0]; if (!f) return; try { R.image = await rdShrink(f); draw(); } catch { toast('Não consegui usar essa foto'); } });
    go.addEventListener('click', () => publish(false));
    paintCv(v);
  };
  const publish = async (skipCheck) => {
    if (busy) return; const t = $('#rdc-t', v); R.text = t.value.trim(); const q = $('#rdc-q', v); if (q) R.quote = q.value.trim(); const pg = $('#rdc-pg', v); if (pg) R.page = pg.value;
    const sa = $('#rdc-spat', v); if (sa && !sa.disabled) R.spat = sa.value;
    // livro é opcional para texto, foto e enquete; obrigatório para trecho, indicação, nota e sentimentos (Bia, 21/11)
    if (!R.book && (R.kind === 'quote' || R.kind === 'rec' || R.paws || R.feelings.length)) return toast('Escolha o livro');
    if (R.kind === 'rec' && !R.book2) return toast('Escolha o livro indicado');
    if (R.kind === 'quote' && !R.quote) return toast('Escreva o trecho');
    if (!R.text && !R.quote && !R.image && !R.book2 && !R.poll) return toast('Escreva alguma coisa');
    if (R.text.length > 280) return toast('Use até 280 letras');
    const AS = rdAutoSp(R);
    // spoiler = um interruptor (Bia, 21/11): desligado e com livro, confirma antes de publicar
    if (!skipCheck && !AS.on && R.book) return sheet('Seu post não conta nada do enredo?', [['Não tem spoiler, publicar', () => publish(true)], ['Marcar como spoiler', () => { R.sp = true; publish(true); }]]);
    const AS2 = rdAutoSp(R); const spoiler = AS2.on ? AS2.spoiler : null;
    const desPre = R.desafio ? `Desafio da semana: ${R.desafio}\n` : '';
    if ((desPre + R.text).length > 280) return toast(`Use até ${280 - desPre.length} letras`);
    const body = { kind: R.kind, text: desPre + R.text, visibility: R.vis, feelings: R.feelings, ...(R.book ? { book: R.book } : {}), ...(R.kind === 'rec' ? { book2: R.book2 } : {}),
      ...(R.kind === 'quote' ? { quote: R.quote.slice(0, 600), ...(Number(R.page) > 0 ? { page: Math.round(Number(R.page)) } : {}) } : {}), ...(R.paws ? { paws: R.paws } : {}), ...(spoiler ? { spoiler } : {}), ...(R.image ? { image: R.image } : {}), ...(R.book && readerPctOf(R.book.title) != null ? { readerPct: readerPctOf(R.book.title) } : {}) };
    busy = true; const go = $('#rdc-go', v); if (go) { go.disabled = true; go.textContent = 'Publicando…'; }
    try {
      const r = await sapi('POST', '/v1/posts', body);
      if (r.status === 201) { toast('Publicado na Comunidade'); S.nav.st = []; S.nav.cur = null; v.hidden = true; S.comSeg = 'rede'; if (S.tab !== 'comunidade') goTab('comunidade'); else drawTab(); rdLoad(); return; }
      toast(r.status === 409 ? 'Crie seu @usuário primeiro' : r.status === 413 ? 'A foto ficou grande demais' : 'Não consegui publicar agora');
    } catch { toast('Não consegui publicar agora'); }
    busy = false; if (go) { go.disabled = false; go.textContent = 'Publicar'; }
  };
  if (!connected() || !socialProfile) return toast('Entre na sua conta para postar');
  S.listRedraw = draw; S.navView = { t: 'rdnew', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0; syncTopTitle();
}
{ const _o = openRdComposer; openRdComposer = function () { navEnter(() => openRdComposer(...arguments)); S.nav.depth++; try { return _o.apply(this, arguments); } finally { S.nav.depth--; } }; }
// ---------- moderação ----------
async function openRdMod() {
  const v = $('#shelflist'); let items = null;
  const draw = () => {
    v.querySelector('.sl-body').innerHTML = `<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Denúncias</b><span></span></div>
      ${items === null ? '<p class="rd-empty">Carregando…</p>' : items.length ? items.map((it, i) => `<div class="rdm-it">${rdCardHTML({ ...it, spoiler: null }, i, { noFoot: true })}
        <div class="rd-row"><span>${esc(it.reports.map((r) => `${r.reason} (${r.n})`).join(', '))}${it.hidden ? ' · fora do ar' : ''}</span><span style="display:flex;gap:.3rem"><button type="button" data-keep="${i}">Manter</button><button type="button" data-rm="${i}" style="color:#b3412e">Remover</button></span></div></div>`).join('') : '<p class="rd-empty">Nenhuma denúncia para revisar.</p>'}`;
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    const act = async (i, a) => { const it = items[i]; const r = await sapi('POST', `/v1/admin/${it.type === 'review' ? 'review' : 'post'}/${it.id}/${a}`); if (r.status < 300) { items.splice(i, 1); draw(); toast(a === 'keep' ? 'Mantido no ar' : 'Removido'); } else toast('Não consegui agora'); };
    $$('[data-keep]', v).forEach((b) => b.addEventListener('click', () => act(+b.dataset.keep, 'keep')));
    $$('[data-rm]', v).forEach((b) => b.addEventListener('click', () => act(+b.dataset.rm, 'remove')));
    paintCv(v); rdLoadImages(v);
  };
  S.listRedraw = draw; S.navView = { t: 'rdmod', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0; syncTopTitle();
  try { const r = await sapi('GET', '/v1/admin/reports'); items = r.status === 200 && r.data ? r.data.items || [] : []; } catch { items = []; }
  draw();
}
// ---------- abas Rede / Amigos na Comunidade ----------
{ const _dt = drawTab; drawTab = function () {
  const r = _dt.apply(this, arguments); const box = $('#lista');
  if (S.tab !== 'comunidade') { box.classList.remove('rd-on'); return r; }
  if (!box.querySelector('.rd-seg')) {
    const sp = box.querySelector('.gtop-sp');
    const html = `<div class="rd-seg" role="tablist"><button type="button" data-seg="rede" role="tab">Comunidade</button><button type="button" data-seg="amigos" role="tab">Amigos</button></div><div id="rd-host"></div>`;
    if (sp) sp.insertAdjacentHTML('afterend', html); else box.insertAdjacentHTML('afterbegin', html);
    $$('[data-seg]', box).forEach((b) => b.addEventListener('click', () => { S.comSeg = b.dataset.seg; segPaint(); }));
  }
  segPaint();
  return r;
}; }
function segPaint() {
  const box = $('#lista'); if (!box || S.tab !== 'comunidade') return;
  const rede = S.comSeg === 'rede'; box.classList.toggle('rd-on', rede);
  $$('[data-seg]', box).forEach((b) => { const on = b.dataset.seg === S.comSeg; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  const host = box.querySelector('#rd-host'); if (host) host.hidden = !rede;
  if (rede) { paintRede(); if (!S.rd.at || Date.now() - S.rd.at > 60000) rdLoad(); }
}

// estilo do post num campo só
{ const st = document.createElement('style'); st.textContent = `
.rdc2{display:grid;gap:.7rem;padding-bottom:1rem}
.rdc2-l{font-size:.74rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2)}.rdc2-l small{text-transform:none;letter-spacing:0;font-weight:700}
.rdc2-pick{display:flex;align-items:center;justify-content:center;gap:.5rem;width:100%;border:1.5px dashed var(--line);background:var(--panel);border-radius:14px;padding:.75rem;font:inherit;font-weight:900;color:var(--ink);cursor:pointer}
.rdc2-bk{display:grid;grid-template-columns:40px 1fr auto;gap:.6rem;align-items:center;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.45rem .6rem}
.rdc2-bk .cv{width:40px!important;height:60px!important;border-radius:3px 5px 5px 3px!important;font-size:.4rem!important}
.rdc2-bk b{display:block;font-size:.9rem;line-height:1.2}.rdc2-bk small{font-size:.74rem;color:var(--ink-2)}
.rdc2-sw{border:0;background:none;color:var(--acc);font:inherit;font-weight:900;font-size:.8rem;cursor:pointer}
.rdc2-rec{display:grid;gap:.35rem;padding:.6rem;border-radius:14px;background:color-mix(in srgb,var(--acc) 7%,transparent)}.rdc2-rec > span{font-size:.8rem;font-weight:800;color:var(--ink-2)}
.rdc2-q{display:grid;gap:.35rem;padding:.6rem .7rem;border-left:3px solid var(--acc);background:var(--panel);border-radius:0 14px 14px 0}
.rdc2-q textarea{border:0;background:none;font:inherit;font-style:italic;font-size:.95rem;resize:vertical;color:var(--ink);outline:none}
.rdc2-q label{font-size:.78rem;font-weight:800;color:var(--ink-2);display:flex;align-items:center;gap:.4rem}.rdc2-q input{width:90px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;padding:.25rem .4rem}
.rdc2-tx{position:relative}.rdc2-tx textarea{width:100%;box-sizing:border-box;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.8rem .9rem;font:inherit;font-size:1rem;color:var(--ink);resize:vertical;min-height:110px}
.rdc2-tx .rdc-cnt{position:absolute;right:.7rem;bottom:.45rem;font-size:.7rem;color:var(--ink-2)}
.rdc2-tags{display:flex;flex-wrap:wrap;gap:.35rem}.rdc2-tags span{font-size:.75rem;font-weight:800;padding:.2rem .6rem;border-radius:99px;background:color-mix(in srgb,var(--acc) 14%,transparent);color:var(--acc)}
.rdc2-ph{position:relative;width:max-content;max-width:100%}.rdc2-ph img{display:block;max-width:100%;max-height:220px;border-radius:14px}.rdc2-ph button{position:absolute;top:6px;right:6px;width:30px;height:30px;border-radius:50%;border:0;background:rgba(0,0,0,.6);color:#fff;font-size:1.1rem;cursor:pointer}
.rdc2-tools{display:flex;flex-wrap:wrap;gap:.4rem}
.rdc2-t{display:inline-flex;align-items:center;gap:.35rem;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.4rem .75rem;font:inherit;font-size:.82rem;font-weight:800;cursor:pointer}
.rdc2-t span{font-size:.95rem;line-height:1}.rdc2-t.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc)}.rdc2-t:disabled{opacity:.35;cursor:default}
.rdc2-hint{margin:-.2rem 0 0;font-size:.78rem;color:var(--ink-2)}
.rdc2-box{display:grid;gap:.45rem;padding:.7rem;border:1px solid var(--line);border-radius:14px;background:var(--panel)}
.rdc2-ph .rdc-edph{position:absolute;left:6px;bottom:6px;top:auto;right:auto;width:auto;height:auto;min-height:36px;padding:0 12px;border:0;border-radius:99px;background:rgba(0,0,0,.6);color:#fff;font:inherit;font-weight:800;cursor:pointer}.rdc-des span{display:inline-flex;align-items:center;gap:.4rem}.rdc-des button{border:0;background:none;color:inherit;font-size:1.1rem;min-width:32px;min-height:32px;cursor:pointer}.rdc-spt{display:flex!important;align-items:center;justify-content:space-between;gap:.8rem;cursor:pointer}.rdc-spt span{display:grid;gap:.15rem}.rdc-spt small{color:var(--ink-2);font-size:.8rem;line-height:1.3}.rdc-spt input{flex:none;width:44px;height:26px;accent-color:var(--acc);cursor:pointer}.rdc2-box.rdc-sp label{display:flex;align-items:center;gap:.4rem;font-size:.86rem}.rdc2-box.rdc-sp input[type=number]{width:80px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink);font:inherit;padding:.2rem .4rem}.rdc2-box.rdc-sp small{font-size:.74rem;color:var(--ink-2)}
.rdc2-st{display:flex;gap:.2rem}.rdc2-st button{border:0;background:none;font-size:2rem;line-height:1;color:color-mix(in srgb,var(--ink) 18%,transparent);cursor:pointer;padding:0 .1rem}.rdc2-st button.on{color:#f5b82e}
.rdc2-foot{display:flex;gap:.5rem;align-items:center;position:sticky;bottom:0;padding:.5rem 0;background:var(--bg)}
.rdc2-vis{flex:1;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.65rem .8rem;font:inherit;font-weight:800;font-size:.86rem;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rdc2-vis i{font-style:normal;margin-left:.3rem;color:var(--ink-2)}
.rdc2-foot .rdc-go{flex:1;margin:0!important}
.rdc2-me{margin:-.3rem 0 0;font-size:.74rem;color:var(--ink-2);text-align:center}
`; TR.append(st); }
