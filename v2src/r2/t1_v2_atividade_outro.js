// Atividade no perfil de OUTRA pessoa como a sua (Bia, teste 20/11 item 32): além das avaliações e do "lendo" do perfil,
// entram os posts e as atividades públicas dela (GET /v1/rede?user=: terminou, começou, trecho, comentário, indicação),
// no mesmo cartão da sua Atividade, sem o •••. Filtros: Tudo · Comentários · Avaliações · Progresso.
{ const _prev = v3Ativ, cache = new Map();
  const stars = (p) => { const n = Math.round(Number(p) || 0); return '<span class="st">' + '★'.repeat(n) + '<u>' + '★'.repeat(5 - n) + '</u></span>'; };
  const when = (iso) => { if (!iso) return ''; try { return /T/.test(iso) ? relTime(iso) : exD(iso); } catch { return String(iso).slice(0, 10); } };
  const map = (it) => { const b = it.book || {}, pg = it.page || null, pct = it.readerPct;
    if (it.type === 'review') { const s = it.bookStatus; const p = s === 'ABANDONEI' ? ['ab', 'Abandonou'] : s === 'HIBERNANDO' ? ['pa', 'Pausou'] : ['av2', 'Avaliou ' + (it.paws ? stars(it.paws) : '')];
      return { f: 'aval', c: p[0], a: p[1], t: b.title, cv: b.cover, tx: it.spoiler ? 'Tem spoiler: abra o livro para ver.' : (it.text || ''), at: it.createdAt || it.updatedAt }; }
    if (it.type === 'activity') return { f: 'prog', c: it.act === 'FINISHED' ? 'te' : 'le', a: it.act === 'FINISHED' ? 'Terminou' : it.act === 'STARTED' ? 'Começou' : 'Lendo' + v2PctTxt(it.pct, it.pages, b.title, ' · '), t: b.title, cv: b.cover, tx: '', at: it.createdAt };
    if (it.kind === 'rec') return { f: 'coment', c: 'in', a: 'Indicou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt };
    if (it.kind === 'quote') return { f: 'coment', c: 'le', a: 'Trecho' + v2PctTxt(pct, pg, b.title, ' · '), t: b.title, cv: b.cover, tx: it.quote ? '“' + it.quote + '”' : (it.text || ''), at: it.createdAt };
    if (pct === 100) return { f: 'prog', c: 'te', a: 'Terminou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt };
    if (pg || pct != null) return { f: 'prog', c: 'le', a: 'Lendo' + v2PctTxt(pct, pg, b.title, ' · '), t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt };
    return { f: 'coment', c: 'co', a: 'Comentou', t: b.title, cv: b.cover, tx: it.text || '', at: it.createdAt }; };
  const F = [['tudo', 'Tudo'], ['coment', 'Comentários'], ['aval', 'Avaliações'], ['prog', 'Progresso']];
  v3Ativ = function (d, host) {
    if (!d || d.self || !d.handle || !vFn('comunidade')) return _prev.apply(this, arguments);
    const h = d.handle, f = F.some(([k]) => k === S.v3atf) ? S.v3atf : 'tudo';
    const paint = (items) => { if (!host.isConnected) return;
      let L = (items || []).map(map);
      const seen = new Set(L.filter((x) => x.f === 'aval').map((x) => normT(x.t || '')));
      (d.reviews || []).forEach((r) => { const t = (r.book && r.book.title) || r.title || ''; if (seen.has(normT(t))) return; L.push(map({ type: 'review', ...r, book: r.book || { title: t, cover: r.cover } })); });
      const rd = new Set(L.filter((x) => x.f === 'prog').map((x) => normT(x.t || '')));
      (d.reading || []).forEach((b) => { if (rd.has(normT(b.title || ''))) return; L.push({ f: 'prog', c: 'le', a: 'Lendo · ' + Math.round(Number(b.pct) || 0) + '%', t: b.title, cv: b.cover, tx: '', at: '' }); });
      L.sort((a, b) => String(b.at || '').localeCompare(String(a.at || '')));
      const V = L.filter((x) => f === 'tudo' || x.f === f).slice(0, 40);
      const html = '<div class="v8atc">' + F.map(([k, n]) => '<button type="button" data-af="' + k + '" class="' + (f === k ? 'on' : '') + '">' + n + '</button>').join('') + '</div>'
        + (V.length ? V.map((x, i) => '<div class="v8mp"><button type="button" class="pcv" data-bk="' + i + '" aria-label="' + esc(x.t || '') + '">' + cvh(x.t || '', x.cv || null, '') + '</button><div class="tx"><span class="v8pa ' + x.c + '">' + x.a + '</span>' + (x.tx ? '<p>' + esc(String(x.tx).slice(0, 280)) + '</p>' : '<p>' + esc(x.t || '') + '</p>') + '<small>' + esc(when(x.at)) + '</small></div></div>').join('')
          : '<p class="v2wempty">' + (items ? 'Nada por aqui ainda.' : 'Carregando…') + '</p>');
      if (host.dataset.v8 === html) return; host.dataset.v8 = html; host.innerHTML = html; try { paintCv(host); } catch {}
      host.querySelectorAll('[data-af]').forEach((b) => b.addEventListener('click', () => { S.v3atf = b.dataset.af; v3Ativ(d, host); }));
      host.querySelectorAll('[data-bk]').forEach((b) => b.addEventListener('click', () => { const x = V[+b.dataset.bk]; if (!x || !x.t) return; try { const e = lib().find((y) => normT(y.title) === normT(x.t)); if (e) return openBookPage(e); } catch {} try { openAnyBook(x.t, '', x.cv || null); } catch {} })); };
    const c = cache.get(h); paint(c ? c.items : (d.reviews || d.reading ? [] : null));
    if (c && Date.now() - c.t < 60000) return;
    cache.set(h, { t: Date.now(), items: c ? c.items : [] });
    sapi('GET', '/v1/rede?user=' + encodeURIComponent(h)).then((r) => { if (r && r.status === 200 && r.data) { const items = (r.data.items || []).filter((x) => x && x.user && x.user.handle === h && ['post', 'review', 'activity'].includes(x.type)); cache.set(h, { t: Date.now(), items }); paint(items); } }).catch(() => {});
  };
}
