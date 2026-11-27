// ---------- v2: sinopse errada guardada no livro é refeita (Bia, 26/11) ----------
// Livros adicionados quando o catálogo tinha dados ruins guardaram em e.meta uma "sinopse" que é a classificação do
// cadastro de ISBN ("1. Ficção americana") ou uma sinopse de outra edição em inglês num livro em português.
// Ao abrir o app, para cada livro: se a sinopse guardada é lixo (curta demais ou no formato "1. Assunto") ou, num livro em
// português, está claramente em inglês, o registro do catálogo guardado no livro (e.meta) é descartado e o app busca de
// novo (a página do livro mostra "Buscando a sinopse…"). Cadastro manual nunca é mexido; páginas, status e progresso do
// livro ficam como estão. Uma vez por abertura do app.
{ const EN = /\b(the|and|of|with|whom|is|has|she|her|his|they|their|from|into|this|that)\b/gi, PT = /\b(que|não|uma|com|para|ela|ele|seu|sua|mas|como|dos|das|pelo|pela|também|entre|sobre|até)\b/gi;
  const english = (t) => { const s = String(t || ''); const en = (s.match(EN) || []).length, pt = (s.match(PT) || []).length; return en >= 4 && en > pt * 2; };
  const junk = (t) => { const s = String(t || '').trim(); return s.length > 0 && (s.length < 60 || /^\d+\.\s/.test(s)); };
  const run = () => { try { let n = 0;
      for (const e of lib()) { const m = e.meta; if (!m || !m.desc || m.src === 'Cadastro manual') continue;
        let pt = false; try { pt = bookLang(e) === 'pt'; } catch {}
        if (junk(m.desc) || (pt && english(m.desc))) { delete e.meta; n++; } }
      if (n) { save(); console.info('sinopses refeitas', n); } } catch (err) { console.warn('sinopse limpa', err); } };
  setTimeout(run, 4000);
}
