// Abertura do dia (Bia, 20/11; protótipo v141): sai "SEXTA-FEIRA, 20 DE NOVEMBRO / Bom dia, Beatriz"; entra um cartão curto
// num céu que muda com a hora, com a 1ª mensagem que se aplica (dados reais): prazo › órbita › ler junto › meta › memória ›
// Pergunta do dia › trecho salvo. Tocar leva à ação. O HTML só muda quando o conteúdo muda (o Hoje compara a chave do cartão);
// estrelas fixas; o cometa passa uma vez, só na 1ª abertura do dia, e fica fora do HTML para não mudar a chave.
{ const st = document.createElement('style'); st.textContent = `
.v8dia{--a2:color-mix(in srgb,var(--acc) 60%,#fff);--vio:#7e63c9;position:relative;overflow:hidden;display:grid;gap:3px;width:100%;margin:2px 0 14px;padding:12px 14px 13px;border-radius:18px;border:1px solid var(--line);text-align:left;color:var(--ink);font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
.v8dia.manha{background:linear-gradient(120deg,color-mix(in srgb,var(--a2) 22%,var(--panel)),color-mix(in srgb,var(--vio) 12%,var(--panel)))}
.v8dia.tarde{background:linear-gradient(120deg,color-mix(in srgb,var(--acc) 26%,var(--panel)),color-mix(in srgb,var(--a2) 14%,var(--panel)))}
.v8dia.noite{background:linear-gradient(140deg,#2a2050,#151027);border-color:#30283f;color:#f3ecff}
.v8dia svg.i{fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;flex:none}
.v8dia .sky{position:absolute;inset:0;pointer-events:none}.v8dia .sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:currentColor;color:var(--acc)}.v8dia.noite .sky i{color:#fff}
.v8diaw{position:relative}.v8diaw .v8x{position:absolute;top:6px;right:6px;z-index:2;width:36px;height:36px;display:grid;place-items:center;border:0;border-radius:12px;background:none;color:var(--ink);opacity:.6;cursor:pointer;-webkit-tap-highlight-color:transparent}.v8diaw .v8x.noite{color:#f3ecff}.v8diaw .v8x svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round}
.v8dia-min{margin:2px 2px 12px;font-size:11px;font-weight:800;letter-spacing:.04em;color:var(--ink);opacity:.65}
.v8dia .astro{position:absolute;right:46px;top:9px;width:22px;height:22px;fill:none;stroke:var(--acc);stroke-width:1.4;opacity:.55}.v8dia .astro.lua{fill:#ffd6a3;stroke:none;opacity:.9}.v8dia .astro circle{fill:var(--a2);stroke:none}
.v8dia .comet{position:absolute;top:8px;left:-40%;width:90px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--a2) 70%,#fff);opacity:0;transform:translate(520px,60px) rotate(12deg);animation:v8Comet 1.4s .3s ease-out both;pointer-events:none}
@keyframes v8Comet{from{transform:translate(0,0) rotate(12deg);opacity:0}30%{opacity:1}to{transform:translate(520px,60px) rotate(12deg);opacity:0}}
.v8dia .top{position:relative;display:flex;align-items:center;gap:8px;padding-right:76px}.v8dia .dt{font-size:11px;font-weight:800;letter-spacing:.04em;opacity:.65}
.v8dia .k{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--vio)}.v8dia.noite .k{color:#c3b0ff}
.v8dia .big{position:relative;font-family:var(--v2-disp);font-weight:700;font-size:20px;line-height:1.15;letter-spacing:-.01em;padding-right:28px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v8dia .sub{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 10px;font-size:13px;font-weight:700}
.v8dia .sub > span{opacity:.85}.v8dia .sub em{font-style:normal;display:inline-flex;align-items:center;gap:2px;font-weight:900;color:var(--acc)}.v8dia.noite .sub em{color:#ffd6a3}
@media (prefers-reduced-motion: reduce){.v8dia .comet{display:none}}
`; TR.append(st); }
const V8DOW = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
function v8Hora() { const h = new Date().getHours(); return h >= 5 && h < 12 ? 'manha' : h >= 12 && h < 18 ? 'tarde' : 'noite'; }
function v8Ritmo() { // páginas por minuto das últimas sessões com cronômetro (só se houver dado suficiente)
  const F = (db.focus || []).filter((f) => (Number(f.minutes) || 0) > 0 && (Number(f.pages) || 0) > 0).slice(-30);
  const m = F.reduce((a, f) => a + Number(f.minutes), 0), p = F.reduce((a, f) => a + Number(f.pages), 0); return m >= 20 && p > 0 ? p / m : 0; }
