// Sair de uma tela fecha o que estava aberto nela (Bia, 21/11: saiu dos Livros com a edição da prateleira aberta e, ao voltar,
// continuava aberta). Vale para: trocar de aba, ir para outra tela, voltar (botão ou gesto) e o app ir para segundo plano e voltar.
// Fecha menus, folhas, "Mais", seleção de vários e modos de edição (Estantes, prateleira Arrumar/Decorar, edição de lombada).
// O que já foi confirmado fica (cada livro já solto na prateleira está salvo); o que estava pela metade (livro pego, lombada
// sem "Salvar") é desfeito. Texto digitado numa folha não se perde: vira rascunho e volta quando a mesma folha abrir de novo.
// Só o que já estava aberto ANTES do toque é fechado: uma ação que liga um modo e navega (ex.: "Organizar" no perfil) continua valendo.
{
  const OV = '.sheet, .esn-sheet, .lvpl-modal, .v10dlg, .rt';
  const top = () => [...document.body.children, ...TR.children].filter((n) => n.matches && n.matches(OV));
  const v4st = () => { try { return S.v4 || null; } catch { return null; } };
  const modes = () => { let m = null, ed = null; try { m = SHX_MODE; } catch {} try { ed = SHX_EDT; } catch {} const S5 = (S.v5 || {});
    return { shEd: !!S5.shEd, sel: !!S5.sel, shx: m || null, edt: !!ed, v4sheet: !!(v4st() && v4st().sheet), more: !!(v4st() && v4st().v5more) }; };
  let snap = { at: 0, ov: [], m: modes() };
  const take = () => { snap = { at: Date.now(), ov: top(), m: modes() }; };
  // ----- rascunhos -----
  const DK = 'lv.rascunhos';
  const dGet = () => { try { return JSON.parse(sessionStorage.getItem(DK) || '{}') || {}; } catch { return {}; } };
  const dSet = (o) => { try { sessionStorage.setItem(DK, JSON.stringify(o)); } catch {} };
  const ctxOf = (ta) => { const box = ta.closest('.sheet, .esn-sheet, .lvpl-modal, .box, .sh, .page, section, form') || ta.parentElement;
    const h = box && box.querySelector('h2, h3, h4, header b, .sh-bk h3'); let bk = ''; try { const st = v4st(); if (st && st.sheetE && typeof V4 !== 'undefined' && V4 && V4.contains(ta)) bk = String(st.sheetE); } catch {}
    return [(h && h.textContent || '').trim().slice(0, 60), bk].join('|'); };
  const keyOf = (ta) => ctxOf(ta) + '|' + (ta.id || ta.name || ta.className || '') + '|' + (ta.getAttribute('placeholder') || '').slice(0, 40);
  const saveDrafts = (roots) => { const o = dGet(); let n = 0;
    roots.forEach((r) => r && r.querySelectorAll && r.querySelectorAll('textarea').forEach((ta) => { const v = ta.value || ''; if (!v.trim() || v === ta.defaultValue) return; o[keyOf(ta)] = { v, at: Date.now() }; n++; }));
    if (n) dSet(o); return n; };
  let rtm = 0; const restore = () => { rtm = 0; const o = dGet(), ks = Object.keys(o); if (!ks.length) return; let used = 0;
    const scan = (r) => r.querySelectorAll('textarea').forEach((ta) => { if (ta.value || !ta.getClientRects().length) return; const k = keyOf(ta), d = o[k]; if (!d) return;
      if (Date.now() - d.at > 864e5) { delete o[k]; return; } ta.value = d.v; ta.dispatchEvent(new Event('input', { bubbles: true })); delete o[k]; used++; });
    try { top().forEach(scan); scan(TR); if (typeof V4 !== 'undefined' && V4 && V4.isConnected) scan(V4); } catch {}
    dSet(o); if (used) try { toast('Rascunho recuperado'); } catch {} };
  const arm = () => { if (!rtm) rtm = setTimeout(restore, 120); };
  // folhas que acabaram de sair da tela (o voltar de outro bloco pode fechá-las antes deste): guardadas 1 s para virar rascunho
  let gone = []; const onMut = (L) => { arm(); const t = Date.now(); gone = gone.filter((g) => t - g.t < 1000);
    L.forEach((m) => m.removedNodes.forEach((n) => { if (n.nodeType === 1 && n.matches && n.matches(OV) && n.querySelector('textarea')) gone.push({ n, t }); })); };
  new MutationObserver(onMut).observe(TR, { childList: true }); new MutationObserver(onMut).observe(document.body, { childList: true });
  new MutationObserver(arm).observe(TR, { childList: true, subtree: true });
  // ----- fechar -----
  const closeOv = (el) => { if (!el.isConnected) return; const no = el.matches('.v10dlg') && el.querySelector('.no'); if (no) no.click(); else el.click(); if (el.isConnected) el.remove(); };
  const unlock = () => { [document.body, document.documentElement].forEach((e) => { if (e.style.overflow === 'hidden') e.style.overflow = ''; if (e.style.touchAction === 'none') e.style.touchAction = ''; }); };
  // why: 'aba' | 'tela' | 'voltar' | 'fundo'
  const reset = (why) => {
    const old = Date.now() - snap.at < 1500 ? snap : { ov: top(), m: modes() }, m = old.m, now = modes();
    try { if (typeof lvCloseMenus === 'function') lvCloseMenus(); } catch {}
    // folhas que já estavam abertas (na volta do segundo plano, as que têm texto digitado ficam como estão)
    const ovs = old.ov.filter((x) => x.isConnected); let keep = new Set();
    if (why === 'fundo') ovs.forEach((x) => { if ([...x.querySelectorAll('textarea, input[type=text]')].some((t) => t.value && t.value !== t.defaultValue)) keep.add(x); });
    const st = v4st(), v4sh = m.v4sheet && now.v4sheet && st && st.sheet;
    let v4keep = false; if (v4sh && why === 'fundo' && typeof V4 !== 'undefined' && V4) v4keep = [...V4.querySelectorAll('textarea')].some((t) => t.value && t.value !== t.defaultValue);
    if (why !== 'fundo') saveDrafts([...ovs, ...(v4sh && typeof V4 !== 'undefined' ? [V4] : [])]);
    ovs.forEach((x) => { if (!keep.has(x)) closeOv(x); });
    if (v4sh && !v4keep) { try { st.v5more = false; v5SheetClose(); } catch {} }
    else if (st && m.more && now.more) { st.v5more = false; try { v4Draw(); } catch {} }
    // modos de edição e seleção que já estavam ligados
    let redraw = false; const S5 = S.v5 || {};
    if (m.shEd && now.shEd) { S5.shEd = false; redraw = true; }
    if (m.sel && now.sel) { S5.sel = null; redraw = true; }
    try { if (m.shx && now.shx) { SHX_MODE = null; try { SHX_DKS = null; } catch {} try { shSave(); } catch {} redraw = true; } } catch {}
    try { if (m.edt && now.edt) SHX_EDT = null; } catch {}
    try { if (typeof shExitEdit === 'function') shExitEdit(); } catch {} // livro na mão / arrasto da prateleira (bloco wl_v2_estante_mais)
    if (redraw) { try { v5Save(); } catch {} try { v5Redraw(); } catch {} }
    if (!top().length) unlock();
    snap = { at: 0, ov: [], m: modes() };
  };
  window.lvLeaveReset = reset;
  // o que estava aberto no instante do toque (antes de o toque abrir ou ligar qualquer coisa)
  const onDown = () => take();
  document.addEventListener('pointerdown', onDown, true); TR.addEventListener('pointerdown', onDown, true);
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') take(); }, true);
  // trocar de aba e ir para outra tela
  const wrap = (name, why) => { try { const f = eval(name); if (typeof f !== 'function') return; const w = function () { try { reset(why); } catch (err) { console.warn('sair fecha', err); } return f.apply(this, arguments); }; eval(name + ' = w'); } catch {} };
  wrap('goTab', 'aba');
  ['openBookPage', 'openShelfV3', 'openAnyBook', 'openBuddyPage', 'openProfile', 'openGoalPage', 'friendPage', 'openStatusList', 'openAbandoned'].forEach((n) => wrap(n, 'tela'));
  // voltar: se havia folha aberta, o voltar só fecha a folha (outro bloco cuida); senão é sair da tela
  // (o menu do livro da camada nova não fechava no voltar: fecha só ele, e o "Mais" junto)
  window.addEventListener('popstate', () => { const light = top().length || gone.some((g) => Date.now() - g.t < 300), v4 = !!(v4st() && v4st().sheet); take();
    if (light) { saveDrafts(top()); setTimeout(() => saveDrafts(gone.map((g) => g.n)), 0); return; } // outro bloco fecha a folha de cima; o texto dela vira rascunho
    if (v4) { if (typeof V4 !== 'undefined' && V4) saveDrafts([V4]); setTimeout(() => { const st = v4st(); if (st && st.sheet) { st.v5more = false; try { v5SheetClose(); } catch {} } }, 0); return; }
    setTimeout(() => reset('voltar'), 0); }, true);
  // segundo plano e volta (câmera, galeria e compartilhar não contam: a pessoa está no meio de uma ação)
  let hidAt = 0, extAt = 0;
  document.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : [ev.target]; if (p.some((n) => n && n.matches && n.matches('input[type=file], label[for], [data-share], .share, [data-a=share], [data-a=photo], [data-a=cam]'))) extAt = Date.now(); }, true);
  try { const _sh = navigator.share && navigator.share.bind(navigator); if (_sh) navigator.share = function () { extAt = Date.now(); return _sh.apply(this, arguments); }; } catch {}
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { hidAt = Date.now(); take(); snap.at = Date.now() + 36e5; return; }
    const away = Date.now() - hidAt; if (!hidAt || away < 1500 || Date.now() - extAt < 120e3) { snap.at = 0; return; }
    snap.at = Date.now(); reset('fundo'); });
}
