// Onde comprar e Presentes (Bia, 19/11): lista de lojas com o livro já buscado (e "Comparar preços" no Google Shopping);
// presentear um livro do "Quero ter" de uma amizade: confirma a reserva (segredo para a dona), lembrete para entregar e a loja;
// "Presentes" no menu lateral reúne o que você vai dar (já comprei, entregue, desistir). Preço dentro do app fica para quando
// houver a chave do serviço de preços.
{ const st = document.createElement('style'); st.textContent = `
.wb-l{display:grid;gap:0;margin-top:.3rem}
.wb-it{display:grid;grid-template-columns:34px minmax(0,1fr) auto;gap:.6rem;align-items:center;width:100%;border:0;border-bottom:1px solid var(--line);background:none;padding:.6rem .1rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer}
.wb-it i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-style:normal;font-weight:900;font-size:.8rem;color:#fff}
.wb-it b{display:block;font-size:.92rem}.wb-it small{display:block;font-size:.74rem;color:var(--ink-2)}.wb-it em{font-style:normal;color:var(--acc);font-weight:900;font-size:.8rem}
.wb-cmp{display:flex;align-items:center;gap:.6rem;width:100%;border:2px solid #2e9b5a;background:color-mix(in srgb,#2e9b5a 8%,var(--panel));border-radius:14px;padding:.7rem .8rem;font:inherit;color:var(--ink);text-align:left;cursor:pointer;margin:.2rem 0 .3rem}
.wb-cmp b{display:block;font-size:.92rem}.wb-cmp small{display:block;font-size:.74rem;color:var(--ink-2)}.wb-cmp span:last-child{margin-left:auto;color:#2e9b5a;font-weight:900}
.wb-note{font-size:.72rem;color:var(--ink-2);margin:.6rem 0 0;line-height:1.4}
.gf-ck{display:flex;gap:.6rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.6rem .7rem;background:var(--bg);margin-top:.45rem;cursor:pointer}
.gf-ck input[type=checkbox]{width:20px;height:20px;accent-color:var(--acc);flex:none}.gf-ck b{display:block;font-size:.86rem}.gf-ck small{display:block;font-size:.74rem;color:var(--ink-2)}
.gf-ck input[type=date]{margin-left:auto;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--ink);font:inherit;font-size:.82rem;padding:.25rem .35rem}
.gf-it{display:grid;grid-template-columns:48px minmax(0,1fr);gap:.7rem;border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.6rem .7rem;margin-bottom:.6rem}
.gf-it .cv{width:48px!important;height:72px!important;border-radius:3px 6px 6px 3px!important;font-size:.42rem!important}
.gf-it b{display:block;font-size:.92rem}.gf-it small{display:block;font-size:.76rem;color:var(--ink-2)}.gf-it .st{font-weight:900;color:#2e9b5a}.gf-it .late{font-weight:900;color:#b33}
.gf-ac{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.45rem}.gf-ac button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.3rem .7rem;font:inherit;font-size:.76rem;font-weight:800;cursor:pointer}.gf-ac button.p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.bp-buy{display:flex;align-items:center;gap:.5rem;width:100%;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.55rem .75rem;margin:-.3rem 0 .7rem;font:inherit;font-size:.86rem;color:var(--ink);text-align:left;cursor:pointer}.bp-buy span{flex:1}.bp-buy small{display:block;font-size:.74rem;color:var(--ink-2)}.bp-buy em{font-style:normal;color:var(--ink-2)}
`; TR.append(st); }
const WB_STORES = [
  ['amazon', 'Amazon', '#232f3e', 'a', (q, isbn) => 'https://www.amazon.com.br/s?k=' + encodeURIComponent(isbn || q) + '&i=stripbooks', 'livros novos e e-book'],
  ['ml', 'Mercado Livre', '#e6c200', 'ML', (q) => 'https://lista.mercadolivre.com.br/' + encodeURIComponent(q.replace(/\s+/g, '-')), 'novos e usados de vendedores'],
  ['ev', 'Estante Virtual', '#3b7d5a', 'EV', (q) => 'https://www.estantevirtual.com.br/busca?q=' + encodeURIComponent(q), 'usados de sebos, costuma ser mais barato'],
  ['magalu', 'Magalu', '#0086ff', 'M', (q) => 'https://www.magazineluiza.com.br/busca/' + encodeURIComponent(q) + '/', ''],
  ['shopee', 'Shopee', '#ee4d2d', 'S', (q) => 'https://shopee.com.br/search?keyword=' + encodeURIComponent(q), ''],
  ['americanas', 'Americanas', '#e60014', 'A', (q) => 'https://www.americanas.com.br/busca/' + encodeURIComponent(q), ''],
  ['travessa', 'Livraria da Travessa', '#5b3a29', 'T', (q) => 'https://www.travessa.com.br/Busca.aspx?d=1&bt=' + encodeURIComponent(q), ''],
];
const wbQuery = (b) => [b.title, String(b.author || '').split(',')[0]].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
const wbOpen = (u) => { try { window.open(u, '_blank', 'noopener'); } catch { location.href = u; } };
const wbList = (b) => '<button type="button" class="wb-cmp" data-cmp="1"><span style="font-size:1.3rem"><i class=v3e data-i=busca></i></span><span><b>Comparar preços</b><small>Google Shopping: várias lojas lado a lado, do menor preço</small></span><span>↗</span></button>'
  + '<div class="wb-l">' + WB_STORES.map(([k, n, c, ab, , sub]) => '<button type="button" class="wb-it" data-st="' + k + '"><i style="background:' + c + '">' + ab + '</i><span><b>' + n + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span><em>↗</em></button>').join('') + '</div>'
  + '<p class="wb-note">As lojas abrem fora do app, já com o livro buscado. Preço e frete são os da loja; o app não vê nem guarda dados de pagamento.</p>';
const wbBind = (root, b, before) => { const q = wbQuery(b), isbn = String(b.isbn || '').replace(/\D/g, '');
  root.querySelector('[data-cmp]')?.addEventListener('click', () => { before && before(); wbOpen('https://www.google.com/search?tbm=shop&q=' + encodeURIComponent(q + ' livro')); });
  root.querySelectorAll('[data-st]').forEach((x) => x.addEventListener('click', () => { const s = WB_STORES.find((y) => y[0] === x.dataset.st); before && before(); wbOpen(s[4](q, isbn)); })); };
function whereToBuy(b) {
  if (!b) return; TR.querySelector('.esn-sheet.wb-sh')?.remove();
  const sh = document.createElement('div'); sh.className = 'esn-sheet wb-sh';
  sh.innerHTML = '<div class="box"><div class="ex-hd">' + cvh(b.title, b.cover, '') + '<div><b>Onde comprar</b><small>' + esc(b.title) + (b.author ? ' · ' + esc(String(b.author).split(',')[0]) : '') + '</small></div></div>' + wbList(b) + '<div class="acts" style="grid-template-columns:1fr"><button type="button" data-a="x">Fechar</button></div></div>';
  try { paintCv(sh); } catch {} wbBind(sh, b); sh.querySelector('[data-a=x]').addEventListener('click', () => sh.remove()); sh.addEventListener('click', (ev) => { if (ev.target === sh) sh.remove(); }); TR.append(sh);
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
    + '<h4>Onde comprar</h4>' + wbList(b)
    + '<div class="acts">' + (cur ? '<button type="button" data-a="giveup">Desistir do presente</button><button type="button" class="p" data-a="x">Fechar</button>' : '<button type="button" data-a="x">Agora não</button><button type="button" class="p" data-a="res">Só reservar</button>') + '</div></div>';
  try { paintCv(sh); } catch {}
  // abrir uma loja já reserva (se a caixa estiver marcada)
  wbBind(sh, b, () => { const c = sh.querySelector('.gf-res'); if (c && c.checked) reserve().then((ok) => { if (ok) { toast('Reservado! Boas compras'); close(); } }); });
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
// página do livro: "Onde comprar" (quando você ainda não tem o livro)
{ let tm = 0; const put = () => { const v = $('#shelflist'); if (!v || v.hidden || !S.exBookId) return; const ex = v.querySelector('.bp-ex'); if (!ex) return; const e = byId(S.exBookId); if (!e) return;
    const want = exOf(e).own !== 'tenho'; let b = v.querySelector('.bp-buy');
    if (!want) { b && b.remove(); return; } if (b) { if (b.previousElementSibling !== ex) ex.after(b); return; }
    b = document.createElement('button'); b.type = 'button'; b.className = 'bp-buy'; b.innerHTML = '<i style="font-style:normal"><i class=v3e data-i=cart></i></i><span><b>Onde comprar</b><small>comparar preços nas lojas</small></span><em>›</em>';
    b.addEventListener('click', () => whereToBuy(byId(S.exBookId))); ex.after(b); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 80); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
