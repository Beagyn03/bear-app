// Cidade, estado e lista de desejos na conta (Bia, 21/11; API migração 039, PUT /v1/me/profile-extra): "Complete seu perfil"
// salva também na API; amizades veem "Cidade · UF" e o botão "Lista de desejos" no perfil; no próprio perfil aparece com "só amizades veem".
// O aviso de boas-vindas agora vem do servidor (user_notices tipo 'welcome'): o aviso local do y0 sai para não duplicar.
const v3ExtSplit = (s) => { const t = String(s || '').trim(); if (!t) return { city: '', state: '' }; const i = t.lastIndexOf(','); if (i < 0) { const m = t.match(/^(.*?)[\s\-\/]+([A-Za-z]{2})$/); return m ? { city: m[1].trim(), state: m[2].toUpperCase() } : { city: t, state: '' }; } return { city: t.slice(0, i).trim(), state: t.slice(i + 1).trim() }; };
async function v3ExtPush(force) {
  try { if (!connected() || !socialProfile) return; } catch { return; }
  const q = (db.prefs || {}).perfil || {}; const { city, state } = v3ExtSplit(q.cidade); let url = String(q.desejos || '').trim();
  if (url && !/^https:\/\//i.test(url)) { if (/^http:\/\//i.test(url)) url = url.replace(/^http:/i, 'https:'); else if (!/^[a-z]+:/i.test(url)) url = 'https://' + url; }
  const body = { city: city || null, state: state || null, wishlistUrl: url || null }, sig = JSON.stringify(body);
  if (!force && (db.prefs || {}).perfilSent === sig) return;
  const r = await sapi('PUT', '/v1/me/profile-extra', body).catch(() => null);
  if (r && r.status === 200) { db.prefs = { ...(db.prefs || {}), perfilSent: sig }; try { save(); } catch {} (S.v3ext = S.v3ext || {})[socialProfile.handle] = { city: body.city, state: body.state, wishlistUrl: body.wishlistUrl }; }
  else if (r && r.status === 400) { try { toast('Confira o link da lista de desejos (precisa começar com https://)'); } catch {} }
}
// ao salvar/pular/sair da folha "Complete seu perfil" (o keep() do y1 grava em db.prefs.perfil no mesmo toque)
document.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('.ppperf button'); if (b) setTimeout(() => v3ExtPush(), 60); }, true);
// uma vez: o que ficou só no aparelho sobe para a conta
setTimeout(() => { const q = (db.prefs || {}).perfil || {}; if (q.cidade || q.desejos) v3ExtPush(); }, 5000); // só se houver algo: não apaga o que outro aparelho salvou
{ const st = document.createElement('style'); st.textContent = `.v3ext{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:.4rem .7rem;margin:.15rem 0 .2rem;font-size:.82rem;color:var(--ink-2)}
.v3ext span{display:inline-flex;align-items:center;gap:.3rem}.v3ext a{display:inline-flex;align-items:center;gap:.3rem;min-height:36px;padding:0 .8rem;border-radius:99px;border:1px solid var(--line);color:var(--ink);font-weight:800;text-decoration:none}
.v3ext small{width:100%;text-align:center;font-size:.72rem;opacity:.8}.v3ext svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}`; TR.append(st); }
const V3EXT_PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/></svg>';
const V3EXT_GIFT = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M2.5 9h19M12 9v11M12 9S10 4 7.5 5.2 9 9 12 9zm0 0s2-5 4.5-3.8S15 9 12 9z"/></svg>';
function v3ExtPaint(v, d) {
  const hd = v && v.querySelector('.sl-body > .v3pf'); if (!hd || !d || !d.handle) return;
  const self = !!d.self, prev = self && S.v3prev;
  let e = d.extra || (S.v3ext || {})[d.handle] || null;
  if (self && !e) { const q = (db.prefs || {}).perfil || {}; const s = v3ExtSplit(q.cidade); e = { city: s.city || null, state: s.state || null, wishlistUrl: q.desejos || null }; }
  if (d.extra) (S.v3ext = S.v3ext || {})[d.handle] = d.extra;
  const place = e && [e.city, e.state].filter(Boolean).join(' · ');
  const url = e && e.wishlistUrl && /^https:\/\//i.test(e.wishlistUrl) ? e.wishlistUrl : '';
  const html = (place || url) ? (place ? '<span>' + V3EXT_PIN + esc(place) + '</span>' : '') + (url ? '<a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + V3EXT_GIFT + 'Lista de desejos</a>' : '') + (self && !prev ? '<small>só amizades veem</small>' : '') : '';
  let el = hd.querySelector(':scope > .v3ext');
  if (!html) { if (el) el.remove(); return; }
  if (!el) { el = document.createElement('div'); el.className = 'v3ext'; const after = hd.querySelector(':scope > .v3h'); after ? after.after(el) : hd.append(el); }
  if (el.dataset.h !== html) { el.dataset.h = html; el.innerHTML = html; }
}
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments); try { v3ExtPaint(v, d); } catch (err) { console.warn('perfil extra', err); } return r; }; }
// textos da folha "Complete seu perfil": cidade e link agora são vistos por amizades
for (const x of (typeof PP_PERF !== 'undefined' ? PP_PERF : [])) { if (x[0] === 'cidade') x[2] = 'opcional; ajuda em empréstimos e presentes · quem vê: só amizades'; if (x[0] === 'desejos') x[2] = 'ex.: Amazon: quem comprar por ali envia direto para você, sem a loja mostrar seu endereço (pode aparecer no rastreio) · quem vê: só amizades'; }
// Aviso de boas-vindas do servidor: não abre a janela "Avisos" (as boas-vindas já aparecem na abertura); fica como item em
// Avisos › Notificações (o mesmo .ppwel do y0, um só) e é marcado como visto ao tocar.
{ const _sa = sapi; sapi = async function (method, path) { const r = await _sa.apply(this, arguments);
    try { if (String(method).toUpperCase() === 'GET' && /^\/v1\/me\/moderation(\?|$)/.test(String(path)) && r && r.status === 200 && r.data && Array.isArray(r.data.notices)) {
      const w = r.data.notices.filter((n) => n && n.kind === 'welcome'); if (w.length) { S.welcomeNote = w[0]; r.data.notices = r.data.notices.filter((n) => !n || n.kind !== 'welcome'); } } } catch {}
    return r; }; }
new MutationObserver(() => { if (!S.welcomeNote) return; const L = TR.querySelector('#editor.ntpage .nt-list'); if (!L || L.querySelector('.ppwel')) return;
  const w = document.createElement('button'); w.type = 'button'; w.className = 'ppwel';
  w.innerHTML = `<span class="ic" aria-hidden="true">${v4ic('orb', 18)}</span><span><b>${esc(S.welcomeNote.title || 'Boas-vindas ao Livroverso')}</b><small>${esc(S.welcomeNote.body || 'Seus primeiros passos estão no Hoje')}</small></span>`;
  w.addEventListener('click', () => { const id = S.welcomeNote && S.welcomeNote.id; if (id) sapi('POST', '/v1/me/notices/seen', { ids: [id] }).catch(() => {}); try { ppReabrir(); } catch { try { goTab('inicio'); } catch {} } });
  L.prepend(w); }).observe(TR, { childList: true, subtree: true });
