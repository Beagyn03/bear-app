// v4 Comunidade e Pergunta do dia (Bia, 20/11; etapa 6 do alinhamento com o protótipo v3 https://claude.ai/artifact/FZDpofzVvP8EJjSrugBoJc).
// Regra: o que foi revisado no protótipo fica igual no app dev. Raiz própria na aba Comunidade com o CSS do protótipo (V4CSS),
// como a Estante v4. Dados e ações reaproveitam a Rede (rdLoad/rdMenu/openRdThread/openRdComposer/rdToggleSave/rdShareMenu).
// - Topo: "Escreva sobre sua leitura…"; abas Amizades (padrão) · Todos · Desafio · Ler junto · Salvos (22/11; filtros Tudo · Avaliações · Comentários
//   e a engrenagem dentro de Amizades e Todos; telas do Desafio e do Ler junto no bloco i1).
// - Post: capa primeiro, pílula de atividade, texto (véu de spoiler com "Eu quero ver mesmo assim" e "esconder de novo"),
//   emoções da lista única, Curtir · Responder · N · Salvar · Enviar. Nome/foto abre o perfil (o seu vai para Você).
// - Meu post: Editar, Quem vê (Todos/Só amizades), Marcar spoiler, Excluir com confirmação (API PATCH/DELETE /v1/posts/:id).
// - Pergunta do dia de verdade (API /v1/qday): votar numa capa (ou buscar outro livro), top 3 com barras no Hoje, página "Mais votados".
const V6CSS = `.v6spt{display:inline-flex;align-items:center;gap:3px;margin-left:6px;padding:1px 7px;border-radius:99px;font-size:10.5px;font-weight:800;color:var(--ink2);background:color-mix(in srgb,var(--ink) 8%,transparent);vertical-align:middle}.v6spt svg{width:12px;height:12px}
.v6com{position:static!important;inset:auto!important;z-index:auto!important;padding:0 0 24px;background:transparent!important}
.v6com .post .pcv{border:0;background:none;padding:0;cursor:pointer;flex:none}
.v6com .cv:not(.img),.v4ler .v6q .cv:not(.img){background:linear-gradient(160deg,var(--c,#7e63c9),color-mix(in srgb,var(--c,#7e63c9) 55%,#000));color:#fff;font-family:var(--f-disp);font-weight:700;font-size:10px;line-height:1.1;padding:6px;display:flex;align-items:flex-end;overflow:hidden;box-sizing:border-box}
.v6com .cv.img,.v4ler .v6q .cv.img{background-size:cover;background-position:center}
.v6com .post .pcv .cv{width:64px;height:96px;border-radius:4px 8px 8px 4px;display:block;background-size:cover;background-position:center}
.v6com .post .pq{margin:6px 0 0;padding:8px 10px;border-left:3px solid var(--acc);background:var(--soft);border-radius:0 10px 10px 0;font-style:italic;font-size:13.5px;line-height:1.45}
.v6com .post .pq small{display:block;font-style:normal;color:var(--ink3);font-size:11px;margin-top:3px}
.v6com .post .prec{display:flex;align-items:center;gap:8px;margin-top:6px;font-size:12.5px;font-weight:800}.v6com .post .prec .cv{width:30px;height:45px;font-size:0;border-radius:3px 5px 5px 3px}
.v6com .post .pimg{margin-top:8px;border-radius:12px;overflow:hidden}.v6com .post .pimg img{width:100%;display:block}
.v6com .acts .liked{color:var(--acc)}.v6com .acts .liked svg{fill:currentColor}
.v6com .acts .saved svg{fill:currentColor;color:var(--acc)}
.v6com .who .av{background-size:cover;background-position:center}
.v6com .macts{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:14px}.v6com .macts .btn{min-height:42px;padding:0 16px;border-radius:999px;font-weight:800;border:1px solid var(--line);background:var(--panel);color:var(--ink)}.v6com .macts .btn.p{background:var(--acc);border-color:transparent;color:var(--on-acc,#fff)}
.v6com .msg{padding:22px 16px;border:1.5px dashed var(--line);border-radius:16px;text-align:center;color:var(--ink2);margin-top:12px;line-height:1.45}
.v6com .more2{display:block;width:100%;margin:12px 0 0;padding:11px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-weight:900;cursor:pointer}
.v6com .day{font-family:var(--f-disp);font-size:15px;color:var(--ink2);margin:14px 2px 6px}
.v4ler .v6ta{width:100%;min-height:110px;resize:vertical;font:inherit;font-size:14px;line-height:1.45;padding:10px 12px;border-radius:14px;border:1.5px solid var(--line);background:var(--soft);color:var(--ink);box-sizing:border-box}
.v4ler .v6cnt{text-align:right;font-size:11px;color:var(--ink3);margin-top:3px}
.v4ler .v6q .qpk{display:flex;gap:10px;margin-top:10px}.v4ler .v6q .qpk button{display:grid;gap:5px;justify-items:center;border:0;background:none;padding:0;font:inherit;font-size:11.5px;font-weight:800;color:var(--ink);width:72px;cursor:pointer}
.v4ler .v6q .qpk .cv{width:64px;height:96px;border-radius:3px 7px 7px 3px}
.v4ler .v6q .qpk .o .cv{display:grid;place-items:center;background:var(--soft);border:1.5px dashed var(--line);color:var(--ink2)}
`;
const v6S = () => (S.v6 = S.v6 || { f: 'amigos', open: {}, list: [] });
const v6Feed = (sc) => ((S.v6f = S.v6f || {})[sc] || (S.v6f[sc] = { items: [], more: false, at: 0, busy: false, err: false }));
const v6Sc = (f) => (f === 'amigos' ? 'amigos' : 'rede');
const v6On = () => { try { return v4On('comunidade'); } catch { return true; } };
const v6Lbl = (k) => { try { const x = QT_FEELS.find((y) => y[0] === k); return x ? x[1] : null; } catch { return null; } };
const v6Me = () => (socialProfile && socialProfile.handle) || '';

