// Enquetes (Bia, 21/11; API migração 040): no Novo post, "Pergunta" vira "Enquete" (2 a 4 opções de texto ou livro, prazo
// opcional). No feed e na conversa da leitura conjunta, as opções viram barras: tocar vota; depois do voto aparecem % e
// contagem; dá para trocar ou tirar o voto enquanto está aberta; encerrada mostra a vencedora. Na leitura conjunta,
// "Votar o próximo livro" cria uma enquete de livros na conversa. Tudo por fora do bloco 36 (composer e cartão): rótulos e
// campos entram pelo DOM e a enquete vai junto no POST pelo embrulho do sapi.
const LVP_CSS = `
.lvpl{margin:.55rem 0 .2rem;display:grid;gap:.4rem}
.lvpl-q{font-weight:800;font-size:.95rem}
.lvpl .lvpl-o{position:relative!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:.55rem!important;min-height:44px;width:100%!important;margin:0!important;padding:.45rem .7rem!important;border:1px solid var(--line)!important;border-radius:12px!important;background:var(--panel)!important;color:var(--ink)!important;font:inherit;text-align:left;cursor:pointer;overflow:hidden;box-shadow:none}
.lvpl-o[disabled]{cursor:default}
.lvpl .lvpl-o .bar{position:absolute!important;inset:0 auto 0 0!important;height:auto!important;margin:0!important;border-radius:0!important;width:0;background:color-mix(in srgb,var(--acc) 22%,transparent);transition:width .5s ease;pointer-events:none}
.lvpl .lvpl-o.me{border-color:var(--acc)!important}.lvpl .lvpl-o.win{border-color:var(--acc)!important;box-shadow:0 0 0 1px var(--acc) inset}
.lvpl .lvpl-o>*:not(.bar){position:relative}.lvpl-o .cv{width:26px;height:39px;flex:none;border-radius:4px}
.lvpl-o .lb{flex:1;min-width:0;font-weight:700;font-size:.9rem;line-height:1.25}.lvpl-o .lb small{display:block;font-weight:600;color:var(--ink-2);font-size:.75rem}
.lvpl .lvpl-o .pc{flex:none;font-weight:900;font-size:.85rem;color:var(--acc)}
.lvpl-f{display:flex;flex-wrap:wrap;gap:.3rem .8rem;align-items:center;font-size:.78rem;color:var(--ink-2);font-weight:700}
.lvpl-f button{background:none;border:0;padding:.35rem 0;min-height:32px;color:var(--acc);font:inherit;font-weight:800;cursor:pointer;text-decoration:underline}
.lvpl-w{font-size:.82rem;font-weight:800;color:var(--acc)}
.lvpl-ed{display:grid;gap:.45rem;margin:.4rem 0}
.lvpl-ed .row{display:flex;gap:.4rem;align-items:center}
.lvpl-ed input[type=text]{flex:1;min-width:0;min-height:44px;padding:.5rem .7rem;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit}
.lvpl-ed .bk{flex:1;min-width:0;display:flex;gap:.5rem;align-items:center;min-height:44px;padding:.3rem .6rem;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.lvpl-ed .bk .cv{width:24px;height:36px;border-radius:4px;flex:none}.lvpl-ed .bk b{font-size:.85rem;flex:1;min-width:0}
.lvpl-ed .ib{flex:none;min-width:44px;min-height:44px;border:1px solid var(--line);border-radius:12px;background:none;color:var(--ink);font:inherit;font-weight:800;cursor:pointer;padding:0 .6rem}
.lvpl-ed .add{justify-self:start;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;min-height:40px;cursor:pointer}
.lvpl-ed .dur{display:flex;flex-wrap:wrap;gap:.35rem}.lvpl-ed .dur button{min-height:36px;padding:0 .8rem;border:1px solid var(--line);border-radius:99px;background:none;color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.lvpl-ed .dur button.on{border-color:var(--acc);color:var(--acc)}
.lvpl-ed .sug{display:flex;flex-wrap:wrap;gap:.35rem}.lvpl-ed .sug button{min-height:36px;padding:0 .7rem;border:1px dashed var(--line);border-radius:99px;background:none;color:var(--ink-2);font:inherit;font-size:.8rem;font-weight:700;cursor:pointer}
.lvpl-modal{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.5);display:grid;align-items:end}
.lvpl-modal>div{background:var(--bg,var(--panel));color:var(--ink);border-radius:20px 20px 0 0;padding:1rem max(16px,env(safe-area-inset-right,0px)) calc(1rem + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px));max-height:88vh;overflow:auto;max-width:560px;width:100%;margin:0 auto}
.lvpl-modal h3{margin:.1rem 0 .3rem;font-size:1.15rem}.lvpl-modal .go{width:100%;min-height:48px;border:0;border-radius:14px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;margin-top:.6rem;cursor:pointer}
.lvpl-modal .cx{width:100%;min-height:44px;border:0;background:none;color:var(--ink-2);font:inherit;font-weight:800;cursor:pointer}
.bj-poll{margin:.4rem 0 .2rem;min-height:40px;padding:0 .9rem;border:1px solid var(--acc);border-radius:99px;background:none;color:var(--acc);font:inherit;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:.4rem}
@media (prefers-reduced-motion: reduce){.lvpl-o .bar{transition:none}}
`;
{ const st = document.createElement('style'); st.textContent = LVP_CSS; TR.append(st); }

