// Início sem pulos (Bia, 17/11): o cartão "Lendo agora" é montado em etapas (linha do prazo, botões rápidos, dias do prazo)
// e o Início é redesenhado várias vezes nos primeiros segundos (dados da comunidade, amigos, sincronização).
// 1) primeira vez: o Início fica transparente até o cartão estar completo e a tela parar de mudar;
// 2) redesenhos seguintes: uma cópia congelada da tela fica na frente enquanto a nova é montada por trás, e troca quando pronta.
{ const st = document.createElement('style'); st.textContent = `
#lista.v3-wait{opacity:0}
#lista{transition:opacity .16s ease}
#lista.v3-back{position:absolute!important;left:-200vw!important;top:0!important;opacity:0!important;pointer-events:none!important}
`; TR.append(st); }
{ const L = () => TR.querySelector('#lista:not(.lista-snap)');
  const ready = (root) => { const c = root.querySelector('.v3-now:not(.empty)'); if (!c) return true; let e = null; try { const R = reading(); e = R && R.e; } catch {}
    if (!c.querySelector('.v3-quick') || !c.querySelector('.due-ln')) return false;
    if (e && e.dueAt && e.dueAt >= todayISO() && !c.querySelector('.due-cards')) return false;
    // a Pergunta do dia entra depois do resto; sem esperar por ela, a tela nova aparecia sem o cartão e ele surgia em seguida (Bia, 20/11)
    try { if (typeof vFn === 'function' && vFn('qday') && !homePrefs().off.includes('qday') && !root.querySelector('[data-v2qd]')) return false; } catch {}
    if (root.querySelector('[data-v2qd] [data-cvk]')) return false;
    return true; };
  let snap = null, settleT = 0, hardT = 0, last = 0;
  const finish = () => { clearTimeout(settleT); clearTimeout(hardT); const l = L(); if (l) { if (snap) { l.style.transition = 'none'; } l.classList.remove('v3-wait', 'v3-back'); l.style.width = ''; if (snap) { void l.offsetHeight; requestAnimationFrame(() => { l.style.transition = ''; }); } } if (snap) { snap.remove(); snap = null; } };
  const settle = () => { clearTimeout(settleT); settleT = setTimeout(() => { const l = L(); if (!l) return finish(); if (ready(l) && Date.now() - last >= 120) finish(); else settle(); }, 130); };
  const start = (mode) => { const l = L(); if (!l) return; clearTimeout(hardT); hardT = setTimeout(finish, 1600);
    if (mode === 'snap' && !snap && l.childElementCount && !l.classList.contains('v3-wait')) {
      const w = l.getBoundingClientRect().width; snap = l.cloneNode(true); snap.classList.add('lista-snap'); snap.removeAttribute('id'); snap.setAttribute('aria-hidden', 'true'); snap.style.pointerEvents = 'none';
      snap.id = 'lista'; l.after(snap); l.style.width = w + 'px'; l.classList.add('v3-back');
    } else if (mode === 'fade') { l.style.transition = 'none'; l.classList.add('v3-wait'); requestAnimationFrame(() => { l.style.transition = ''; }); }
    settle(); };
  const _dt = drawTab; drawTab = function () {
    const l = L(), home = S.tab === 'inicio';
    // o Hoje novo (v2) não tem .v3-now: sem isto ia pelo "fade", e o layout antigo aparecia meio transparente por um instante (reteste M8)
    // na v2, congelar a tela só quando ela já é a nova: a 1ª cópia era do layout antigo (meta, estante, números) e ficava 1,6 s na frente
    const v2 = typeof v2HojeEnsure === 'function';
    if (home && l && !l.hidden) start(l.querySelector(v2 ? '.v2hero, .v3x, .v8dia' : '.v3-now') ? 'snap' : 'fade');
    return _dt.apply(this, arguments); };
  new MutationObserver((ms) => { if (!(snap || (L() && L().classList.contains('v3-wait')))) return; if (ms.some((m) => !(m.target.closest && m.target.closest('.lista-snap')))) { last = Date.now(); settle(); } }).observe(TR, { childList: true, subtree: true });
  // ao trocar de aba enquanto espera, mostra na hora
  const _gt = goTab; goTab = function (tab) { if (tab !== 'inicio') finish(); return _gt.apply(this, arguments); };
}
