// ---------- v2: dia da leitura no Atualizar + "Mudar datas" sem sair da tela (Bia, 27/11) ----------
// "Ontem li umas 30 páginas mas esqueci de anotar; vai salvar como se fosse hoje." / "Mudar datas vai para Minha leitura."
// 1) Seletor "Hoje ▾" (Hoje · Ontem · Outra data) na folha rápida e na página cheia do Atualizar. "Outra data" abre o
//    calendário do aparelho, limitado entre o começo da leitura e hoje. Com outro dia escolhido, "estava na pág. X"
//    mostra a página daquele dia.
// 2) Ao salvar com dia passado (só livros da Biblioteca; e.readLog guarda {date, pages=diferença}):
//    - a página precisa ficar entre a do fim daquele dia e a da leitura seguinte já registrada; senão, aviso na tela e
//      nada é salvo;
//    - sem leitura depois desse dia: salva pelo fluxo normal e o registro, o início/fim e o cartão da Comunidade ficam
//      com aquele dia (o cartão não sobe como "agora");
//    - com leitura depois: entra no meio do histórico e a leitura seguinte é ajustada; a página atual não muda e não vai
//      cartão novo para a Comunidade (lá já há um mais novo).
// 3) "Mudar datas" abre uma folha por cima (início e, se terminou, fim); salvar fecha e volta à mesma tela, com o que
//    já estava digitado.
const LVD_CSS = `.v4ler .lvday{display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:0 10px;margin-left:4px;border:1px solid var(--line);border-radius:999px;background:var(--soft,transparent);color:var(--ink);font:inherit;font-weight:800;font-size:.84rem;cursor:pointer}
.v4ler .lvday.past{border-color:var(--acc);color:var(--acc)}
.v4ler .lvday-row{display:flex;align-items:center;gap:6px;margin:6px 0 2px;flex-wrap:wrap}
.v4ler .lvmenu{position:absolute;z-index:60;min-width:180px;padding:6px;border:1px solid var(--line);border-radius:14px;background:var(--panel,#1a1524);box-shadow:0 14px 30px rgba(0,0,0,.35)}
.v4ler .lvmenu button{display:block;width:100%;min-height:44px;padding:0 12px;border:0;border-radius:10px;background:none;color:var(--ink);font:inherit;font-weight:700;text-align:left;cursor:pointer}
.v4ler .lvmenu button[disabled]{opacity:.4;cursor:default}.v4ler .lvmenu button.on{color:var(--acc)}
.v4ler .lverr{margin:8px 0 0;padding:10px 12px;border-radius:12px;background:color-mix(in srgb,#d9534f 16%,transparent);color:var(--ink);font-size:.86rem;font-weight:700}
.v4ler .lvdt-ov{position:fixed;inset:0;z-index:80;display:flex;align-items:flex-end;background:rgba(0,0,0,.45)}
.v4ler .lvdt{width:100%;max-width:560px;margin:0 auto;padding:18px 18px max(18px,env(safe-area-inset-bottom,0px));border-radius:22px 22px 0 0;background:var(--panel,#1a1524);color:var(--ink)}
.v4ler .lvdt h3{margin:0 0 12px}.v4ler .lvdt label{display:grid;gap:6px;margin:0 0 12px;font-weight:800;font-size:.86rem;color:var(--ink-2)}
.v4ler .lvdt input{min-height:46px;padding:0 12px;border:1px solid var(--line);border-radius:12px;background:var(--bg,transparent);color:var(--ink);font:inherit;font-size:1rem}
.v4ler .lvdt .row{display:flex;gap:8px;margin-top:6px}.v4ler .lvdt .row button{flex:1;min-height:48px;border-radius:14px;font:inherit;font-weight:900;cursor:pointer}
.v4ler .lvdt .ok{border:0;background:var(--acc);color:var(--on-acc,#1b1426)}.v4ler .lvdt .no{border:1px solid var(--line);background:none;color:var(--ink)}`;
const lvdIso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const lvdYesterday = () => { const d = new Date(Date.parse(todayISO() + 'T12:00:00')); d.setDate(d.getDate() - 1); return lvdIso(d); };
const lvdBR = (iso) => iso ? iso.slice(8, 10) + '/' + iso.slice(5, 7) : '';
const lvdStart = (e) => { const d = String(e.startedAt || e.startDate || '').slice(0, 10); return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : ''; };
const lvdMin = (e) => lvdStart(e) || lvdIso(new Date(Date.now() - 365 * 864e5));
// página no fim do dia D (o que foi lido depois de D é descontado da página atual)
function lvdPageAt(e, D) { const now = Number(e.currentPage) || 0; return Math.max(0, now - (e.readLog || []).filter((x) => String(x.date) > D).reduce((a, x) => a + (Number(x.pages) || 0), 0)); }
function lvdBounds(e, D) { const lo = lvdPageAt(e, D); const nx = (e.readLog || []).filter((x) => String(x.date) > D).sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  return { lo, nx, hi: nx ? lo + (Number(nx.pages) || 0) : null }; }
let LVD_RETRO = null; // { libId, day, until } enquanto a leitura de dia passado é publicada
{ // cartão da Comunidade com o dia da leitura (não sobe como "agora")
  const _pa = publishActivity; publishActivity = async function (e, kind) {
    const R = LVD_RETRO; if (!(R && e && R.libId === e.id && Date.now() < R.until)) return _pa.apply(this, arguments);
    try { if (!connected()) return; const info = readingInfo(e) || {}; const at = Math.min(Date.now(), Date.parse(R.day + 'T12:00:00-03:00'));
      const b = { kind, libId: e.id, title: e.title, author: e.author || null, cover: smallCover(e.cover), pct: info.total ? Math.min(100, info.pct) : null, pages: info.now || null, at: new Date(at).toISOString() };
      const q = aqLoad().filter((x) => !(x.b.libId === b.libId && x.b.kind === b.kind && x.day === R.day)); q.push({ id: uid(), b, day: R.day, at: Date.now(), n: 0 }); aqSave(q); await aqFlush();
    } catch (err) { console.warn('atividade retroativa', err); } }; }
