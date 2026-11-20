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
.v8dia .astro{position:absolute;right:12px;top:10px;width:30px;height:30px;fill:none;stroke:var(--acc);stroke-width:1.4;opacity:.55}.v8dia .astro.lua{fill:#ffd6a3;stroke:none;opacity:.9}.v8dia .astro circle{fill:var(--a2);stroke:none}
.v8dia .comet{position:absolute;top:8px;left:-40%;width:90px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--a2) 70%,#fff);opacity:0;transform:translate(520px,60px) rotate(12deg);animation:v8Comet 1.4s .3s ease-out both;pointer-events:none}
@keyframes v8Comet{from{transform:translate(0,0) rotate(12deg);opacity:0}30%{opacity:1}to{transform:translate(520px,60px) rotate(12deg);opacity:0}}
.v8dia .top{position:relative;display:flex;align-items:center;gap:8px;padding-right:34px}.v8dia .dt{font-size:11px;font-weight:800;letter-spacing:.04em;opacity:.65}
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
function v8DiaMsg() {
  const t = todayISO(), hr = v8Hora(), R = (() => { try { return reading(); } catch { return null; } })(), on = (k) => { try { return vFn(k); } catch { return true; } };
  // 1. prazo (só enquanto a leitura de hoje não foi feita)
  if (R && R.e.dueAt && on('prazos')) { try { const d = dueToday(R.e);
    if (d && !d.done && !d.todayOff) { const left = Math.max(0, d.total - d.now), hoje = Math.max(0, d.target - d.now), dd = new Date(R.e.dueAt + 'T12:00:00Z'), dia = R.e.dueAt === t ? 'hoje' : 'até ' + V8DOW[dd.getUTCDay()];
      const r = v8Ritmo(), min = r && hoje ? Math.max(5, Math.round(hoje / r / 5) * 5) : 0;
      return ['prazo', 'cal', 'Prazo', `Faltam ${left} pág. ${dia}`, min ? `hoje ${hoje} pág. · uns ${min} min no seu ritmo` : `hoje ${hoje} pág., até a ${d.target}`, 'Começar sessão']; } } catch {} }
  // 2. órbita (só se ainda não leu hoje)
  if (R && on('orbita')) { try { const days = new Set(); for (const x of readingEvents()) if (x.pages > 0) days.add(x.date); for (const f of db.focus || []) if (f.date) days.add(f.date);
    if (!days.has(t)) { const n = streakNow(); if (n > 0) return hr === 'noite' ? ['orbita', 'orb', 'Órbita', `Sua órbita de ${n} ${n === 1 ? 'dia' : 'dias'} acaba à meia-noite`, 'uma página já salva', 'Ler 1 página'] : ['orbita', 'orb', 'Órbita', `Mais um dia e sua órbita chega a ${n + 1}`, 'uma página hoje já conta', 'Ler agora']; } } catch {} }
  // 3. ler junto: alguém do grupo passou de você
  if (on('junto')) { try { for (const e of lib().filter((x) => x.status === 'LENDO')) { const b = v3Buddy(e); if (!b || !b.on || !b.ppl.length) continue; const me = readingInfo(e), top = b.ppl[0];
    if (top.pct > (me.pct || 0) + 0.5) { const tot = me.total || 0, pg = tot ? Math.round(top.pct / 100 * tot) : 0; return ['junto', 'friends', 'Ler junto', `${top.n.split(' ')[0]} passou de você em ${e.title}`, pg ? `pág. ${pg} · você está na ${me.now || 0}` : `${Math.round(top.pct)}% · você está em ${Math.round(me.pct || 0)}%`, 'Ler junto', e.id]; } } } catch {} }
  // 4. meta do ano
  if (on('metas')) { try { const m = myStatsSnap().meta; if (m && m.alvo > m.feitos) { const f = m.alvo - m.feitos, fim = Date.parse(m.ano + '-12-31'), dl = Math.max(1, Math.round((fim - Date.parse(t)) / 864e5) + 1), cada = Math.max(1, Math.floor(dl / f));
    return ['meta', 'meta', 'Meta', `Faltam ${f} ${f === 1 ? 'livro' : 'livros'} para a meta de ${m.ano}`, cada <= 1 ? 'mais de um por dia até dezembro' : `um a cada ${cada} dias até dezembro`, 'Ver meta']; } } catch {} }
  // 5. memória: terminou neste dia em outro ano
  try { const md = t.slice(5), L = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').slice(5, 10) === md && String(e.finishedAt).slice(0, 4) < t.slice(0, 4) && !e.noDate && !e.dateApprox);
    if (L.length) { const e = L[0], a = Number(t.slice(0, 4)) - Number(String(e.finishedAt).slice(0, 4)), r = reviewOfLib(e) || {};
      return ['memoria', 'heart', a === 1 ? 'Há 1 ano' : `Há ${a} anos`, `Você terminou ${e.title}`, r.paws ? `deu ★${String(r.paws).replace('.', ',')}` : 'toque para rever o livro', 'Ver o livro', e.id]; } } catch {}
  // 6. Pergunta do dia (ainda sem o seu voto)
  if (on('qday')) { try { const Q = typeof V6QD !== 'undefined' ? V6QD : null; if (Q && Q.question && !Q.mine && Q.total > 0) return ['qday', 'reply', 'Pergunta do dia', `${Q.total} ${Q.total === 1 ? 'pessoa já votou' : 'pessoas já votaram'}`, 'falta o seu voto', 'Votar']; } catch {} }
  // 7. trecho salvo (um por dia, sempre o mesmo no dia)
  try { const Qs = []; for (const e of lib()) for (const q of e.quotes || []) if (q && q.t && String(q.t).length <= 160) Qs.push([e, q]);
    if (Qs.length) { let h = 0; for (const c of t) h = (h * 31 + c.charCodeAt(0)) | 0; const [e, q] = Qs[Math.abs(h) % Qs.length];
      return ['trecho', 'quote', 'Seu trecho', `“${String(q.t).replace(/^["“]|["”]$/g, '')}”`, e.title + (q.p ? ' · pág. ' + q.p : ''), e.status === 'LENDO' ? 'Continuar lendo' : 'Ver o livro', e.id]; } } catch {}
  return null;
}
function v8DiaHTML() {
  const M = v8DiaMsg(), hr = v8Hora(), noite = hr === 'noite', d = new Date();
  const dt = V8DOW[d.getDay()].slice(0, 3) + ' · ' + d.getDate() + ' ' + d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  const stars = Array.from({ length: noite ? 16 : 7 }, (_, i) => `<i style="left:${(i * 41 + 9) % 100}%;top:${(i * 29 + 13) % 80}%;opacity:${(0.3 + (i % 4) / 6).toFixed(2)}"></i>`).join('');
  const astro = noite ? '<svg class="astro lua" viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.6A7 7 0 0 1 15.5 3.5z"/></svg>' : '<svg class="astro" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(-18 12 12)"/></svg>';
  if (!M) return `<div class="v8dia ${hr}" role="note">${astro}<span class="sky">${stars}</span><span class="top"><span class="dt">${esc(dt)}</span></span><b class="big">${noite ? 'O céu de hoje está calmo' : 'Um bom dia para ler'}</b></div>`;
  const [k, icn, rot, big, sub, cta, id] = M;
  return `<button type="button" class="v8dia ${hr}" data-v8k="${k}" data-v8id="${esc(id || '')}" aria-label="${esc(big)}. ${esc(cta)}">${astro}<span class="sky">${stars}</span>`
    + `<span class="top"><span class="dt">${esc(dt)}</span><span class="k">${v4ic(icn, 13)}${esc(rot)}</span></span>`
    + `<b class="big">${esc(big)}</b><span class="sub"><span>${esc(sub)}</span><em>${esc(cta)} ${v4ic('chev', 14)}</em></span></button>`;
}
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('.v8dia[data-v8k]'); if (!b) return; ev.stopPropagation();
  const k = b.dataset.v8k, e = b.dataset.v8id ? byId(b.dataset.v8id) : null, R = (() => { try { return reading(); } catch { return null; } })();
  try {
    if (k === 'prazo' || k === 'orbita') { if (R) v4Open(R.e); return; }
    if (k === 'junto') { if (e) openBuddyPage(e); return; }
    if (k === 'meta') { openGoalPage(Number(todayISO().slice(0, 4))); return; }
    if (k === 'memoria') { if (e) openBookPage(e); return; }
    if (k === 'qday') { const q = TR.querySelector('#lista [data-v2qd]'); if (q) q.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (k === 'trecho') { if (e && e.status === 'LENDO') v4Open(e); else if (e) openBookPage(e); }
  } catch (err) { console.warn('abertura do dia', err); }
}, true);
// cometa: só na 1ª abertura do dia, fora do HTML do cartão (para a chave do Hoje não mudar)
new MutationObserver(() => { const c = TR.querySelector('#lista:not(.lista-snap) .v8dia'); if (!c || c.dataset.cm) return; c.dataset.cm = '1'; let seen = ''; try { seen = localStorage.getItem('lv.v8dia') || ''; } catch {}
  const t = todayISO(); if (seen === t) return; try { localStorage.setItem('lv.v8dia', t); } catch {} const i = document.createElement('i'); i.className = 'comet'; i.setAttribute('aria-hidden', 'true'); c.append(i); setTimeout(() => i.remove(), 2000); }).observe(TR, { childList: true, subtree: true });
