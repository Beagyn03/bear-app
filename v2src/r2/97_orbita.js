// Órbita de leitura (Bia, 17/11; no lugar da "ofensiva"): dias seguidos em que a pessoa atualizou a página de algum livro.
// Topo: planeta com o número de dias. Início: cartão com a órbita, o recorde e a semana em barrinhas.
// Tocar no planeta abre "Sua órbita de leitura": órbita, recorde e o calendário do mês com a capa do livro mais lido em cada dia
// (estrelinha quando bateu a meta do prazo). Dia de folga de um prazo não quebra a órbita. Hoje sem leitura ainda não quebra.
{ const st = document.createElement('style'); st.textContent = `
.g-orb{display:flex;align-items:center;gap:.25rem;height:40px;padding:0 .65rem 0 .4rem;border-radius:99px;border:1.5px solid color-mix(in srgb,#f0b84a 70%,var(--line));background:var(--panel);color:var(--ink);font:inherit;font-weight:900;font-size:.95rem;cursor:pointer;flex:none}
.g-orb img{width:26px;height:26px}.g-orb.off img{filter:grayscale(1);opacity:.55}.g-orb.off{border-color:var(--line);color:var(--ink-2)}
.orb-card{display:block;width:100%;text-align:left;font:inherit;color:var(--ink);background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:.8rem .9rem;margin:.2rem 0 1rem;cursor:pointer}
.orb-hd{display:grid;grid-template-columns:50px minmax(0,1fr) auto;gap:.7rem;align-items:center}
.orb-ic{width:50px;height:50px;border-radius:15px;background:color-mix(in srgb,#f0b84a 14%,transparent);padding:6px;box-sizing:border-box}.orb-ic img,.orb-ic .orb-svg{width:100%;height:100%;display:block}.orb-ic{color:#c98a1c}.g-orb .orb-svg{width:20px;height:20px;flex:none}
.orb-ic.off img,.orb-ic.off .orb-svg{filter:grayscale(1);opacity:.55}
.orb-hd b{display:block;font-size:1rem}.orb-hd small{display:block;font-size:.76rem;color:var(--ink-2);font-weight:700;margin-top:.1rem}
.orb-rec{text-align:right}.orb-rec small{font-size:.62rem;text-transform:uppercase;letter-spacing:.05em}.orb-rec b{font-size:1rem}
.orb-wk{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-top:.75rem}
.orb-wk span{display:grid;justify-items:center;gap:4px;font-size:.6rem;font-weight:800;color:var(--ink-2)}
.orb-wk i{width:100%;height:8px;border-radius:99px;background:color-mix(in srgb,var(--ink) 9%,transparent)}
.orb-wk i.on{background:linear-gradient(90deg,#f6c95a,#e2902c)}.orb-wk i.off{background:none;border:1.5px dashed var(--line);height:5px}
.orb-wk i.hj{background:none;border:1.5px dashed var(--acc);height:5px}.orb-wk i.hj.on{border:0;height:8px;background:linear-gradient(90deg,#f6c95a,#e2902c)}
.orb-row{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:.6rem;margin:.2rem 0 1rem;align-items:stretch}.orb-row > *{margin:0!important;min-width:0}
.orb-sm{display:flex;flex-direction:column;padding:.7rem .75rem}.orb-sh{display:flex;align-items:center;gap:.4rem;font-size:.8rem;font-weight:900;color:var(--ink)}.orb-sh .orb-ic{width:30px;height:30px;border-radius:10px;padding:3px}
.orb-sm .orb-n{font-size:1.35rem;margin-top:.35rem;line-height:1.1}.orb-sm .orb-r{font-size:.7rem;color:var(--ink-2);font-weight:700}.orb-sm .orb-wk{gap:3px;margin-top:auto;padding-top:.5rem}.orb-sm .orb-wk span{font-size:.55rem}
.orb-row .ini-conq{padding:.7rem .75rem}.orb-row .ini-conq .v3-sh{margin:0 0 .35rem!important}.orb-row .ini-conq .v3-sh b{font-size:.8rem}.orb-row .ini-conq .v3-ach{display:grid!important;grid-template-columns:1fr!important;justify-items:start;gap:.3rem;text-align:left}.orb-row .ini-conq .v3-ach img,.orb-row .ini-conq .v3-ach .v3-ach-ph{width:38px!important;height:38px!important}.orb-row .ini-conq .v3-ach small{display:none!important}.orb-row .ini-conq .v3-ach > span{width:100%}.orb-row .ini-conq .v3-ach b{font-size:.82rem;line-height:1.2}
.orb-pg .orb-big{display:grid;grid-template-columns:64px minmax(0,1fr) auto;gap:.8rem;align-items:center;margin:.3rem 0 .4rem}
.orb-pg .orb-big .orb-ic{width:64px;height:64px;border-radius:20px;padding:7px}
.orb-pg .orb-big b{display:block;font-size:1.45rem}.orb-pg .orb-big small{font-size:.8rem;color:var(--ink-2);font-weight:700}
.orb-pg .orb-tx{font-size:.8rem;line-height:1.4;color:var(--ink-2);margin:.2rem 0 .8rem}
.orb-cal{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:.75rem}
.orb-mn{display:flex;align-items:center;justify-content:space-between;margin-bottom:.3rem}.orb-mn b{font-size:.95rem}
.orb-mn button{width:44px;height:44px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--ink) 55%,var(--panel));background:var(--panel);color:var(--ink);font:inherit;font-size:1.3rem;font-weight:900;line-height:1;display:grid;place-items:center;cursor:pointer}.orb-mn button:disabled{opacity:.35;cursor:default}
.orb-sum{font-size:.76rem;font-weight:800;color:var(--acc);margin:0 0 .5rem}
.orb-g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px}
.orb-g .h{font-size:.6rem;font-weight:900;color:var(--ink-2);text-align:center;text-transform:uppercase}
.orb-g .d{position:relative;aspect-ratio:3/4;border-radius:8px;background:color-mix(in srgb,var(--ink) 5%,transparent);overflow:hidden;font-size:.62rem;font-weight:800;color:var(--ink-2)}
.orb-g .d > i{position:absolute;top:3px;left:4px;font-style:normal;z-index:2}
.orb-g .d.rd > i{top:2px;left:2px;min-width:16px;padding:1px 4px;border-radius:99px;background:rgba(18,12,8,.78);color:#fff;text-align:center;line-height:1.25;text-shadow:none}
.orb-g .d .cv{position:absolute!important;inset:0!important;width:auto!important;height:auto!important;border-radius:0!important;background-size:cover!important;background-position:center!important;font-size:.36rem!important}
.orb-g .d.hj::after{content:'';position:absolute;inset:0;z-index:3;border:2.5px solid var(--acc);border-radius:inherit;pointer-events:none}.orb-g .d.hj:not(.rd) > i{color:var(--acc);font-weight:900}.orb-g .d.fut{background:none;border:1.5px dashed color-mix(in srgb,var(--ink) 14%,transparent)}.orb-g .d.fut > i{color:var(--ink-2)}.orb-g .d.empty{background:none}
.orb-g .d u{position:absolute;right:2px;bottom:2px;z-index:4;width:16px;height:16px;border-radius:50%;display:grid;place-items:center;text-decoration:none;font-size:.62rem;line-height:1;background:rgba(18,12,8,.78);color:#ffd257}
.orb-leg{display:flex;align-items:center;gap:.8rem;margin-top:.6rem;font-size:.72rem;color:var(--ink-2);font-weight:700}.orb-leg .lk{display:inline-flex;align-items:center;gap:.3rem}.orb-leg .lk-hj{width:14px;height:18px;border-radius:4px;border:2.5px solid var(--acc);box-sizing:border-box}.orb-leg .lk-st{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;font-size:.62rem;background:rgba(18,12,8,.78);color:#ffd257}
`; TR.append(st); }
const ORB_IMG = 'img/orbita.webp';
// ícone de traço no lugar do planeta colorido (Bia, 20/11: acabamento); mesmo desenho do cartão do topo do Hoje
const ORB_SVG = '<svg class="orb-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(-18 12 12)"/></svg>';
const orbAddDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
// dias com leitura: { 'AAAA-MM-DD': { pages, books: Map(libId -> pages) } }
function orbDays() {
  const days = new Map();
  lib().forEach((e) => (e.readLog || []).forEach((l) => { const p = Number(l.pages) || 0; if (!l || !l.date || p <= 0) return; const d = String(l.date).slice(0, 10);
    if (!days.has(d)) days.set(d, { pages: 0, books: new Map() }); const x = days.get(d); x.pages += p; x.books.set(e.id, (x.books.get(e.id) || 0) + p); }));
  return days;
}
// folga de prazo: dia da semana de folga dentro do período de algum prazo
function orbIsOff(d) { const w = new Date(d + 'T12:00:00').getDay(); return lib().some((e) => e.dueAt && e.dueSince && (e.dueOff || []).includes(w) && d >= String(e.dueSince).slice(0, 10) && d <= e.dueAt); }
function orbStats() {
  const days = orbDays(), t = todayISO();
  let cur = 0, d = days.has(t) ? t : orbAddDays(t, -1), since = null;
  for (let guard = 0; guard < 4000; guard++) { if (days.has(d)) { cur++; since = d; } else if (!orbIsOff(d)) break; d = orbAddDays(d, -1); }
  const keys = [...days.keys()].sort(); let best = 0, run = 0, prev = null;
  for (const k of keys) { if (prev) { let gap = orbAddDays(prev, 1), ok = true; while (gap < k) { if (!orbIsOff(gap)) { ok = false; break; } gap = orbAddDays(gap, 1); } run = ok ? run + 1 : 1; } else run = 1; best = Math.max(best, run); prev = k; }
  return { days, cur, best: Math.max(best, cur), since, today: days.has(t) };
}
const orbTxt = (s) => s.cur ? (s.cur === 1 ? 'Em órbita há 1 dia' : 'Em órbita há ' + s.cur + ' dias') : 'Fora de órbita';
const orbSub = (s) => s.today ? (s.cur > 1 ? 'Leitura de hoje registrada' : 'Primeiro dia da órbita') : s.cur ? 'Leia uma página hoje para continuar' : 'Atualize uma página para entrar em órbita';
// ícone do topo
{ let tm = 0; const paint = () => {
    const bell = TR.querySelector('#g-msg'); if (!bell) return;
    let b = TR.querySelector('#g-orb'); if (!b) { b = document.createElement('button'); b.type = 'button'; b.id = 'g-orb'; b.className = 'g-orb'; bell.before(b); b.addEventListener('click', () => openOrbita()); }
    const s = orbStats(), html = ORB_SVG + s.cur; if (b.dataset.k !== html) { b.innerHTML = html; b.dataset.k = html; } // compara pela chave: o innerHTML de SVG volta serializado diferente e reescrevia o ícone sem parar (reteste 21/11: a Pergunta do dia sumia)
    b.classList.toggle('off', !s.today); b.setAttribute('aria-label', orbTxt(s) + '. Abrir sua órbita de leitura'); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 120); }).observe(TR, { childList: true, subtree: true }); setTimeout(paint, 800); }
