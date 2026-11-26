// ---------- v2: "Para você" que acompanha o que você lê e muda todo dia (Bia, 26/11) ----------
// Antes: só os gostos do cadastro (gêneros + top 5), busca do Google feita pelo celular (que vive no limite e cai na mesma
// reserva) e cache que só mudava se os gostos mudassem — a lista ficava igual por semanas.
// Agora:
//  - sinais do que a pessoa lê: autoria dos livros lidos e em andamento, com peso para nota alta (4 ou mais) e para o
//    que é recente; nota baixa (menos de 3) tira peso. Os gostos do cadastro continuam somando.
//  - busca pela bear-api (/v1/books/search, chave própria no servidor), um pedido por autoria (até 5), e os resultados
//    antigos por gênero (tasteRecs de antes) entram junto.
//  - nada que já está na Biblioteca; nada repetido; só com capa.
//  - o conjunto vale 3 dias; a vitrine do dia é um recorte que gira todo dia (dia do ano), então muda mesmo sem buscar.
{ const _old = tasteRecs;
  const tk = (t) => normT(String(t || '').split(/s[-–]s|[:([]/)[0]);
  const W = (e) => { let p = 0; try { p = Number((reviewOfLib(e) || {}).paws) || 0; } catch {} return (e.status === 'LENDO' ? 2 : 1) * (p >= 4.5 ? 3 : p >= 4 ? 2 : p && p < 3 ? -1 : 1); };
  const first = (a) => String(a || '').split(/[,;&]| e /)[0].trim();
  function pvSignals() {
    const L = lib() || [], t = (typeof tasteOf === 'function' && tasteOf()) || { genres: [], books: [] };
    const recent = L.filter((e) => e.status === 'LIDO' || e.status === 'LENDO').sort((a, b) => String(b.finishedAt || b.startedAt || b.addedAt || '').localeCompare(String(a.finishedAt || a.startedAt || a.addedAt || ''))).slice(0, 40);
    const A = new Map(); recent.forEach((e, i) => { const a = first(e.author); if (!a) return; A.set(a, (A.get(a) || 0) + W(e) * (i < 10 ? 1.5 : 1)); });
    (t.books || []).forEach((b) => { const a = first(b.author); if (a) A.set(a, (A.get(a) || 0) + 1); });
    const authors = [...A.entries()].filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]).slice(0, 5).map((x) => x[0]);
    return { authors, key: JSON.stringify(['pv3', authors, t.genres || [], (t.books || []).map((b) => b.title)]) };
  }
  const dayN = () => Math.floor(Date.parse(todayISO()) / 864e5);
  async function pvPool(sig) {
    const cacheKey = 'bear.pv4'; // pv4: só português (26/11)
    try { const c = JSON.parse(localStorage.getItem(cacheKey) || 'null'); if (c && c.key === sig.key && dayN() - c.day < 3 && Array.isArray(c.items) && c.items.length >= 8) return c.items; } catch {}
    const lists = await Promise.all(sig.authors.map(async (a) => { try {
      const r = await sapi('GET', '/v1/books/search?q=' + encodeURIComponent(a)); const it = (r && r.status === 200 && r.data && r.data.items) || [];
      const sur = normT(a.split(' ').slice(-1)[0] || a);
      return it.filter((b) => b && b.title && b.cover_url && /^pt/i.test(String(b.language || '')) && (b.authors || []).some((x) => normT(x).includes(sur))).map((b) => ({ title: String(b.title).split(':')[0].trim(), author: (b.authors || [])[0] || a, coverUrl: b.cover_url, isbn: b.isbn || null }));
    } catch { return []; } }));
    let old = []; try { old = (await _old.apply(this, [])) || []; } catch {}
    // a lista antiga não traz idioma: fora títulos com palavras típicas de inglês, alemão ou espanhol (Bia 26/11: só português)
    const FORA = /(the|of|and|every|your|my|with|for|from|this|that|der|die|das|und|el|los|las|del|y)/i;
    lists.push(old.filter((x) => x && x.title && !FORA.test(x.title)).map((x) => ({ ...x })));
    const mine = new Set((lib() || []).flatMap((e) => [tk(e.title), tk(e.meta && (e.meta.origTitle || e.meta.title))]).filter(Boolean)), seen = new Set(), out = [];
    const side = /\b(box|kit|colecao|resumo|guia|edicao comentada|livro de colorir|box set)\b/;
    // intercala as listas (uma de cada autoria por vez) para a vitrine não ficar com um autor só
    for (let i = 0; out.length < 60 && i < 25; i++) for (const L of lists) { const it = L[i]; if (!it || !it.title || !it.coverUrl) continue; const n = tk(it.title); if (!n || seen.has(n) || mine.has(n) || side.test(normT(it.title))) continue; seen.add(n); out.push(it); }
    if (out.length) { try { localStorage.setItem(cacheKey, JSON.stringify({ key: sig.key, day: dayN(), items: out })); } catch {} }
    return out;
  }
  tasteRecs = async function () {
    try {
      const sig = pvSignals(); if (!sig.authors.length) return await _old.apply(this, arguments);
      const pool = await pvPool(sig); if (!pool.length) return await _old.apply(this, arguments);
      const mine = new Set((lib() || []).flatMap((e) => [tk(e.title), tk(e.meta && (e.meta.origTitle || e.meta.title))]).filter(Boolean)), ok = pool.filter((x) => !mine.has(tk(x.title)));
      const n = ok.length, start = n ? (dayN() * 7) % n : 0; // gira todo dia
      return ok.slice(start).concat(ok.slice(0, start)).slice(0, 40);
    } catch (err) { console.warn('para você', err); return _old.apply(this, arguments); }
  };
}
