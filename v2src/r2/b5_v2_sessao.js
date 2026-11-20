// v2 fase 1 (Bia, 18/11): Ler = sessão de leitura. Céu escuro com o livro, anel de progresso e cronômetro; "Virei a página",
// −/+10; Trecho e Anotação abrem o diário do próprio livro; "Só marcar a página" abre o Atualizar de sempre.
// Encerrar mostra o resumo (minutos, páginas, ritmo, como foi) e Salvar registra pelo mesmo caminho do foco/Atualizar
// (quickLog para livro de meta, libLog para os demais), então histórico, prazo, metas e sincronização seguem iguais.
// A sessão fica guardada no aparelho (bear.ses) e continua se o app fechar. Ecos ficam para quando houver servidor.
{ const st = document.createElement('style'); st.textContent = `
.v2ses{position:fixed;inset:0;z-index:9500;background:radial-gradient(120% 70% at 50% 0,#3b2a6b,#17112c 60%,#0d0a1a);color:#fff;display:flex;flex-direction:column;overflow:hidden;font-family:inherit;padding-bottom:env(safe-area-inset-bottom,0px)}
.v2ses .sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;opacity:.55;animation:v2tw 3s ease-in-out infinite}@keyframes v2tw{50%{opacity:.12}}
.v2ses .top{display:flex;justify-content:space-between;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 1rem) 1rem 0;position:relative;z-index:2}
.v2ses .top button{border:0;background:rgba(255,255,255,.13);color:#fff;border-radius:99px;padding:.5rem .85rem;font:inherit;font-size:.8rem;font-weight:900}
.v2ses .mid{flex:1;display:grid;align-content:center;justify-items:center;gap:.25rem;text-align:center;padding:0 1.2rem;position:relative;z-index:2}
.v2ses .orb{position:relative;width:190px;height:190px}.v2ses .orb svg{position:absolute;inset:0}
.v2ses .orb .cv{position:absolute;left:61px;top:38px;width:68px;height:104px;border-radius:5px;object-fit:cover;box-shadow:0 0 30px rgba(196,111,46,.5);background:#c46f2e;display:grid;place-items:center;font-weight:900;font-size:1.6rem;color:#fff}
.v2ses .orb .moon{position:absolute;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#e0ad3a;border:3px solid #17112c;box-shadow:0 0 12px #e0ad3a}
.v2ses .bt{font-size:.82rem;color:#cfc4ff;font-weight:800;max-width:280px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v2ses .tm{font-family:Georgia,'Times New Roman',serif;font-size:2.8rem;font-variant-numeric:tabular-nums;font-weight:700;margin-top:.1rem}
.v2ses .flip{margin:.8rem auto 0;border:0;border-radius:22px;background:linear-gradient(135deg,#ffd6a3,#c46f2e);color:#2a1505;font:inherit;font-size:1rem;font-weight:900;padding:1rem 1.6rem;box-shadow:0 10px 26px rgba(196,111,46,.4);display:inline-flex;gap:.5rem;align-items:center}
.v2ses .flip:active{transform:scale(.97)}.v2ses .flip svg{width:20px;height:20px}
.v2ses .pgl{font-size:.82rem;font-weight:800;color:#ddd5ff;margin-top:.6rem;display:flex;align-items:center;gap:.4rem}
.v2ses .pgl button{border:0;background:rgba(255,255,255,.13);color:#fff;border-radius:99px;min-width:30px;height:30px;font:inherit;font-weight:900;padding:0 .5rem}
.v2ses .calm{margin:.9rem 0 0;max-width:260px;font-size:.84rem;line-height:1.4;color:#ddd5ff;font-weight:700}.v2ses .calm b{color:#fff}
.v2sum .stop{display:grid;grid-template-columns:1fr auto;gap:.5rem;align-items:center}
.v2sum .stop input{width:100%;height:56px;border:2px solid var(--acc);border-radius:16px;background:var(--bg);color:var(--ink);font:inherit;font-size:1.6rem;font-weight:900;text-align:center;font-variant-numeric:tabular-nums}
.v2sum .mode{display:flex;border:1.5px solid var(--line);border-radius:12px;overflow:hidden}.v2sum .mode button{border:0;background:var(--panel);color:var(--ink-2);font:inherit;font-weight:900;font-size:.8rem;padding:.55rem .7rem}.v2sum .mode button.on{background:var(--acc);color:var(--on-acc,#fff)}
.v2sum .hint{font-size:.74rem;color:var(--ink-2);font-weight:700;margin:.35rem 0 0}
.v2sum .cap{width:100%;margin-top:.5rem;height:42px;border:1.5px solid var(--line);border-radius:12px;background:var(--bg);color:var(--ink);font:inherit;font-size:.88rem;padding:0 .8rem}
.v2ses .just{margin-top:.35rem;border:0;background:none;color:#cfc4ff;font:inherit;font-size:.76rem;font-weight:800;text-decoration:underline}
.v2ses .tools{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;padding:0 1rem 1.1rem;position:relative;z-index:2}
.v2ses .tools button{border:0;border-radius:16px;background:rgba(255,255,255,.1);color:#fff;padding:.75rem 0;font:inherit;font-size:.76rem;font-weight:800;display:grid;justify-items:center;gap:.25rem}
.v2ses .tools svg{width:20px;height:20px}
.v2sum{position:fixed;inset:0;z-index:9600;background:rgba(10,6,20,.55);display:flex;align-items:flex-end}
.v2sum .bx{width:100%;max-width:520px;margin:0 auto;background:var(--panel,#fffaf3);color:var(--ink);border-radius:22px 22px 0 0;padding:1.1rem 1rem calc(1rem + env(safe-area-inset-bottom,0px));font-family:inherit}
.v2sum h3{margin:0;font-size:1.2rem}.v2sum .s{margin:.1rem 0 .7rem;font-size:.8rem;color:var(--ink-2)}
.v2sum .nums{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}.v2sum .nums div{background:var(--bg);border-radius:14px;padding:.55rem 0;text-align:center}
.v2sum .nums b{display:block;font-size:1.25rem}.v2sum .nums small{font-size:.66rem;color:var(--ink-2);font-weight:800}
.v2sum .lb{font-size:.68rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-2);margin:.8rem 0 .4rem}
.v2sum .ch{display:flex;flex-wrap:wrap;gap:.35rem}.v2sum .ch button{border:1.5px solid var(--line);background:var(--bg);border-radius:99px;padding:.4rem .7rem;font:inherit;font-size:.78rem;font-weight:800;color:var(--ink)}
.v2sum .ch button.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 14%,var(--panel));color:var(--acc)}
.v2sum .ac{display:grid;grid-template-columns:1fr 1.4fr;gap:.5rem;margin-top:1rem}
.v2sum .ac button{height:46px;border-radius:14px;font:inherit;font-weight:900;font-size:.9rem;border:1.5px solid var(--line);background:var(--panel);color:var(--ink)}
.v2sum .ac .p{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
`; TR.append(st); }
const V2SES_K = 'bear.ses';
const v2SesGet = () => { try { return JSON.parse(localStorage.getItem(V2SES_K) || 'null'); } catch { return null; } };
const v2SesPut = (s) => { try { s ? localStorage.setItem(V2SES_K, JSON.stringify(s)) : localStorage.removeItem(V2SES_K); } catch {} };
const V2T = { flip: '<path d="M12 6.6C9.8 5 6.8 4.5 3 5v13.2c3.8-.5 6.8 0 9 1.6 2.2-1.6 5.2-2.1 9-1.6V5c-3.8-.5-6.8 0-9 1.6zM12 6.6v13.2"/>',
  qt: '<path d="M7 7h4v4c0 3-2 5-4 6M14 7h4v4c0 3-2 5-4 6"/>', nt: '<path d="M6 3h9l4 4v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 12.5h7M8.5 16h4.5"/>' };
