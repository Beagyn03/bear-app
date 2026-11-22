// Debate semanal (Bia, 22/11): a pergunta da semana vem do servidor (/v1/qday). A página e o cartão da Comunidade usavam a lista
// local de temas (V2WK, um por semana); agora mostram a mesma pergunta do Hoje. Enquanto o servidor não responde, fica a guardada.
const debSync = () => { try { if (V6QD && V6QD.question && (V2WK.length !== 1 || V2WK[0] !== V6QD.question)) { V2WK.length = 0; V2WK.push(V6QD.question); } } catch {} };
debSync();
{ const _r = v6QdRefresh; v6QdRefresh = function () { debSync(); const r = _r.apply(this, arguments); try { if (S.tab === 'comunidade' && v6S().f === 'desafio') v6Paint(); } catch {} return r; }; }
{ const _l = v6QdLoad; v6QdLoad = async function () { const r = await _l.apply(this, arguments); debSync(); return r; }; }
// "Ver o debate ›" no cartão do Hoje leva à aba Debate da Comunidade (a página "Mais votados" deixou de existir à parte)
v6QdayOpen = function () { try { const S6 = v6S(); S6.f = 'desafio'; S6.desWk = 0; S6.desBk = null; } catch {} try { goTab('comunidade'); } catch {} try { v6Paint(); } catch {} };
