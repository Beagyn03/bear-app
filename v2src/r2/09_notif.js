// Notificações viram tela (não folha): topo com "‹ Voltar", notificações e, embaixo, as novidades recentes dos amigos.
{ const st = document.createElement('style'); st.textContent = `
#editor.ntpage{top:calc(env(safe-area-inset-top,0px) + 3.2rem)!important;bottom:calc(3.4rem + env(safe-area-inset-bottom,0px))!important;background:var(--bg)!important;align-items:stretch!important;z-index:35!important}
#editor.ntpage .ed-body{width:min(560px,100%)!important;max-height:none!important;height:100%!important;border-radius:0!important;border:0!important;box-shadow:none!important;background:var(--bg)!important;padding:.7rem 1rem 1.2rem!important;align-content:start;animation:none!important}
#editor.ntpage .ed-body > h3,.nt-top b{display:none}#editor.ntpage .ed-body::before,#editor.ntpage .ed-body::after{display:none!important}
.nt-top{display:flex;align-items:center;gap:.6rem}.nt-top b{font-size:1.05rem;color:var(--ink)}
.nt-sec{font-size:.72rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:.9rem 0 .1rem}
.nt-fd{display:flex;gap:.6rem;align-items:center;width:100%;text-align:left;border:1px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);font:inherit;font-size:.86rem;padding:.6rem .7rem}
.nt-fd .av{flex:none}.nt-fd span{flex:1;min-width:0;line-height:1.35}.nt-fd small{display:block;color:var(--ink-2);font-size:.74rem;margin-top:.1rem}
.nt-all{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.86rem;min-height:40px;justify-self:start}
`; TR.append(st); }
{
  const ed = $('#editor');
  const KIND = { STARTED: 'começou a ler', PROGRESS: 'avançou em', FINISHED: 'terminou', PAUSED: 'pausou', ABANDONED: 'abandonou' };
  const decorate = () => {
    if (!ed.classList.contains('ntpage') || ed.hidden) return;
    const body = ed.querySelector('.ed-body'); if (!body || body.querySelector('.nt-top')) return;
    body.insertAdjacentHTML('afterbegin', '<div class="nt-top"><button type="button" class="sl-back" id="nt-back">‹ Voltar</button><b>Notificações</b></div>');
    $('#nt-back', body).addEventListener('click', closeEd);
    const gt = $('#g-t'); if (gt) gt.textContent = 'Notificações';
    body.querySelector('#nt-close')?.remove();
    const items = ((SOC.feed && SOC.feed.items) || SOC.feed || []).filter((x) => x && !x.mine).slice(0, 15);
    if (Array.isArray(items) && items.length) {
      const line = (x) => { const who = (x.user && x.user.displayName) || ''; const t = `<b>${esc(x.title || '')}</b>`;
        const what = x.type === 'review' ? `avaliou ${t}${x.paws ? ` · ${pawTxt(x.paws)}` : ''}` : `${KIND[x.kind] || 'atualizou'} ${t}${x.kind === 'PROGRESS' && x.pct ? ` · ${x.pct}%` : ''}`;
        return `<button type="button" class="nt-fd" data-fid="${esc(x.id)}"><span class="av sm" data-avh="${esc((x.user && x.user.handle) || '')}" style="background:${friendColor((x.user && x.user.handle) || who)}">${esc(initial(who))}</span><span><b>${esc(String(who).split(' ')[0])}</b> ${what}<small>${esc(relTime(x.updatedAt))}</small></span></button>`; };
      body.insertAdjacentHTML('beforeend', `<div class="nt-sec">Novidades dos amigos</div>${items.map(line).join('')}<button type="button" class="nt-all" id="nt-all">Ver todas as novidades ›</button>`);
      $$('.nt-fd', body).forEach((b) => b.addEventListener('click', () => { closeEd(); openNovidades(b.dataset.fid); }));
      $('#nt-all', body).addEventListener('click', () => { closeEd(); openNovidades(); });
      try { paintAvatars(); } catch {}
    }
  };
  // fechou (hidden ligado) = sai do modo tela, mesmo que outra folha abra logo em seguida
  new MutationObserver((recs) => { if (recs.some((r) => r.type === 'attributes' && r.target === ed && r.oldValue === null)) ed.classList.remove('ntpage'); if (ed.hidden) { if (ed.classList.contains('ntpage')) { ed.classList.remove('ntpage'); try { syncTopTitle(); } catch {} } } else decorate(); }).observe(ed, { attributes: true, attributeOldValue: true, attributeFilter: ['hidden'], childList: true, subtree: true });
  const _on = openNotif;
  openNotif = function () { ed.classList.add('ntpage'); const r = _on.apply(this, arguments); decorate(); return r; };
}
{ const gt = $('#g-t'); if (gt) new MutationObserver(() => { const ed = $('#editor'); if (ed && !ed.hidden && ed.classList.contains('ntpage') && gt.textContent !== 'Notificações') gt.textContent = 'Notificações'; }).observe(gt, { childList: true, characterData: true, subtree: true }); }