// ---------- dados ----------
async function v6Load(sc, more) {
  const F = v6Feed(sc); if (!connected() || !socialProfile || F.busy) return; F.busy = true; v6Paint();
  const before = more && F.items.length ? F.items[F.items.length - 1].createdAt : null;
  try {
    const r = await sapi('GET', '/v1/rede?scope=' + sc + (before ? '&before=' + encodeURIComponent(before) : ''));
    if (r.status === 200 && r.data) { const seen = new Set(more ? F.items.map((x) => x.type + x.id) : []); const neu = (r.data.items || []).filter((x) => !seen.has(x.type + x.id));
      F.items = more ? [...F.items, ...neu] : neu; F.more = !!r.data.more && neu.length > 0; F.at = Date.now(); F.err = false; if (r.data.admin) S.rd.admin = true;
      if (sc === 'rede') { S.rd.items = F.items; S.rd.at = F.at; S.rd.more = F.more; } }
    else F.err = true;
  } catch { F.err = true; } finally { F.busy = false; }
  v6Paint();
}
const v6All = (it) => ['amigos', 'rede'].flatMap((sc) => v6Feed(sc).items.filter((x) => x.type === it.type && x.id === it.id));
function v6List() {
  const f = v6S().f;
  if (f === 'salvos') { try { return rdSavedList().map((x) => x.it); } catch { return []; } }
  const L = (() => { try { return rdVisible(v6Feed(v6Sc(f)).items); } catch { return v6Feed(v6Sc(f)).items; } })();
  // (Bia, 22/11) Avaliações e Comentários viraram filtro dentro de Amizades e Todos (enquete conta como comentário)
  const sf = v6Fil(f);
  return sf === 'aval' ? L.filter((x) => x.type === 'review') : sf === 'coment' ? L.filter((x) => x.type === 'post') : L;
}

// ---------- raiz própria na aba ----------
function v6Root(box) {
  let h = box.querySelector(':scope > .v6host');
  if (!h || !h.shadowRoot) {
    // o espaço da barra fixa do topo (.gtop-sp) fica: sem ele o campo "Escreva sobre sua leitura" ficava escondido atrás da barra
    box.innerHTML = '<div class="gtop-sp"></div>'; h = document.createElement('div'); h.className = 'v6host'; box.append(h);
    const sr = h.attachShadow({ mode: 'open' }), st = document.createElement('style'); st.textContent = V4CSS + V4EXTRA + V6CSS; sr.append(st);
    const r = document.createElement('div'); r.className = 'v4ler v6com'; sr.append(r); r.addEventListener('click', v6Click, true);
  }
  return h.shadowRoot.querySelector('.v6com');
}
{ const _dt = drawTab; drawTab = function () {
    const r = _dt.apply(this, arguments);
    try { if (S.tab === 'comunidade') { const box = $('#lista'); if (box) { box.classList.remove('rd-on'); v6Root(box); v6Paint(); const F = v6Feed(v6Sc(v6S().f)); if (!F.busy && Date.now() - F.at > 20000) v6Load(v6Sc(v6S().f)); } } } catch (err) { console.warn('comunidade v4', err); }
    return r;
  }; }
// a Rede antiga pinta em #rd-host; na aba nova, quem pede repintura é atendido aqui
{ const _pr = paintRede; paintRede = function () { if (S.tab === 'comunidade' && $('#lista > .v6host')) return v6Paint(); return _pr.apply(this, arguments); }; }