const PL_CACHE = {}; // pollId -> poll (o que veio da API por último)
const PL_FRESH = {}; // pollId -> resposta do voto (vale sobre listas antigas na memória ao redesenhar)
const plCur = (p) => (p && PL_FRESH[p.id]) || p;
let plPending = null;  // enquete a anexar no próximo POST (post ou conversa)
const plDurs = [['1d', '1 dia', 864e5], ['3d', '3 dias', 3 * 864e5], ['7d', '1 semana', 7 * 864e5], ['0', 'Sem prazo', 0]];
const plCloses = (k) => { const d = plDurs.find((x) => x[0] === k); return d && d[2] ? new Date(Date.now() + d[2]).toISOString() : null; };
const plLeft = (iso) => { const ms = new Date(iso).getTime() - Date.now(); if (ms <= 0) return 'encerrada'; const h = Math.round(ms / 36e5); return h < 24 ? `encerra em ${Math.max(1, h)} h` : `encerra em ${Math.round(h / 24)} ${Math.round(h / 24) === 1 ? 'dia' : 'dias'}`; };
const plOptsOk = (opts) => opts.filter((o) => o.book || String(o.label || '').trim()).map((o) => o.book ? { book: o.book } : { label: String(o.label).trim().slice(0, 120) });

function plHTML(p) {
  if (!p || !p.options) return '';
  PL_CACHE[p.id] = p;
  const show = !!p.showResults, open = !p.closed;
  const total = p.total || 0;
  const opt = (o) => {
    const me = p.myVote === o.id, pct = show ? (o.pct || 0) : 0;
    const lb = o.book ? `${cvh(o.book.title, o.book.cover)}<span class="lb">${esc(o.book.title)}${o.book.author ? `<small>${esc(o.book.author)}</small>` : ''}</span>` : `<span class="lb">${esc(o.label)}</span>`;
    return `<button type="button" class="lvpl-o${me ? ' me' : ''}${o.winner ? ' win' : ''}" data-pv="${esc(p.id)}" data-po="${esc(o.id)}" aria-pressed="${me}"${open ? '' : ' disabled'} aria-label="${esc(o.book ? o.book.title : o.label)}${show ? ` · ${pct}%` : ''}${me ? ' · seu voto' : ''}">
      ${show ? `<span class="bar" style="width:${pct}%"></span>` : ''}${lb}${show ? `<span class="pc">${pct}%</span>` : ''}</button>`;
  };
  const win = p.closed && p.options.find((o) => o.winner);
  const foot = [show ? `${total} ${total === 1 ? 'voto' : 'votos'}` : 'Toque para votar', p.closesAt ? plLeft(p.closesAt) : (open ? 'sem prazo' : 'encerrada')];
  return `<div class="lvpl" data-poll="${esc(p.id)}">${p.question ? `<div class="lvpl-q">${esc(p.question)}</div>` : ''}${p.options.map(opt).join('')}
    ${win ? `<div class="lvpl-w">Mais votado: ${esc(win.book ? win.book.title : win.label)}</div>${win.book ? `<div class="lvpl-f"><button type="button" data-pladd="${esc(p.id)}">Adicionar ao Quero ler</button></div>` : ''}` : ''}
    <div class="lvpl-f"><span>${foot.join(' · ')}</span>${open && p.myVote ? `<button type="button" data-plun="${esc(p.id)}">Tirar meu voto</button>` : ''}${open && p.mine ? `<button type="button" data-plend="${esc(p.id)}">Encerrar agora</button>` : ''}</div></div>`;
}
const plRoots = () => { const r = [TR]; TR.querySelectorAll('.v6host').forEach((h) => { if (h.shadowRoot) r.push(h.shadowRoot); }); return r; };
const plRefresh = (p) => { PL_CACHE[p.id] = p; PL_FRESH[p.id] = p; plRoots().forEach((root) => root.querySelectorAll(`.lvpl[data-poll="${CSS.escape(p.id)}"]`).forEach((n) => { const t = document.createElement('div'); t.innerHTML = plHTML(p); n.replaceWith(t.firstElementChild); try { paintCv(root); } catch {} }));
  try { (S.rd && S.rd.items || []).forEach((it) => { if (it.poll && it.poll.id === p.id) it.poll = p; }); } catch {} };
