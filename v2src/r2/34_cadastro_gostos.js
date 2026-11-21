// Cadastro (15/11): conta nova já sai com @usuário (sem cair em Editar perfil) e o Bear pergunta gêneros e livros
// favoritos. Os gostos ficam em db.prefs.taste e alimentam "Para você" no Hoje (Google Livros, sem mudar a API).
const TASTE_G = [['romance', 'Romance', 'subject:romance'], ['contemporaneo', 'Romance contemporâneo', '"romance contemporâneo" OR subject:"contemporary romance"'], ['dark', 'Dark romance', '"dark romance"'], ['fantasia', 'Fantasia', 'subject:fantasy'], ['romantasia', 'Romantasia', 'romantasia OR "fantasy romance"'], ['darkfantasy', 'Dark fantasy', '"dark fantasy" OR "fantasia sombria"'], ['ficcao', 'Ficção científica', 'subject:"science fiction"'],
  ['suspense', 'Suspense', 'subject:thriller'], ['policial', 'Policial e mistério', 'subject:mystery'], ['terror', 'Terror', 'subject:horror'],
  ['historico', 'Romance histórico', 'subject:"historical fiction"'], ['classicos', 'Clássicos', 'subject:classics'], ['ya', 'Jovem adulto', 'subject:"young adult"'], ['distopia', 'Distopia', 'distopia OR subject:dystopian'],
  ['nacional', 'Literatura brasileira', 'subject:"literatura brasileira"'], ['poesia', 'Poesia', 'subject:poetry'], ['hq', 'HQ e mangá', 'subject:comics'],
  ['biografia', 'Biografias', 'subject:biography'], ['autoajuda', 'Autoajuda', 'subject:"self-help"'], ['negocios', 'Negócios', 'subject:business'], ['ciencia', 'Ciência', 'subject:science']];
