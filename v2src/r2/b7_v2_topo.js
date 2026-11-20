// v2 (Bia, 18/11): topo enxuto, "Avisos juntos".
//  - Topo só com ☰, marca, 🔍 e 🔔. Saem do topo a Órbita (vai para perto do card do Hoje) e o botão de Mensagens.
//  - 🔔 abre Avisos: abas Notificações | Mensagens, cada uma com o número do que é novo. Reaproveita a tela de
//    Notificações (#editor.ntpage) e a lista de conversas (openThreads) que já existiam; as abas entram por cima delas.
//  - Abre na aba que tem novidade (mensagem primeiro); sem novidade, na última usada. Voltar de uma conversa volta para
//    a aba Mensagens (pilha de navegação de sempre).
//  - O número do 🔔 soma notificações, indicações novas e mensagens não lidas.
//  - O ••• do topo só aparece onde tem opções (Hoje e Estante); some nas outras telas.
{ const st = document.createElement('style'); st.textContent = `
.gtop #g-msg,.gtop #g-orb{display:none!important}
.av-tabs{display:grid;grid-template-columns:1fr 1fr;gap:.3rem;padding:.25rem;margin:.1rem 0 .9rem;border-radius:14px;background:color-mix(in srgb,var(--line) 55%,var(--bg))}
.av-tabs button{display:flex;align-items:center;justify-content:center;gap:.4rem;height:38px;border:0;border-radius:11px;background:none;color:var(--ink-2);font:inherit;font-size:.86rem;font-weight:900;cursor:pointer}
.av-tabs button.on{background:var(--panel);color:var(--ink);box-shadow:0 1px 4px rgba(0,0,0,.08)}
.av-tabs button i{font-style:normal;min-width:20px;height:20px;padding:0 .35rem;border-radius:99px;background:var(--acc);color:var(--on-acc,#fff);font-size:.7rem;font-weight:900;display:inline-grid;place-items:center}
#editor.ntpage .av-tabs{margin-top:.2rem}
`; TR.append(st); }
const AVS_TAB_K = 'lv.avTab';
const avsLast = () => { try { return localStorage.getItem(AVS_TAB_K) === 'msg' ? 'msg' : 'nt'; } catch { return 'nt'; } };
const avsSetLast = (t) => { try { localStorage.setItem(AVS_TAB_K, t); } catch {} };
const avsNt = () => (S.notifN || 0) + (typeof recNew === 'function' ? (recNew() || 0) : 0);
const avsMsg = () => (S.msg && S.msg.unread) || 0;
const avsCanMsg = () => { try { return connected() && !!socialProfile; } catch { return false; } };
// número do 🔔: tudo que é novo nas duas abas
function avsPaintBell() {
  const bell = $('#g-bell'); if (!bell) return; const n = avsNt() + avsMsg(); let u = bell.querySelector('u');
  if (!n) { u && u.remove(); return; } if (!u) { u = document.createElement('u'); bell.append(u); } const t = n > 9 ? '9+' : String(n); if (u.textContent !== t) u.textContent = t;
}
{ const _pg = paintGtop; paintGtop = function () { const r = _pg.apply(this, arguments); avsPaintBell(); return r; }; }
{ const _pm = paintMsgBadge; paintMsgBadge = function () { const r = _pm.apply(this, arguments); avsPaintBell(); avsTabsSync(); return r; }; }
if (typeof paintRecBadge === 'function') { const _pr = paintRecBadge; paintRecBadge = function () { const r = _pr.apply(this, arguments); avsPaintBell(); return r; }; }
const avsTabsHTML = (cur) => { const n = cur === 'nt' ? 0 : avsNt(), m = avsMsg(), b = (k) => (k ? '<i>' + (k > 9 ? '9+' : k) + '</i>' : '');
  return '<div class="av-tabs" role="tablist" aria-label="Avisos"><button type="button" role="tab" data-av="nt" class="' + (cur === 'nt' ? 'on' : '') + '" aria-selected="' + (cur === 'nt') + '">Notificações' + b(n) + '</button>'
    + '<button type="button" role="tab" data-av="msg" class="' + (cur === 'msg' ? 'on' : '') + '" aria-selected="' + (cur === 'msg') + '">Mensagens' + b(m) + '</button></div>'; };
