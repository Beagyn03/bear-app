// Toque numa pessoa da leitura conjunta (linha no card do Hoje ou bolinha na página Lendo junto): Ver perfil / Mandar mensagem.
{ const st = document.createElement('style'); st.textContent = `.v3-bud-r{cursor:pointer;border-radius:10px}.v3-bud-r:active{background:color-mix(in srgb,var(--acc) 10%,transparent)}.bj-dot[data-avh],.fd-post .av[data-avh],.pt-com .av[data-avh]{cursor:pointer}`; TR.append(st); }
const personMenu = (anchor, handle, name) => {
  const me = (typeof socialProfile !== 'undefined' && socialProfile && socialProfile.handle) || ''; if (!handle || handle === me) return;
  const first = String(name || handle).split(' ')[0];
  popMenu(anchor, [
    { label: `Ver perfil de ${esc(first)}`, sub: '@' + esc(handle), fn: () => friendPage(handle) },
    { label: 'Mandar mensagem', fn: () => openChat(handle) },
  ]);
};
TR.addEventListener('click', (ev) => {
  const row = ev.target.closest && ev.target.closest('.v3-bud-r, .bj-dot[data-avh], .fd-post .av[data-avh], .pt-com .av[data-avh], .nt-fd .av[data-avh], .bj-it .bj-av[data-avh]'); if (!row) return;
  const av = row.matches('[data-avh]') ? row : row.querySelector('[data-avh]'); if (!av) return;
  ev.preventDefault(); ev.stopPropagation();
  const name = row.matches('.av') ? ((row.closest('.fd-post, .pt-com, .nt-fd') || row).querySelector('.fd-who, b')?.textContent || '') : row.querySelector('small')?.textContent || (row.getAttribute('title') || '').split(' · ')[0];
  personMenu(row, av.dataset.avh, name);
}, true);
