// Ecos: quem chegou e curtidas (Bia, 20/11; API 038). Na leitura, os ecos de outras pessoas que você alcança ganham um
// coração (curtir/descurtir, com a contagem); nos seus ecos (Minha leitura › Meus ecos e Você › Atividade) aparece
// "N pessoas chegaram aqui · ♥ M" (sem nomes; zero não aparece).
function v9EcoStat(x) { const r = Number(x && x.reached) || 0, l = Number(x && x.likes) || 0; if (!r && !l) return '';
  return (r ? r + (r === 1 ? ' pessoa chegou aqui' : ' pessoas chegaram aqui') : '') + (l ? (r ? ' · ' : '') + '♥ ' + l : ''); }
const V9HEART = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
function v9LikeBtn(x) { if (!x || x.mine || !x.id) return '';
  return '<button type="button" data-eco-like="' + esc(x.id) + '" aria-pressed="' + !!x.liked + '" aria-label="' + (x.liked ? 'Descurtir eco' : 'Curtir eco') + '" style="pointer-events:auto;flex:none;display:inline-flex;align-items:center;gap:4px;margin-left:auto;border:0;background:none;font:inherit;font-weight:800;font-size:12px;cursor:pointer;color:' + (x.liked ? '#ff8fa3' : 'inherit') + '">' + V9HEART.replace('fill:none', 'fill:' + (x.liked ? 'currentColor' : 'none')) + (x.likes ? '<span>' + x.likes + '</span>' : '') + '</button>'; }
// todos os ecos já carregados com este id (o mesmo eco pode estar em mais de um livro aberto no cache)
const v9EcoFind = (id) => { const out = []; try { V4ECO.forEach((o) => (o.seen || []).forEach((x) => { if (x.id === id) out.push(x); })); } catch {} try { ((v4State().sum || {}).hits || []).forEach((x) => { if (x.id === id) out.push(x); }); } catch {} return out; };
// bolhas que sobem na sessão: o coração entra em cada uma
{ const _f = v4Float; v4Float = function (list) { const r = _f.apply(this, arguments);
    try { const fl = V4 && V4.querySelector('.ses .ecofl'); if (fl && list && list.length) { const bs = [...fl.querySelectorAll(':scope > .ecob')].slice(-list.length);
      bs.forEach((d, k) => { const x = list[k]; if (!x || x.mine || d.querySelector('[data-eco-like]')) return; d.insertAdjacentHTML('beforeend', v9LikeBtn(x)); }); } } catch {}
    return r; }; }
// resumo da sessão ("ecos revelados"): coração no fim de cada linha
{ const _h = v4SheetHTML; v4SheetHTML = function (k) { let h = _h.apply(this, arguments);
    try { if (k === 'sum') { const hits = (v4State().sum || {}).hits || []; let i = 0; h = h.replace(/<\/small><\/span><\/div>/g, (m) => { const x = hits[i++]; return x && !x.mine ? '</small></span>' + v9LikeBtn(x) + '</div>' : m; }); } } catch {}
    return h; }; }
// toque no coração (em qualquer camada: o clique atravessa as raízes)
document.addEventListener('click', async (ev) => {
  const b = (ev.composedPath ? ev.composedPath() : [ev.target]).find((n) => n && n.dataset && n.dataset.ecoLike); if (!b) return;
  ev.preventDefault(); ev.stopPropagation(); if (b.dataset.busy) return; b.dataset.busy = '1';
  const id = b.dataset.ecoLike, on = b.getAttribute('aria-pressed') !== 'true';
  try { const r = await sapi(on ? 'POST' : 'DELETE', '/v1/echoes/' + encodeURIComponent(id) + '/like');
    if (r && r.status === 200 && r.data) { v9EcoFind(id).forEach((x) => { x.liked = !!r.data.liked; x.likes = r.data.likes; });
      const tmp = document.createElement('div'); tmp.innerHTML = v9LikeBtn({ id, liked: !!r.data.liked, likes: r.data.likes }); b.replaceWith(tmp.firstElementChild); }
    else toast(r && r.status === 403 ? 'Chegue nesta página para curtir' : 'Não deu para curtir agora'); }
  catch { toast('Não deu para curtir agora'); } finally { delete b.dataset.busy; } }, true);
