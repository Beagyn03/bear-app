// Ressaca literária (Bia, 16/11): na avaliação a pessoa diz se o livro DEU ou CUROU a ressaca.
// Página do livro (Sobre) mostra o termômetro com os votos de todo mundo; na Buscar, atalhos para os livros que curam e que dão ressaca.
S.rsBook = S.rsBook || {};
{ const st = document.createElement('style'); st.textContent = `
.rs-term{border:1px solid var(--line);background:var(--panel);border-radius:14px;padding:.75rem .85rem;margin:0 0 .8rem;display:grid;gap:.45rem}
.rs-term .rs-h{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem}.rs-term .rs-h b{font-size:.95rem}.rs-term .rs-h small{font-size:.75rem;color:var(--ink-2);font-weight:700}
.rs-bar{position:relative;height:14px;border-radius:99px;overflow:hidden;background:var(--line);display:flex}
.rs-bar i{display:block;height:100%}.rs-bar .c{background:linear-gradient(90deg,#2f8a52,#5cc184)}.rs-bar .d{background:linear-gradient(90deg,#b0558f,#7b3fb3)}
.rs-leg{display:flex;justify-content:space-between;font-size:.8rem;font-weight:800}.rs-leg .c{color:#2f8a52}.rs-leg .d{color:#9b4bb0}
.rs-empty{font-size:.82rem;color:var(--ink-2);margin:0}
.rs-link{justify-self:start;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:.82rem;padding:0}
.rs-chips{display:flex;gap:.45rem;flex-wrap:wrap;margin:.6rem 0 .2rem}
.rs-chips button{border:1px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.45rem .9rem;font:inherit;font-weight:800;font-size:.86rem}
.rs-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:.8rem .6rem;margin-top:.6rem}
.rs-list .es-bk{display:flex;flex-direction:column;gap:.25rem;align-items:center;border:0;background:none;padding:0;color:var(--ink);font:inherit}
.rs-list .cv{width:96px;height:144px;border-radius:4px 7px 7px 4px}.rs-list small{font-size:.74rem;font-weight:800;text-align:center;color:var(--ink-2)}
`; TR.append(st); }
const rsKey = (t) => normT(String(t || '').split(/[:(]/)[0]);
async function rsBookData(title) {
  const k = rsKey(title), c = S.rsBook[k]; if (c && Date.now() - c.at < 10 * 60000) return c.d;
  if (!connected()) return null;
  try { const r = await sapi('GET', '/v1/ressaca/book?title=' + encodeURIComponent(String(title).slice(0, 200))); if (r.status !== 200 || !r.data) return null; S.rsBook[k] = { d: r.data, at: Date.now() }; return r.data; } catch { return null; }
}
function rsTermHTML(d) {
  const c = d.curou || 0, de = d.deu || 0, n = c + de;
  if (!n) return '<div class="rs-h"><b>Ressaca literária</b></div><p class="rs-empty">Ninguém votou ainda. Ao avaliar, conte se esse livro deu ou curou a sua ressaca.</p>';
  const pc = Math.round(c / n * 100);
  return '<div class="rs-h"><b>Ressaca literária</b><small>' + plural(n, 'voto', 'votos') + '</small></div>'
    + '<div class="rs-bar" role="img" aria-label="' + c + ' disseram que curou, ' + de + ' que deu ressaca"><i class="c" style="width:' + pc + '%"></i><i class="d" style="width:' + (100 - pc) + '%"></i></div>'
    + '<div class="rs-leg"><span class="c">Cura ressaca · ' + c + '</span><span class="d">Dá ressaca · ' + de + '</span></div>'
    + '<button type="button" class="rs-link" data-rsk="' + (c >= de ? 'curou' : 'deu') + '">' + (c >= de ? 'Mais livros que curam ressaca ›' : 'Mais livros que dão ressaca ›') + '</button>';
}
async function openRessacaList(kind) {
  const v = $('#shelflist'); closeEd(); v.classList.remove('feedview', 'tabroot', 'mine-page');
  const title = kind === 'curou' ? 'Curam ressaca' : 'Dão ressaca';
  const shell = (body) => { v.querySelector('.sl-body').innerHTML = '<div class="sl-top"><button type="button" class="sl-back" data-own="1">‹ Voltar</button><b>' + title + '</b><span></span></div>' + body;
    v.querySelector('.sl-back').addEventListener('click', () => { try { openCatalog(); } catch { v.hidden = true; } }); };
  shell('<p class="sl-empty">Carregando…</p>'); v.hidden = false; v.scrollTop = 0;
  let items = []; try { const r = await sapi('GET', '/v1/ressaca?kind=' + kind); items = r.status === 200 && r.data ? r.data.items || [] : []; } catch {}
  const intro = kind === 'curou' ? '<p class="hint" style="margin:.2rem 0 0">Livros que os leitores do Livroverso disseram que curaram a ressaca literária.</p>' : '<p class="hint" style="margin:.2rem 0 0">Livros que deixaram os leitores do Livroverso de ressaca literária.</p>';
  shell(intro + (items.length ? '<div class="rs-list">' + items.map((b) => '<button type="button" class="es-bk" data-book="' + esc(b.title) + '" data-author="' + esc(b.author || '') + '">' + cvh(b.title, b.cover, 'es-cv') + '<small>' + esc(b.title) + '<br>' + plural(b.n, 'voto', 'votos') + '</small></button>').join('') + '</div>'
    : '<p class="sl-empty">Ainda não tem votos suficientes. Quando as pessoas avaliarem dizendo se o livro deu ou curou a ressaca, eles aparecem aqui.</p>'));
  try { paintCv(v); } catch {}
}
{ const _ob = openBookPage; openBookPage = function (e) { S.rsTitle = e && e.title; return _ob.apply(this, arguments); }; }
{ const v = $('#shelflist'); let tm = 0;
  const fill = async () => {
    const body = v.querySelector('.sl-body'); if (!body || v.hidden) return;
    const sec = body.querySelector('.bp-sec');
    if (sec && S.rsTitle && !body.querySelector('.rs-term')) {
      const box = document.createElement('div'); box.className = 'rs-term'; box.innerHTML = '<div class="rs-h"><b>Ressaca literária</b></div><p class="rs-empty">Carregando…</p>'; sec.before(box);
      const t = S.rsTitle, d = await rsBookData(t);
      if (!box.isConnected || t !== S.rsTitle) return;
      if (!d) { box.remove(); return; }
      box.innerHTML = rsTermHTML(d);
      box.querySelector('.rs-link')?.addEventListener('click', (ev) => openRessacaList(ev.currentTarget.dataset.rsk));
    }
    const form = body.querySelector('.ct-form');
    if (form && connected() && !body.querySelector('.rs-chips')) {
      const ch = document.createElement('div'); ch.className = 'rs-chips'; ch.innerHTML = '<button type="button" data-rsk="curou">Curam ressaca</button><button type="button" data-rsk="deu">Dão ressaca</button>'; form.after(ch);
      ch.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => openRessacaList(b.dataset.rsk)));
    }
  };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(fill, 60); }).observe(v, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
}
