// Comunidade: carrega mais novidades ao chegar no fim da lista, e Ajustes › "Novidades no feed" escolhe o que aparece.
{ const st = document.createElement('style'); st.textContent = `.fd-more{text-align:center;font-size:.8rem;color:var(--ink-2);padding:1rem 0 1.4rem}`; TR.append(st); }
const FEED_KINDS = [['review', 'Avaliações'], ['STARTED', 'Começou a ler'], ['PROGRESS', 'Avanços na leitura'], ['FINISHED', 'Terminou um livro'], ['achievement', 'Conquistas'], ['buddy_done', 'Leituras conjuntas terminadas']];
const feedOff = () => ((db.prefs && db.prefs.feedOff) || []);
S.feedPrefOk = (p) => {
  const off = feedOff(); if (!off.length || !p) return true;
  const k = p.type === 'activity' ? p.kind : p.type === 'review' || (typeof isReview === 'function' && isReview(p)) ? 'review' : p.type;
  return !off.includes(k);
};
{ // fim da lista na tela → próxima página
  const io = new IntersectionObserver((ents) => { if (ents.some((e) => e.isIntersecting) && typeof S.feedMore === 'function') S.feedMore(); }, { rootMargin: '300px' });
  const seen = new WeakSet();
  new MutationObserver(() => { TR.querySelectorAll('.fd-more').forEach((n) => { if (!seen.has(n)) { seen.add(n); io.observe(n); } }); }).observe(TR, { childList: true, subtree: true });
}
function feedPrefsSheet() {
  let off = [...feedOff()];
  const ed = $('#editor'); ed.classList.add('compact');
  const draw = () => {
    ed.querySelector('.ed-body').innerHTML = `<div class="dd"><h3>Novidades no feed</h3><p>Escolha o que aparece nas Novidades dos amigos.</p>
      ${FEED_KINDS.map(([k, n]) => `<div class="hp-row${off.includes(k) ? ' off' : ''}"><button type="button" class="hp-ck" data-k="${k}" aria-label="Mostrar ${n}" aria-pressed="${!off.includes(k)}">✓</button><b>${n}</b></div>`).join('')}
      <button type="button" class="op main" id="fp-ok"><b>Pronto</b></button></div>`;
    $$('.hp-ck', ed).forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k; off = off.includes(k) ? off.filter((x) => x !== k) : [...off, k]; draw(); }));
    $('#fp-ok', ed).addEventListener('click', () => { db.prefs = { ...(db.prefs || {}), feedOff: off }; save(); closeEd(); if (S.tab === 'comunidade') drawTab(); toast('Feed ajustado'); });
  };
  draw(); ed.hidden = false;
}
{ const _da = drawAjustes; drawAjustes = function (box) {
  _da(box); if (S.ajMode === 'perfil') return;
  const home = box.querySelector('#aj-home'); if (!home || box.querySelector('#aj-feed')) return;
  const n = FEED_KINDS.length - feedOff().length;
  home.insertAdjacentHTML('afterend', `<button type="button" class="aj-row" id="aj-feed"><span><b>Novidades no feed</b><small>${n === FEED_KINDS.length ? 'Tudo aparece' : `${n} de ${FEED_KINDS.length} tipos aparecem`}</small></span>›</button>`);
  $('#aj-feed', box).addEventListener('click', feedPrefsSheet);
}; }
