// Folha de atualizar nova (Bia, 21/11; protótipo v177) — complemento do g0: estilos, "Adicionar detalhes" em página inteira,
// aba Histórico com a constelação da produção (tlHTML2 + csLines, mesmos dados e mesma edição/apagar) e o atalho
// "Ver histórico da leitura ›" em Minha leitura da página do livro.
const V6UPCSS = `
.v4ler .upseg{display:flex;margin:10px auto 2px;width:fit-content;max-width:100%}.v4ler .upseg button{flex:none;padding:7px 11px}
.v4ler .upsub{text-align:center;font-size:12.5px;color:var(--ink3);margin:-2px 0 6px;min-height:0}.v4ler .upsub:empty{display:none}.v4ler .upsub .lnk{margin-left:6px;text-decoration:none}
.v4ler .totask{margin:8px 0 4px;padding:12px;border-radius:14px;border:1.5px dashed var(--line)}.v4ler .totask label{display:grid;gap:2px}.v4ler .totask small{color:var(--ink3)}
.v4ler .uprw{position:relative;flex:1;display:flex;align-items:center}.v4ler .uprw input{width:100%}
.v4ler .upprev{position:absolute;left:var(--prev);top:50%;width:3px;height:16px;margin-left:-1.5px;transform:translateY(-50%);border-radius:2px;background:var(--ink3);opacity:.6;pointer-events:none}
.v4ler .pgsl.up input[type=range]{height:28px;touch-action:none}.v4ler .pgsl.up input[type=range]::-webkit-slider-thumb{width:30px;height:30px}.v4ler .pgsl.up input[type=range]::-moz-range-thumb{width:30px;height:30px}
.v4ler .pgsl.up button{width:40px;height:40px}
.v4ler #v4pgv.bump{animation:v6bump .22s ease}@keyframes v6bump{50%{transform:scale(1.08)}}
.v4ler .updet{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:56px;margin-top:14px;padding:12px 14px;border-radius:16px;border:1.5px solid color-mix(in srgb,var(--acc) 45%,var(--line));background:color-mix(in srgb,var(--acc) 10%,var(--card));box-shadow:0 2px 10px rgba(0,0,0,.12);color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.v4ler .updet .updt{display:grid;gap:2px;flex:1;min-width:0}.v4ler .updet .updt b{font-size:15px}.v4ler .updet .updi{display:flex;gap:6px;color:var(--acc);flex:none}.v4ler .updet small{color:var(--ink3);font-size:12px}
.v4ler .upsave{min-height:52px;font-size:16px}
.v4ler .uptabs{margin:12px 0 4px}.v4ler .upmeta{justify-content:space-between;align-items:center;margin-top:8px;font-size:13px}
.v4ler .uptiles{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}
.v4ler .uptile{display:grid;justify-items:center;gap:3px;padding:10px 4px;min-height:84px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--ink);font:inherit;text-align:center;cursor:pointer}
.v4ler .uptile b{font-size:13px}.v4ler .uptile small{font-size:11px;color:var(--ink3);line-height:1.2}.v4ler .uptile.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 10%,var(--card))}.v4ler .uptile svg{color:var(--acc)}
@media (max-width:380px){.v4ler .uptiles{grid-template-columns:repeat(2,1fr)}}
.v4ler .uppn{margin-top:12px;padding:12px;border-radius:14px;background:var(--soft)}.v4ler .uppn .cbox{background:var(--card)}.v4ler .uppn .seg{margin:4px 0 0}
.v4ler .spfix{display:flex;gap:8px;align-items:flex-start;margin:8px 0 0;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,var(--acc) 10%,transparent);font-size:12.5px;line-height:1.35}.v4ler .spfix svg{flex:none;margin-top:1px;color:var(--acc)}
.v4ler .sheet.upfullpg{top:0;max-height:none;border-radius:0;padding:0 18px 0;display:flex;flex-direction:column;animation:v6upfin .22s ease-out}
.v4ler .upfullpg .upfh{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:6px;margin:0 -18px 6px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px 8px;background:var(--card);border-bottom:1px solid var(--line)}
.v4ler .upfullpg .upfh h2{margin:0;font-family:var(--f-disp);font-size:19px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v4ler .upfullpg .upfh .ib{width:44px;height:44px;display:grid;place-items:center;border:0;background:none;color:var(--ink)}
.v4ler .upfullpg .sh-bk h3{display:none}.v4ler .upfullpg .grab{display:none}
.v4ler .upfullpg .upfoot{position:sticky;bottom:0;margin:auto -18px 0!important;padding:10px 18px calc(14px + env(safe-area-inset-bottom,0px));background:var(--card);border-top:1px solid var(--line)}
@keyframes v6upfin{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.v4ler #v4pgv.bump,.v4ler .sheet.upfullpg{animation:none}.v4ler .v6hist *{animation:none!important;transition:none!important}}
`;
{ const st = document.createElement('style'); st.textContent = `
#lista .v3ring.svfx{animation:v6svRing .9s ease}@keyframes v6svRing{0%{filter:none}40%{filter:drop-shadow(0 0 10px var(--acc))}100%{filter:none}}
.v6histlink{display:flex;align-items:center;justify-content:space-between;gap:10px;width:100%;text-align:left;margin:0 0 .7rem;padding:.7rem .85rem;border-radius:14px;border:1px solid var(--line);background:var(--panel,var(--card));color:var(--ink);font:inherit;font-weight:800;cursor:pointer}
.v6histlink small{font-weight:600;color:var(--ink-2,var(--ink3))}
@media (prefers-reduced-motion:reduce){#lista .v3ring.svfx{animation:none}}
`; TR.append(st); }

