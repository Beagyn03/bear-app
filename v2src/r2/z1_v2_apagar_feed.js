// Apagar do feed (Bia, 21/11): no ••• dos PRÓPRIOS cards de atividade (começou, progresso, terminou) e de conquista,
// "Apagar do feed" → folha do app → o card some na hora, com Desfazer; o DELETE só vai à API depois de 5 s
// (API: DELETE /v1/activities/:id e /v1/achievement-posts/:id; a conquista apagada não volta ao ser postada de novo).
// O livro e o status não mudam. Cards de outras pessoas continuam com Ocultar, Silenciar e Ver o livro.
{ const isFeedCard = (it) => !!it && (it.type === 'activity' || it.type === 'achievement');
  const mineCard = (it) => isFeedCard(it) && (it.mine || (it.user && typeof v6Me === 'function' && it.user.handle === v6Me()));
  const ZF = { pend: new Map() };
  const drop = (it) => { const gone = []; const rm = (arr) => (arr || []).filter((x) => { const hit = x.type === it.type && x.id === it.id; if (hit) gone.push(x); return !hit; });
    try { ['amigos', 'rede'].forEach((sc) => { const F = v6Feed(sc); F.items = rm(F.items); }); } catch {}
    try { if (S.rd) S.rd.items = rm(S.rd.items); } catch {}
    return gone; };
  const repaint = () => { try { v6Paint(); } catch {} try { if (typeof paintRede === 'function' && TR.querySelector('#rede-host, .rd-fl')) paintRede(); } catch {} };
  const restore = (it, snap) => { try { ['amigos', 'rede'].forEach((sc) => { const F = v6Feed(sc); if (snap[sc]) F.items = snap[sc]; }); } catch {} try { if (S.rd && snap.rd) S.rd.items = snap.rd; } catch {} repaint(); };
  const apagar = (it) => {
    const snap = {}; try { ['amigos', 'rede'].forEach((sc) => { snap[sc] = v6Feed(sc).items.slice(); }); } catch {} try { if (S.rd) snap.rd = (S.rd.items || []).slice(); } catch {}
    drop(it); repaint();
    const key = it.type + it.id;
    const t = setTimeout(async () => { ZF.pend.delete(key);
      const url = it.type === 'activity' ? '/v1/activities/' + encodeURIComponent(it.id) : '/v1/achievement-posts/' + encodeURIComponent(it.id);
      let ok = false; try { const r = await sapi('DELETE', url); ok = r.status < 300 || r.status === 404; } catch {}
      if (!ok) { restore(it, snap); toast('Não consegui apagar agora'); } }, 5000);
    ZF.pend.set(key, t);
    toast(it.type === 'achievement' ? 'Conquista apagada do feed' : 'Card apagado do feed', { label: 'Desfazer', fn: () => { clearTimeout(ZF.pend.get(key)); ZF.pend.delete(key); restore(it, snap); } });
  };
  // folhas: v6my e v6del ganham versão própria para atividade/conquista
  const _sh = v4SheetHTML;
  v4SheetHTML = function (k) {
    const it = (v4State().v6 || {}).it;
    if ((k === 'v6my' || k === 'v6del') && mineCard(it)) {
      const ach = it.type === 'achievement';
      if (k === 'v6my') return `<h3>${ach ? 'Sua conquista' : 'Sua atividade'}</h3><div class="list">`
        + (it.book ? `<button class="li" data-a="zfvl">${v4ic('ler', 20)}<span class="t">Ver o livro</span><span class="r">${v4ic('chev', 16)}</span></button>` : '')
        + `<button class="li dng" data-a="sheet" data-s="v6del">${v4ic('trash', 20)}<span class="t">Apagar do feed<small>${ach ? 'a conquista continua sua' : 'o livro e o status não mudam'}</small></span></button></div>`;
      return `<h3>Apagar do feed?</h3><p class="mut" style="margin:0 0 12px">${ach ? 'O card sai do feed e da sua Atividade. A conquista continua sua.' : 'O card sai do feed e da sua Atividade. O livro e o status não mudam.'}</p>
        <div class="row" style="gap:8px"><button class="btn s" style="flex:1" data-a="sheet" data-s="v6my">Voltar</button><button class="btn p" style="flex:1;background:#c0392b;color:#fff" data-a="zfdelok">Apagar</button></div>`;
    }
    return _sh.apply(this, arguments);
  };
  // a camada V4 fica num shadow root próprio: procura o botão no caminho do evento (capture no document, antes de tudo)
  document.addEventListener('click', (ev) => {
    const b = (ev.composedPath ? ev.composedPath() : []).find((x) => x && x.dataset && (x.dataset.a === 'zfdelok' || x.dataset.a === 'zfvl')); if (!b) return;
    ev.stopPropagation(); ev.preventDefault();
    const it = (v4State().v6 || {}).it; if (!mineCard(it)) return;
    try { v6SheetClose(); } catch {}
    if (b.dataset.a === 'zfvl') { try { openAnyBook(it.book.title, it.book.author, it.book.cover); } catch {} return; }
    apagar(it);
  }, true);
  // caminho antigo (rdMenu: feed da Rede, página do livro): o próprio card abre a mesma folha
  if (typeof rdMenu === 'function') { const _rm = rdMenu; rdMenu = function (it, after, anchor) { if (mineCard(it) && typeof v6Sheet === 'function') return v6Sheet('v6my', { it }); return _rm.apply(this, arguments); }; }
  window.zfApagarFeed = apagar; window.zfAbrir = (it) => { try { v6Sheet('v6my', { it }); } catch (e) { console.warn('zf', e); } }; }
