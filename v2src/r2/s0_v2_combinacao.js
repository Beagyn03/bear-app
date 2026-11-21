// "Vocês combinam" (Bia, 20/11; protótipo v142 aprovado). No perfil de outra pessoa nada é calculado antes do toque:
// o cartão mostra as duas fotos em órbita e "Descobrir nossa combinação". Ao tocar, as estantes viram estrelas que formam
// uma constelação e abre uma sequência de telas (stories): revelação, evolução (quando atualizou), estantes (Venn
// proporcional), Top 3, gêneros (radar), notas, emoções, ecos, coincidências e o cartão 9:16 para compartilhar.
// Dados: o resumo publicado da pessoa (lidos com nota, Top, gêneros) + GET /v1/users/:h/match (só o que o par tem em
// comum: abandonos, ressaca, Pergunta do dia, ecos, data da amizade e, com a migração 037, o resumo do foco das duas,
// lado a lado). Foco, abandonos e ressaca de cada pessoa NÃO são publicados no perfil (decisão da Bia). Mínimo de 5 lidos visíveis de cada lado; estante privada não insiste. Resultado guardado
// no aparelho por par; se alguma estante mudou, vira "Atualizar" e a sequência ganha a tela de evolução.
// Desempenho: tudo em shadow root próprio, anima só transform/opacity, SVG inline, telas montadas uma de cada vez,
// nada em laço; prefers-reduced-motion vira só fade. O aviso para a outra pessoa ficou de fora (não aprovado).
const V9CSS = `
:host{all:initial;display:block;font:400 16px/1.35 'Nunito',system-ui,-apple-system,'Segoe UI',sans-serif;color:#fff;--f-disp:var(--v2-disp,'Fraunces',Georgia,serif);-webkit-text-size-adjust:100%}
*{box-sizing:border-box}button{font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
svg.i{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;border-radius:14px;font-weight:900;font-size:14.5px;padding:11px 16px;white-space:nowrap;border:0}
.btn.p{background:linear-gradient(135deg,#f0b070,#c46f2e);color:#fff;box-shadow:0 6px 14px rgba(196,111,46,.28)}.btn.s{background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.25);color:#fff}
.btn.sm{padding:6px 11px;font-size:12.5px}
.ib{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:none;border:0;color:#fff}
.cv{border-radius:4px 8px 8px 4px;position:relative;overflow:hidden;color:#fff;display:flex;align-items:flex-end;padding:5px;font-family:var(--f-disp);font-weight:700;line-height:1.05;background:linear-gradient(160deg,#5a4a8a,#241a40) center/cover no-repeat;box-shadow:inset 3px 0 0 rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.25);flex:none;text-align:left}
.cv.img{color:transparent}
.blc{position:relative;overflow:hidden;width:100%;border:0;border-radius:18px;padding:12px 14px;color:#fff;display:flex;align-items:center;gap:12px;text-align:left;background:radial-gradient(80% 140% at 0% 0%,rgba(224,144,74,.45),transparent 60%),radial-gradient(80% 140% at 100% 100%,rgba(165,140,240,.5),transparent 60%),#1a1230}
.blc-sky,.bl-sky{position:absolute;inset:0;pointer-events:none}.blc-sky i,.bl-sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff}
.blc-av{position:relative;display:flex;align-items:center;flex:none}.blc-av .blav{width:34px;height:34px;font-size:14px;border-width:2px}.blc-av .blav + .blorb + .blav{margin-left:-8px}
.blorb{position:absolute;left:50%;top:50%;width:62px;height:22px;margin:-11px 0 0 -31px;border:1.5px solid rgba(255,214,163,.55);border-radius:50%;transform:rotate(-16deg);pointer-events:none}
.blc-t{position:relative;display:grid;gap:2px;flex:1;min-width:0}.blc-t b{font-family:var(--f-disp);font-size:16.5px;line-height:1.15}.blc-t small{font-size:12px;font-weight:700;opacity:.8}
.blc-go{position:relative;flex:none;display:grid;place-items:center;min-width:34px;height:34px;border-radius:99px;background:#fff;color:#2a1a4a;font-weight:900;font-size:12.5px;padding:0 8px}
.blc.done .blc-t b{color:#ffd6a3}
.blc.few{flex-wrap:wrap;background:radial-gradient(80% 140% at 100% 0%,rgba(165,140,240,.3),transparent 60%),#1a1230}.blc.few .blc-av{opacity:.6}
.blc-a{position:relative;display:flex;gap:6px;flex-wrap:wrap;width:100%;padding-left:58px}
.blav{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:900;font-size:16px;color:#fff;border:2.5px solid rgba(255,255,255,.85);flex:none;background-size:cover;background-position:center}
.blav.bme{background-color:#c46f2e;background-image:linear-gradient(135deg,#f0b070,#c46f2e)}.blav.bel{background-color:#6d52c9;background-image:linear-gradient(135deg,#c3b0ff,#6d52c9)}.blav.ph{color:transparent}.blav.big{width:72px;height:72px;font-size:28px;border-width:3px}
.bl{position:fixed;inset:0;z-index:9000;color:#fff;overflow:hidden;background:radial-gradient(90% 55% at 0% 0%,rgba(224,144,74,.4),transparent 60%),radial-gradient(90% 55% at 100% 100%,rgba(165,140,240,.45),transparent 60%),#120c22;animation:blFade .25s both;padding:env(safe-area-inset-top,0) 0 env(safe-area-inset-bottom,0)}
.bl .comet{position:absolute;top:18%;left:-30%;width:120px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,#ffd6a3 70%,#fff);transform:translate(560px,140px) rotate(14deg);opacity:0;animation:blComet 1.1s ease-out both;pointer-events:none}
@keyframes blComet{from{transform:translate(0,0) rotate(14deg);opacity:0}25%{opacity:1}to{transform:translate(560px,140px) rotate(14deg);opacity:0}}
@keyframes blFade{from{opacity:0}}@keyframes blUp{from{transform:translateY(14px);opacity:0}}@keyframes blPop{from{transform:scale(.4);opacity:0}}
.blbars{position:absolute;top:calc(12px + env(safe-area-inset-top,0px));left:12px;right:52px;display:flex;gap:4px;z-index:4}.blbars i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.25);overflow:hidden;position:relative}
.blbars i.f{background:#fff}.blbars i.c::after{content:"";position:absolute;inset:0;background:#fff;transform-origin:left;animation:blBar 8s linear both}@keyframes blBar{from{transform:scaleX(0)}}
.blx{position:absolute;top:calc(2px + env(safe-area-inset-top,0px));right:6px;z-index:5}
.blnav{position:absolute;top:0;bottom:0;z-index:2;background:none;border:0}.blnav.l{left:0;width:30%}.blnav.r{right:0;width:70%}
.bls{position:absolute;inset:calc(48px + env(safe-area-inset-top,0px)) 20px calc(26px + env(safe-area-inset-bottom,0px));z-index:3;pointer-events:none;display:grid;grid-template-rows:auto minmax(0,1fr) auto;justify-items:center;align-items:stretch;text-align:center;gap:14px;animation:blUp .45s both}.bls button{pointer-events:auto}
.bz-h{display:grid;gap:6px;justify-items:center;width:100%}.bz-h .blh:empty{display:none}
.bz-c{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;width:100%;min-height:0}
.bz-f{display:grid;gap:10px;justify-items:center;width:100%;min-height:44px;align-content:end}
.blk{font-size:11px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;opacity:.75}
.blh{font-family:var(--f-disp);font-size:28px;line-height:1.1;margin:0;letter-spacing:-.01em}.blh.xl{font-size:34px}.blq{margin:0;font-size:15px;font-weight:700;opacity:.9;line-height:1.4;max-width:30ch}
.blbt{background:rgba(255,255,255,.12)!important;border:1.5px solid rgba(255,255,255,.25)!important;color:#fff!important;padding:8px 14px;font-size:13.5px}
.blhint{opacity:.55;font-size:12.5px;margin:0}
.bl.calc{display:grid;place-items:center}.blcalc{position:relative;z-index:3;display:grid;justify-items:center;text-align:center;gap:6px;padding:0 24px}.blcalc b{font-family:var(--f-disp);font-size:22px;animation:blFade .6s .3s both}.blcalc small{font-size:13px;opacity:.75;font-weight:700}
.blcst{width:250px;height:200px;overflow:visible}.blcst line{stroke:rgba(255,255,255,.45);stroke-width:1;animation:blFade .5s both}
.blcst .st{transform-box:fill-box;transform-origin:center;animation:blStar 1.1s cubic-bezier(.2,.8,.2,1) both}.blcst .st.me circle{fill:#f0b070}.blcst .st.el circle{fill:#c3b0ff}.blcst .st.sh circle{fill:#fff}
@keyframes blStar{from{transform:translate(var(--dx),var(--dy)) scale(.3);opacity:0}}
.blcst.still line,.blcst.still .st{animation:none}
.orbit{position:relative;width:200px;height:110px;animation:blOrb 1.6s cubic-bezier(.2,.8,.2,1) both}
.orbit::before{content:"";position:absolute;inset:18px 6px;border:1.5px solid rgba(255,214,163,.5);border-radius:50%}.orbit .o1,.orbit .o2{position:absolute;top:19px}.orbit .o1{left:22px}.orbit .o2{right:22px}
.orbit .blav{animation:blOrbR 1.6s cubic-bezier(.2,.8,.2,1) both}@keyframes blOrb{from{transform:rotate(-200deg) scale(.6);opacity:0}}@keyframes blOrbR{from{transform:rotate(200deg)}}
.blh.rev{animation:blPop .6s 1.1s both}
@keyframes blVl{from{transform:translateX(-70px);opacity:0}}@keyframes blVr{from{transform:translateX(70px);opacity:0}}
.vn{width:100%;max-width:330px;height:auto;overflow:visible}.vn circle{mix-blend-mode:screen}.vl circle{fill:rgba(224,144,74,.62)}.vr circle{fill:rgba(165,140,240,.62)}
.vl{animation:blVl .9s cubic-bezier(.2,.8,.2,1) both}.vr{animation:blVr .9s cubic-bezier(.2,.8,.2,1) both}.vt{animation:blFade .5s .7s both}
.vn text{fill:#fff;text-anchor:middle;font-weight:900}.vn .n{font-size:26px}.vn .n.big{font-size:40px}.vn .l{font-size:12.5px;font-weight:800;opacity:.9}
.vcov{display:flex;gap:12px;justify-content:center;align-items:flex-start}.vcov > span{display:grid;justify-items:center;gap:5px;width:64px;animation:blUp .45s .9s both}
.vcov .cv{width:52px;height:78px;font-size:7.5px}.vcov small{font-size:11px;font-weight:800;line-height:1.2;opacity:.85;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.vcov .mais b{display:grid;place-items:center;width:52px;height:78px;border-radius:4px 8px 8px 4px;border:1.5px dashed rgba(255,255,255,.4);font-size:18px}
.radar{width:100%;max-width:300px;align-self:center;overflow:visible}.radar .rg{fill:none;stroke:rgba(255,255,255,.18);stroke-width:1}.radar text{fill:rgba(255,255,255,.75);font-size:10px;font-weight:800;text-anchor:middle;dominant-baseline:middle}.radar text.cm{fill:#ffd6a3;font-size:11.5px}
.radar .rme,.radar .rel{transform-box:view-box;transform-origin:100px 100px;animation:blPop .8s cubic-bezier(.2,.8,.2,1) both}.radar .rme{fill:rgba(240,176,112,.38);stroke:#f0b070;stroke-width:1.6}.radar .rel{fill:rgba(195,176,255,.38);stroke:#c3b0ff;stroke-width:1.6;animation-delay:.25s}
.rlg{display:flex;gap:16px;font-size:12.5px;font-weight:800;justify-content:center}.rlg span{display:flex;align-items:center;gap:6px}.rlg .blav{width:20px;height:20px;font-size:9px;border-width:1.5px}
.emc{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.emc b{font-family:var(--f-disp);font-size:22px;background:#ffd6a3;color:#2a1a4a;border-radius:16px;padding:8px 14px;animation:blPop .5s var(--d) both}
.emo2{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}.emo2 > div{display:flex;flex-direction:column;align-items:center;gap:6px}.emo2 .blav{width:28px;height:28px;font-size:12px;border-width:2px}.emo2 small{font-size:12.5px;font-weight:800;opacity:.85}
.emo2 span{border-radius:99px;padding:5px 11px;font-size:12.5px;font-weight:800;background:rgba(255,255,255,.12)}.emo2 span.cm{background:rgba(255,214,163,.25);color:#ffd6a3}
.story{position:relative;overflow:hidden;height:100%;max-height:420px;aspect-ratio:9/16;max-width:100%;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;padding:16px 12px;text-align:center;background:radial-gradient(90% 50% at 0% 0%,rgba(224,144,74,.55),transparent 60%),radial-gradient(90% 50% at 100% 100%,rgba(165,140,240,.6),transparent 60%),#1a1230;box-shadow:0 18px 40px rgba(0,0,0,.45);animation:blPop .6s both}
.story .lg{position:absolute;top:12px;left:0;right:0;font-family:var(--f-disp);font-size:15px;font-weight:700;color:#ffd6a3}
.story .blcst{position:absolute;top:30px;left:50%;width:190px;height:150px;transform:translateX(-50%)}
.sav{display:flex}.sav .blav{width:34px;height:34px;font-size:13px;border-width:2px}.sav .blav + .blav{margin-left:-8px}
.story .sp{font-family:var(--f-disp);font-size:21px;line-height:1.1}.story .stg{font-size:11px;font-weight:700;opacity:.8}
.smi{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:100%;margin-top:4px}.smi span{background:rgba(255,255,255,.12);border-radius:10px;padding:6px 2px;display:grid}.smi b{font-size:15px;font-weight:900}.smi small{font-size:9.5px;font-weight:800;opacity:.85;line-height:1.15}
.b6a{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.b6a .btn{white-space:normal;max-width:100%;text-align:center;line-height:1.25}.b6a .btn.s{background:#fff!important;color:#2a1a4a!important;border:0!important}
.blselo{font-style:normal;justify-self:start;margin-top:3px;font-size:11px;font-weight:800;color:#2a1a4a;background:#ffd6a3;border-radius:99px;padding:2px 8px}
.evo{position:relative;height:150px;width:100%;display:grid;place-items:center}.evo .blcst{position:absolute;width:210px;height:168px}.blcst.dim{opacity:.28}.blcst.grow{animation:blPop 1s .2s cubic-bezier(.2,.8,.2,1) both}
.evs{display:grid;gap:10px;justify-items:center}.evs > span{animation:blUp .45s var(--d) both}.evn{display:flex;flex-direction:column;align-items:center;gap:2px}.evn b{font-size:34px;font-weight:900;color:#ffd6a3}.evn small{font-size:13px;font-weight:700;opacity:.9;line-height:1.3}
.evp{display:flex;flex-direction:column;align-items:center;gap:2px;font-family:var(--f-disp);font-size:20px}.evp s{opacity:.55}.evp i{font-style:normal;opacity:.7}.evp b{color:#ffd6a3}
.nts{display:grid;gap:10px;width:100%}.ntr{display:grid;grid-template-columns:48px 1fr auto;align-items:center;gap:12px;text-align:left;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:8px 12px 8px 8px;animation:blUp .45s var(--d) both}
.ntr .cv{width:48px;height:72px;font-size:7px}.ntt{display:grid;gap:5px;min-width:0}.ntt b{font-size:15px;line-height:1.2;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.ntt i{justify-self:start;font-style:normal;font-size:11px;font-weight:900;border-radius:99px;padding:2px 9px;background:rgba(92,197,138,.22);color:#8ff0b5}.ntr.tr .ntt i{background:rgba(255,122,104,.22);color:#ffab9f}
.ntv{display:flex;gap:12px}.ntv > span{display:grid;justify-items:center;gap:1px}.ntv small{font-size:11px;font-weight:800;opacity:.75}.ntv b{font-size:22px;font-weight:900}.ntv b.m{color:#f0b070}.ntv b.e{color:#c3b0ff}
.bpod{display:grid;justify-items:center;gap:4px;width:100%}.bpod > small{font-size:12.5px;font-weight:800;opacity:.85}.bpod .blav{width:28px;height:28px;font-size:12px;border-width:2px}
.podr{display:flex;align-items:flex-end;justify-content:center;gap:10px}.podr > span{position:relative;display:grid;justify-items:center;gap:3px;animation:blUp .45s both}.podr em{font-style:normal;font-size:11px;font-weight:900;opacity:.75}
.podr .cv{width:50px;height:75px;font-size:7px}.podr .p0 .cv{width:64px;height:96px;font-size:9px}.podr .p0{animation-delay:.2s}.podr .p2{animation-delay:.35s}
.podr .both .cv{box-shadow:0 0 0 2.5px #ffd6a3,0 8px 20px rgba(255,214,163,.25)}.podr .both em{color:#ffd6a3;opacity:1}
.eco2{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}.eco2 span{display:grid;justify-items:center;background:rgba(255,255,255,.07);border-radius:14px;padding:10px 6px}.eco2 b{font-size:32px;font-weight:900}.eco2 span:first-child b{color:#f0b070}.eco2 span:last-child b{color:#c3b0ff}.eco2 small{font-size:12px;font-weight:800;opacity:.8}
.ecq{display:grid;gap:10px;width:100%}.ecq .eqw{border-radius:14px;padding:12px 14px;animation:blUp .45s var(--d) both}.ecq .eqw.qme{background:rgba(240,176,112,.16)}.ecq .eqw.qel{background:rgba(195,176,255,.16)}.ecq .eqw q{display:block;font-family:var(--f-disp);font-size:17px;line-height:1.3}.ecq .eqw small{display:block;margin-top:4px;font-size:11.5px;font-weight:800;opacity:.75}
.coi{display:grid;gap:10px;width:100%}.coi span{display:flex;align-items:center;gap:12px;text-align:left;background:rgba(255,255,255,.07);border-radius:14px;padding:12px 14px;animation:blUp .45s var(--d) both}.coi b{font-size:15px;line-height:1.3}.coi svg{flex:none;color:#ffd6a3}
@media (prefers-reduced-motion: reduce){.bl *,.blc *{animation:none!important}.bl{animation:blFade .2s both}.bls{animation:blFade .3s both!important}.bl .comet{display:none}}
.fco{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%}
.fco > span{display:grid;justify-items:center;gap:3px;background:rgba(255,255,255,.07);border-radius:14px;padding:12px 6px}
.fco .blav{width:28px;height:28px;font-size:12px;border-width:2px}
.fco b{font-size:28px;font-weight:900}
.fco small{font-size:12px;font-weight:700;opacity:.8;text-align:center}
.dia24{width:100%;display:grid;gap:6px;margin-top:14px}
.dia24 .trk{position:relative;height:28px;border-radius:10px;background:linear-gradient(90deg,#1b1640 0%,#3a2d6b 25%,#c98a4a 50%,#3a2d6b 75%,#1b1640 100%);overflow:hidden}
.dia24 .trk i{position:absolute;height:10px;border-radius:99px;transform-origin:left;animation:blGrow .7s .3s both}
.dia24 .trk i.me{top:3px;background:#f0b070}
.dia24 .trk i.el{bottom:3px;background:#c3b0ff}
.dia24 .hrs{display:flex;justify-content:space-between;font-size:11px;font-weight:800;opacity:.6}
.dia24 .hrs em{font-style:normal}
@keyframes blGrow{from{transform:scaleX(0)}}
@media (prefers-reduced-motion:reduce){.dia24 .trk i{animation:none}}
`;
const V9IC = { chev: '<path d="M9 5l7 7-7 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>', reply: '<path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H10l-5 4z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', friends: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.5-3.5 3-5.5 6.5-5.5s6 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.5 5.2"/>',
  send: '<path d="M20.5 3.5 3.5 10.5l7 2.5 2.5 7z"/><path d="M20.5 3.5 10.5 13"/>', estante: '<path d="M4 4h3v16H4zM9 4h3v16H9zM14.5 4.6l2.9-.8 3.6 15.4-2.9.8z"/>',
  stop: '<circle cx="12" cy="12" r="8.5"/><path d="M9 9h6v6H9z"/>', wave: '<path d="M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0M3 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0"/>', vote: '<path d="M4 12l5 5L20 6"/>', book: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H5.5A1.5 1.5 0 0 0 4 20.5zM4 20.5A1.5 1.5 0 0 1 5.5 19H19"/>' };
const v9ic = (k, w) => '<svg class="i" viewBox="0 0 24 24"' + (w ? ' style="width:' + w + 'px;height:' + w + 'px"' : '') + ' aria-hidden="true">' + (V9IC[k] || '') + '</svg>';
const V9SKY = Array.from({ length: 28 }, (_, i) => '<i style="left:' + ((i * 37 + 11) % 100) + '%;top:' + ((i * 53 + 7) % 100) + '%;opacity:' + (0.25 + ((i * 7) % 6) / 10).toFixed(2) + '"></i>');
const V9MIN = 5;
const v9cssUrl = (u) => 'url("' + String(u).replace(/["\\\n]/g, '') + '")';
const v9cv = (b) => { const c = b && b.cover && !/^data:/.test(b.cover) || (b && b.cover && b.cover.length < 300000) ? b.cover : ''; return '<span class="cv' + (c ? ' img' : '') + '"' + (c ? ' style="background-image:' + v9cssUrl(c) + '"' : '') + '>' + esc((b && b.title) || '') + '</span>'; };
const v9nt = (x) => '★' + String(x).replace('.', ',');
// ---------- dados do par ----------
function v9Data(d, M) {
  const sh = d.shelf || {}, first = String(d.displayName || d.handle || '').split(' ')[0] || '@' + d.handle;
  const mine = lib().filter((e) => e.status === 'LIDO'), mineK = new Map(mine.map((e) => [normT(e.title), e]));
  const vis = (sh.ano && sh.ano.length ? sh.ano.map((x) => ({ title: x.t, author: x.a, cover: x.c, p: Number(x.p) || 0 })) : (sh.lidos || []).map((x) => ({ ...x, p: 0 })));
  const theirK = new Map(); vis.forEach((b) => { const k = normT(b.title); if (k && !theirK.has(k)) theirK.set(k, b); });
  const st = sh.stats || {}, theirTotal = Math.max(theirK.size, Number(st.lidos) || 0, Number((sh.counts || {}).LIDO) || 0);
  const both = [...theirK.keys()].filter((k) => mineK.has(k));
  const a = Math.max(0, mine.length - both.length), b = both.length, c = Math.max(0, theirTotal - both.length);
  const D = { n: first, h: d.handle, am: !!d.isFriend, priv: !d.shelf, lidos: [mine.length, theirK.size], venn: [a, b, c] };
  D.vc = both.slice(0, 3).map((k) => { const e = mineK.get(k), t = theirK.get(k); return { title: e.title, cover: (t && t.cover) || e.cover || null }; });
  // notas: livros que as duas leram e avaliaram
  D.rg = both.map((k) => { const e = mineK.get(k), m = e && e.status === 'LIDO' ? Number((reviewOfLib(e) || {}).paws) || 0 : 0, t = Number(theirK.get(k).p) || 0; return m && t ? { title: e.title, cover: theirK.get(k).cover || e.cover, m, e: t } : null; }).filter(Boolean);
  D.agree = D.rg.filter((x) => Math.abs(x.m - x.e) <= 0.5).length;
  // gêneros (radar com os 5 eixos mais fortes das duas)
  let myD = null; try { myD = v2DnaOf(mine); } catch {}
  const A = new Map(((myD && myD.parts) || []).filter(([g]) => !/^outros?$/i.test(g))), B = new Map((st.dna || []).filter(([g]) => !/^outros?$/i.test(g)));
  const AX = [...new Set([...A.keys(), ...B.keys()])].sort((x, y) => ((A.get(y) || 0) + (B.get(y) || 0)) - ((A.get(x) || 0) + (B.get(x) || 0))).slice(0, 5);
  D.temDna = A.size > 0 && B.size > 0 && AX.length >= 3;
  if (D.temDna) { const mx = Math.max(...AX.map((g) => Math.max(A.get(g) || 0, B.get(g) || 0)), 1); D.AX = AX; D.rm = AX.map((g) => (A.get(g) || 0) / mx); D.rt = AX.map((g) => (B.get(g) || 0) / mx);
    const topA = [...A.entries()].sort((x, y) => y[1] - x[1])[0][0], topB = [...B.entries()].sort((x, y) => y[1] - x[1])[0][0];
    D.gc = topA === topB ? topA : AX.filter((g) => A.get(g) && B.get(g)).sort((x, y) => Math.min(A.get(y), B.get(y)) - Math.min(A.get(x), B.get(x)))[0] || topA; D.gSame = topA === topB; D.gA = topA; D.gB = topB; }
  // Top 3 das duas
  let myTop = []; try { myTop = top5Books().slice(0, 3).map((x) => ({ title: x.title, cover: x.cover })); } catch {}
  const thTop = sh.top5 ? (sh.potinho || []).slice(0, 3) : [];
  D.top = myTop.length >= 1 && thTop.length >= 1 ? [myTop, thTop] : null;
  // emoções: as que mais marcam cada uma (Top e trechos)
  const cnt = (L) => { const m = new Map(); L.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return [...m.entries()].sort((x, y) => y[1] - x[1]).map((x) => x[0]).slice(0, 3); };
  let myEm = []; try { myEm = cnt(mine.flatMap((e) => (typeof v3Emo === 'function' ? v3Emo(e) : []) || [])); } catch {}
  const thEm = cnt((sh.potinho || []).flatMap((x) => x.emo || []));
  D.em = [myEm, thEm]; D.ec = myEm.filter((x) => thEm.includes(x));
  // do servidor, só o que o par tem em comum
  M = M || {}; const E = M.ecos || {};
  D.ecos = { me: Number(E.me) || 0, el: Number(E.them) || 0, livro: E.livro || null };
  D.coinc = [...(M.abandonaram || []).slice(0, 1).map((t) => ['stop', 'As duas abandonaram ' + t]), ...(M.ressaca || []).slice(0, 1).map((t) => ['wave', t + ' deu ressaca nas duas']),
    ...(M.qday || []).slice(0, 1).map((q) => ['vote', 'Votaram em ' + q.title + ' na Pergunta do dia de ' + String(q.day).slice(8, 10) + '/' + String(q.day).slice(5, 7)])];
  D.since = M.since || null;
  // foco (migração 037): só quando as duas mandaram o resumo do mesmo ano; janela de 2 h a partir da hora mais comum
  const FO = M.focus;
  if (FO && FO.me && FO.them && (FO.me.minutes > 0 || FO.them.minutes > 0)) {
    const jan = (h) => h == null ? null : [Math.max(0, Math.min(22, Number(h))), Math.max(0, Math.min(22, Number(h))) + 2];
    const faixa = (h) => h == null ? '' : h < 6 ? 'de madrugada' : h < 12 ? 'de manhã' : h < 18 ? 'à tarde' : 'à noite';
    const hm = FO.me.peakHour, he = FO.them.peakHour, fm = faixa(hm), fe = faixa(he);
    D.foco = { year: FO.year, min: [Number(FO.me.minutes) || 0, Number(FO.them.minutes) || 0], ses: [Number(FO.me.sessions) || 0, Number(FO.them.sessions) || 0], h: [jan(hm), jan(he)],
      fm, fe, hm, he };
  } else D.foco = null;
  // afinidade e persona
  const ts = b / Math.max(8, Math.min(mine.length || 1, theirK.size || 1)), gs = D.temDna ? (() => { let mn = 0, mx = 0; new Set([...A.keys(), ...B.keys()]).forEach((k) => { mn += Math.min(A.get(k) || 0, B.get(k) || 0); mx += Math.max(A.get(k) || 0, B.get(k) || 0); }); return mx ? mn / mx : 0; })() : 0;
  const score = D.temDna ? 0.55 * Math.min(1, ts * 1.6) + 0.45 * gs : Math.min(1, ts * 1.6); D.lo = score < 0.35;
  const plot = D.ec.some((x) => /reviravolta|me prendeu/i.test(x)), cry = D.em[0].some((x) => /chorei/i.test(x)), shiver = D.em[1].some((x) => /medo|arrepio|tens/i.test(x));
  D.pers = D.lo ? (D.temDna && !D.gSame ? 'Opostas que se atraem' : 'Mundos paralelos') : score > 0.6 ? 'Almas gêmeas literárias' : 'Constelação em comum';
  D.tag = plot ? 'dupla do plot twist' : D.agree >= 3 ? 'clube das 5 estrelas' : D.lo && cry && shiver ? 'uma chora, a outra treme' : D.temDna && D.gSame ? String(D.gc).toLowerCase() + ' nas duas' : D.lo ? 'bom para trocar indicações' : 'leituras que se cruzam';
  D.mini = [[String(b), 'em comum'], D.rg.length ? [D.agree + '/' + D.rg.length, 'notas iguais'] : [String(theirK.size), 'lidos de ' + first], D.temDna ? (D.gSame ? ['♥', String(D.gc).toLowerCase()] : ['×', String(D.gA).toLowerCase() + ' e ' + String(D.gB).toLowerCase()]) : [String(mine.length), 'seus lidos']];
  D.sig = mine.length + '|' + theirTotal;
  // um livro que a pessoa amou e você ainda não leu
  D.nx = (sh.potinho || []).find((x) => !mineK.has(normT(x.title)) && !lib().some((e) => normT(e.title) === normT(x.title))) || null;
  return D;
}
const V9PESO = { rev: 99, fim: 99, evo: 90, venn: 80, top: 75, rg: 70, ecos: 60, coinc: 58, em: 55, foco: 50, gen: 45 };
const v9Telas = (D, evo) => { const T = ['rev', evo && 'evo', 'venn', D.top && 'top', D.temDna && 'gen', D.rg.length && 'rg', D.em[0].length && D.em[1].length && 'em', D.foco && 'foco', (D.ecos.me || D.ecos.el) && 'ecos', D.coinc.length && 'coinc', 'fim'].filter(Boolean);
  while (T.length > 9) { const lo = T.reduce((m, k) => V9PESO[k] < V9PESO[m] ? k : m, T[0]); T.splice(T.indexOf(lo), 1); } return T; };
// guardado por par no aparelho: a última combinação (para "Ver de novo" e para a evolução)
const v9Key = (h) => 'lv.combo.' + ((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || 'eu') + '.' + h;
const v9Get = (h) => { try { return JSON.parse(localStorage.getItem(v9Key(h)) || 'null'); } catch { return null; } };
const v9Put = (h, v) => { try { localStorage.setItem(v9Key(h), JSON.stringify(v)); } catch {} };
const V9MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const v9Quando = (iso) => { const t = String(iso || '').slice(0, 10); if (!t) return ''; if (t === todayISO()) return 'hoje'; return 'em ' + V9MES[Number(t.slice(5, 7)) - 1] + (t.slice(0, 4) !== todayISO().slice(0, 4) ? ' de ' + t.slice(0, 4) : ''); };
// ---------- desenho ----------
function v9Av(who, d, cls) {
  const me = who === 'me', h = me ? ((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || '') : d.handle;
  let src = ''; try { const im = TR.querySelector(me ? '.v3pfx-me-av img, #tabbar [data-tab=eu] img' : '.v3pf .v3av img'); if (im && im.src) src = im.src; } catch {}
  const ini = me ? String((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || 'Eu').charAt(0).toUpperCase() : String(d.displayName || d.handle || '?').charAt(0).toUpperCase();
  return '<span class="blav ' + (cls || '') + ' ' + (me ? 'bme' : 'bel') + (src ? ' ph' : '') + '"' + (src ? ' style="background-image:' + v9cssUrl(src) + '"' : '') + ' data-h="' + esc(h) + '">' + esc(ini) + '</span>';
}
function v9Const(nShared, cls) {
  const P = [[30, 70], [52, 40], [80, 58], [104, 30], [126, 62], [150, 36], [172, 70], [96, 92], [60, 104], [138, 100], [116, 128], [80, 132]];
  const L = [[0, 1], [1, 3], [3, 5], [5, 6], [1, 2], [2, 4], [4, 6], [2, 7], [7, 4], [7, 8], [7, 9], [9, 10], [8, 11], [10, 11]];
  const sh = new Set([7, 2, 4, 10, 8, 9].slice(0, Math.min(6, nShared)));
  return '<svg class="blcst ' + (cls || '') + '" viewBox="0 0 200 160" aria-hidden="true">' + L.map(([a, b], k) => '<line x1="' + P[a][0] + '" y1="' + P[a][1] + '" x2="' + P[b][0] + '" y2="' + P[b][1] + '" style="animation-delay:' + (1.3 + k * 0.05).toFixed(2) + 's"/>').join('')
    + P.map(([x, y], k) => '<g class="st ' + (sh.has(k) ? 'sh' : k % 2 ? 'el' : 'me') + '" style="--dx:' + (k % 2 ? 140 : -140) + 'px;--dy:' + ((k * 23) % 60 - 30) + 'px;animation-delay:' + (k * 0.06).toFixed(2) + 's"><circle cx="' + x + '" cy="' + y + '" r="' + (sh.has(k) ? 4.2 : 3) + '"/></g>').join('') + '</svg>';
}
function v9Radar(D) {
  const c = 100, R = 66, pt = (v, i) => { const a = (-90 + i * (360 / D.AX.length)) * Math.PI / 180; return [(c + Math.cos(a) * R * v).toFixed(1), (c + Math.sin(a) * R * v).toFixed(1)]; };
  const poly = (V) => V.map((v, i) => pt(Math.max(0.06, v), i).join(',')).join(' ');
  return '<svg class="radar" viewBox="0 0 200 200" aria-label="Gêneros de cada uma">' + [1, 0.66, 0.33].map((s) => '<polygon class="rg" points="' + poly(D.AX.map(() => s)) + '"/>').join('')
    + D.AX.map((g, i) => { const [x, y] = pt(1.3, i), [x2, y2] = pt(1, i); return '<line class="rg" x1="100" y1="100" x2="' + x2 + '" y2="' + y2 + '"/><text x="' + x + '" y="' + y + '" class="' + (g === D.gc ? 'cm' : '') + '">' + esc(String(g).slice(0, 14)) + '</text>'; }).join('')
    + '<polygon class="rme" points="' + poly(D.rm) + '"/><polygon class="rel" points="' + poly(D.rt) + '"/></svg>';
}
function v9Venn(D) {
  const [a, b, c] = D.venn, tm = Math.max(1, a + b), tl = Math.max(1, b + c), R = 92, r1 = R * Math.sqrt(tm / Math.max(tm, tl)), r2 = R * Math.sqrt(tl / Math.max(tm, tl));
  const w = Math.max(0.8 * Math.min(r1, r2), Math.min(r1, r2) * (0.4 + 1.2 * b / Math.min(tm, tl))), d = r1 + r2 - w, W = 2 * r1 + 2 * r2 - w, cx1 = r1, cx2 = r1 + d, cy = R, lx = (cx2 - r2 + cx1 + r1) / 2;
  return '<svg class="vn" viewBox="-4 -4 ' + (W + 8).toFixed(0) + ' ' + (2 * R + 40) + '" aria-label="' + a + ' só seus, ' + b + ' das duas, ' + c + ' só de ' + esc(D.n) + '">'
    + '<g class="vl"><circle cx="' + cx1 + '" cy="' + cy + '" r="' + r1.toFixed(1) + '"/></g><g class="vr"><circle cx="' + cx2.toFixed(1) + '" cy="' + cy + '" r="' + r2.toFixed(1) + '"/></g>'
    // lua estreita (um círculo bem menor): o número vai para baixo do círculo, sem encostar no "as duas"
    + (() => { const wl = (cx2 - r2) - (cx1 - r1), wr = (cx2 + r2) - (cx1 + r1), out = (cx, r) => cy + r + 30 <= 2 * R + 30;
      const pl = wl < 64 && out(cx1, r1) ? [cx1 - r1 * 0.35, cy + r1 + 22] : [(cx1 - r1 + cx2 - r2) / 2, cy - 4], pr = wr < 64 && out(cx2, r2) ? [cx2 + r2 * 0.35, cy + r2 + 22] : [(cx1 + r1 + cx2 + r2) / 2, cy - 4];
      return '<g class="vt"><text x="' + pl[0].toFixed(1) + '" y="' + pl[1].toFixed(1) + '" class="n">' + a + '</text><text x="' + pl[0].toFixed(1) + '" y="' + (pl[1] + 20).toFixed(1) + '" class="l">só você</text>'
        + '<text x="' + pr[0].toFixed(1) + '" y="' + pr[1].toFixed(1) + '" class="n">' + c + '</text><text x="' + pr[0].toFixed(1) + '" y="' + (pr[1] + 20).toFixed(1) + '" class="l">só ' + esc(D.n) + '</text>'; })()
    + '<text x="' + lx.toFixed(1) + '" y="' + (cy + 4) + '" class="n big">' + b + '</text><text x="' + lx.toFixed(1) + '" y="' + (cy + 24) + '" class="l">as duas</text></g></svg>';
}
const v9Z = (k, h, chart, q, act) => '<div class="bls"><header class="bz-h"><span class="blk">' + k + '</span><h2 class="blh">' + h + '</h2></header><div class="bz-c">' + chart + '</div><footer class="bz-f">' + (q ? '<p class="blq">' + q + '</p>' : '') + (act || '') + '</footer></div>';
function v9Act(D, k) {
  const disc = '<button class="btn s blbt" data-v9="disc">' + v9ic('reply', 16) + 'Discutir</button>';
  if (!D.am) return k === 'rg' || k === 'em' ? '<button class="btn s blbt" data-v9="add">' + v9ic('plus', 16) + 'Adicionar amizade para conversar</button>' : '';
  return { venn: D.venn[1] ? '<button class="btn s blbt" data-v9="comum">' + v9ic('estante', 16) + 'Ver os ' + D.venn[1] + ' em comum</button>' : '', ecos: disc, rg: disc, em: disc, foco: disc }[k] || '';
}
function v9Screen(D, k, prev) {
  const n = esc(D.n), lg = '<div class="rlg"><span>' + D.avMe.replace('blav ', 'blav ') + 'Você</span><span>' + D.avEl + n + '</span></div>';
  if (k === 'rev') return v9Z('Você + ' + n, '', '<div class="orbit"><span class="o1">' + D.avMeBig + '</span><span class="o2">' + D.avElBig + '</span></div><h2 class="blh xl rev">' + esc(D.pers) + '</h2><p class="blq">' + esc(D.tag) + '</p>', '', '<small class="blhint">toque para avançar</small>');
  if (k === 'evo' && prev) { const dc = D.venn[1] - (prev.comum || 0);
    return v9Z('Desde ' + esc(v9Quando(prev.at).replace(/^em /, '')), 'A constelação cresceu', '<div class="evo">' + v9Const(prev.comum || 0, 'still dim') + v9Const(D.venn[1], 'grow') + '</div><div class="evs"><span class="evn" style="--d:.5s"><b>' + (dc >= 0 ? '+' : '') + dc + '</b><small>livros em comum<br>(' + (prev.comum || 0) + ' → ' + D.venn[1] + ')</small></span>'
      + (prev.pers && prev.pers !== D.pers ? '<span class="evp" style="--d:.75s"><s>' + esc(prev.pers) + '</s><i>↓</i><b>' + esc(D.pers) + '</b></span>' : '') + '</div>', dc > 0 ? 'Mais estrelas em comum desde a última vez.' : 'O céu mudou um pouco desde a última vez.'); }
  if (k === 'venn') { const [a, b, c] = D.venn, mais = b - D.vc.length;
    return v9Z('As estantes', b + ' ' + (b === 1 ? 'livro que as duas leram' : 'livros que as duas leram'), v9Venn(D) + (D.vc.length ? '<div class="vcov">' + D.vc.map((x) => '<span>' + v9cv(x) + '<small>' + esc(x.title) + '</small></span>').join('') + (mais > 0 ? '<span class="mais"><b>+' + mais + '</b><small>outros</small></span>' : '') + '</div>' : ''),
      D.lo ? a + ' só seus e ' + c + ' só de ' + n + ': muita coisa para trocar.' : b ? 'Uma boa parte do que você leu, ' + n + ' também leu.' : 'Nenhum livro em comum ainda. Começo perfeito para indicar.', v9Act(D, 'venn')); }
  if (k === 'top') { const [A, B] = D.top, kk = (x) => normT(x.title), both = A.filter((x) => B.some((y) => kk(y) === kk(x))).map((x) => x.title);
    const pod = (L, who) => '<div class="bpod">' + (who === 'me' ? D.avMe : D.avEl) + '<small>' + (who === 'me' ? 'Você' : n) + '</small><div class="podr">' + [1, 0, 2].filter((p) => L[p]).map((p) => '<span class="p' + p + (both.some((t) => normT(t) === kk(L[p])) ? ' both' : '') + '"><em>' + (p + 1) + 'º</em>' + v9cv(L[p]) + '</span>').join('') + '</div></div>';
    return v9Z('Top 3', both.length ? esc(both[0]) + ' está no top das duas' : 'Nenhum livro nos dois tops', pod(A, 'me') + pod(B, 'el'),
      both.length > 1 ? 'E ' + esc(both[1]) + ' também. Gosto parecido no que importa.' : both.length ? 'Um favorito em comum já diz muito.' : 'Bom momento para pedir o 1º lugar de ' + n + ' emprestado.'); }
  if (k === 'gen') return v9Z('Gêneros', esc(D.gc), v9Radar(D) + lg, D.gSame ? esc(D.gc) + ' é o idioma das duas.' : 'Você em ' + esc(String(D.gA).toLowerCase()) + ', ' + n + ' em ' + esc(String(D.gB).toLowerCase()) + '. ' + esc(D.gc) + ' é a ponte.');
  if (k === 'rg') { const R = [...D.rg].sort((x, y) => Math.abs(x.m - x.e) - Math.abs(y.m - y.e)), L = R.length > 3 ? [R[0], R[1], R[R.length - 1]] : R, tr = L.find((x) => Math.abs(x.m - x.e) >= 2);
    return v9Z('Notas', 'Acordo e treta', '<div class="nts">' + L.map((x, r) => { const df = Math.abs(x.m - x.e), t = df >= 2;
      return '<div class="ntr' + (t ? ' tr' : '') + '" style="--d:' + (0.15 + r * 0.18).toFixed(2) + 's">' + v9cv(x) + '<span class="ntt"><b>' + esc(x.title) + '</b><i>' + (t ? 'Treta de ' + String(df).replace('.', ',') + '★' : df ? 'Quase acordo' : 'Acordo') + '</i></span><span class="ntv"><span><small>Você</small><b class="m">' + v9nt(x.m) + '</b></span><span><small>' + n + '</small><b class="e">' + v9nt(x.e) + '</b></span></span></div>'; }).join('') + '</div>',
      tr ? esc(tr.title) + ': ' + v9nt(tr.m) + ' contra ' + v9nt(tr.e) + '. Alguém aqui precisa se explicar.' : 'Concordam em quase tudo.', v9Act(D, 'rg')); }
  if (k === 'em') { const ec = (L) => L.map((e) => '<span class="' + (D.ec.includes(e) ? 'cm' : '') + '">' + esc(e) + '</span>').join('');
    return v9Z('O que sentem', D.ec.length ? esc(D.ec.join(' e ')) : 'Cada uma sente diferente', (D.ec.length ? '<div class="emc">' + D.ec.map((e, j) => '<b style="--d:' + (0.2 + j * 0.2).toFixed(2) + 's">' + esc(e) + '</b>').join('') + '</div>' : '') + '<div class="emo2"><div>' + D.avMe + '<small>Você</small>' + ec(D.em[0]) + '</div><div>' + D.avEl + '<small>' + n + '</small>' + ec(D.em[1]) + '</div></div>',
      D.ec.length ? 'As duas vivem pelo mesmo tipo de cena.' : 'Troquem de lugar por um livro.', v9Act(D, 'em')); }
  if (k === 'foco') { const F = D.foco, hr = (h) => h ? h[0] + 'h–' + (h[1] === 24 ? '0' : h[1]) + 'h' : 'horário variado';
    const seg = (h, c) => h ? '<i class="' + c + '" style="left:' + (h[0] / 24 * 100).toFixed(1) + '%;width:' + ((h[1] - h[0]) / 24 * 100).toFixed(1) + '%"></i>' : '';
    const hh = (m) => m >= 60 ? Math.round(m / 60) + ' h' : m + ' min';
    const q = F.fm && F.fe ? (F.fm === F.fe ? 'As duas leem ' + F.fm + (Math.abs(F.hm - F.he) <= 1 ? ', quase na mesma hora.' : '.') : 'Você lê ' + F.fm + ', ' + n + ' ' + F.fe + '.') : 'Quem lê mais com cronômetro?';
    return v9Z('Foco', q, '<div class="fco">' + [0, 1].map((j) => '<span>' + (j ? D.avEl : D.avMe) + '<b>' + hh(F.min[j]) + '</b><small>' + F.ses[j] + (F.ses[j] === 1 ? ' sessão' : ' sessões') + ' · ' + hr(F.h[j]) + '</small></span>').join('') + '</div>'
      + '<div class="dia24"><span class="trk">' + seg(F.h[0], 'me') + seg(F.h[1], 'el') + '</span><span class="hrs"><em>0h</em><em>6h</em><em>12h</em><em>18h</em><em>24h</em></span></div>',
      'Minutos com cronômetro em ' + F.year + '.', v9Act(D, 'foco')); }
  if (k === 'ecos') { const E = D.ecos;
    return v9Z('Ecos', E.livro ? 'Um eco de cada em ' + esc(E.livro.title) : E.me + ' ecos seus, ' + E.el + ' de ' + n, '<div class="eco2"><span><b>' + E.me + '</b><small>ecos seus</small></span><span><b>' + E.el + '</b><small>ecos de ' + n + '</small></span></div>'
      + (E.livro ? '<div class="ecq"><div class="eqw qme" style="--d:.4s"><q>' + esc(E.livro.me.body) + '</q><small>você · pág. ' + E.livro.me.page + '</small></div><div class="eqw qel" style="--d:.65s"><q>' + esc(E.livro.them.body) + '</q><small>' + n + ' · pág. ' + E.livro.them.page + '</small></div></div>' : ''),
      E.livro ? 'As duas deixaram eco no mesmo livro.' : E.el > E.me * 2 ? n + ' deixa eco em quase todo livro.' : E.me > E.el * 2 ? 'Você deixa mais ecos pelo caminho.' : 'Ecos espalhados pelas mesmas galáxias.', v9Act(D, 'ecos')); }
  if (k === 'coinc') return v9Z('Coincidências', 'Por acaso, as duas…', '<div class="coi">' + D.coinc.map(([icn, t], j) => '<span style="--d:' + (0.15 + j * 0.18).toFixed(2) + 's">' + v9ic(icn, 18) + '<b>' + esc(t) + '</b></span>').join('') + '</div>', 'O universo tem senso de humor.');
  // fecho: o cartão 9:16 + próximo passo
  const nx = D.nx;
  return v9Z('Para compartilhar', '', '<div class="story"><span class="bl-sky">' + V9SKY.slice(0, 18).join('') + '</span><span class="lg">Livroverso ✦</span>' + v9Const(D.venn[1], 'still')
    + '<span class="sav">' + D.avMe + D.avEl + '</span><b class="sp">' + esc(D.pers) + '</b><small class="stg">' + esc(D.meName) + ' + ' + n + ' · ' + esc(D.tag) + '</small><span class="smi">' + D.mini.map(([v, l]) => '<span><b>' + esc(v) + '</b><small>' + esc(l) + '</small></span>').join('') + '</span></div>', '',
    '<div class="b6a">' + (D.am ? '<button class="btn p" data-v9="junto">' + v9ic('friends', 16) + 'Ler junto</button>' + (nx ? '<button class="btn s" data-v9="quero">' + v9ic('plus', 16) + 'Quero ler: ' + esc(String(nx.title).length > 40 ? String(nx.title).slice(0, 39) + '…' : String(nx.title)) + '</button>' : '') : '<button class="btn p" data-v9="add">' + v9ic('plus', 16) + 'Adicionar amizade</button>') + '<button class="btn s" data-v9="share">' + v9ic('send', 16) + 'Compartilhar</button><button class="btn s blbt" data-v9="again">Ver de novo</button></div>');
}
// ---------- cartão do perfil e sequência ----------
{ let host = null, ov = null, tmr = 0, cur = null;
  const st = () => { const s = document.createElement('style'); s.textContent = V9CSS; return s; };
  const card = (h) => {
    const d = S.fpData; if (!d || d.self || d.handle !== h.dataset.h) return; const sr = h.shadowRoot; if (!sr) return;
    const saved = v9Get(d.handle), n = esc(String(d.displayName || d.handle || '').split(' ')[0] || '@' + d.handle);
    const av = '<span class="blc-av">' + v9Av('me', d) + '<i class="blorb"></i>' + v9Av('el', d) + '</span>', sky = '<span class="blc-sky">' + V9SKY.slice(0, 14).join('') + '</span>';
    const sh = d.shelf || {}, theirVis = ((sh.ano && sh.ano.length ? sh.ano : sh.lidos) || []).length, myL = lib().filter((e) => e.status === 'LIDO').length;
    const few = !d.shelf ? { t: n + ' deixa a estante só para si', s: 'sem estante à mostra, não há constelação para formar', a: '' }
      : myL < V9MIN ? { t: 'Poucas estrelas para formar a constelação', s: 'você tem ' + myL + ' lidos no perfil; a partir de ' + V9MIN + ' a combinação aparece', a: '<button class="btn s sm" data-v9="lidos">Marcar livros lidos</button><button class="btn s sm" data-v9="hist">Completar histórico</button>' }
      : theirVis < V9MIN ? { t: 'Poucas estrelas para formar a constelação', s: n + ' tem poucos livros no perfil (' + theirVis + ' lidos)', a: '<button class="btn s sm" data-v9="indicar">Indicar um livro</button>' + (d.isFriend ? '<button class="btn s sm" data-v9="junto">Convidar para ler junto</button>' : '') } : null;
    let html;
    if (few) html = '<div class="blc few">' + sky + av + '<span class="blc-t"><b>' + few.t + '</b><small>' + few.s + '</small></span>' + (few.a ? '<span class="blc-a">' + few.a + '</span>' : '') + '</div>';
    else { const sig = myL + '|' + Math.max(theirVis, Number((sh.stats || {}).lidos) || 0, Number((sh.counts || {}).LIDO) || 0), old = saved && saved.sig !== sig;
      const novos = old ? Math.abs(Number(sig.split('|')[0]) + Number(sig.split('|')[1]) - Number(String(saved.sig).split('|')[0]) - Number(String(saved.sig).split('|')[1])) : 0;
      html = '<button class="blc' + (saved ? ' done' : '') + '" data-v9="' + (!saved ? 'calc' : old ? 'upd' : 'view') + '">' + sky + av + '<span class="blc-t">'
        + (saved ? '<small>A combinação de vocês · descoberta ' + esc(v9Quando(saved.at)) + '</small><b>' + esc(saved.pers) + '</b>' + (old && novos ? '<em class="blselo">' + novos + (novos === 1 ? ' livro novo' : ' livros novos') + ' desde ' + esc(v9Quando(saved.at).replace(/^em /, '')) + '</em>' : '') : '<b>Descobrir nossa combinação</b><small>você e ' + n + ' no mesmo céu</small>')
        + '</span><span class="blc-go">' + (!saved ? v9ic('chev', 18) : old ? 'Atualizar' : 'Ver de novo') + '</span></button>'; }
    if (h.dataset.sig === html) return; h.dataset.sig = html;
    sr.innerHTML = ''; sr.append(st()); const w = document.createElement('div'); w.innerHTML = html; sr.append(w);
  };
  const mount = () => { TR.querySelectorAll('.v2afi.v9h').forEach((h) => { if (!h.shadowRoot) h.attachShadow({ mode: 'open' }).addEventListener('click', (ev) => { ev.stopPropagation(); onClick(ev, h); }); h.addEventListener('click', (ev) => ev.stopPropagation()); try { card(h); } catch (err) { console.warn('combinação', err); } }); };
  const close = () => { clearTimeout(tmr); if (ov) { const o = ov; ov = null; o.remove(); } cur = null; TR.querySelectorAll('.v2afi.v9h').forEach((h) => { delete h.dataset.sig; }); mount(); };
  const draw = () => {
    if (!ov || !cur) return; clearTimeout(tmr); const sr = ov.shadowRoot, T = cur.T, i = Math.max(0, Math.min(cur.i, T.length - 1));
    const sky = '<span class="bl-sky">' + V9SKY.join('') + '</span>';
    const html = cur.calc ? '<div class="bl calc" role="dialog" aria-label="Calculando a combinação">' + sky + '<div class="blcalc">' + v9Const(cur.D.venn[1]) + '<b>Juntando as estantes…</b><small>' + (cur.D.venn[0] + cur.D.venn[1]) + ' livros seus, ' + (cur.D.venn[1] + cur.D.venn[2]) + ' de ' + esc(cur.D.n) + '</small></div></div>'
      : '<div class="bl" role="dialog" aria-label="Sua combinação com ' + esc(cur.D.n) + '">' + sky + '<i class="comet" aria-hidden="true"></i><div class="blbars">' + T.map((_, j) => '<i class="' + (j < i ? 'f' : j === i ? 'c' : '') + '"></i>').join('') + '</div><button class="ib blx" data-v9="x" aria-label="Fechar">' + v9ic('x', 20) + '</button>'
        + '<button class="blnav l" data-v9="prev" aria-label="Anterior"></button><button class="blnav r" data-v9="next" aria-label="Próximo"></button>' + v9Screen(cur.D, T[i], cur.prev) + '</div>';
    sr.innerHTML = ''; sr.append(st()); const w = document.createElement('div'); w.innerHTML = html; sr.append(w);
    if (!cur.calc && i < T.length - 1) tmr = setTimeout(() => { if (cur && cur.i === i) { cur.i++; draw(); } }, 8000);
  };
  const open = async (d, mode) => {
    if (ov) close(); const saved = v9Get(d.handle);
    const mk = () => { ov = document.createElement('div'); ov.className = 'v9ov'; TR.append(ov); ov.attachShadow({ mode: 'open' }).addEventListener('click', (ev) => { ev.stopPropagation(); onOv(ev); }); ov.addEventListener('click', (ev) => ev.stopPropagation()); };
    let M = {}; const pM = v9Match(d.handle).then((x) => { if (x) M = x; });
    const D = v9Data(d, M); D.meName = String((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || 'Você').split(' ')[0];
    D.avMe = v9Av('me', d); D.avEl = v9Av('el', d); D.avMeBig = v9Av('me', d, 'big'); D.avElBig = v9Av('el', d, 'big');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mode === 'view' && saved) { await Promise.race([pM, new Promise((r) => setTimeout(r, 4000))]); mk(); cur = { D, T: [], i: 0, prev: null, calc: false }; }
    else { mk(); cur = { D, T: [], i: 0, prev: null, calc: true }; draw(); await Promise.all([Promise.race([pM, new Promise((r) => setTimeout(r, 4000))]), new Promise((r) => setTimeout(r, reduce ? 300 : 1600))]); }
    if (!ov || !cur) return;
    const D2 = v9Data(d, M); Object.assign(D2, { meName: D.meName, avMe: D.avMe, avEl: D.avEl, avMeBig: D.avMeBig, avElBig: D.avElBig });
    const evo = mode === 'upd' && saved ? { comum: saved.comum, pers: saved.pers, at: saved.at } : (mode === 'view' && saved && saved.prevV) || null;
    if (mode !== 'view') v9Put(d.handle, { at: todayISO(), pers: D2.pers, comum: D2.venn[1], sig: D2.sig, prevV: evo });
    cur = { D: D2, T: v9Telas(D2, !!evo), i: 0, prev: evo, calc: false, d }; draw();
  };
  const onClick = (ev, h) => { const b = ev.target.closest('[data-v9]'); if (!b) return; const d = S.fpData; if (!d || d.handle !== h.dataset.h) return; act(b.dataset.v9, d); };
  const onOv = (ev) => { const b = ev.target.closest('[data-v9]'); if (!b || !cur) return; const k = b.dataset.v9;
    if (k === 'x') return close(); if (cur.calc) return;
    if (k === 'next') { if (cur.i >= cur.T.length - 1) return; cur.i++; return draw(); }
    if (k === 'again') { cur.i = 0; return draw(); }
    if (k === 'prev') { cur.i = Math.max(0, cur.i - 1); return draw(); }
    act(k, cur.d || S.fpData); };
  const act = (k, d) => {
    if (k === 'calc' || k === 'upd' || k === 'view') return open(d, k);
    if (k === 'disc') { const txt = v9Assunto(cur, d); close(); try { openChat(d.handle); } catch {} if (txt) { let n = 0; const put = () => { const ta = TR.querySelector('#shelflist textarea'); if (ta && !ta.value) { ta.value = txt; ta.dispatchEvent(new Event('input', { bubbles: true })); return; } if (++n < 20) setTimeout(put, 150); }; setTimeout(put, 200); } return; }
    if (k === 'add') { if (needAccount()) return; sapi('POST', '/v1/friends/requests', { handle: d.handle }).then((r) => toast(r && r.status < 300 ? 'Pedido de amizade enviado' : 'Não consegui enviar o pedido agora')).catch(() => toast('Não consegui enviar o pedido agora')); return; }
    if (k === 'junto') { close(); try { ljOpen(d); } catch {} return; }
    if (k === 'quero' && cur && cur.D.nx) { const x = cur.D.nx; try { addToLibrary({ title: x.title, author: x.author || '', cover: x.cover || null }, null, 'QUERO'); toast('Foi para o seu Quero ler'); b9Done(); } catch { toast('Não consegui agora'); } return; }
    if (k === 'comum') { close(); const cm = TR.querySelector('#shelflist .cm-btn'); if (cm) cm.click(); return; } // a página das leituras em comum, com as duas notas lado a lado
    if (k === 'share' && cur) return v9Share(cur.D);
    if (k === 'lidos') { try { goTab('estante'); } catch {} return; }
    if (k === 'hist') { try { if (typeof openFixReads === 'function') openFixReads(); else goTab('estante'); } catch {} return; }
    if (k === 'indicar') { try { openChat(d.handle); } catch {} return; }
  };
  const b9Done = () => { const b = ov && ov.shadowRoot.querySelector('[data-v9=quero]'); if (b) b.remove(); };
  // o cartão antigo dá lugar ao novo: v2Afi devolve só o lugar (o desenho é feito no shadow root, sem cálculo)
  v2Afi = function (d) { if (d && !d.self && d.handle) setTimeout(() => { v9Match(d.handle); }, 400); return d && !d.self && d.handle ? '<section class="v2afi v9h" data-h="' + esc(d.handle) + '"></section>' : ''; };
  { const s = document.createElement('style'); s.textContent = '.v2afi.v9h{background:none!important;padding:0!important;box-shadow:none!important;margin:.9rem 0 .4rem!important;color:inherit}.v9ov{position:fixed;inset:0;z-index:2147483000}'; TR.append(s); }
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; mount(); }, 80); }).observe(TR, { childList: true, subtree: true });
  // voltar do celular fecha a sequência primeiro
  addEventListener('popstate', () => { if (ov) close(); });
}
async function v9Share(D) {
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  x.fillStyle = '#1a1230'; x.fillRect(0, 0, W, H);
  const g1 = x.createRadialGradient(0, 0, 0, 0, 0, 1000); g1.addColorStop(0, 'rgba(224,144,74,.55)'); g1.addColorStop(1, 'rgba(224,144,74,0)'); x.fillStyle = g1; x.fillRect(0, 0, W, H);
  const g2 = x.createRadialGradient(W, H, 0, W, H, 1100); g2.addColorStop(0, 'rgba(165,140,240,.6)'); g2.addColorStop(1, 'rgba(165,140,240,0)'); x.fillStyle = g2; x.fillRect(0, 0, W, H);
  x.fillStyle = '#fff'; for (let i = 0; i < 70; i++) { x.globalAlpha = 0.25 + ((i * 7) % 6) / 10; x.fillRect(((i * 37 + 11) % 100) / 100 * W, ((i * 53 + 7) % 100) / 100 * H, 4, 4); } x.globalAlpha = 1;
  // constelação
  const P = [[30, 70], [52, 40], [80, 58], [104, 30], [126, 62], [150, 36], [172, 70], [96, 92], [60, 104], [138, 100], [116, 128], [80, 132]], L = [[0, 1], [1, 3], [3, 5], [5, 6], [1, 2], [2, 4], [4, 6], [2, 7], [7, 4], [7, 8], [7, 9], [9, 10], [8, 11], [10, 11]];
  const sh = new Set([7, 2, 4, 10, 8, 9].slice(0, Math.min(6, D.venn[1]))), s = 4.2, ox = W / 2 - 100 * s, oy = 260;
  x.strokeStyle = 'rgba(255,255,255,.45)'; x.lineWidth = 3; L.forEach(([a, b]) => { x.beginPath(); x.moveTo(ox + P[a][0] * s, oy + P[a][1] * s); x.lineTo(ox + P[b][0] * s, oy + P[b][1] * s); x.stroke(); });
  P.forEach(([px, py], k) => { x.fillStyle = sh.has(k) ? '#fff' : k % 2 ? '#c3b0ff' : '#f0b070'; x.beginPath(); x.arc(ox + px * s, oy + py * s, sh.has(k) ? 16 : 12, 0, Math.PI * 2); x.fill(); });
  x.textAlign = 'center'; x.fillStyle = '#ffd6a3'; x.font = '700 54px Georgia, serif'; x.fillText('Livroverso ✦', W / 2, 160);
  x.fillStyle = '#fff'; x.font = '700 104px Georgia, serif';
  const words = String(D.pers).split(' '); let line = '', y = 1080; const lines = []; words.forEach((w) => { const t = line ? line + ' ' + w : w; if (x.measureText(t).width > 920 && line) { lines.push(line); line = w; } else line = t; }); if (line) lines.push(line);
  lines.forEach((l) => { x.fillText(l, W / 2, y); y += 118; });
  x.font = '800 40px Nunito, sans-serif'; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText(D.meName + ' + ' + D.n + ' · ' + D.tag, W / 2, y + 20);
  const bw = 290, gap = 30, bx = (W - (3 * bw + 2 * gap)) / 2, by = y + 110;
  D.mini.forEach(([v, l], i) => { const px = bx + i * (bw + gap); x.fillStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.roundRect(px, by, bw, 200, 30); x.fill(); x.fillStyle = '#fff'; x.font = '900 72px Nunito, sans-serif'; x.fillText(String(v), px + bw / 2, by + 100); x.font = '800 32px Nunito, sans-serif'; x.fillStyle = 'rgba(255,255,255,.85)'; x.fillText(String(l).slice(0, 18), px + bw / 2, by + 158); });
  const blob = await new Promise((r) => c.toBlob(r, 'image/png')); if (!blob) return toast('Não consegui gerar a imagem');
  const file = new File([blob], 'livroverso-combinacao.png', { type: 'image/png' });
  try { if (navigator.canShare && navigator.canShare({ files: [file] })) return await navigator.share({ files: [file], title: 'Nossa combinação no Livroverso' }); } catch {}
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = file.name; document.body.append(a); a.click(); a.remove(); toast('Imagem salva');
}

// /match por pessoa: guardado 5 min e pedido já ao abrir o perfil, para a sequência abrir rápido e sempre com as mesmas telas (teste 27 e 31)
const V9M = {};
function v9Match(h) { const c = V9M[h]; if (c && (c.p || Date.now() - c.t < 300000)) return c.p || Promise.resolve(c.M);
  const p = sapi('GET', '/v1/users/' + encodeURIComponent(h) + '/match').then((r) => { const M = r && r.status === 200 && r.data ? r.data : null; V9M[h] = M ? { t: Date.now(), M } : { t: 0 }; return M; }).catch(() => { V9M[h] = { t: 0 }; return null; });
  V9M[h] = { t: 0, p }; return p; }
// assunto do Discutir: o que a tela mostrava (teste 28)
function v9Assunto(cur, d) { try { const D = cur && cur.D, k = cur && cur.T[cur.i]; const f = (x) => String(x).replace('.', ',');
    if (k === 'rg' && D.rg.length) { const t = D.rg.slice().sort((a, b) => Math.abs(b.m - b.e) - Math.abs(a.m - a.e))[0];
      return t.m === t.e ? 'Sobre ' + t.title + ': nós duas demos ★' + f(t.m) + '. O que mais te pegou?' : 'Sobre ' + t.title + ': eu dei ★' + f(t.m) + ' e você ★' + f(t.e) + '. Bora discutir?'; }
    if (k === 'em' && D.ec && D.ec.length) return 'Vi na nossa combinação que ' + D.ec.slice(0, 2).join(' e ').toLowerCase() + ' marca as duas. Qual livro te deixou assim?';
    if (k === 'ecos' && D.ecos.livro) return 'Vi seu eco em ' + D.ecos.livro.title + '. Em que parte você deixou?';
    if (k === 'foco') return 'Vi na nossa combinação os nossos horários de leitura. Qual é seu momento favorito para ler?';
    return 'Vi nossa combinação no Livroverso: ' + (D.pers || '') + '!'; } catch { return ''; } }
