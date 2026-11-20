// Aba Amigos da Comunidade com o mesmo cartão da Comunidade (Bia, 17/11): os avisos automáticos dos amigos (começou, avançou,
// terminou, conquista), as avaliações e os posts que os amigos escreveram, numa lista só, por data e separada por dia,
// com os mesmos filtros (Tudo · Lendo · Avaliações · Salvos). O "Em alta" sai daqui. Os dados vêm do feed antigo (SOC.feed),
// que continua sendo carregado por baixo, e dos posts da Comunidade (S.rd.items) feitos por amigos.
{ const st = document.createElement('style'); st.textContent = `
#lista.am-on > *:not(.rd-seg):not(#am-host):not(.gtop-sp):not(.cm-new):not(.cm-row){display:none!important}
#am-host{display:grid;gap:.7rem}
.rd-ach{display:grid;grid-template-columns:64px minmax(0,1fr);gap:.8rem;align-items:center;padding:.6rem 0 .5rem}
.rd-ach img{width:64px;height:64px;object-fit:contain;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))}
.rd-ach b{display:block;font-size:1rem}.rd-ach small{display:block;font-size:.78rem;color:var(--ink-2);font-weight:700;margin-top:.1rem}
`; TR.append(st); }
function amItems() {
  const fr = new Set(((SOC.fr && SOC.fr.friends) || []).map((f) => String(f.handle || '').toLowerCase()));
  const me = socialProfile && socialProfile.handle ? String(socialProfile.handle).toLowerCase() : '';
  const out = [], seen = new Set(), add = (x) => { const k = x.type + x.id; if (seen.has(k)) return; seen.add(k); out.push(x); };
  let feed = []; try { feed = mergeFeed(SOC.feed || []); } catch { feed = SOC.feed || []; }
  feed.forEach((p) => {
    const user = p.user || (p.mine && socialProfile ? { handle: socialProfile.handle, displayName: socialProfile.displayName || NAME } : {});
    const book = { title: p.title, author: p.author || null, cover: p.cover || null, key: normT(p.title || '') };
    if (p.type === 'achievement') return add({ type: 'achievement', id: p.id, name: p.name, reward: p.reward, user: p.user || user, mine: p.mine, createdAt: p.updatedAt });
    if (p.type === 'buddy_done') return;
    if (p.type === 'activity') return add({ type: 'activity', id: p.id, act: p.kind, book, user, mine: p.mine, createdAt: p.updatedAt, readerPct: p.kind === 'FINISHED' ? 100 : p.kind === 'STARTED' ? 0 : p.pct != null ? Number(p.pct) : null, pages: p.pages });
    add({ type: 'review', id: p.id, libId: p.libId, text: p.text, paws: p.paws, book, user, mine: p.mine, createdAt: p.updatedAt || p.createdAt, likes: p.likes, liked: p.liked, replies: p.comments, spoiler: p.spoiler ? (typeof p.spoiler === 'object' ? p.spoiler : { kind: 'yes' }) : null });
  });
  (S.rd.items || []).forEach((it) => { const h = String((it.user && it.user.handle) || '').toLowerCase(); if (h && (fr.has(h) || h === me)) add(it); });
  return rdVisible(out).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
function paintAmigos() {
  const box = $('#lista'); if (!box || S.tab !== 'comunidade') return;
  let host = box.querySelector('#am-host'); if (!host) { host = document.createElement('div'); host.id = 'am-host'; const seg = box.querySelector('.rd-seg'); if (seg) (seg.closest('.cm-row') || seg).after(host); else box.prepend(host); }
  if (host.parentElement && host.parentElement.classList.contains('cm-row')) host.parentElement.after(host);
  if (!connected() || !socialProfile) { host.innerHTML = '<p class="rd-empty">Entre na sua conta para ver as novidades dos seus amigos.</p>'; return; }
  const F = S.rdF || 'tudo', base = F === 'salvos' ? rdSavedList().map((x) => x.it) : amItems();
  const list = F === 'lendo' ? base.filter((x) => x.type !== 'review' && x.type !== 'achievement') : F === 'aval' ? base.filter((x) => x.type === 'review') : base;
  const loading = !Array.isArray(SOC.feed) || !S.feedAt;
  host.innerHTML = `<div class="rd-fl">${[['tudo', 'Tudo'], ['lendo', 'Lendo'], ['aval', 'Avaliações'], ['salvos', 'Salvos']].map(([k, n]) => `<button type="button" data-f="${k}" class="${F === k ? 'on' : ''}">${n}</button>`).join('')}</div>
    ${list.length ? rdDays(list) : `<p class="rd-empty">${F === 'salvos' ? 'Toque no marca-página de um post para guardar e voltar nele depois.' : loading ? 'Carregando as novidades…' : (SOC.fr && (SOC.fr.friends || []).length) ? 'Nada por aqui ainda.' : 'Adicione amigos para ver o que eles estão lendo.'}</p>`}`;
  $$('.rd-fl [data-f]', host).forEach((b) => b.addEventListener('click', () => { S.rdF = b.dataset.f; paintAmigos(); }));
  rdBind(host, list, paintAmigos);
}
// troca de aba: liga/desliga o modo Amigos e pede os dados que faltam (o feed antigo carrega por baixo)
{ let tm = 0, asked = 0; const sync = () => {
    const box = $('#lista'); if (!box) return; const on = S.tab === 'comunidade' && S.comSeg === 'amigos';
    box.classList.toggle('am-on', on); if (!on) return;
    if (!box.querySelector('#am-host') || box.querySelector('#am-host').dataset.v !== String(S.feedAt || 0) + (S.rd.at || 0)) {
      paintAmigos(); const h = box.querySelector('#am-host'); if (h) h.dataset.v = String(S.feedAt || 0) + (S.rd.at || 0); }
    if ((!S.rd.at || Date.now() - S.rd.at > 60000) && Date.now() - asked > 15000) { asked = Date.now(); try { rdLoad(); } catch {} }
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(sync, 50); }).observe(TR, { childList: true, subtree: true });
  TR.addEventListener('click', (ev) => { if (ev.target.closest && ev.target.closest('[data-seg]')) setTimeout(sync, 0); }); }