function lvdCss() { try { const root = V4 && V4.getRootNode(); if (root && root !== document && !root.querySelector('style.lvdcss')) { const s = document.createElement('style'); s.className = 'lvdcss'; s.textContent = LVD_CSS; root.append(s); } } catch {} }
// chip e "estava na pág." conforme o dia escolhido; só para livro da Biblioteca (não de meta antiga) e fora de sessão
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments);
    try { lvdCss(); const st = v4State(), U = st.upd, R = V4; if (!R || !U || st.sheet !== 'upd') return r;
      const e = lib().find((x) => x.id === (st.sheetE || st.e)); if (!e) return r; const inf = v4Info(e); if (inf.gb) return r;
      const sh = R.querySelector('.sheet'); if (!sh || sh.querySelector('.lvday')) return r;
      const D = U.day && U.day !== todayISO() ? U.day : null;
      const lab = !D ? 'Hoje' : D === lvdYesterday() ? 'Ontem' : lvdBR(D);
      const chip = `<button type="button" class="lvday${D ? ' past' : ''}" data-a="lvday" aria-haspopup="menu" aria-label="Dia da leitura: ${lab}">${lab} ▾</button>`;
      const meta = sh.querySelector('.upmeta .mut');
      // "Comecei em" pela data guardada (AAAA-MM-DD) no dia certo: a tela antiga lia como meia-noite UTC e mostrava o dia anterior
      if (meta) { const ini = lvdStart(e); meta.innerHTML = (ini ? 'Comecei em ' + lvdBR(ini) + ' · ' : '') + 'leitura de ' + chip; }
      else { const bk = sh.querySelector('.sh-bk'); if (bk) bk.insertAdjacentHTML('afterend', `<div class="lvday-row"><span class="mut">Leitura de</span>${chip}</div>`); }
      if (D) { const m = sh.querySelector('.sh-bk .mut'); if (m) m.textContent = m.textContent.replace(/estava na pág\. \d+/, 'em ' + lvdBR(D) + ' estava na pág. ' + lvdPageAt(e, D)); }
      if (U.lvErr) sh.querySelector('.lvday').closest('.upmeta, .lvday-row').insertAdjacentHTML('afterend', `<p class="lverr" role="alert">${esc(U.lvErr)}</p>`);
    } catch (err) { console.warn('dia da leitura', err); } return r; }; }
