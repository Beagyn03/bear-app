// Enquete no Novo post mais simples (Bia, 22/11: "quando é enquete acho que o formulário tá complexo"). Com Enquete
// escolhida: cabeçalho "Enquete ×" no lugar dos chips de Acrescentar; a pergunta no topo e o livro vira o link "Sobre um
// livro?"; cada opção é um campo só (digita texto ou escolhe livro pelas sugestões da Biblioteca e do catálogo), sem botão
// "Livro" nem microfone; "+ Outra opção" logo abaixo (até 4, com × nas extras); prazo numa linha ("Encerra em 3 dias ▾");
// "Tem spoiler?" recolhido num link; sem o texto explicativo. A leitura conjunta ("Votar o próximo livro") segue igual.
{
  const st = document.createElement('style');
  st.textContent = `
.rdc2.ze-poll>.rdc2-l,.rdc2.ze-poll>.rdc2-tools,.rdc2.ze-poll>.rdc2-hint{display:none!important}
.rdc2.ze-poll>.ze-ph{order:-3}.rdc2.ze-poll>.rdc2-tx{order:-2}.rdc2.ze-poll>.rdc2-pick,.rdc2.ze-poll>.rdc2-bk{order:-1}
.ze-ph{display:flex;align-items:center;justify-content:space-between;gap:.6rem}
.ze-ph b{display:inline-flex;align-items:center;gap:.45rem;font-size:.95rem;font-weight:900;color:var(--tx-acc,var(--acc))}
.ze-ph button{min-width:44px;min-height:40px;border:1px solid var(--line);border-radius:99px;background:none;color:var(--ink);font:inherit;font-size:1.15rem;cursor:pointer}
.rdc2.ze-poll>.rdc2-pick{justify-self:start;justify-content:flex-start!important;width:auto!important;min-height:40px;margin-top:-.35rem;padding:0 .2rem!important;border:0!important;background:none!important;color:var(--tx-acc,var(--acc))!important;font-size:.86rem!important;font-weight:800;box-shadow:none!important}
.rdc2.ze-poll>.rdc2-pick>span{display:none}
.rdc2.ze-poll .rdc2-tx textarea{min-height:0}
.lvpl-ed.ze-ed{gap:.5rem;margin:0}
.ze-ed .row{position:relative}
.ze-ed input[type=text]{padding-right:.7rem}
.ze-ed .ib.x{min-width:40px;min-height:40px;border:0;font-size:1.1rem;color:var(--ink-2)}
.ze-ed .add{min-height:40px;padding:0 .2rem;margin-top:-.15rem}
.ze-sg{display:grid;gap:.25rem;margin:-.15rem 0 .1rem;padding:.3rem;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.ze-sg[hidden]{display:none}
.ze-sg button{display:flex;align-items:center;gap:.55rem;min-height:44px;padding:.25rem .45rem;border:0;border-radius:9px;background:none;color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.ze-sg button:hover,.ze-sg button:focus-visible{background:color-mix(in srgb,var(--acc) 12%,transparent)}
.ze-sg .cv,.ze-sg img{width:24px;height:36px;flex:none;border-radius:4px;object-fit:cover}
.ze-sg span{min-width:0;display:grid;font-size:.86rem;font-weight:800;line-height:1.2}.ze-sg small{font-weight:600;color:var(--ink-2);font-size:.74rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ze-sg .t{font-size:.72rem;font-weight:800;color:var(--ink-2);padding:.15rem .45rem 0;letter-spacing:.04em;text-transform:uppercase}
.ze-dur{justify-self:start;display:inline-flex;align-items:center;gap:.35rem;min-height:40px;padding:0 .85rem;border:1px solid var(--line);border-radius:99px;background:none;color:var(--ink);font:inherit;font-size:.86rem;font-weight:800;cursor:pointer}
.ze-dur i{font-style:normal;color:var(--ink-2)}
.rdc2.ze-poll>.rdc-sp:not(.ze-open){display:none}
.ze-spl{justify-self:start;min-height:40px;padding:0 .2rem;border:0;background:none;color:var(--ink-2);font:inherit;font-size:.84rem;font-weight:800;text-decoration:underline;cursor:pointer}
.rdc2:not(.ze-poll)>.ze-spl{display:none}
`;
  TR.appendChild(st);

  const durTxt = (k) => k === '0' ? 'Sem prazo' : 'Encerra em ' + ((plDurs.find((d) => d[0] === k) || [, '3 dias'])[1]);
  const isComposer = (sug) => sug === undefined; // o composer chama sem sugestões; a leitura conjunta passa o Quero ler

  const _html = plEditorHTML;
  plEditorHTML = function (E, sug) {
    if (!isComposer(sug)) return _html.apply(this, arguments);
    const row = (o, i) => o.book
      ? `<div class="row"><div class="bk">${cvh(o.book.title, o.book.cover)}<b>${esc(o.book.title)}</b></div><button type="button" class="ib x" data-zeclr="${i}" aria-label="Tirar o livro da opção ${i + 1}">×</button></div>`
      : `<div class="row"><input type="text" maxlength="90" data-plopt="${i}" placeholder="Opção ${i + 1}: texto ou livro" value="${esc(o.label || '')}" aria-label="Opção ${i + 1}" autocomplete="off" enterkeyhint="next">${i >= 2 ? `<button type="button" class="ib x" data-plrm="${i}" aria-label="Tirar a opção ${i + 1}">×</button>` : ''}</div><div class="ze-sg" data-zesg="${i}" hidden></div>`;
    return `<div class="lvpl-ed ze-ed">${E.opts.map(row).join('')}${E.opts.length < 4 ? '<button type="button" class="add" data-pladdopt>+ Outra opção</button>' : ''}
      <button type="button" class="ze-dur" data-zedur aria-label="Prazo da enquete: ${esc(durTxt(E.dur))}">${esc(durTxt(E.dur))} <i>▾</i></button></div>`;
  };

  const _bind = plBindEditor;
  plBindEditor = function (root, E, redraw, sug) {
    if (!isComposer(sug)) return _bind.apply(this, arguments);
    const pick = (i, bk) => { const o = E.opts[i]; o.book = bk; o.label = bk.title; redraw(); };
    root.querySelectorAll('[data-plopt]').forEach((x) => {
      const i = +x.dataset.plopt, box = root.querySelector(`[data-zesg="${i}"]`); let t1 = null, t2 = null, seq = 0;
      const hide = () => { if (box) { box.hidden = true; box.innerHTML = ''; } };
      x.addEventListener('input', () => {
        E.opts[i].label = x.value; clearTimeout(t1); clearTimeout(t2); const q = x.value.trim(); const my = ++seq;
        if (q.length < 2 || !box) return hide();
        t1 = setTimeout(() => {
          const n = normT(q); const seen = new Set(); const mine = lib().filter((e) => { if (!e.title) return false; const k = normT(e.title); if (!k.includes(n) || seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3);
          const asBook = (e) => ({ title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: smallCoverOk(e.cover) });
          box.innerHTML = mine.length ? '<div class="t">Da sua Biblioteca</div>' + mine.map((e, k) => `<button type="button" data-zem="${k}">${cvh(e.title, e.cover)}<span>${esc(e.title)}${e.author ? `<small>${esc(e.author)}</small>` : ''}</span></button>`).join('') : '';
          box.hidden = !mine.length; box.querySelectorAll('[data-zem]').forEach((b) => b.addEventListener('mousedown', (ev) => ev.preventDefault()));
          box.querySelectorAll('[data-zem]').forEach((b) => b.addEventListener('click', () => pick(i, asBook(mine[+b.dataset.zem]))));
          try { paintCv(box); } catch {}
          if (q.length < 3 || typeof searchBooks !== 'function') return;
          t2 = setTimeout(async () => {
            let items = []; try { items = await searchBooks(q); } catch {}
            if (my !== seq || !x.isConnected) return;
            const have = new Set(mine.map((e) => normT(e.title)));
            items = (items || []).filter((it) => it && it.title && !have.has(normT(it.title))).slice(0, 3); if (!items.length) return;
            box.insertAdjacentHTML('beforeend', '<div class="t">No catálogo</div>' + items.map((it, k) => `<button type="button" data-zec="${k}">${it.coverUrl ? `<img src="${esc(it.coverUrl)}" alt="" loading="lazy">` : cvh(it.title, null)}<span>${esc(it.title)}${it.author ? `<small>${esc(it.author)}</small>` : ''}</span></button>`).join(''));
            box.hidden = false;
            box.querySelectorAll('[data-zec]').forEach((b) => { b.addEventListener('mousedown', (ev) => ev.preventDefault()); b.addEventListener('click', async () => {
              const it = items[+b.dataset.zec]; let cover = null; try { cover = it.coverUrl ? await toDataCover(it.coverUrl) : null; } catch {}
              pick(i, { title: String(it.title).slice(0, 200), author: it.author ? String(it.author).slice(0, 120) : null, cover: smallCoverOk(cover) }); }); });
            try { paintCv(box); } catch {}
          }, 350);
        }, 160);
      });
      x.addEventListener('blur', () => setTimeout(() => { if (!box || !box.contains(root.ownerDocument.activeElement) && !(root.getRootNode().activeElement && box.contains(root.getRootNode().activeElement))) hide(); }, 220));
      x.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && box && !box.hidden) { ev.stopPropagation(); hide(); } if (ev.key === 'Enter') { ev.preventDefault(); const nx = root.querySelector(`[data-plopt="${i + 1}"]`); if (nx) nx.focus(); else x.blur(); } });
    });
    root.querySelectorAll('[data-zeclr]').forEach((x) => x.addEventListener('click', () => { const o = E.opts[+x.dataset.zeclr]; o.book = null; o.label = ''; redraw(); setTimeout(() => root.querySelector(`[data-plopt="${x.dataset.zeclr}"]`)?.focus(), 30); }));
    root.querySelectorAll('[data-plrm]').forEach((x) => x.addEventListener('click', () => { E.opts.splice(+x.dataset.plrm, 1); redraw(); }));
    root.querySelector('[data-pladdopt]')?.addEventListener('click', () => { if (E.opts.length < 4) E.opts.push({ label: '', book: null }); redraw(); setTimeout(() => root.querySelector(`[data-plopt="${E.opts.length - 1}"]`)?.focus(), 30); });
    root.querySelector('[data-zedur]')?.addEventListener('click', (ev) => popMenu(ev.currentTarget, plDurs.map(([k]) => ({ label: (E.dur === k ? '✓ ' : '') + durTxt(k), fn: () => { E.dur = k; redraw(); } }))));
    try { paintCv(root); } catch {}
  };

  // a casca do composer em modo enquete (roda a cada desenho, pelo observador)
  const shell = () => {
    const v = TR.querySelector('#shelflist'); const box = v && v.querySelector('.rdc2'); if (!box) return;
    const q = box.querySelector('.rdc2-t[data-t=question]'); const on = !!(q && q.classList.contains('on'));
    box.classList.toggle('ze-poll', on);
    let ph = box.querySelector(':scope > .ze-ph'), spl = box.querySelector(':scope > .ze-spl');
    if (!on) { ph && ph.remove(); spl && spl.remove(); const pk = box.querySelector(':scope > .rdc2-pick'); if (pk && pk.dataset.ze) { delete pk.dataset.ze; } return; }
    if (!ph) { ph = document.createElement('div'); ph.className = 'ze-ph'; ph.innerHTML = '<b><i class=v3e data-i=ask></i>Enquete</b><button type="button" aria-label="Tirar a enquete">×</button>'; box.prepend(ph); ph.querySelector('button').addEventListener('click', () => box.querySelector('.rdc2-t[data-t=question]')?.click()); }
    const pk = box.querySelector(':scope > .rdc2-pick');
    if (pk && pk.textContent.trim() !== 'Sobre um livro?') { pk.dataset.ze = '1'; [...pk.childNodes].forEach((n) => { if (n.nodeType === 3) n.remove(); }); pk.append('Sobre um livro?'); }
    const sp = box.querySelector(':scope > .rdc-sp');
    if (sp && sp.querySelector('#rdc-sp')?.checked) sp.classList.add('ze-open');
    if (sp && !sp.classList.contains('ze-open') && !spl) { spl = document.createElement('button'); spl.type = 'button'; spl.className = 'ze-spl'; spl.textContent = 'Tem spoiler?'; sp.before(spl);
      spl.addEventListener('click', () => { sp.classList.add('ze-open'); spl.remove(); sp.querySelector('#rdc-sp')?.focus(); }); }
    if (sp && sp.classList.contains('ze-open') && spl) spl.remove();
  };
  new MutationObserver(shell).observe(TR, { childList: true, subtree: true });
}
