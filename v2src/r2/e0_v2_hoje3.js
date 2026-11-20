// v3 Hoje (Bia, 19/11, protótipo https://claude.ai/artifact/FZDpofzVvP8EJjSrugBoJc, branch livroverso-2).
// Tela montada do zero a partir dos dados; as seções antigas da coluna ficam escondidas (não são apagadas, porque outros
// blocos ainda leem delas, ex.: a meta do ano em #ini-meta). Ordem:
//  1. saudação; 2. livro atual: anel com a lua à esquerda e números à direita (sem título/autor, que já estão na capa);
//     atalhos Página · Terminei · Trecho · Ler junto · Mais (Ler junto mostra a inicial e a página de quem lê junto;
//     com 2+ pessoas, duas iniciais e "+N"); toque na capa abre a página do livro, segurar abre o menu do livro;
//  3. "Também lendo" (troca o livro do Hoje); 4. linha Prazo · Órbita · Meta; 5. destaque do dia: UM cartão só
//     (lembrete de empréstimo/presente > Resumo do mês nos dias 1–7 > Pergunta do dia); 6. A seguir (próxima da fila,
//     "Qual leio agora?"); 7. indicações recebidas; 8. Para você. Personalizar Início e Funções do app continuam valendo.
Object.assign(V2I, { qt: '<path class="d" d="M5 17c-1.5-1-2-2.5-2-4.5C3 9 5 7 8 6.5v3c-1.3.5-2 1.4-2 2.6h2V17zM14 17c-1.5-1-2-2.5-2-4.5 0-3.5 2-5.5 5-6v3c-1.3.5-2 1.4-2 2.6h2V17z"/><path d="M5 17c-1.5-1-2-2.5-2-4.5C3 9 5 7 8 6.5v3c-1.3.5-2 1.4-2 2.6h2V17zM14 17c-1.5-1-2-2.5-2-4.5 0-3.5 2-5.5 5-6v3c-1.3.5-2 1.4-2 2.6h2V17z"/>' });
{ const st = document.createElement('style'); st.textContent = `
.v3-colA.v3h{display:flex!important;flex-direction:column}
.v3-colA.v3h{position:relative}
.v3-colA.v3h > *:not(.v3x):not(.v3mom):not(#rc-host):not(#pv-host):not(.v3show){position:absolute!important;left:-9999px!important;top:0!important;width:300px!important;visibility:hidden!important;pointer-events:none!important}
.v3-colA.v3h > .v3x,.v3-colA.v3h > .v3mom,.v3-colA.v3h > #rc-host:not(:empty),.v3-colA.v3h > #pv-host,.v3-colA.v3h > .v3show{display:block!important}
.v3-colA.v3h > .v3x,.v3-colA.v3h > .v3mom,.v3-colA.v3h > #rc-host,.v3-colA.v3h > #pv-host,.v3-colA.v3h > .v3show{align-self:stretch!important;width:auto!important;max-width:none!important;box-sizing:border-box}
.v3-colA.v3h > .orb-row{display:block!important} /* orb-row usa display:contents: os filhos invisíveis viravam itens da coluna e abriam um buraco */
.v3-colA.v3h > .v3x-a{order:1}.v3-colA.v3h > .v3show{order:2}.v3-colA.v3h > .v3mom{order:3;margin-top:.9rem!important}.v3-colA.v3h > .v3x-b{order:4}.v3-colA.v3h > #rc-host{order:5;margin-top:1rem}.v3-colA.v3h > #pv-host{order:6;margin-top:1rem}
.v3x .hello{margin:.1rem 0 14px}.v3x .hello small{display:block;font-size:10.5px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2)}
.v3x .hello b{display:block;font-family:var(--v2-disp);font-size:27px;line-height:1.15;letter-spacing:-.01em;color:var(--ink);margin-top:.15rem}
.v3hero{position:relative;z-index:1;touch-action:pan-y;user-select:none;display:grid;grid-template-columns:auto 1fr;align-items:center;gap:14px 16px;padding:16px;border:1px solid var(--line);border-radius:var(--v2-r);background:var(--panel);box-shadow:var(--v2-sh)}
.v3ring{position:relative;width:150px;height:150px;border:0;background:none;padding:0;display:grid;place-items:center;-webkit-touch-callout:none;user-select:none;cursor:pointer}
.v3ring svg{position:absolute;inset:0;width:100%;height:100%}
.v3ring .v3cv{width:64px;height:96px;border-radius:4px 7px 7px 4px;object-fit:cover;box-shadow:0 6px 14px rgba(0,0,0,.25);position:relative;z-index:1;font-size:.6rem}
.v3ring .moon{position:absolute;z-index:2;width:15px;height:15px;margin:-7.5px 0 0 -7.5px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#fff3c4,#f0b84a 60%,#c98a1c);box-shadow:0 0 0 3px var(--panel),0 0 12px rgba(240,184,74,.7)}
.v3hero .inf{display:grid;justify-items:start;gap:2px;min-width:0}
.v3hero .pct{font-family:var(--v2-disp);font-size:34px;line-height:1;font-weight:700;color:var(--ink)}
.v3hero .pg{font-size:13px;font-weight:800;color:var(--ink-2)}
.v3hero .eta{font-size:12px;font-weight:800;color:var(--acc);margin-top:6px;line-height:1.3}
.v3hero .eta.due{display:grid;gap:5px;width:100%;border:0;background:color-mix(in srgb,var(--acc) 14%,transparent);border-radius:12px;padding:7px 10px;font:inherit;font-size:12.5px;font-weight:800;color:var(--ink-2);text-align:left;cursor:pointer}
.v3hero .eta.due b{color:var(--acc);font-weight:900}.v3hero .eta.due.ok .dt{color:var(--acc)}
.v3hero .eta.due small{display:flex;align-items:center;gap:4px;font-size:11px;font-weight:700;color:var(--ink-2)}.v3hero .eta.due small svg{width:12px;height:12px;flex:none}
.v3herow{position:relative}
.v3herow.multi::after{content:"";position:absolute;z-index:0;right:-7px;top:16px;bottom:16px;width:14px;border-radius:0 var(--v2-r) var(--v2-r) 0;background:var(--panel);border:1px solid var(--line);border-left:0;opacity:.55}
.v3hero.sl-l{animation:v3slL .28s ease-out}.v3hero.sl-r{animation:v3slR .28s ease-out}
@keyframes v3slL{from{transform:translateX(26px);opacity:.4}to{transform:none;opacity:1}}@keyframes v3slR{from{transform:translateX(-26px);opacity:.4}to{transform:none;opacity:1}}
.v3dots{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px;padding:0 2px}
.v3dots .pp{display:flex;gap:6px}.v3dots .pp button{width:7px;height:7px;padding:0;border:0;border-radius:9px;background:color-mix(in srgb,var(--ink) 18%,transparent);transition:width .2s;cursor:pointer}.v3dots .pp button.on{width:20px;background:var(--acc)}
.v3dots .nx{display:flex;align-items:center;gap:4px;border:0;background:none;padding:4px 0;font:inherit;font-size:12px;font-weight:800;color:var(--ink-2);min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.v3dots .nx svg{width:13px;height:13px;flex:none}.v3dots .cdue{display:inline-flex;align-items:center;gap:3px;margin-left:4px;font-size:11px;font-weight:900;color:var(--acc)}
.v3hero .acts{grid-column:1/-1;display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:6px;width:100%}
.v3qa{border:0;display:grid;justify-items:center;align-content:center;gap:4px;padding:9px 2px 7px;border-radius:14px;background:color-mix(in srgb,var(--ink) 6%,var(--panel));color:var(--ink);font:inherit;font-size:11.5px;font-weight:800;min-height:58px}
.v3qa .v2i{width:20px;height:20px;color:var(--acc)}
.v3qa.p{background:linear-gradient(135deg,#e9a35c,#c46f2e);color:#fff;box-shadow:0 5px 12px rgba(196,111,46,.28)}.v3qa.p .v2i{color:#fff}
.v3qa.hi{box-shadow:inset 0 0 0 2px var(--acc)}
.v3av{position:relative;display:flex}.v3av b{width:22px;height:22px;border-radius:50%;background:#7e63c9;color:#fff;font-size:.66rem;font-weight:900;display:grid;place-items:center;box-shadow:0 0 0 2px color-mix(in srgb,var(--ink) 6%,var(--panel))}
.v3av b+b{margin-left:-9px;background:#5d47a8}.v3av b:first-child{z-index:1}
.v3av i{position:absolute;right:-15px;top:-7px;font-style:normal;font-size:.58rem;font-weight:900;background:var(--panel);color:#7e63c9;border:1.5px solid #7e63c9;border-radius:99px;padding:0 .25rem;line-height:14px}
.v3tb{display:flex;gap:.4rem;align-items:center;overflow-x:auto;scrollbar-width:none;margin:.65rem 0 0}.v3tb::-webkit-scrollbar{display:none}
.v3tb small{flex:none;font-size:.74rem;font-weight:800;color:var(--ink-2)}
.v3tb button{flex:none;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:99px;padding:.4rem .8rem;font:inherit;font-size:.78rem;font-weight:800;max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3day{display:grid;grid-template-columns:repeat(var(--n,2),1fr);gap:8px;margin-top:10px}
.v3day button{border:1px solid var(--line);background:var(--panel);border-radius:var(--v2-r-s,14px);padding:11px 10px;text-align:left;display:grid;gap:2px;font:inherit;color:var(--ink);min-width:0}
.v3day small{font-size:10.5px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-2)}
.v3day b{font-family:var(--v2-disp);font-size:19px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3day span{font-size:11.5px;color:var(--ink-2);font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v3day .off b{color:var(--acc)}
.v3sh{display:flex;align-items:baseline;gap:.5rem;margin:22px 0 10px}.v3sh b{font-family:var(--v2-disp);font-size:20px;font-weight:700;color:var(--ink)}
.v3sh button{margin-left:auto;border:0;background:none;color:var(--acc);font:inherit;font-size:.78rem;font-weight:800;padding:0}
.v3next{display:flex!important;gap:.75rem;align-items:center;width:100%!important;max-width:none!important;box-sizing:border-box;text-align:left;padding:.7rem;border:1px solid var(--line);border-radius:var(--v2-r);background:var(--panel);box-shadow:var(--v2-sh);font:inherit;color:var(--ink)}
.v3next .v3cv{width:46px;height:69px;border-radius:3px 6px 6px 3px;object-fit:cover;flex:none;font-size:.5rem}
.v3next span{flex:1;min-width:0}.v3next b{display:block;font-size:.92rem}.v3next small{font-size:.76rem;color:var(--ink-2);font-weight:700}
.v3empty{padding:1.2rem 1rem;border:1px dashed var(--line);border-radius:var(--v2-r);text-align:center;display:grid;gap:.35rem;justify-items:center}
.v3empty b{font-family:var(--v2-disp);font-size:1.15rem}.v3empty p{margin:0;font-size:.82rem;color:var(--ink-2)}
.v3empty button{margin-top:.4rem;border:0;border-radius:14px;background:linear-gradient(135deg,#e9a35c,#c46f2e);color:#fff;font:inherit;font-weight:900;padding:.7rem 1.2rem}
`; TR.append(st); }
function v3Year() { return String(new Date().getFullYear()); }
function v3Meta(col) { const m = col.querySelector('#ini-meta'), t = m ? m.textContent.replace(/\s+/g, ' ').replace(/Meta de \d{4}/, ' ') : ''; const x = t.match(/(\d+) de (\d+) livros/); return x ? { n: +x[1], goal: +x[2] } : null; }
function v3Buddy(e) { const bm = (SOC.buddyMap || {})[e.id] || (T().buddy || {})[e.id]; if (!bm) return null;
  if (Array.isArray(bm.people) && bm.people.length) { const tot = readingInfo(e).total || 0;
    const ppl = bm.people.map((p) => ({ n: String(p.displayName || p.handle || '?').trim(), pct: +p.pct || 0 })).sort((a, b) => b.pct - a.pct);
    return { on: true, ppl, pg: tot ? Math.round((ppl[0].pct / 100) * tot) : null }; }
  return { on: false, names: bm.names || '' }; }
