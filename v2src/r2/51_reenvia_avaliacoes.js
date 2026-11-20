// Uma vez: reenviar as avaliações já publicadas para elas ganharem a data em que o livro foi terminado (posted_at da API, 16/11).
setTimeout(async () => {
  try {
    if (!connected() || !socialProfile || (db.prefs && db.prefs.rvPostedSync)) return;
    await publishAllReviews();
    db.prefs = { ...(db.prefs || {}), rvPostedSync: 1 }; save();
  } catch (err) { console.warn('reenviar avaliações', err); }
}, 8000);
