// Debate semanal na Comunidade (Bia, 22/11): votar como no cartão do Hoje, sem passar pelo Novo post.
// - No cartão da pergunta: as mesmas capas do Hoje (v6QdPicks) + "Outro livro"; tocar já vota (POST /v1/qday/vote).
// - Depois do voto: "Seu voto: <livro> · Trocar" e o campo "Quer contar por quê? (opcional)" + Enviar, que publica a resposta do
//   debate ("<nome>: <pergunta>\n<texto>", citando o livro votado) direto pela API. Sem texto, o voto já vale.
// - "Participar do debate…" e "Responder ao debate" rolam até o cartão e destacam as capas (ou o campo, se já votou).
const V6DQ = { troca: false, txt: '', busy: false, sent: '' };
const V6DQCSS = `.v6dq{margin-top:12px}.v6dq .qpicks{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 4px}
.v6dq .qpicks button{display:grid;gap:5px;justify-items:center;align-content:start;border:0;background:none;padding:0;font:inherit;font-size:11.5px;font-weight:800;color:var(--ink-2);width:72px;flex:none;text-align:center;cursor:pointer;min-height:44px}
.v6dq .qpicks button span:last-child{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v6dq .qcv{width:60px;height:90px;border-radius:3px 7px 7px 3px;box-shadow:0 4px 10px rgba(0,0,0,.22);font-size:.55rem}
.v6dq .qo{display:grid;place-items:center;background:color-mix(in srgb,var(--ink) 6%,var(--panel));border:1.5px dashed var(--line);box-shadow:none;color:var(--ink-2)}.v6dq .qo svg{width:22px;height:22px}
.v6dq .qpicks button.on .qcv{outline:3px solid var(--acc);outline-offset:2px}.v6dq .qpicks button.on{color:var(--acc)}
.v6dq.flash .qpicks,.v6dq.flash .dqc{animation:v6dqf 1.2s ease}@keyframes v6dqf{0%,100%{box-shadow:none}30%{box-shadow:0 0 0 3px color-mix(in srgb,var(--acc) 55%,transparent);border-radius:12px}}
.v6dq .dqh{font-size:12px;font-weight:900;color:var(--ink-2);margin:0 0 8px}
.v6dq .dqm{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.v6dq .dqm .qcv{width:40px;height:60px}.v6dq .dqm .t{flex:1;min-width:0;font-size:14px}.v6dq .dqm .t b{color:var(--ink)}.v6dq .dqm .qcv{flex:none}
.v6dq .dqm button{border:0;background:none;color:var(--acc);font:inherit;font-weight:900;font-size:13px;padding:10px 6px;min-height:44px;cursor:pointer}
.v6dq .dqc{margin-top:10px;display:grid;gap:8px}.v6dq .dqc label{font-size:13px;font-weight:800;color:var(--ink-2)}
.v6dq .dqc textarea{width:100%;box-sizing:border-box;min-height:64px;resize:vertical;border:1px solid var(--line);border-radius:12px;background:var(--bg,var(--panel));color:var(--ink);font:inherit;font-size:15px;padding:10px 12px}
.v6dq .dqc .row{display:flex;justify-content:space-between;align-items:center;gap:8px}.v6dq .dqc small{color:var(--ink-2);font-size:12px}
.v6dq .dqc .btn{min-height:44px;padding:0 18px;border-radius:99px;border:0;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;cursor:pointer}.v6dq .dqc .btn:disabled{opacity:.5;cursor:default}
.v6dq .dqok{margin-top:10px;font-size:13px;font-weight:800;color:var(--ink-2)}`;
function v6DebVoteHTML(q) {
  const Q = (typeof V6QD !== 'undefined' && V6QD) || {}, mine = Q.mine;
  if (!mine || V6DQ.troca) {
    let from = 'lidos'; try { from = v2QOfDay()[1]; } catch {}
    const bks = (() => { try { return v2QBooks(from); } catch { return []; } })();
    return `<div class="v6dq v2-qd-picks"><div class="dqh">${mine ? 'Trocar o voto' : 'Vote num livro'}</div>${v6QdPicks(bks, mine)}</div>`;
  }
  const sent = V6DQ.sent === q;
  return `<div class="v6dq"><div class="dqm">${cvh(mine.title, mine.cover, 'qcv')}<span class="t">Seu voto: <b>${esc(mine.title)}</b></span><button type="button" data-a="v6dqtroca">Trocar</button></div>
    ${sent ? `<div class="dqok">Comentário publicado. Ele aparece nas respostas abaixo.</div>` : `<div class="dqc"><label for="v6dqt">Quer contar por quê? (opcional)</label>
    <textarea id="v6dqt" maxlength="260" placeholder="O que esse livro tem a ver com a pergunta">${esc(V6DQ.txt)}</textarea>
    <div class="row"><small>Sem comentário, o voto já vale.</small><button type="button" class="btn" data-a="v6dqsend"${V6DQ.busy || !V6DQ.txt.trim() ? ' disabled' : ''}>Enviar</button></div></div>`}</div>`;
}
// coloca a votação dentro do cartão da pergunta (só na semana atual)
{ const _pt = v6PaintTab; v6PaintTab = function (R) {
    const r = _pt.apply(this, arguments);
    try { const S6 = v6S(); if (S6.f !== 'desafio' || S6.desWk) return r;
      const sr = R.getRootNode(); if (sr && sr.querySelector && !sr.querySelector('style[data-v6dq]')) { const st = document.createElement('style'); st.dataset.v6dq = '1'; st.textContent = V6DQCSS; sr.append(st); }
      const c = R.querySelector('.des-c'); if (c && !c.querySelector('.v6dq')) { c.insertAdjacentHTML('beforeend', v6DebVoteHTML(v6WkQ(0))); try { paintCv(c); } catch {} }
    } catch {}
    return r; }; }