// coloca (ou atualiza) as abas em cima das Notificações e da lista de conversas
function avsTabsSync() {
  const ed = $('#editor'), v = $('#shelflist');
  if (ed && !ed.hidden && ed.classList.contains('ntpage')) { const body = ed.querySelector('.ed-body');
    if (body) { const html = avsTabsHTML('nt'), old = body.querySelector('.av-tabs');
      if (!old) { const top = body.querySelector('.nt-top'); if (top) top.insertAdjacentHTML('afterend', html); else body.insertAdjacentHTML('afterbegin', html); }
      else if (old.outerHTML !== html) old.outerHTML = html; } }
  if (v && !v.hidden && S.navView && S.navView.t === 'threads') { const html = avsTabsHTML('msg'), old = v.querySelector('.av-tabs');
    if (!old) { const top = v.querySelector('.sl-top'); if (top) { top.insertAdjacentHTML('afterend', html); const b = top.querySelector('b'); if (b) b.textContent = 'Avisos'; } }
    else if (old.outerHTML !== html) old.outerHTML = html; }
}
function avsOpen(tab) {
  if (tab === 'msg' && !avsCanMsg()) tab = 'nt';
  avsSetLast(tab);
  if (tab === 'msg') {
    const ed = $('#editor'); const fromNt = ed && !ed.hidden && ed.classList.contains('ntpage');
    openThreads();
    // trocar de aba não é "ir para outra página": Voltar não deve cair nas Notificações
    if (fromNt) setTimeout(() => { const st = S.nav && S.nav.st; if (st && st.length && st[st.length - 1].nt) st.pop(); }, 0);
  } else {
    const v = $('#shelflist'); if (v && !v.hidden && S.navView && S.navView.t === 'threads') v.hidden = true;
    openNotif(); S.notifN = 0; setTimeout(paintGtop, 50);
  }
  setTimeout(avsTabsSync, 0);
}
// 🔔: abre na aba com novidade (mensagem primeiro), senão na última usada
TR.addEventListener('click', (ev) => {
  const t = ev.target.closest && ev.target.closest('#g-bell'); if (!t) return;
  ev.stopPropagation(); ev.preventDefault();
  const tab = avsMsg() && avsCanMsg() ? 'msg' : avsNt() ? 'nt' : avsLast();
  avsOpen(tab);
}, true);
// abas
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('.av-tabs [data-av]'); if (!b) return;
  ev.stopPropagation(); ev.preventDefault(); if (b.classList.contains('on')) return; avsOpen(b.dataset.av);
}, true);
// abas sempre presentes (as telas se redesenham sozinhas: aceitar pedido, carregar conversas…)
{ let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; avsTabsSync(); avsPaintBell(); }, 60); })
    .observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// ••• do topo: só onde tem opções (Hoje e Estante, sem página nem Avisos por cima)
{ let tm = 0; const sync = () => { const b = TR.querySelector('#g-imore'); if (!b) return; const v = $('#shelflist');
    const ed = $('#editor'); const show = (S.tab === 'inicio' || S.tab === 'estante') && (!v || v.hidden) && (!ed || ed.hidden || !ed.classList.contains('ntpage')); if (b.hidden === show) b.hidden = !show;
    b.style.display = show ? '' : 'none'; };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; sync(); }, 80); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
// Órbita no Hoje: o cartão (ou a linha Órbita + Próxima conquista) fica logo abaixo do card do livro
{ let tm = 0; const move = () => {
    const box = TR.querySelector('#lista'); if (!box || S.tab !== 'inicio') return; const now = box.querySelector('.v3-now'); if (!now) return;
    const c = box.querySelector('#orb-card'); if (!c) return; const unit = c.parentElement && c.parentElement.classList.contains('orb-row') ? c.parentElement : c;
    if (now.nextElementSibling !== unit) now.after(unit); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(move, 140); }).observe(TR, { childList: true, subtree: true }); }

// Acabamento de Avisos (Bia, 19/11):
//  - título "Avisos" nas duas abas. Uma regra antiga força "Notificações" no #g-t (MutationObserver), então em vez de
//    disputar o texto, um título próprio (#g-avt) aparece no lugar do #g-t enquanto Avisos está aberto;
//  - as duas abas na mesma altura: some a linha de cima (Voltar / ícone) das duas telas; "Nova mensagem" vai para
//    a linha de título da lista, embaixo das abas;
//  - a bolinha da aba Comunidade não acende mais só por mensagem (o 🔔 já conta).
{ const st = document.createElement('style'); st.textContent = `
.gtop #g-avt{display:none;flex:1;min-width:0;font-size:1.05rem;font-weight:900;color:var(--ink)}
.gtop.av-on #g-t{display:none!important}.gtop.av-on #g-avt{display:block}
#editor.ntpage .nt-top{display:none!important}
#shelflist.av-msg .sl-body > .sl-top{display:none!important}
#editor.ntpage .av-tabs,#shelflist.av-msg .av-tabs{margin:.2rem 0 .8rem}
.av-lh{display:flex;align-items:center;justify-content:space-between;margin:0 0 .5rem}
.av-lh b{font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2)}
.av-lh #th-new{display:inline-flex!important;align-items:center;gap:.35rem;width:auto!important;height:34px!important;margin:0!important;padding:0 .8rem!important;border:1.5px solid var(--line)!important;border-radius:99px!important;background:var(--panel)!important;color:var(--ink)!important;font:inherit!important;font-size:.8rem!important;font-weight:900!important}
.av-lh #th-new svg{width:15px;height:15px}
`; TR.append(st); }
{ const PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
  let tm = 0;
  const fix = () => {
    const gt = TR.querySelector('#g-t'), top = gt && gt.parentElement, ed = $('#editor'), v = $('#shelflist');
    const nt = !!(ed && !ed.hidden && ed.classList.contains('ntpage')), msg = !!(v && !v.hidden && S.navView && S.navView.t === 'threads');
    if (top) { if (!top.querySelector('#g-avt')) gt.insertAdjacentHTML('afterend', '<b id="g-avt">Avisos</b>'); top.classList.toggle('av-on', nt || msg); }
    if (v) v.classList.toggle('av-msg', msg);
    if (msg) { const body = v.querySelector('.sl-body'), tabs = body && body.querySelector('.av-tabs'), add = body && body.querySelector('#th-new');
      if (tabs && add) { let lh = body.querySelector('.av-lh'); if (!lh) { tabs.insertAdjacentHTML('afterend', '<div class="av-lh"><b>Conversas</b></div>'); lh = body.querySelector('.av-lh'); }
        if (add.parentElement !== lh) lh.append(add); if (!add.dataset.v2) { add.dataset.v2 = '1'; add.innerHTML = PEN + 'Nova mensagem'; add.setAttribute('aria-label', 'Nova mensagem'); add.removeAttribute('title'); } } }
    // bolinha da Comunidade: só por novidade da comunidade, nunca só por mensagem
    const d = TR.querySelector('#tabbar [data-tab="comunidade"] .tb-dot'); if (d) { let on = false; try { on = S.tab !== 'comunidade' && commNews(); } catch {} if (!on) d.remove(); }
  };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; fix(); }, 40); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'class'] }); }
