// v2 Denúncias (Bia, 19/11/2026, branch livroverso-2; API migração 030).
//  Perfil de outra pessoa ganha "•••" no topo: Copiar link do perfil, Denunciar, Bloquear.
//  Denunciar abre a folha do protótipo: motivo (frase/nome/foto ofensiva, assédio ou ameaça, discurso de ódio, spam ou golpe,
//  spoiler de propósito, outro motivo), texto opcional e "Também bloquear" (marcado). A pessoa não fica sabendo quem denunciou.
//  Tela Denúncias (moderação, app_admins): perfis, posts e avaliações juntos, vencidas primeiro, com o prazo de 48 h de cada uma
//  ("faltam 31 h" / "vencida há 3 h"). Perfil: Manter ou Tirar frase e foto. Post/avaliação: Manter ou Remover (como antes).
{ const st = document.createElement('style'); st.textContent = `
.v2pxm{position:absolute;right:.2rem;top:.2rem;z-index:3;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-size:1.05rem;font-weight:900;cursor:pointer;line-height:1}
#shelflist .sl-body > .yo-top{position:relative}
.rp-l{display:grid;margin:.3rem 0 .2rem}
.rp-l button{display:flex;align-items:center;gap:.65rem;width:100%;border:0;border-bottom:1px solid var(--line);background:none;padding:.7rem .1rem;font:inherit;font-size:.9rem;color:var(--ink);text-align:left;cursor:pointer}
.rp-l button i{flex:none;width:18px;height:18px;border-radius:50%;border:2px solid var(--line)}
.rp-l button.on i{border:5px solid var(--acc)}
.rp-tx{display:block;width:100%;box-sizing:border-box;margin-top:.5rem;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);font:inherit;font-size:.86rem;padding:.55rem .65rem;resize:vertical;min-height:58px}
.rp-ck{display:flex;gap:.6rem;align-items:center;margin-top:.7rem;font-size:.86rem;cursor:pointer}
.rp-ck input{width:20px;height:20px;accent-color:var(--acc);flex:none}.rp-ck small{display:block;font-size:.74rem;color:var(--ink-2)}
.rp-note{font-size:.8rem;color:var(--ink-2);margin:.1rem 0 .4rem;line-height:1.4}
.acts button.p:disabled{opacity:.45;pointer-events:none}
.mod-sum{display:flex;gap:.5rem;flex-wrap:wrap;margin:0 0 .8rem;font-size:.78rem;color:var(--ink-2)}
.mod-sum b{color:var(--ink)}
.mod-it{border:1px solid var(--line);background:var(--panel);border-radius:16px;padding:.7rem .75rem;margin-bottom:.7rem}
.mod-it.late{border-color:#c0392b}
.mod-hd{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.45rem;font-size:.74rem;font-weight:900;color:var(--ink-2);text-transform:uppercase;letter-spacing:.04em}
.mod-sla{text-transform:none;letter-spacing:0;border-radius:99px;padding:.15rem .55rem;background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--acc);white-space:nowrap}
.mod-it.late .mod-sla{background:color-mix(in srgb,#c0392b 12%,var(--panel));color:#c0392b}
.mod-pf{display:grid;grid-template-columns:44px minmax(0,1fr);gap:.65rem;align-items:center}
.mod-pf .av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--acc);color:var(--on-acc,#fff);font-weight:900}
.mod-pf b{display:block;font-size:.95rem}.mod-pf small{display:block;font-size:.76rem;color:var(--ink-2)}
.mod-bio{margin:.5rem 0 0;font-size:.84rem;font-style:italic;color:var(--ink)}
.mod-why{margin:.5rem 0 0;font-size:.8rem;color:var(--ink-2);line-height:1.45}.mod-why b{color:var(--ink)}
.mod-det{margin:.3rem 0 0;font-size:.8rem;color:var(--ink);background:var(--bg);border-radius:10px;padding:.4rem .55rem}
.mod-ac{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.6rem}
.mod-ac button{border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.35rem .8rem;font:inherit;font-size:.78rem;font-weight:800;cursor:pointer}
.mod-ac button.dng{color:#c0392b}
`; TR.append(st); }
const RP_REASONS = [['frase', 'Frase, nome ou foto ofensiva'], ['assedio', 'Assédio ou ameaça'], ['odio', 'Discurso de ódio'], ['golpe', 'Spam ou golpe'], ['spoiler', 'Spoiler de propósito'], ['outro', 'Outro motivo']];
const RP_LABEL = { ...Object.fromEntries(RP_REASONS), ofensa: 'Ofensa', spam: 'Spam' };
function v2ReportSheet(d) {
  const who = String(d.displayName || '@' + d.handle).split(' ')[0]; let pick = '';
  TR.querySelector('.esn-sheet.rp-sh')?.remove();
  const sh = document.createElement('div'); sh.className = 'esn-sheet rp-sh';
  sh.innerHTML = '<div class="box"><h3 style="margin:0 0 .3rem">Denunciar ' + esc(who) + '</h3><p class="rp-note">O que tem de errado? A pessoa não fica sabendo que foi você.</p>'
    + '<div class="rp-l">' + RP_REASONS.map(([k, n]) => '<button type="button" data-r="' + k + '"><i></i><span>' + n + '</span></button>').join('') + '</div>'
    + '<div class="rp-more" hidden><textarea class="rp-tx" maxlength="500" placeholder="Quer contar mais? (opcional)"></textarea>'
    + '<label class="rp-ck"><input type="checkbox" class="rp-bl" checked><span>Também bloquear ' + esc(who) + '<small>vocês deixam de se ver</small></span></label></div>'
    + '<div class="acts"><button type="button" data-a="x">Cancelar</button><button type="button" class="p" data-a="ok" disabled>Enviar denúncia</button></div></div>';
  const close = () => sh.remove();
  sh.querySelectorAll('[data-r]').forEach((b) => b.addEventListener('click', () => { pick = b.dataset.r; sh.querySelectorAll('[data-r]').forEach((x) => x.classList.toggle('on', x === b)); sh.querySelector('.rp-more').hidden = false; sh.querySelector('[data-a=ok]').disabled = false; }));
  sh.querySelector('[data-a=x]').addEventListener('click', close); sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); });
  sh.querySelector('[data-a=ok]').addEventListener('click', async (ev) => { if (!pick) return; ev.currentTarget.disabled = true;
    const block = sh.querySelector('.rp-bl').checked, details = sh.querySelector('.rp-tx').value.trim();
    const r = await sapi('POST', '/v1/report/profile/' + encodeURIComponent(d.handle), { reason: pick, ...(details ? { details: details.slice(0, 500) } : {}), block }).catch(() => null);
    if (!r || r.status >= 300) { ev.currentTarget.disabled = false; return toast('Não consegui enviar agora'); }
    close(); toast('Denúncia enviada. A gente analisa em até 48 h');
    if (block) { try { const v = $('#shelflist'); v.hidden = true; syncTopTitle(); } catch {} try { syncSocial3 && syncSocial3(); } catch {} } });
  TR.append(sh);
}
// "•••" no perfil de outra pessoa
{ let tm = 0; const put = () => {
    const v = $('#shelflist'), d = S.fpData; if (!v || v.hidden || !d || !d.handle || d.self) return;
    const top = v.querySelector('.sl-body > .v3pf') || v.querySelector('.sl-body > .yo-top'); if (!top || v.querySelector('.sl-body .v2pxm')) return; // f3 leva o botão para a barra do topo
    const b = document.createElement('button'); b.type = 'button'; b.className = 'v2pxm'; b.setAttribute('aria-label', 'Mais opções do perfil'); b.textContent = '•••';
    b.addEventListener('click', (ev) => { ev.stopPropagation(); const dd = S.fpData; if (!dd) return; popMenu(b, [
      { label: 'Copiar link do perfil', fn: () => { const u = location.origin + location.pathname + '#@' + dd.handle; try { navigator.clipboard.writeText(u).then(() => toast('Link do perfil copiado'), () => toast(u)); } catch { toast(u); } } },
      { label: dd.muted ? 'Deixar de silenciar' : 'Silenciar', fn: () => { if (!connected()) return toast('Entre na sua conta para silenciar'); v2MuteToggle(dd); } },
      { label: 'Denunciar', fn: () => { if (!connected()) return toast('Entre na sua conta para denunciar'); v2ReportSheet(dd); } },
      0,
      { label: 'Bloquear', danger: true, fn: () => v2BlockSheet(dd) },
    ]); });
    top.append(b); };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 140); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] }); }
