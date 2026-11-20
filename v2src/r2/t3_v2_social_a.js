// Teste das ações sociais (Bia, 20/11), parte A: posts, curtidas, salvos, trechos, ecos e mensagens.
// - Confirmação do app (folha/menu) no lugar da janela do navegador para apagar resposta, eco e mensagem.
// - Post publicado aparece no feed na hora (o feed é recarregado logo depois de publicar).
// - Trecho publicado pelo Novo post também vai para Estante › Trechos e "Meus trechos" do livro.
// - Post ou avaliação excluídos saem dos Salvos; a Conversa aberta do post excluído fecha.
// - Eco: aviso ao salvar.
// - Conversa: o "•••" do seu post abre o mesmo menu do feed (Editar, Quem vê, Spoiler, Excluir).
// - Mensagens: tocar na sua mensagem oferece "Apagar mensagem" (some para as duas pessoas).
// - Página do livro: "Meus ecos" só em Minha leitura.
function v9Ask(anchor, label, fn) { try { popMenu(anchor, [{ label, fn }]); } catch { fn(); } }
{ const st = document.createElement('style'); st.textContent = `#shelflist:not(.v5bp-minha) .sl-body > .v9ecos{display:none!important}
.bub.me[data-mid]{cursor:pointer}
.bub small{font-size:.66rem!important;opacity:.92!important;font-weight:700}`; TR.append(st); }
// os balões não trazem o id da mensagem: as suas mensagens na tela seguem a ordem das suas na conversa guardada
{ let tm = 0;
  const marca = () => { tm = 0; const v = $('#shelflist'); if (!v || v.hidden) return; const box = v.querySelector('.cht'); if (!box) return;
    const h = (v.querySelector('.cht-who') || {}).dataset ? v.querySelector('.cht-who').dataset.h : ''; if (!h) return;
    let items = []; try { items = ((chatCache()[h] || {}).items || []).filter((m) => m.mine && m.id); } catch {} const bs = [...box.querySelectorAll('.bub.me')];
    if (!items.length || bs.length !== items.length) return;
    bs.forEach((b, i) => { if (b.dataset.mid !== items[i].id) { b.dataset.mid = items[i].id; b.dataset.mh = h; } }); };
  const v = $('#shelflist'); if (v) new MutationObserver(() => { if (!tm) tm = setTimeout(marca, 60); }).observe(v, { childList: true, subtree: true }); }
{ const _s = sapi;
  const purgeSaved = (pred) => { try { const L = rdSavedList(), K = L.filter((x) => !pred(x)); if (K.length !== L.length) rdSetPref('rdSaved', K); } catch {} };
  sapi = async function (method, path, body) {
    const r = await _s.apply(this, arguments); const M = String(method || '').toUpperCase(), P = String(path || '');
    try {
      if (M === 'POST' && P === '/v1/posts' && r && r.status === 201) {
        // trecho publicado vira trecho seu também (sem duplicar)
        if (body && body.kind === 'quote' && body.quote && body.book) { const e = lib().find((x) => normT(x.title) === normT(body.book.title));
          if (e && !(e.quotes || []).some((q) => q.t === body.quote)) { e.quotes = [...(e.quotes || []), { t: String(body.quote).slice(0, 600), p: body.page || null, at: new Date().toISOString() }].slice(-200); save(); } }
        // o feed mostra o post novo na hora
        try { ['amigos', 'rede'].forEach((sc) => { const F = v6Feed(sc); F.at = 0; }); setTimeout(() => { try { v6Load('amigos'); v6Load('rede'); } catch {} }, 150); } catch {}
      }
      const del = M === 'DELETE' && r && r.status < 300 && P.match(/^\/v1\/(posts|reviews)\/([^/?]+)$/);
      if (del) { const id = decodeURIComponent(del[2]);
        purgeSaved((x) => (del[1] === 'posts' ? x.k === 'post' + id : (x.it && (String(x.it.libId) === id || String(x.it.id) === id) && x.it.type === 'review')));
        const thr = S.v9thr; if (thr && (String(thr.id) === id || String(thr.libId) === id)) { const v = $('#shelflist'); if (v && v.querySelector('.rd-form')) { S.v9thr = null; v.hidden = true; } } }
      if (M === 'POST' && P === '/v1/echoes' && r && r.status < 300) toast('Eco deixado' + (body && body.page ? ' na pág. ' + body.page : ''));
    } catch (err) { console.warn('ações sociais', err); }
    return r;
  }; }
// Conversa: guarda o post aberto para o menu e para fechar se ele for excluído
{ const _o = openRdThread; openRdThread = function (it) { S.v9thr = it || null; return _o.apply(this, arguments); }; }
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('#shelflist .rd-card .rd-more'); if (!b) return;
  const v = $('#shelflist'), it = S.v9thr; if (!v || !v.querySelector('.rd-form') || !it || !b.closest('.rd-card') || b.closest('.rd-rep')) return;
  const me = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || '';
  if (!(it.mine || (it.user && it.user.handle && it.user.handle === me))) return;
  ev.preventDefault(); ev.stopPropagation(); try { v6Sheet('v6my', { it }); } catch (err) { console.warn('menu da conversa', err); }
}, true);
// Mensagens: apagar a sua
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('.bub.me[data-mid]'); if (!b || (ev.target.closest && ev.target.closest('button'))) return;
  const id = b.dataset.mid, h = b.dataset.mh;
  v9Ask(b, 'Apagar mensagem', async () => { try { const r = await sapi('DELETE', '/v1/messages/' + encodeURIComponent(id));
    if (r && r.status === 200) { b.remove(); try { const c = chatCache(); if (c[h] && c[h].items) { c[h].items = c[h].items.filter((m) => m.id !== id); chatCacheSet(h, c[h]); } } catch {} toast('Mensagem apagada'); }
    else toast('Não consegui apagar agora'); } catch { toast('Não consegui apagar agora'); } });
});
