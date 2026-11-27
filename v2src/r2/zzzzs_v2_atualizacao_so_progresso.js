// ---------- v2: atualização de página na Comunidade mostra só o progresso (Bia, 27/11) ----------
// "Essa atualização de página aqui tem nada a ver... Não tem que ser apenas o progresso? Não tem isso de falar qual
// página antes, qual página depois, + quantas foi lida."
// O post automático da atualização leva a linha "Pág. 139 de 432 · +16 páginas" só porque a API não aceita post vazio.
// Na tela, essa linha some: o cartão fica com a capa, "Lendo · 32%" e as emoções. Vale também para os posts já feitos.
// Comentário escrito pela pessoa nunca é escondido (só a linha automática, no formato exato).
const UPD_AUTO_RE = /^(Cap\. [^\n·]{1,40} · )?Pág\. \d+( de \d+)?( · \+\d+ páginas?)?( · última página!)?$/;
const updAuto = (it) => !!(it && it.type === 'post' && (it.kind === 'comment' || !it.kind) && !it.quote && UPD_AUTO_RE.test(String(it.text || '').trim()));
{ const _p = v6PostHTML; v6PostHTML = function (it, i) { return _p.call(this, updAuto(it) ? { ...it, text: '' } : it, i); }; }
{ const _r = rdCardHTML; rdCardHTML = function (it, i, opts) { return _r.call(this, updAuto(it) ? { ...it, text: '' } : it, i, opts); }; }
