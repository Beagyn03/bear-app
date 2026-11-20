// Perfil (Bia, 16/11): "Lendo agora" sai da página e vira uma capinha no topo, à direita do nome e do @, com a % lida.
// Lendo mais de um: a capa do primeiro e "+N". Sem leitura: nada (some o "Nada no momento").
{ const st = document.createElement('style'); st.textContent = `
.yo-top.has-now{grid-template-columns:auto 1fr auto auto!important}
.yo-cur{display:flex;flex-direction:column;align-items:center;gap:.15rem;border:0;background:none;padding:0;color:var(--ink);font:inherit;cursor:pointer;position:relative}
.yo-cur small{font-size:.62rem;font-weight:800;color:var(--ink-2);text-transform:uppercase;letter-spacing:.04em}
.yo-cur .cv{width:46px;height:69px;border-radius:3px 6px 6px 3px;box-shadow:0 3px 8px rgba(0,0,0,.25);font-size:.45rem}
.yo-cur em{font-style:normal;font-size:.72rem;font-weight:900;color:var(--acc)}
.yo-cur u{position:absolute;top:12px;right:-8px;text-decoration:none;background:var(--acc);color:var(--on-acc,#fff);font-size:.62rem;font-weight:900;border-radius:99px;padding:.05rem .35rem}
`; TR.append(st); }
{ const _fp = friendPage; friendPage = async function (h) {
  const r = await _fp.apply(this, arguments); const v = $('#shelflist'), d = S.fpData; if (v.hidden || !d || d.handle !== h) return r;
  try {
    const hd = [...v.querySelectorAll('.v3-sh')].find((x) => /^Lendo agora/.test(x.textContent.trim()));
    if (hd) { let n = hd.nextElementSibling; while (n && !n.classList.contains('v3-sh') && (n.classList.contains('fr-read') || n.matches('p'))) { const nx = n.nextElementSibling; n.remove(); n = nx; } hd.remove(); }
    const list = d.self ? lib().filter((e) => e.status === 'LENDO').map((e) => ({ title: e.title, author: e.author, cover: e.cover, pct: (() => { try { return readingInfo(e).pct; } catch { return 0; } })() })) : (d.reading || []);
    const top = v.querySelector('.yo-top'); if (!top || top.querySelector('.yo-cur')) return r;
    [...top.children].forEach((c) => { if (c.tagName === 'SPAN' && !c.classList.contains('av') && !c.textContent.trim() && !c.children.length) c.remove(); }); // espaço vazio do modelo antigo
    if (!list.length) return r;
    const b = list[0];
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'yo-cur es-bk'; btn.dataset.book = b.title; btn.dataset.author = b.author || '';
    btn.setAttribute('aria-label', 'Lendo agora: ' + b.title);
    btn.innerHTML = '<small>Lendo</small>' + cvh(b.title, b.cover, '') + '<em>' + (Number(b.pct) || 0) + '%</em>' + (list.length > 1 ? '<u>+' + (list.length - 1) + '</u>' : '');
    const more = top.querySelector('.me-more'); if (more) more.before(btn); else top.append(btn);
    top.classList.add('has-now'); try { paintCv(top); } catch {}
  } catch (err) { console.warn('lendo no topo', err); }
  return r;
}; }
// no próprio perfil, a linha antiga 'Lendo …' embaixo do nome sai (a capinha à direita substitui)
{ const _om = openMyProfile; openMyProfile = async function () { const r = await _om.apply(this, arguments); try { const v = $('#shelflist'); v.querySelectorAll('.yo-id .yo-now').forEach((x) => x.remove()); const t = v.querySelector('.yo-top'); if (t) [...t.children].forEach((c) => { if (c.tagName === 'SPAN' && !c.classList.contains('av') && !c.textContent.trim() && !c.children.length) c.remove(); }); } catch {} return r; }; }