// estilos da folha e da linha do tempo/constelação (os da produção, escritos para #editor) vão para a raiz própria do v4 (shadow root)
function v6Css(R) { const root = R && R.getRootNode && R.getRootNode(); if (!root || root === document || root.querySelector('style.v6css')) return;
  const tl = [...TR.querySelectorAll('style')].map((x) => x.textContent || '').filter((t) => /#editor \.(tl|cs)[-a-z{ ]/.test(t)).join(String.fromCharCode(10)).replace(/#editor(?=[ .:{,])/g, '.v4ler .v6hist');
  const st = document.createElement('style'); st.className = 'v6css'; st.textContent = V6UPCSS + String.fromCharCode(10) + tl; root.append(st); }
// página inteira para "Adicionar detalhes" e o Histórico preenchido depois de desenhar
{ const _d = v4Draw; v4Draw = function () {
    const r = _d.apply(this, arguments);
    try { v6Css(V4);
      const st = v4State(), U = st.upd, R = V4; if (!R || !U || st.sheet !== 'upd') return r;
      const e = lib().find((x) => x.id === (st.sheetE || st.e)); const sh = R.querySelector('.sheet'); if (!sh || !e) return r;
      if (U.full) { sh.classList.add('upfullpg'); sh.setAttribute('aria-label', 'Atualizar · ' + e.title);
        sh.insertAdjacentHTML('afterbegin', `<header class="upfh"><button class="ib" data-a="upfull" aria-label="Voltar ao atalho">${v4ic('back', 22)}</button><h2>Atualizar · ${esc(e.title)}</h2></header>`); }
      const H = R.querySelector('#v6hist'); if (H) v6HistPaint(H, e);
    } catch (err) { console.warn('atualizar nova', err); }
    return r; }; }
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments); try { window.bearVoltarSync && window.bearVoltarSync(); } catch {} return r; }; } // voltar do celular enxerga a página cheia
function v6HistPaint(H, e) {
  const IC = { ler: 'pag', lock: 'lock', quote: 'quote', com: 'com', cal: 'cal', ok: 'ok', heart: 'heart', orb: 'orb' };
  const paint = () => { H.innerHTML = typeof tlHTML2 === 'function' ? tlHTML2(e, !!v4State().histAll) : ''; const tl = H.firstElementChild;
    // ícones de traço dentro da raiz do v4 (o preenchimento global de ícones não alcança este shadow root)
    H.querySelectorAll('i.v3e[data-i]').forEach((i) => { const k = IC[i.dataset.i] || i.dataset.i; if (V4ICON[k]) i.outerHTML = v4ic(k, 18); });
    requestAnimationFrame(() => { try { if (tl && typeof csLines === 'function') csLines(tl); } catch {} }); };
  if (!H._v6) { H._v6 = 1; H.addEventListener('click', (ev) => { if (ev.target.closest && ev.target.closest('.tl-more')) { v4State().histAll = true; return paint(); } try { tlEditClick(ev, e, paint); } catch (err) { console.warn('histórico', err); } }); }
  paint();
}
// "Ver histórico da leitura ›" em Minha leitura (página do livro)
{ let cur = null; const _ob = openBookPage; openBookPage = function (e) { cur = e; return _ob.apply(this, arguments); };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; try {
    const on = TR.querySelector('#shelflist:not([hidden]) .bp-tabs button[data-t=minha].on'); if (!on || !cur || cur._preview) return;
    // (Bia, 21/11) um link só, como cartão próprio logo abaixo das abas: antes entrava DENTRO do 1º cartão (linha do Meu exemplar)
    // e voltava a ser inserido em redesenhos. Agora procura no painel inteiro, remove extras e nunca entra num cartão.
    const nav = on.closest('.bp-tabs'), host = nav && nav.parentElement; if (!host) return;
    const all = [...host.querySelectorAll('.v6histlink')];
    if (all.length) { all.slice(1).forEach((x) => x.remove()); return; } // a posição final fica com wm_v2_minha_leitura.js
    const has = (cur.readLog || []).length || (cur.diary || []).length || (cur.notes || []).length || (cur.quotes || []).length || cur.startedTs;
    if (!has) return;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v6histlink'; b.innerHTML = '<span>Ver histórico da leitura<br><small>atualizações, comentários, trechos e anotações</small></span><span aria-hidden="true">›</span>';
    const e = cur; b.addEventListener('click', () => { const had = !!(V4 && V4.isConnected); const s = v4State(); s.view = null; v4Sheet('upd', e); s.upd.full = true; s.upd.tab = 'hist'; s.upd.fromLink = had ? 'ja' : 'novo'; v4Draw(); });
    nav.after(b);
  } catch {} }, 60); }).observe(TR, { childList: true, subtree: true }); }
