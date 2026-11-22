// Onde comprar (Bia, 21/11): um lugar só, a seção "Onde comprar" no fim da aba Sobre da página do livro. Cada loja abre a
// busca dela numa aba nova (ISBN quando houver, senão título + autor); sem afiliado nem rastreio. Preço só do e-book no
// Google Play, quando o Google Livros devolve em reais ("consultado agora"); sem preço, a linha fica sem número.
// Os outros lugares (menu do livro › Mais, Desejos, presentes, segurar a capa) chamam whereToBuy, que só abre a página do
// livro já rolada até a seção. Presentes: reservar o livro de uma amizade (segredo para a dona) e lembrete de entregar.
{ const st = document.createElement('style'); st.textContent = `
.oc-sec{margin:1rem 0 .4rem;scroll-margin-top:72px}.oc-sec h3{font-size:1rem;margin:0 0 .3rem}
.oc-l{display:grid;gap:0}
.oc-it{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:.6rem;align-items:center;width:100%;border:0;border-bottom:1px solid var(--line);background:none;padding:.6rem .1rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.oc-it > i,.oc-go > i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;border:1.5px solid var(--line);color:var(--ink)}
.oc-it svg,.oc-go svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.oc-it b{display:block;font-size:.92rem}.oc-it small{display:block;font-size:.74rem;color:var(--ink-2)}
.oc-it > em{font-style:normal;color:var(--ink-2);font-weight:900;font-size:.8rem;text-align:right}.oc-it > em.oc-pr{color:var(--ink)}.oc-it > em.oc-pr small{font-weight:700}
.oc-note{font-size:.72rem;color:var(--ink-2);margin:.6rem 0 0;line-height:1.4}
.oc-go{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:.6rem;align-items:center;width:100%;border:1px solid var(--line);border-radius:14px;background:var(--bg);padding:.55rem .7rem;margin-top:.6rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.oc-go b{display:block;font-size:.9rem}.oc-go small{display:block;font-size:.74rem;color:var(--ink-2)}.oc-go em{font-style:normal;color:var(--ink-2)}
.gf-ck{display:flex;gap:.6rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.6rem .7rem;background:var(--bg);margin-top:.45rem;cursor:pointer}
.gf-ck input[type=checkbox]{width:20px;height:20px;accent-color:var(--acc);flex:none}.gf-ck b{display:block;font-size:.86rem}.gf-ck small{display:block;font-size:.74rem;color:var(--ink-2)}
.gf-ck input[type=date]{margin-left:auto;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:.82rem;padding:.25rem .35rem}
.gf-it{display:grid;grid-template-columns:48px minmax(0,1fr);gap:.7rem;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.6rem .7rem;margin-bottom:.6rem}
.gf-it .cv{width:48px!important;height:72px!important;border-radius:3px 6px 6px 3px!important;font-size:.42rem!important}
.gf-it b{display:block;font-size:.92rem}.gf-it small{display:block;font-size:.76rem;color:var(--ink-2)}.gf-it .st{font-weight:900;color:#2e9b5a}.gf-it .late{font-weight:900;color:#b33}
.gf-ac{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.45rem}.gf-ac button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.3rem .7rem;font:inherit;font-size:.76rem;font-weight:800;cursor:pointer}.gf-ac button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
`; TR.append(st); }
const OC_IC = {
  fis: '<svg viewBox="0 0 24 24"><path d="M5.5 8h13l-1.2 12H6.7z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
  eb: '<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M10.5 17.5h3"/></svg>',
  us: '<svg viewBox="0 0 24 24"><path d="M3.5 6H9a3 3 0 0 1 3 3v11a2.5 2.5 0 0 0-2.5-2.5h-6z"/><path d="M20.5 6H15a3 3 0 0 0-3 3v11a2.5 2.5 0 0 1 2.5-2.5h6z"/></svg>',
};
const ocE = encodeURIComponent;
// [chave, nome, ícone, tipo, url(busca)]: busca = ISBN quando houver, senão título + autor
const OC_STORES = [
  ['amazon', 'Amazon', 'fis', 'físico', (s) => 'https://www.amazon.com.br/s?k=' + ocE(s) + '&i=stripbooks'],
  ['magalu', 'Magalu', 'fis', 'físico', (s) => 'https://www.magazineluiza.com.br/busca/' + ocE(s) + '/'],
  ['ml', 'Mercado Livre', 'fis', 'físico', (s) => 'https://lista.mercadolivre.com.br/' + ocE(s.replace(/\s+/g, '-'))],
  ['ev', 'Estante Virtual', 'us', 'usados', (s) => 'https://www.estantevirtual.com.br/busca?q=' + ocE(s)],
  ['kobo', 'Kobo', 'eb', 'e-book', (s) => 'https://www.kobo.com/br/pt/search?query=' + ocE(s)],
  ['gplay', 'Google Play Livros', 'eb', 'e-book', (s) => 'https://play.google.com/store/search?q=' + ocE(s) + '&c=books'],
  ['kindle', 'Amazon Kindle', 'eb', 'e-book', (s) => 'https://www.amazon.com.br/s?k=' + ocE(s) + '&i=digital-text'],
];
const ocQuery = (b) => [b.title, String(b.author || '').split(',')[0]].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
const ocIsbn = (b) => { const c = [b.isbn, b.meta && b.meta.isbn].map((x) => String(x || '').replace(/[^0-9Xx]/g, '').toUpperCase()); return c.find((x) => x.length === 13) || c.find((x) => x.length === 10) || ''; };
const ocKey = (b) => ocIsbn(b) || normT(b.title || '');
const ocUrl = (key, b) => { const st = OC_STORES.find((y) => y[0] === key); return st ? st[4](ocIsbn(b) || ocQuery(b)) : ''; };
const wbOpen = (u) => { try { window.open(u, '_blank', 'noopener'); } catch { location.href = u; } };
// preço do e-book no Google Play (Google Livros, em reais); null = sem preço
const ocPrice = {}; let ocPaint = () => {};
async function ocFetchPrice(b) {
  const k = ocKey(b); if (!k || k in ocPrice) return; ocPrice[k] = 'p'; const isbn = ocIsbn(b); let r = null;
  const q = isbn ? 'isbn:' + isbn : 'intitle:' + b.title + (b.author ? ' inauthor:' + String(b.author).split(',')[0] : '');
  try { const d = await getJSON('https://www.googleapis.com/books/v1/volumes?country=BR&filter=ebooks&maxResults=3&q=' + ocE(q), 7000);
    for (const it of (d && d.items) || []) { const s = it.saleInfo || {}, vi = it.volumeInfo || {}; if (!isbn && normT(vi.title || '') !== normT(b.title)) continue;
      const p = s.retailPrice || s.listPrice; if (s.saleability === 'FOR_SALE' && p && p.currencyCode === 'BRL' && p.amount > 0) { r = p.amount; break; } } } catch {}
  ocPrice[k] = r; ocPaint(); }
