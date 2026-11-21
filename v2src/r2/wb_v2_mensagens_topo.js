// Mensagens e Avisos separados (Bia, 21/11):
//  1. Mensagens saem de dentro do sino: ícone próprio no topo (ao lado do sino), com o número de não lidas; abre direto as conversas.
//  2. O sino (Avisos) fica só com Notificações, sem abas, e só com o que é sobre a pessoa (convites, amizade, comentários e
//     curtidas no que é dela, empréstimo, presente, prazo, boas-vindas). O bloco "Novidades dos amigos" sai de Avisos.
//  3. Novidades das amizades (atualizações e posts) ficam na Comunidade: um ponto (sem número) no ícone Comunidade quando há
//     algo novo desde a última visita; some ao abrir a Comunidade. A última visita fica em db.prefs (sincroniza com a conta).
{ const st = document.createElement('style'); st.textContent = `
.gtop #g-msg{display:grid!important;place-items:center;color:var(--ink);background-image:none!important}
.gtop #g-msg > :not(.v2i):not(u){display:none!important}
.gtop #g-msg .v2i{width:24px;height:24px}
.gtop #g-msg::before,.gtop #g-msg::after{display:none!important}
.gtop #g-msg.on{color:var(--acc)}
:host(.ppfull) .gtop #g-msg{display:none!important}
#editor.ntpage .av-tabs,#shelflist .av-tabs{display:none!important}
#editor.ntpage .nt-sec,#editor.ntpage .nt-fd,#editor.ntpage #nt-all,#editor.ntpage .v6nofd{display:none!important}
@media (max-width:370px){.gtop .g-b{width:40px;min-width:40px}}
`; TR.append(st); }
// o sino conta só notificações (mensagens têm o próprio ícone)
avsPaintBell = function () {
  const bell = $('#g-bell'); if (!bell) return; const n = avsNt(); let u = bell.querySelector('u');
  if (!n) { u && u.remove(); return; } if (!u) { u = document.createElement('u'); bell.append(u); } const t = n > 9 ? '9+' : String(n); if (u.textContent !== t) u.textContent = t;
};
// sem abas Notificações | Mensagens
avsTabsSync = function () { TR.querySelectorAll('.av-tabs').forEach((x) => x.remove()); };
// sino: sempre Notificações (antes do ouvinte do b7, que abria Mensagens quando havia não lidas)
window.addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.id === 'g-bell'); if (!b) return;
  ev.stopPropagation(); ev.preventDefault(); avsOpen('nt');
}, true);
// ícone de mensagens: abre as conversas (nunca dentro de Avisos)
window.addEventListener('click', (ev) => {
  const p = ev.composedPath ? ev.composedPath() : []; const b = p.find((n) => n && n.id === 'g-msg'); if (!b) return;
  ev.stopPropagation(); ev.preventDefault();
  try { if (connected() && socialProfile) { const ed = $('#editor'); if (ed && !ed.hidden && ed.classList.contains('ntpage')) closeEd(); openThreads(); } else needAccount(); } catch (e) { console.warn('mensagens', e); }
}, true);
// título da tela: "Mensagens" nas conversas, "Avisos" nas notificações; "Nova mensagem" no alto da lista
{ const PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
  let tm = 0; const fix = () => { tm = 0;
    const v = $('#shelflist'), msg = !!(v && !v.hidden && S.navView && S.navView.t === 'threads');
    const avt = TR.querySelector('#g-avt'); if (avt) { const t = msg ? 'Mensagens' : 'Avisos'; if (avt.textContent !== t) avt.textContent = t; }
    const mb = TR.querySelector('#g-msg'); if (mb) { mb.classList.toggle('on', msg);
      const mi = mb.querySelector(':scope > .v2i'); if (mi && mi.querySelector('image')) mi.remove(); // o bloco antigo troca o desenho do 1º svg por imagem colorida
      if (!mb.querySelector(':scope > .v2i')) mb.insertAdjacentHTML('afterbegin', '<svg class="v2i" data-ic2="1" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="d" d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5z"/><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17H6.5A2.5 2.5 0 0 1 4 14.5zM8 9h8M8 12.5h5"/></svg>');
      const n = (S.msg && S.msg.unread) || 0; const lbl = n ? 'Mensagens, ' + n + ' não lida' + (n > 1 ? 's' : '') : 'Mensagens'; if (mb.getAttribute('aria-label') !== lbl) mb.setAttribute('aria-label', lbl); }
    if (msg) { const body = v.querySelector('.sl-body'), add = body && body.querySelector('#th-new');
      if (body && add) { let lh = body.querySelector('.av-lh'); if (!lh) { const top = body.querySelector('.sl-top'); (top || body.firstElementChild || body).insertAdjacentHTML(top ? 'afterend' : 'beforebegin', '<div class="av-lh"><b>Conversas</b></div>'); lh = body.querySelector('.av-lh'); }
        if (lh && add.parentElement !== lh) lh.append(add); if (!add.dataset.v2) { add.dataset.v2 = '1'; add.innerHTML = PEN + 'Nova mensagem'; add.setAttribute('aria-label', 'Nova mensagem'); add.removeAttribute('title'); } } }
  };
  new MutationObserver(() => { if (!tm) tm = setTimeout(fix, 50); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }
// ponto da Comunidade: só novidades das amizades (atualizações e posts) desde a última visita
const commSeenAtV2 = () => { let a = ''; try { a = (db.prefs && db.prefs.commSeenAt) || ''; } catch {} const b = (typeof L !== 'undefined' && L.commSeenAt) || ''; return a > b ? a : b; };
const commNewsV2 = () => {
  const at = commSeenAtV2(); const t = (x) => String((x && (x.updatedAt || x.createdAt || x.at)) || '');
  let feed = []; try { const f = SOC.feed; feed = [...(Array.isArray(f) ? f : (f && f.items) || []), ...(SOC.feedExtra || [])]; } catch {}
  let posts = []; try { posts = (S.rd && S.rd.items) || []; } catch {}
  return [...feed, ...posts].some((x) => x && !x.mine && t(x) > at);
};
paintCommDot = function () {
  const b = $('#tabbar button[data-tab="comunidade"]'); if (!b) return;
  let on = false; try { on = S.tab !== 'comunidade' && commNewsV2(); } catch {}
  const d = b.querySelector('.tb-dot');
  if (on && !d) b.insertAdjacentHTML('beforeend', '<i class="tb-dot" aria-label="Novidades na Comunidade"></i>'); else if (!on && d) d.remove();
};
const commMarkSeen = () => { const now = new Date().toISOString();
  try { L.commSeenAt = now; saveL(); } catch {}
  try { db.prefs = db.prefs || {}; if (db.prefs.commSeenAt !== now) { db.prefs.commSeenAt = now; save(); } } catch {}
  try { paintCommDot(); } catch {} };
{ const _gt = goTab; goTab = function (tab) { const r = _gt.apply(this, arguments); if (tab === 'comunidade') setTimeout(commMarkSeen, 300); return r; }; }
// sair da Comunidade também conta como visto (o que chegou enquanto ela estava aberta já foi visto)
{ let was = S.tab; let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0;
    if (was === 'comunidade' && S.tab !== 'comunidade') commMarkSeen(); was = S.tab; try { paintCommDot(); } catch {} }, 200); })
    .observe(TR, { childList: true, subtree: true }); }