const TASTE_OL = {"romance":"romance","romantasia":"fantasy_romance","darkfantasy":"dark_fantasy","contemporaneo":"contemporary_romance","dark":"dark_romance","distopia":"dystopias","fantasia":"fantasy","ficcao":"science_fiction","suspense":"thriller","policial":"mystery","terror":"horror","historico":"historical_fiction","classicos":"classic_literature","ya":"young_adult_fiction","nacional":"brazilian_literature","poesia":"poetry","hq":"comics","biografia":"biography","autoajuda":"self-help","negocios":"business","ciencia":"science"};
const tasteOf = () => (db.prefs && db.prefs.taste) || null;
// ---------- @usuário automático ----------
function handleBase(name, email) {
  const clean = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9_.]+/g, '').replace(/^[._]+|[._]+$/g, '');
  let b = clean(name); if (b.length < 3) b = clean(String(email || '').split('@')[0]); if (b.length < 3) b = 'leitor' + b;
  return b.slice(0, 16);
}
async function autoHandle(name, email) {
  try {
    if (socialProfile === undefined) await loadProfile(); if (socialProfile) return socialProfile;
    const base = handleBase(name, email), disp = String(name || '').trim().slice(0, 40) || base;
    for (let i = 0; i < 6; i++) {
      const h = i ? (base.slice(0, 16) + Math.floor(100 + Math.random() * 9000)).slice(0, 20) : base;
      const r = await sapi('PUT', '/v1/me/profile', { handle: h, displayName: disp });
      if (r.status === 200 && r.data && r.data.handle) { socialProfile = r.data; try { renderProfile(); } catch {} try { paintGtop(); } catch {} return socialProfile; }
      if (r.status !== 409) break;
    }
  } catch (err) { console.warn('perfil automático', err); }
  return null;
}
function afterRegister(name, email) { // chamado pelo cadastro, depois do login
  try { sessionStorage.removeItem('bear.onMe'); } catch {}
  setTimeout(async () => { const p = await autoHandle(name, email); try { goTab('inicio'); } catch {} openTaste(true, p); }, 50);
}
// ---------- página "O que você gosta de ler?" ----------
{ const st = document.createElement('style'); st.textContent = `
.gs-t{font-size:1.35rem;margin:.2rem 0 .3rem;color:var(--ink)}
.gs-intro{margin:.1rem 0 .7rem;font-size:.9rem;color:var(--ink-2);font-weight:600}
.gs-h{font-weight:800;font-size:.95rem;margin:.6rem 0 .4rem}
.gs-chips{display:flex;flex-wrap:wrap;gap:.4rem}
.gs-ch{border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:700;font-size:.86rem;border-radius:99px;min-height:38px;padding:0 .85rem}
.gs-ch.on{border-color:var(--acc);background:var(--acc);color:#fff}
.gs-bks{display:grid;gap:.4rem}
.gs-bk{display:grid;grid-template-columns:38px 1fr auto;gap:.6rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.4rem .5rem;background:var(--panel)}
.gs-bk .cv{width:38px;height:56px;border-radius:5px;font-size:.5rem}
.gs-bk b{font-size:.88rem;display:block}.gs-bk small{font-size:.76rem;color:var(--ink-2)}
.gs-bk button{border:0;background:none;color:var(--ink-2);font-size:1.2rem;width:40px;height:40px}
.gs-t3{display:block;margin-top:.25rem;font-size:.76rem;color:var(--ink-2)}.gs-t3 .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.gs-t3 select{min-height:34px;max-width:100%;padding:0 .5rem;border-radius:99px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:.78rem;font-weight:800}
.gs-t3ok{margin:.6rem 0 0;font-size:.8rem;color:var(--ink-2)}
.gs-add{width:100%;height:42px;border-radius:12px;border:1.5px dashed var(--line);background:none;color:var(--ink);font:inherit;font-weight:800}
.gs-hist{display:grid;gap:.35rem;border:1px solid var(--line);border-radius:14px;padding:.75rem;background:var(--panel);margin-top:.9rem}.gs-hist b{font-size:.92rem}.gs-hist small{font-size:.8rem;color:var(--ink-2)}
.gs-btns{position:sticky;bottom:0;display:grid;gap:.3rem;padding:.8rem 0 .4rem;background:linear-gradient(transparent,var(--bg) 30%)}
.gs-ok{height:46px;border-radius:12px;border:0;background:var(--acc);color:#fff;font:inherit;font-weight:800;font-size:1rem}
.gs-ok:disabled{opacity:.5}
.gs-hi{display:grid;grid-template-columns:84px 1fr;gap:.7rem;align-items:center;margin:.2rem 0 1rem}.gs-hi img{width:84px;height:84px;object-fit:contain;animation:gsHop .6s cubic-bezier(.2,1.4,.4,1) both}
.gs-bub{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:.7rem .85rem;display:grid;gap:.2rem;font-size:.9rem;color:var(--ink-2);font-weight:600;animation:gsPop .45s .15s ease-out both}.gs-bub b{color:var(--ink);font-size:1.05rem;font-weight:900}
.gs-noimg{display:block!important}.gs-noimg .gs-bub::before{display:none}.gs-noimg .gs-bub{text-align:center}
.gs-bub::before{content:"";position:absolute;left:-7px;top:50%;width:12px;height:12px;background:var(--panel);border-left:1px solid var(--line);border-bottom:1px solid var(--line);transform:translateY(-50%) rotate(45deg)}
@keyframes gsHop{from{transform:translateY(14px) scale(.85);opacity:0}}@keyframes gsPop{from{transform:translateX(-8px);opacity:0}}
@media (prefers-reduced-motion:reduce){.gs-hi img,.gs-bub{animation:none}}
.gs-top{display:grid;gap:.45rem}.gs-rk,.gs-slot{grid-template-columns:22px 38px 1fr auto}.gs-rk em,.gs-slot em{font-style:normal;font-weight:900;font-size:1.05rem;color:var(--acc);text-align:center}
.gs-slot{display:grid;align-items:center;gap:.6rem;min-height:68px;border:1.5px dashed var(--line);border-radius:12px;padding:.4rem .5rem;background:none;color:var(--ink);font:inherit;font-weight:800;text-align:left}
.gs-slot span{grid-column:2/4}.gs-slot i{font-style:normal;font-size:1.3rem;color:var(--acc);width:36px;text-align:center}
.gs-slot:not(:disabled){border-color:var(--acc);background:var(--panel)}.gs-slot:disabled{opacity:.45;min-height:46px}.gs-slot:disabled em{color:var(--ink-2)}
.gs-nav{display:flex;gap:.5rem}.gs-nav .gs-ok{flex:1}.gs-prev{flex:0 0 auto;height:46px;padding:0 1.1rem;border-radius:12px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:800}
.gs-steps{display:flex;align-items:center;gap:.3rem;margin:.1rem 0 .5rem}.gs-steps i{width:26px;height:5px;border-radius:99px;background:var(--line)}.gs-steps i.on{background:var(--acc)}.gs-steps small{margin-left:.4rem;font-size:.75rem;font-weight:800;color:var(--ink-2)}
.gs-fav{display:grid;gap:.7rem;margin:.4rem 0 .8rem}.gs-fv{display:grid;grid-template-columns:48px minmax(0,1fr);gap:.7rem;align-items:start;padding:.65rem;border:1px solid var(--line);border-radius:14px;background:var(--panel)}
.gs-fv .cv{width:48px;height:70px;border-radius:5px}.gs-fvt b{display:block;font-size:.92rem;line-height:1.25;margin-bottom:.35rem}.gs-fvt small{font-size:.8rem;color:var(--ink-2)}
.gs-fvo{display:flex;flex-wrap:wrap;gap:.35rem}.gs-fvo button{min-height:40px;padding:0 .75rem;border-radius:99px;border:1.5px solid var(--line);background:none;color:var(--ink);font:inherit;font-size:.82rem;font-weight:800;cursor:pointer}
.gs-fvo button.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,transparent)}
.gs-hok{color:var(--ok,#2e7d4f)!important;font-weight:800;font-size:.9rem!important}
.gs-skip{height:40px;border:0;background:none;color:var(--ink);font:inherit;font-weight:700;opacity:.75}
.pv-row{display:flex;gap:.6rem;overflow-x:auto;padding:.2rem 0 .5rem;scrollbar-width:none}.pv-row::-webkit-scrollbar{display:none}
.pv-bk{flex:0 0 92px;border:0;background:none;padding:0;text-align:left;color:var(--ink);font:inherit}
.pv-bk .cv{width:92px;height:136px;border-radius:7px;display:block}
.pv-bk b{display:block;font-size:.78rem;line-height:1.2;margin-top:.3rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.pv-bk small{display:block;font-size:.7rem;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.pv-ask{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;width:100%;text-align:left;border:1px solid var(--line);border-radius:14px;padding:.75rem .85rem;background:var(--panel);color:var(--ink);font:inherit;margin:.2rem 0 .6rem}
.pv-ask b{display:block;font-size:.92rem}.pv-ask small{font-size:.8rem;color:var(--ink-2)}
.pv-msg{font-size:.84rem;color:var(--ink-2);margin:.2rem 0 .6rem}
`; TR.append(st); }
// Primeiro acesso em 3 passos (16/11): gêneros → top 3 → histórico de outro app (importa ali mesmo). Depois, "Seus gostos" é uma página só.
function openTaste(first, prof, start) {
  S.gsHist = ''; S.gsSeen = 0; let step = first && start >= 1 && start <= 3 ? Math.floor(start) : 1, fav = false, favKey = ''; const favCh = {};
  const v = $('#shelflist'), t0 = tasteOf() || {}, sel = new Set(t0.genres || []), books = [...(t0.books || [])];
  const keep = () => { db.prefs = { ...(db.prefs || {}), tasteAsked: 1, ...(sel.size || books.length ? { taste: { genres: [...sel], books, at: new Date().toISOString() } } : {}) }; save(); try { localStorage.removeItem('bear.pv'); } catch {} };
  const chips = () => '<div class="gs-chips">' + TASTE_G.map(([k, n]) => '<button type="button" class="gs-ch' + (sel.has(k) ? ' on' : '') + '" data-k="' + k + '" aria-pressed="' + sel.has(k) + '">' + esc(n) + '</button>').join('') + '</div>';
  const bookList = () => '<div class="gs-bks">' + books.map((b, i) => '<div class="gs-bk">' + cvh(b.title, b.cover) + '<span><b>' + esc(b.title) + '</b><small>' + esc(b.author || '') + '</small></span><button type="button" data-rm="' + i + '" aria-label="Tirar ' + esc(b.title) + '">×</button></div>').join('')
    + (books.length < 3 ? '<button type="button" class="gs-add" id="gs-add">+ Adicionar livro</button>' : '') + '</div>';
  const bear = (img, title, text) => '<div class="gs-hi gs-noimg"><div class="gs-bub">' + (title ? '<b>' + title + '</b>' : '') + '<span>' + text + '</span></div></div>';
  const slots = () => '<div class="gs-top">' + [0, 1, 2].map((i) => { const b = books[i];
    return b ? '<div class="gs-bk gs-rk"><em>' + (i + 1) + '</em>' + cvh(b.title, b.cover) + '<span><b>' + esc(b.title) + '</b><small>' + esc(b.author || '') + '</small>' + (first ? t3Sel(b, i) : '') + '</span><button type="button" data-rm="' + i + '" aria-label="Tirar ' + esc(b.title) + '">×</button></div>'
      : '<button type="button" class="gs-slot" data-slot="' + i + '"' + (i > books.length ? ' disabled' : '') + '><em>' + (i + 1) + '</em><span>' + (i === books.length ? (i ? 'Mais um que você amou' : 'Escolher o primeiro livro') : '') + '</span>' + (i === books.length ? '<i>+</i>' : '') + '</button>'; }).join('') + '</div>';
  // Top 3 do primeiro acesso entra na Biblioteca ao escolher (Lido, sem data); a vaga tem "Lido ▾" para mudar ali mesmo (Bia, 21/11)
  const t3Has = (e) => !!(e && ((e.quotes && e.quotes.length) || e.note || e.notes || (e.diary && e.diary.length) || (e.log && e.log.length) || e.review || e.loan || e.own));
  const t3Find = (b) => lib().find((x) => normT(x.title) === normT(b.title));
  const t3Put = (b, st) => { try { db.library = db.library || []; const k = normT(b.title), e = t3Find(b);
      if (e && !e.fromTop3) { favCh[k] = 'keep'; return; }
      if (!st) { if (e && !t3Has(e)) db.library = db.library.filter((x) => x !== e); favCh[k] = ''; save(); return; }
      if (e) { delete e.noDate; delete e.startedAt; } const x = e || { id: uid(), title: b.title, author: b.author || null, totalPages: null, addedAt: todayISO(), fromTop3: 1 };
      x.status = st; if (b.cover && !x.cover) x.cover = b.cover; if (st === 'LIDO') x.noDate = true; if (st === 'LENDO') x.startedAt = todayISO(); if (!e) db.library.push(x); favCh[k] = st; save(); } catch (err) { console.warn('top 3 na biblioteca', err); } };
  const T3O = [['LIDO', 'Lido'], ['QUERO', 'Quero ler'], ['LENDO', 'Lendo'], ['', 'Não colocar na Biblioteca']];
  const t3Sel = (b, i) => { const k = normT(b.title), e = t3Find(b), ch = favCh[k];
    if (ch === 'keep' || (e && !e.fromTop3)) return '<small class="gs-t3">já está na sua Biblioteca · ' + esc(String(LIB_LABEL[(e || {}).status] || '').toLowerCase()) + '</small>';
    const cur = ch === undefined ? 'LIDO' : ch; return '<label class="gs-t3"><span class="sr">Na Biblioteca como</span><select data-t3="' + i + '" aria-label="' + esc(b.title) + ' na Biblioteca como">' + T3O.map(([v, n]) => '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label>'; };
  const pickBook = () => searchSheet({ title: 'Um livro que você amou', onPick: (it) => { if (it && it.title && !books.some((x) => normT(x.title) === normT(it.title))) { const b = { title: String(it.title).slice(0, 200), author: it.author || null, cover: typeof it.cover === 'string' && /^https:/.test(it.cover) ? it.cover : null }; books.push(b); if (first) t3Put(b, 'LIDO'); } draw(); } });
  const draw = () => {
    let body, okTxt, skipTxt, okOn = true, top;
    if (!first) {
      top = '<button type="button" class="sl-back">‹ Voltar</button><b>O que você gosta de ler?</b><span></span>';
      body = '<p class="gs-intro">Conte seus gêneros e livros favoritos e o app indica leituras para você.</p><div class="gs-h">Gêneros</div>' + chips() + '<div class="gs-h">Livros que você amou <small style="font-weight:600;opacity:.7">(até 3)</small></div>' + bookList();
      okTxt = 'Salvar'; skipTxt = 'Cancelar'; okOn = !!(sel.size || books.length);
    } else {
      // guarda o passo do primeiro acesso: se o app recarregar no meio, ele volta daqui (teste real 21/11, item 1)
      try { const pp = (db.prefs || {}).pp; if (pp && pp.fs !== 'ok' && pp.fs !== step) { pp.fs = step; save(); } } catch {}
      top = '<span></span><b>Primeiros passos</b><span></span>';
      const dots = '<div class="gs-steps" aria-label="Passo ' + step + ' de 3">' + [1, 2, 3].map((i) => '<i class="' + (i <= step ? 'on' : '') + '"></i>').join('') + '<small>Passo ' + step + ' de 3</small></div>';
      const inLib = (b) => lib().find((x) => normT(x.title) === normT(b.title));
      if (step === 2 && fav) { // pergunta antes de colocar o Top 3 na Biblioteca (Bia, 21/11)
        const OPT = [['LIDO', 'Já li'], ['QUERO', 'Quero ler'], ['LENDO', 'Lendo'], ['', 'Não colocar']];
        body = dots + '<h2 class="gs-t">Quer colocar seus favoritos na Biblioteca?</h2><p class="gs-intro">Escolha como cada um entra. Dá para mudar depois.</p><div class="gs-fav">'
          + books.map((b, i) => { const e = inLib(b), ch = favCh[normT(b.title)] ?? 'LIDO';
            return '<div class="gs-fv">' + cvh(b.title, b.cover) + '<div class="gs-fvt"><b>' + esc(b.title) + '</b>' + (e ? '<small>já está na sua Biblioteca · ' + esc(String(LIB_LABEL[e.status] || e.status || '').toLowerCase()) + '</small>'
              : '<div class="gs-fvo" role="radiogroup" aria-label="Como ' + esc(b.title) + ' entra">' + OPT.map(([k, n]) => '<button type="button" role="radio" aria-checked="' + (ch === k) + '" class="' + (ch === k ? 'on' : '') + '" data-fi="' + i + '" data-fk="' + k + '">' + n + '</button>').join('') + '</div>') + '</div></div>'; }).join('') + '</div>';
        okTxt = 'Colocar na Biblioteca'; skipTxt = 'Agora não';
      }
      else if (step === 1) body = bear('bear_celebrating', 'Boas-vindas' + ((() => { const n = String((prof && prof.displayName) || (socialProfile && socialProfile.displayName) || '').trim().split(/\s+/)[0]; return n ? ', ' + esc(n) : ''; })()) + '!', 'Para você aproveitar o app ao máximo, eu queria te conhecer melhor. São só 3 perguntinhas.')
        + dots + '<h2 class="gs-t">Quais gêneros você mais gosta?</h2><p class="gs-intro">Marque quantos quiser.</p>' + chips();
      else if (step === 2) body = bear('bear_reading_chair', '', books.length ? (books.length < 3 ? 'Ótima escolha! Quer colocar mais algum?' : 'Que top 3! Já sei bem o que te indicar.') : 'Agora me conta: quais livros marcaram você? Com eles eu acho leituras parecidas.')
        + dots + '<h2 class="gs-t">Seus livros do coração</h2><p class="gs-intro">Monte seu Top 3. Pode ser só um, ou nenhum.</p>' + slots() + (books.some((b) => { const c = favCh[normT(b.title)]; return c && c !== 'keep'; }) ? '<p class="gs-t3ok">Seus favoritos já estão na Biblioteca</p>' : '');
      else body = bear('bear_running_books', '', S.gsHist ? 'Pronto, seus livros estão na Biblioteca!' : 'Última pergunta, prometo!') + dots + '<h2 class="gs-t">Já usou outro app de leitura?</h2><p class="gs-intro">Apps de leitura deixam baixar seu histórico de leitura num arquivo (.csv). No Goodreads, pelo site no computador: My Books › Import and export › Export Library. Em outros apps, procure por exportar nas configurações. Depois é só voltar aqui e selecionar o arquivo baixado.</p>'
        + '<div class="gs-hist">' + (S.gsHist ? '<small class="gs-hok">✓ ' + esc(S.gsHist) + '</small>' : '')
        + '<button type="button" class="gs-add" id="gs-hist">' + (S.gsHist ? 'Importar outro arquivo' : 'Importar arquivo (CSV)') + '</button></div>';
      if (!(step === 2 && fav)) { okTxt = step < 3 ? 'Continuar' : 'Começar a usar'; skipTxt = step < 3 ? 'Pular' : (S.gsHist ? '' : 'Agora não'); }
    }
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top">' + top + '</div>' + body
      + '<div class="gs-btns"><div class="gs-nav">' + (first && step > 1 ? '<button type="button" class="gs-prev" id="gs-prev">‹ Voltar</button>' : '') + '<button type="button" class="gs-ok" id="gs-ok"' + (okOn ? '' : ' disabled') + '>' + okTxt + '</button></div>' + (skipTxt ? '<button type="button" class="gs-skip" id="gs-skip">' + skipTxt + '</button>' : '') + '</div>';
    paintCv(v); v.scrollTop = 0; if (S.gsSeen === step) v.querySelectorAll('.gs-hi img,.gs-bub').forEach((x) => { x.style.animation = 'none'; }); S.gsSeen = step;
    const back = v.querySelector('.sl-back');
    $('#gs-prev', v)?.addEventListener('click', () => { if (fav) { fav = false; return draw(); } step = Math.max(1, step - 1); draw(); });
    $$('[data-fk]', v).forEach((b) => b.addEventListener('click', () => { const i = b.dataset.fi, k = b.dataset.fk; favCh[normT(books[+i].title)] = k; draw(); v.querySelector('[data-fi="' + i + '"][data-fk="' + k + '"]')?.focus(); }));
    const needFav = () => false; const needFavOld = () => { const k = books.map((b) => normT(b.title)).join('|'); return first && step === 2 && !fav && books.length && k !== favKey && books.some((b) => !lib().some((x) => normT(x.title) === normT(b.title))); };
    const afterFav = (put) => { favKey = books.map((b) => normT(b.title)).join('|'); if (put) favToLib(books, favCh); fav = false; step = 3; draw(); };
    if (back) back.addEventListener('click', () => { v.hidden = true; });
    $$('.gs-ch', v).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k; sel.has(k) ? sel.delete(k) : sel.add(k); b.classList.toggle('on', sel.has(k)); b.setAttribute('aria-pressed', sel.has(k)); if (!first) $('#gs-ok', v).disabled = !(sel.size || books.length); }));
    $$('[data-rm]', v).forEach((b) => b.addEventListener('click', () => { const x = books[+b.dataset.rm]; if (first && x) t3Put(x, null); books.splice(+b.dataset.rm, 1); if (x) delete favCh[normT(x.title)]; draw(); }));
    $$('[data-t3]', v).forEach((sl) => sl.addEventListener('change', () => { const x = books[+sl.dataset.t3]; if (x) t3Put(x, sl.value); draw(); v.querySelector('[data-t3="' + sl.dataset.t3 + '"]')?.focus(); }));
    $('#gs-add', v)?.addEventListener('click', pickBook);
    $$('.gs-slot', v).forEach((b) => b.addEventListener('click', pickBook));
    $('#gs-hist', v)?.addEventListener('click', () => { // importa ali mesmo, sem sair do passo
      const before = lib().length, old = S.listRedraw;
      // só escreve quando os livros entraram de fato (a prévia redesenha antes da importação; Bia, 21/11, item B)
      S.listRedraw = () => { if (v.hidden || !v.querySelector('#gs-hist')) { S.listRedraw = old; return old && old(); } const n = lib().length - before; if (n <= 0) return old && old();
        S.listRedraw = old; S.gsHist = (n === 1 ? '1 livro entrou' : n + ' livros entraram') + ' na sua Biblioteca'; draw(); };
      importCSV(); });
    $('#gs-skip', v)?.addEventListener('click', () => { if (!first) return done(); if (fav) return afterFav(false); keep(); if (step < 3) { step++; draw(); } else done(); });
    $('#gs-ok', v).addEventListener('click', () => {
      if (fav) return afterFav(true);
      if (needFav()) { keep(); fav = true; return draw(); }
      if (first && step < 3) { keep(); step++; return draw(); }
      keep(); if (sel.size || books.length) toast(first ? 'Tudo pronto' : 'Gostos salvos'); done();
    });
  };
  const done = () => { if (first) { try { const pp = (db.prefs || {}).pp; if (pp) { pp.fs = 'ok'; save(); } } catch {} } if (!first && S.nav.st.length) return navBack(); v.hidden = true; try { if (S.tab === 'inicio') drawTab(); else goTab('inicio'); } catch {} };
  v.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && fav) { ev.stopPropagation(); fav = false; draw(); } }, true);
  S.listRedraw = draw; S.navView = { t: 'taste', a: [] }; closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page'); draw(); v.hidden = false; v.scrollTop = 0; syncTopTitle();
}
{ const _o = openTaste; openTaste = function (first) { if (first) { S.nav.st = []; S.nav.cur = null; return _o.apply(this, arguments); } navEnter(() => openTaste()); S.nav.depth++; try { return _o.apply(this, arguments); } finally { S.nav.depth--; } }; }
// ---------- "Para você" no Hoje ----------
// Top 3 do primeiro acesso: o app pergunta antes de colocar na Biblioteca (Bia, 21/11; antes entrava sozinho como Lido).
// Cada livro: Já li (Lido sem data) · Quero ler · Lendo · Não colocar. Livro que já está na Biblioteca não duplica nem muda.
function favToLib(books, ch) {
  try {
    if (!books || !books.length) return;
    db.library = db.library || [];
    const have = new Set(lib().map((x) => normT(x.title))), added = [];
    books.forEach((b) => { const k = normT((b && b.title) || ''), st = ch[k] ?? 'LIDO'; if (!k || !st || have.has(k)) return;
      const e = { id: uid(), title: b.title, author: b.author || null, totalPages: null, status: st, addedAt: todayISO(), fromTop3: 1 };
      if (b.cover) e.cover = b.cover;
      if (st === 'LIDO') e.noDate = true;
      if (st === 'LENDO') e.startedAt = todayISO();
      db.library.push(e); have.add(k); added.push(e.id); });
    if (!added.length) return;
    save();
    const msg = added.length === 1 ? '1 favorito entrou na Biblioteca' : `${added.length} favoritos entraram na Biblioteca`;
    setTimeout(() => toast(msg, { label: 'Desfazer', fn: () => { db.library = (db.library || []).filter((x) => !added.includes(x.id)); save(); try { drawTab(); } catch {} } }), 300);
  } catch (err) { console.warn('favoritos na biblioteca', err); }
}
async function tasteRecs() {
  const t = tasteOf(); if (!t) return [];
  const key = JSON.stringify(['pt2', t.genres, (t.books || []).map((b) => b.title)]), day = todayISO();
  try { const c = JSON.parse(localStorage.getItem('bear.pv') || 'null'); if (c && c.key === key && c.day === day && Array.isArray(c.items)) return c.items; } catch {}
  const qs = [];
  for (const k of t.genres || []) { const g = TASTE_G.find((x) => x[0] === k); if (g) qs.push(g[2]); }
  for (const b of t.books || []) { const a = String(b.author || '').split(',')[0].trim(); if (a) qs.push(`inauthor:"${a}"`); }
  if (!qs.length) return [];
  const G = 'https://www.googleapis.com/books/v1/volumes?printType=books&maxResults=20&langRestrict=pt&q=';
  let lists = await Promise.all(qs.slice(0, 8).map((q) => getJSON(G + encodeURIComponent(q), 8000).then(fromGoogle).catch(() => [])));
  if (lists.flat().filter((x) => x && x.coverUrl).length < 6) { // Google sem resposta (limite): Open Library como reserva
    const O = 'https://openlibrary.org/search.json?limit=20&language=por&fields=key,title,author_name,cover_i&', ol = (d) => ((d && d.docs) || []).map((x) => ({ title: x.title, author: (x.author_name || [])[0] || null, coverUrl: x.cover_i ? `https://covers.openlibrary.org/b/id/${x.cover_i}-M.jpg` : null, olKey: x.key }));
    const oq = [...(t.genres || []).map((k) => TASTE_OL[k] && 'subject=' + encodeURIComponent(TASTE_OL[k])), ...(t.books || []).map((b) => { const a = String(b.author || '').split(',')[0].trim(); return a && 'author=' + encodeURIComponent(a); })].filter(Boolean).slice(0, 8);
    lists = lists.concat(await Promise.all(oq.map((q) => getJSON(O + q, 9000).then(ol).catch(() => []))));
  }
  const mine = new Set([...(lib() || []).map((e) => normT(e.title || '')), ...(t.books || []).map((b) => normT(b.title))]), seen = new Set(), out = [];
  const side = /\b(box|kit|colecao|resumo|guia|edicao comentada|livro de colorir)\b/;
  for (let i = 0; out.length < 40 && i < 20; i++) for (const L of lists) { const it = L[i]; if (!it || !it.title || !it.coverUrl) continue; const n = normT(it.title.split(':')[0]); if (!n || seen.has(n) || mine.has(n) || side.test(n)) continue; seen.add(n); out.push({ title: it.title.split(':')[0].trim(), author: it.author, coverUrl: it.coverUrl, lang: it.lang || '', isbn: it.isbn || null, olKey: it.olKey || null }); if (out.length >= 40) break; }
  // reserva da Open Library: troca o título original pelo da edição em português (16/11)
  const olq = out.filter((x) => x.olKey).slice(0, 16); out.forEach((x) => { if (x.olKey && !olq.includes(x)) delete x.olKey; }); await Promise.all([0, 1].map(async () => { for (let x; (x = olq.shift());) { try { const d = await getJSON(`https://openlibrary.org${x.olKey}/editions.json?limit=100`, 12000); if (!d) { delete x.olKey; continue; } const e = ((d && d.entries) || []).find((z) => (z.languages || []).some((l) => l.key === '/languages/por') && z.title); if (e) { x.title = e.title.split(':')[0].trim(); x.lang = 'pt'; if (e.covers && e.covers[0] > 0) x.coverUrl = `https://covers.openlibrary.org/b/id/${e.covers[0]}-M.jpg`; } else x.lang = 'en'; } catch {} delete x.olKey; } }));
  if (out.length) { try { localStorage.setItem('bear.pv', JSON.stringify({ key, day, items: out })); } catch {} }
  return out;
}
function paintForYou(box) {
  if (!box || box.querySelector('#pv-host')) return;
  const t = tasteOf(), host = document.createElement('div'); host.id = 'pv-host';
  const at = box.querySelector('.v3-colA') || box; at.append(host);
  if (!t || !((t.genres || []).length || (t.books || []).length)) {
    host.innerHTML = `<button type="button" class="pv-ask" id="pv-ask"><span><b>Receba indicações de leitura</b><small>Conte seus gêneros e livros favoritos</small></span>›</button>`;
    $('#pv-ask', host).addEventListener('click', () => openTaste()); return;
  }
  host.innerHTML = `<div class="v3-sh"><b>Para você</b><button type="button" class="v3-link" id="pv-edit">Seus gostos ›</button></div><p class="pv-msg">Buscando indicações…</p>`;
  $('#pv-edit', host).addEventListener('click', () => openTaste());
  tasteRecs().then((items) => {
    if (!host.isConnected) return;
    const sh = host.querySelector('.v3-sh').outerHTML;
    host.innerHTML = sh + (items.length ? `<div class="pv-row">${items.map((it, i) => `<button type="button" class="pv-bk" data-i="${i}">${cvh(it.title, it.coverUrl)}<b>${esc(it.title)}</b><small>${esc(it.author || '')}</small></button>`).join('')}</div>`
      : `<p class="pv-msg">${navigator.onLine === false ? 'Sem internet agora.' : 'Não achei indicações agora. Tente mais tarde ou ajuste seus gostos.'}</p>`);
    paintCv(host); $('#pv-edit', host).addEventListener('click', () => openTaste());
    $$('.pv-bk', host).forEach((b) => b.addEventListener('click', () => { const it = items[+b.dataset.i]; bookQuickMenu(b.querySelector('.cv') || b, { title: it.title, author: it.author }); }));
  });
}
{ const _dt = drawTab; drawTab = function () { const r = _dt.apply(this, arguments); try { if (S.tab === 'inicio') paintForYou($('#lista')); } catch (err) { console.warn('para você', err); } return r; }; }
window.bearAfterRegister = (n, e) => afterRegister(n, e);