// cartão do Hoje (logo depois do Lendo agora)
function orbCardHTML(compact) {
  const s = orbStats(), t = todayISO(), DW = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const wk = Array.from({ length: 7 }, (_, i) => orbAddDays(t, i - 6)).map((d) => { const on = s.days.has(d), off = !on && orbIsOff(d), hj = d === t;
    return '<span><i class="' + (on ? 'on' : '') + (off ? ' off' : '') + (hj ? ' hj' : '') + '"></i>' + (compact ? (hj ? 'hoje' : DW[new Date(d + 'T12:00:00').getDay()].slice(0, 1)) : hj ? 'hoje' : DW[new Date(d + 'T12:00:00').getDay()]) + '</span>'; }).join('');
  if (compact) return '<button type="button" class="orb-card orb-sm" id="orb-card"><div class="orb-sh"><span class="orb-ic' + (s.today ? '' : ' off') + '">' + ORB_SVG + '</span><span>Órbita</span></div><b class="orb-n">' + s.cur + (s.cur === 1 ? ' dia' : ' dias') + '</b><small class="orb-r">' + (s.today || !s.cur ? 'recorde ' + s.best : 'leia hoje para seguir') + '</small><div class="orb-wk">' + wk + '</div></button>';
  return '<button type="button" class="orb-card" id="orb-card"><div class="orb-hd"><span class="orb-ic' + (s.today ? '' : ' off') + '">' + ORB_SVG + '</span><div><b>' + orbTxt(s) + '</b><small>' + orbSub(s) + '</small></div><div class="orb-rec"><small>recorde</small><b>' + s.best + (s.best === 1 ? ' dia' : ' dias') + '</b></div></div><div class="orb-wk">' + wk + '</div></button>';
}
{ let tm = 0; const paint = () => {
    const box = TR.querySelector('#lista'); if (!box || S.tab !== 'inicio' || box.classList.contains('lista-snap')) return;
    const now = box.querySelector('.v3-now'); if (!now) return;
    const conq = box.querySelector('.ini-conq'), html = orbCardHTML(!!conq); let c = box.querySelector('#orb-card');
    if (c && c.dataset.h === html && (!conq || conq.parentElement.classList.contains('orb-row'))) return; if (c) c.remove();
    // com a Próxima conquista, os dois ficam lado a lado (Bia, 17/11)
    if (conq) { let row = conq.parentElement.classList.contains('orb-row') ? conq.parentElement : null; if (!row) { row = document.createElement('div'); row.className = 'orb-row'; conq.before(row); row.append(conq); } row.insertAdjacentHTML('afterbegin', html); }
    else now.insertAdjacentHTML('afterend', html);
    c = box.querySelector('#orb-card'); c.dataset.h = html; c.addEventListener('click', () => openOrbita()); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 90); }).observe(TR, { childList: true, subtree: true }); }
