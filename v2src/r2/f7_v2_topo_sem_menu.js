// Topo como no protótipo (Bia, 20/11): só a marca, a lupa e o sino. Saem o menu lateral (☰) e o "•••" do Início/Estante.
// O que só existia neles mudou de lugar:
//  - Personalizar Início, Sair da conta → Ajustes (voltaram; ver a9);
//  - Trechos e anotações → aba "Trechos" na Estante (como no protótipo);
//  - Histórico de leituras, Buscar capas que faltam, Denúncias (moderação) → Ajustes › "Seus livros" / "Moderação";
//  - Estatísticas, Resumo, Órbita, Metas, Presentes → Você › Minha leitura; Amigos → "N amizades" no perfil;
//    Posts salvos → Comunidade › Salvos; Instalar o app → Ajustes (e o aviso de instalar).
{ const st = document.createElement('style'); st.textContent = `
#g-av,#g-imore,.g-imore{display:none!important}
.gtop .g-brand,.gtop #g-t{margin-left:0!important}
`; TR.append(st); }
// Estante: aba Trechos (abre Meus trechos)
{ let tm = 0; const add = () => { const tabs = TR.querySelector('#lista .esn-tabs'); if (!tabs || tabs.querySelector('[data-tq]')) return; if (!v2Mods().trechos) return;
    const b = document.createElement('button'); b.type = 'button'; b.dataset.tq = '1'; b.textContent = 'Trechos'; b.addEventListener('click', (ev) => { ev.stopPropagation(); openAllQuotes(); }); tabs.append(b); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; add(); }, 40); }).observe(TR, { childList: true, subtree: true }); }
// Ajustes: Seus livros e Moderação
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try { if (S.ajMode === 'perfil' || box.querySelector('#aj-hl')) return r;
    const row = (id, t, sm) => '<button type="button" class="aj-row" id="' + id + '"><span><b>' + t + '</b>' + (sm ? '<small>' + sm + '</small>' : '') + '</span>›</button>';
    const adm = (S.rd && S.rd.admin) || (typeof COVM !== 'undefined' && COVM.admin);
    const html = '<div class="aj-g">Seus livros</div><div class="aj-card">' + row('aj-hl', 'Histórico de leituras', 'trazer livros já lidos; completar datas, páginas e notas') + row('aj-tq', 'Trechos e anotações', 'tudo o que você guardou dos livros') + row('aj-cv', 'Buscar capas que faltam', '') + '</div>'
      + (adm ? '<div class="aj-g">Moderação</div><div class="aj-card">' + row('aj-mod', 'Denúncias', 'perfis, posts e avaliações') + '</div>' : '');
    const first = box.querySelector('.aj-g'); if (first) first.insertAdjacentHTML('beforebegin', html); else box.insertAdjacentHTML('beforeend', html);
    const on = (id, fn) => box.querySelector('#' + id)?.addEventListener('click', fn);
    on('aj-hl', () => openHistLeituras()); on('aj-tq', () => openAllQuotes()); on('aj-cv', () => fillMissingCovers(true)); on('aj-mod', () => openRdMod());
    if (!v2Mods().trechos) box.querySelector('#aj-tq')?.remove();
  } catch (err) { console.warn('ajustes v2', err); }
  return r; }; }
