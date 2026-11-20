// Ajustes de 15/11 (rodada 3): conquistas revisadas, começar a ler assume livro físico, @usuário garantido
// e capas que faltam buscadas numa edição do mesmo idioma do livro.

// 1. Conquistas: saem as que repetiam a arte (pote de mel e urso) e as fáceis de burlar.
//    Quem já ganhou continua com ela (legacy: aparece como ganha, não entra mais para quem não tem).
{ const OUT = ['comentar5', 'curtir10', 'case1']; const seen = new Set((db.prefs && db.prefs.achSeen) || []);
  for (const id of OUT) { const i = ACHIEVEMENTS.findIndex((a) => a.id === id); if (i < 0) continue; if (seen.has(id)) ACHIEVEMENTS[i] = { ...ACHIEVEMENTS[i], legacy: true }; else ACHIEVEMENTS.splice(i, 1); } }

// 2. Começar um livro assume Livro físico; trocar o formato continua no menu do livro (Detalhes › Formato).
{ const _af = askFormat; askFormat = function (cb, title) { if (!title) return cb({ format: 'FISICO', device: null }); return _af.apply(this, arguments); }; }

// 3. @usuário garantido: toda conta sem perfil ganha um @ automático ao abrir o app ou entrar.
async function ensureHandle() {
  if (!connected()) return null;
  try {
    const r = await sapi('GET', '/v1/me/profile');
    if (r.status === 200 && r.data && r.data.handle) { socialProfile = r.data; return r.data; }
    if (r.status !== 404) return null; // sem rede ou API dormindo: tenta na próxima abertura
    socialProfile = null;
    const nm = (db.profile && db.profile.name) || (NAME !== 'Você' ? NAME : '') || '';
    const p = await autoHandle(nm, apiCfg.email);
    if (p) { try { publishSnapshotSoon(); } catch {} try { renderProfile(); paintGtop(); } catch {} }
    return p;
  } catch { return null; }
}
window.bearEnsureHandle = ensureHandle;
setTimeout(ensureHandle, 2500);
{ const _ar = afterRegister; afterRegister = function (name, email) { _ar.apply(this, arguments); setTimeout(() => { if (!socialProfile) ensureHandle(); }, 9000); }; }

// 4. Capas que faltam: procura uma edição com capa no MESMO idioma do livro.
const LANG3 = { pt: 'por', en: 'eng', es: 'spa', fr: 'fre', de: 'ger', it: 'ita' };
function bookLang(e) {
  const m = String((e.meta && e.meta.lang) || e.lang || '').toLowerCase();
  if (m) { if (/^(pt|por)/.test(m)) return 'pt'; if (/^(en|eng)/.test(m)) return 'en'; if (/^(es|spa)/.test(m)) return 'es'; if (/^(fr|fre)/.test(m)) return 'fr'; if (/^(de|ger)/.test(m)) return 'de'; if (/^(it|ita)/.test(m)) return 'it'; }
  let i = String(e.isbn || '').replace(/[^0-9Xx]/g, ''); if (i.length === 10) i = '978' + i;
  if (i.length === 13) {
    if (/^978(85|65|972|989)/.test(i)) return 'pt'; if (/^978(0|1)|^9798/.test(i)) return 'en'; if (/^97884/.test(i)) return 'es';
    if (/^9782|^97910/.test(i)) return 'fr'; if (/^9783/.test(i)) return 'de'; if (/^97888/.test(i)) return 'it';
  }
  const t = ' ' + String(e.title || '').toLowerCase() + ' ';
  const pt = (t.match(/[ãõçâêô]| (o|os|as|de|da|do|das|dos|e|um|uma|no|na|em|para|com|que) /g) || []).length;
  const en = (t.match(/ (the|of|and|an|in|to|for|with|my|your|is) /g) || []).length;
  return en > pt ? 'en' : 'pt';
}
async function olCoverByLang(e, lang) {
  const l3 = LANG3[lang] || 'por', tw = normT(e.title).split(' ').slice(0, 3).join(' '), au = String(e.author || '').split(',')[0];
  const s = await getJSON(`https://openlibrary.org/search.json?limit=3&fields=key,title&q=${encodeURIComponent(`${e.title} ${au}`.trim().slice(0, 120))}`, 10000);
  for (const doc of ((s && s.docs) || []).slice(0, 2)) {
    if (!doc.key || !(normT(doc.title).startsWith(tw) || tw.startsWith(normT(doc.title)))) continue;
    const ed = await getJSON(`https://openlibrary.org${doc.key}/editions.json?limit=200`, 12000);
    const hit = ((ed && ed.entries) || []).find((x) => (x.languages || []).some((l) => l.key === '/languages/' + l3) && (x.covers || []).some((c) => c > 0));
    if (hit) return `https://covers.openlibrary.org/b/id/${hit.covers.find((c) => c > 0)}-M.jpg`;
  }
  return null;
}
fillMissingCovers = async function (manual) {
  if (coverRun) return manual && toast('Já estou procurando as capas');
  const list = lib().filter((e) => !e.cover && !(e.coverTry && e.coverTry === todayISO() && !manual)).slice(0, 400);
  if (!list.length) return manual && toast('Todos os seus livros já têm capa');
  coverRun = true; let n = 0; if (manual) toast(`Procurando capas para ${plural(list.length, 'livro', 'livros')}…`);
  for (const e of list) {
    try {
      const lang = bookLang(e), tw = normT(e.title).split(' ').slice(0, 3).join(' '), au = String(e.author || '').split(',')[0], isbn = String(e.isbn || '').replace(/[^0-9Xx]/g, '');
      let cover = null;
      // a própria edição (pelo ISBN) vale sempre: é o livro que a pessoa tem
      if (isbn.length === 10 || isbn.length === 13) { const b = await getJSON(`${catBase()}/v1/books/isbn/${isbn}`, 12000); if (b && b.cover_url) cover = b.cover_url; }
      // português: catálogo da bear-api (edições em português) e depois Open Library em português
      if (!cover && lang === 'pt') { const d = await getJSON(`${catBase()}/v1/books/search?limit=10&q=${encodeURIComponent(`${e.title} ${au}`.trim().slice(0, 120))}`, 12000); const hit = d && Array.isArray(d.items) && d.items.find((b) => b.cover_url && normT(b.title).startsWith(tw)); if (hit) cover = hit.cover_url; }
      // outros idiomas (e português sem resultado): edição com capa no idioma do livro, pela Open Library
      if (!cover) cover = await olCoverByLang(e, lang);
      if (cover && !e.cover) { e.cover = String(cover).replace(/^http:/, 'https:'); e.coverLang = lang; delete e.coverTry; n++; if (n % 5 === 0) { save(); refresh(); } }
      else if (!e.cover) e.coverTry = todayISO();
    } catch {}
    await new Promise((r) => setTimeout(r, 600));
  }
  coverRun = false; save(); refresh();
  if (manual || n) toast(n ? `${plural(n, 'capa encontrada', 'capas encontradas')}${list.length - n ? ` · ${list.length - n} sem capa no idioma do livro` : ''}` : 'Não encontrei capas no idioma desses livros');
};