function v6Act(it) {
  const ic = (k) => v4ic(k, 13);
  if (it.type === 'review') {
    const st = it.bookStatus || (it.readerPct != null && it.readerPct < 100 ? 'PAROU' : null), p = Number(it.paws) || 0;
    if (st === 'ABANDONEI') return `<span class="pact ab">${ic('stop')}Abandonou${it.readerPct != null ? ' com ' + Math.round(it.readerPct) + '%' : ''}</span>`;
    if (st === 'HIBERNANDO') return `<span class="pact pa">${ic('pause')}Pausou${it.readerPct != null ? ' com ' + Math.round(it.readerPct) + '%' : ''}</span>`;
    if (st === 'LENDO' || st === 'PAROU') return `<span class="pact le">${ic('ler')}Lendo${it.readerPct != null ? ' · ' + Math.round(it.readerPct) + '%' : ''}</span>`;
    return `<span class="pact av2">${ic('quote')}Avaliou${p ? ` <i class="st">${'★'.repeat(Math.round(p))}<u>${'★'.repeat(5 - Math.round(p))}</u></i>` : ''}</span>`;
  }
  const t = String(it.text || '');
  if (DEB_RE.test(t)) return `<span class="pact de">${ic('ach')}${DEB.resp}</span>`;
  if (it.kind === 'rec') return `<span class="pact in">${ic('heart')}Indicou</span>`;
  if (it.kind === 'question') return `<span class="pact qu">${ic('reply')}Perguntou</span>`;
  if (it.kind === 'quote') return `<span class="pact le">${ic('quote')}Trecho${v2PctTxt(it.readerPct, it.page, (it.book || {}).title, ' · ')}</span>`;
  if (it.readerPct === 100) return `<span class="pact te">${ic('ok')}Terminou</span>`;
  return `<span class="pact le">${ic('ler')}Lendo${it.readerPct != null ? ' · ' + Math.round(it.readerPct) + '%' : ''}</span>`;
}
const v6Body = (t) => String(t || '').replace(/^(Debate semanal|Desafio da semana|Pergunta do dia):[^\n]*\n?/i, (m) => m).trim();
function v6PostHTML(it, i) {
  const u = it.user || {}, mine = it.mine || (u.handle && u.handle === v6Me()), S6 = v6S(), key = it.type + it.id;
  const sp = (() => { try { return rdSpoil(it); } catch { return it.spoiler ? 'spoiler' : null; } })(), open = !!S6.open[key] || mine;
  const vis = mine && it.type === 'post' ? ` · <span class="vis">${it.visibility === 'friends' ? v4ic('friends', 12) + 'amizades' : v4ic('globe', 12) + 'comunidade'}</span>` : '';
  const body = `${it.text ? `<p>${esc(v6Body(it.text))}</p>` : ''}${it.quote ? `<div class="pq">“${esc(it.quote)}”${it.page ? `<small>pág. ${it.page}</small>` : ''}</div>` : ''}${it.book2 ? `<div class="prec">${cvh(it.book2.title, it.book2.cover)}<span>indicou <b>${esc(it.book2.title)}</b></span></div>` : ''}${it.hasImage ? `<div class="pimg rd-img" data-img="${esc(it.id)}"></div>` : ''}`;
  const fe = (it.feelings || []).map(v6Lbl).filter(Boolean);
  let saved = false; try { saved = rdIsSaved(it); } catch {}
  return `<article class="card post" data-i="${i}"><div class="who"><button class="whob" data-a="v6who" data-i="${i}" aria-label="Ver o perfil de ${esc(u.displayName || u.handle || '')}"><span class="av" data-avh="${esc(u.handle || '')}" style="background-color:${friendColor(u.handle || '')}">${esc(initial(u.displayName || u.handle || '?'))}</span><span><b>${esc(u.displayName || '@' + (u.handle || ''))}</b> <small>@${esc(u.handle || '')} · ${esc(relTime(it.createdAt))}${vis}</small></span></button><button class="ib more" data-a="v6more" data-i="${i}" aria-label="Mais">${v4ic('dots', 18)}</button></div>
    <div class="pbody">${it.book ? `<button class="pcv" data-a="v6book" data-i="${i}" aria-label="${esc(it.book.title)}">${cvh(it.book.title, it.book.cover)}</button>` : ''}<div class="ptx">${v6Act(it)}${mine && sp ? `<span class="v6spt">${v4ic('eye', 12)}spoiler</span>` : ''}
    ${sp && !open ? `<span class="spz" data-a="v6sp" data-i="${i}" role="button"><span class="spzt">${body || '<p>…</p>'}</span><span class="spveil on"><em>${v4ic('eye', 15)}Cuidado, spoiler</em><small>Eu quero ver mesmo assim</small></span></span>`
      : `${body}${sp && S6.open[key] && !mine ? `<button class="sphide" data-a="v6sph" data-i="${i}">${v4ic('eye', 13)}Spoiler aberto · esconder de novo</button>` : ''}`}
    ${fe.length ? `<div class="pfe">${fe.map((n) => `<span>${esc(n)}</span>`).join('')}</div>` : ''}</div></div>
    <div class="acts"><button data-a="v6like" data-i="${i}" class="${it.liked ? 'liked' : ''}" aria-pressed="${!!it.liked}" aria-label="Curtir">${v4ic('heart', 18)}${it.likes || ''}</button><button data-a="v6rp" data-i="${i}">${v4ic('reply', 18)}Responder${it.replies ? ` · ${it.replies}` : ''}</button><span class="sp"></span><button data-a="v6save" data-i="${i}" class="${saved ? 'saved' : ''}" aria-label="${saved ? 'Tirar dos salvos' : 'Salvar'}">${v4ic('save', 18)}</button><button data-a="v6send" data-i="${i}" aria-label="Enviar">${v4ic('send', 18)}</button></div></article>`;
}
function v6Paint() {
  const host = $('#lista > .v6host'); if (!host || S.tab !== 'comunidade') return; const R = host.shadowRoot.querySelector('.v6com'), S6 = v6S();
  if (!connected() || !socialProfile) { R.innerHTML = `<div class="msg">Entre na sua conta para ver e postar na Comunidade.</div>`; return; }
  // (Bia, 22/11) abas Amizades · Todos · Desafio · Ler junto · Salvos; Desafio e Ler junto têm tela própria (bloco i1)
  v6FixTab(); if (S6.f === 'desafio' || S6.f === 'junto') return v6PaintTab(R);
  const me = socialProfile, list = v6List(), Fd = v6Feed(v6Sc(S6.f)); S6.list = list;
  let last = '', posts = '';
  list.forEach((it, i) => { let d = ''; try { d = rdDayLbl(it.createdAt); } catch {} if (d && d !== last && S6.f !== 'salvos') { posts += `<div class="day">${esc(d)}</div>`; last = d; } posts += v6PostHTML(it, i); });
  const empty = S6.f === 'salvos' ? '<b>Nada salvo ainda</b><br>Toque no marcador de um post para guardar aqui.'
    : Fd.busy || !Fd.at ? 'Carregando a Comunidade…' : Fd.err ? 'Não consegui carregar agora. Puxe para atualizar ou tente de novo daqui a pouco.'
    : S6.f === 'amigos' ? (((SOC.fr && SOC.fr.friends) || []).length ? 'Suas amizades ainda não postaram. Veja <b>Todos</b> ou escreva o primeiro post.' : '<b>Aqui aparece o que suas amizades estão lendo</b><br>Encontre leitores para acompanhar, ou escreva o primeiro post sobre a sua leitura.')
    : 'Nada por aqui ainda. Que tal começar a conversa?';
  // estado vazio com o que fazer ali (Bia, 20/11: acabamento)
  const emptyActs = S6.f !== 'salvos' && !(Fd.busy || !Fd.at) && !Fd.err ? `<div class="macts"><button class="btn p" data-a="v6new">Escrever um post</button><button class="btn s" data-a="v6find">Encontrar leitores</button></div>` : '';
  const fil = S6.f !== 'salvos' && v6Fil(S6.f) !== 'tudo';
  R.innerHTML = `${S6.f === 'salvos' ? '' : `<div class="cbar"><span class="av" data-avh="${esc(me.handle)}" style="background-color:${friendColor(me.handle)}">${esc(initial(me.displayName || me.handle))}</span><button class="cin" data-a="v6new">Escreva sobre sua leitura…</button></div>`}
  ${v6TabsHTML()}${S6.f === 'salvos' ? '' : v6FilHTML()}
  ${list.length ? posts : fil && Fd.at && !Fd.busy && !Fd.err ? `<div class="msg"><b>Nada por aqui com esse filtro</b><br>Toque em <b>Tudo</b> para ver todos os posts${S6.f === 'amigos' ? ' das suas amizades' : ''}.</div>` : `<div class="msg">${empty}${emptyActs}</div>`}
  ${Fd.more && S6.f !== 'salvos' && list.length ? `<button class="more2" data-a="v6moreload">${Fd.busy ? 'Carregando…' : 'Ver mais'}</button>` : ''}`;
  try { paintCv(R); } catch {} try { rdLoadImages(R); } catch {}
  R.querySelectorAll('[data-avh]').forEach((n) => { try { const d = avatarOf(n.dataset.avh); if (d) { n.style.backgroundImage = `url("${d}")`; n.textContent = ''; } } catch {} });
}
function v6Click(ev) {
  const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a; if (!a.startsWith('v6')) return;
  ev.stopPropagation(); ev.preventDefault();
  const S6 = v6S(), it = b.dataset.i != null ? S6.list[+b.dataset.i] : null;
  if (a === 'v6tab') { S6.f = b.dataset.k; S6.desBk = null; S6.desWk = 0; v6FixTab(); const F = v6Feed(v6Sc(S6.f)); v6Paint(); if (S6.f !== 'salvos' && S6.f !== 'junto' && !F.busy && Date.now() - F.at > 20000) v6Load(v6Sc(S6.f)); return; }
  if (a === 'v6fil') { v6FilSet(S6.f, b.dataset.k); return v6Paint(); }
  if (a === 'v6new') return openRdComposer();
  if (a === 'v6find') { try { return addFriendSheet(); } catch { return; } }
  if (a === 'v6des') { S6.f = 'desafio'; return v6Paint(); }
  if (a === 'v6cfg') return rdFiltersSheet();
  if (a === 'v6moreload') return v6Load(v6Sc(S6.f), true);
  if (!it) return;
  const key = it.type + it.id;
  if (a === 'v6who') { const h = it.user && it.user.handle; if (!h) return; if (h === v6Me()) return goTab('eu'); return friendPage(h); }
  if (a === 'v6book' && it.book) return openAnyBook(it.book.title, it.book.author, it.book.cover);
  if (a === 'v6sp') { S6.open[key] = 1; return v6Paint(); }
  if (a === 'v6sph') { delete S6.open[key]; return v6Paint(); }
  if (a === 'v6rp') return openRdThread(it);
  if (a === 'v6send') return rdShareMenu(it, b);
  if (a === 'v6save') { const on = rdToggleSave(it); b.classList.toggle('saved', on); if (S6.f === 'salvos') v6Paint(); return; }
  if (a === 'v6like') { const on = !it.liked; [...new Set(v6All(it).concat([it]))].forEach((x) => { x.liked = on; x.likes = Math.max(0, (Number(x.likes) || 0) + (on ? 1 : -1)); }); it.likes = v6All(it)[0] ? v6All(it)[0].likes : it.likes;
    b.classList.toggle('liked', on); b.setAttribute('aria-pressed', on); b.innerHTML = v4ic('heart', 18) + (it.likes || '');
    const base = it.type === 'review' ? `/v1/reviews/${it.id}/like` : `/v1/posts/${it.id}/like`;
    sapi(on ? 'POST' : 'DELETE', base).then((r) => { if (r.status >= 300) toast('Não consegui agora'); }).catch(() => toast('Não consegui agora')); return; }
  if (a === 'v6more') { if (it.mine || (it.user && it.user.handle === v6Me())) return v6Sheet('v6my', { it }); return rdMenu(it, () => v6Paint(), b); }
}

