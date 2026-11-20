// Correções do perfil (Bia, 20/11, prints do celular):
// 1. Aba Estantes do SEU perfil mostrava sobras do perfil antigo ("Conquistas · 4 de 39", "Leituras 2026"). Agora tem só as suas
//    estantes, como no protótipo: "+ Nova estante" primeiro, "Organizar" e um cartão por estante (capas, contagem, cadeado se
//    for só sua). No perfil de outra pessoa, sem estantes publicadas, aparece só "Nenhuma estante no perfil" (sem sobras).
// 2. Conquistas saíram da v2: o bloco antigo some de qualquer lugar onde ainda apareça.
// 3. Comunidade: avaliação sua de livro abandonado/pausado sem status vindo da API usa o status da sua estante.
{ const st = document.createElement('style'); st.textContent = `
.yo-ach,.lx-card:has(#v3-achs),.cantinho.mini,section:has(> .v3-sh #yo-achs){display:none!important}
.v4mysh-bar{display:flex;gap:.5rem;align-items:center;margin:.2rem 0 .7rem}
.v4mysh-bar button{display:inline-flex;align-items:center;gap:.35rem;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .85rem;font:inherit;font-size:.82rem;font-weight:800;cursor:pointer}
.v4mysh-bar button.p{border-color:var(--acc);color:var(--acc)}
.v4psh .pshelf .lk{font-size:11px;color:var(--ink-2);margin-left:.35rem}
`; TR.append(st); }
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments);
    try { const body = v.querySelector('.sl-body'), pE = body && body.querySelector(':scope > .v3pane[data-k=est]'); if (!pE || !d) return r;
      if (!d.self) { if (!pE.querySelector(':scope > .v4psh')) { const h = '<p class="v2wempty">Nenhuma estante no perfil.</p>'; if (pE.innerHTML !== h) pE.innerHTML = h; } return r; }
      const L = v5Shelves().filter((s) => !s.arch);
      const sig = JSON.stringify(L.map((s) => [s.id, s.name, s.priv, (s.bookIds || []).slice(0, 7), (s.bookIds || []).length]));
      if (pE.dataset.mysig === sig && pE.querySelector(':scope > .v4mysh-bar')) return r;
      pE.dataset.mysig = sig;
      const card = (s) => { const B = v5ShBooks(s), lid = B.filter((e) => e.status === 'LIDO').length;
        return '<button type="button" class="pshelf" data-sh="' + esc(String(s.id)) + '"><div class="hd"><b>' + esc(s.name) + (s.priv ? '<span class="lk">só você</span>' : '') + '</b><small>' + plural(B.length, 'livro', 'livros') + (lid ? ' · ' + plural(lid, 'lido', 'lidos') : '') + '</small></div><div class="covers">'
          + B.slice(0, 7).map((e) => '<span class="scv">' + cvh(e.title, e.cover, '') + '</span>').join('') + '</div></button>'; };
      pE.innerHTML = '<div class="v4mysh-bar"><button type="button" class="p" data-a="new"><i class=v3e data-i=plus></i>Nova estante</button>' + (L.length > 1 ? '<button type="button" data-a="org"><i class=v3e data-i=sort></i>Organizar</button>' : '') + '</div>'
        + (L.length ? '<div class="v4psh">' + L.map(card).join('') + '</div>' : '<p class="v2wempty">Crie estantes para organizar seus livros do seu jeito (ex.: Clássicos, Para reler).</p>');
      try { paintCv(pE); } catch {}
      pE.querySelector('[data-a=new]')?.addEventListener('click', () => { try { shelfEditForm(); } catch { try { newEstante(); } catch {} } });
      pE.querySelector('[data-a=org]')?.addEventListener('click', () => { const S5 = v5S(); S5.tab = 'estantes'; S5.shEd = true; v.hidden = true; goTab('estante'); });
      pE.querySelectorAll('[data-sh]').forEach((b) => b.addEventListener('click', () => { try { openShelfV3('sh:' + b.dataset.sh); } catch {} }));
    } catch (err) { console.warn('perfil estantes', err); }
    return r; }; }
// Comunidade: sua avaliação sem bookStatus da API usa o status da sua estante (abandonado/pausado não vira "Avaliou")
{ const _a = v6Act; v6Act = function (it) {
    try { if (it && it.type === 'review' && !it.bookStatus) { const me = socialProfile && socialProfile.handle, who = it.user && (it.user.handle || it.user);
        if (it.mine || (me && who && String(who).toLowerCase() === String(me).toLowerCase())) { const e = lib().find((x) => normT(x.title) === normT((it.book && it.book.title) || it.title || '')); if (e && (e.status === 'ABANDONEI' || e.status === 'HIBERNANDO')) it = { ...it, bookStatus: e.status }; } } } catch {}
    return _a.call(this, it); }; }
// Metas (Bia, 20/11): "+ Nova meta com prazo" como primeiro item da lista (um bloco antigo levava o botão .fl-add para o topo
// da página e o pintava de lupa "Encontrar leitores"); o texto explicativo vira dica curta.
{ const st = document.createElement('style'); st.textContent = '#shelflist .mt-new{display:flex;align-items:center;justify-content:center;gap:.35rem;width:100%;min-height:46px;border:1.5px dashed var(--acc);border-radius:16px;background:none;color:var(--acc);font:inherit;font-weight:900;font-size:.9rem;margin:.2rem 0 .6rem;cursor:pointer}#shelflist .mt-hint{font-size:.78rem;color:var(--ink-2);line-height:1.45;margin:.1rem .2rem .8rem}'; TR.append(st); }
// Listas por situação (Lidos, Abandonados, Pausados...) abertas pelo perfil: o voltar antigo mostrava "‹ undefined" e a página
// ficava marcada como perfil (sem o Voltar do topo). Agora é página interna como as outras e volta para o perfil.
{ const fix = () => { const v = TR.querySelector('#shelflist'); if (!v || v.hidden) return; const bk = v.querySelector('.sl-body > .sl-top > .sl-back');
    if (bk && /undefined|null/.test(bk.textContent)) { bk.textContent = '‹ Voltar'; if (v.classList.contains('mine-page') && v.querySelector('.sl-body > .sl-list, .sl-body > .sl-note')) { v.classList.remove('mine-page', 'tabroot'); S.v4fromMe = true; } } };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; fix(); }, 40); }).observe(TR, { childList: true, subtree: true }); }