function v6DebFocus() {
  try { const h = $('#lista > .v6host'), R = h && h.shadowRoot && h.shadowRoot.querySelector('.v6com'); const v = R && R.querySelector('.v6dq'); if (!v) return;
    v.scrollIntoView({ behavior: 'smooth', block: 'center' }); v.classList.remove('flash'); void v.offsetWidth; v.classList.add('flash');
    const t = v.querySelector('textarea'); if (t) setTimeout(() => { try { t.focus({ preventScroll: true }); } catch {} }, 450); } catch {}
}
async function v6DebSend() {
  const Q = (typeof V6QD !== 'undefined' && V6QD) || {}, txt = V6DQ.txt.trim(), q = v6WkQ(0); if (!txt || !Q.mine || V6DQ.busy) return;
  V6DQ.busy = true; v6Paint();
  try {
    const b = Q.mine, book = { title: b.title, ...(b.author ? { author: b.author } : {}), ...(/^https:\/\//.test(b.cover || '') ? { cover: b.cover } : {}) };
    const r = await sapi('POST', '/v1/posts', { kind: 'comment', text: `${DEB.nome}: ${q}\n${txt}`.slice(0, 320), visibility: 'public', book });
    if (r.status === 200 || r.status === 201) { V6DQ.txt = ''; V6DQ.sent = q; toast('Comentário publicado');
      try { ['rede', 'amigos'].forEach((sc) => { v6Feed(sc).at = 0; }); v6Load('rede'); v6Load('amigos'); } catch {}
      try { V6QDAt = 0; v6QdLoad(true); } catch {}
    } else toast('Não consegui publicar agora. Seu texto continua aqui.');
  } catch { toast('Não consegui publicar agora. Seu texto continua aqui.'); }
  V6DQ.busy = false; v6Paint();
}
{ const _vc = v6Click; v6Click = function (ev) {
    const qb = ev.target.closest && ev.target.closest('.v6dq [data-qb]');
    if (qb) { ev.stopPropagation(); ev.preventDefault(); V6DQ.troca = false; return v2QAnswer(qb.dataset.qb); }
    const b = ev.target.closest && ev.target.closest('[data-a]'), a = b && b.dataset.a;
    if (a === 'v6dqtroca') { ev.stopPropagation(); ev.preventDefault(); V6DQ.troca = true; return v6Paint(); }
    if (a === 'v6dqsend') { ev.stopPropagation(); ev.preventDefault(); return v6DebSend(); }
    return _vc.apply(this, arguments);
  }; }
// o texto do comentário fica guardado entre repinturas (e o Enviar liga quando há texto)
document.addEventListener('input', (ev) => { const t = ev.composedPath && ev.composedPath()[0]; if (!t || t.id !== 'v6dqt') return; V6DQ.txt = t.value;
  const s = t.closest('.dqc') && t.closest('.dqc').querySelector('[data-a=v6dqsend]'); if (s) s.disabled = V6DQ.busy || !t.value.trim(); }, true);
// voto feito em qualquer lugar (Hoje ou aba): sai do modo "trocar"
{ const _v = v6Vote; v6Vote = async function () { const r = await _v.apply(this, arguments); V6DQ.troca = false; return r; }; }
// enquanto a pessoa digita o comentário, a aba não é refeita (o feed que chega pinta depois, ao sair do campo)
{ const _p = v6Paint; let pend = false; v6Paint = function () {
    try { const h = $('#lista > .v6host'), ae = h && h.shadowRoot && h.shadowRoot.activeElement; if (ae && ae.id === 'v6dqt' && !V6DQ.busy) { if (!pend) { pend = true; ae.addEventListener('blur', () => { pend = false; setTimeout(() => v6Paint(), 0); }, { once: true }); } return; } } catch {}
    return _p.apply(this, arguments); }; }