// ---------- folhas (na camada V4, como o resto do app novo) ----------
function v6Sheet(k, ctx) { const st = v4State(); st.v6 = ctx || {}; st.sheet = k; v6Arm(v4Root()); v4Draw(); }
function v6SheetClose() { const st = v4State(); st.sheet = null; if (!st.view) v4Close(); else v4Draw(); }
function v6Arm(R) { if (!R) return R; try { const sr = R.getRootNode(); if (sr && sr.querySelector && !sr.querySelector('style[data-v6]')) { const st = document.createElement('style'); st.dataset.v6 = 1; st.textContent = V6CSS; sr.append(st); } } catch {} if (R.dataset.v6) return R; R.dataset.v6 = 1; R.addEventListener('click', v6V4Click, true); R.addEventListener('input', v6V4Input, true); return R; }
const v4SheetHTML_v6 = v4SheetHTML;
v4SheetHTML = function (k) {
  if (!String(k).startsWith('v6')) return v4SheetHTML_v6(k);
  const c = v4State().v6 || {}, it = c.it || {};
  if (k === 'v6my') { const post = it.type === 'post', v = it.visibility === 'friends' ? 'friends' : 'public';
    return `<h3>${post ? 'Seu post' : 'Sua avaliação'}</h3><div class="list"><button class="li" data-a="v6edit">${v4ic('pen', 20)}<span class="t">Editar<small>${post ? 'texto do post' : 'nota, emoções e comentário'}</small></span><span class="r">${v4ic('chev', 16)}</span></button></div>
    ${post ? `<div class="lbl">Quem vê</div><div class="seg"><button class="${v === 'public' ? 'on' : ''}" data-a="v6vis" data-k="public">Todos</button><button class="${v === 'friends' ? 'on' : ''}" data-a="v6vis" data-k="friends">Só amizades</button></div>
    <div class="list" style="margin-top:8px"><button class="li" data-a="v6spk">${v4ic('eye', 20)}<span class="t">${it.spoiler ? 'Tirar a marca de spoiler' : 'Marcar como spoiler'}<small>${it.spoiler ? 'volta a aparecer para todo mundo' : 'fica escondido para quem ainda não terminou o livro'}</small></span></button>` : '<div class="list" style="margin-top:8px">'}
    <button class="li dng" data-a="sheet" data-s="v6del">${v4ic('trash', 20)}<span class="t">${post ? 'Excluir post' : 'Excluir avaliação da Comunidade'}</span></button></div>`; }
  if (k === 'v6del') return `<h3>${it.type === 'post' ? 'Excluir este post?' : 'Excluir esta avaliação?'}</h3><p class="mut" style="margin:0 0 12px">${it.type === 'post' ? 'Ele sai do feed e do seu perfil, junto com as respostas. As curtidas também somem.' : 'Ela sai da Comunidade. A nota continua no seu livro.'}</p>
    <div class="row" style="gap:8px"><button class="btn s" style="flex:1" data-a="sheet" data-s="v6my">Voltar</button><button class="btn p" style="flex:1;background:#e2766b" data-a="v6delok">Excluir</button></div>`;
  if (k === 'v6edit') { const t = c.t != null ? c.t : v6Body(it.text);
    return `<h3>Editar post</h3><textarea class="v6ta" id="v6ta" maxlength="280">${esc(t)}</textarea><div class="v6cnt" id="v6cnt">${t.length}/280</div>
    <div class="row" style="gap:8px;margin-top:10px"><button class="btn s" style="flex:1" data-a="sheet" data-s="v6my">Voltar</button><button class="btn p" style="flex:1" data-a="v6editok">Salvar</button></div>`; }
  return '';
};
async function v6Patch(it, body) {
  try { const r = await sapi('PATCH', `/v1/posts/${it.id}`, body); if (r.status === 200 && r.data) { [...new Set(v6All(it).concat([it]))].forEach((x) => Object.assign(x, r.data, { mine: true })); return true; } } catch {}
  toast('Não consegui salvar agora'); return false;
}
function v6V4Click(ev) {
  const b = ev.target.closest('[data-a]'); const a = b && b.dataset.a;
  if (!a || !(a.startsWith('v6') || (a === 'sheet' && String(b.dataset.s).startsWith('v6')))) return;
  ev.stopPropagation();
  const st = v4State(), c = st.v6 || {}, it = c.it;
  if (a === 'sheet') { st.sheet = b.dataset.s; return v4Draw(); }
  if (!it) return v6SheetClose();
  if (a === 'v6edit') { if (it.type !== 'post') { v6SheetClose(); const le = lib().find((x) => x.id === it.libId) || lib().find((x) => it.book && normT(x.title) === normT(it.book.title)); try { if (le) return v4FimOpen(le); } catch {} return toast('Abra o livro para editar a avaliação'); } c.t = null; st.sheet = 'v6edit'; return v4Draw(); }
  if (a === 'v6editok') { const t = (st.v6.t != null ? st.v6.t : v6Body(it.text)).trim(); if (!t && !it.quote && !it.book2 && !it.hasImage) return toast('Escreva alguma coisa');
    const pre = String(it.text || '').match(/^(Debate semanal|Desafio da semana|Pergunta do dia):[^\n]*\n?/i); return v6Patch(it, { text: ((pre ? pre[0] : '') + t).slice(0, 280) }).then((ok) => { if (ok) { toast('Post editado'); v6SheetClose(); v6Paint(); } }); }
  if (a === 'v6vis') { const k = b.dataset.k; if (k === it.visibility) return; return v6Patch(it, { visibility: k }).then((ok) => { if (ok) { toast(k === 'friends' ? 'Agora só suas amizades veem' : 'Agora todo mundo vê'); v4Draw(); v6Paint(); } }); }
  if (a === 'v6spk') return v6Patch(it, { spoiler: it.spoiler ? null : { kind: 'yes' } }).then((ok) => { if (ok) { toast(it.spoiler ? 'Marcado como spoiler' : 'Marca de spoiler tirada'); v6SheetClose(); v6Paint(); } });
  if (a === 'v6delok') { (async () => {
      const r = it.type === 'review' ? await sapi('DELETE', `/v1/reviews/${encodeURIComponent(it.libId)}`) : await sapi('DELETE', `/v1/posts/${it.id}`);
      if (r.status < 300) { ['amigos', 'rede'].forEach((sc) => { const F = v6Feed(sc); F.items = F.items.filter((x) => !(x.type === it.type && x.id === it.id)); }); S.rd.items = (S.rd.items || []).filter((x) => !(x.type === it.type && x.id === it.id)); toast(it.type === 'post' ? 'Post excluído' : 'Avaliação excluída'); v6SheetClose(); v6Paint(); }
      else toast('Não consegui excluir agora'); })(); return; }
}
function v6V4Input(ev) { const t = ev.target; if (t && t.id === 'v6ta') { const st = v4State(); st.v6.t = t.value; const c = t.getRootNode().getElementById('v6cnt'); if (c) c.textContent = t.value.length + '/280'; } }

