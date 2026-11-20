// Organizar perfil × privacidade (Bia, 17/11): a mesma folha abre em dois modos.
// 'perfil' (no ••• do perfil): só o que aparece na página do perfil. 'privacidade' (Ajustes): só quem vê.
{ const _sss = socialSettingsSheet; socialSettingsSheet = async function (mode) {
    const r = await _sss.apply(this, arguments);
    try {
      if (mode !== 'perfil' && mode !== 'privacidade') return r;
      const f = [...document.querySelectorAll('body > .sheet form.pv2')].pop(); if (!f) return r;
      const kids = [...f.children], h3 = f.querySelector('h3');
      const iQ = kids.findIndex((x) => x.classList.contains('group') && /Quem vê/.test(x.textContent));
      const iO = kids.findIndex((x) => x.classList.contains('group') && /O que aparece/.test(x.textContent));
      const iEnd = kids.findIndex((x, i) => i > iO && (x.querySelector && x.querySelector('button[type=submit]') || (x.matches && x.matches('p.hint') && !x.textContent.trim())));
      if (iQ < 0 || iO < 0) return r;
      const hide = (a, b) => kids.slice(a, b).forEach((x) => { x.style.setProperty('display', 'none', 'important'); });
      if (mode === 'perfil') { hide(iQ, iO); if (h3) h3.textContent = 'Organizar meu perfil'; kids[iO].style.setProperty('display', 'none', 'important'); }
      else { hide(iO, iEnd < 0 ? kids.length - 1 : iEnd); if (h3) h3.textContent = 'Privacidade'; }
    } catch (err) { console.warn('organizar perfil', err); }
    return r;
  }; }