// (Bia, 20/11) × dispensa o assunto: 1º toque passa ao próximo, 2º fecha até amanhã (fica só a data). Assunto já aberto
// (memória, trecho, meta, ler junto) sai sozinho; prazo, órbita e Pergunta do dia saem quando cumpridos. Tudo por dia.
function v8DiaSt() { let s = null; try { s = JSON.parse(localStorage.getItem('lv.v8diaX') || 'null'); } catch {} const t = todayISO(); return s && s.d === t ? s : { d: t, skip: [], seen: [], closed: false }; }
function v8DiaPut(s) { try { localStorage.setItem('lv.v8diaX', JSON.stringify(s)); } catch {} }
function v8DiaMsg() {
  const S9 = v8DiaSt(), sk = (k) => S9.skip.includes(k) || S9.seen.includes(k);
  const t = todayISO(), hr = v8Hora(), R = (() => { try { return reading(); } catch { return null; } })(), on = (k) => { try { return vFn(k); } catch { return true; } };
  // 0. sessão de leitura aberta (ex.: depois de recarregar a página): avisa e leva de volta (Bia, 20/11). Hora de início fixa, para a chave do cartão não mudar a cada minuto
  try { const ss = v2SesGet(); const se = ss && lib().find((x) => x.id === ss.libId); if (se) { const h = new Date(ss.start); return ['sessao', 'ler', 'Sessão aberta', `Você está lendo ${se.title}`, `desde as ${String(h.getHours()).padStart(2, '0')}:${String(h.getMinutes()).padStart(2, '0')}`, 'Voltar à sessão', se.id]; } } catch {}
  // 1. prazo (só enquanto a leitura de hoje não foi feita)
  // não repete o que já está na tela: o cartão do livro em leitura já mostra o prazo ("Hoje, leia até a pág. N"); o prazo só
  // viria aqui se o cartão do livro não aparecesse no Hoje (hoje ele aparece sempre que há livro em leitura)
  const heroOn = !!R;
  if (R && !heroOn && R.e.dueAt && on('prazos') && !sk('prazo')) { try { const d = dueToday(R.e);
    if (d && !d.done && !d.todayOff) { const left = Math.max(0, d.total - d.now), hoje = Math.max(0, d.target - d.now), dd = new Date(R.e.dueAt + 'T12:00:00Z'), dia = R.e.dueAt === t ? 'hoje' : 'até ' + V8DOW[dd.getUTCDay()];
      const r = v8Ritmo(), min = r && hoje ? Math.max(5, Math.round(hoje / r / 5) * 5) : 0;
      return ['prazo', 'cal', 'Prazo', `Faltam ${left} pág. ${dia}`, min ? `hoje ${hoje} pág. · uns ${min} min no seu ritmo` : `hoje ${hoje} pág., até a ${d.target}`, 'Começar sessão']; } } catch {} }
  // 2. órbita (só se ainda não leu hoje)
  if (R && on('orbita') && !sk('orbita')) { try { const days = new Set(); for (const x of readingEvents()) if (x.pages > 0) days.add(x.date); for (const f of db.focus || []) if (f.date) days.add(f.date);
    if (!days.has(t)) { const n = streakNow(); if (n > 0) return hr === 'noite' ? ['orbita', 'orb', 'Órbita', `Sua órbita de ${n} ${n === 1 ? 'dia' : 'dias'} acaba à meia-noite`, 'uma página já salva', 'Ler 1 página'] : ['orbita', 'orb', 'Órbita', `Mais um dia e sua órbita chega a ${n + 1}`, 'uma página hoje já conta', 'Ler agora']; } } catch {} }
  // 3. ler junto: alguém do grupo passou de você
  if (on('junto') && !sk('junto')) { try { for (const e of lib().filter((x) => x.status === 'LENDO')) { const b = v3Buddy(e); if (!b || !b.on || !b.ppl.length) continue; const me = readingInfo(e), top = b.ppl[0];
    if (top.pct > (me.pct || 0) + 0.5) { const tot = me.total || 0, pg = tot ? Math.round(top.pct / 100 * tot) : 0; return ['junto', 'friends', 'Ler junto', `${top.n.split(' ')[0]} passou de você em ${e.title}`, pg ? `pág. ${pg} · você está na ${me.now || 0}` : `${Math.round(top.pct)}% · você está em ${Math.round(me.pct || 0)}%`, 'Ler junto', e.id]; } } } catch {} }
  // 4. meta do ano
  if (on('metas') && !sk('meta')) { try { const m = myStatsSnap().meta; if (m && m.alvo > m.feitos) { const f = m.alvo - m.feitos, fim = Date.parse(m.ano + '-12-31'), dl = Math.max(1, Math.round((fim - Date.parse(t)) / 864e5) + 1), cada = Math.max(1, Math.floor(dl / f));
    return ['meta', 'meta', 'Meta', `Faltam ${f} ${f === 1 ? 'livro' : 'livros'} para a meta de ${m.ano}`, cada <= 1 ? 'mais de um por dia até dezembro' : `um a cada ${cada} dias até dezembro`, 'Ver meta']; } } catch {} }
  // 5. memória: terminou neste dia em outro ano
  if (!sk('memoria')) try { const md = t.slice(5), L = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').slice(5, 10) === md && String(e.finishedAt).slice(0, 4) < t.slice(0, 4) && !e.noDate && !e.dateApprox);
    if (L.length) { const e = L[0], a = Number(t.slice(0, 4)) - Number(String(e.finishedAt).slice(0, 4)), r = reviewOfLib(e) || {};
      return ['memoria', 'heart', a === 1 ? 'Há 1 ano' : `Há ${a} anos`, `Você terminou ${e.title}`, r.paws ? `deu ★${String(r.paws).replace('.', ',')}` : 'toque para rever o livro', 'Ver o livro', e.id]; } } catch {}
  // 6. Pergunta do dia (ainda sem o seu voto)
  if (on('qday') && !sk('qday')) { try { const Q = typeof V6QD !== 'undefined' ? V6QD : null; if (Q && Q.question && !Q.mine && Q.total > 0) return ['qday', 'reply', DEB.nome, `${Q.total} ${Q.total === 1 ? 'pessoa já votou' : 'pessoas já votaram'}`, 'falta o seu voto', 'Votar']; } catch {} }
  // 7. trecho salvo (um por dia, sempre o mesmo no dia)
  if (!sk('trecho')) try { const Qs = []; for (const e of lib()) for (const q of e.quotes || []) if (q && q.t && String(q.t).length <= 160) Qs.push([e, q]);
    if (Qs.length) { let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) | 0; const [e, q] = Qs[Math.abs(h) % Qs.length];
      return ['trecho', 'quote', 'Seu trecho', `“${String(q.t).replace(/^["“]|["”]$/g, '')}”`, e.title + (q.p ? ' · pág. ' + q.p : ''), e.status === 'LENDO' ? 'Continuar lendo' : 'Ver o livro', e.id]; } } catch {}
  return null;
}
// Card de lembretes (Bia, 23/11): prazo, órbita, ler junto, meta e Debate semanal no mesmo cartão do topo. Com 2 ou mais, ele
// alterna sozinho a cada 6 s (pausa ao tocar, segurar ou focar; não alterna com movimento reduzido). Os lembretes ficam
// empilhados na mesma célula, então a altura é a do maior e nada pula. Pontinhos mostram quantos são; o × fecha só o lembrete
// da vez, naquele dia. O Debate abre o voto no próprio cartão (capas + Outro livro), sem tela nova.
let V8I = 0, V8QDV = false;
function v8DiaSkip(k) { const s = v8DiaSt(); if (!s.skip.includes(k)) s.skip.push(k); v8DiaPut(s); V8QDV = false; }
function v8DiaList() {
  const S9 = v8DiaSt(), sk = (k) => S9.skip.includes(k), t = todayISO(), on = (k) => { try { return vFn(k); } catch { return true; } };
  const R = (() => { try { return reading(); } catch { return null; } })(), out = [];
  const first = (() => { try { return v8DiaMsg(); } catch { return null; } })();
  if (first && first[0] === 'sessao') return [first];
  // prazo (também quando passou)
  if (R && R.e.dueAt && on('prazos') && !sk('prazo')) { try { const d = dueToday(R.e), dd = new Date(R.e.dueAt + 'T12:00:00Z'), dia = R.e.dueAt === t ? 'hoje' : 'até ' + V8DOW[dd.getUTCDay()];
    if (!d) out.push(['prazo', 'cal', 'Prazo', `O prazo de ${R.e.title} passou`, 'escolha uma data nova', 'Ajustar', 'late']);
    else if (!d.done && !d.todayOff) { const left = Math.max(0, d.total - d.now), hoje = Math.max(0, d.target - d.now), r = v8Ritmo(), min = r && hoje ? Math.max(5, Math.round(hoje / r / 5) * 5) : 0;
      out.push(['prazo', 'cal', 'Prazo', `Faltam ${left} pág. ${dia}`, min ? `hoje ${hoje} pág. · uns ${min} min no seu ritmo` : `hoje até a pág. ${d.target}`, 'Ler']); } } catch {} }
  // órbita (só se ainda não leu hoje)
  if (R && on('orbita') && !sk('orbita')) { try { const days = new Set(); for (const x of readingEvents()) if (x.pages > 0) days.add(x.date); for (const f of db.focus || []) if (f.date) days.add(f.date);
    if (!days.has(t)) { const n = streakNow(); if (n > 0) out.push(v8Hora() === 'noite' ? ['orbita', 'orb', 'Órbita', `Sua órbita de ${n} ${n === 1 ? 'dia' : 'dias'} acaba à meia-noite`, 'uma página já salva', 'Ler'] : ['orbita', 'orb', 'Órbita', `Mais um dia e sua órbita chega a ${n + 1}`, 'uma página hoje já conta', 'Ler']); } } catch {} }
  if (first && first[0] === 'junto' && !sk('junto')) out.push(first);
  // meta do ano
  if (on('metas') && !sk('meta')) { try { const m = myStatsSnap().meta; if (m && m.alvo > m.feitos) { const f = m.alvo - m.feitos, fim = Date.parse(m.ano + '-12-31'), dl = Math.max(1, Math.round((fim - Date.parse(t)) / 864e5) + 1), cada = Math.max(1, Math.floor(dl / f));
    out.push(['meta', 'meta', 'Meta', `Faltam ${f} ${f === 1 ? 'livro' : 'livros'} para a meta de ${m.ano}`, cada <= 1 ? 'mais de um por dia até dezembro' : `um a cada ${cada} dias até dezembro`, 'Ver meta']); } } catch {} }
  // Debate semanal sem o seu voto
  if (on('qday') && !sk('qday') && !(() => { try { return homePrefs().off.includes('qday'); } catch { return false; } })()) { try { const Q = typeof V6QD !== 'undefined' ? V6QD : null; if (Q && Q.question && !Q.failed && !Q.mine) out.push(['qday', 'reply', DEB.nome, Q.question, Q.total ? `${Q.total} ${Q.total === 1 ? 'voto' : 'votos'} · falta o seu` : 'vote e veja o resultado', 'Votar']); } catch {} }
  if (out.length) return out;
  // sem lembrete: uma lembrança (memória ou trecho), como antes
  return first && (first[0] === 'memoria' || first[0] === 'trecho') ? [first] : [];
}
function v8DiaQdHTML() { // capas para votar, dentro do card
  let bks = []; try { const [, from] = v2QOfDay(); bks = v2QBooks(from); } catch {}
  const Q = typeof V6QD !== 'undefined' ? V6QD : null;
  return `<div class="v8qdv" role="group" aria-label="Votar no ${esc(DEB.nome)}">${v6QdPicks(bks).replace(/ data-qb=/g, ' data-v8qb=')}<div class="ft"><span>${Q && Q.total ? Q.total + (Q.total === 1 ? ' voto até agora' : ' votos até agora') : 'Vote e veja o resultado'}</span><button type="button" data-q6go="1">Ver o debate ›</button></div></div>`;
}
function v8DiaHTML() {
  const L = v8DiaList(), hr = v8Hora(), noite = hr === 'noite', d = new Date();
  const dt = V8DOW[d.getDay()].slice(0, 3) + ' · ' + d.getDate() + ' ' + d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const stars = Array.from({ length: noite ? 16 : 7 }, (_, i) => `<i style="left:${(i * 41 + 9) % 100}%;top:${(i * 29 + 13) % 80}%;opacity:${(0.3 + (i % 4) / 6).toFixed(2)}"></i>`).join('');
  const astro = noite ? '<svg class="astro lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/></svg>' : '<svg class="astro" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(-18 12 12)"/></svg>';
  if (!L.length) return `<div class="v8dia-min">${esc(dt)}</div>`;
  if (V8QDV && !L.some((m) => m[0] === 'qday')) V8QDV = false;
  let a = V8QDV ? L.findIndex((m) => m[0] === 'qday') : V8I % L.length; if (a < 0) a = 0; V8I = a;
  const cur = L[a];
  const sl = L.map(([k, icn, rot, big, sub, cta, id], i) => `<button type="button" class="sl${i === a ? ' on' : ''}" data-v8k="${k}" data-v8id="${esc(id || '')}" data-i="${i}" aria-label="${esc(rot)}: ${esc(big)}. ${esc(cta)}"${i === a ? '' : ' tabindex="-1" aria-hidden="true"'}>`
    + `<span class="top"><span class="dt">${esc(dt)}</span><span class="k">${v4ic(icn, 13)}${esc(rot)}</span></span>`
    + `<b class="big">${esc(big)}</b><span class="sub"><span>${esc(sub)}</span><em>${k === 'qday' && V8QDV ? 'Fechar' : esc(cta)} ${v4ic('chev', 14)}</em></span></button>`).join('');
  const dots = L.length > 1 ? `<span class="v8dots">${L.map((m, i) => `<button type="button" data-v8dot="${i}" aria-label="Lembrete ${i + 1} de ${L.length}: ${esc(m[2])}"${i === a ? ' class="on" aria-current="true"' : ''}><i></i></button>`).join('')}</span>` : '';
  const x = cur[0] === 'sessao' ? '' : `<button type="button" class="v8x ${hr}" data-v8x="${cur[0]}" aria-label="Dispensar este lembrete hoje"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>`;
  return `<div class="v8diaw${L.length > 1 ? ' multi' : ''}${V8QDV ? ' qdv' : ''}"><div class="v8dia ${hr}" data-n="${L.length}">${astro}<span class="sky">${stars}</span><span class="sls">${sl}</span>${dots}${V8QDV ? v8DiaQdHTML() : ''}</div>${x}</div>`;
}
// alternar sozinho: troca só a classe (sem redesenhar), guarda o índice para o próximo desenho do Hoje vir no mesmo lembrete
function v8DiaShow(w, i) { const sl = [...w.querySelectorAll('.sls > .sl')]; if (sl.length < 2) return; i = ((i % sl.length) + sl.length) % sl.length; V8I = i;
  sl.forEach((b, j) => { const on = j === i; b.classList.toggle('on', on); if (on) { b.removeAttribute('tabindex'); b.removeAttribute('aria-hidden'); } else { b.setAttribute('tabindex', '-1'); b.setAttribute('aria-hidden', 'true'); } });
  w.querySelectorAll('[data-v8dot]').forEach((b, j) => { b.classList.toggle('on', j === i); if (j === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
  const x = w.querySelector('.v8x[data-v8x]'); if (x) x.dataset.v8x = sl[i].dataset.v8k; }
{ let hold = 0; const RMv = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
  TR.addEventListener('pointerdown', (ev) => { if (ev.target.closest && ev.target.closest('.v8diaw')) hold = Date.now() + 8000; }, true);
  setInterval(() => { if (RMv() || Date.now() < hold || document.hidden || S.tab !== 'inicio') return; const w = TR.querySelector('#lista:not(.lista-snap) .v8diaw.multi:not(.qdv)'); if (!w || w.matches(':hover') || w.contains(TR.activeElement)) return;
    const r = w.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; v8DiaShow(w, V8I + 1); }, 6000);
  TR.addEventListener('click', (ev) => { const d = ev.target.closest && ev.target.closest('.v8diaw [data-v8dot]'); if (d) { ev.stopPropagation(); ev.preventDefault(); hold = Date.now() + 12000; v8DiaShow(d.closest('.v8diaw'), +d.dataset.v8dot); return; }
    const v = ev.target.closest && ev.target.closest('.v8diaw [data-v8qb]'); if (v) { ev.stopPropagation(); ev.preventDefault(); V8QDV = false; try { v6QdOpenDay = ''; } catch {} try { v2QAnswer(v.dataset.v8qb); } catch (err) { console.warn('votar', err); } v8DiaRedraw(v); } }, true); }
{ const st = document.createElement('style'); st.textContent = `
.v8dia .sls{position:relative;display:grid}.v8dia .sls > .sl{grid-area:1/1;display:grid;gap:3px;align-content:start;border:0;background:none;padding:0;margin:0;text-align:left;font:inherit;color:inherit;cursor:pointer;visibility:hidden;opacity:0;transition:opacity .35s ease;-webkit-tap-highlight-color:transparent;min-width:0}
.v8dia .sls > .sl.on{visibility:visible;opacity:1}
.v8dia .sls > .sl .big{min-height:2.3em}
.v8dia .v8dots{position:relative;display:flex;gap:2px;margin:2px 0 -6px -10px}.v8dia .v8dots button{width:22px;height:22px;display:grid;place-items:center;border:0;background:none;padding:0;cursor:pointer}
.v8dia .v8dots i{display:block;width:6px;height:6px;border-radius:9px;background:currentColor;opacity:.28;transition:width .2s}.v8dia .v8dots .on i{width:16px;opacity:1;background:var(--acc)}
.v8diaw .v8dia{cursor:default}
.v8dia .v8qdv{position:relative;margin-top:8px;display:grid;gap:8px}
.v8dia .v8qdv .qpicks{display:flex;gap:10px;overflow-x:auto;padding:2px 2px 4px;scrollbar-width:none}
.v8dia .v8qdv .qpicks button{display:grid;gap:5px;justify-items:center;align-content:start;border:0;background:none;padding:0;font:inherit;font-size:11.5px;font-weight:800;color:inherit;width:66px;flex:none;text-align:center;cursor:pointer;min-height:44px}
.v8dia .v8qdv .qpicks button span:last-child{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.v8dia .v8qdv .qcv{width:58px;height:87px;border-radius:3px 7px 7px 3px;box-shadow:0 4px 10px rgba(0,0,0,.22);font-size:.55rem}
.v8dia .v8qdv .qo{display:grid;place-items:center;background:color-mix(in srgb,currentColor 8%,transparent);border:1.5px dashed color-mix(in srgb,currentColor 35%,transparent);box-shadow:none}.v8dia .v8qdv .qo svg{width:22px;height:22px}
.v8dia .v8qdv .ft{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:12.5px;font-weight:700}.v8dia .v8qdv .ft span{opacity:.8}
.v8dia .v8qdv .ft button{border:0;background:none;font:inherit;font-weight:900;color:var(--acc);padding:10px 0;min-height:44px;cursor:pointer}.v8dia.noite .v8qdv .ft button{color:#ffd6a3}
/* o cartão grande do Debate saiu do Hoje: o voto mora no card de lembretes */
#lista [data-v2qd]{display:none!important}
@media (prefers-reduced-motion: reduce){.v8dia .sls > .sl{transition:none}}
`; TR.append(st); }
const v8DiaRedraw = (el) => { try { const w = el.closest('.v8diaw') || el; const tmp = document.createElement('div'); tmp.innerHTML = v8DiaHTML(); const n = tmp.firstElementChild; if (n) w.replaceWith(n); } catch {} };
TR.addEventListener('click', (ev) => {
  const xb = ev.target.closest && ev.target.closest('.v8x[data-v8x]');
  if (xb) { ev.stopPropagation(); ev.preventDefault(); v8DiaSkip(xb.dataset.v8x); v8DiaRedraw(xb); return; }
  const b = ev.target.closest && ev.target.closest('[data-v8k]'); if (!b || !b.closest('.v8diaw')) return; ev.stopPropagation();
  const k = b.dataset.v8k;
  if (['memoria', 'trecho', 'meta', 'junto'].includes(k)) { const s = v8DiaSt(); if (!s.seen.includes(k)) { s.seen.push(k); v8DiaPut(s); } setTimeout(() => v8DiaRedraw(b), 400); }
  const e = b.dataset.v8id ? byId(b.dataset.v8id) : null, R = (() => { try { return reading(); } catch { return null; } })();
  try {
    if (k === 'sessao') { if (e) v4Open(e); return; }
    if (k === 'prazo' && b.dataset.v8id === 'late') { const h = TR.querySelector('#lista:not(.lista-snap) [data-h3="prazo"]'); if (h) h.click(); else if (R) openBookPage(R.e); return; }
    if (k === 'prazo' || k === 'orbita') { if (R) v4Open(R.e); return; }
    if (k === 'junto') { if (e) openBuddyPage(e); return; }
    if (k === 'meta') { openGoalPage(Number(todayISO().slice(0, 4))); return; }
    if (k === 'memoria') { if (e) openBookPage(e); return; }
    if (k === 'qday') { V8QDV = !V8QDV; v8DiaRedraw(b); return; }
    if (k === 'trecho') { if (e && e.status === 'LENDO') v4Open(e); else if (e) openBookPage(e); }
  } catch (err) { console.warn('abertura do dia', err); }
}, true);
// cometa: só na 1ª abertura do dia, fora do HTML do cartão (para a chave do Hoje não mudar)
new MutationObserver(() => { const c = TR.querySelector('#lista:not(.lista-snap) .v8dia'); if (!c || c.dataset.cm) return; c.dataset.cm = '1'; let seen = ''; try { seen = localStorage.getItem('lv.v8dia') || ''; } catch {}
  const t = todayISO(); if (seen === t) return; try { localStorage.setItem('lv.v8dia', t); } catch {} const i = document.createElement('i'); i.className = 'comet'; i.setAttribute('aria-hidden', 'true'); c.append(i); setTimeout(() => i.remove(), 2000); }).observe(TR, { childList: true, subtree: true });
// deslizar o cartão para o lado = mesmo efeito do × (1º: próximo assunto; 2º: fecha até amanhã). Sessão aberta só volta ao lugar.
{ const st = document.createElement('style'); st.textContent = `.v8diaw{touch-action:pan-y;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;overflow:clip;overflow-clip-margin:2px}.v8diaw>*{transform:translateX(var(--dx,0px))}.v8diaw.back,.v8diaw.back>*{transition:transform .22s ease,opacity .22s ease}.v8diaw.out,.v8diaw.out>*{transition:transform .2s ease-in,opacity .2s ease-in}`; TR.append(st); }
{ let d = null;
  TR.addEventListener('pointerdown', (ev) => { const w = ev.target.closest && ev.target.closest('.v8diaw'); if (!w || ev.target.closest('.v8x') || (ev.pointerType === 'mouse' && ev.button)) return;
    d = { w, x: ev.clientX, y: ev.clientY, dx: 0, on: false, id: ev.pointerId }; }, true);
  window.addEventListener('pointermove', (ev) => { if (!d || ev.pointerId !== d.id) return; if (!d.w.isConnected) { const n = TR.querySelector('#lista:not(.lista-snap) .v8diaw'); if (!n) { d = null; return; } d.w = n; if (d.on) n.classList.add('drag'); } const dx = ev.clientX - d.x, dy = ev.clientY - d.y;
    if (!d.on) { if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { d = null; return; } if (Math.abs(dx) < 10) return; d.on = true; d.w.classList.remove('back'); d.w.classList.add('drag'); }
    d.dx = dx; const can = !!d.w.querySelector('.v8x'), v = can ? dx : dx * 0.25; d.w.style.setProperty('--dx', v + 'px'); d.w.style.opacity = can ? String(Math.max(0.3, 1 - Math.abs(dx) / (d.w.offsetWidth || 300))) : ''; }, true);
  const end = (ev) => { if (!d || ev.pointerId !== d.id) return; let { w, dx, on } = d; d = null; if (!on) return; if (!w.isConnected) w = TR.querySelector('#lista:not(.lista-snap) .v8diaw') || w;
    w.classList.remove('drag'); const xb = w.querySelector('.v8x[data-v8x]'), lim = (w.offsetWidth || 300) * 0.3;
    const stop = (e) => { e.stopPropagation(); e.preventDefault(); }; window.addEventListener('click', stop, { capture: true, once: true }); setTimeout(() => window.removeEventListener('click', stop, true), 350);
    if (xb && Math.abs(dx) > lim) { w.classList.add('out'); w.style.setProperty('--dx', (dx > 0 ? 1 : -1) * (w.offsetWidth + 20) + 'px'); w.style.opacity = '0';
      setTimeout(() => { v8DiaSkip(xb.dataset.v8x); v8DiaRedraw(w); }, 200); return; }
    w.classList.add('back'); w.style.removeProperty('--dx'); w.style.opacity = ''; };
  window.addEventListener('pointerup', end, true); window.addEventListener('pointercancel', end, true); }
