// v2 Conta: suspensão, avisos e silenciar (Bia, 19/11/2026; API migração 031).
//  - Ao abrir o app: se a conta está suspensa ou banida, aparece o aviso com a data em que volta (uma vez por sessão).
//    Avisos novos da moderação e "livro livre de novo" (me avise se liberar) aparecem numa folha e somem depois de vistos.
//  - Qualquer ação de publicar recusada pela API (SUSPENDED/BANNED) vira o aviso da API, em vez de "não consegui".
//  - Ajustes › Silenciadas: lista de quem a pessoa silenciou, com Desfazer.
{ const st = document.createElement('style'); st.textContent = `
.v2nt{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.7rem .8rem;margin:.5rem 0}
.v2nt b{display:block;font-size:.92rem;line-height:1.35}.v2nt small{display:block;font-size:.8rem;color:var(--ink-2);margin-top:.25rem;line-height:1.4}
.v2nt.mod{border-color:#c0392b}.v2nt.mod b{color:#c0392b}
.v2sus{display:flex;gap:.6rem;align-items:flex-start;border:1px solid #c0392b;background:color-mix(in srgb,#c0392b 7%,var(--panel));border-radius:14px;padding:.6rem .75rem;margin:0 0 .8rem;font-size:.8rem;line-height:1.4;color:var(--ink)}
.v2mu{display:flex;justify-content:space-between;align-items:center;gap:.6rem;border-bottom:1px solid var(--line);padding:.6rem .1rem}
.v2mu b{font-size:.9rem}.v2mu small{display:block;font-size:.76rem;color:var(--ink-2)}
.v2mu button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.3rem .75rem;font:inherit;font-size:.78rem;font-weight:800;cursor:pointer}
`; TR.append(st); }
// recusa por suspensão: mostra o motivo da API
{ const _sa = sapi; sapi = async function () { const r = await _sa.apply(this, arguments);
    try { if (r && r.status === 403 && r.data && /^(SUSPENDED|BANNED)$/.test(r.data.error)) { S.modBlockedMsg = r.data.message; setTimeout(() => toast(r.data.message), 60); } } catch {}
    return r; }; }
async function v2ModCheck() {
  if (!connected()) return; let r; try { r = await sapi('GET', '/v1/me/moderation'); } catch { return; } if (!r || r.status !== 200 || !r.data) return;
  const m = r.data; S.modStatus = m; const notes = (m.notices || []);
  const showStatus = m.status !== 'ok' && !S.modShown; if (!showStatus && !notes.length) return;
  if (showStatus) S.modShown = 1;
  const ed = $('#editor'); if (!ed || !ed.hidden) { setTimeout(v2ModCheck, 8000); return; }
  ed.classList.add('compact');
  const dt = m.until ? new Date(m.until).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
  ed.querySelector('.ed-body').innerHTML = '<div class="dd"><h3>' + (showStatus ? (m.status === 'banned' ? 'Conta banida' : 'Conta suspensa até ' + dt) : 'Avisos') + '</h3>'
    + (showStatus && !notes.some((n) => n.kind === 'moderacao') ? '<p>' + esc(m.message || '') + (m.reasonText ? ' Motivo: ' + esc(m.reasonText) + '.' : '') + '</p>' : '')
    + notes.map((n) => '<div class="v2nt' + (n.kind === 'moderacao' ? ' mod' : '') + '"><b>' + esc(n.title) + '</b>' + (n.body ? '<small>' + esc(n.body) + '</small>' : '') + '</div>').join('')
    + '<button type="button" class="op main" id="v2nt-ok" style="margin-top:.8rem"><b>Entendi</b></button></div>';
  ed.hidden = false;
  $('#v2nt-ok', ed).addEventListener('click', async () => { closeEd(); if (notes.length) { try { await sapi('POST', '/v1/me/notices/seen', { ids: notes.map((n) => n.id) }); } catch {} } });
}
setTimeout(v2ModCheck, 3500);
{ let last = 0; const _gt = goTab; goTab = function () { const r = _gt.apply(this, arguments); if (Date.now() - last > 5 * 60e3) { last = Date.now(); setTimeout(v2ModCheck, 800); } return r; }; }
// faixa no perfil próprio enquanto a conta está suspensa
{ let tm = 0; const put = () => { const v = $('#shelflist'), d = S.fpData, m = S.modStatus; if (!v || v.hidden || !d || !d.self || !m || m.status === 'ok') return;
    const body = v.querySelector('.sl-body'); if (!body || body.querySelector('.v2sus')) return; const anchor = body.querySelector(':scope > .v2pv') || body.querySelector(':scope > .yo-top'); if (!anchor) return;
    const dt = m.until ? new Date(m.until).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '';
    anchor.insertAdjacentHTML('afterend', '<div class="v2sus"><span>⚠</span><span>' + (m.status === 'banned' ? 'Conta banida: seu perfil não aparece para ninguém e você não pode publicar.' : 'Conta suspensa até ' + dt + ': seu perfil está escondido e você não pode publicar. Sua estante, leituras e metas continuam normais.') + '</span></div>'); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 160); }).observe(TR, { childList: true, subtree: true }); }
