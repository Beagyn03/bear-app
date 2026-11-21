// Resultados da busca de livro (Bia, 21/11; busca do Top 3 "Um livro que você amou" e qualquer busca por folha):
// cada resultado mostra a EDIÇÃO: autor · editora (quando existe) e páginas · idioma · ano. A fonte ("Livroverso",
// "Open Library", "Google Livros") sai da linha: não ajuda a escolher. A capa é só a da própria edição; sem capa
// própria, fica a capa genérica do app (nunca uma capa herdada de outro livro com o mesmo título).
const LV_LANG = { pt: 'Português', en: 'Inglês', es: 'Espanhol', fr: 'Francês', it: 'Italiano', de: 'Alemão', ja: 'Japonês', ko: 'Coreano', zh: 'Chinês', ru: 'Russo' };
function lvEdLines(it) {
  let lg = ''; try { lg = typeof langOf === 'function' ? langOf(it) : String(it.lang || '').slice(0, 2).toLowerCase(); } catch {}
  let pub = it.publisher || (it._meta && it._meta.pub) || ''; if (pub && it.author && normT(pub) === normT(it.author)) pub = ''; // autopublicação: não repete o nome
  const l1 = [it.author, pub].filter(Boolean).join(' · ');
  const l2 = [it.pages ? it.pages + ' páginas' : 'páginas não informadas', LV_LANG[lg] || '', it.year || ''].filter(Boolean).join(' · ');
  return [l1, l2];
}
searchSheet = function (opts) {
  // el com propriedades (o "el" visível aqui é o outro, de assinatura diferente)
  const el = (tag, props = {}, kids = []) => { const n = document.createElement(tag); for (const [k, v] of Object.entries(props)) { if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else if (k.startsWith('on')) n.addEventListener(k.slice(2), v); else n.setAttribute(k, v); } for (const c of kids) n.append(c); return n; };
  const close = () => wrap.remove();
  const q = el('input', { type: 'search', name: 'q', placeholder: 'Título, autor ou ISBN', autocomplete: 'off', enterkeyhint: 'search' });
  const msg = el('p', { class: 'hint' }), res = el('div', { class: 'results' });
  const form = el('form', { class: 'form' }, [
    el('h3', { text: opts.title || 'Adicionar livro' }),
    el('div', { class: 'srch' }, [q, el('button', { type: 'submit', class: 'primary', text: 'Buscar' })]),
    msg, res,
    el('button', { type: 'button', text: 'Não achei: cadastrar à mão', onclick: () => { close(); manualBookSheet(opts.onPick); } }),
    el('button', { type: 'button', class: 'cancel', text: 'Fechar', onclick: close }),
  ]);
  let seq = 0, typeT = null;
  q.addEventListener('input', () => { clearTimeout(typeT); const t = q.value.trim(); if (t.length < 3) { if (!t) { res.replaceChildren(); msg.textContent = ''; } return; } typeT = setTimeout(() => form.requestSubmit(), 450); });
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault(); clearTimeout(typeT);
    const t = q.value.trim(); if (t.length < 2) return;
    const my = ++seq; msg.textContent = 'Buscando…';
    const items = await searchBooks(t);
    if (my !== seq) return;
    res.replaceChildren();
    msg.textContent = items.length ? 'Toque no livro certo:' : (navigator.onLine === false ? 'Sem internet agora. Tente de novo quando conectar.' : (S.searchLimited ? 'Busca limitada no momento: as bases de livros estão sobrecarregadas. Tente de novo em alguns minutos ou busque pelo ISBN. Ou cadastre à mão.' : 'Nada encontrado nas bases de livros. Tente só o título, o título com o autor, ou cadastre à mão.'));
    for (const it of items) {
      const [l1, l2] = lvEdLines(it);
      res.append(el('button', { type: 'button', class: 'result', onclick: async () => {
        msg.textContent = 'Preparando a capa…';
        const cover = it.coverUrl ? await toDataCover(it.coverUrl) : null;
        close(); opts.onPick({ title: it.title, author: it.author, totalPages: it.pages, cover, isbn: it.isbn });
      } }, [
        it.coverUrl ? el('img', { src: it.coverUrl, alt: '', loading: 'lazy' }) : el('div', { class: 'cover blank', style: `--hue:${hueOf(it.title)}` }),
        el('div', {}, [el('b', { text: it.title }), ...(l1 ? [el('span', { text: l1 })] : []), el('span', { text: l2 })]),
      ]));
    }
  });
  const wrap = el('div', { class: 'sheet', onclick: (ev) => { if (ev.target === wrap) close(); } }, [el('div', { class: 'box tall' }, [form])]);
  document.body.append(wrap); q.focus();
};
