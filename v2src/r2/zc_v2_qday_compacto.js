// v2 (Bia, 22/11): "Depois de responder o card fica mais reduzido não?" — a Pergunta do dia, depois do voto, vira uma linha
// compacta ("Pergunta do dia · você votou em X · 64% · Ver resultado ›", até ~56 px). Tocar expande no lugar (top 3 com barras e
// "Mais votados ›"); "Recolher" volta à linha. O × (ou deslizar a linha para o lado) dispensa até a próxima pergunta, com Desfazer.
// Logo depois de votar no próprio cartão ele fica aberto para mostrar o resultado; ao reabrir o Hoje já aparece recolhido.
// A pergunta troca todo dia (API /v1/qday, rodízio de 20 perguntas): dispensar vale só para o dia da pergunta.
const V6QDX = 'lv.qdayx';
let v6QdOpenDay = '';
const v6QdDay = () => (V6QD && V6QD.day) || todayISO();
const v6QdOff = () => { try { const c = JSON.parse(localStorage.getItem(V6QDX) || 'null'); return !!(c && c.day === v6QdDay()); } catch { return false; } };
const v6QdSetOff = (on) => { try { if (on) localStorage.setItem(V6QDX, JSON.stringify({ day: v6QdDay() })); else localStorage.removeItem(V6QDX); } catch {} };
{
  const _h = v2QdayHTML;
  v2QdayHTML = function () {
    const html = _h.apply(this, arguments), Q = V6QD;
    if (!Q || Q.failed || !Q.mine) return html;
    if (v6QdOff()) return '<section class="v6qd-off" data-v2qd="1" style="display:none" aria-hidden="true"></section>';
    if (v6QdOpenDay === v6QdDay()) return html.replace('<section class="v2-qd"', '<section class="v2-qd v6qd-open"').replace(/<\/section>\s*$/, '<button type="button" class="v6qd-rc" data-q6x="close">Recolher</button></section>');
    const mine = (Q.top || []).find((x) => normT(x.title) === normT(Q.mine.title)), pc = mine && Q.total ? Math.round(mine.votes / Q.total * 100) : 0;
    return `<section class="v2-qd v6qd-mini" data-v2qd="1"><button type="button" class="m" data-q6x="open" aria-label="${DEB.nome}: ver resultado"><span class="k">${DEB.nome}${pc ? ` · ${pc}%` : ''}</span><span class="t">seu voto: <b>${esc(Q.mine.title)}</b></span><em>Resultado ›</em>${pc ? `<span class="bar"><i style="width:${pc}%"></i></span>` : ''}</button><button type="button" class="x" data-q6x="off" aria-label="Dispensar até a próxima pergunta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></section>`;
  };
}
const v6QdRe = () => { try { v2HojeEnsure(); } catch {} };
function v6QdDismiss() {
  v6QdSetOff(true); v6QdOpenDay = ''; v6QdRe();
  try { toast(DEB.nome + ' escondido até a próxima semana', { label: 'Desfazer', fn: () => { v6QdSetOff(false); v6QdRe(); } }); } catch {}
}
// votar pelo próprio cartão: abre o resultado nesta visita
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-v2qd] [data-qb]'); if (b) v6QdOpenDay = v6QdDay(); }, true);
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('[data-v2qd] [data-q6x]'); if (!b) return; ev.stopPropagation();
  const a = b.dataset.q6x;
  if (a === 'open') v6QdOpenDay = v6QdDay(); else if (a === 'close') v6QdOpenDay = ''; else if (a === 'off') return v6QdDismiss();
  v6QdRe();
}, true);
// deslizar a linha compacta para o lado dispensa (como o cartão do topo do Hoje)
{
  let st = null;
  TR.addEventListener('pointerdown', (ev) => { const m = ev.target.closest && ev.target.closest('.v6qd-mini'); if (!m || ev.button > 0) return; st = { m, x: ev.clientX, y: ev.clientY, dx: 0, on: false }; }, true);
  window.addEventListener('pointermove', (ev) => {
    if (!st) return; const dx = ev.clientX - st.x, dy = ev.clientY - st.y;
    if (!st.on) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { st = null; return; } if (Math.abs(dx) < 10) return; st.on = true; }
    st.dx = dx; st.m.style.transform = `translateX(${dx}px)`; st.m.style.opacity = String(Math.max(.25, 1 - Math.abs(dx) / 260));
  }, { passive: true });
  const end = () => {
    if (!st) return; const s = st; st = null; if (!s.on) return;
    const sup = (e) => { e.stopPropagation(); e.preventDefault(); }; window.addEventListener('click', sup, { capture: true, once: true }); setTimeout(() => window.removeEventListener('click', sup, true), 350);
    if (Math.abs(s.dx) > 90) { s.m.style.transition = 'transform .18s, opacity .18s'; s.m.style.transform = `translateX(${s.dx > 0 ? 420 : -420}px)`; s.m.style.opacity = '0'; setTimeout(v6QdDismiss, 170); }
    else { s.m.style.transition = 'transform .18s, opacity .18s'; s.m.style.transform = ''; s.m.style.opacity = ''; setTimeout(() => { s.m.style.transition = ''; }, 200); }
  };
  window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
}
{ const st = document.createElement('style'); st.textContent = `.v3-colA.v3h > .v6qd-off.v6qd-off,.v6qd-off.v6qd-off{display:none!important}
.v3-colA.v3h > .v2-qd.v6qd-mini,.v2-qd.v6qd-mini.v6qd-mini{display:flex!important;flex-wrap:nowrap!important;flex-direction:row!important;align-items:center;gap:4px;padding:3px 4px 3px 14px!important;min-height:0!important;height:auto!important;touch-action:pan-y;user-select:none;-webkit-user-select:none}
.v6qd-mini .m{flex:1;min-width:0;display:grid;grid-template-columns:1fr auto;grid-template-areas:"k e" "t e" "b b";column-gap:10px;row-gap:1px;align-items:center;background:none;border:0;padding:3px 0;color:inherit;font:inherit;text-align:left;cursor:pointer;line-height:1.25}
.v6qd-mini .k{grid-area:k;font-size:10.5px!important;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:var(--acc);margin:0!important}
.v6qd-mini .t{grid-area:t;font-size:13.5px;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v6qd-mini .t b{color:var(--ink);font-weight:800}
.v6qd-mini em{grid-area:e;font-style:normal;font-weight:900;font-size:13px;color:var(--acc);white-space:nowrap}
.v6qd-mini .bar{grid-area:b;height:3px;border-radius:9px;background:color-mix(in srgb,var(--ink) 8%,var(--panel));overflow:hidden;margin-top:3px}.v6qd-mini .bar i{display:block;height:100%;background:linear-gradient(90deg,#e9a35c,#c46f2e)}
.v6qd-mini .x{flex:none;width:40px;height:40px;display:grid;place-items:center;border:0;background:none;color:var(--ink-2);border-radius:50%;cursor:pointer}.v6qd-mini .x svg{width:18px;height:18px}
.v2-qd .v6qd-rc{display:block;margin:10px auto 0;background:none;border:0;color:var(--ink-2);font:inherit;font-weight:800;font-size:13px;padding:8px 14px;cursor:pointer}`; TR.append(st); }