// ---------- Pergunta do dia (API /v1/qday) ----------
// a pergunta e o seu voto do dia ficam guardados no aparelho: o Hoje já abre com eles (reteste G4: abria com outra pergunta,
// sem voto e capas vazias, e trocava sozinho segundos depois). Sem nada guardado, o cartão espera a resposta em vez de chutar.
const V6QDK = 'lv.qday';
let V6QD = (() => { try { const c = JSON.parse(localStorage.getItem(V6QDK) || 'null'); return c && c.q && c.q.question && (c.q.weekEnd ? todayISO() <= c.q.weekEnd : c.d === todayISO()) ? c.q : null; } catch { return null; } })(), V6QDAt = 0, V6QDBusy = false;
const v6QdKeep = () => { try { if (V6QD && V6QD.question) localStorage.setItem(V6QDK, JSON.stringify({ d: todayISO(), q: V6QD })); } catch {} };
async function v6QdLoad(force) {
  if (!connected() || !socialProfile || V6QDBusy || (!force && Date.now() - V6QDAt < 10 * 60000)) return; V6QDBusy = true;
  // falha ou resposta sem pergunta também conta como tentativa (nova tentativa em 1 min): antes, cada redesenho pedia de novo e o Hoje e a página da pergunta entravam em laço
  let ok = false; const before = JSON.stringify(V6QD);
  try { const r = await sapi('GET', '/v1/qday'); if (r.status === 200 && r.data && r.data.question) { V6QD = r.data; ok = true; } } catch {} finally { V6QDBusy = false; V6QDAt = ok ? Date.now() : Date.now() - 9 * 60000; }
  if (ok) v6QdKeep(); else if (!V6QD) { V6QD = { failed: true }; } // sem resposta: usa a pergunta local (não fica esperando para sempre)
  if (JSON.stringify(V6QD) !== before) v6QdRefresh();
}
function v6QdRefresh() { try { if (S.tab === 'inicio' && typeof v2HojeEnsure === 'function') v2HojeEnsure(); } catch {} const st = v4State(); if (st.view === 'v6qday') v4Draw(); }
const v6QdRow = (x, tot, i, mine) => { const pc = tot ? Math.round(x.votes / tot * 100) : 0, me = mine && normT(mine.title) === normT(x.title);
  return `<div class="qr${me ? ' qme' : ''}"><span class="n">${i + 1}</span>${cvh(x.title, x.cover, '', 'width:30px;height:45px;font-size:6px;')}<span class="t"><b>${esc(x.title)}${me ? ' <em>seu voto</em>' : ''}</b><span class="bar"><i style="width:${pc}%"></i></span></span><span class="pc">${pc}%</span></div>`; };