function v3HeroHTML(col) {
  const R = reading(), off = (() => { try { return homePrefs().off; } catch { return []; } })(), H = TR.host || document.body;
  // abertura do dia (bloco r0) no lugar de data + saudação
  const head = typeof v8DiaHTML === 'function' ? (() => { try { return v8DiaHTML(); } catch { return ''; } })() : `<div class="hello"><small>${esc(v2hDate())}</small><b>${v2hGreet()}${v2hName() ? ', ' + esc(v2hName()) : ''}</b></div>`;
  if (!R) return head + `<div class="v3empty"><b>Escolha sua próxima leitura</b><p>Nenhum livro em leitura agora.</p><button type="button" data-h3="pick">${lib().some((x) => x.status === 'QUERO') ? 'Qual leio agora?' : 'Buscar um livro'}</button></div>`;
  const { e, now, total } = R, pct = total ? Math.min(100, Math.round((now / total) * 100)) : 0, p = pct / 100, a = p * 2 * Math.PI - Math.PI / 2;
  const left = total ? Math.max(0, total - now) : 0, near = total && pct >= 90;
  let eta = ''; try { const d = paceDays(R); if (d) eta = d === 1 ? 'No seu ritmo, termina amanhã' : `No seu ritmo, termina em ${d} dias`; } catch {}
  if (near) eta = left === 0 ? 'Chegou na última página' : left === 1 ? 'Falta só 1 página' : `Faltam só ${left} páginas`;
  const bud = v3Buddy(e);
  const jt = bud && bud.on ? `<span class="v3av">${bud.ppl.slice(0, 2).map((x) => `<b>${esc(x.n.charAt(0).toUpperCase())}</b>`).join('')}${bud.ppl.length > 2 ? `<i>+${bud.ppl.length - 2}</i>` : bud.ppl.length === 1 && bud.pg != null ? `<i>${bud.pg}</i>` : ''}</span>` : V2SVG('junto', 20);
  const jl = bud && bud.on ? `Lendo junto com ${bud.ppl.map((x) => x.n.split(' ')[0]).join(', ')}` + (bud.ppl.length === 1 && bud.pg != null ? `, na página ${bud.pg}` : '') : bud ? `Convite enviado${bud.names ? ' para ' + bud.names : ''}` : 'Convidar alguém para ler junto';
  const L = off.includes('tambem') ? [e] : [e, ...lib().filter((x) => x.status === 'LENDO' && x.id !== e.id).slice(0, 6)];
  const nx = L.length > 1 ? L[1] : null; S.v3L = L.map((x) => x.id);
  // prazo: fica no cartão do livro (caixa "Hoje, leia até a pág. N"); sem prazo, o "Definir prazo" fica no Mais (menu do livro)
  let due = null; if (e.dueAt && vFn('prazos')) { try { const d = dueToday(e), dd = new Date(e.dueAt + 'T12:00:00Z'), dow = V2H_DOW[dd.getUTCDay()].slice(0, 3).toLowerCase(); due = d ? { ok: d.done, off: d.todayOff, target: d.target, falta: Math.max(0, d.target - d.now), dow } : { late: true, dow }; } catch {} }
  const CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  const dueBox = due ? `<button type="button" class="eta due${due.ok ? ' ok' : ''}" data-h3="prazo"><span class="dt">${due.late ? 'O prazo passou' : due.ok ? 'Leitura de hoje feita' : due.off ? 'Hoje é folga' : `Hoje, leia até a <b>pág. ${due.target}</b>`}</span><small>${CAL}${due.late ? 'escolha uma data nova' : due.ok || due.off ? 'prazo ' + due.dow : 'faltam ' + due.falta + ' pág. · prazo ' + due.dow}</small></button>` : '';
  // arco pontilhado: da página atual até a meta de hoje
  let goalArc = ''; if (due && !due.ok && !due.off && !due.late && total && due.target > now) { const q1 = now / total, q2 = Math.min(1, due.target / total); goalArc = `<circle cx="88" cy="88" r="72" fill="none" stroke="#c46f2e" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="0.1 7" stroke-dashoffset="${(-q1 * 452.4).toFixed(1)}" pathLength="452.4" transform="rotate(-90 88 88)" opacity=".9" style="stroke-dasharray:0.1 7;clip-path:none" data-q2="${q2}"/>`; goalArc = `<path d="${(() => { const P = (q) => { const a = q * 2 * Math.PI - Math.PI / 2; return [(88 + 72 * Math.cos(a)).toFixed(2), (88 + 72 * Math.sin(a)).toFixed(2)]; }; const [x1, y1] = P(q1), [x2, y2] = P(q2); return 'M' + x1 + ' ' + y1 + ' A72 72 0 ' + (q2 - q1 > 0.5 ? 1 : 0) + ' 1 ' + x2 + ' ' + y2; })()}" fill="none" stroke="#c46f2e" stroke-width="3.5" stroke-linecap="round" stroke-dasharray="0.1 7" opacity=".9"/>`; }
  // linha do dia: Prazo · Órbita · Meta (some o que estiver desligado em Funções do app / Personalizar Início)
  const tiles = [];
  if (false) {
    let pz = { b: '+ Prazo', s: 'quando terminar', off: false };
    if (e.dueAt) { try { const d = dueToday(e), dd = new Date(e.dueAt + 'T12:00:00Z'); pz = d ? { b: d.todayOff ? 'Folga' : d.per + ' pág.', s: 'hoje · até ' + V2H_DOW[dd.getUTCDay()].slice(0, 3), off: false } : { b: 'Encerrado', s: 'prazo passou', off: true }; } catch {} }
    tiles.push(`<button type="button" data-h3="prazo"><small>Prazo</small><b>${esc(pz.b)}</b><span>${esc(pz.s)}</span></button>`);
  }
  if (!H.classList.contains('v2off-orbita')) { let s = { cur: 0, best: 0, today: false }; try { s = orbStats(); } catch {}
    tiles.push(`<button type="button" data-h3="orb" class="${s.today ? '' : 'off'}"><small>Órbita</small><b>${s.cur} ${s.cur === 1 ? 'dia' : 'dias'}</b><span>${s.today ? 'hoje já conta' : s.cur ? 'leia hoje' : 'leia 1 página'}</span></button>`); }
  if (!H.classList.contains('v2off-metas') && !off.includes('meta')) { const m = v3Meta(col);
    tiles.push(`<button type="button" data-h3="meta"><small>Meta ${v3Year()}</small><b>${m ? m.n + '/' + m.goal : 'Definir'}</b><span>${m ? (m.n >= m.goal ? 'meta batida' : 'faltam ' + (m.goal - m.n)) : 'livros no ano'}</span></button>`); }
  return head + `<div class="v3herow${L.length > 1 ? ' multi' : ''}"><section class="v3hero">
    <button type="button" class="v3ring" data-h3="book" aria-label="Abrir a página de ${esc(e.title)}. Segure para o menu do livro"><svg viewBox="0 0 176 176" aria-hidden="true"><circle cx="88" cy="88" r="72" fill="none" stroke="var(--line)" stroke-width="6"/><circle cx="88" cy="88" r="72" fill="none" stroke="#c46f2e" stroke-width="6" stroke-linecap="round" stroke-dasharray="${(p * 452.4).toFixed(1)} 453" transform="rotate(-90 88 88)"/>${goalArc}</svg>${cvh(e.title, e.cover, 'v3cv')}<span class="moon" style="left:${((88 + 72 * Math.cos(a)) / 1.76).toFixed(2)}%;top:${((88 + 72 * Math.sin(a)) / 1.76).toFixed(2)}%"></span></button>
    <div class="inf">${total ? `<b class="pct">${pct}%</b><span class="pg">pág. ${now} de ${total}</span>` : `<b class="pct" style="font-size:1.3rem">pág. ${now}</b><span class="pg">total de páginas a definir</span>`}${dueBox || (eta ? `<span class="eta">${esc(eta)}</span>` : '')}</div>
    <div class="acts">
      <button type="button" class="v3qa p" data-h3="upd" aria-label="Atualizar página">${V2SVG('pag', 20)}Atualizar</button>
      <button type="button" class="v3qa${near ? ' hi' : ''}" data-h3="fim" aria-label="Terminei o livro">${V2SVG('ok', 20)}Terminei</button>
      ${v2Mods().trechos ? `<button type="button" class="v3qa" data-h3="qt" aria-label="Salvar um trecho">${V2SVG('qt', 20)}Trecho</button>` : ''}
      ${vFn('junto') ? `<button type="button" class="v3qa" data-h3="junto" aria-label="${esc(jl)}">${jt}Ler junto</button>` : ''}
      <button type="button" class="v3qa" data-h3="more" aria-label="Mais opções do livro">${V2SVG('dots', 20)}Mais</button>
    </div></section></div>
    ${nx ? `<div class="v3dots"><span class="pp">${L.map((x) => `<button type="button" data-h3="sw" data-id="${esc(x.id)}" class="${x.id === e.id ? 'on' : ''}" aria-label="${esc(x.title)}"></button>`).join('')}</span><button type="button" class="nx" data-h3="sw" data-id="${esc(nx.id)}" data-d="l">${esc(nx.title)}${(() => { try { if (!nx.dueAt) return ''; const d = dueToday(nx); return d && !d.done && !d.todayOff ? ` <small class="cdue">${CAL}até pág. ${d.target}</small>` : ''; } catch { return ''; } })()} ${CHEV}</button></div>` : ''}
    ${tiles.length ? `<div class="v3day" style="--n:${tiles.length}">${tiles.join('')}</div>` : ''}`;
}
function v3NextHTML() {
  const off = (() => { try { return homePrefs().off; } catch { return []; } })(); if (off.includes('fila')) return '';
  const fila = lib().filter((x) => x.status === 'QUERO'); if (!fila.length) return '';
  let nx = null; try { nx = nextBook(); } catch {} if (!nx || nx.status !== 'QUERO') nx = [...fila].sort((a, b) => (a.prio || 2) - (b.prio || 2))[0];
  const why = T().nextId === nx.id ? 'marcado como próxima' : nx.prio === 1 ? 'prioridade alta' : fila.length + (fila.length === 1 ? ' livro na fila' : ' livros na fila');
  return `<div class="v3sh"><b>A seguir</b>${fila.length > 1 ? '<button type="button" data-h3="qual">Qual leio agora?</button>' : ''}</div>
    <button type="button" class="v3next" data-h3="nx" data-id="${esc(nx.id)}">${cvh(nx.title, nx.cover, 'v3cv')}<span><b>${esc(nx.title)}</b><small>${esc([nx.author, why].filter(Boolean).join(' · '))}</small></span><em style="font-style:normal;font-size:1.3rem;color:var(--ink-2)">›</em></button>`;
}
function v3Bind(n) {
  let lp = 0, fired = false;
  // deslizar o cartão troca de livro (como no protótipo); os pontinhos mostram quantos são
  { let x0 = null, y0 = 0; n.addEventListener('pointerdown', (ev) => { if (ev.target.closest('.v3hero')) { x0 = ev.clientX; y0 = ev.clientY; } });
    n.addEventListener('pointerup', (ev) => { if (x0 == null) return; const dx = ev.clientX - x0, dy = ev.clientY - y0; x0 = null; const L = S.v3L || []; if (L.length < 2 || Math.abs(dx) < 50 || Math.abs(dy) > 60) return;
      const R = reading(); const i = Math.max(0, L.indexOf(R && R.e.id)), j = (i + (dx < 0 ? 1 : -1) + L.length) % L.length; clearTimeout(lp); fired = true; S.v3slide = dx < 0 ? 'sl-l' : 'sl-r'; setCurrent(L[j]); try { renderHome(todayISO()); } catch {} }); }
  n.addEventListener('pointerdown', (ev) => { const r = ev.target.closest('[data-h3=book]'); if (!r) return; fired = false; lp = setTimeout(() => { fired = true; const R = reading(); if (R) { try { navigator.vibrate && navigator.vibrate(12); } catch {} bookMenuOpen(r, { e: R.e, title: R.e.title }); } }, 480); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => n.addEventListener(t, () => clearTimeout(lp)));
  n.addEventListener('contextmenu', (ev) => { if (ev.target.closest('[data-h3=book]')) ev.preventDefault(); });
  n.addEventListener('click', (ev) => { const b = ev.target.closest('[data-h3]'); if (!b) return; ev.stopPropagation(); if (fired) { fired = false; return; }
    const k = b.dataset.h3, R = reading(), e = R && R.e;
    if (k === 'pick') { if (lib().some((x) => x.status === 'QUERO')) return v2QualLeio(); return typeof openCatalog === 'function' ? openCatalog() : goTab('estante'); }
    if (k === 'qual') return v2QualLeio();
    if (k === 'nx') { const x = lib().find((y) => y.id === b.dataset.id); return x && openBookPage(x); }
    if (k === 'sw') { S.v3slide = b.dataset.d === 'r' ? 'sl-r' : 'sl-l'; setCurrent(b.dataset.id); try { renderHome(todayISO()); } catch {} return; }
    if (k === 'orb') return openOrbita();
    if (k === 'meta') { const m = TR.querySelector('.v3-colA #ini-meta'); if (m) return m.click(); return openGoalPage(+v3Year()); }
    if (!e) return;
    if (k === 'book') return openBookPage(e);
    if (k === 'upd') { if (S.madrugada) return wakeBear('upd'); return editLeitura(); }
    if (k === 'fim') return statusSheet(e, 'LIDO');
    if (k === 'qt') return saveQuote(e);
    if (k === 'more') return bookMenuOpen(b, { e, title: e.title });
    if (k === 'prazo') return dueSheet(e);
    if (k === 'junto') { const bud = v3Buddy(e); if (bud && bud.on) return openBuddyPage(e); if (bud) return toast('Convite enviado. A leitura conjunta começa quando aceitarem.'); return inviteBuddy(e); }
  });
}
{ let tm = 0, busy = false;
  const put = () => { if (busy || S.tab !== 'inicio') return; const col = TR.querySelector('#lista .v3-colA'); if (!col || !col.querySelector(':scope > .v3-now')) return; busy = true;
    try {
      col.classList.add('v3h');
      const R = reading(), keyA = v3HeroHTML(col), keyB = v3NextHTML();
      const slot = (cls, html) => { const key = html.replace(/ data-cvk="c\d+"/g, ''); let n = col.querySelector(':scope > .' + cls); if (n && n.dataset.k === key) return; const w = document.createElement('div'); w.className = 'v3x ' + cls; w.innerHTML = html; w.dataset.k = key; v3Bind(w); if (n) n.replaceWith(w); else col.prepend(w); try { paintCv(w); } catch {} };
      slot('v3x-a', keyA); slot('v3x-b', keyB);
      if (S.v3slide) { const h = col.querySelector(':scope > .v3x-a .v3hero'); if (h) h.classList.add(S.v3slide); S.v3slide = null; }
      // destaque do dia: um cartão só
      const cands = [col.querySelector(':scope > .ex-alert'), col.querySelector(':scope > .v2rs-card'), (vFn('qday') ? col.querySelector(':scope > [data-v2qd]') : null)].filter(Boolean);
      const pick = cands[0] || null; col.querySelectorAll(':scope > .v3mom').forEach((x) => { if (x !== pick) x.classList.remove('v3mom'); }); if (pick && !pick.classList.contains('v3mom')) pick.classList.add('v3mom');
      // sem livro em leitura: "Comece por aqui" (conta nova) aparece logo abaixo
      const cm = col.querySelector(':scope > [data-in=comece]'); if (cm) cm.classList.toggle('v3show', !R);
    } finally { busy = false; } };
  new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; put(); }, 60); }).observe(TR, { childList: true, subtree: true }); setTimeout(put, 900); }
