// Lista de amigos sempre atual (Bia, 16/11): ao abrir a tela de Amigos, busca a lista na hora e redesenha
// (antes usava a última atualização periódica; quem aceitou o pedido há pouco não aparecia).
{ const _of = openFriendsV3; openFriendsV3 = function () {
  const r = _of.apply(this, arguments);
  (async () => { try {
    const a = await sapi('GET', '/v1/friends'); if (a.status !== 200 || !a.data || !Array.isArray(a.data.friends)) return;
    SOC.fr = { friends: a.data.friends, incoming: a.data.incoming || [], outgoing: a.data.outgoing || [] };
    const v = $('#shelflist'); if (v && !v.hidden && /Amigos/.test((v.querySelector('.sl-top b') || {}).textContent || '') && typeof S.listRedraw === 'function') S.listRedraw();
  } catch {} })();
  return r;
}; }
