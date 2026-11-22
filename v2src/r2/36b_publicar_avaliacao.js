// Avaliação não chegava à Comunidade (reteste da Bia, 20/11, G2): o publishReview original chama readerPctOf, que mora no
// bloco 36 (fora do alcance do código antigo, em modo estrito); dava ReferenceError, engolido pelo catch, e nada era enviado.
// Mesmo envio de antes, agora daqui, onde readerPctOf existe. Os embrulhos seguintes (72 níveis, u2 só lido) continuam valendo.
publishReview = async function (b) {
  if (!connected()) return;
  libSync();
  const e = b.status && db.goals.some((g) => g.books.includes(b)) ? (db.library || []).find((x) => x.link && x.link.bookId === b.id) : b;
  if (!e) return;
  try {
    if (socialProfile === undefined) await loadProfile();
    if (!socialProfile) return; // sem @usuário ainda: publica tudo ao criar
    const rv = b.review;
    if (!rv || rv.share === false) { await sapi('DELETE', `/v1/reviews/${encodeURIComponent(e.id)}`); return; }
    let pct = null; try { pct = readerPctOf(e.title); } catch {}
    await sapi('PUT', `/v1/reviews/${encodeURIComponent(e.id)}`, { title: e.title, author: e.author || null, cover: smallCover(e.cover), paws: rv.paws || null, text: reviewText(rv) || null, spoiler: !!rv.spoiler,
      ressaca: rv.ressaca === 'curou' ? 'curou' : rv.ressaca ? 'deu' : null, readerPct: pct, visibility: rv.vis === 'friends' ? 'friends' : 'public', bookStatus: ['LIDO', 'LENDO', 'HIBERNANDO', 'ABANDONEI', 'QUERO'].includes(e.status) ? e.status : null,
      ...(e.status === 'LIDO' && e.finishedAt && /^\d{4}-\d{2}-\d{2}$/.test(e.finishedAt) ? { readAt: e.finishedAt } : {}),
      ...(rv.spoiler && rv.spoilerKind ? { spoilerKind: rv.spoilerKind, ...(rv.spoilerAt ? { spoilerAt: rv.spoilerAt } : {}) } : {}) });
  } catch (err) { console.warn('publicar avaliação', err); }
};
