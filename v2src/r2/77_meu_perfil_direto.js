// Tocar no próprio nome (num post, na Rede, numa lista) abre o seu perfil de verdade (o mesmo da aba Perfil, com o •••),
// e não a versão "perfil de outra pessoa" (Bia, 17/11). A aba Perfil também passa por friendPage, por isso a marca S.myOpen.
{ const _om = openMyProfile; openMyProfile = async function () { S.myOpen = true; try { return await _om.apply(this, arguments); } finally { S.myOpen = false; } }; }
{ const _fp = friendPage; friendPage = async function (handle) {
    if (!S.myOpen && socialProfile === undefined && connected()) { for (let i = 0; i < 40 && socialProfile === undefined; i++) await new Promise((r) => setTimeout(r, 150)); if (socialProfile === undefined) { try { await loadProfile(); } catch {} } }
    try { const me = socialProfile && socialProfile.handle;
      if (!S.myOpen && me && String(handle || '').replace(/^@/, '').toLowerCase() === String(me).toLowerCase()) return openMyProfile(); } catch {}
    return _fp.apply(this, arguments);
  }; }
