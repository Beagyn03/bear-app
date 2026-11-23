// Planeta Ler + aba Jornada (Bia, 22/11; protótipo v196 aprovado).
//  - A barra de baixo fica Hoje · Biblioteca · Jornada · Comunidade · Você. O botão Ler do meio sai.
//  - Ler vira um planeta flutuante no canto, só no Hoje e na Biblioteca (some com folha aberta, no Organizar/Decorar e digitando).
//  - Com uma sessão de leitura contando e a tela da sessão fechada, aparece uma pílula com o cronômetro em TODAS as telas.
//    A pílula se arrasta para qualquer canto (encaixa na borda mais próxima, como bolha de conversa) e lembra o lugar;
//    tocar sem arrastar volta para a sessão. Com o teclado aberto, ela some.
//  - Jornada junta o que era "Minha leitura" do perfil: o mês (meta do ano, órbita, resumo) e os atalhos com número vivo.
//    O perfil vira vitrine (sem "Minha leitura"). Em dezembro e janeiro, a Retrospectiva aparece em destaque no topo.
V2I.jornada = '<path d="M4 19.5c2.6-.6 4-3.4 7-4.4s5.2.8 8.2-3"/><circle class="d" cx="4" cy="19.5" r="1.6"/><circle cx="4" cy="19.5" r="1.6"/><circle class="d" cx="11" cy="15.1" r="1.6"/><circle cx="11" cy="15.1" r="1.6"/><circle class="d" cx="19.2" cy="12.1" r="1.6"/><circle cx="19.2" cy="12.1" r="1.6"/><path d="M15.5 3.2l.75 1.75 1.75.75-1.75.75-.75 1.75-.75-1.75-1.75-.75 1.75-.75z"/>';
try { TAB_T.jornada = 'Jornada'; } catch {}
const JN_ICO = {
  meta: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  stats: '<path d="M4 20h16M6.5 20v-6M11 20V8M15.5 20v-9M20 20V5"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  orb: '<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-20 12 12)"/><circle cx="12" cy="12" r="4.6"/>',
  friends: '<circle cx="9" cy="8" r="3.4"/><path d="M3 20c.6-3.6 3-5.6 6-5.6s5.4 2 6 5.6"/><path d="M15.5 5a3.2 3.2 0 0 1 0 6.3M17.5 14.6c2 .6 3.2 2.4 3.5 5.4"/>',
  swap: '<path d="M4 8h14l-3.5-3.5M20 16H6l3.5 3.5"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5V20h14v-7.5M12 8.5V20M12 8.5C10.5 5 7 4.5 7 6.6 7 8.3 10 8.5 12 8.5zM12 8.5c1.5-3.5 5-4 5-1.9 0 1.7-3 1.9-5 1.9z"/>',
  chev: '<path d="M9 5l7 7-7 7"/>',
  star: '<path d="M12 3.5l2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16.5l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7z"/>',
};
const jnI = (k, w) => `<svg class="jni" viewBox="0 0 24 24" width="${w || 22}" height="${w || 22}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${JN_ICO[k] || ''}</svg>`;
const JN_MES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const jnMod = (k) => { try { return typeof vFn === 'function' ? vFn(k) !== false : true; } catch { return true; } };
const jnMod4 = (k) => { try { return typeof v4Mod === 'function' ? v4Mod(k) !== false : true; } catch { return true; } };
const jnPl = (n, a, b) => n + ' ' + (n === 1 ? a : b);

// ---------- números vivos ----------
function jnData() {
  const t = todayISO(), y = t.slice(0, 4), ym = t.slice(0, 7), L = lib();
  let Y = { y, target: 0, done: 0 }; try { Y = yearInfo(); } catch {}
  let orb = { cur: 0, best: 0, today: false, days: new Map() }; try { orb = orbStats(); } catch { try { orb.cur = streakNow(); } catch {} }
  const daysMes = [...(orb.days && orb.days.keys ? orb.days.keys() : [])].filter((d) => String(d).startsWith(ym)).length;
  const goalsOn = (db.goals || []).filter((g) => g.status !== 'CONCLUIDA' && (!g.targetDate || g.targetDate >= t)).length;
  const lidosAno = L.filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(y));
  const pagsAno = lidosAno.reduce((a, e) => a + (Number(e.totalPages) || 0), 0);
  let prev = { ym: '', nome: '', ano: '' }; try { prev = v2RsMonth(1); } catch {}
  const finPrev = prev.ym ? L.filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(prev.ym)).length : 0;
  const loans = L.filter((e) => (e.ex || {}).loan).length, borrowed = L.filter((e) => (e.ex || {}).own === 'pegou').length;
  const loanNext = L.map((e) => (e.ex || {}).loan && e.ex.loan.due).filter(Boolean).sort()[0] || '';
  let gifts = []; try { gifts = gfList().filter((g) => !g.given); } catch {}
  let lj = { on: 0, inv: 0, nw: 0, sum: '' };
  try { const I = ljItems(); lj = { on: ljOn(I).length, inv: ljInv(I).length, nw: ljOn(I).reduce((a, x) => a + ljNew(x), 0), sum: ljSummary() }; } catch {}
  const mon = Number(t.slice(5, 7));
  return { t, y, ym, Y, orb, daysMes, goalsOn, lidosAno: lidosAno.length, pagsAno, prev, finPrev, loans, borrowed, loanNext, gifts, lj, mon, nova: !L.length };
}
const jnFmt = (n) => { try { return n >= 1000 ? (Math.round(n / 100) / 10).toLocaleString('pt-BR') + ' mil' : String(n); } catch { return String(n); } };
const jnDm = (d) => { const p = String(d || '').slice(0, 10).split('-'); return p.length === 3 ? p[2] + '/' + p[1] : ''; };

