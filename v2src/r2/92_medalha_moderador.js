// Medalha de moderador (Bia, 17/11): quem está na lista de moderação da API (isMod no perfil) ganha a medalha pequena ao lado
// do nome e um destaque "Moderação" no começo das Conquistas. Não entra na contagem de conquistas (não se ganha usando o app).
{ const st = document.createElement('style'); st.textContent = `
.mod-b{display:inline-block;width:22px;height:22px;margin-left:.35rem;vertical-align:-4px;background:url("img/cq/mod.webp") center/contain no-repeat;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))}
.mod-row{display:flex;align-items:center;gap:.65rem;padding:.55rem .65rem;margin:0 0 .6rem;border-radius:14px;background:linear-gradient(90deg,color-mix(in srgb,#8e3fd0 14%,transparent),color-mix(in srgb,#f2c94c 12%,transparent));border:1px solid color-mix(in srgb,#b98cff 35%,transparent)}
.mod-row i{flex:none;width:52px;height:52px;background:url("img/cq/mod.webp") center/contain no-repeat;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))}
.mod-row b{display:block;font-size:.88rem;color:var(--ink)}.mod-row small{display:block;font-size:.72rem;color:var(--ink-2);font-weight:700}
`; TR.append(st); }
{ let tm = 0; const paint = () => {
    const v = $('#shelflist'), d = S.fpData; if (!v || v.hidden || !d || !d.isMod) return;
    const nm = v.querySelector('.sl-body .yo-id > b'); if (nm && !nm.querySelector('.mod-b')) nm.insertAdjacentHTML('beforeend', '<span class="mod-b" title="Moderação" aria-label="Moderação"></span>');
    const ach = [...v.querySelectorAll('.sl-body section, .sl-body .v3c')].find((s) => /^Conquistas/.test(((s.querySelector('.v3-sh b, h2, h3') || {}).textContent || '').trim()));
    if (ach && !ach.querySelector('.mod-row')) { const hd = ach.querySelector('.v3-sh') || ach.firstElementChild; const row = '<div class="mod-row"><i></i><div><b>Moderação</b><small>Cuida da comunidade do Livroverso</small></div></div>'; if (hd) hd.insertAdjacentHTML('afterend', row); else ach.insertAdjacentHTML('afterbegin', row); }
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(paint, 80); }).observe(TR, { childList: true, subtree: true }); }
