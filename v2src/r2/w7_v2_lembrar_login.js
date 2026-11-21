// Lembrar meu login (Bia, 21/11): depois de sair, a tela de entrar mostra "Entrar como @handle" com a senha já focada,
// para não preencher tudo de novo. Guarda SÓ o e-mail e o @/nome (nunca a senha) em lv.lastLogin, que a limpeza de sessão
// do w3 preserva (LV_KEEP). Caixa "Lembrar meu login neste aparelho" ligada por padrão no login e no cadastro; desligada
// apaga. Excluir conta sempre apaga. "Não é você? Usar outra conta" limpa e mostra o formulário vazio.
// autocomplete correto para o gerenciador de senhas: username / current-password (entrar) / new-password (criar e trocar).
{ const KEY = 'lv.lastLogin', OFF = 'lv.rememberOff';
  const get = () => { try { const r = JSON.parse(localStorage.getItem(KEY) || 'null'); return r && r.id ? r : null; } catch { return null; } };
  const put = (r) => { try { if (r) localStorage.setItem(KEY, JSON.stringify(r)); else localStorage.removeItem(KEY); } catch {} };
  const off = () => { try { return localStorage.getItem(OFF) === '1'; } catch { return false; } };
  const setOff = (v) => { try { if (v) localStorage.setItem(OFF, '1'); else localStorage.removeItem(OFF); } catch {} };
  try { if (sessionStorage.getItem('lv.excluida')) put(null); } catch {}
  { const st = document.createElement('style'); st.textContent = `
.lv-rem{display:flex!important;align-items:center;gap:.6rem;margin:.55rem 0 .2rem!important;font-size:.88rem;font-weight:800;color:var(--ink);cursor:pointer;min-height:40px}
.lv-rem input{width:22px!important;height:22px!important;min-height:0!important;margin:0!important;flex:none;accent-color:var(--acc)}
.lv-who{display:flex;align-items:center;gap:.75rem;margin:.3rem 0 .6rem;padding:.7rem .8rem;border:1px solid var(--line);border-radius:16px;background:color-mix(in srgb,var(--acc) 8%,var(--panel))}
.lv-who .av{flex:none;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:var(--on-acc,#fff);font-weight:900;font-size:1.15rem}
.lv-who .t{min-width:0;display:grid;line-height:1.25}.lv-who .t small{font-size:.78rem;font-weight:700;color:var(--ink-2)}.lv-who .t b{font-size:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.lv-who .t span{font-size:.85rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lv-notme{display:block;margin:-.2rem 0 .5rem;padding:.4rem 0;min-height:40px;border:0;background:none;color:var(--acc);font:inherit;font-size:.88rem;font-weight:800;text-decoration:underline;cursor:pointer;text-align:left}
`; document.head.append(st); }
  const isReg = (f) => { const n = f.querySelector('input[name=name]'); return !!(n && n.closest('label') && !n.closest('label').classList.contains('hidden')); };
  const paint = (f) => { // mostra/esconde o "Entrar como" conforme o modo (entrar × criar) e o que está lembrado
    const em = f.querySelector('input[name=email]'), pw = f.querySelector('input[name=password]'), hd = f.querySelector('input[name=handle]'); if (!em || !pw) return;
    const reg = isReg(f), r = get(), lb = em.closest('label');
    pw.setAttribute('autocomplete', reg ? 'new-password' : 'current-password'); if (!pw.id) pw.id = 'lv-pw'; if (!em.id) em.id = 'lv-user';
    if (hd) hd.setAttribute('autocomplete', 'nickname');
    let who = f.querySelector('.lv-who'), nm = f.querySelector('.lv-notme');
    if (r && !reg) {
      if (!who) {
        who = document.createElement('div'); who.className = 'lv-who';
        nm = document.createElement('button'); nm.type = 'button'; nm.className = 'lv-notme'; nm.textContent = 'Não é você? Usar outra conta';
        nm.addEventListener('click', () => { put(null); who.remove(); nm.remove(); if (lb) lb.hidden = false; em.value = ''; try { em.focus(); } catch {} });
        (lb || em).before(who); who.after(nm);
      }
      const nome = String(r.name || '').trim(), quem = r.handle ? '@' + r.handle : r.id;
      who.innerHTML = `<span class="av" aria-hidden="true">${esc(((nome || r.handle || r.id || '?')[0] || '?').toUpperCase())}</span><span class="t"><small>Entrar como</small><b>${esc(nome || quem)}</b>${nome ? `<span>${esc(quem)}</span>` : ''}</span>`;
      if (lb) lb.hidden = true; em.value = r.id;
      if (!f.dataset.lvremFocus) { f.dataset.lvremFocus = '1'; setTimeout(() => { try { pw.focus(); } catch {} }, 60); }
    } else {
      if (who) who.remove(); if (nm) nm.remove(); if (lb) lb.hidden = false;
      if (reg && r && em.value === r.id) em.value = '';
    }
  };
  const prep = (f) => {
    if (!f || f.dataset.lvrem) return; const pw = f.querySelector('input[name=password]'); if (!pw) return; f.dataset.lvrem = '1';
    const ck = document.createElement('label'); ck.className = 'lv-rem'; ck.innerHTML = '<input type="checkbox" name="lv-remember" id="lv-remember"> Lembrar meu login neste aparelho';
    ck.querySelector('input').checked = !off();
    let anchor = pw.closest('label') || pw;
    for (let i = 0; i < 3; i++) { const nx = anchor.nextElementSibling; if (nx && (nx.classList.contains('lv-str') || nx.classList.contains('lv-ferr'))) anchor = nx; else break; }
    anchor.after(ck);
    paint(f);
    f.addEventListener('click', (ev) => { if (ev.target.closest && ev.target.closest('button') && !ev.target.closest('.lv-notme')) setTimeout(() => paint(f), 0); });
  };
  const scan = () => { const g = document.getElementById('auth-gate'); if (g) prep(g.querySelector('form')); document.querySelectorAll('body > .sheet form').forEach((f) => prep(f)); };
  scan(); new MutationObserver(scan).observe(document.body, { childList: true });
  // com a conta aberta, mantém nome e @ atualizados (para o "Entrar como" mostrar a pessoa certa)
  const refresh = () => {
    let n = 0;
    const tick = () => {
      n++; const r = get(); if (!r || off()) return;
      try {
        if (typeof connected === 'function' && connected() && String(apiCfg.email || '').toLowerCase() === String(r.id).toLowerCase()) {
          const h = socialProfile && socialProfile.handle, nm = String((socialProfile && socialProfile.displayName) || (db.profile && db.profile.name) || '').trim().split(/\s+/)[0];
          if ((h && h !== r.handle) || (nm && nm !== r.name)) put({ ...r, handle: h || r.handle, name: nm || r.name });
          if (h) return;
        }
      } catch {}
      if (n < 20) setTimeout(tick, 1500);
    };
    tick();
  };
  // ao enviar (depois da validação do w3, que para o evento se houver erro): guarda a intenção e espera o login dar certo
  document.addEventListener('submit', (ev) => {
    const f = ev.target; if (!f || !f.querySelector || !f.dataset || !f.dataset.lvrem) return;
    const ck = f.querySelector('#lv-remember'), keep = !ck || ck.checked, reg = isReg(f);
    const nmIn = f.querySelector('input[name=name]'), hdIn = f.querySelector('input[name=handle]'), em = f.querySelector('input[name=email]');
    const typed = String((em && em.value) || '').trim(), prev = get();
    setOff(!keep); if (!keep) { put(null); return; }
    const t0 = Date.now();
    const wait = () => {
      if (Date.now() - t0 > 120000) return;
      if (!(typeof connected === 'function' && connected())) { setTimeout(wait, 400); return; }
      const id = String((apiCfg && apiCfg.email) || typed).toLowerCase();
      const same = prev && prev.id && String(prev.id).toLowerCase() === id;
      put({ id, name: reg ? String((nmIn && nmIn.value) || '').trim().split(/\s+/)[0] : same ? prev.name || '' : '', handle: reg ? String((hdIn && hdIn.value) || '').trim() : same ? prev.handle || '' : '', at: Date.now() });
      refresh();
    };
    setTimeout(wait, 400);
  }, true);
  // conta já aberta antes deste recurso existir: passa a lembrar (se a caixa não foi desligada)
  setTimeout(() => {
    try {
      if (!off() && typeof connected === 'function' && connected() && apiCfg.email) {
        const r = get(); if (!r || String(r.id).toLowerCase() !== String(apiCfg.email).toLowerCase()) put({ id: String(apiCfg.email).toLowerCase(), name: '', handle: '', at: Date.now() });
        refresh();
      }
    } catch {}
  }, 2500);
}