TR.addEventListener('click', async (ev) => {
  const b = ev.composedPath().find((n) => n instanceof Element && n.matches('[data-pv],[data-plun],[data-plend],[data-pladd]')); if (!b) return;
  ev.stopPropagation(); ev.preventDefault();
  if (b.dataset.pladd) { const p = PL_CACHE[b.dataset.pladd]; const w = p && p.options.find((o) => o.winner); if (w && w.book) { try { addToLibrary({ title: w.book.title, author: w.book.author || null, cover: w.book.cover || null }, null, 'QUERO'); toast('Foi para o seu Quero ler'); } catch {} } return; }
  if (b.dataset.plend) return sheet('Encerrar a enquete agora?', [['Encerrar', async () => { const r = await sapi('POST', `/v1/polls/${b.dataset.plend}/close`); if (r.status === 200 && r.data) plRefresh(r.data); else toast('Não consegui agora'); }], ['Cancelar', () => {}]]);
  const id = b.dataset.pv || b.dataset.plun; if (b.dataset.busy) return; b.dataset.busy = '1';
  try {
    const r = b.dataset.plun ? await sapi('DELETE', `/v1/polls/${id}/vote`) : await sapi('POST', `/v1/polls/${id}/vote`, { optionId: b.dataset.po });
    if (r.status === 200 && r.data) plRefresh(r.data); else toast(r.status === 409 ? 'Esta enquete já encerrou' : 'Não consegui votar agora');
  } catch { toast('Não consegui votar agora'); } finally { delete b.dataset.busy; }
}, true);

