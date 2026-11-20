// Menu lateral reorganizado (Bia, 18/11): Minha leitura (Estatísticas, Órbita, Metas, Conquistas) · Meu acervo (Meus trechos,
// Histórico de leituras, Posts salvos) · Pessoas (Amigos, com pedidos pendentes) · App (Personalizar Início, Instalar o app,
// Ajustes, Sair) · Moderação (Denúncias, só moderação). "Montar histórico" e "Ajustar leituras" viram "Histórico de leituras".
// Estante ganha atalhos para Meus trechos e Histórico de leituras; os números do seu perfil abrem as Estatísticas.
{ const st = document.createElement('style'); st.textContent = `
.drw .drw-it small.drw-bd{background:var(--acc);color:var(--on-acc,#fff);border-radius:99px;padding:.05rem .45rem;font-weight:900;font-size:.68rem}
.es-sc{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:0 0 .9rem}
.es-sc button{display:flex;align-items:center;gap:.5rem;min-width:0;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.55rem .65rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.es-sc img{width:24px;height:24px;flex:none}.es-sc b{display:block;font-size:.84rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.es-sc small{display:block;font-size:.7rem;color:var(--ink-2);font-weight:700}
#shelflist.mine-page .yo-nums{cursor:pointer}
`; TR.append(st); }
function openHistLeituras() {
  sheet('Histórico de leituras', [['Adicionar livros que já li', () => openHistory()], ['Completar datas, páginas e notas', () => openFixReads()]]);
}
function openSavedPosts() { S.comSeg = 'rede'; S.rdF = 'salvos'; goTab('comunidade'); setTimeout(() => { try { paintRede(); } catch {} }, 60); }
{ const ICON = (f) => '<svg viewBox="0 0 24 24" aria-hidden="true"><image href="img/' + f + '.webp" x="0" y="0" width="24" height="24"/></svg>';
  const btn = (go, ic, t, small, bd) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'drw-it'; b.dataset.go2 = go; b.dataset.ic2 = '1';
    b.innerHTML = ICON(ic) + esc(t) + (small ? '<small' + (bd ? ' class="drw-bd"' : '') + '>' + esc(small) + '</small>' : ''); return b; };
  const ACT = { orbita: () => openOrbita(), hl: () => openHistLeituras(), salvos: () => openSavedPosts(), gifts: () => openGifts(), home: () => homePrefsSheet(), inst: () => installApp(), mod: () => openRdMod() };
  const rebuild = (d) => {
    if (d.dataset.v2) return; d.dataset.v2 = '1';
    const old = (k) => d.querySelector('[data-go="' + k + '"]'), out = d.querySelector('.drw-out'), me = d.querySelector('.drw-me');
    const nQ = lib().reduce((a, e) => a + (e.quotes || []).length, 0), nS = ((db.prefs || {}).rdSaved || []).length, nP = ((SOC.fr || {}).incoming || []).length;
    let orb = ''; try { const s = orbStats(); orb = s.cur ? (s.cur === 1 ? '1 dia' : s.cur + ' dias') : ''; } catch {}
    const G = (t) => { const g = document.createElement('div'); g.className = 'drw-g'; g.textContent = t; return g; };
    const parts = [me,
      G('Minha leitura'), old('stats'), btn('orbita', 'orbita', 'Órbita de leitura', orb), old('goals'), old('ach'),
      G('Meu acervo'), old('quotes') || btn('quotes', 'mn_trechos', 'Meus trechos', nQ || ''), btn('hl', 'mn_historico', 'Histórico de leituras'), btn('salvos', 'mn_lista', 'Posts salvos', nS || ''),
      G('Pessoas'), old('friends'), btn('gifts', 'mn_lista', 'Presentes', (db.gifts || []).length ? String((db.gifts || []).length) : ''),
      G('App'), btn('home', 'mn_ajustar', 'Personalizar Início'), (() => { try { return appInstalled() ? null : btn('inst', 'ic_instalar', 'Instalar o app'); } catch { return null; } })(), old('cfg'), out,
      ...((S.rd && S.rd.admin) || (typeof COVM !== 'undefined' && COVM.admin) ? [G('Moderação'), btn('mod', 'ic_privacidade', 'Denúncias')] : []),
    ].filter(Boolean);
    // pedidos de amizade pendentes em destaque
    const fr = old('friends'); if (fr && nP) { fr.querySelector('small')?.remove(); fr.insertAdjacentHTML('beforeend', '<small class="drw-bd">' + nP + (nP > 1 ? ' pedidos' : ' pedido') + '</small>'); }
    d.replaceChildren(...parts);
    // sem números no menu (Bia, 18/11)
    d.querySelectorAll('.drw-it small').forEach((s) => { if (/\d/.test(s.textContent)) s.remove(); });
    d.querySelectorAll('[data-go2]').forEach((b) => b.addEventListener('click', () => { closeDrawer(); const f = ACT[b.dataset.go2]; if (f) f(); else if (b.dataset.go2 === 'quotes') openAllQuotes(); }));
  };
  let tm = 0; new MutationObserver(() => { const d = TR.querySelector('.drw'); if (!d || d.dataset.v2) return; clearTimeout(tm); tm = setTimeout(() => { const d2 = TR.querySelector('.drw'); if (d2) rebuild(d2); }, 50); }).observe(TR, { childList: true, subtree: true }); }
// Estante: atalhos para Meus trechos e Histórico de leituras
{ let tm = 0; const paint = () => {
    if (S.tab !== 'estante') return; const box = TR.querySelector('#lista'); if (!box || box.querySelector('.es-sc') || box.querySelector('.esn-top')) return;
    const nb = [...box.querySelectorAll('button')].find((b) => /Nova estante/.test(b.textContent)); if (!nb) return;
    const row = nb.parentElement, nQ = lib().reduce((a, e) => a + (e.quotes || []).length, 0), fx = (() => { try { const c = fxCount(); return c.ini + c.fim + c.pag; } catch { return 0; } })();
    const w = document.createElement('div'); w.className = 'es-sc';
    w.innerHTML = '<button type="button" data-a="q"><img src="img/mn_trechos.webp" alt=""><span><b>Meus trechos</b><small>' + (nQ ? nQ + (nQ > 1 ? ' frases' : ' frase') : 'guarde frases dos livros') + '</small></span></button>'
      + '<button type="button" data-a="h"><img src="img/mn_historico.webp" alt=""><span><b>Histórico de leituras</b><small>' + (fx ? fx + ' para completar' : 'livros já lidos e datas') + '</small></span></button>';
    w.querySelector('[data-a=q]').addEventListener('click', () => openAllQuotes()); w.querySelector('[data-a=h]').addEventListener('click', () => openHistLeituras());
    row.after(w); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 80); }).observe(TR, { childList: true, subtree: true }); }
// Perfil: tocar nos números abre as Estatísticas
TR.addEventListener('click', (ev) => { const n = ev.target.closest && ev.target.closest('#shelflist.mine-page .yo-nums'); if (!n) return; try { $('#shelflist').hidden = true; goTab('progresso'); } catch {} });