function v2BlockSheet(d) {
  const who = String(d.displayName || '@' + d.handle).split(' ')[0];
  TR.querySelector('.esn-sheet.rpb-sh')?.remove();
  const sh = document.createElement('div'); sh.className = 'esn-sheet rpb-sh';
  sh.innerHTML = '<div class="box"><h3 style="margin:0 0 .3rem">Bloquear ' + esc(who) + '?</h3><p class="rp-note">Vocês deixam de ver os posts, o perfil e as reservas um do outro, e a amizade é desfeita. Dá para desbloquear em Ajustes.</p>'
    + '<div class="acts"><button type="button" data-a="x">Cancelar</button><button type="button" class="p" data-a="ok">Bloquear</button></div></div>';
  const close = () => sh.remove();
  sh.querySelector('[data-a=x]').addEventListener('click', close); sh.addEventListener('click', (ev) => { if (ev.target === sh) close(); });
  sh.querySelector('[data-a=ok]').addEventListener('click', async () => { const r = await sapi('POST', '/v1/blocks/' + encodeURIComponent(d.handle)).catch(() => null);
    close(); if (r && r.status < 300) { toast('Bloqueio feito: vocês deixam de se ver'); try { const v = $('#shelflist'); v.hidden = true; syncTopTitle(); } catch {} } else toast('Não consegui agora'); });
  TR.append(sh);
}
// escada da moderação (só conta o que é confirmado): 1ª tira frase e foto e avisa; 2ª 7 dias; 3ª 15; 4ª 30; 5ª bane
const modStepLabel = (n) => n <= 1 ? 'tira frase e foto e avisa' : n === 2 ? 'suspende 7 dias' : n === 3 ? 'suspende 15 dias' : n === 4 ? 'suspende 30 dias' : 'bane a conta';
const modHist = (it) => { const H = (it.history || []).filter((x) => !x.revoked);
  return '<p class="mod-why"><b>Histórico:</b> ' + (H.length ? H.length + (H.length === 1 ? ' confirmada' : ' confirmadas') + ' (' + H.map((x) => new Date(x.at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }) + ' ' + (x.action === 'clear' ? 'aviso' : x.action === 'ban' ? 'banida' : x.days + ' dias')).join(', ') + ')' : 'nenhuma confirmada') + '</p>'; };
