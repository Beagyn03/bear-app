// Página do livro como no protótipo (Bia, 20/11):
//  - Minha leitura: "Meu exemplar" vira linha de lista (não mais dois cartões lado a lado); "Onde comprar" sai daqui e fica
//    no menu "•••" do livro (h0, v5buy).
//  - Aberta do perfil (classe mine-page) a página não ganha o respiro de 2,9rem do perfil.
//  - Comunidade do livro: no seu post/avaliação o "•••" abre a mesma folha do feed (Editar, Quem vê, spoiler, Excluir);
//    no post dos outros some o "Ver o livro" (você já está nele). Depois de editar/excluir, a lista do livro recarrega.
if (typeof V4ICON !== 'undefined' && !V4ICON.cart) V4ICON.cart = '<path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H6.6"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>';
{ const st = document.createElement('style'); st.textContent = `
#shelflist .sl-body > .bp-buy{display:none!important}
#shelflist.v5bp-minha .sl-body > .bp-ex{grid-column:1/-1!important;display:flex!important;align-items:center!important;gap:.75rem!important;width:100%!important;min-height:58px!important;margin:0 0 .85rem!important;padding:.55rem .9rem!important;border-radius:16px!important;border:1px solid var(--line)!important;background:var(--panel)!important;box-shadow:none!important;text-align:left}
#shelflist.v5bp-minha .sl-body > .bp-ex > i{width:auto!important;height:auto!important;background:none!important;border-radius:0!important;color:var(--ink-2)}
#shelflist.v5bp-minha .sl-body > .bp-ex > span{flex:1;min-width:0}
#shelflist.v5bp-minha .sl-body > .bp-ex b{font-size:.92rem!important}
#shelflist.v5bp-minha .sl-body > .bp-ex small{font-size:.74rem!important;-webkit-line-clamp:1!important}
#shelflist.v5bp-minha .sl-body > .bp-ex > em{display:block!important;font-style:normal;font-size:1.2rem;color:var(--ink-2)}
#shelflist.mine-page .sl-body:has(> .bp-hero){padding-top:.75rem!important}
#shelflist.v5bp:not(.v5bp-minha) .sl-body > .bp-ex{display:none!important}
`; TR.append(st); }
{ const _rm = rdMenu;
  rdMenu = function (it, after, anchor) {
    const inBook = !!(anchor && anchor.closest && anchor.closest('.bp-rede'));
    if (!inBook || !it || it.type === 'activity' || it.type === 'achievement') return _rm.apply(this, arguments);
    const le = it.book ? lib().find((x) => normT(x.title) === normT(it.book.title)) : null;
    if (it.mine && it.local) { // avaliação só sua, ainda não publicada: só editar
      if (le && typeof popMenu === 'function') return popMenu(anchor, [{ label: 'Editar avaliação', fn: () => { try { v4FimOpen(le); } catch { rateForm(le, { logs: [] }, () => {}); } } }]);
      return;
    }
    if (it.mine && (it.type === 'post' || it.type === 'review')) {
      if (it.type === 'review' && !it.libId && le) it.libId = le.id;
      S.v7bkRefresh = 1; return v6Sheet('v6my', { it });
    }
    return _rm.call(this, { ...it, book: null }, after, anchor); // sem "Ver o livro" dentro do próprio livro
  };
  const _close = v6SheetClose;
  v6SheetClose = function () {
    const r = _close.apply(this, arguments);
    if (S.v7bkRefresh) { S.v7bkRefresh = 0; S.bkRede = {}; const sec = TR.querySelector('#shelflist .bp-rede'); if (sec) sec.remove(); }
    return r;
  };
}