const v2Svg = (k) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${V2T[k]}</svg>`;
let v2Tick = 0;
// botão Ler: escolhe o livro (o que está lendo; se forem vários, pergunta; se nenhum, oferece a fila)
function v2Ler() {
  const s = v2SesGet(); if (s) { const e = lib().find((x) => x.id === s.libId); if (e) return v2SesOpen(e, s); v2SesPut(null); }
  const lendo = lib().filter((e) => e.status === 'LENDO');
  if (lendo.length === 1) return v2SesStart(lendo[0]);
  if (lendo.length > 1) return sheetList('Ler qual livro agora?', lendo.map((e) => { const i = readingInfo(e); return { label: esc(e.title), sub: i.total ? `pág. ${i.now} de ${i.total}` : '', fn: () => v2SesStart(e) }; }));
  const fila = lib().filter((e) => e.status === 'QUERO').slice(0, 8);
  if (!fila.length) return toast('Adicione um livro na Estante para começar a ler');
  sheetList('Você não está lendo nenhum livro. Qual começa agora?', fila.map((e) => ({ label: esc(e.title), sub: e.author ? esc(e.author) : '', fn: () => { setLibStatus(e, 'LENDO'); if (e.status === 'LENDO') v2SesStart(e); } })));
}
function v2SesStart(e) {
  if (!readingInfo(e).total) return askPages(e, (n) => { e.totalPages = n; save(); v2SesStart(e); });
  const now = readingInfo(e).now, s = { libId: e.id, start: Date.now(), pg0: now, pg: now };
  v2SesPut(s); v2SesOpen(e, s);
}
const v2Clock = (s) => { const t = Math.max(0, Math.floor((Date.now() - s.start) / 1000)), h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), x = t % 60, p = (n) => String(n).padStart(2, '0'); return (h ? h + ':' + p(m) : p(m)) + ':' + p(x); };
function v2SesOpen(e, s) {
  $('.v2ses')?.remove(); clearInterval(v2Tick);
  const w = document.createElement('div'); w.className = 'v2ses'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Sessão de leitura');
  const stars = Array.from({ length: 40 }, () => `<i style="left:${(Math.random() * 100).toFixed(1)}%;top:${(Math.random() * 100).toFixed(1)}%;animation-delay:${(Math.random() * 3).toFixed(1)}s"></i>`).join('');
  const draw = () => {
    const { total } = readingInfo(e), p = total ? Math.min(1, s.pg / total) : 0, a = p * 2 * Math.PI - Math.PI / 2, mx = 95 + 84 * Math.cos(a), my = 95 + 84 * Math.sin(a);
    w.innerHTML = `<div class="sky">${stars}</div>
      <div class="top"><button type="button" data-a="end">✕ Encerrar</button><button type="button" data-a="min">Minimizar</button></div>
      <div class="mid"><div class="orb"><svg viewBox="0 0 190 190"><circle cx="95" cy="95" r="84" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="5"/><circle cx="95" cy="95" r="84" fill="none" stroke="#e0ad3a" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(p * 527.8).toFixed(1)} 528" transform="rotate(-90 95 95)"/></svg>
        ${e.cover ? `<img class="cv" src="${esc(e.cover)}" alt="">` : `<span class="cv">${esc(String(e.title || '?').charAt(0))}</span>`}<span class="moon" style="left:${mx.toFixed(1)}px;top:${my.toFixed(1)}px"></span></div>
        <div class="bt">${esc(e.title)}</div><div class="tm" id="v2tm">${v2Clock(s)}</div>
        <div class="pgl"><span>começou na pág. <b>${s.pg0}</b> de ${total}</span></div>
        <p class="calm">Leia em paz. Quando parar, toque em <b>Encerrar</b> e diga em que página ficou.</p>
        <button type="button" class="just" data-a="just">Só marcar a página, sem cronômetro</button></div>
      <div class="tools"><button type="button" data-a="qt">${v2Svg('qt')}Trecho</button><button type="button" data-a="nt">${v2Svg('nt')}Anotação</button></div>`;
  };
  const diary = (pane) => { w.hidden = true; ssOpenUpdate(e); const ed = $('#editor');
    setTimeout(() => { const b = ed && ed.querySelector(`.lz-acts [data-p=${pane}]`); if (b) b.click(); }, 120);
    const ob = new MutationObserver(() => { if (ed.hidden) { ob.disconnect(); if (w.isConnected) { w.hidden = false; } } });
    if (ed) ob.observe(ed, { attributes: true, attributeFilter: ['hidden'] }); };
  w.addEventListener('click', (ev) => { const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'min') { clearInterval(v2Tick); w.remove(); toast('A sessão continua contando. Toque em Ler para voltar.'); }
    else if (a === 'just') { clearInterval(v2Tick); w.remove(); v2SesPut(null); ssOpenUpdate(e); }
    else if (a === 'qt') diary('trecho');
    else if (a === 'nt') diary('nota');
    else if (a === 'end') v2SesEnd(e, s, w);
  });
  TR.append(w); draw();
  v2Tick = setInterval(() => { const t = w.querySelector('#v2tm'); if (!w.isConnected) return clearInterval(v2Tick); if (t) t.textContent = v2Clock(s); }, 1000);
}
const V2FEEL = ['😱 Chocante', '🥹 Emocionante', '😍 Apaixonante', '😴 Arrastado', '🤯 Reviravolta', '😌 Tranquilo'];
// Encerrar: pergunta onde parou (página exata, ou % no e-book), já com a estimativa pelo ritmo da pessoa; capítulo é opcional
function v2Pace() { const f = (db.focus || []).filter((x) => x.minutes > 0 && x.pages > 0).slice(-20); const m = f.reduce((a, x) => a + x.minutes, 0), p = f.reduce((a, x) => a + x.pages, 0); return m >= 10 ? p / m : 0.6; }
function v2SesEnd(e, s, w) {
  const secs = Math.floor((Date.now() - s.start) / 1000), min = Math.max(1, Math.round(secs / 60)), { total } = readingInfo(e);
  const est = Math.min(total || Infinity, s.pg0 + Math.round((secs / 60) * v2Pace()));
  const feel = new Set(); let mode = 'pg', exact = est;
  const o = document.createElement('div'); o.className = 'v2sum';
  o.innerHTML = `<div class="bx" role="dialog" aria-label="Resumo da sessão"><h3>Boa sessão!</h3><p class="s">${esc(e.title)} · começou na pág. ${s.pg0}</p>
    <div class="lb" id="v2stoplb">Em que página você parou?</div>
    <div class="stop"><input id="v2stop" type="number" inputmode="numeric" min="0" max="${total || ''}" value="${est}" aria-labelledby="v2stoplb"><div class="mode"><button type="button" class="on" data-m="pg">pág.</button><button type="button" data-m="pc">%</button></div></div>
    <p class="hint" id="v2hint">${est > s.pg0 ? 'Estimativa pelo seu ritmo. Corrija se for outra.' : 'Digite a página em que parou.'}</p>
    <input class="cap" id="v2cap" type="text" maxlength="40" placeholder="Capítulo (opcional)" value="${esc(s.cap || '')}">
    <div class="nums" style="margin-top:.8rem"><div><b>${secs < 60 ? '<1' : min}</b><small>minutos</small></div><div><b id="v2np">0</b><small>páginas</small></div><div><b id="v2nr">—</b><small>pág. por hora</small></div></div>
    <div class="lb">Como foi?</div><div class="ch">${V2FEEL.map((f, i) => `<button type="button" data-f="${i}">${f}</button>`).join('')}</div>
    <div class="ac"><button type="button" data-a="back">Continuar lendo</button><button type="button" class="p" data-a="save">Salvar</button></div>
    <button type="button" data-a="drop" style="display:block;margin:.7rem auto 0;border:0;background:none;color:var(--ink-2);font:inherit;font-size:.78rem;font-weight:800;text-decoration:underline">Descartar sessão</button></div>`;
  const inp = o.querySelector('#v2stop');
  const page = () => { const v = Number(inp.value); if (!isFinite(v) || inp.value === '') return s.pg0; const p = mode === 'pc' && total ? Math.round(total * Math.min(100, v) / 100) : Math.round(v); return Math.max(0, total ? Math.min(total, p) : p); };
  const upd = () => { const pg = page(), n = Math.max(0, pg - s.pg0), r = secs >= 60 && n ? Math.round(n / (secs / 3600)) : 0;
    o.querySelector('#v2np').textContent = n; o.querySelector('#v2nr').textContent = r || '—';
    if (mode === 'pc') o.querySelector('#v2hint').textContent = total ? `Isso dá a pág. ${pg} de ${total}.` : 'Informe o total de páginas do livro para usar %.'; };
  inp.addEventListener('input', () => { if (mode === 'pg') { exact = page(); o.querySelector('#v2hint').textContent = total ? `de ${total} páginas` : ''; } upd(); }); inp.addEventListener('focus', () => inp.select());
  o.addEventListener('click', (ev) => { if (ev.target === o) { o.remove(); return; }
    const m = ev.target.closest('[data-m]');
    if (m) { const pg = page(); mode = m.dataset.m; o.querySelectorAll('[data-m]').forEach((x) => x.classList.toggle('on', x === m));
      inp.max = mode === 'pc' ? 100 : (total || ''); inp.value = mode === 'pc' && total ? Math.round(pg / total * 100) : (Math.abs(exact - pg) <= Math.ceil((total || 100) / 100) ? exact : pg);
      o.querySelector('#v2stoplb').textContent = mode === 'pc' ? 'Em que porcentagem você parou?' : 'Em que página você parou?';
      if (mode === 'pg') o.querySelector('#v2hint').textContent = 'Digite a página em que parou.'; upd(); inp.focus(); return; }
    const f = ev.target.closest('[data-f]');
    if (f) { const k = V2FEEL[Number(f.dataset.f)]; feel.has(k) ? feel.delete(k) : feel.add(k); f.classList.toggle('on', feel.has(k)); return; }
    const b = ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'back') { s.cap = o.querySelector('#v2cap').value.trim(); v2SesPut(s); o.remove(); return; }
    if (a === 'drop') { if (!confirm('Descartar esta sessão? Nada será registrado.')) return; o.remove(); clearInterval(v2Tick); w.remove(); v2SesPut(null); toast('Sessão descartada'); return; }
    if (a === 'save') {
      const pg = page(), cap = o.querySelector('#v2cap').value.trim();
      if (pg < s.pg0 && !confirm(`A página ${pg} é antes de onde você começou (${s.pg0}). Salvar mesmo assim?`)) return;
      o.remove(); clearInterval(v2Tick); w.remove(); v2SesPut(null);
      const { g, gb, now } = readingInfo(e);
      if (secs >= 60) { db.focus = [...(db.focus || []), { id: uid(), date: todayISO(), start: new Date(s.start).toISOString(), minutes: min, libId: e.id, fromPage: now, pages: Math.max(0, pg - now), via: 'ler', ...(cap ? { chapter: cap } : {}), ...(feel.size ? { feel: [...feel] } : {}) }]; save(); }
      if (pg !== now) { if (gb) quickLog(g, gb, String(pg)); else libLog(e, String(pg), false); }
      else { renderHome(todayISO()); toast(secs >= 60 ? `${min} min de leitura registrados` : 'Sessão salva'); }
    }
  });
  TR.append(o); upd(); setTimeout(() => { try { inp.focus(); inp.select(); } catch {} }, 150);
}
