// Debate semanal (Bia, 22/11): a Pergunta do dia e o Desafio da semana viraram UMA pergunta por semana (API /v1/qday, de segunda a
// domingo). O nome mora só aqui: rótulo da aba da Comunidade, nome completo e o prefixo dos posts que respondem à pergunta.
// Posts antigos com "Desafio da semana:" ou "Pergunta do dia:" continuam reconhecidos (DEB_RE).
const DEB = { aba: 'Debate', nome: 'Debate semanal', resp: 'Respondeu ao debate' };
const DEB_RE = /^(Debate semanal|Desafio da semana|Pergunta do dia):/i;