// "Pergunte à comunidade…" sobe para cima das abas Comunidade | Amigos (Bia, 17/11): vale para as duas, e dentro
// a pessoa escolhe se o post vai para todos ou só para amigos.
{ const st = document.createElement('style'); st.textContent = '#rd-host > .rd-new{display:none!important}#lista > .cm-new{margin:.1rem 0 .7rem}'; TR.append(st);
  let tm = 0; const put = () => { const box = $('#lista'); if (!box || S.tab !== 'comunidade') return; const seg = box.querySelector('.rd-seg'); if (!seg || box.querySelector(':scope > .cm-new')) return;
    let pr = 'Pergunte à comunidade o que ler depois'; try { pr = RD_PROMPTS[Math.floor(Date.now() / 3600000) % RD_PROMPTS.length]; } catch {}
    const b = document.createElement('button'); b.type = 'button'; b.className = 'rd-new cm-new';
    b.innerHTML = '<i>+</i><span><b>' + esc(pr) + '</b><small>Comentário, trecho, pergunta ou indicação</small></span>';
    b.addEventListener('click', () => openRdComposer()); (seg.closest('.cm-row') || seg).before(b); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(put, 40); }).observe(TR, { childList: true, subtree: true }); }

// ••• da página Comunidade (Bia, 17/11): ao lado das abas Comunidade | Amigos, vale para as duas
// (esconder livros que estou lendo, pessoas silenciadas e, para moderação, denúncias).
{ const st = document.createElement('style'); st.textContent = '#lista > .cm-row{display:flex;align-items:center;gap:.5rem;margin:.1rem 0 .8rem}#lista > .cm-row .rd-seg{flex:1;margin:0}.cm-more{flex:none;width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:900;letter-spacing:1px;position:relative;cursor:pointer}.cm-more.on{border-color:var(--acc);color:var(--acc)}.cm-more i{position:absolute;top:6px;right:7px;width:8px;height:8px;border-radius:50%;background:var(--acc)}'; TR.append(st);
  let tm = 0; const put = () => { const box = $('#lista'); if (!box || S.tab !== 'comunidade') return; const seg = box.querySelector('.rd-seg'); if (!seg) return;
    let row = box.querySelector(':scope > .cm-row'); if (!row) { row = document.createElement('div'); row.className = 'cm-row'; seg.before(row); row.append(seg);
      const b = document.createElement('button'); b.type = 'button'; b.className = 'cm-more'; b.setAttribute('aria-label', 'Mais opções da Comunidade'); b.textContent = '•••'; row.append(b);
      b.addEventListener('click', () => { try { rdFiltersSheet(); } catch {} }); }
    const P = rdPrefs(), on = P.hideReading || P.muteU.length > 0, b = row.querySelector('.cm-more');
    if (b.classList.contains('on') !== on) { b.classList.toggle('on', on); b.innerHTML = '•••' + (on ? '<i></i>' : ''); } };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(put, 40); }).observe(TR, { childList: true, subtree: true }); }
