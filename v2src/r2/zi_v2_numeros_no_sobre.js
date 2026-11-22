// ---------- v2: números do perfil dentro da aba Sobre (Bia, 22/11) ----------
//  A faixa "lidos · abandonos · páginas · mais longo" saía entre os botões e as abas e empurrava as abas para baixo:
//  a prateleira mal aparecia. Agora ela mora no início da aba Sobre (seu perfil) ou da aba Top 3 (perfil de outra
//  pessoa e "Vendo como as amizades veem", que não têm Sobre). Os toques continuam os mesmos: os listeners do v3Wire
//  ficam no próprio elemento, que só muda de lugar. O espaço vazio acima do avatar também diminui.
{
  const css = document.createElement('style');
  css.textContent = `
.v3pane > .v3num{margin:.2rem 0 1rem}
.v3pf{padding-top:0;margin-top:-1.6rem}
.v3pf .v3pb{margin-bottom:0}
.sl-body > .v3tabs{margin-top:.4rem}
.v3pf .v3pf-top{display:none}
`;
  TR.appendChild(css);
  const _vb = v3Build;
  v3Build = function (v, d) {
    const r = _vb.apply(this, arguments);
    try {
      const body = v && v.querySelector('.sl-body'); if (!body) return r;
      const hd = body.querySelector(':scope > .v3pf'); if (!hd) return r;
      const self = !!(d && d.self), ro = self && !!S.v3prev;
      const dest = body.querySelector(':scope > .v3pane[data-k=' + (self && !ro ? 'sobre' : 'top') + ']');
      const fresh = hd.querySelector(':scope > .v3num');
      if (dest && fresh) {
        body.querySelectorAll('.v3pane > .v3num').forEach((n) => n !== fresh && n.remove());
        dest.prepend(fresh);
      } else if (dest) {
        // cabeçalho não foi refeito: garante que o número continua no topo do painel certo (troca de prévia)
        const all = [...body.querySelectorAll('.v3pane > .v3num')], cur = all.find((n) => n.parentElement === dest) || all[0];
        all.forEach((n) => n !== cur && n.remove());
        if (cur && (cur.parentElement !== dest || dest.firstElementChild !== cur)) dest.prepend(cur);
      }
    } catch (err) { console.warn('números no Sobre', err); }
    return r;
  };
}

// ---------- aba Estantes só com a prateleira; Leituras por mês vai para Sobre (Bia, 22/11) ----------
//  A prateleira já tem os chips de estante (Todas · cada estante) e "Ver estante inteira". As fileiras-carrossel das
//  estantes do perfil (blocos antigos 26/79: cabeçalho .v3-sh + .es-row) repetiam os chips: ficam escondidas quando a
//  prateleira existe (CSS, sem remover — os blocos antigos as recriam e remover causaria redesenho em laço). O cartão
//  "Leituras por mês" (section.ys) vai para logo depois dos números (Sobre no seu perfil; Top 3 para visitante/prévia).
//  A escolha de estantes do perfil continua valendo: é ela que define os chips de visitante e da prévia (v6ProfOrder).
{
  const css = document.createElement('style');
  css.textContent = `.v3pane[data-k=est]:has(> .shxwrap) > :not(.v4mysh-bar):not(.shxwrap){display:none!important}
.v3pane > section.ys{margin:0 0 1rem}`;
  TR.appendChild(css);
  // o cartão pode ser montado depois do v3Build (mountYearShelf assíncrono): leva para o lugar certo sempre que montar
  const moveYs = (body) => { try {
    if (!body || !body.querySelector(':scope > .v3pf')) return;
    const k = body.dataset.ysDest; if (!k) return; const dest = body.querySelector(':scope > .v3pane[data-k=' + k + ']'); if (!dest) return;
    const ys = [...body.querySelectorAll('section.ys')].find((x) => x.parentElement !== dest) || null; if (!ys) return;
    const n = dest.querySelector(':scope > .v3num'); n ? n.after(ys) : dest.prepend(ys);
  } catch (err) { console.warn('Leituras por mês no Sobre', err); } };
  if (typeof mountYearShelf === 'function') { const _m = mountYearShelf; mountYearShelf = function (root) { const r = _m.apply(this, arguments); try { moveYs(root && (root.closest ? root.closest('.sl-body') : null) || (root && root.querySelector && root.querySelector('.sl-body'))); } catch {} return r; }; }
  const _vb = v3Build;
  v3Build = function (v, d) {
    const r = _vb.apply(this, arguments);
    try {
      const body = v && v.querySelector('.sl-body'); if (!body) return r;
      const self = !!(d && d.self), ro = self && !!S.v3prev; body.dataset.ysDest = self && !ro ? 'sobre' : 'top'; setTimeout(() => moveYs(body), 400);
      const dest = body.querySelector(':scope > .v3pane[data-k=' + (self && !ro ? 'sobre' : 'top') + ']'); if (!dest) return r;
      const ys = body.querySelector(':scope > .v3pane[data-k=est] > section.ys') || body.querySelector(':scope > section.ys') || [...body.querySelectorAll('.v3pane > section.ys')].find((x) => x.parentElement !== dest);
      if (ys) { const n = dest.querySelector(':scope > .v3num'); const want = n ? n.nextElementSibling : dest.firstElementChild; if (want !== ys) (n ? n.after(ys) : dest.prepend(ys)); }
    } catch (err) { console.warn('Leituras por mês no Sobre', err); }
    return r;
  };
}

