// Organizar meu perfil vale também na sua própria tela (Bia, 17/11): o que está desmarcado some da página do perfil
// (Lendo agora, Estantes, Conquistas, Avaliações/resenhas), igual ao que as visitas veem.
{ let tm = 0; const MAP = [['achievements', /^Conquistas/], ['shelf', /^(Estantes|Minhas estantes)/], ['reviews', /^(Minhas resenhas|Avaliações|Resenhas)/]];
  const apply = () => {
    const v = $('#shelflist'); if (!v || v.hidden || !v.classList.contains('mine-page')) return;
    const pv = (socialProfile && socialProfile.privacy) || {};
    v.querySelectorAll('.yo-cur').forEach((x) => { x.style.display = pv.reading === false ? 'none' : ''; });
    v.querySelectorAll('.v3-sh').forEach((h) => {
      const t = h.textContent.trim(); const m = MAP.find(([, re]) => re.test(t)); if (!m) return;
      const off = pv[m[0]] === false, box = h.closest('section') && h.closest('section') !== v ? h.closest('section') : null;
      const els = box ? [box] : [h, h.nextElementSibling].filter(Boolean);
      els.forEach((x) => { x.style.display = off ? 'none' : ''; });
    });
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(apply, 60); }).observe(TR, { childList: true, subtree: true }); }
// ao salvar "Organizar meu perfil", a página do perfil se atualiza na hora
{ const _sss = socialSettingsSheet; socialSettingsSheet = async function () { const r = await _sss.apply(this, arguments);
    try { const f = [...document.querySelectorAll('body > .sheet form.pv2')].pop(); if (f) f.addEventListener('submit', () => setTimeout(() => { try { const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) openMyProfile(); } catch {} }, 900)); } catch {}
    return r; }; }