async function modPullActive(redraw) { try { const r = await sapi('GET', '/v1/admin/moderation'); S.modActive = r && r.status === 200 && r.data ? r.data.items || [] : []; } catch { S.modActive = []; } redraw && redraw(); }
{ const st = document.createElement('style'); st.textContent = `.mod-act{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.55rem .75rem;margin:0 0 .8rem;font-size:.84rem}.mod-act summary{cursor:pointer}`; TR.append(st); }
// tela Denúncias da moderação, com o prazo de 48 h
const modSla = (due) => { if (!due) return { late: false, txt: '' }; const h = Math.round((Date.parse(due) - Date.now()) / 36e5);
  return h < 0 ? { late: true, txt: 'vencida há ' + (-h < 48 ? (-h || 1) + ' h' : Math.round(-h / 24) + ' dias') } : { late: false, txt: 'faltam ' + (h < 1 ? 'menos de 1 h' : h + ' h') }; };
openRdMod = async function () {
  const v = $('#shelflist'); let L = null;
  const why = (rs) => rs.map((r) => esc(RP_LABEL[r.reason] || r.reason) + (r.n > 1 ? ' (' + r.n + ')' : '')).join(', ');
  const draw = () => {
    const late = (L || []).filter((x) => modSla(x.dueAt).late).length;
    const A = S.modActive || [];
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Denúncias</b><span></span></div>'
      + (A.length ? '<details class="mod-act"><summary><b>' + A.length + '</b> ' + (A.length === 1 ? 'conta com medida em vigor' : 'contas com medida em vigor') + '</summary>'
        + A.map((x, k) => '<div class="v2mu"><span><b>' + esc(x.displayName || '@' + x.handle) + '</b><small>' + (x.action === 'ban' ? 'banida' : 'suspensa até ' + new Date(x.until).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })) + ' · ' + esc(RP_LABEL[x.reason] || x.reason) + '</small></span><button type="button" data-rv="' + k + '">Desfazer</button></div>').join('') + '</details>' : '')
      + (L === null ? '<p class="rd-empty">Carregando…</p>' : !L.length ? '<p class="rd-empty">Nenhuma denúncia para revisar.</p>'
        : '<div class="mod-sum"><span><b>' + L.length + '</b> para revisar</span>' + (late ? '<span style="color:#c0392b"><b>' + late + '</b> fora do prazo de 48 h</span>' : '<span>todas dentro do prazo de 48 h</span>') + '</div>'
          + L.map((it, i) => { const s = modSla(it.dueAt), kind = it.type === 'profile' ? 'Perfil' : it.type === 'review' ? 'Avaliação' : 'Post';
            const head = '<div class="mod-hd"><span>' + kind + '</span>' + (s.txt ? '<span class="mod-sla">' + s.txt + '</span>' : '') + '</div>';
            if (it.type === 'profile') return '<div class="mod-it' + (s.late ? ' late' : '') + '">' + head
              + '<div class="mod-pf"><span class="av">' + esc(String(it.displayName || it.handle || '?').charAt(0).toUpperCase()) + '</span><span><b>' + esc(it.displayName || '@' + it.handle) + '</b><small>@' + esc(it.handle) + (it.hasAvatar ? ' · tem foto' : '') + '</small></span></div>'
              + (it.bio ? '<p class="mod-bio">“' + esc(it.bio) + '”</p>' : '')
              + '<p class="mod-why"><b>Motivo:</b> ' + why(it.reports) + '</p>' + (it.details || []).map((t) => '<p class="mod-det">' + esc(t) + '</p>').join('')
              + modHist(it)
              + '<div class="mod-ac"><button type="button" data-p="' + i + '" data-a="see">Ver perfil</button><button type="button" data-p="' + i + '" data-a="keep">Manter (não conta)</button><button type="button" class="dng" data-p="' + i + '" data-a="confirm">Confirmar · ' + modStepLabel((it.confirmed || 0) + 1) + '</button></div></div>';
            return '<div class="mod-it' + (s.late ? ' late' : '') + '">' + head + rdCardHTML({ ...it, spoiler: null }, i, { noFoot: true })
              + '<p class="mod-why"><b>Motivo:</b> ' + why(it.reports || []) + (it.hidden ? ' · fora do ar' : '') + '</p>'
              + '<div class="mod-ac"><button type="button" data-p="' + i + '" data-a="keep">Manter</button><button type="button" class="dng" data-p="' + i + '" data-a="remove">Remover</button></div></div>'; }).join(''));
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; });
    $$('.mod-ac [data-a]', v).forEach((b) => b.addEventListener('click', async () => { const it = L[+b.dataset.p], a = b.dataset.a; if (!it) return;
      if (a === 'see') return friendPage(it.handle);
      const path = it.type === 'profile' ? '/v1/admin/profile/' + encodeURIComponent(it.handle) + '/' + a : '/v1/admin/' + (it.type === 'review' ? 'review' : 'post') + '/' + it.id + '/' + a;
      const r = await sapi('POST', path).catch(() => null);
      if (r && r.status < 300) { L.splice(+b.dataset.p, 1); draw(); toast(a === 'keep' ? 'Mantido: não conta para a pessoa' : a === 'confirm' ? 'Confirmado · ' + modStepLabel(r.data && r.data.step || 1) : 'Removido'); if (a === 'confirm') modPullActive(draw); } else toast('Não consegui agora'); }));
    $$('.mod-act [data-rv]', v).forEach((b) => b.addEventListener('click', async () => { const x = (S.modActive || [])[+b.dataset.rv]; if (!x) return;
      const r = await sapi('POST', '/v1/admin/strikes/' + x.id + '/revoke').catch(() => null);
      if (r && r.status < 300) { toast('Desfeito: a conta de ' + String(x.displayName || '@' + x.handle).split(' ')[0] + ' está liberada'); modPullActive(draw); } else toast('Não consegui agora'); }));
    try { paintCv(v); rdLoadImages(v); } catch {}
  };
  S.listRedraw = draw; S.navView = { t: 'rdmod', a: [] }; try { closeEd(); } catch {} v.classList.remove('feedview', 'tabroot', 'mine-page', 'v2des'); draw(); v.hidden = false; v.scrollTop = 0; try { syncTopTitle(); } catch {}
  try { const r = await sapi('GET', '/v1/admin/reports'); const d = r && r.status === 200 && r.data ? r.data : {};
    L = [...(d.profiles || []), ...(d.items || [])].sort((a, b) => String(a.dueAt || '9').localeCompare(String(b.dueAt || '9'))); } catch { L = []; }
  draw(); modPullActive(() => { if (S.listRedraw === draw && !v.hidden) draw(); });
};