function jnHTML() {
  const D = jnData(), C = 2 * Math.PI * 44, Y = D.Y, pct = Y.target ? Math.min(1, Y.done / Y.target) : 0;
  const ring = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="44" class="tr"/><circle cx="50" cy="50" r="44" class="fl" stroke-dasharray="${(C * pct).toFixed(1)} ${C.toFixed(1)}"/></svg>`;
  const retroOn = (D.mon === 12 || D.mon === 1) && !D.nova, ry = D.mon === 1 ? String(Number(D.y) - 1) : D.y;
  const retroN = D.mon === 1 ? lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(ry)).length : D.lidosAno;
  const retro = retroOn && retroN ? `<button type="button" class="jnrt" data-jn="retro" data-y="${ry}"><span class="eb">Seu ano em livros</span><b>Retrospectiva ${ry}</b><small>${jnPl(retroN, 'livro', 'livros')} · veja e compartilhe</small><span class="go">Abrir ${jnI('chev', 14)}</span></button>` : '';
  const hero = D.nova ? `<section class="jnhero jnnv"><span class="eb">Sua jornada</span><h3>Tudo o que é seu, num lugar só</h3><p>Metas, órbita, resumos do mês e a Retrospectiva aparecem aqui conforme você lê.</p></section>`
    : `<section class="jnhero"><div class="jnhd"><span class="eb">${JN_MES[D.mon - 1].replace(/^./, (c) => c.toUpperCase())} de ${D.y}</span><small>só você vê</small></div>
    <div class="jnrow">${jnMod('metas') ? `<button type="button" class="jnring" data-jn="metas" aria-label="Meta ${D.y}: ${Y.target ? Y.done + ' de ' + Y.target + ' livros' : 'definir'}">${ring}<span>${Y.target ? `<b>${Y.done}</b><small>de ${Y.target}</small>` : `<b>${Y.done}</b><small>lidos</small>`}<em>Meta ${D.y}</em></span></button>` : ''}
    <div class="jnside">${jnMod('orbita') ? `<button type="button" data-jn="orbita">${jnI('orb', 20)}<b>${D.orb.cur ? jnPl(D.orb.cur, 'dia', 'dias') + ' em órbita' : 'Fora de órbita'}</b><small>${D.orb.best ? 'recorde ' + D.orb.best + ' · ' : ''}${D.orb.today ? 'hoje já conta' : 'leia hoje para contar'}</small></button>` : ''}
    <button type="button" data-jn="resumo">${jnI('cal', 20)}<b>${D.prev.nome ? D.prev.nome.replace(/^./, (c) => c.toUpperCase()) + ': ' + jnPl(D.finPrev, 'livro', 'livros') : 'Resumo do mês'}</b><small>ver o resumo do mês</small></button></div></div></section>`;
  const T = [
    jnMod('metas') && ['metas', 'meta', 'Metas', D.goalsOn ? jnPl(D.goalsOn, 'ativa', 'ativas') : (Y.target ? Y.done + ' de ' + Y.target : ''), D.goalsOn ? 'com prazo' + (Y.target ? ' · meta do ano ' + Y.done + '/' + Y.target : '') : (Y.target ? 'meta do ano' : 'defina a do ano'), D.goalsOn || Y.target],
    ['stats', 'stats', 'Estatísticas', D.lidosAno ? jnPl(D.lidosAno, 'lido', 'lidos') : '', D.lidosAno ? 'em ' + D.y + ' · ' + jnFmt(D.pagsAno) + ' páginas' : 'aparecem com o 1º livro lido', D.lidosAno],
    ['resumo', 'cal', retroOn ? 'Retrospectiva e Resumo' : 'Resumo e Retrospectiva', D.prev.nome && D.finPrev ? D.prev.nome.replace(/^./, (c) => c.toUpperCase()) : '', D.finPrev ? jnPl(D.finPrev, 'livro', 'livros') + ' no mês' : 'o resumo chega no fim do mês', D.finPrev || retroOn],
    jnMod('orbita') && ['orbita', 'orb', 'Calendário', D.daysMes ? jnPl(D.daysMes, 'dia lido', 'dias lidos') : '', D.daysMes ? 'em ' + JN_MES[D.mon - 1] : 'leia hoje para começar', D.daysMes],
    jnMod('junto') && ['juntos', 'friends', 'Ler junto', D.lj.on ? D.lj.on + ' em andamento' : (D.lj.inv ? jnPl(D.lj.inv, 'convite', 'convites') : ''), D.lj.nw ? jnPl(D.lj.nw, 'mensagem nova', 'mensagens novas') : (D.lj.inv && D.lj.on ? jnPl(D.lj.inv, 'convite', 'convites') : 'convide alguém'), D.lj.on || D.lj.inv, D.lj.nw || D.lj.inv],
    jnMod4('emprest') && ['emprest', 'swap', 'Empréstimos', D.loans ? jnPl(D.loans, 'emprestado', 'emprestados') : (D.borrowed ? jnPl(D.borrowed, 'pego', 'pegos') : ''), D.loanNext ? 'um volta em ' + jnDm(D.loanNext) : (D.borrowed && D.loans ? jnPl(D.borrowed, 'pego', 'pegos') : 'nenhum'), D.loans || D.borrowed],
    jnMod4('presentes') && ['presentes', 'gift', 'Presentes', D.gifts.length ? jnPl(D.gifts.length, 'para entregar', 'para entregar') : '', D.gifts.length ? (D.gifts.map((g) => g.due).filter(Boolean).sort()[0] ? 'entregar até ' + jnDm(D.gifts.map((g) => g.due).filter(Boolean).sort()[0]) : 'reservados') : 'nenhum', D.gifts.length],
  ].filter(Boolean);
  const full = T.filter((x) => x[5]), empty = T.filter((x) => !x[5]);
  const tile = ([k, i, l, n, s, , dot]) => `<button type="button" data-jn="${k}">${jnI(i, 22)}<b>${l}</b>${n ? `<span class="n">${esc(n)}</span>` : ''}${s ? `<small>${esc(s)}</small>` : ''}${dot ? '<span class="ndot" aria-label="Novidades"></span>' : ''}</button>`;
  return `<div class="jn">${retro}${hero}${full.length ? `<div class="jnh2">Atalhos</div><div class="jngrid">${full.map(tile).join('')}</div>` : ''}
    ${empty.length ? `<div class="jnmin">${empty.map(([k, i, l, , s]) => `<button type="button" data-jn="${k}">${jnI(i, 16)}<span>${l}</span><small>${esc(s || 'nenhum')}</small>${jnI('chev', 14)}</button>`).join('')}</div>` : ''}</div>`;
}
// abrir um atalho: os mesmos caminhos do antigo "Minha leitura"; o Voltar dessas telas devolve à Jornada
function jnGo(k, el) {
  try { const L0 = TR.querySelector('#lista'); S.jnY = L0 ? L0.scrollTop : 0; } catch {}
  S.jnRet = true;
  if (k === 'orbita' && typeof window.__orbCal === 'function') { try { return window.__orbCal(); } catch {} }
  if (k === 'retro') { const y = (el && el.dataset.y) || todayISO().slice(0, 4); if (typeof window.v2RtOpen === 'function' && window.v2RtOpen('ano', y) !== false) return; return goTab('progresso'); }
  const v = $('#shelflist');
  try { v3Go(v, { self: true, handle: (socialProfile && socialProfile.handle) || '' }, k); } catch (err) { console.error('jornada', k, err); toast('Não consegui abrir agora'); }
}
{ const _dt = drawTab; drawTab = function () {
  if (S.tab !== 'jornada') return _dt.apply(this, arguments);
  const box = $('#lista'); box.classList.add('v3'); const html = jnHTML();
  if (box.dataset.jnsig === html && box.querySelector(':scope > .jn')) return; box.dataset.jnsig = html; box.innerHTML = html;
  box.querySelectorAll('[data-jn]').forEach((b) => b.addEventListener('click', () => jnGo(b.dataset.jn, b)));
}; }
// a assinatura só vale enquanto a Jornada está na tela
{ const _gt = goTab; goTab = function (tab, fromBar) {
  if (fromBar || tab === 'jornada') S.jnRet = false;
  // Voltar de uma tela aberta pela Jornada (Estatísticas e afins voltam para a "última aba"): volta para a Jornada
  else if (S.jnRet && ['inicio', 'estante', 'comunidade', 'eu'].includes(tab)) { S.jnRet = false; tab = 'jornada'; S.jnBackY = S.jnY || 0; }
  const L = $('#lista'), was = S.tab; if (L) delete L.dataset.jnsig;
  const r = _gt.call(this, tab, fromBar);
  // a Jornada abre no topo pela barra; voltando de uma tela que ela abriu, volta onde estava (22/11)
  if (tab === 'jornada' && was !== 'jornada' && L) { const y = S.jnBackY || 0; S.jnBackY = 0; L.scrollTop = y; if (y) requestAnimationFrame(() => { L.scrollTop = y; setTimeout(() => { L.scrollTop = y; }, 120); }); }
  return r;
}; }

// ---------- barra de baixo ----------
v2OnTab = function () { const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) return 'eu'; if (S.tab === 'perfil') return 'eu'; if (S.tab === 'progresso' && S.jnRet) return 'jornada'; return S.tab; };
drawTabbar = function () {
  const bar = $('#tabbar'); if (!bar) return; const h = drawHud(), cur = v2OnTab();
  bar.classList.add('v2bar', 'v5bar');
  const av = `<span class="tb-av" style="${h.ph ? `background-image:${cssUrl(h.ph)}` : ''}">${h.ph ? '' : esc(initial((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || h.name))}</span>`;
  const html = [['inicio', 'Hoje'], ['estante', 'Biblioteca'], ['jornada', 'Jornada'], ['comunidade', 'Comunidade'], ['eu', 'Você']].map(([k, n]) =>
    `<button type="button" data-tab="${k}" class="${cur === k ? 'on' : ''}" aria-current="${cur === k}">${k === 'eu' ? av : V2SVG(k)}<small>${n}</small></button>`).join('');
  if (bar.dataset.v2sig !== html || !bar.querySelector('[data-tab]')) { bar.dataset.v2sig = html; bar.innerHTML = html;
    $$('button', bar).forEach((b) => b.addEventListener('click', () => goTab(b.dataset.tab, true))); }
  try { paintCommDot(); } catch {}
};

// ---------- planeta e pílula ----------
const JN_PLANET = (sz, id) => `<svg class="plsv" viewBox="0 0 64 64" width="${sz}" height="${sz}" aria-hidden="true"><defs>
  <radialGradient id="jnG${id}" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe3b8"/><stop offset=".45" stop-color="#e3954a"/><stop offset="1" stop-color="#a8521f"/></radialGradient>
  <clipPath id="jnC${id}"><circle cx="32" cy="32" r="18.5"/></clipPath></defs>
  <g transform="rotate(-20 32 32)"><path class="rg" d="M3 32a29 8.5 0 0 1 58 0"/>
  <circle cx="32" cy="32" r="18.5" fill="url(#jnG${id})"/>
  <g clip-path="url(#jnC${id})"><g class="bands"><rect x="-20" y="24" width="110" height="3.2" rx="1.6"/><rect x="-20" y="33" width="110" height="2.2" rx="1.1"/><rect x="-20" y="39.5" width="110" height="3.6" rx="1.8"/></g>
  <circle cx="32" cy="32" r="18.5" class="sh"/></g>
  <path class="rg f" d="M3 32a29 8.5 0 0 0 58 0"/></g></svg>`;
{ const st = document.createElement('style'); st.textContent = `
#tabbar.v5bar{grid-template-columns:repeat(5,minmax(0,1fr))!important;align-items:center}
#tabbar.v5bar button{min-width:0}#tabbar.v5bar button small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.v3hubw{display:none!important}
#v5ler .plsv,#v5pill .plsv{position:relative;overflow:visible}
#v5ler{position:fixed;z-index:40;right:max(16px,env(safe-area-inset-right,0px));height:60px;min-width:60px;padding:0 20px 0 2px;border:0;border-radius:999px;display:flex;align-items:center;gap:4px;background:var(--acc);color:var(--on-acc,#fff);font:inherit;font-weight:900;font-size:1.05rem;letter-spacing:.01em;box-shadow:0 8px 22px color-mix(in srgb,var(--acc) 45%,rgba(0,0,0,.35)),0 0 0 3px color-mix(in srgb,var(--acc) 22%,transparent);cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:manipulation;transition:padding .22s ease,transform .25s cubic-bezier(.2,.9,.3,1.1),box-shadow .2s}
#v5ler[hidden]{display:none!important}
#v5ler .pl{position:relative;width:56px;height:56px;flex:none;display:grid;place-items:center}
#v5ler .pl::before{content:"";position:absolute;inset:6px;border-radius:50%;background:radial-gradient(circle,rgba(255,236,200,.55) 0,transparent 70%);filter:blur(6px);animation:jnglow 4.5s ease-in-out infinite}
#v5ler .plsv{filter:drop-shadow(0 3px 5px rgba(60,20,0,.35))}#v5ler:active{transform:scale(.95)}
#v5ler .lb{white-space:nowrap;overflow:hidden;max-width:4em;transition:max-width .22s ease,opacity .18s}
#v5ler.mini{padding:0 2px}#v5ler.lft{right:auto;left:max(16px,env(safe-area-inset-left,0px))}#v5ler.mini .lb{max-width:0;opacity:0}
#v5ler.pulse::after{content:"";position:absolute;inset:-4px;border-radius:inherit;border:3px solid var(--acc);animation:jnpulse 1.1s ease-out 2;pointer-events:none}
@keyframes jnpulse{from{transform:scale(1);opacity:.9}to{transform:scale(1.35);opacity:0}}
#v5ler .rg,#v5pill .rg{fill:none;stroke:#c9b6ff;stroke-width:3;opacity:.55}#v5ler .rg.f,#v5pill .rg.f{opacity:.95}
#v5ler .bands rect,#v5pill .bands rect{fill:#fff;opacity:.16}#v5ler .bands{animation:jnband 10s linear infinite}
#v5ler .sh,#v5pill .sh{fill:none;stroke:rgba(80,30,0,.18);stroke-width:5}
@keyframes jnglow{0%,100%{opacity:.55;transform:scale(.94)}50%{opacity:1;transform:scale(1.1)}}
@keyframes jnband{to{transform:translateX(-24px)}}
#v5pill{position:fixed;z-index:41;left:0;top:0;height:46px;border-radius:99px;padding:0 16px 0 6px;display:flex;align-items:center;gap:8px;border:0;background:var(--ink);color:var(--bg);font:inherit;font-weight:900;font-size:15px;box-shadow:0 6px 18px rgba(20,10,30,.32);max-width:min(240px,calc(100vw - 24px));cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;will-change:transform}
#v5pill[hidden]{display:none!important}
#v5pill.snap{transition:transform .28s cubic-bezier(.2,.9,.3,1.15)}#v5pill.drag{cursor:grabbing;box-shadow:0 12px 28px rgba(20,10,30,.4)}
#v5pill .clk{font-variant-numeric:tabular-nums}#v5pill .pt{font-weight:700;font-size:13px;opacity:.8;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#lista.v5pad.v5pad{padding-bottom:calc(var(--inst-h,0px) + 184px + env(safe-area-inset-bottom,0px))!important}#shelflist.v5pad.v5pad .sl-body{padding-bottom:calc(var(--inst-h,0px) + 184px + env(safe-area-inset-bottom,0px))!important}
@media (prefers-reduced-motion:reduce){#v5ler .pl::before,#v5ler .bands,#v5ler.pulse::after{animation:none}#v5ler,#v5ler .lb{transition:none}#v5pill.snap{transition:none}}
.jn{display:grid;gap:12px;padding:4px 0 8px}
.jn .eb{font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--acc)}
.jnhero{border:1px solid var(--line);background:var(--panel);border-radius:20px;padding:16px}
.jnhd{display:flex;align-items:baseline;justify-content:space-between;gap:8px;margin-bottom:12px}.jnhd small{font-size:.76rem;font-weight:800;color:var(--ink-2)}
.jnrow{display:grid;grid-template-columns:auto minmax(0,1fr);gap:14px;align-items:center}
.jnring{position:relative;width:108px;height:108px;display:grid;place-items:center;text-align:center;flex:none;border:0;background:none;padding:0;color:var(--ink);font:inherit;cursor:pointer}
.jnring svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.jnring .tr{fill:none;stroke:color-mix(in srgb,var(--line) 80%,transparent);stroke-width:8}.jnring .fl{fill:none;stroke:var(--acc);stroke-width:8;stroke-linecap:round}
.jnring span{position:relative;display:grid;line-height:1.05}.jnring b{font-family:var(--f-disp,Georgia,serif);font-size:2rem}.jnring small{font-size:.78rem;color:var(--ink-2);font-weight:800}.jnring em{font-style:normal;font-size:.68rem;color:var(--ink-2);font-weight:900;letter-spacing:.06em;text-transform:uppercase;margin-top:3px}
.jnside{display:grid;gap:8px;min-width:0}
.jnside button{display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:10px;align-items:center;text-align:left;padding:10px 12px;border-radius:14px;border:0;background:color-mix(in srgb,var(--line) 45%,transparent);color:var(--ink);font:inherit;min-height:52px;cursor:pointer;min-width:0}
.jnside .jni{grid-row:span 2;color:var(--acc)}.jnside b{font-size:.9rem;min-width:0}.jnside small{font-size:.75rem;color:var(--ink-2);font-weight:700}
.jnnv h3{font-family:var(--f-disp,Georgia,serif);font-size:1.25rem;margin:6px 0 4px}.jnnv p{margin:0;color:var(--ink-2);font-size:.88rem;line-height:1.45}
.jnh2{font-size:.78rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);margin:6px 2px 0}
.jngrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.jngrid button{position:relative;display:grid;align-content:start;justify-items:start;gap:2px;text-align:left;padding:14px;border-radius:16px;border:1px solid var(--line);background:var(--panel);color:var(--ink);font:inherit;min-height:104px;min-width:0;cursor:pointer}
.jngrid .jni{color:var(--acc);margin-bottom:6px}.jngrid b{font-size:.9rem}.jngrid .n{font-family:var(--f-disp,Georgia,serif);font-size:1.15rem;font-weight:700;line-height:1.2}.jngrid small{font-size:.75rem;color:var(--ink-2);font-weight:700}
.jngrid .ndot{position:absolute;top:12px;right:12px;width:9px;height:9px;border-radius:50%;background:var(--acc)}
.jnmin{display:grid;gap:6px}.jnmin button{display:grid;grid-template-columns:auto 1fr auto auto;gap:8px;align-items:center;padding:9px 12px;border-radius:12px;border:1px dashed var(--line);background:none;color:var(--ink-2);font:inherit;font-weight:800;font-size:.84rem;text-align:left;min-height:44px;cursor:pointer}.jnmin small{font-size:.75rem;font-weight:700}
.jnrt{display:grid;justify-items:start;gap:3px;text-align:left;border:0;border-radius:20px;padding:18px;color:#fff;font:inherit;cursor:pointer;background:radial-gradient(120% 90% at 80% 0%,#4a3a8a 0,#1b1640 55%,#0e0b22 100%);box-shadow:0 8px 22px rgba(20,10,40,.3)}
.jnrt .eb{color:#f3c56b}.jnrt b{font-family:var(--f-disp,Georgia,serif);font-size:1.5rem}.jnrt small{font-size:.84rem;opacity:.85}.jnrt .go{display:inline-flex;align-items:center;gap:4px;margin-top:8px;padding:7px 12px;border-radius:99px;background:#f3c56b;color:#1b1426;font-weight:900;font-size:.82rem}
`; TR.append(st); }
const jnPl_ = document.createElement('button'); jnPl_.type = 'button'; jnPl_.id = 'v5ler'; jnPl_.hidden = true; jnPl_.setAttribute('aria-label', 'Ler: abrir a sessão de leitura');
jnPl_.innerHTML = `<span class="pl">${JN_PLANET(56, 'p')}</span><span class="lb">Ler</span>`; TR.append(jnPl_);
// extended FAB: rolar para baixo encolhe para só o planeta; parar ou subir volta a mostrar "Ler"
{ let last = {}, tm = 0; TR.addEventListener('scroll', (e) => { const el = e.target; if (!el || !el.id || !/^(lista|shelflist)$/.test(el.id)) return; const y = el.scrollTop, p = last[el.id] || 0; last[el.id] = y;
    if (y > p + 4) jnPl_.classList.add('mini'); else if (y < p - 4) jnPl_.classList.remove('mini');
    S.jnScr = 1; clearTimeout(tm); tm = setTimeout(() => { S.jnScr = 0; jnDodge(); }, 700); }, true); }
// nunca parado em cima de algo tocável ou de um título de seção: sobe até achar um espaço livre (até 220 px)
// o que está embaixo de um ponto: o planeta só pode ficar parado sobre fundo vazio (de cartão ou da página),
// nunca sobre texto, capa, ícone ou algo tocável pequeno (um cartão largo coberto só na ponta continua tocável)
const jnTxt = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
const jnHitAt = (x, y) => { let L = []; try { L = TR.elementsFromPoint(x, y); } catch { return false; }
  for (const el of L) { if (el === jnPl_ || jnPl_.contains(el) || el === jnPill || jnPill.contains(el)) continue; if (el.id === 'tabbar' || el.closest('#tabbar, .gtop')) return true;
    if (el.matches('#lista, #shelflist, .sl-body, html, body') || el === document.documentElement) return false;
    if (/^(IMG|SVG|INPUT|TEXTAREA|SELECT|CANVAS|VIDEO)$/i.test(el.tagName) || el.closest('svg') || el.matches('.cv, [class*="cover"]') || jnTxt(el)) return true;
    const t = el.closest('button, a, [role=button], label'); if (t) { const b = t.getBoundingClientRect(); if (b.width < 200 || b.height < 44) return true; }
    if (getComputedStyle(el).backgroundImage !== 'none' && el.offsetWidth < 200) return true;
    return false; } return false; };
const jnHits = (r, dy) => { const xs = [0.12, 0.35, 0.65, 0.88], ys = [0.12, 0.5, 0.88];
  for (const fx of xs) for (const fy of ys) if (jnHitAt(r.left + (r.right - r.left) * fx, r.top + dy + (r.bottom - r.top) * fy)) return true; return false; };
let jnW = 108;
const jnBase = (mini, left) => { const b = parseFloat(jnPl_.style.bottom) || 88, w = mini ? 60 : jnW, R = left ? 16 + w : window.innerWidth - 16, bot = window.innerHeight - b; return { left: R - w, right: R, top: bot - 60, bottom: bot }; };
// posição FIXA (Bia 22/11): canto inferior direito, 16 px acima da barra; ao parar só volta a mostrar 'Ler'. As listas reservam espaço no fim.
function jnDodge() { if (jnPl_.hidden) return; jnPl_.classList.remove('mini', 'lft'); jnPl_.dataset.dy = 0; jnPl_.style.transform = ''; }
const jnPulseOnce = () => { try { if (localStorage.getItem('lv.lerPulso')) return; localStorage.setItem('lv.lerPulso', '1'); } catch { return; } if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; jnPl_.classList.add('pulse'); setTimeout(() => jnPl_.classList.remove('pulse'), 2400); };
jnPl_.addEventListener('click', () => { try { v2Ler(); } catch (err) { console.error('ler', err); } });
const jnPill = document.createElement('button'); jnPill.type = 'button'; jnPill.id = 'v5pill'; jnPill.hidden = true;
jnPill.innerHTML = JN_PLANET(30, 'q') + '<span class="clk"></span><span class="pt"></span>'; TR.append(jnPill);
const JN_PK = 'lv.pilula';
const jnBounds = () => { const vh = window.innerHeight, vw = window.innerWidth, tb = $('#tabbar'), gt = TR.querySelector('.gtop');
  const bot = tb && tb.getClientRects().length ? tb.getBoundingClientRect().top : vh, top = gt && gt.getClientRects().length ? gt.getBoundingClientRect().bottom : 0;
  return { vw, vh, top: top + 8, bot: bot - 8 }; };
const jnPosGet = () => { try { const p = JSON.parse(localStorage.getItem(JN_PK) || 'null'); if (p && (p.s === 'l' || p.s === 'r') && typeof p.y === 'number') return p; } catch {} return { s: 'r', y: 1 }; };
const jnPosSet = (p) => { try { localStorage.setItem(JN_PK, JSON.stringify(p)); } catch {} };
// posição: lado (l/r) + fração da altura útil (0 = logo abaixo do topo, 1 = logo acima da barra de baixo)
const jnPlace = (p, anim) => { const B = jnBounds(), w = jnPill.offsetWidth || 160, h = jnPill.offsetHeight || 46, m = 12;
  const x = p.s === 'l' ? m : B.vw - w - m, y = B.top + Math.max(0, Math.min(1, p.y)) * Math.max(0, B.bot - B.top - h);
  jnPill.classList.toggle('snap', !!anim); jnPill.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; };
{ let d = null; const TH = 6;
  jnPill.addEventListener('pointerdown', (e) => { if (e.button > 0) return; const r = jnPill.getBoundingClientRect(); d = { id: e.pointerId, x0: e.clientX, y0: e.clientY, ox: e.clientX - r.left, oy: e.clientY - r.top, mv: false }; try { jnPill.setPointerCapture(e.pointerId); } catch {} });
  jnPill.addEventListener('pointermove', (e) => { if (!d || e.pointerId !== d.id) return; const dx = e.clientX - d.x0, dy = e.clientY - d.y0;
    if (!d.mv && Math.hypot(dx, dy) < TH) return; if (!d.mv) { d.mv = true; jnPill.classList.add('drag'); jnPill.classList.remove('snap'); }
    e.preventDefault(); const B = jnBounds(), w = jnPill.offsetWidth, h = jnPill.offsetHeight;
    const x = Math.max(4, Math.min(B.vw - w - 4, e.clientX - d.ox)), y = Math.max(B.top, Math.min(B.bot - h, e.clientY - d.oy));
    jnPill.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; });
  const end = (e, cancel) => { if (!d || (e && e.pointerId !== d.id)) return; const was = d.mv; d = null; jnPill.classList.remove('drag');
    if (!was) { if (!cancel) jnPill.dataset.tap = '1'; return; }
    const r = jnPill.getBoundingClientRect(), B = jnBounds(), span = Math.max(1, B.bot - B.top - r.height);
    const p = { s: r.left + r.width / 2 < B.vw / 2 ? 'l' : 'r', y: Math.max(0, Math.min(1, (r.top - B.top) / span)) }; jnPosSet(p); jnPlace(p, true); };
  jnPill.addEventListener('pointerup', (e) => end(e)); jnPill.addEventListener('pointercancel', (e) => end(e, true));
  jnPill.addEventListener('click', (e) => { if (!jnPill.dataset.tap && e.detail !== 0) { e.preventDefault(); return; } delete jnPill.dataset.tap; try { v2Ler(); } catch (err) { console.error('ler', err); } });
  jnPill.addEventListener('dragstart', (e) => e.preventDefault());
  window.addEventListener('resize', () => { if (!jnPill.hidden) jnPlace(jnPosGet()); }); }

// o que está por cima da tela agora (folhas, menus, diálogos, sessão, edição da prateleira)
const jnCovered = () => {
  const OV = '.sheet, .esn-sheet, .lvpl-modal, .v10dlg, .rt, .pm-wrap, .popmenu';
  if ([...document.body.children, ...TR.children].some((n) => n.matches && n.matches(OV) && n.getClientRects().length)) return true;
  const ed = $('#editor'); if (ed && !ed.hidden) return true;
  try { if (typeof V4 !== 'undefined' && V4 && V4.isConnected) return true; } catch {}
  try { const S5 = S.v5 || {}; if (S5.shEd || S5.sel) return true; } catch {}
  try { if (typeof SHX_MODE !== 'undefined' && SHX_MODE) return true; } catch {}
  if (TR.querySelector('#rt, .rt-host:not([hidden]), .ppscrim')) return true;
  return false; };
const jnTyping = () => { const a = TR.activeElement || document.activeElement; return !!(a && (a.tagName === 'TEXTAREA' || (a.tagName === 'INPUT' && !/^(checkbox|radio|button|range|submit)$/.test(a.type)) || a.isContentEditable)); };
const jnSesView = () => { try { return !!(typeof V4 !== 'undefined' && V4 && V4.isConnected && S.v4 && S.v4.view === 'ler'); } catch { return false; } };
let jnLast = ''; const jnTick = () => {
  const v = $('#shelflist'), L = $('#lista'), open = v && !v.hidden, typing = jnTyping();
  const onHome = S.tab === 'inicio' && !open, onBib = S.tab === 'estante' && (!open || (v.classList.contains('tabroot') && !v.classList.contains('v4inner')));
  let ses = null; try { ses = typeof v4Ses === 'function' ? v4Ses() : null; } catch {}
  const pill = !!ses && !jnSesView() && !typing;
  const planet = !ses && onHome && !typing && !jnCovered(); // Bia 23/11: o Ler não fica na Biblioteca (cobre a estante); só no Hoje
  void onBib;
  // espaço no fim das listas (só pela aba, para não mexer no layout a cada folha que abre)
  const padL = S.tab === 'inicio' || S.tab === 'estante' || (pill && !open), padV = (S.tab === 'estante' && open) || (pill && open);
  if (L && L.classList.contains('v5pad') !== !!padL) L.classList.toggle('v5pad', !!padL);
  if (v && v.classList.contains('v5pad') !== !!padV) v.classList.toggle('v5pad', !!padV);
  if (jnPl_.hidden === planet) { jnPl_.hidden = !planet; if (planet) { jnPulseOnce(); setTimeout(jnDodge, 60); } } else if (planet && !S.jnScr) jnDodge();
  if (planet) { const tb = $('#tabbar'), b = tb && tb.getClientRects().length ? window.innerHeight - tb.getBoundingClientRect().top : 72; const bb = Math.round(b + 16) + 'px'; if (jnPl_.style.bottom !== bb) jnPl_.style.bottom = bb; }
  if (pill) { const e = lib().find((x) => x.id === ses.libId); let c = ''; try { c = ses.pz ? 'pausada' : v4Clock(ses).t; } catch {}
    const ck = jnPill.querySelector('.clk'), pt = jnPill.querySelector('.pt'), ttl = (e && e.title) || '';
    if (ck.textContent !== c) ck.textContent = c; if (pt.textContent !== ttl) pt.textContent = ttl;
    const lab = 'Voltar à sessão de leitura' + (ttl ? ': ' + ttl : '') + (c ? ', ' + c : ''); if (jnPill.getAttribute('aria-label') !== lab) jnPill.setAttribute('aria-label', lab);
    if (jnPill.hidden) { jnPill.hidden = false; jnPlace(jnPosGet()); } else if (!jnPill.classList.contains('drag') && jnLast !== 'pill') jnPlace(jnPosGet()); }
  else if (!jnPill.hidden) jnPill.hidden = true;
  jnLast = pill ? 'pill' : planet ? 'planet' : '';
};
setInterval(jnTick, 500); TR.addEventListener('focusin', () => setTimeout(jnTick, 0)); TR.addEventListener('focusout', () => setTimeout(jnTick, 60));
TR.addEventListener('click', () => setTimeout(jnTick, 120)); document.addEventListener('visibilitychange', () => setTimeout(jnTick, 50));
// ao sair da Jornada por uma aba, o atalho deixa de "lembrar" a volta
drawTabbar(); setTimeout(jnTick, 300);