// cartão do Hoje: antes de votar, capas para escolher; depois, top 3 com barras
v2QdayHTML = function () {
  v6QdLoad();
  let q0 = '', from = 'lidos'; try { [q0, from] = v2QOfDay(); } catch {}
  let Q = V6QD;
  // ainda sem resposta do servidor (nem guardada): reserva o lugar do cartão, sem mostrar uma pergunta que vai trocar
  try { if (!Q && connected() && socialProfile !== null) { if (!v2QdayHTML.t) v2QdayHTML.t = setTimeout(() => { v2QdayHTML.t = 0; v6QdLoad(); if (!V6QD && !V6QDBusy) { V6QD = { failed: true }; v6QdRefresh(); } }, 6000); return `<section class="v2-qd v6qd-wait" data-v2qd="1" aria-busy="true"><div class="k">${DEB.nome}</div><div class="q">&nbsp;</div><div class="qpicks" style="min-height:96px"></div><div class="qft"><span>&nbsp;</span></div></section>`; } } catch {}
  if (Q && Q.failed) Q = null;
  const q = (Q && Q.question) || q0;
  if (Q && Q.mine) return `<section class="v2-qd" data-v2qd="1"><div class="k">${DEB.nome}</div><div class="q">${esc(q)}</div><div class="v6ql">${(Q.top || []).map((x, i) => v6QdRow(x, Q.total, i, Q.mine)).join('')}</div>
    <div class="qft"><span>${Q.total} ${Q.total === 1 ? 'voto' : 'votos'} · você votou em <b>${esc(Q.mine.title)}</b></span><button type="button" data-q6go="1">Ver o debate ›</button></div></section>`;
  const bks = (() => { try { return v2QBooks(from); } catch { return []; } })();
  return `<section class="v2-qd" data-v2qd="1"><div class="k">${DEB.nome}</div><div class="q">${esc(q)}</div>
    ${v6QdPicks(bks)}
    <div class="qft"><span>${Q && Q.total ? Q.total + (Q.total === 1 ? ' voto até agora' : ' votos até agora') : 'Vote e veja o resultado'}</span><button type="button" data-q6go="1">Ver o debate ›</button></div></section>`;
};
// capas para votar (Hoje e aba Debate): as sugeridas + "Outro livro" com busca; a do seu voto fica marcada
function v6QdPicks(bks, mine) { const mk = mine ? normT(mine.title || '') : '';
  return `<div class="qpicks">${bks.map((e) => { const on = mk && normT(e.title) === mk; return `<button type="button" data-qb="${esc(e.id)}"${on ? ' class="on" aria-pressed="true"' : ''}>${cvh(e.title, e.cover, 'qcv')}<span>${esc(e.title)}</span></button>`; }).join('')}<button type="button" class="o" data-qb=""><span class="qcv qo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><span>Outro livro</span></button></div>`; }