// ---------- feed: o cartão do post leva a enquete ----------
{ const _rc = rdCardHTML; rdCardHTML = function (it) {
  let h = _rc.apply(this, arguments);
  if (!it || !it.poll) return h;
  h = h.replace(/(<span class="rd-tag[^"]*">)Pergunta(<\/span>)/, '$1Enquete$2');
  const covered = it.spoiler && !it.mine && !(S.rdOpen && S.rdOpen.has(it.type + it.id));
  const block = covered ? '<p class="lvpl-f">Enquete coberta pelo spoiler. Abra o post para votar.</p>' : plHTML(plCur(it.poll));
  const i = h.lastIndexOf('<footer'); return i > 0 ? h.slice(0, i) + block + h.slice(i) : h.replace(/<\/article>\s*$/, block + '</article>');
}; }

// ---------- editor de opções (composer e leitura conjunta) ----------
function plEditorHTML(E, sug) {
  const row = (o, i) => `<div class="row">${o.book ? `<div class="bk">${cvh(o.book.title, o.book.cover)}<b>${esc(o.book.title)}</b></div>` : `<input type="text" maxlength="120" data-plopt="${i}" placeholder="Opção ${i + 1}" value="${esc(o.label || '')}" aria-label="Opção ${i + 1}">`}
    <button type="button" class="ib" data-plbk="${i}" aria-label="${o.book ? 'Trocar o livro' : 'Escolher um livro'}">${o.book ? 'Trocar' : 'Livro'}</button>${E.opts.length > 2 ? `<button type="button" class="ib" data-plrm="${i}" aria-label="Tirar a opção ${i + 1}">×</button>` : ''}</div>`;
  return `<div class="lvpl-ed">${E.opts.map(row).join('')}${E.opts.length < 4 ? '<button type="button" class="add" data-pladdopt>+ Outra opção</button>' : ''}
    ${sug && sug.length ? `<div class="rdc2-l">Do seu Quero ler</div><div class="sug">${sug.map((e, i) => `<button type="button" data-plsug="${i}">${esc(e.title)}</button>`).join('')}</div>` : ''}
    <div class="rdc2-l">Prazo</div><div class="dur">${plDurs.map(([k, n]) => `<button type="button" data-pldur="${k}" class="${E.dur === k ? 'on' : ''}" aria-pressed="${E.dur === k}">${n}</button>`).join('')}</div></div>`;
}
function plBindEditor(root, E, redraw, sug) {
  root.querySelectorAll('[data-plopt]').forEach((x) => x.addEventListener('input', () => { E.opts[+x.dataset.plopt].label = x.value; }));
  root.querySelectorAll('[data-plbk]').forEach((x) => x.addEventListener('click', () => rdPickBook('Escolha o livro', (bk) => { const o = E.opts[+x.dataset.plbk]; o.book = bk; o.label = bk.title; redraw(); })));
  root.querySelectorAll('[data-plrm]').forEach((x) => x.addEventListener('click', () => { E.opts.splice(+x.dataset.plrm, 1); redraw(); }));
  root.querySelector('[data-pladdopt]')?.addEventListener('click', () => { if (E.opts.length < 4) E.opts.push({ label: '', book: null }); redraw(); });
  root.querySelectorAll('[data-pldur]').forEach((x) => x.addEventListener('click', () => { E.dur = x.dataset.pldur; redraw(); }));
  root.querySelectorAll('[data-plsug]').forEach((x) => x.addEventListener('click', () => { const e = sug[+x.dataset.plsug]; const bk = { title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: (typeof smallCoverOk === 'function' ? smallCoverOk(e.cover) : null) || null };
    let slot = E.opts.find((o) => !o.book && !String(o.label || '').trim()); if (!slot) { if (E.opts.length >= 4) return toast('Até 4 opções'); slot = { label: '', book: null }; E.opts.push(slot); } slot.book = bk; slot.label = bk.title; redraw(); }));
  try { paintCv(root); } catch {}
}

// ---------- Novo post: "Pergunta" vira "Enquete" ----------
let PE = null;
{ const _o = openRdComposer; openRdComposer = function () { PE = { opts: [{ label: '', book: null }, { label: '', book: null }], dur: '3d' }; return _o.apply(this, arguments); }; }
const plComposer = () => {
  const box = TR.querySelector('#shelflist:not([hidden]) .rdc2'); if (!box || !PE) return;
  const t = box.querySelector('.rdc2-t[data-t=question]');
  if (t && !t.dataset.pl) { t.dataset.pl = '1'; t.innerHTML = '<span><i class=v3e data-i=ask></i></span>Enquete'; t.setAttribute('aria-label', 'Enquete'); }
  const on = t && t.classList.contains('on');
  const hint = box.querySelector('.rdc2-hint'); if (on && hint && !hint.dataset.pl) { hint.dataset.pl = '1'; hint.textContent = 'Enquete: 2 a 4 opções. Quem vê o post vota; o resultado aparece depois do voto.'; }
  const ta = box.querySelector('#rdc-t'); if (on && ta && ta.placeholder !== 'Qual é a pergunta?') ta.placeholder = 'Qual é a pergunta?';
  let ed = box.querySelector('.lvpl-host');
  if (!on) { if (ed) ed.remove(); return; }
  if (!ed) { ed = document.createElement('div'); ed.className = 'lvpl-host'; (hint || box.querySelector('.rdc2-tools')).after(ed); }
  const draw = () => { ed.innerHTML = plEditorHTML(PE); plBindEditor(ed, PE, draw); };
  if (!ed.dataset.on) { ed.dataset.on = '1'; draw(); }
};
new MutationObserver(() => plComposer()).observe(TR, { childList: true, subtree: true });
// antes do Publicar: enquete precisa de 2 opções; guarda para anexar no POST
TR.addEventListener('click', (ev) => {
  const go = ev.target.closest && ev.target.closest('#rdc-go'); if (!go || !PE) return;
  const t = TR.querySelector('#shelflist:not([hidden]) .rdc2 .rdc2-t[data-t=question]'); if (!t || !t.classList.contains('on')) { plPending = null; return; }
  const opts = plOptsOk(PE.opts);
  if (opts.length < 2) { ev.stopPropagation(); ev.preventDefault(); return toast('Coloque pelo menos 2 opções na enquete'); }
  plPending = { kind: 'post', poll: { options: opts, closesAt: plCloses(PE.dur) } };
}, true);
{ const _s = sapi; sapi = async function (method, path, body) {
  if (method === 'POST' && plPending && body && typeof body === 'object') {
    if (plPending.kind === 'post' && path === '/v1/posts' && body.kind === 'question') { body = { ...body, poll: plPending.poll }; plPending = null; }
    else if (plPending.kind === 'buddy' && /^\/v1\/buddies\/[^/]+\/posts$/.test(path) && !body.parentId) { body = { ...body, poll: plPending.poll }; plPending = null; }
  }
  const r = await _s.call(this, method, path, body);
  // conversa da leitura conjunta: guarda as enquetes que vieram para desenhar nas mensagens
  try { if (method === 'GET' && /^\/v1\/buddies\/[^/]+\/posts$/.test(path) && r && r.data && r.data.items) r.data.items.forEach((c) => { if (c.poll) { PL_CACHE[c.poll.id] = c.poll; PL_BY_MSG[c.id] = c.poll.id; } }); } catch {}
  return r;
}; }

// ---------- leitura conjunta: enquete na conversa e "Votar o próximo livro" ----------
const PL_BY_MSG = {};
const plBuddy = () => {
  const v = TR.querySelector('#shelflist:not([hidden])'); if (!v || !v.querySelector('.bj-compose')) return;
  v.querySelectorAll('[data-c]').forEach((m) => { const pid = PL_BY_MSG[m.dataset.c]; if (!pid || m.querySelector(':scope > .lvpl')) return;
    const p = plCur(PL_CACHE[pid]); if (!p) return; const t = document.createElement('div'); t.innerHTML = plHTML(p); const anchor = m.querySelector(':scope > p') || m.querySelector('header'); if (anchor) anchor.after(t.firstElementChild); try { paintCv(m); } catch {} });
  const cp = v.querySelector('.bj-compose'); if (cp && !cp.querySelector('.bj-poll') && cp.querySelector('.bj-send')) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bj-poll'; b.innerHTML = '<i class=v3e data-i=ask></i>Votar o próximo livro'; cp.prepend(b);
    b.addEventListener('click', () => plBuddyEditor(v));
  }
};
new MutationObserver(() => plBuddy()).observe(TR, { childList: true, subtree: true });
function plBuddyEditor(v) {
  const sug = lib().filter((e) => e.status === 'QUERO' && e.title).slice(0, 6);
  const E = { opts: [{ label: '', book: null }, { label: '', book: null }], dur: '3d' };
  const m = document.createElement('div'); m.className = 'lvpl-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-label', 'Votar o próximo livro');
  const close = () => m.remove();
  const draw = () => { m.innerHTML = `<div><h3>Votar o próximo livro</h3><p class="rdc2-hint">Escolha de 2 a 4 livros. Quem participa da leitura vota na conversa.</p><div class="lvpl-host"></div><button type="button" class="go">Criar enquete</button><button type="button" class="cx">Cancelar</button></div>`;
    const host = m.querySelector('.lvpl-host'); const inner = () => { host.innerHTML = plEditorHTML(E, sug); plBindEditor(host, E, inner, sug); }; inner();
    m.querySelector('.cx').addEventListener('click', close);
    m.querySelector('.go').addEventListener('click', () => {
      const opts = plOptsOk(E.opts); if (opts.length < 2) return toast('Coloque pelo menos 2 livros');
      const inp = v.querySelector('#bj-txt'), fm = v.querySelector('.bj-send'); if (!inp || !fm) return toast('Não consegui agora');
      plPending = { kind: 'buddy', poll: { question: 'Qual lemos a seguir?', options: opts, closesAt: plCloses(E.dur) } };
      inp.value = 'Qual lemos a seguir? Vote na enquete.'; close();
      fm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }); };
  m.addEventListener('click', (ev) => { if (ev.target === m) close(); });
  m.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });
  draw(); TR.append(m); setTimeout(() => m.querySelector('input,button')?.focus(), 30);
}

// Comunidade v4 (feed em shadow root próprio): o cartão leva a enquete e o estilo entra no shadow root
if (typeof v6PostHTML === 'function') { const _v = v6PostHTML; v6PostHTML = function (it) {
  let h = _v.apply(this, arguments); if (!it || !it.poll) return h;
  h = h.replace('Perguntou', 'Fez uma enquete');
  const covered = h.includes('class="spz"');
  const block = covered ? '<p class="lvpl-f">Enquete coberta pelo spoiler. Abra o post para votar.</p>' : plHTML(plCur(it.poll));
  const i = h.lastIndexOf('<div class="acts">'); return i > 0 ? h.slice(0, i) + block + h.slice(i) : h;
}; }
if (typeof v6Paint === 'function') { const _p = v6Paint; v6Paint = function () { const r = _p.apply(this, arguments);
  try { TR.querySelectorAll('.v6host').forEach((h) => { const sr = h.shadowRoot; if (sr && !sr.querySelector('style[data-lvp]')) { const st = document.createElement('style'); st.dataset.lvp = '1'; st.textContent = LVP_CSS; sr.append(st); } if (sr) try { paintCv(sr); } catch {} }); } catch {}
  return r; }; }
