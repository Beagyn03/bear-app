// Boas-vindas garantidas na conta nova (teste de estresse, 21/11): no cadastro real, a primeira sincronização com o servidor
// podia trocar as preferências antes do primeiro acesso abrir, apagando a marca do guia (pp). Precaução: no reteste a abertura apareceu; o que a escondia era o Esc do próprio teste.
// Guarda a marca fora das preferências durante 2 minutos depois do cadastro e devolve se ela sumir; também esconde o aviso "Conta criada" ao abrir.
{ let fresh = 0, keep = null;
  const _ar = afterRegister; afterRegister = function () { fresh = Date.now(); const r = _ar.apply(this, arguments); try { keep = { ...(ppS() || {}) }; } catch {} return r; };
  const restore = () => { if (!fresh || Date.now() - fresh > 120000 || !keep) return; try { if (!ppS()) { db.prefs = { ...(db.prefs || {}), pp: { ...keep } }; save(); } } catch {} };
  const _ot = openTaste; openTaste = function (first) { restore(); if (first) { try { const t = $('#toast'); if (t) t.classList.add('hidden'); } catch {} } return _ot.apply(this, arguments); }; // o aviso "Conta criada" não fica por cima do Continuar
  setInterval(restore, 700); }
