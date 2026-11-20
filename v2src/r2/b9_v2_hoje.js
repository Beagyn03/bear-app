// v2 (Bia, 19/11): Hoje com "Qual leio agora?" e "Pergunta do dia".
//  - "Qual leio agora?": linha logo abaixo do card da leitura (com 2 ou mais livros na fila). Abre 3 livros da fila
//    (prioridade alta primeiro, o resto sorteado); tocar num marca como próxima leitura (T().nextId, o mesmo do
//    "Marcar como próxima leitura" da página do livro). "Mostrar outros 3" sorteia de novo.
//  - "Pergunta do dia": uma pergunta por dia (fixa pela data), sem spoiler. As respostas são livros da pessoa;
//    tocar abre o post novo da Rede já com o livro e a pergunta, para a pessoa escrever e publicar (nunca publica
//    sozinho). Depois de responder, o cartão mostra "Você respondeu: …" naquele dia (db.prefs.qday).
//    Entra em Personalizar Início ("Pergunta do dia"): dá para desligar e mudar de lugar.
{ const st = document.createElement('style'); st.textContent = `
.v2-qn,.v2-qd{grid-column:1/-1}
.v2-qn{display:flex;align-items:center;justify-content:space-between;gap:.6rem;width:100%;margin:0 0 .9rem;padding:.65rem .85rem;border:1px solid var(--line);border-radius:16px;background:var(--panel);color:var(--ink);font:inherit;text-align:left;cursor:pointer}
.v2-qn span{display:flex;flex-direction:column;min-width:0}.v2-qn b{font-size:.9rem}.v2-qn small{font-size:.74rem;color:var(--ink-2);font-weight:700}
.v2-qn em{font-style:normal;color:var(--acc);font-weight:900;font-size:.84rem;white-space:nowrap}
.v2-qd{grid-column:1/-1;width:100%;box-sizing:border-box;margin:0 0 1rem;padding:16px;border:1px solid var(--line);border-radius:var(--v2-r,20px);background:linear-gradient(135deg,color-mix(in srgb,#7e63c9 16%,var(--panel)),var(--panel))}
.v2-qd .qpicks{display:flex;gap:10px}.v2-qd .qpicks button{display:grid;gap:5px;justify-items:center;align-content:start;border:0;background:none;padding:0;font:inherit;font-size:11.5px;font-weight:800;color:var(--ink-2);width:78px;text-align:center;cursor:pointer}
.v2-qd .qpicks button span:last-child{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
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
const V2_FILA = () => lib().filter((e) => e.status === 'QUERO');
function v2Pick3(prev) {
  const fila = V2_FILA(), sh = (a) => a.map((x) => [Math.random(), x]).sort((a, b) => a[0] - b[0]).map((x) => x[1]);
  const skip = new Set(prev || []), pool = fila.filter((e) => !skip.has(e.id)), base = pool.length >= 3 ? pool : fila;
  const alta = sh(base.filter((e) => e.prio === 1)), resto = sh(base.filter((e) => e.prio !== 1));
  return [...alta, ...resto].slice(0, 3);
}
function v2QualLeio(prev) {
  TR.querySelector('.v2-pk')?.remove();
  const ids = v2Pick3(prev), w = document.createElement('div'); w.className = 'v2-pk'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Qual leio agora?');
  const nx = T().nextId;
  w.innerHTML = `<div class="bx"><h3>Qual você lê agora?</h3><p>Três da sua fila. Toque no que está te chamando hoje.</p>
    <div class="row">${ids.map((e) => `<button type="button" data-id="${esc(e.id)}">${cvh(e.title, e.cover, 'cv')}<small>${esc(e.title)}</small>${e.prio === 1 ? '<i>prioridade alta</i>' : nx === e.id ? '<i>já é a próxima</i>' : ''}</button>`).join('')}</div>
    <div class="ac"><button type="button" data-a="x">Agora não</button>${V2_FILA().length > 3 ? '<button type="button" data-a="re">Mostrar outros 3</button>' : ''}</div></div>`;
  w.addEventListener('click', (ev) => {
    if (ev.target === w) return w.remove();
    const b = ev.target.closest('[data-id],[data-a]'); if (!b) return;
    if (b.dataset.a === 'x') return w.remove();
    if (b.dataset.a === 're') return v2QualLeio(ids.map((e) => e.id));
    const e = byId(b.dataset.id); if (!e) return; w.remove();
    T().nextId = e.id; save(); toast(`“${e.title}” é a sua próxima leitura`); try { refresh(); } catch {}
  });
  TR.append(w); try { paintCv(w); } catch {}
}
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
  if (a && a.date === d) { const e = lib().find((x) => x.title === a.answer); return `<section class="v2-qd" data-v2qd="1"><div class="k">Pergunta do dia</div><div class="q">${esc(q)}</div><div class="done">${e ? cvh(e.title, e.cover, 'qcv') : ''}<span>Você respondeu<b>${esc(a.answer)}</b></span></div><div class="qft"><span>Respostas aparecem na Comunidade</span><button type="button" data-qgo="1">Ver respostas ›</button></div></section>`; }
  const bks = v2QBooks(from);
  return `<section class="v2-qd" data-v2qd="1"><div class="k">Pergunta do dia</div><div class="q">${esc(q)}</div>
    <div class="qpicks">${bks.map((e) => `<button type="button" data-qb="${esc(e.id)}">${cvh(e.title, e.cover, 'qcv')}<span>${esc(e.title)}</span></button>`).join('')}<button type="button" class="o" data-qb=""><span class="qcv qo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></span><span>Outro livro</span></button></div><div class="qft"><span>Escolha e conte por quê</span></div></section>`;
}
function v2QAnswer(id) {
  const [q] = v2QOfDay(), e = id ? byId(id) : null;
  const book = e ? { title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: smallCoverOk(e.cover) } : null;
  db.prefs = { ...(db.prefs || {}), qday: { date: v2Today(), answer: e ? e.title : 'Outro livro' } }; save();
  try { openRdComposer({ kind: 'comment', book, text: `Pergunta do dia: ${q}\n` }); } catch (err) { console.warn('pergunta do dia', err); }
}
// Personalizar Início: a Pergunta do dia vira uma seção que liga/desliga e muda de lugar
if (!HOME_SECS.some((x) => x[0] === 'qday')) HOME_SECS.splice(0, 0, ['qday', 'Pergunta do dia']);
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
  // Pergunta do dia: no lugar escolhido em Personalizar Início
  const { order, off } = homePrefs(); let qd = box.querySelector('[data-v2qd]');
  if (off.includes('qday')) { qd && qd.remove(); return; }
  const html = v2QdayHTML(), want = html.replace(/\s+/g, ' ');
  if (!qd || qd.dataset.k !== want) { const tmp = document.createElement('div'); tmp.innerHTML = html; const neu = tmp.firstElementChild; neu.dataset.k = want; if (qd) qd.replaceWith(neu); else box.append(neu); qd = neu; }
  // posição: depois da última seção visível que vem antes dela na ordem; se nenhuma, logo depois da linha "Qual leio agora?"
  let ref = (qn && qn.isConnected ? qn : null) || now; const i = order.indexOf('qday');
  for (let j = i - 1; j >= 0; j--) { const k = order[j]; if (off.includes(k) || !V2_SEC_EL[k]) continue; const els = V2_SEC_EL[k](box).filter((x) => x && x.isConnected && x.offsetParent !== null); if (els.length) { ref = els[els.length - 1]; break; } }
  if (ref.nextElementSibling !== qd) ref.after(qd);
}
TR.addEventListener('click', (ev) => { const g = ev.target.closest && ev.target.closest('[data-v2qd] [data-qgo]'); if (!g) return; ev.stopPropagation(); S.comSeg = 'rede'; goTab('comunidade'); });
TR.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-v2qd] [data-qb]'); if (!b) return; ev.stopPropagation(); v2QAnswer(b.dataset.qb); setTimeout(v2HojeEnsure, 50); });
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(v2HojeEnsure, 180); }).observe(TR, { childList: true, subtree: true }); setTimeout(v2HojeEnsure, 1700); }
