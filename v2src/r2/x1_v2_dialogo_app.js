// Nenhuma janela do navegador na v2 (Bia, 20/11: regra única de confirmar e desfazer).
// O app ainda tem ~38 confirm()/prompt()/alert() antigos. Em vez de reescrever cada um, a confirmação vira uma folha do app:
// a 1ª chamada mostra a folha e devolve "não"; se a pessoa confirma, a mesma ação é refeita (o mesmo botão ou o mesmo item de menu)
// e desta vez o confirm() devolve "sim". prompt() faz o mesmo com um campo de texto. alert() vira aviso (toast).
// Chamada que não veio de um toque, as escolhas de sincronização (OK/Cancelar com dois resultados) e a importação de arquivo continuam com a janela antiga.
{ const st = document.createElement('style'); st.textContent = `
.v10dlg{position:fixed;inset:0;z-index:2147483000;display:grid;align-items:end;justify-items:center;background:rgba(10,8,20,.45);padding:0 0 env(safe-area-inset-bottom,0)}
.v10dlg .bx{width:min(100%,460px);background:var(--panel,#fff);color:var(--ink,#222);border-radius:22px 22px 0 0;padding:20px 18px 18px;box-shadow:0 -8px 30px rgba(0,0,0,.25);display:grid;gap:12px}
.v10dlg h3{margin:0;font-size:18px;line-height:1.25}.v10dlg p{margin:0;font-size:14px;line-height:1.45;color:var(--ink-2,#555);white-space:pre-line}
.v10dlg input{width:100%;box-sizing:border-box;min-height:44px;padding:10px 12px;border-radius:12px;border:1px solid var(--line,#ccc);background:var(--bg,#fff);color:inherit;font:inherit}
.v10dlg .bt{display:flex;gap:10px;justify-content:flex-end;margin-top:4px}
.v10dlg .bt button{min-height:44px;min-width:44px;padding:0 18px;border-radius:999px;border:1px solid var(--line,#ccc);background:none;color:inherit;font:inherit;font-weight:800;cursor:pointer}
.v10dlg .bt .ok{background:var(--acc,#c76b2a);border-color:transparent;color:#fff}.v10dlg .bt .ok.dng{background:#b3261e}
@media (prefers-reduced-motion: no-preference){.v10dlg .bx{animation:v10up .18s ease-out}@keyframes v10up{from{transform:translateY(24px);opacity:.6}}}
`; TR.append(st); }
{ const NC = window.confirm.bind(window), NP = window.prompt.bind(window), NA = window.alert.bind(window);
  let act = null, passC = 0, passP = null;
  // de onde veio a ação: o último toque (botão) ou o item de menu/folha que está rodando
  window.addEventListener('click', (ev) => { const t = ev.composedPath ? ev.composedPath()[0] : ev.target; const b = t && t.closest ? t.closest('button,a,[role=button],[data-a],label,input') || t : t; act = { el: b, t: Date.now() }; }, true);
  const wrapItems = (items, key) => (items || []).map((x) => { if (!x || typeof x !== 'object') return x;
    if (Array.isArray(x)) { const f = x[1]; return typeof f === 'function' ? [x[0], function () { act = { fn: f, t: Date.now() }; return f.apply(this, arguments); }, ...x.slice(2)] : x; }
    if (typeof x[key] !== 'function') return x; const f = x[key]; return Object.assign({}, x, { [key]: function () { act = { fn: f, t: Date.now() }; return f.apply(this, arguments); } }); });
  try { const _pm = popMenu; popMenu = function (anchor, items) { return _pm.call(this, anchor, wrapItems(items, 'fn')); }; } catch {}
  try { const _sl = sheetList; sheetList = function (title, items, c) { return _sl.call(this, title, wrapItems(items, 'fn'), c); }; } catch {}
  try { const _sh = sheet; sheet = function (title, items) { return _sh.call(this, title, wrapItems(items)); }; } catch {}
  const replayable = () => act && Date.now() - act.t < 2500 && (act.fn || (act.el && act.el.isConnected));
  const replay = (a) => { try { if (a.fn) a.fn(); else if (a.el && a.el.isConnected) a.el.click(); } catch (e) { console.warn('refazer ação', e); } };
  const VERB = /^(Apagar|Excluir|Remover|Tirar|Desfazer|Bloquear|Descartar|Desconectar|Sair|Recriar|Corrigir|Começar|Salvar|Cancelar|Levar|Usar)\b/i, DNG = /^(Apagar|Excluir|Remover|Tirar|Desfazer|Bloquear|Descartar)/i;
  const split = (m) => { const s = String(m || '').trim(), i = s.search(/\?(\s|$)/); if (i > 0 && i < 160) return [s.slice(0, i + 1).trim(), s.slice(i + 1).trim()]; return [s, '']; };
  const okLabel = (title) => { const q = title.split(/[.!]\s+/).pop(), w = (q.match(VERB) || [])[1]; if (!w) return 'Confirmar'; return /^cancelar$/i.test(w) ? 'Sim, cancelar' : w[0].toUpperCase() + w.slice(1).toLowerCase(); };
  const open = (title, body, ok, dng, input, done) => {
    const prev = TR.activeElement || document.activeElement, d = document.createElement('div'); d.className = 'v10dlg';
    d.innerHTML = `<div class="bx" role="alertdialog" aria-modal="true" aria-labelledby="v10t" ${body ? 'aria-describedby="v10b"' : ''}><h3 id="v10t"></h3>${body ? '<p id="v10b"></p>' : ''}${input != null ? '<input type="text" aria-labelledby="v10t">' : ''}<div class="bt"><button type="button" class="no">Cancelar</button><button type="button" class="ok${dng ? ' dng' : ''}"></button></div></div>`;
    d.querySelector('h3').textContent = title; if (body) d.querySelector('p').textContent = body; d.querySelector('.ok').textContent = ok;
    const inp = d.querySelector('input'); if (inp) inp.value = input || '';
    const close = (v) => { d.remove(); try { prev && prev.focus && prev.focus(); } catch {} done(v); };
    d.addEventListener('click', (ev) => { if (ev.target === d) close(null); });
    d.querySelector('.no').addEventListener('click', (ev) => { ev.stopPropagation(); close(null); });
    d.querySelector('.ok').addEventListener('click', (ev) => { ev.stopPropagation(); close(inp ? inp.value : true); });
    d.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.stopPropagation(); close(null); } if (ev.key === 'Enter' && inp) { ev.preventDefault(); close(inp.value); }
      if (ev.key === 'Tab') { const f = [...d.querySelectorAll('input,button')]; const i = f.indexOf(TR.activeElement || document.activeElement); if (ev.shiftKey && i <= 0) { ev.preventDefault(); f[f.length - 1].focus(); } else if (!ev.shiftKey && i === f.length - 1) { ev.preventDefault(); f[0].focus(); } } });
    TR.append(d); setTimeout(() => (inp || d.querySelector('.ok')).focus(), 30); };
  window.confirm = function (msg) {
    if (passC > 0) { passC--; return true; }
    // escolhas com dois resultados ("OK: usar os da nuvem / Cancelar: substituir") e confirmações no meio da importação de arquivo
    // não podem virar "não" + refazer: ficam com a janela antiga
    if (!replayable() || /OK:|arquivo/.test(String(msg))) return NC(msg);
    const a = act; act = null; const [t, b] = split(msg), ok = okLabel(t);
    open(t, b, ok, DNG.test(ok), null, (v) => { if (v) { passC = 1; replay(a); setTimeout(() => { passC = 0; }, 1500); } });
    return false; };
  window.prompt = function (msg, def) {
    if (passP != null) { const v = passP; passP = null; return v; }
    if (!replayable()) return NP(msg, def);
    const a = act; act = null; const [t, b] = split(msg);
    open(t, b, 'Salvar', false, def == null ? '' : String(def), (v) => { if (v != null && v !== true) { passP = String(v); replay(a); setTimeout(() => { passP = null; }, 1500); } });
    return null; };
  window.alert = function (msg) { try { sessionStorage.setItem('lv.alert', String(msg)); setTimeout(() => { try { sessionStorage.removeItem('lv.alert'); } catch {} }, 5000); } catch {} try { toast(String(msg)); } catch { NA(msg); } };
  // aviso que veio logo antes de um recarregamento (ex.: conta excluída)
  try { const m = sessionStorage.getItem('lv.alert'); if (m) { sessionStorage.removeItem('lv.alert'); setTimeout(() => { try { toast(m); } catch {} }, 1200); } } catch {}
  // o Sair (w2) chama logout() com confirm liberado: continua funcionando, porque ele troca window.confirm só durante a chamada
}
