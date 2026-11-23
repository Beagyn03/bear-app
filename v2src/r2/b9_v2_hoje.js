// v2 (Bia, 19/11): Hoje com "Qual leio agora?" e "Pergunta do dia".
//  - "Qual leio agora?": linha logo abaixo do card da leitura. Folha com Da minha fila / Sortear / Buscar (ver v2QualLeio).
//  - "Pergunta do dia": uma pergunta por dia (fixa pela data), sem spoiler. As respostas são livros da pessoa;
//    tocar abre o post novo da Rede já com o livro e a pergunta, para a pessoa escrever e publicar (nunca publica
//    sozinho). Depois de responder, o cartão mostra "Você respondeu: …" naquele dia (db.prefs.qday).
//    Entra em Personalizar Hoje ("Pergunta do dia"): dá para desligar e mudar de lugar.
{ const st = document.createElement('style'); st.textContent = `
.v2-qn,.v2-qd{grid-column:1/-1}
.v2-qn{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%;margin:0 0 .9rem;padding:.65rem .85rem;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.v2-qn span{display:flex;flex-direction:column;min-width:0}.v2-qn b{font-size:.9rem}.v2-qn small{font-size:.74rem;color:var(--ink-2);font-weight:700}
.v2-qn em{font-style:normal;color:var(--acc);font-weight:900;font-size:.84rem;white-space:nowrap}
.v2-qd{grid-column:1/-1;width:100%;box-sizing:border-box;margin:0 0 1rem;padding:16px;border:1px solid var(--line);border-radius:var(--v2-r,20px);background:linear-gradient(135deg,color-mix(in srgb,#7e63c9 16%,var(--panel)),var(--panel))}
.v2-qd .qpicks{display:flex;gap:10px}.v2-qd .qpicks button{display:grid;gap:5px;justify-items:center;align-content:start;border:0;background:none;padding:0;font:inherit;font-size:11.5px;font-weight:800;color:var(--ink-2);width:78px;text-align:center;cursor:pointer}
.v2-qd .qpicks button span:last-child{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v2-qd .cv.rt{box-shadow:0 4px 10px rgba(0,0,0,.22)!important}.v2-qd .cv::before,.v2-qd .cv::after{display:none!important}.v2-qd .rt-sp{display:none!important}
.v2-qd .qcv{width:64px;height:96px;border-radius:3px 7px 7px 3px;object-fit:cover;box-shadow:0 4px 10px rgba(0,0,0,.22);font-size:.55rem}
.v2-qd .qo{display:grid;place-items:center;background:color-mix(in srgb,var(--ink) 6%,var(--panel));border:1.5px dashed var(--line);box-shadow:none;color:var(--ink-2)}.v2-qd .qo svg{width:22px;height:22px}
.v2-qd .qft{display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:var(--ink-2);font-weight:700}.v2-qd .qft button{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;padding:0;cursor:pointer}
.v2-qd .done{display:flex;gap:10px;align-items:center}.v2-qd .done .qcv{width:44px;height:66px}.v2-qd .done span{display:grid;font-size:12px}.v2-qd .done b{font-size:14px;margin-top:2px}
.v2-qd .k{font-size:10.5px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;color:var(--acc)}
.v2-qd .q{font-family:var(--v2-disp,Georgia,serif);font-size:18px;font-weight:700;line-height:1.25;margin:4px 0 12px;color:var(--ink)}
.v2-qd .ch{display:flex;flex-wrap:wrap;gap:.4rem}
.v2-qd .ch button{max-width:100%;border:1.5px solid var(--line);background:var(--bg);color:var(--ink);border-radius:99px;padding:.4rem .75rem;font:inherit;font-size:.8rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v2-qd .ch button.o{border-style:dashed;color:var(--ink-2)}
.v2-qd .done{font-size:.84rem;color:var(--ink-2);font-weight:700}.v2-qd .done b{color:var(--ink)}
.v2-pk{position:fixed;inset:0;z-index:9300;background:rgba(20,12,6,.45);display:flex;align-items:flex-end;justify-content:center}
.v2-pk .bx{width:100%;max-width:520px;background:var(--panel);color:var(--ink);border-radius:22px 22px 0 0;padding:1.1rem 1rem calc(1rem + env(safe-area-inset-bottom,0px))}
.v2-pk h3{margin:0;font-size:1.15rem}.v2-pk p{margin:.15rem 0 .9rem;font-size:.8rem;color:var(--ink-2)}
.v2-pk .row{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem}
.v2-pk .row button{border:0;background:none;padding:0;text-align:center;font:inherit;color:var(--ink);cursor:pointer;min-width:0}
.v2-pk .row .cv{width:100%;aspect-ratio:2/3;height:auto;border-radius:4px 7px 7px 4px;box-shadow:0 6px 14px rgba(0,0,0,.18);transition:transform .15s}
.v2-pk .row button:active .cv{transform:translateY(-3px) rotate(-2deg)}
.v2-pk .row small{display:block;margin-top:.4rem;font-size:.74rem;font-weight:800;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v2-pk .row i{display:block;font-style:normal;font-size:.66rem;color:var(--acc);font-weight:900;margin-top:.1rem}
.v2-pk .ac{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-top:1rem}
.v2-pk .ac button{height:44px;border-radius:13px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;font-weight:900;font-size:.86rem}
`; TR.append(st); }
// "Qual leio agora?" (Bia, 23/11): em vez de 3 livros sorteados, três caminhos — Da minha fila (prioridade Alta, depois
// Normal e Baixa, em carrossel; tocar marca como próxima leitura), Sortear de uma estante (a folha do sorteio com cometa,
// que já deixa escolher a fila ou uma estante) e Buscar um livro. Sem fila, só a busca.
const V2_FILA = () => lib().filter((e) => e.status === 'QUERO');
const V2_PRIO = (e) => (e.prio === 1 ? 1 : e.prio === 3 ? 3 : 2);
function v2QualLeio() {
  TR.querySelector('.v2-pk')?.remove();
  const fila = V2_FILA();
  if (!fila.length) { try { return openCatalog(); } catch { return goTab('estante'); } }
  const nx = T().nextId, ord = fila.map((e, i) => [V2_PRIO(e), i, e]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
  const ver = ord.slice(0, 12), hasShelf = (() => { try { return v5Shelves().some((s) => !s.arch && (s.bookIds || []).length); } catch { return false; } })();
  const w = document.createElement('div'); w.className = 'v2-pk'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Qual leio agora?');
  const tag = (e) => (nx === e.id ? '<i>já é a próxima</i>' : V2_PRIO(e) === 1 ? '<i>prioridade alta</i>' : '');
  w.innerHTML = `<div class="bx"><h3>Qual leio agora?</h3>
    <div class="pkh"><b>Da minha fila</b><button type="button" data-a="fila">Ver toda a fila ›</button></div>
    <p>Prioridade alta primeiro. Toque para marcar como próxima leitura.</p>
    <div class="car">${ver.map((e) => `<button type="button" data-id="${esc(e.id)}">${cvh(e.title, e.cover, 'cv')}<small>${esc(e.title)}</small>${tag(e)}</button>`).join('')}</div>
    <div class="opt"><button type="button" data-a="sort">${v4ic('orb', 20)}<span><b>Sortear</b><small>${hasShelf ? 'da fila ou de uma estante' : 'um livro da fila'}</small></span>${v4ic('chev', 16)}</button>
    <button type="button" data-a="busca">${v4ic('busca', 20)}<span><b>Buscar um livro</b><small>fora da sua Biblioteca</small></span>${v4ic('chev', 16)}</button></div>
    <div class="ac"><button type="button" data-a="x">Agora não</button></div></div>`;
  w.addEventListener('click', (ev) => {
    if (ev.target === w) return w.remove();
    const b = ev.target.closest('[data-id],[data-a]'); if (!b) return;
    const a = b.dataset.a;
    if (a === 'x') return w.remove();
    if (a === 'sort') { w.remove(); try { return v5Sheet('v5sorteio', {}); } catch (err) { console.warn('sortear', err); return toast('Não consegui abrir o sorteio'); } }
    if (a === 'busca') { w.remove(); try { return openCatalog(); } catch { return goTab('estante'); } }
    if (a === 'fila') { w.remove(); try { const S5 = v5S(); S5.tab = 'livros'; S5.sub = null; v5P().shF = 'quero'; v5Save(); } catch {} return goTab('estante'); }
    const e = byId(b.dataset.id); if (!e) return; w.remove();
    T().nextId = e.id; save(); toast(`“${e.title}” é a sua próxima leitura`); try { refresh(); } catch {}
  });
  TR.append(w); try { paintCv(w); } catch {}
}
{ const st = document.createElement('style'); st.textContent = `
.v2-pk .pkh{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:.7rem}.v2-pk .pkh b{font-size:.95rem}
.v2-pk .pkh button{border:0;background:none;color:var(--acc);font:inherit;font-weight:900;font-size:.82rem;padding:.6rem 0;min-height:44px;cursor:pointer}
.v2-pk .car{display:flex;gap:.7rem;overflow-x:auto;padding:2px 2px 6px;scroll-snap-type:x proximity;scrollbar-width:none}
.v2-pk .car button{flex:none;width:92px;border:0;background:none;padding:0;text-align:center;font:inherit;color:var(--ink);cursor:pointer;scroll-snap-align:start}
.v2-pk .car .cv{width:100%;aspect-ratio:2/3;height:auto;border-radius:4px 7px 7px 4px;box-shadow:0 6px 14px rgba(0,0,0,.18)}
.v2-pk .car small{display:-webkit-box;margin-top:.35rem;font-size:.74rem;font-weight:800;line-height:1.25;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v2-pk .car i{display:block;font-style:normal;font-size:.66rem;color:var(--acc);font-weight:900;margin-top:.1rem}
.v2-pk .opt{display:grid;gap:.5rem;margin-top:.9rem}
.v2-pk .opt button{display:flex;align-items:center;gap:.75rem;width:100%;min-height:56px;padding:.6rem .8rem;border:1.5px solid var(--line);border-radius:14px;background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.v2-pk .opt button > span{flex:1;min-width:0;display:grid}.v2-pk .opt b{font-size:.92rem}.v2-pk .opt small{font-size:.76rem;color:var(--ink-2);font-weight:700}
.v2-pk .opt svg{flex:none;width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.v2-pk .opt svg:last-child{width:16px;height:16px;color:var(--ink-2)}
.v2-pk .ac{grid-template-columns:1fr}
`; TR.append(st); }
// perguntas do dia: livro como resposta; "de" diz de onde vêm as sugestões
const V2_QS = [
  ['Que livro você releria hoje?', 'lido'], ['Qual personagem você levaria para jantar?', 'lido'], ['Qual final você reescreveria?', 'lido'],
  ['Que livro te fez perder a hora de dormir?', 'lido'], ['Qual livro você daria de presente sem pensar duas vezes?', 'lido'],
  ['Que livro você queria ler de novo pela primeira vez?', 'lido'], ['Qual livro tem o melhor primeiro capítulo?', 'lido'],
  ['Que livro mais te surpreendeu?', 'lido'], ['Qual livro você leria numa viagem longa?', 'fila'], ['Qual livro da fila está te chamando?', 'fila'],
  ['Que livro você indicaria para quem diz que não gosta de ler?', 'lido'], ['Qual livro tem o vilão mais bem escrito?', 'lido'],
  ['Que livro te fez rir alto?', 'lido'], ['Qual livro te fez chorar?', 'lido'], ['Que livro tem a capa mais bonita da sua estante?', 'todos'],
  ['Qual livro você gostaria de ver virar série?', 'lido'], ['Que livro você leu rápido demais?', 'lido'], ['Qual livro tem o mundo em que você moraria?', 'lido'],
  ['Que livro está te acompanhando esta semana?', 'lendo'], ['Qual livro você abandonou e quer dar outra chance?', 'aband'],
  ['Que livro você leria num dia de chuva?', 'todos'], ['Qual livro tem a frase que você não esquece?', 'lido'], ['Que livro merecia mais gente lendo?', 'lido'],
  ['Qual livro te tirou da ressaca literária?', 'lido'], ['Que livro você levaria para uma ilha deserta?', 'lido'], ['Qual livro você terminou com saudade dos personagens?', 'lido'],
  ['Que livro da fila você começaria agora?', 'fila'], ['Qual livro tem o casal que você mais torceu?', 'lido'], ['Que livro você leu na hora certa da vida?', 'lido'],
  ['Qual livro você recomendaria para quem está começando no gênero que você mais lê?', 'lido'],
];
const v2Today = () => { try { return todayISO(); } catch { return new Date().toISOString().slice(0, 10); } };
const v2QOfDay = () => { const d = v2Today(), n = [...d].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7); return V2_QS[n % V2_QS.length]; };
function v2QBooks(from) {
  const L = lib().filter((e) => e.title), by = (s) => L.filter((e) => e.status === s);
  const lidos = by('LIDO').sort((a, b) => ((reviewOfLib(b) || {}).paws || 0) - ((reviewOfLib(a) || {}).paws || 0) || String(b.finishedAt || '').localeCompare(String(a.finishedAt || '')));
  const pick = from === 'fila' ? by('QUERO') : from === 'lendo' ? by('LENDO') : from === 'aband' ? by('ABANDONEI') : from === 'todos' ? L : lidos;
  return (pick.length ? pick : lidos).slice(0, 3);
}
function v2QdayHTML() {
  const [q, from] = v2QOfDay(), d = v2Today(), a = (db.prefs || {}).qday;
  if (a && a.date === d) { const e = lib().find((x) => x.title === a.answer); return `<section class="v2-qd" data-v2qd="1"><div class="k">${DEB.nome}</div><div class="q">${esc(q)}</div><div class="done">${e ? cvh(e.title, e.cover, 'qcv') : ''}<span>Você respondeu<b>${esc(a.answer)}</b></span></div><div class="qft"><span>Respostas aparecem na Comunidade</span><button type="button" data-qgo="1">Ver respostas ›</button></div></section>`; }
  const bks = v2QBooks(from);
  return `<section class="v2-qd" data-v2qd="1"><div class="k">${DEB.nome}</div><div class="q">${esc(q)}</div>
    <div class="qpicks">${bks.map((e) => `<button type="button" data-qb="${esc(e.id)}">${cvh(e.title, e.cover, 'qcv')}<span>${esc(e.title)}</span></button>`).join('')}<button type="button" class="o" data-qb=""><span class="qcv qo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><span>Outro livro</span></button></div><div class="qft"><span>Escolha e conte por quê</span></div></section>`;
}
function v2QAnswer(id) {
  const [q] = v2QOfDay(), e = id ? byId(id) : null;
  const book = e ? { title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: smallCoverOk(e.cover) } : null;
  db.prefs = { ...(db.prefs || {}), qday: { date: v2Today(), answer: e ? e.title : 'Outro livro' } }; save();
  try { openRdComposer({ kind: 'comment', book, text: `${DEB.nome}: ${q}\n` }); } catch (err) { console.warn('pergunta do dia', err); }
}
// Personalizar Hoje: a Pergunta do dia vira uma seção que liga/desliga e muda de lugar
if (!HOME_SECS.some((x) => x[0] === 'qday')) HOME_SECS.splice(0, 0, ['qday', DEB.nome]);
const V2_SEC_EL = {
  recs: (box) => [box.querySelector('#rc-host')],
  tambem: (box) => { const sh = [...box.querySelectorAll('.v3-sh')].find((x) => /^Também lendo/.test(x.textContent.trim())); return sh ? [sh, sh.nextElementSibling] : []; },
  fila: (box) => { const sh = box.querySelector('.yo-fsh'); return sh ? [sh, sh.nextElementSibling] : []; },
  meta: (box) => [box.querySelector('#ini-meta')], conq: (box) => [box.querySelector('.ini-conq')],
};
function v2HojeEnsure() {
  if (S.tab !== 'inicio') return; const box = TR.querySelector('#lista'); if (!box) return; const now = box.querySelector('.v3-now'); if (!now) return;
  // linha "Qual leio agora?" logo depois do card da leitura (e da Órbita, quando ela está ali)
  const fila = V2_FILA().length; let qn = box.querySelector('.v2-qn');
  if (fila < 2) { qn && qn.remove(); } else {
    if (!qn) { qn = document.createElement('button'); qn.type = 'button'; qn.className = 'v2-qn'; qn.addEventListener('click', () => v2QualLeio()); }
    const nx = (() => { try { return nextBook(); } catch { return null; } })();
    const html = `<span><b>${nx ? 'Próxima: ' + esc(nx.title) : 'Qual leio agora?'}</b><small>${fila} livros na fila</small></span><em>${nx ? 'Trocar ›' : 'Escolher ›'}</em>`;
    if (qn.innerHTML !== html) qn.innerHTML = html;
    let at = now; const orb = box.querySelector('#orb-card'); const unit = orb && (orb.parentElement && orb.parentElement.classList.contains('orb-row') ? orb.parentElement : orb);
    if (unit && unit.previousElementSibling === now) at = unit;
    if (at.nextElementSibling !== qn) at.after(qn);
  }
  // Pergunta do dia: no lugar escolhido em Personalizar Hoje
  const { order, off } = homePrefs(); let qd = box.querySelector('[data-v2qd]');
  if (off.includes('qday')) { qd && qd.remove(); return; }
  // a chave ignora o id da capa (data-cvk muda a cada desenho): antes o cartão era trocado sem parar e piscava com o "A seguir"
  const html = v2QdayHTML(), want = html.replace(/ data-cvk="c\d+"/g, '').replace(/\s+/g, ' ');
  if (!qd || qd.dataset.k !== want) { const tmp = document.createElement('div'); tmp.innerHTML = html; const neu = tmp.firstElementChild; neu.dataset.k = want; try { const col = now.parentElement; if ((qd && qd.classList.contains('v3mom')) || (col && col.classList.contains('v3h') && !col.querySelector(':scope > .ex-alert, :scope > .v2rs-card'))) neu.classList.add('v3mom'); } catch {} if (qd) qd.replaceWith(neu); else box.append(neu); qd = neu; try { paintCv(neu); } catch {} }
  // no Hoje novo (coluna .v3h) a posição é dada pela ordem do CSS: mover o cartão de novo a cada redesenho fazia ele sair e voltar sem parar
  if (qd.parentElement === now.parentElement && now.parentElement.classList.contains('v3h')) return;
  // posição: depois da última seção visível que vem antes dela na ordem; se nenhuma, logo depois da linha "Qual leio agora?"
  let ref = (qn && qn.isConnected ? qn : null) || now; const i = order.indexOf('qday');
  for (let j = i - 1; j >= 0; j--) { const k = order[j]; if (off.includes(k) || !V2_SEC_EL[k]) continue; const els = V2_SEC_EL[k](box).filter((x) => x && x.isConnected && x.offsetParent !== null); if (els.length) { ref = els[els.length - 1]; break; } }
  if (ref.nextElementSibling !== qd) ref.after(qd);
}
TR.addEventListener('click', (ev) => { const g = ev.target.closest && ev.target.closest('[data-v2qd] [data-qgo]'); if (!g) return; ev.stopPropagation(); S.comSeg = 'rede'; goTab('comunidade'); });
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-v2qd] [data-qb]'); if (!b) return; ev.stopPropagation(); v2QAnswer(b.dataset.qb); setTimeout(v2HojeEnsure, 50); });
{ let tm = 0, first = 0; new MutationObserver(() => { clearTimeout(tm); const now = Date.now(); if (!first) first = now; const run = () => { first = 0; v2HojeEnsure(); }; if (now - first > 600) { run(); return; } tm = setTimeout(run, 180); }) /* no máximo 600 ms de espera: mudanças seguidas na tela adiavam para sempre e a Pergunta do dia não voltava depois de um redesenho */.observe(TR, { childList: true, subtree: true }); setTimeout(v2HojeEnsure, 1700); }

// o Hoje se redesenha de tempos em tempos (dados que chegam): a Pergunta do dia volta no mesmo instante, já no lugar e em destaque,
// em vez de esperar o próximo ciclo (reteste da noite, 21/11: sumia e voltava)
{ const _rh = renderHome; renderHome = function () { const r = _rh.apply(this, arguments); try { v2HojeEnsure(); } catch {} return r; }; }