function lvdMenu(btn) { const st = v4State(), U = st.upd, e = lib().find((x) => x.id === (st.sheetE || st.e)); if (!U || !e) return;
  const R = V4; R.querySelectorAll('.lvmenu').forEach((m) => m.remove()); const min = lvdMin(e), t = todayISO(), y = lvdYesterday(), cur = U.day || t;
  const m = document.createElement('div'); m.className = 'lvmenu'; m.setAttribute('role', 'menu');
  m.innerHTML = `<button role="menuitemradio" aria-checked="${cur === t}" class="${cur === t ? 'on' : ''}" data-lvset="${t}">Hoje</button><button role="menuitemradio" aria-checked="${cur === y}" class="${cur === y ? 'on' : ''}" data-lvset="${y}"${y < min ? ' disabled' : ''}>Ontem</button><button role="menuitem" data-lvset="outra"${min >= y ? ' disabled' : ''}>Outra data…</button><input type="date" class="lvpick" min="${min}" max="${t}" value="${cur}" style="position:absolute;opacity:0;width:1px;height:1px;pointer-events:none" aria-hidden="true">`;
  const sh = btn.closest('.sheet') || R; sh.style.position = sh.style.position || ''; const b = btn.getBoundingClientRect(), s = sh.getBoundingClientRect();
  m.style.left = Math.max(8, b.left - s.left) + 'px'; m.style.top = (b.bottom - s.top + 6 + (sh.scrollTop || 0)) + 'px'; sh.append(m);
  const set = (v) => { m.remove(); if (!v || v < min || v > t) return; U.day = v === t ? null : v; U.lvErr = ''; v4Draw(); };
  m.addEventListener('click', (ev) => { const x = ev.target.closest('[data-lvset]'); if (!x || x.disabled) return; ev.stopPropagation();
    if (x.dataset.lvset !== 'outra') return set(x.dataset.lvset);
    const inp = m.querySelector('.lvpick'); inp.addEventListener('change', () => set(inp.value), { once: true }); try { inp.showPicker(); } catch { inp.style.cssText = 'display:block;margin:6px;min-height:44px'; inp.removeAttribute('aria-hidden'); inp.focus(); } });
  setTimeout(() => document.addEventListener('pointerdown', function off(ev) { if (!ev.composedPath().includes(m)) { m.remove(); document.removeEventListener('pointerdown', off, true); } }, true), 0); }
function lvdDatesSheet(e) { const R = V4; R.querySelectorAll('.lvdt-ov').forEach((x) => x.remove()); const t = todayISO(), ini = lvdStart(e), fim = String(e.finishedAt || '').slice(0, 10), done = e.status === 'LIDO';
  const first = (e.readLog || []).map((x) => String(x.date)).sort()[0] || t;
  const ov = document.createElement('div'); ov.className = 'lvdt-ov';
  ov.innerHTML = `<div class="lvdt" role="dialog" aria-modal="true" aria-label="Datas da leitura"><h3>Datas da leitura</h3>
    <label>Comecei em<input type="date" class="lvi" max="${first < t ? first : t}" value="${ini}"></label>
    ${done ? `<label>Terminei em<input type="date" class="lvf" max="${t}" value="${fim}"></label>` : ''}
    <p class="lverr" role="alert" hidden></p>
    <div class="row"><button type="button" class="no">Cancelar</button><button type="button" class="ok">Salvar datas</button></div></div>`;
  const shEl = R.querySelector('.sheet') || R; shEl.append(ov);
  const err = ov.querySelector('.lverr'), close = () => ov.remove();
  ov.addEventListener('click', (ev) => { if (ev.target === ov || ev.target.closest('.no')) { ev.stopPropagation(); close(); } });
  ov.querySelector('.ok').addEventListener('click', (ev) => { ev.stopPropagation(); const i = ov.querySelector('.lvi').value, f = done ? ov.querySelector('.lvf').value : '';
    const bad = !i ? 'Escolha a data de início.' : i > t ? 'O início não pode ser depois de hoje.' : i > first ? `Você tem leitura registrada em ${lvdBR(first)}: o início precisa ser até essa data.` : done && f && f < i ? 'O fim não pode ser antes do início.' : done && f > t ? 'O fim não pode ser depois de hoje.' : '';
    if (bad) { err.textContent = bad; err.hidden = false; return; }
    e.startedAt = i; if ('startedTs' in e) delete e.startedTs; if (done && f) e.finishedAt = f; save(); close();
    try { renderHome(todayISO()); } catch {} toast('Datas da leitura salvas'); v4Draw(); }); }