// ---------- Desejos: configuração discreta para a dona; "Dar este livro" para a amizade (Bia, 22/11) ----------
//  Própria: o cartão grande "Lista de desejos (Amazon) · Compre por aqui…" (texto para quem visita) vira uma linha de
//  configuração que abre "Complete seu perfil" (onde link e cidade já são editados); a dica vira uma linha curta.
//  Amizade: sem cartão no topo; tocar num livro abre "Dar este livro" (lista da loja, Onde comprar, Vou dar, Ver o livro).
//  Privacidade igual: link e cidade só chegam para amizades (a API não manda para quem não é).
{
  const css = document.createElement('style');
  css.textContent = `.v2wcfg{display:flex;align-items:center;gap:.7rem;width:100%;min-height:48px;margin:0 0 .3rem;padding:.5rem .2rem;border:0;border-bottom:1px solid var(--line);background:none;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.v2wcfg span{flex:1;min-width:0}.v2wcfg b{display:block;font-size:.9rem;font-weight:800}.v2wcfg small{display:block;font-size:.76rem;color:var(--ink-2)}.v2wcfg em{font-style:normal;color:var(--ink-2)}
.v2wnote{margin:.2rem .2rem .9rem;font-size:.8rem;color:var(--ink-2)}`;
  TR.appendChild(css);
  const _lk = v2WishLinkHTML;
  v2WishLinkHTML = function (d, own) {
    if (!own) return ''; // amizade: o link vai para a folha "Dar este livro"
    const q = (db.prefs || {}).perfil || {}; const url = /^https:\/\//i.test(String(q.desejos || '').trim()) ? String(q.desejos).trim() : '';
    let host = 'da loja'; try { if (/amazon\./i.test(new URL(url).hostname)) host = 'da Amazon'; } catch {}
    return '<button type="button" class="v2wcfg" data-a="wcfg"><span><b>' + (url ? 'Lista ' + host + ' · conectada' : 'Adicionar link da sua lista da Amazon') + '</b><small>Só amizades veem o link e a cidade.</small></span><em>›</em></button>'
      + '<p class="v2wnote">Amizades podem marcar “Vou dar” sem você saber quem.</p>';
  };
  const wishUrl = (d) => { const e = d.extra || (S.v3ext || {})[d.handle] || null; const u = e && e.wishlistUrl; return u && /^https:\/\//i.test(u) ? u : ''; };
  const _wp = v2WishPaint;
  v2WishPaint = async function (v, d, host) {
    const r = await _wp.apply(this, arguments);
    try {
      host = host || v.querySelector('.v3pane[data-k=des]') || v.querySelector('.sl-body');
      const p = host && host.querySelector('.v2wish'); if (!p) return r;
      if (d.self) {
        p.querySelector('.v2tip [data-tip=tipWm]')?.closest('.v2tip')?.remove(); // a linha curta já explica
        p.querySelector('[data-a=wcfg]')?.addEventListener('click', () => { try { ppPerfil(); } catch { try { openTaste(); } catch {} } });
        return r;
      }
      if (d._prev || !d.isFriend) return r; // prévia e quem não é amizade: como antes (Onde comprar / só leitura)
      const L = (d.shelf && d.shelf.wish) || [], who = gfFirst(d.displayName || '@' + d.handle), url = wishUrl(d);
      let host2 = 'da loja'; try { if (/amazon\./i.test(new URL(url).hostname)) host2 = 'da Amazon'; } catch {}
      p.querySelectorAll('.cvb[data-i]').forEach((bt) => {
        const nb = bt.cloneNode(true); bt.replaceWith(nb); // troca o "abrir o livro" direto pela folha
        nb.setAttribute('aria-label', 'Dar este livro: ' + ((L[+nb.dataset.i] || {}).title || ''));
        nb.addEventListener('click', () => { const i = +nb.dataset.i, b = L[i]; if (!b) return;
          const g = p.querySelector('[data-g="' + i + '"]'), taken = !g && p.querySelector('.v2wi:nth-child(' + (i + 1) + ') .taken');
          const it = [];
          if (url) it.push(['Comprar pela lista ' + host2 + ' de ' + who + ' · a loja entrega no endereço de ' + who, () => { try { window.open(url, '_blank', 'noopener'); } catch {} }]);
          it.push(['Onde comprar', () => { try { whereToBuy({ title: b.title, author: b.author, cover: b.cover }); } catch {} }]);
          if (g) it.push([g.classList.contains('on') ? 'Você vai dar · mudar' : 'Marcar “Vou dar”', () => g.click()]);
          else if (taken) it.push(['Alguém já vai dar este livro', () => {}]);
          it.push(['Ver o livro', () => { try { openAnyBook(b.title, b.author, b.cover); } catch {} }]);
          sheet('Dar “' + b.title + '”', it); }); });
    } catch (err) { console.warn('Desejos: dar este livro', err); }
    return r;
  };
}