async function v6Vote(book) {
  if (!connected() || !socialProfile) return toast('Entre na sua conta para votar');
  try { const r = await sapi('POST', '/v1/qday/vote', { book: { title: String(book.title).slice(0, 300), author: book.author ? String(book.author).slice(0, 300) : null, cover: /^https:\/\//.test(book.cover || '') ? String(book.cover).slice(0, 2000) : null } });
    if (r.status === 200 && r.data && r.data.question) { V6QD = r.data; V6QDAt = Date.now(); v6QdKeep(); toast('Voto registrado'); v6QdRefresh(); return; }
    toast(r.status === 403 ? 'Sua conta não pode votar agora' : 'Não consegui votar agora'); } catch { toast('Não consegui votar agora'); }
}
v2QAnswer = function (id) {
  const e = id ? lib().find((x) => String(x.id) === String(id)) : null;
  if (e) return v6Vote({ title: e.title, author: e.author, cover: e.cover });
  try { findBook('Votar em qual livro?', (x) => v6Vote({ title: x.title, author: x.author, cover: x.cover })); } catch { toast('Busca indisponível agora'); }
};
TR.addEventListener('click', (ev) => { const g = ev.target.closest && ev.target.closest('[data-q6go]'); if (!g) return; ev.stopPropagation(); v6QdayOpen(); }, true);
{ const st = document.createElement('style'); st.textContent = `.v2-qd .v6ql{display:grid;gap:8px}
.v2-qd .qr{display:grid;grid-template-columns:16px 30px 1fr auto;gap:10px;align-items:center}.v2-qd .qr .n{font-weight:900;color:var(--ink-2);font-size:13px;text-align:center}
.v2-qd .qr .cv{width:30px!important;height:45px!important;border-radius:3px 5px 5px 3px}.v2-qd .qr .t{display:grid;gap:5px;min-width:0}.v2-qd .qr .t b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v2-qd .qr .t em{font-style:normal;font-size:10.5px;font-weight:900;color:var(--acc);margin-left:4px}.v2-qd .qr .bar{height:6px;border-radius:9px;background:color-mix(in srgb,var(--ink) 8%,var(--panel));overflow:hidden}
.v2-qd .qr .bar i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#e9a35c,#c46f2e)}.v2-qd .qr .pc{font-size:12px;font-weight:900;color:var(--ink-2)}
.v2-qd .qr.qme .t b{color:var(--acc)}`; TR.append(st); }
// página "Mais votados"
let V6TOP = null;
let V6HIST = null;
async function v6QdayOpen() {
  const st = v4State(); st.view = 'v6qday'; st.sheet = null; v6Arm(v4Root()); v4Draw();
  v6QdLoad(true);
  try { const r = await sapi('GET', '/v1/qday/top?limit=20'); if (r.status === 200 && r.data && Array.isArray(r.data.items)) V6TOP = r.data; } catch {}
  try { const h = await sapi('GET', '/v1/qday/history?days=7'); if (h.status === 200 && h.data && Array.isArray(h.data.items)) V6HIST = h.data.items; } catch {}
  if (v4State().view === 'v6qday') v4Draw();
}
const v4Draw_v6 = v4Draw;
v4Draw = function () {
  const st = v4State(); if (st.view !== 'v6qday') return v4Draw_v6.apply(this, arguments);
  const R = v6Arm(v4Root()), Q = V6QD || {}, T = V6TOP || { items: [], total: Q.total || 0 }, voted = !!Q.mine;
  let q0 = '', from = 'lidos'; try { [q0, from] = v2QOfDay(); } catch {}
  const bks = (() => { try { return v2QBooks(from); } catch { return []; } })();
  const sh = st.sheet ? `<div class="veil" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${v4SheetHTML(st.sheet)}</div>` : '';
  R.innerHTML = `<section class="page v6q"><header class="top"><button class="ib" data-a="v6qx" aria-label="Voltar">${v4ic('back')}</button><h1 style="font-size:20px">${DEB.nome}</h1></header><div class="scr">
    <div class="card qhead"><div class="eb acc">Pergunta da semana</div><h3>${esc(Q.question || q0)}</h3><span class="mut">${T.total || 0} ${(T.total || 0) === 1 ? 'voto' : 'votos'} · ${typeof v6DesLeft === 'function' ? v6DesLeft() : 'até domingo'}</span></div>
    ${voted ? '' : `<div class="card ph" style="margin-top:10px"><b>Vote para ver o resultado</b><div class="qpk">${bks.map((e) => `<button data-a="v6qv" data-id="${esc(e.id)}">${cvh(e.title, e.cover)}<span>${esc(e.title)}</span></button>`).join('')}<button class="o" data-a="v6qv" data-id=""><span class="cv">${v4ic('busca', 22)}</span><span>Outro livro</span></button></div></div>`}
    <div class="h2">Mais votados</div>
    <div class="card qlist">${!T.items.length ? '<p class="mut" style="margin:0">Ninguém votou ainda. Seja a primeira pessoa.</p>' : voted ? T.items.map((x, i) => v6QdRow(x, T.total, i, Q.mine)).join('') : T.items.slice(0, 3).map((x, i) => `<div class="qr"><span class="n">${i + 1}</span>${cvh(x.title, x.cover, '', 'width:30px;height:45px;font-size:6px;filter:blur(3px)')}<span class="t"><b class="mut">resultado depois do seu voto</b></span></div>`).join('')}</div>
    ${(() => { const C = Q.comments || { total: 0, items: [] }; return '<div class="h2">O que estão dizendo' + (C.total > C.items.length ? ' <small><button data-a="v6qall">Ver os ' + C.total + '</button></small>' : '') + '</div><div class="card qcom">' + (C.items.length ? C.items.map((c) => '<p><b>' + esc(String(c.name).split(' ')[0]) + '</b> ' + esc(c.text) + '</p>').join('') : '<p class="mut" style="margin:0 0 10px">Ninguém comentou ainda. Conte por que escolheu esse livro: o post vai para a Comunidade com a pergunta.</p>') + '<button class="btn s w" data-a="v6qc">Comentar</button></div>'; })()}
    ${(() => { const H = (V6HIST || []).filter((x) => x.total); if (!H.length) return ''; const dn = (d) => { const t = new Date(d + 'T12:00:00'), y = new Date(); y.setDate(y.getDate() - 1); return t.toDateString() === y.toDateString() ? 'Ontem' : ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][t.getDay()]; }; return '<div class="h2">Perguntas anteriores</div><div class="list card" style="padding:4px 12px">' + H.map((x) => '<div class="li"><span class="t">' + esc(x.question) + '<small>' + dn(x.day) + ' · venceu ' + esc(x.winner.title) + ' com ' + x.winner.pct + '% · ' + x.total + (x.total === 1 ? ' voto' : ' votos') + '</small></span></div>').join('') + '</div>'; })()}
  </div></section>${sh}`;
  try { paintCv(R); } catch {}
};
{ const prev = v6V4Click; v6V4Click = function (ev) {
    const b = ev.target.closest('[data-a]'); const a = b && b.dataset.a;
    if (a === 'v6qx') { ev.stopPropagation(); const st = v4State(); st.view = null; st.sheet = null; return v4Close(); }
    if (a === 'v6qv') { ev.stopPropagation(); const id = b.dataset.id; if (id) { const e = lib().find((x) => String(x.id) === String(id)); if (e) return v6Vote({ title: e.title, author: e.author, cover: e.cover }).then(() => v6QdayOpen()); }
      try { return findBook('Votar em qual livro?', (x) => v6Vote({ title: x.title, author: x.author, cover: x.cover }).then(() => v6QdayOpen())); } catch { return; } }
    if (a === 'v6qall') { ev.stopPropagation(); const st = v4State(); st.view = null; v4Close(); try { v6S().f = 'todos'; } catch {} return goTab('comunidade'); }
    if (a === 'v6qc') { ev.stopPropagation(); const q = (V6QD && V6QD.question) || ''; const st = v4State(); st.view = null; v4Close(); return openRdComposer({ kind: 'comment', text: `${DEB.nome}: ${q}\n` }); }
    return prev.apply(this, arguments);
  }; }