// toques: seletor de dia e "Mudar datas" (antes do tratamento antigo, que abria Livro › Minha leitura)
{ let wired = null; const wire = () => { if (!V4 || wired === V4) return; wired = V4;
    V4.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a, st = v4State();
      if (a === 'lvday') { ev.stopImmediatePropagation(); ev.preventDefault(); return lvdMenu(b); }
      if (a === 'v6datas') { ev.stopImmediatePropagation(); ev.preventDefault(); const e = lib().find((x) => x.id === (st.sheetE || st.e)); if (e) lvdDatesSheet(e); }
    }, true); };
  setInterval(wire, 1000); setTimeout(wire, 300); }
// salvar com dia passado
{ const _s = v4UpdSave; v4UpdSave = async function (k) {
    const st = v4State(), U = st.upd, e = U && lib().find((x) => x.id === (st.sheetE || st.e)); const D = U && U.day && U.day !== todayISO() ? U.day : null;
    if (!D || !e || k === 'end') return _s.apply(this, arguments);
    const inf = v4Info(e); if (inf.gb) return _s.apply(this, arguments);
    const t = todayISO(), min = lvdMin(e); const fail = (msg) => { U.lvErr = msg; v4Draw(); };
    if (D > t || D < min) return fail('Escolha um dia entre o começo da leitura e hoje.');
    const pg = Number(U.pg); if (!Number.isFinite(pg)) return _s.apply(this, arguments);
    const { lo, nx, hi } = lvdBounds(e, D);
    if (pg < lo) return fail(`Em ${lvdBR(D)} você já estava na pág. ${lo}. Use uma página igual ou maior.`);
    if (hi != null && pg > hi) return fail(`Na leitura seguinte (${lvdBR(String(nx.date))}) você estava na pág. ${hi}. Use uma página até ${hi}.`);
    U.lvErr = '';
    if (!nx) { // vira a leitura mais recente: fluxo normal e depois tudo passa para o dia D
      const before = new Set((e.readLog || []).map((x) => x.id)), hadStart = !!e.startedAt, hadFin = !!e.finishedAt;
      LVD_RETRO = { libId: e.id, day: D, until: Date.now() + 5000 };
      await _s.apply(this, arguments);
      (e.readLog || []).forEach((x) => { if (!before.has(x.id) && x.date === t) x.date = D; });
      if (!hadStart && e.startedAt === t) e.startedAt = D; if (!hadFin && String(e.finishedAt) === t) e.finishedAt = D;
      save(); try { renderHome(todayISO()); } catch {} return; }
    // no meio do histórico: entra antes da leitura seguinte, que é ajustada; a página atual não muda
    const delta = pg - lo; if (delta > 0) { const L = e.readLog || (e.readLog = []); const x = { id: uid(), date: D, pages: delta };
      nx.pages = (Number(nx.pages) || 0) - delta; const ix = L.indexOf(nx); L.splice(ix < 0 ? L.length : ix, 0, x); save(); }
    const keep = U.pg; U.pg = inf.now; // o resto (emoções, comentário, trecho, anotação) segue pelo fluxo normal, sem nova página
    try { await _s.apply(this, arguments); } finally { U.pg = keep; }
    try { renderHome(todayISO()); } catch {} toast(delta > 0 ? `Leitura de ${lvdBR(D)} salva: pág. ${pg}` : 'Nada mudou nesse dia'); }; }
