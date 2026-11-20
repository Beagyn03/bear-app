// Top 5 (Bia, 16/11): a seção "Melhores avaliados" do perfil passa a ser o top 5 que a pessoa escolhe (o mesmo do primeiro acesso),
// numerado e na ordem dela; no próprio perfil tem "Editar" para trocar livros e mudar a ordem. Sem top 5, continua mostrando os mais bem avaliados.
const top5Books = () => { const t = tasteOf(); return ((t && t.books) || []).slice(0, 5).map((b) => { const e = lib().find((x) => normT(x.title) === normT(b.title)); return { title: b.title, author: b.author || (e && e.author) || null, cover: (e && e.cover) || b.cover || null, p: e ? ((reviewOfLib(e) || {}).paws || 0) : 0 }; }); };
const setTop5 = (books) => { const t = tasteOf() || { genres: [] }; db.prefs = { ...(db.prefs || {}), tasteAsked: 1, taste: { ...t, books: books.slice(0, 5).map((b) => ({ title: b.title, author: b.author || null, cover: typeof b.cover === 'string' && /^https:/.test(b.cover) ? b.cover : null })), at: new Date().toISOString() } }; save(); try { localStorage.removeItem('bear.pv'); } catch {} };
{ const st = document.createElement('style'); st.textContent = `
.t5-row{display:flex;gap:.7rem;overflow-x:auto;padding:.55rem .2rem .6rem .55rem;margin-left:-.2rem;scrollbar-width:none}.t5-row::-webkit-scrollbar{display:none}
.t5-bk{position:relative;flex:none;display:flex;flex-direction:column;align-items:center;gap:.2rem;border:0;background:none;padding:0;color:var(--ink);font:inherit}
.t5-bk .cv{width:76px;height:114px;border-radius:4px 7px 7px 4px}
.t5-bk em{position:absolute;top:-6px;left:-6px;z-index:6;width:24px;height:24px;border-radius:50%;background:var(--acc);color:var(--on-acc,#fff);font-style:normal;font-weight:900;font-size:.8rem;line-height:24px;text-align:center;box-shadow:0 2px 4px rgba(0,0,0,.3)}
.t5-bk small{font-size:.74rem;font-weight:800;color:var(--ink-2)}
.t5-empty{display:grid;gap:.15rem;width:100%;text-align:left;border:1.5px dashed var(--line);border-radius:14px;padding:.75rem .85rem;background:none;color:var(--ink);font:inherit;margin-bottom:.8rem}.t5-empty b{font-size:.92rem}.t5-empty small{color:var(--ink-2);font-size:.8rem}
.t5-ed{display:grid;gap:.45rem;margin:.4rem 0 .6rem}
.t5-it{display:grid;grid-template-columns:24px 38px 1fr auto;gap:.55rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.4rem .5rem;background:var(--panel)}
.t5-it em{font-style:normal;font-weight:900;color:var(--acc);text-align:center}.t5-it .cv{width:38px;height:56px;border-radius:4px}
.t5-it b{font-size:.86rem;display:block}.t5-it small{font-size:.74rem;color:var(--ink-2)}
.t5-it span.bt{display:flex;gap:.15rem}.t5-it span.bt button{width:34px;height:34px;border-radius:10px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-weight:900}
.t5-it span.bt button:disabled{opacity:.3}
`; TR.append(st); }
// resumo publicado: Melhores avaliados = top 5 (marcado com top5 para quem visita)
{ const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) {
  _ps.apply(this, arguments);
  const t = top5Books(); if (!t.length) return;
  snapshot.shelf.potinho = t.map((b) => ({ title: b.title, author: b.author, cover: b.cover && !/^data:/.test(b.cover) && b.cover.length < 600 ? b.cover : null, p: b.p })); snapshot.shelf.top5 = 1;
}; }
function editTop5() {
  let list = top5Books();
  const wrap = document.createElement('div'); wrap.className = 'sheet';
  wrap.innerHTML = '<div class="box"><form class="form"><h3>Seu top 5</h3><p class="hint">Os livros que mais marcaram você, na ordem que quiser. Aparecem no seu perfil e o app usa para indicar leituras.</p><div class="t5-ed"></div><button type="submit" class="primary">Salvar</button><button type="button" class="cancel">Cancelar</button></form></div>';
  const f = wrap.querySelector('form'), box = wrap.querySelector('.t5-ed');
  const draw = () => {
    box.innerHTML = list.map((b, i) => '<div class="t5-it"><em>' + (i + 1) + '</em>' + cvh(b.title, b.cover) + '<span><b>' + esc(b.title) + '</b><small>' + esc(b.author || '') + '</small></span><span class="bt"><button type="button" data-up="' + i + '"' + (i ? '' : ' disabled') + ' aria-label="Subir">↑</button><button type="button" data-dn="' + i + '"' + (i < list.length - 1 ? '' : ' disabled') + ' aria-label="Descer">↓</button><button type="button" data-rm="' + i + '" aria-label="Tirar">×</button></span></div>').join('')
      + (list.length < 5 ? '<button type="button" class="gs-add" id="t5-add">+ Adicionar livro</button>' : '');
    try { paintCv(box); } catch {}
    box.querySelectorAll('[data-up]').forEach((b) => b.addEventListener('click', () => { const i = +b.dataset.up; [list[i - 1], list[i]] = [list[i], list[i - 1]]; draw(); }));
    box.querySelectorAll('[data-dn]').forEach((b) => b.addEventListener('click', () => { const i = +b.dataset.dn; [list[i + 1], list[i]] = [list[i], list[i + 1]]; draw(); }));
    box.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { list.splice(+b.dataset.rm, 1); draw(); }));
    box.querySelector('#t5-add')?.addEventListener('click', () => searchSheet({ title: 'Um livro do seu top 5', onPick: (it) => { if (it && it.title && !list.some((x) => normT(x.title) === normT(it.title))) list.push({ title: String(it.title).slice(0, 200), author: it.author || null, cover: typeof it.cover === 'string' && /^https:/.test(it.cover) ? it.cover : (typeof it.coverUrl === 'string' ? it.coverUrl : null) }); draw(); } }));
  };
  const close = () => wrap.remove();
  wrap.addEventListener('click', (ev) => { if (ev.target === wrap) close(); }); f.querySelector('.cancel').addEventListener('click', close);
  f.addEventListener('submit', (ev) => { ev.preventDefault(); setTop5(list); try { publishSnapshot(); } catch {} close(); toast('Top 5 salvo'); const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) openMyProfile(); });
  document.body.append(wrap); draw();
}
// perfil: troca "Melhores avaliados" pelo top 5 numerado (no próprio, dos dados do aparelho e com "Editar")
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h) return r;
  const mine = !!d.self, books = mine ? top5Books() : (d.shelf && d.shelf.top5 ? d.shelf.potinho || [] : null);
  const hd = [...v.querySelectorAll('.v3-sh')].find((x) => /^Melhores avaliados/.test(x.textContent.trim()));
  if (!books || !books.length) {
    if (mine) { // ainda sem top 5: convite no lugar (ou antes dos Lidos recentes)
      const html = '<div class="v3-sh t5-h"><b>Top 5</b></div><button type="button" class="t5-empty" id="t5-new"><b>Monte seu top 5</b><small>Escolha os livros que mais marcaram você e a ordem deles.</small></button>';
      const t = document.createElement('template'); t.innerHTML = html;
      const at = hd || [...v.querySelectorAll('.v3-sh')].find((x) => /^Lidos recentes/.test(x.textContent.trim()));
      if (hd) { const nx = hd.nextElementSibling; if (nx && !nx.classList.contains('v3-sh')) nx.remove(); hd.replaceWith(...t.content.childNodes); }
      else if (at) at.before(...t.content.childNodes); else v.querySelector('.sl-body').append(...t.content.childNodes);
      v.querySelector('#t5-new')?.addEventListener('click', editTop5);
    }
    return r;
  }
  const row = '<div class="t5-row">' + books.map((b, i) => '<button type="button" class="t5-bk es-bk" data-book="' + esc(b.title) + '" data-author="' + esc(b.author || '') + '"><em>' + (i + 1) + '</em>' + cvh(b.title, b.cover, 'es-cv') + (b.p ? '<small>' + pawTxt(b.p) + '</small>' : '') + '</button>').join('') + '</div>';
  const head = '<div class="v3-sh t5-h"><b>Top 5</b>' + (mine ? '<button type="button" class="v3-link" id="t5-edit">Editar</button>' : '') + '</div>';
  const t = document.createElement('template'); t.innerHTML = head + row;
  if (hd) { const nx = hd.nextElementSibling; if (nx && !nx.classList.contains('v3-sh')) nx.remove(); hd.replaceWith(...t.content.childNodes); }
  else { const at = [...v.querySelectorAll('.v3-sh')].find((x) => /^Lidos recentes/.test(x.textContent.trim())); if (at) at.before(...t.content.childNodes); else v.querySelector('.sl-body').append(...t.content.childNodes); }
  try { paintCv(v); } catch {}
  v.querySelector('#t5-edit')?.addEventListener('click', editTop5);
  return r;
}; }
// a folha de editar o top 5 fica fora do app (document.body): o estilo precisa estar no document.head (Bia, 17/11)
{ const st = document.createElement('style'); st.textContent = `
.t5-ed{display:grid;gap:.45rem;margin:.4rem 0 .6rem}
.t5-it{display:grid;grid-template-columns:22px 38px minmax(0,1fr) auto;gap:.5rem;align-items:center;border:1px solid var(--line);border-radius:12px;padding:.4rem .5rem;background:var(--panel)}
.t5-it em{font-style:normal;font-weight:900;color:var(--acc);text-align:center}
.t5-it .cv{width:38px!important;height:56px!important;border-radius:4px;display:block;background-color:#8a6a4a;background-size:cover!important;background-position:center!important;background-repeat:no-repeat;font-size:0!important;overflow:hidden;color:transparent}
.t5-it .cv *{display:none!important}
.t5-it > span:not(.bt){min-width:0}.t5-it b{font-size:.86rem;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.t5-it small{display:block;font-size:.72rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.t5-it span.bt{display:flex;gap:.15rem}
html .t5-it span.bt button{width:32px!important;height:32px!important;min-width:0!important;min-height:0!important;border-radius:9px!important;border:1px solid var(--line)!important;background:var(--bg)!important;color:var(--ink)!important;font:inherit;font-weight:900;padding:0!important;display:grid;place-items:center;box-shadow:none!important}
.t5-it span.bt button svg{width:16px;height:16px}
.t5-it span.bt button:disabled{opacity:.3}`; document.head.append(st); }