const ocHTML = (b) => { const pr = ocPrice[ocKey(b)];
  return '<section class="oc-sec" id="oc-sec"><h3>Onde comprar</h3><div class="oc-l">' + OC_STORES.map(([k, n, ic, tp]) => '<button type="button" class="oc-it" data-st="' + k + '"><i>' + OC_IC[ic] + '</i><span><b>' + n + '</b><small>' + tp + '</small></span>'
    + (k === 'gplay' && typeof pr === 'number' ? '<em class="oc-pr">R$ ' + pr.toFixed(2).replace('.', ',') + '<small>consultado agora</small></em>' : '<em>↗</em>') + '</button>').join('')
    + '</div><p class="oc-note">Os preços podem mudar na loja.</p></section>'; };
// página do livro › Sobre: a seção fica sempre no fim
{ let tm = 0, cur = null; const v = $('#shelflist');
  const _ob = openBookPage; openBookPage = function (e) { cur = e; return _ob.apply(this, arguments); };
  const put = () => { tm = 0; if (!v || v.hidden || v.dataset.bt !== 'sobre' || !cur || !cur.title) return; const body = v.querySelector('.sl-body'); if (!body || !body.querySelector(':scope > .bp-sec')) return;
    const t = ((v.querySelector('.bp-ht h2') || {}).textContent || '').trim(); if (t && normT(t) !== normT(cur.title)) return;
    const b = cur, k = ocKey(b), pk = String(ocPrice[k]); let s = body.querySelector(':scope > .oc-sec');
    if (s && s.dataset.k === k && s.dataset.p === pk) { if (body.lastElementChild !== s) body.append(s); }
    else { s && s.remove(); const w = document.createElement('div'); w.innerHTML = ocHTML(b); s = w.firstElementChild; s.dataset.k = k; s.dataset.p = pk; body.append(s);
      s.querySelectorAll('[data-st]').forEach((x) => x.addEventListener('click', () => wbOpen(ocUrl(x.dataset.st, b)))); }
    if (!(k in ocPrice)) ocFetchPrice(b);
    // conteúdo que chega depois (sinopse, Mais do autor) empurra a seção: segue rolando até ~1,6 s, a menos que a pessoa mexa
    if (S.ocScroll && Date.now() - S.ocScroll < 4000) { S.ocScroll = 0; const go = () => { const x = v.querySelector('#oc-sec'); if (x && !v.hidden && v.dataset.bt === 'sobre') x.scrollIntoView({ block: 'start' }); };
      let stop = false; const quit = () => { stop = true; }; ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach((ev) => v.addEventListener(ev, quit, { once: true, passive: true }));
      go(); [250, 600, 1000, 1600].forEach((ms) => setTimeout(() => { if (!stop) go(); }, ms)); } };
  ocPaint = () => { if (!tm) tm = setTimeout(put, 30); };
  if (v) new MutationObserver(ocPaint).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-bt', 'hidden'] }); }
// atalho: abre a página do livro (da biblioteca ou do catálogo) já rolada até "Onde comprar"
function whereToBuy(b) {
  if (!b || !b.title) return; TR.querySelectorAll('.esn-sheet').forEach((x) => x.remove());
  let mine = null; try { mine = (b.id && lib().find((e) => e.id === b.id)) || lib().find((e) => normT(e.title) === normT(b.title)); } catch {}
  S.ocScroll = Date.now(); if (mine) openBookPage(mine, 'sobre'); else openAnyBook(b.title, b.author || null, b.cover || null);
}
// presentes que você vai dar (guardados no aparelho e sincronizados com a sua conta)
const gfList = () => (db.gifts = db.gifts || []);
const gfFind = (h, title) => gfList().find((g) => g.h === h && normT(g.title) === normT(title));
async function gfClaim(h, title) { try { const x = await sapi('POST', '/v1/users/' + encodeURIComponent(h) + '/gifts', { title }); return x && x.status < 300; } catch { return false; } }
async function gfUnclaim(h, title) { try { const x = await sapi('DELETE', '/v1/users/' + encodeURIComponent(h) + '/gifts?title=' + encodeURIComponent(title)); return x && x.status < 300; } catch { return false; } }
// folha do presente: a partir do "Quero ter" da amizade
function giftSheet(d, b, onDone) {
  TR.querySelector('.esn-sheet.gf-sh')?.remove();
  const h = d.handle, first = String(d.displayName || '@' + h).split(' ')[0], cur = gfFind(h, b.title);
  const sh = document.createElement('div'); sh.className = 'esn-sheet gf-sh';
  const close = () => { sh.remove(); onDone && onDone(); };
  const reserve = async () => { if (gfFind(h, b.title)) return true; const ok = await gfClaim(h, b.title); if (!ok) { toast('Não consegui reservar agora'); return false; }
    const due = (sh.querySelector('.gf-due') || {}).value || ''; gfList().push({ h, name: d.displayName || h, title: b.title, author: b.author || null, cover: b.cover || null, at: todayISO(), ...(due ? { due } : {}) }); save(); return true; };
  sh.innerHTML = '<div class="box"><div class="ex-hd">' + cvh(b.title, b.cover, '') + '<div><b>' + esc(b.title) + '</b><small>' + (cur ? 'Você vai dar para ' + esc(first) : 'Presente para ' + esc(first)) + '</small></div></div>'
    + (cur ? '' : '<label class="gf-ck"><input type="checkbox" class="gf-res" checked><span><b>Reservar “vou dar de presente”</b><small>as outras amizades veem que já tem presente; ' + esc(first) + ' não vê nada</small></span></label>'
      + '<label class="gf-ck"><span style="font-size:1.1rem"><i class=v3e data-i=cal></i></span><span><b>Me lembrar de entregar</b><small>opcional: aniversário, encontro…</small></span><input type="date" class="gf-due" min="' + todayISO() + '"></label>')
    + '<button type="button" class="oc-go" data-go="1"><i>' + OC_IC.fis + '</i><span><b>Onde comprar</b><small>lojas na página do livro</small></span><em>›</em></button>'
    + '<div class="acts">' + (cur ? '<button type="button" data-a="giveup">Desistir do presente</button><button type="button" class="p" data-a="x">Fechar</button>' : '<button type="button" data-a="x">Agora não</button><button type="button" class="p" data-a="res">Só reservar</button>') + '</div></div>';
  try { paintCv(sh); } catch {}
  // ir para Onde comprar já reserva (se a caixa estiver marcada) e abre a página do livro na seção
  sh.querySelector('[data-go]').addEventListener('click', async () => { const c = sh.querySelector('.gf-res'); if (c && c.checked) { if (!(await reserve())) return; toast('Reservado: você vai dar “' + b.title + '” para ' + first); }
    close(); whereToBuy(b); });
  sh.querySelector('[data-a=res]')?.addEventListener('click', async () => { if (await reserve()) { toast('Reservado: você vai dar “' + b.title + '” para ' + first); close(); } });
  sh.querySelector('[data-a=giveup]')?.addEventListener('click', async () => { if (await gfUnclaim(h, b.title)) { db.gifts = gfList().filter((g) => !(g.h === h && normT(g.title) === normT(b.title))); save(); toast('Presente liberado para outra amizade'); close(); } else toast('Não consegui agora'); });
  sh.querySelector('[data-a=x]').addEventListener('click', close);
  sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); }); TR.append(sh);
}
// página "Presentes" (menu lateral)
function openGifts() {
  const v = $('#shelflist'); closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page');
  const draw = () => {
    const L = gfList().slice().sort((a, b) => String(a.due || '9999').localeCompare(String(b.due || '9999')));
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Presentes</b><span></span></div>'
      + (L.length ? L.map((g, i) => { const late = g.due && g.due < todayISO() && !g.given; return '<div class="gf-it">' + cvh(g.title, g.cover, '') + '<div><b>' + esc(g.title) + '</b><small>para ' + esc(String(g.name || '@' + g.h).split(' ')[0]) + ' · reservado em ' + exD(g.at) + '</small>'
          + '<small>' + (g.bought ? '<span class="st">✓ comprado</span>' : 'ainda não comprado') + (g.due ? ' · ' + (late ? '<span class="late">entrega era ' + exD(g.due) + '</span>' : 'entregar até ' + exD(g.due)) : '') + '</small>'
          + '<div class="gf-ac">' + (g.bought ? '' : '<button type="button" class="p" data-i="' + i + '" data-a="buy">Onde comprar</button><button type="button" data-i="' + i + '" data-a="got">Já comprei</button>') + '<button type="button" data-i="' + i + '" data-a="done">Entreguei</button><button type="button" data-i="' + i + '" data-a="quit">Desistir</button></div></div></div>'; }).join('')
        : '<p class="sl-empty">Nenhum presente reservado. No perfil de uma amizade, em “Desejos”, toque em “Vou dar” para escolher um livro.</p>');
    try { paintCv(v); } catch {}
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    v.querySelectorAll('[data-a]').forEach((b) => b.addEventListener('click', async () => { const g = L[+b.dataset.i]; if (!g) return; const a = b.dataset.a;
      if (a === 'buy') return whereToBuy(g);
      if (a === 'got') { g.bought = true; save(); toast('Anotado: já comprado'); return draw(); }
      if (a === 'done') { db.gifts = gfList().filter((x) => x !== g); save(); toast('Presente entregue'); return draw(); }
      if (a === 'quit') { if (await gfUnclaim(g.h, g.title)) { db.gifts = gfList().filter((x) => x !== g); save(); toast('Presente liberado para outra amizade'); draw(); } else toast('Não consegui agora'); } }));
  };
  S.listRedraw = draw; draw(); v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {}
}
// Início: lembrete de entregar presente (3 dias antes, no dia ou atrasado)
{ let tm = 0; const put = () => {
    if (S.tab !== 'inicio') return; const box = TR.querySelector('#lista:not(.lista-snap)'); if (!box || box.querySelector('.gf-alert')) return; const anchor = box.querySelector('.ex-alert') || box.querySelector('.v3-now'); if (!anchor) return;
    const soon = (d) => d && Math.round((Date.parse(d) - Date.parse(todayISO())) / 864e5) <= 3;
    const it = gfList().filter((g) => soon(g.due)); if (!it.length) return;
    const w = document.createElement('div'); w.className = 'ex-alert gf-alert';
    w.innerHTML = it.slice(0, 2).map((g, k) => { const late = exLate(g.due); return '<button type="button" data-k="' + k + '" class="' + (late ? 'late' : '') + '"><i><i class=v3e data-i=gift></i></i><span><b>Entregar “' + esc(g.title) + '” para ' + esc(String(g.name || g.h).split(' ')[0]) + '</b><small>' + (late ? 'era para ' + exD(g.due) : g.due === todayISO() ? 'hoje' : 'até ' + exD(g.due)) + (g.bought ? ' · já comprado' : ' · ainda não comprado') + '</small></span></button>'; }).join('');
    w.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', openGifts));
    anchor.after(w); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 140); }).observe(TR, { childList: true, subtree: true }); }