// página
function openOrbita(ym) {
  const v = $('#shelflist'); if (!v) return; const t = todayISO();
  S.orbYM = ym || S.orbYM || t.slice(0, 7);
  const draw = () => {
    const s = orbStats(), [Y, M] = S.orbYM.split('-').map(Number), first = new Date(Y, M - 1, 1), nDays = new Date(Y, M, 0).getDate(), lead = (first.getDay() + 6) % 7;
    const mName = first.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    // meta do prazo batida por dia (mesma conta do histórico do diário)
    const ok = new Set(); lib().forEach((e) => { if (!e.dueAt || !e.dueSince) return; try { tlEvents(e).forEach((x) => { if (x.ok) ok.add(x.d); }); } catch {} });
    let cells = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((d) => '<span class="h">' + d + '</span>').join('') + '<span class="d empty"></span>'.repeat(lead);
    let nRead = 0, pages = 0, nStar = 0;
    for (let d = 1; d <= nDays; d++) {
      const iso = Y + '-' + String(M).padStart(2, '0') + '-' + String(d).padStart(2, '0'), x = s.days.get(iso);
      let cv = ''; if (x) { nRead++; pages += x.pages; const top = [...x.books.entries()].sort((a, b) => b[1] - a[1])[0]; const e = top && byId(top[0]); if (e) cv = cvh(e.title, e.cover, ''); }
      if (ok.has(iso)) nStar++;
      cells += '<span class="d' + (x ? ' rd' : '') + (iso === t ? ' hj' : '') + (iso > t ? ' fut' : '') + '" title="' + (x ? x.pages + ' páginas' : '') + '"' + (iso === t ? ' aria-current="date"' : '') + '><i>' + d + '</i>' + cv + (ok.has(iso) ? '<u aria-label="meta do prazo batida">★</u>' : '') + '</span>';
    }
    const minYM = ([...s.days.keys()].sort()[0] || t).slice(0, 7);
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Órbita</b><span></span></div>'
      + '<div class="orb-pg"><div class="orb-big"><span class="orb-ic' + (s.today ? '' : ' off') + '">' + ORB_SVG + '</span><div><b>' + s.cur + (s.cur === 1 ? ' dia' : ' dias') + '</b><small>' + (s.cur ? 'em órbita' + (s.since ? ' · sem parar desde ' + s.since.slice(8, 10) + '/' + s.since.slice(5, 7) : '') : 'fora de órbita') + '</small></div><div class="orb-rec"><small>recorde</small><b>' + s.best + (s.best === 1 ? ' dia' : ' dias') + '</b></div></div>'
      + '<p class="orb-tx">Cada dia em que você atualiza a página de um livro conta. Um dia sem leitura e a órbita recomeça. Dias de folga de um prazo não quebram a órbita.</p>'
      + '<div class="orb-cal"><div class="orb-mn"><button type="button" data-m="-1" aria-label="Mês anterior"' + (S.orbYM <= minYM ? ' disabled' : '') + '><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><b>' + esc(mName) + '</b><button type="button" data-m="1" aria-label="Próximo mês"' + (S.orbYM >= t.slice(0, 7) ? ' disabled' : '') + '><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button></div>'
      + '<p class="orb-sum">' + (nRead ? nRead + (nRead === 1 ? ' dia lido' : ' dias lidos') + ' · ' + pages.toLocaleString('pt-BR') + ' páginas' : 'Nenhuma leitura registrada neste mês') + '</p><div class="orb-g">' + cells + '</div>'
      + '<div class="orb-leg">' + (S.orbYM === t.slice(0, 7) ? '<span class="lk"><i class="lk-hj"></i>hoje</span>' : '') + (nStar ? '<span class="lk"><i class="lk-st">★</i>meta do prazo batida</span>' : '') + '</div></div></div>';
    try { paintCv(v); } catch {}
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    v.querySelectorAll('.orb-mn [data-m]').forEach((b) => b.addEventListener('click', () => { const [y, m] = S.orbYM.split('-').map(Number), d = new Date(y, m - 1 + Number(b.dataset.m), 1); S.orbYM = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); draw(); }));
  };
  v.hidden = false; v.classList.remove('mine-page'); draw(); try { v.scrollTop = 0; } catch {}
}
// Topo sem o círculo de fundo nos ícones (Bia, 17/11): planeta, mensagens e notificações só com o desenho.
{ const st = document.createElement('style'); st.textContent = '.gtop .g-b,.gtop .g-orb{background:none!important;border:0!important;box-shadow:none!important}.gtop .g-b svg{width:28px!important;height:28px!important}.gtop .g-orb{padding:0 .3rem!important;gap:.15rem}.gtop .g-orb img{width:30px;height:30px}'; TR.append(st); }
