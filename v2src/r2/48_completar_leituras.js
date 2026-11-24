// Completar leituras (Bia, 16/11): página para arrumar os lidos que ficaram sem data de início, de fim, páginas ou nota
// (comum depois de importar histórico), para as Estatísticas fazerem sentido. Cada campo salva ao mudar.
{ const st = document.createElement('style'); st.textContent = `
.fx-chips{display:flex;gap:.4rem;flex-wrap:wrap;margin:.3rem 0 .7rem}
.fx-chips button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.35rem .8rem;font:inherit;font-weight:800;font-size:.82rem}
.fx-chips button.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.fx-it{display:grid;grid-template-columns:48px 1fr;gap:.7rem;border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.6rem .65rem;margin-bottom:.55rem}
.fx-it .cv{width:48px;height:72px;border-radius:3px 6px 6px 3px;font-size:.45rem}
.fx-it b{display:block;font-size:.9rem;line-height:1.25}.fx-it .au{font-size:.76rem;color:var(--ink-2)}
.fx-f{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.45rem}.fx-f .fx-rs{grid-column:1/-1}.fx-f select{width:100%;min-width:0;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-size:.82rem;padding:0 .3rem;box-sizing:border-box}
.fx-f label{display:grid;gap:.1rem;font-size:.68rem;font-weight:800;color:var(--ink-2)}
.fx-f input{width:100%;min-width:0;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--bg);color:var(--ink);font:inherit;font-size:.82rem;padding:0 .4rem;box-sizing:border-box}
.fx-f input.miss{border-color:var(--acc);border-style:dashed}
.fx-nt{display:none}
.fx-row2{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:.4rem;font-size:.8rem}
.fx-row2 button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;padding:0}
.fx-pg{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.2rem 0 .7rem;font-size:.82rem;font-weight:800;color:var(--ink-2)}.fx-pg button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:10px;padding:.4rem .75rem;font:inherit;font-weight:800}.fx-pg button:disabled{opacity:.35}
.fx-ok{font-size:.74rem;font-weight:800;color:#2f8a52}
.fx-card{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;width:100%;text-align:left;border:1px dashed var(--acc);border-radius:14px;padding:.7rem .85rem;background:var(--panel);color:var(--ink);font:inherit;margin:0 0 .8rem}
.fx-card b{display:block;font-size:.92rem}.fx-card small{font-size:.8rem;color:var(--ink-2)}
`; TR.append(st); }
const fxMiss = (e) => { const rv = reviewOfLib(e) || {}; return { ini: !e.startedAt, fim: !e.finishedAt, pag: !(Number(e.totalPages) > 0), nota: !rv.paws }; };
const fxCount = () => { const L = lib().filter((e) => e.status === 'LIDO'); return { all: L.length, ini: L.filter((e) => fxMiss(e).ini).length, fim: L.filter((e) => fxMiss(e).fim).length, pag: L.filter((e) => fxMiss(e).pag).length, nota: L.filter((e) => fxMiss(e).nota).length }; };
function openFixReads(filter) {
  const v = $('#shelflist'); closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page');
  let f = filter || (fxCount().ini ? 'ini' : 'todos'), page = 0; const PER = 10; // 10 livros por página
  const NAMES = { ini: 'Sem início', fim: 'Sem fim', pag: 'Sem páginas', nota: 'Sem nota', todos: 'Todos os lidos' };
  const draw = () => {
    const c = fxCount();
    const all = lib().filter((e) => e.status === 'LIDO' && (f === 'todos' || fxMiss(e)[f])).sort((a, z) => String(z.finishedAt || '').localeCompare(String(a.finishedAt || '')));
    const pages = Math.max(1, Math.ceil(all.length / PER)); if (page >= pages) page = pages - 1; const list = all.slice(page * PER, page * PER + PER);
    const nav = all.length > PER ? '<div class="fx-pg"><button type="button" data-pg="-1"' + (page ? '' : ' disabled') + '>‹ Anterior</button><span>' + (page * PER + 1) + '–' + Math.min(all.length, page * PER + PER) + ' de ' + all.length + '</span><button type="button" data-pg="1"' + (page < pages - 1 ? '' : ' disabled') + '>Próxima ›</button></div>' : '';
    v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back">‹ Voltar</button><b>Ajustar leituras</b><span></span></div>'
      + '<p class="hint" style="margin:.1rem 0 .3rem">Preencha o que faltou nos seus lidos (por exemplo, depois de importar o histórico). Cada campo salva sozinho e as Estatísticas usam na hora.</p>'
      + '<div class="fx-chips">' + ['ini', 'fim', 'pag', 'nota', 'todos'].map((k) => '<button type="button" data-f="' + k + '" class="' + (f === k ? 'on' : '') + '">' + NAMES[k] + ' · ' + (k === 'todos' ? c.all : c[k]) + '</button>').join('') + '</div>'
      + nav + (list.length ? list.map((e) => { const m = fxMiss(e), rv = reviewOfLib(e) || {};
        return '<div class="fx-it" data-id="' + esc(e.id) + '">' + cvh(e.title, e.cover, '') + '<div><b>' + esc(e.title) + '</b><span class="au">' + esc(e.author || '') + '</span>'
          + '<div class="fx-f"><label>Comecei em<input type="date" data-k="ini" value="' + esc(e.startedAt || '') + '" class="' + (m.ini ? 'miss' : '') + '"></label><label>Terminei em<input type="date" data-k="fim" value="' + esc(e.finishedAt || '') + '" class="' + (m.fim ? 'miss' : '') + '"></label><label>Páginas<input type="number" inputmode="numeric" min="1" data-k="pag" value="' + (Number(e.totalPages) > 0 ? Number(e.totalPages) : '') + '" class="' + (m.pag ? 'miss' : '') + '"></label><label>Formato<select data-k="fmt">' + [['FISICO', 'Físico'], ['EBOOK', 'E-book'], ['AUDIO', 'Audiolivro']].map(([k, n]) => '<option value="' + k + '"' + ((e.format || 'FISICO') === k ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label><label>Nota<select data-k="nota">' + [['', 'Sem nota']].concat([5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5].map((n) => [String(n), '★ ' + String(n).replace('.', ',')])).map(([k, n]) => '<option value="' + k + '"' + (String(rv.paws || '') === k ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></label><label>Ressaca literária<select data-k="rs">' + [['', 'Não sei'], ['deu', 'Me deu ressaca'], ['curou', 'Curou minha ressaca']].map(([k, n]) => { const cur = rv.ressaca === true ? 'deu' : (rv.ressaca || ''); return '<option value="' + k + '"' + (cur === k ? ' selected' : '') + '>' + n + '</option>'; }).join('') + '</select></label></div>'
          + '<div class="fx-row2"><span class="fx-nt">' + (rv.paws ? esc(pawTxt(rv.paws)) : '<span style="color:var(--ink-2)">Sem nota</span>') + '</span><span class="fx-ok" hidden>Salvo</span><button type="button" data-rate="1">' + (rv.paws ? 'Avaliação ›' : 'Avaliar ›') + '</button></div></div></div>'; }).join('')
        : '<p class="sl-empty">' + (f === 'todos' ? 'Nenhum livro lido ainda.' : 'Nada faltando aqui.') + '</p>') + nav;
    try { paintCv(v); } catch {}
    v.querySelector('.sl-back').addEventListener('click', () => { v.hidden = true; try { refresh(); } catch {} });
    v.querySelectorAll('.fx-chips button').forEach((b) => b.addEventListener('click', () => { f = b.dataset.f; page = 0; draw(); }));
    v.querySelectorAll('.fx-pg button').forEach((b) => b.addEventListener('click', () => { page += Number(b.dataset.pg); draw(); v.scrollTop = 0; }));
    v.querySelectorAll('.fx-it').forEach((row) => {
      const e = lib().find((x) => x.id === row.dataset.id); if (!e) return; const ok = row.querySelector('.fx-ok');
      const flash = () => { ok.hidden = false; clearTimeout(ok._t); ok._t = setTimeout(() => { ok.hidden = true; }, 1400); };
      row.querySelector('select[data-k=rs]')?.addEventListener('change', (ev) => { const v = ev.target.value || null; const rv0 = reviewOfLib(e); if (rv0) { if (v) rv0.ressaca = v; else delete rv0.ressaca; if (e.link && !e.review) { /* avaliação guardada na meta */ } } else if (v) e.review = { paws: 0, mel: [], frase: '', ressaca: v }; save(); try { publishReview(e); } catch {} flash(); });
      row.querySelector('select[data-k=nota]')?.addEventListener('change', (ev) => { const n = Number(ev.target.value) || 0; let rv0 = reviewOfLib(e);
        if (!rv0) { if (!n) return; e.review = { paws: n, mel: [], frase: '' }; rv0 = e.review; } else rv0.paws = n;
        save(); try { publishReview(e); } catch {} const t = row.querySelector('.fx-nt'); if (t) t.innerHTML = n ? esc(pawTxt(n)) : '<span style="color:var(--ink-2)">Sem nota</span>';
        const rb = row.querySelector('[data-rate]'); if (rb) rb.textContent = n ? 'Avaliação ›' : 'Avaliar ›'; flash(); });
      row.querySelector('select[data-k=fmt]')?.addEventListener('change', (ev) => { setFormat(e, { format: ev.target.value }); save(); flash(); });
      row.querySelectorAll('input').forEach((inp) => inp.addEventListener('change', () => {
        const k = inp.dataset.k, val = inp.value.trim();
        if (k === 'ini' || k === 'fim') {
          if (val && val > todayISO()) { toast('A data não pode ser no futuro'); inp.value = (k === 'ini' ? e.startedAt : e.finishedAt) || ''; return; }
          const ini = k === 'ini' ? val : e.startedAt, fim = k === 'fim' ? val : e.finishedAt;
          if (ini && fim && ini > fim) { toast('O início precisa ser antes do fim'); inp.value = (k === 'ini' ? e.startedAt : e.finishedAt) || ''; return; }
          if (k === 'ini') { if (val) e.startedAt = val; else delete e.startedAt; } else if (val) { e.finishedAt = val; delete e.noDate; delete e.dateApprox; }
        } else { const n = Math.round(Number(val)); if (n > 0 && n < 100000) { if (Number(e.totalPages) !== n) { e.pagesOwn = 1; delete e.pagesAuto; } e.totalPages = n; } else if (!val) delete e.totalPages; else { inp.value = e.totalPages || ''; return; } }
        inp.classList.toggle('miss', !val); save(); flash();
      }));
      row.querySelector('[data-rate]').addEventListener('click', () => rateForm(e, { logs: [] }, () => { draw(); try { renderHome(todayISO()); } catch {} }));
    });
  };
  S.listRedraw = draw; draw(); v.hidden = false; v.scrollTop = 0;
}
// atalho nas Estatísticas quando falta algo (data de início é o que mais pesa nas contas)
{ const _dt = drawTab; drawTab = function () {
  const r = _dt.apply(this, arguments);
  try {
    if (S.tab !== 'progresso') return r; const box = $('#lista'); if (!box || box.querySelector('.fx-card')) return r;
    const c = fxCount(), miss = c.ini + c.fim + c.pag; if (!c.all) return r;
    const parts = [c.ini ? plural(c.ini, 'sem data de início', 'sem data de início') : '', c.fim ? c.fim + ' sem data de fim' : '', c.pag ? c.pag + ' sem páginas' : ''].filter(Boolean);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'fx-card';
    b.innerHTML = '<span><b>Ajustar leituras</b><small>' + (miss ? esc(parts.join(' · ')) + '. Preencha para as estatísticas ficarem certas.' : 'Datas, páginas, formato e nota dos seus lidos.') + '</small></span><span>›</span>'; if (!miss) b.style.borderStyle = 'solid';
    b.addEventListener('click', () => openFixReads());
    const first = box.querySelector('.ys') || box.firstElementChild; if (first) first.before(b); else box.prepend(b);
  } catch (err) { console.warn('completar leituras', err); }
  return r;
}; }
// Textos com espaços sobrando ("Mark     Miller", " Título ") viram um só, venham de onde vierem (16/11):
// ao adicionar qualquer livro (busca, importação, catálogo, estante) e nos livros já salvos (título, autor, editora).
const tidyTxt = (x) => (typeof x === 'string' ? x.replace(/\s+/g, ' ').trim() : x);
{ const _atlT = addToLibrary; addToLibrary = function (item) { if (item && typeof item === 'object') { if (item.title) item.title = tidyTxt(item.title); if (item.author) item.author = tidyTxt(item.author); if (item.publisher) item.publisher = tidyTxt(item.publisher); } const e = _atlT.apply(this, arguments); try { if (e) { e.title = tidyTxt(e.title); if (e.author) e.author = tidyTxt(e.author); } } catch {} return e; }; }
const tidyAll = () => { try { let n = 0; const bad = /\s{2,}|^\s|\s$/; for (const e of lib()) for (const k of ['title', 'author', 'publisher']) { if (typeof e[k] === 'string' && bad.test(e[k])) { e[k] = tidyTxt(e[k]); n++; } } for (const g of (db.goals || [])) for (const b of (g.books || [])) for (const k of ['title', 'author']) { if (typeof b[k] === 'string' && bad.test(b[k])) { b[k] = tidyTxt(b[k]); n++; } } if (n) save(); } catch {} };
setTimeout(tidyAll, 2000); setInterval(tidyAll, 60000);
