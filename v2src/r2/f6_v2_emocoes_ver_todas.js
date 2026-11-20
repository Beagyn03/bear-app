// Emoções com "ver todas" em todo seletor (Bia, 20/11; mesmo comportamento do protótipo): aparecem as 6 principais e as
// já marcadas; o resto abre em "ver todas" e fecha em "ver menos". Vale para os seletores feitos a partir de QT_PICK
// (trechos, post, atualizar, diário, terminei, avaliação). Feito no DOM porque cada seletor monta a lista do seu jeito.
{ const st = document.createElement('style'); st.textContent = '.v3emo-x{display:none!important}.v3emo-more{border:0;background:none;color:var(--acc);font:inherit;font-size:.8rem;font-weight:800;padding:.35rem .2rem;cursor:pointer;flex-basis:100%;text-align:left}'; TR.append(st);
  const MAIN = new Set(QT_GROUPS[0][1].map((y) => y[0])), ALL = new Set(QT_PICK.map((y) => y[0]));
  const keyOf = (b) => b.dataset.f || b.dataset.fe || b.dataset.v || b.dataset.k || '';
  const isOn = (b) => b.classList.contains('on') || b.getAttribute('aria-pressed') === 'true';
  const apply = (box) => {
    const chips = [...box.children].filter((b) => ALL.has(keyOf(b))); if (chips.length < 12) return;
    const open = box.dataset.emoOpen === '1';
    chips.forEach((b) => b.classList.toggle('v3emo-x', !open && !MAIN.has(keyOf(b)) && !isOn(b)));
    let more = box.querySelector(':scope > .v3emo-more');
    if (!more) { more = document.createElement('button'); more.type = 'button'; more.className = 'v3emo-more'; more.addEventListener('click', (ev) => { ev.stopPropagation(); box.dataset.emoOpen = box.dataset.emoOpen === '1' ? '' : '1'; apply(box); }); box.append(more); }
    more.textContent = open ? 'ver menos' : 'ver todas (' + chips.filter((b) => !MAIN.has(keyOf(b))).length + ')';
  };
  const scan = (root) => { if (!root || !root.querySelectorAll) return; const boxes = new Set(); root.querySelectorAll('button, span').forEach((b) => { if (b.parentElement && ALL.has(keyOf(b))) boxes.add(b.parentElement); }); if (root.parentElement && ALL.has(keyOf(root))) boxes.add(root.parentElement); boxes.forEach(apply); };
  let t = 0; new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => scan(TR), 30); }).observe(TR, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'aria-pressed'] });
  scan(TR); }
// o seletor agrupado (anotação/trecho no Lendo) mostra os dois grupos; o título do grupo "Mais" some junto com as escondidas
{ const st = document.createElement('style'); st.textContent = '.fe-gt:nth-of-type(n+2){display:none}'; TR.append(st); }
