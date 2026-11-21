// Boas-vindas garantidas na conta nova (teste de estresse, 21/11): no cadastro real, a primeira sincronização com o servidor
// podia trocar as preferências antes do primeiro acesso abrir, apagando a marca do guia (pp) — e a abertura de 3 telas não aparecia.
// Guarda a marca fora das preferências durante 2 minutos depois do cadastro e devolve se ela sumir.
{ let fresh = 0, keep = null;
  const _ar = afterRegister; afterRegister = function () { fresh = Date.now(); const r = _ar.apply(this, arguments); try { keep = { ...(ppS() || {}) }; } catch {} return r; };
  const restore = () => { if (!fresh || Date.now() - fresh > 120000 || !keep) return; try { if (!ppS()) { db.prefs = { ...(db.prefs || {}), pp: { ...keep } }; save(); } } catch {} };
  const _ot = openTaste; openTaste = function (first) { restore(); return _ot.apply(this, arguments); };
  setInterval(restore, 700); }