// silenciar
async function v2MuteToggle(d) {
  const on = !d.muted, who = String(d.displayName || '@' + d.handle).split(' ')[0];
  const r = await sapi(on ? 'POST' : 'DELETE', '/v1/mutes/' + encodeURIComponent(d.handle)).catch(() => null);
  if (!r || r.status >= 300) return toast('Não consegui agora');
  d.muted = on; toast(on ? 'Silenciado. Os posts e comentários de ' + who + ' não aparecem mais para você. Ninguém fica sabendo.' : 'Você voltou a ver o que ' + who + ' publica');
}
function v2MutesSheet() {
  const ed = $('#editor'); ed.classList.add('compact'); let L = null;
  const draw = () => { ed.querySelector('.ed-body').innerHTML = '<div class="dd"><h3>Silenciadas</h3><p>Você não vê os posts, comentários e ecos dessas pessoas. Elas não ficam sabendo, e a amizade continua.</p>'
      + (L === null ? '<p>Carregando…</p>' : L.length ? L.map((x, i) => '<div class="v2mu"><span><b>' + esc(x.displayName || '@' + x.handle) + '</b><small>@' + esc(x.handle) + '</small></span><button type="button" data-i="' + i + '">Desfazer</button></div>').join('') : '<p>Ninguém silenciado.</p>')
      + '<button type="button" class="op main" id="v2mu-ok" style="margin-top:.8rem"><b>Pronto</b></button></div>';
    $$('.v2mu [data-i]', ed).forEach((b) => b.addEventListener('click', async () => { const x = L[+b.dataset.i]; const r = await sapi('DELETE', '/v1/mutes/' + encodeURIComponent(x.handle)).catch(() => null); if (r && r.status < 300) { L.splice(+b.dataset.i, 1); draw(); toast('Silêncio desfeito'); } else toast('Não consegui agora'); }));
    $('#v2mu-ok', ed).addEventListener('click', closeEd); };
  draw(); ed.hidden = false;
  sapi('GET', '/v1/mutes').then((r) => { L = r && r.status === 200 && r.data ? r.data.items || [] : []; if (!ed.hidden) draw(); }).catch(() => { L = []; draw(); });
}
{ const _da = drawAjustes; drawAjustes = function (box) { _da(box); if (S.ajMode === 'perfil' || box.querySelector('#aj-mu')) return;
  const fn = box.querySelector('#aj-fn'); if (!fn) return;
  fn.insertAdjacentHTML('afterend', '<button type="button" class="aj-row" id="aj-mu"><span><b>Silenciadas</b><small>quem você não quer ver no feed e na leitura</small></span><em>›</em></button>');
  $('#aj-mu', box).addEventListener('click', v2MutesSheet); }; }
