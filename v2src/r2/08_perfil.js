// Perfil (rodada 2):
// - "•••" no topo do próprio perfil com Editar perfil e "O que aparece no meu perfil"; sai o botão Ajustes (configuração mora no menu lateral)
// - "Lendo agora" resumido embaixo do @ e da frase; a seção grande sai do próprio perfil
// - números: lidos, quero ler, amigos (toca e abre Amigos), conquistas
// - selo escolhido aparece ao lado do nome; sem o vão entre o topo e a foto
// - "Prateleira do coração" vira "Melhores avaliados" (4,5 e 5 patas, leituras mais recentes)
{ const st = document.createElement('style'); st.textContent = `
#shelflist .sl-body{min-width:0;max-width:100%;overflow-x:hidden}#shelflist .sl-body > *{min-width:0;max-width:100%}
.yo-top{min-width:0}.yo-top .yo-id{flex:1 1 auto;min-width:0}.yo-id > b,.yo-id > small,.yo-bio{overflow:hidden;text-overflow:ellipsis}
.yo-now{width:100%}.yo-now b{flex:0 1 auto;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mine-page.tabroot .sl-top{display:none!important}
.mine-page .yo-top{margin-top:.2rem}
.yo-top .me-more{margin-left:auto;align-self:flex-start;width:40px;height:36px;border:1px solid var(--line);border-radius:99px;background:var(--panel);color:var(--ink);font:inherit;font-weight:900;letter-spacing:.05em;flex:none}
.yo-now{display:flex;align-items:center;gap:.35rem;margin-top:.3rem;border:0;background:none;padding:0;font:inherit;font-size:.78rem;color:var(--ink-2);text-align:left;cursor:pointer;max-width:100%}
.mine-page .yo-id{flex:1;min-width:0}.yo-now span{flex:none}
.yo-now b{font-size:.8rem!important;line-height:1.2!important;display:block;color:var(--ink);font-weight:800;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.yo-now em{font-style:normal;font-weight:800;color:var(--acc);flex:none}
.yo-now svg{width:14px;height:14px;flex:none;color:var(--acc)}
.yo-id .yo-badge{width:22px;height:22px;object-fit:contain;vertical-align:-4px;margin-left:.3rem}
.mb-bk{flex:none;display:flex;flex-direction:column;align-items:center;gap:.2rem}.mb-bk small{font-size:.74rem;font-weight:800;color:var(--ink-2)}
.yo-nums button[data-go]{cursor:pointer}.yo-nums button[data-go]:not([disabled]){color:inherit}
`; TR.append(st); }
{
  const myLocal = () => { const L = lib(); const c = {}; for (const e of L) c[e.status] = (c[e.status] || 0) + 1; return c; };
  const badgeImg = (handle) => { const f = SOC.flairs && SOC.flairs[handle], a = f && f.badge ? ACHIEVEMENTS.find((x) => x.id === f.badge) : null; return a && DECO_IMG[a.reward] ? `<img class="yo-badge" src="${DECO_IMG[a.reward]}" alt="" title="${esc(a.name)}">` : ''; };
  // selo ao lado do nome em qualquer perfil (próprio ou de amigo)
  const _fp = friendPage;
  friendPage = async function (h) {
    const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h) return r;
    const nm = v.querySelector('.yo-id > b'); if (nm && !nm.querySelector('.yo-badge')) nm.insertAdjacentHTML('beforeend', badgeImg(h));
    [...v.querySelectorAll('.v3-sh b')].forEach((b) => { if (b.textContent.trim() === 'Prateleira do coração') b.textContent = 'Melhores avaliados'; });
    // nota embaixo de cada capa dos Melhores avaliados (do resumo publicado; no próprio perfil, do aparelho)
    const mh = [...v.querySelectorAll('.v3-sh')].find((x) => /Melhores avaliados/.test(x.textContent)), row = mh && mh.nextElementSibling;
    if (row && !row.dataset.paws) { row.dataset.paws = 1; const list = (d.shelf && d.shelf.potinho) || [];
      [...row.querySelectorAll('.es-bk')].forEach((b, i) => { let p = (list[i] || {}).p; if (!p && d.self) { const e = lib().find((x) => normT(x.title) === normT(b.dataset.book || '')); p = e ? (reviewOfLib(e) || {}).paws : 0; }
        const w = document.createElement('div'); w.className = 'mb-bk'; b.replaceWith(w); w.append(b); if (p) w.insertAdjacentHTML('beforeend', '<small>' + pawTxt(p) + '</small>'); }); }
    return r;
  };
  const _om = openMyProfile;
  openMyProfile = async function () {
    const r = await _om.apply(this, arguments); const v = $('#shelflist'); if (v.hidden || !v.classList.contains('mine-page')) return r;
    v.querySelector('.me-acts')?.remove();
    const top = v.querySelector('.yo-top');
    if (top && !top.querySelector('.me-more')) {
      const sp = top.querySelector(':scope > span:last-child:not(.av)'); const btn = '<button type="button" class="me-more" id="me-more" aria-label="Opções do perfil">•••</button>';
      if (sp && !sp.textContent.trim()) sp.outerHTML = btn; else top.insertAdjacentHTML('beforeend', btn);
      $('#me-more', v).addEventListener('click', (ev) => popMenu(ev.currentTarget, [
        { label: 'Editar perfil', sub: 'foto, nome, frase, moldura e selo', fn: () => { v.hidden = true; S.ajMode = 'perfil'; goTab('perfil'); } },
        { label: 'Organizar meu perfil', sub: 'o que aparece: leituras, estantes, conquistas e avaliações', fn: () => socialSettingsSheet('perfil') },
        { label: 'Moldura e selo', fn: () => flairSheet() },
      ]));
    }
    // lendo agora, resumido (dados do aparelho: sempre atual)
    const id = v.querySelector('.yo-id'), lendo = lib().filter((e) => e.status === 'LENDO');
    if (id && lendo.length && !id.querySelector('.yo-now')) {
      const e = lendo[0], pct = readingInfo(e).pct || 0;
      id.insertAdjacentHTML('beforeend', `<button type="button" class="yo-now" id="yo-now"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 21H20"/></svg><span>Lendo</span><b>${esc(e.title)}</b><em>${pct}%</em>${lendo.length > 1 ? `<span>+${lendo.length - 1}</span>` : ''}</button>`);
      $('#yo-now', v).addEventListener('click', () => openBook(e.id));
    }
    const sh = [...v.querySelectorAll('.v3-sh')].find((x) => /^Lendo agora/.test(x.textContent.trim()));
    if (sh) { let n = sh.nextElementSibling; while (n && (n.classList.contains('fr-read') || n.classList.contains('v3-empty'))) { const nx = n.nextElementSibling; n.remove(); n = nx; } sh.remove(); }
    // números
    const nums = v.querySelector('.yo-nums'), c = myLocal(), won = ((S.fpData && S.fpData.achievements && S.fpData.achievements.won) || []).length, nf = ((SOC.fr && SOC.fr.friends) || []).length;
    const cell = (n, t, go) => `<button type="button" ${go ? `data-go="${go}"` : 'disabled'}><b>${n}</b><small>${t}</small></button>`;
    if (nums) {
      nums.innerHTML = cell(c.LIDO || 0, (c.LIDO || 0) === 1 ? 'lido' : 'lidos', 'lidos') + cell(c.QUERO || 0, 'quero ler', 'fila') + cell(nf, nf === 1 ? 'amigo' : 'amigos', 'amigos') + cell(won, won === 1 ? 'conquista' : 'conquistas', 'conq');
      const mark = () => { const N = S.nav; if (N && !N.st.length) N.st.push({ fn: () => goTab('eu'), tab: 'eu' }); };
      const go = { lidos: () => { v.hidden = true; goTab('estante'); setTimeout(() => { openShelfV3('LIDO'); mark(); }, 150); }, fila: () => { v.hidden = true; goTab('estante'); setTimeout(() => { openShelfV3('QUERO'); mark(); }, 150); }, amigos: () => { openFriendsV3(); mark(); }, conq: () => { openAchList(); mark(); } };
      $$('[data-go]', nums).forEach((b) => b.addEventListener('click', () => go[b.dataset.go]()));
    }
    return r;
  };
  // salvar moldura e selo volta para o perfil
  TR.addEventListener('click', (ev) => {
    if (!(ev.target.closest && ev.target.closest('#fl-save'))) return; const ed = $('#editor');
    const wait = (n) => { if (!ed.hidden) return n > 0 && setTimeout(() => wait(n - 1), 200); if (connected() && socialProfile) goTab('eu'); }; setTimeout(() => wait(25), 300);
  }, true);
}
// Lidos / Quero ler / Amigos / Conquistas abertos pelo perfil: Voltar volta para o perfil
// (antes escondia a lista e caía no que estava por baixo: a aba Estante ou o Editar perfil)
TR.addEventListener('click', (ev) => {
  if (ev.target.closest && ev.target.closest('#tabbar')) { S.meBack = null; return; }
  const b = ev.target.closest && ev.target.closest('#shelflist .sl-back'); if (!b || !S.meBack) return;
  const t = b.closest('.sl-top')?.querySelector('b'), ok = t && t.textContent.trim() === S.meBack; if (!ok) return;
  S.meBack = null; ev.stopImmediatePropagation(); ev.preventDefault(); $('#shelflist').hidden = true; goTab('eu');
}, true);
