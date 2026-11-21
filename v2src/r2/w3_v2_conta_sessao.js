// Conta e sessão (teste de conta nova, Bia, 20/11). Causa comum dos vazamentos entre contas (itens 1, 5, 6, 9, 10): sair só
// tirava o token e meia dúzia de chaves; o resto (contagem de amizades v3.am, cache de perfis, perfil, avatar, e-mail do último
// login, aba aberta…) ficava no aparelho e aparecia para a próxima conta. Agora:
// - Sair e Excluir conta apagam tudo do usuário no aparelho (ficam só tema, som e dicas de instalação) e voltam para o login,
//   com o campo vazio e um aviso ("Você saiu da conta" / "Sua conta foi excluída").
// - Entrar com outra conta neste aparelho: apaga o que era da anterior e recarrega antes de mostrar qualquer coisa.
// - Ajustes e Editar perfil não dizem "Sem @usuário ainda" enquanto o perfil carrega (mostram "Carregando…" e se refazem).
// - Contagem de amizades só vale quando a lista chegou de verdade (SOC.frOk); antes disso não aparece número.
// - Confirmações de Sair e Excluir conta em diálogo próprio, com título e botões (substitui o w2 e a folha herdada do Diário).
// - Cadastro: erros em linha, todos de uma vez; nome e @ obrigatórios; aviso quando o @ é ajustado; senha fraca barrada
//   (mesma regra da API) com medidor; olho para mostrar/esconder a senha (login, cadastro, trocar senha).
// - Trocar senha em Ajustes › Conta e dados (PUT /v1/me/password; desconecta os outros aparelhos).
// - Importar histórico: prévia antes, resenhas privadas por padrão, resumo no fim e "Desfazer importação".
const LV_KEEP = new Set(['bear.theme', 'lv.temaSis', 'bear.sound', 'lv.instPop', 'lv.capaDica', 'bear.covers']);
function lvWipeUser(keepAuth) {
  const keep = {}; try { if (keepAuth) ['bear.api', 'bear.owner', 'bear.profile'].forEach((k) => { const v = localStorage.getItem(k); if (v != null) keep[k] = v; }); } catch {}
  try { const api = (apiCfg && apiCfg.api) || ''; Object.keys(localStorage).forEach((k) => { if (!LV_KEEP.has(k)) localStorage.removeItem(k); }); if (!keepAuth && api && api !== DEFAULT_API) localStorage.setItem(API_CFG, JSON.stringify({ api })); } catch {}
  try { Object.entries(keep).forEach(([k, v]) => localStorage.setItem(k, v)); } catch {}
  try { Object.keys(sessionStorage).forEach((k) => { if (!['seeded', 'lv.saiu', 'lv.excluida'].includes(k)) sessionStorage.removeItem(k); }); } catch {}
}
// o app grava estado ao sair da página (pagehide/visibilitychange); a limpeza roda de novo depois disso
let lvWiping = null;
window.addEventListener('pagehide', () => { if (lvWiping !== null) lvWipeUser(lvWiping); });
document.addEventListener('visibilitychange', () => { if (lvWiping !== null && document.visibilityState === 'hidden') lvWipeUser(lvWiping); });
{ const st = document.createElement('style'); st.textContent = `
.gate{z-index:2147483000!important}
#auth-gate input{line-height:1.5!important;min-height:2.75rem}
#auth-gate .form > p.hint.lv-msg{min-height:1.35em;margin:.25rem 0 .55rem}
#auth-gate .form > p.hint.lv-bad{color:#c0392b;font-weight:800}
.lv-gmsg{margin:.2rem 0 .6rem;padding:.6rem .75rem;border-radius:12px;background:color-mix(in srgb,var(--acc) 12%,var(--panel));color:var(--ink);font-weight:800;font-size:.9rem}
.lv-ferr{display:block;margin-top:.3rem;color:#c0392b;font-size:.8rem;font-weight:800;line-height:1.3}
.lv-fok{display:block;margin-top:.3rem;color:var(--ink-2);font-size:.8rem;font-weight:700;line-height:1.3}
.lv-bad-in{border-color:#c0392b!important}
.lv-pw{position:relative;display:block}.lv-pw input{padding-right:3rem!important;width:100%;box-sizing:border-box}
.lv-eye{position:absolute;right:2px;top:50%;transform:translateY(-50%);width:40px;height:40px;display:grid;place-items:center;border:0;background:none;color:var(--ink-2);cursor:pointer;padding:0;border-radius:10px}
.lv-eye svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.lv-str{display:flex;align-items:center;gap:.5rem;margin-top:.35rem;font-size:.78rem;font-weight:800;color:var(--ink-2)}.lv-str i{flex:1;height:5px;border-radius:9px;background:var(--line);overflow:hidden;position:relative}
.lv-str i::after{content:"";position:absolute;inset:0 auto 0 0;width:var(--w,0%);background:var(--c,#c0392b);border-radius:9px;transition:width .2s}
.lvdlg-bg{position:fixed;inset:0;z-index:2147483100;background:rgba(10,8,20,.5);display:grid;place-items:center;padding:1rem}
.lvdlg{width:min(420px,100%);max-height:90vh;overflow:auto;background:var(--panel,#fff);color:var(--ink,#222);border:1px solid var(--line,#ddd);border-radius:20px;padding:1.1rem 1.1rem 1rem;box-shadow:0 18px 50px rgba(0,0,0,.35);font:inherit}
.lvdlg h2{margin:0 0 .45rem;font-size:1.15rem;line-height:1.25}.lvdlg p{margin:.35rem 0;font-size:.92rem;line-height:1.4;color:var(--ink-2,#555)}.lvdlg ul{margin:.3rem 0 .5rem 1.1rem;padding:0;font-size:.9rem;color:var(--ink-2,#555)}
.lvdlg label{display:block;margin:.6rem 0 0;font-size:.85rem;font-weight:800;color:var(--ink,#222)}.lvdlg input[type=text],.lvdlg input[type=password]{display:block;width:100%;box-sizing:border-box;margin-top:.3rem;min-height:2.75rem;border:1.5px solid var(--line,#ccc);border-radius:12px;padding:.5rem .75rem;font:inherit;background:var(--bg,#fff);color:var(--ink,#222)}
.lvdlg .lvck{display:flex;gap:.6rem;align-items:flex-start;margin:.7rem 0 .2rem;font-weight:800}.lvdlg .lvck input{width:22px;height:22px;margin:0;flex:none}
.lvdlg .lvck small{display:block;font-weight:600;color:var(--ink-2,#555)}
.lvdlg .acts{display:grid;gap:.5rem;margin-top:1rem}.lvdlg .acts button{min-height:46px;border-radius:14px;border:1.5px solid var(--line,#ccc);background:none;color:var(--ink,#222);font:inherit;font-weight:900;cursor:pointer}
.lvdlg .acts .pri{background:var(--acc,#c96);border-color:transparent;color:var(--on-acc,#fff)}.lvdlg .acts .dng{background:#c0392b;border-color:transparent;color:#fff}.lvdlg .acts button:disabled{opacity:.45;cursor:default}
.lvdlg .soft{min-height:42px;width:100%;margin:.4rem 0;border-radius:12px;border:1.5px dashed var(--line,#ccc);background:none;color:var(--ink,#222);font:inherit;font-weight:800}
.lvdlg .lvnums{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:.4rem;margin:.6rem 0}.lvdlg .lvnums span{display:grid;justify-items:center;border:1px solid var(--line,#ddd);border-radius:12px;padding:.45rem .2rem}.lvdlg .lvnums b{font-size:1.15rem}.lvdlg .lvnums small{font-size:.72rem;color:var(--ink-2,#555);font-weight:700}
@media (min-width:640px){#tabbar,.gtop{max-width:560px!important;margin-left:auto!important;margin-right:auto!important;left:0!important;right:0!important}.wrap,#lista{max-width:560px!important;margin-left:auto!important;margin-right:auto!important}#shelflist,#editor{max-width:560px!important;margin-left:auto!important;margin-right:auto!important;left:0!important;right:0!important}}
#shelflist:has(.sl-body > .ct-mode):not(:has(.ct-book, .au-hero, .bp-hero)) .sl-body > .sl-top .sl-back{display:none!important}
#shelflist:has(.v8nc) .bp-net{display:none!important}
`; document.head.append(st); TR.append(st.cloneNode(true)); }

// ---------- diálogo do app (fora do shadow root, por cima de tudo) ----------
function lvDialog({ title, html, actions, onOpen, label }) {
  const prev = document.activeElement, bg = document.createElement('div'); bg.className = 'lvdlg-bg';
  bg.innerHTML = `<div class="lvdlg" role="dialog" aria-modal="true" aria-label="${esc(label || title)}"><h2>${esc(title)}</h2>${html || ''}<div class="acts"></div></div>`;
  const box = bg.firstElementChild, acts = box.querySelector('.acts');
  const close = () => { bg.remove(); document.removeEventListener('keydown', key, true); try { prev && prev.focus && prev.focus(); } catch {} };
  const key = (e) => { if (e.key === 'Escape') { e.preventDefault(); close(); } if (e.key === 'Tab') { const f = [...box.querySelectorAll('button:not(:disabled),input,a[href]')].filter((x) => x.offsetParent !== null); if (!f.length) return; const i = f.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); } } };
  (actions || []).forEach((a) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = a.label; if (a.cls) b.className = a.cls; if (a.id) b.id = a.id; b.addEventListener('click', () => { if (a.fn && a.fn(b, close) === false) return; if (!a.keep) close(); }); acts.append(b); });
  bg.addEventListener('click', (e) => { if (e.target === bg) close(); });
  document.addEventListener('keydown', key, true); document.body.append(bg);
  try { lvEyes(box); } catch {}
  if (onOpen) onOpen(box, close);
  setTimeout(() => { const f = box.querySelector('input') || acts.querySelector('button'); f && f.focus(); }, 30);
  return { box, close };
}

// ---------- sair e excluir ----------
logout = async function () {
  try { if (syncMeta.dirty && connected()) await Promise.race([push(), new Promise((ok) => setTimeout(ok, 4000))]); } catch {}
  apiCfg = {}; try { sessionStorage.setItem('lv.saiu', '1'); } catch {} lvWiping = false; lvWipeUser(false);
  location.replace(location.pathname);
};
TR.addEventListener('click', (ev) => {
  const b = ev.target.closest && ev.target.closest('#aj-out'); if (!b) return;
  ev.stopPropagation(); ev.preventDefault();
  lvDialog({ title: 'Sair da conta?', html: '<p>Seus livros e leituras continuam guardados na sua conta. Para voltar, entre com seu e-mail ou @usuário.</p><p>Neste aparelho, nada da conta fica visível depois de sair.</p>',
    actions: [{ label: 'Sair', cls: 'pri', keep: true, fn: (btn) => { btn.disabled = true; btn.textContent = 'Saindo…'; logout(); return false; } }, { label: 'Cancelar' }] });
}, true);
deleteAccountSheet = function () {
  if (!connected()) return;
  const h = socialProfile && socialProfile.handle ? ' @' + esc(socialProfile.handle) : '';
  lvDialog({ title: 'Excluir conta', html: `<p>Isso apaga <b>para sempre</b> a sua conta${h} e tudo que está nela:</p><ul><li>biblioteca, leituras, metas e histórico</li><li>avaliações, comentários, curtidas e ecos</li><li>amizades, leituras conjuntas, indicações e mensagens</li></ul><p>Não dá para desfazer.</p>
    <button type="button" class="soft" id="lvdl-exp">Baixar meus dados antes</button><label>Para confirmar, escreva EXCLUIR<input type="text" id="lvdl-in" autocomplete="off" autocapitalize="characters" placeholder="EXCLUIR"></label><span class="lv-ferr" id="lvdl-err" hidden></span>`,
    actions: [{ label: 'Excluir minha conta para sempre', cls: 'dng', id: 'lvdl-go', keep: true, fn: (btn) => {
      btn.disabled = true; btn.textContent = 'Excluindo…';
      (async () => { let r = null; try { r = await sapi('DELETE', '/v1/me', { confirm: 'EXCLUIR' }); } catch {}
        if (!r || r.status !== 200) { btn.disabled = false; btn.textContent = 'Excluir minha conta para sempre'; const e = document.getElementById('lvdl-err'); if (e) { e.hidden = false; e.textContent = 'Não consegui excluir agora. Confira a internet e tente de novo.'; } return; }
        try { clearTimeout(syncTimer); } catch {} apiCfg = {}; try { sessionStorage.setItem('lv.excluida', '1'); } catch {} lvWiping = false; lvWipeUser(false); location.replace(location.pathname); })();
      return false; } }, { label: 'Cancelar' }],
    onOpen: (box) => { const inp = box.querySelector('#lvdl-in'), go = box.querySelector('#lvdl-go'); go.disabled = true;
      inp.addEventListener('input', () => { go.disabled = inp.value.trim().toUpperCase() !== 'EXCLUIR'; });
      box.querySelector('#lvdl-exp').addEventListener('click', () => { try { document.getElementById('export').click(); } catch {} }); } });
};
// aviso no login depois de sair ou excluir; e garante que nada da conta anterior ficou na memória (biblioteca, perfil)
{ let f = '';
  try { if (sessionStorage.getItem('lv.excluida') || sessionStorage.getItem('lv.saiu')) { lvWipeUser(false); try { resetLocal(); } catch {} try { socialProfile = undefined; socialStats = {}; SOC.fr = { friends: [], incoming: [], outgoing: [] }; SOC.ok = false; SOC.frOk = false; } catch {} lvWipeUser(false); } } catch {} try { f = sessionStorage.getItem('lv.excluida') ? 'Sua conta foi excluída. Que bom que você leu com a gente.' : sessionStorage.getItem('lv.saiu') ? 'Você saiu da conta.' : ''; sessionStorage.removeItem('lv.excluida'); sessionStorage.removeItem('lv.saiu'); } catch {}
  const g = document.getElementById('auth-gate'); if (f && g) { const p = document.createElement('p'); p.className = 'lv-gmsg'; p.setAttribute('role', 'status'); p.textContent = f; const h3 = g.querySelector('h3'); if (h3) h3.before(p); } }
// entrou com outra conta neste aparelho (token venceu e outra pessoa entrou): apaga o que era da anterior e recarrega
{ let seen = ''; try { seen = (localStorage.getItem('bear.owner') || '').toLowerCase(); } catch {}
  const _p = pull; pull = async function () {
    if (connected()) { const now = String(apiCfg.email || '').toLowerCase(); if (seen && now && seen !== now) { seen = now; lvWiping = true; lvWipeUser(true); location.reload(); return; } if (now) seen = now; }
    return _p.apply(this, arguments); }; }

// ---------- amizades: só com a lista de verdade ----------
{ const _s = sapi; sapi = async function (m, p) { const r = await _s.apply(this, arguments); try { if (m === 'GET' && p === '/v1/friends' && r && r.status === 200) SOC.frOk = true; } catch {} return r; }; }
// Comunidade de quem ainda não tem amizades abre em Todos (item 18)
{ const semAmz = () => SOC.frOk && !((SOC.fr && SOC.fr.friends) || []).length;
  document.addEventListener('click', (ev) => { const b = ev.composedPath && ev.composedPath()[0]; if (b && b.closest && b.closest('[data-a=v6tab]') && S.v6) S.v6.lvUser = 1; }, true);
  const _gt = goTab; goTab = function (tab) { try { if (tab === 'comunidade' && semAmz()) { if (!S.v6) S.v6 = { f: 'todos', open: {}, list: [] }; else if (!S.v6.lvUser && S.v6.f === 'amigos') S.v6.f = 'todos'; } } catch {} return _gt.apply(this, arguments); };
  // a lista de amizades ainda não chegou: busca agora e troca para Todos se não houver nenhuma (uma vez; respeita a escolha da pessoa)
  const _gt2 = goTab; goTab = function (tab) { const r = _gt2.apply(this, arguments); try { if (tab === 'comunidade' && connected() && !SOC.frOk) sapi('GET', '/v1/friends').then((x) => { if (!x || x.status !== 200 || !x.data || !Array.isArray(x.data.friends)) return; SOC.fr = { friends: x.data.friends, incoming: x.data.incoming || [], outgoing: x.data.outgoing || [] };
      if (!x.data.friends.length && S.v6 && !S.v6.lvUser && S.v6.f === 'amigos' && S.tab === 'comunidade') { S.v6.f = 'todos'; S.v6.lvUser = 1; try { v6Paint(); v6Load(v6Sc('todos')); } catch {} } }).catch(() => {}); } catch {} return r; }; }

// ---------- Ajustes / Editar perfil: sem "Sem @usuário" enquanto o perfil carrega; Trocar senha ----------
{ const _da = drawAjustes; drawAjustes = function (box) {
  const r = _da.apply(this, arguments);
  try {
    if (connected() && !(socialProfile && socialProfile.handle) && !SOC.semHandle) {
      box.querySelectorAll('small, b').forEach((n) => { if (/^(Sem @usuário ainda|Crie seu @usuário primeiro|Criar meu @usuário|Para ter amigos e aparecer na busca)$/.test(n.textContent.trim())) n.textContent = 'Carregando…'; });
      box.querySelectorAll('#aj-handle, #aj-priv').forEach((b) => { b.disabled = true; b.setAttribute('aria-busy', 'true'); });
      if (!box.__lvWait) { box.__lvWait = 1; (async () => { for (let i = 0; i < 3 && !(socialProfile && socialProfile.handle) && !SOC.semHandle; i++) { try { await loadProfile(); } catch {} if (!(socialProfile && socialProfile.handle) && !SOC.semHandle) await new Promise((ok) => setTimeout(ok, 1200 * (i + 1))); }
        box.__lvWait = 0; if (box.isConnected) { try { drawAjustes(box); } catch {} } })(); }
    }
    if (connected() && !box.querySelector('#aj-pw')) {
      const anchor = box.querySelector('#aj-exp') || box.querySelector('#aj-sync');
      if (anchor) { const b = document.createElement('button'); b.type = 'button'; b.className = anchor.className || 'aj-row'; b.id = 'aj-pw'; b.innerHTML = '<span><b>Trocar senha</b><small>pede a senha atual · os outros aparelhos saem</small></span>›'; b.addEventListener('click', lvChangePw); anchor.before(b); }
    }
  } catch (e) { console.warn('ajustes conta', e); }
  return r; }; }
function lvChangePw() {
  lvDialog({ title: 'Trocar senha', html: '<label>Senha atual<input type="password" id="lvpw-cur" autocomplete="current-password"></label><span class="lv-ferr" id="lvpw-ecur" hidden></span><label>Nova senha<input type="password" id="lvpw-new" autocomplete="new-password"></label><span class="lv-str" id="lvpw-str" hidden><i></i><span></span></span><span class="lv-ferr" id="lvpw-enew" hidden></span><p>Depois de trocar, os outros aparelhos vão pedir para entrar de novo.</p>',
    actions: [{ label: 'Trocar senha', cls: 'pri', keep: true, fn: (btn, close) => {
      const box = btn.closest('.lvdlg'), cur = box.querySelector('#lvpw-cur'), nw = box.querySelector('#lvpw-new'), ec = box.querySelector('#lvpw-ecur'), en = box.querySelector('#lvpw-enew');
      ec.hidden = en.hidden = true; let bad = false;
      if (!cur.value) { ec.hidden = false; ec.textContent = 'Digite a senha atual.'; bad = true; }
      const w = lvWeak(nw.value); if (w) { en.hidden = false; en.textContent = w; bad = true; } else if (nw.value === cur.value) { en.hidden = false; en.textContent = 'A nova senha precisa ser diferente da atual.'; bad = true; }
      if (bad) return false;
      btn.disabled = true; btn.textContent = 'Trocando…';
      (async () => { let r = null; try { r = await sapi('PUT', '/v1/me/password', { current: cur.value, password: nw.value }); } catch {}
        btn.disabled = false; btn.textContent = 'Trocar senha';
        if (r && r.status === 200 && r.data && r.data.token) { apiCfg.token = r.data.token; saveCfg(); close(); toast('Senha trocada'); return; }
        if (r && r.status === 403) { ec.hidden = false; ec.textContent = 'Senha atual incorreta.'; cur.focus(); return; }
        if (r && r.status === 400) { en.hidden = false; en.textContent = ((r.data && r.data.issues && r.data.issues[0] && r.data.issues[0].message) || 'Escolha uma senha mais forte.'); return; }
        en.hidden = false; en.textContent = 'Não consegui trocar agora. Tente de novo.'; })();
      return false; } }, { label: 'Cancelar' }],
    onOpen: (box) => { const nw = box.querySelector('#lvpw-new'); lvStrength(nw, box.querySelector('#lvpw-str')); } });
}

// ---------- senha: regra (igual à API), medidor e olho ----------
function lvWeak(pw) {
  pw = String(pw || ''); const p = pw.toLowerCase();
  if (pw.length < 8) return 'Use 8 ou mais caracteres.';
  if (/^\d+$/.test(pw)) return 'Misture letras e números (só números é fácil de adivinhar).';
  if (new Set(pw).size === 1) return 'Evite repetir o mesmo caractere.';
  const seq = '0123456789abcdefghijklmnopqrstuvwxyz', rev = [...seq].reverse().join('');
  if (seq.includes(p) || rev.includes(p) || 'qwertyuiopasdfghjklzxcvbnm'.includes(p)) return 'Evite sequências como 12345678 ou abcdefgh.';
  if (['password', 'senha123', 'senha1234', 'qwertyui', 'qwerty123', 'abcdefgh', 'abc12345', 'iloveyou', 'livroverso', 'mudar123', 'admin123', '11111111', 'aaaaaaaa', 'password1', 'senhasenha'].includes(p)) return 'Essa senha é muito comum. Escolha outra.';
  return null;
}
function lvStrength(inp, out) {
  if (!inp || !out) return; const bar = out.querySelector('i'), txt = out.querySelector('span');
  const upd = () => { const v = inp.value; if (!v) { out.hidden = true; return; } out.hidden = false; const w = lvWeak(v), cls = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(v)).length;
    const lv = w ? 0 : v.length >= 12 || cls >= 3 ? 2 : 1; bar.style.setProperty('--w', ['30%', '65%', '100%'][lv]); bar.style.setProperty('--c', ['#c0392b', '#d68910', '#2e8b57'][lv]); txt.textContent = ['Senha fraca', 'Senha boa', 'Senha forte'][lv]; };
  inp.addEventListener('input', upd); upd();
}
const LV_EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const LV_EYE_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12S6 5.5 12 5.5c2 0 3.7.7 5.1 1.7M21.5 12S18 18.5 12 18.5c-2 0-3.7-.7-5.1-1.7"/><path d="M4 20 20 4"/></svg>';
function lvEyes(root) {
  root.querySelectorAll('input[type=password]:not([data-lveye])').forEach((inp) => {
    inp.dataset.lveye = '1'; const w = document.createElement('span'); w.className = 'lv-pw'; inp.before(w); w.append(inp);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'lv-eye'; b.setAttribute('aria-label', 'Mostrar senha'); b.setAttribute('aria-pressed', 'false'); b.innerHTML = LV_EYE; w.append(b);
    b.addEventListener('pointerdown', (e) => e.preventDefault()); b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', (e) => { e.preventDefault(); const show = inp.type === 'password', s = inp.selectionStart, en = inp.selectionEnd; inp.type = show ? 'text' : 'password';
      b.setAttribute('aria-label', show ? 'Esconder senha' : 'Mostrar senha'); b.setAttribute('aria-pressed', String(show)); b.innerHTML = show ? LV_EYE_X : LV_EYE;
      const back = () => { try { inp.focus(); if (s != null) inp.setSelectionRange(s, en); } catch {} }; back(); requestAnimationFrame(back); setTimeout(back, 0); });
  });
}

// ---------- cadastro e login: validação em linha, @ ajustado, olho, mensagem de erro em vermelho ----------
{ const clean = (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9_.]+/g, '').slice(0, 20);
  const isReg = (f) => { const n = f.querySelector('input[name=name]'); return !!(n && n.closest('label') && !n.closest('label').classList.contains('hidden')); };
  const errEl = (inp) => { const lb = inp.closest('label'); let e = lb && lb.nextElementSibling; if (!e || !e.classList.contains('lv-ferr')) { e = document.createElement('span'); e.className = 'lv-ferr'; e.hidden = true; lb ? lb.after(e) : inp.after(e); } return e; };
  const setErr = (inp, m) => { if (!inp) return; const e = errEl(inp); e.hidden = !m; e.textContent = m || ''; inp.classList.toggle('lv-bad-in', !!m); if (m) inp.setAttribute('aria-invalid', 'true'); else inp.removeAttribute('aria-invalid'); if (m) inp.setAttribute('aria-describedby', 'lvfe-' + inp.name); e.id = 'lvfe-' + inp.name; };
  const prep = (g) => {
    const f = g.querySelector('form'); if (!f || f.dataset.lv) return; f.dataset.lv = '1'; f.noValidate = true; lvEyes(f);
    const sub = f.querySelector('button[type=submit]'), msg = sub && sub.previousElementSibling && sub.previousElementSibling.matches('p.hint') ? sub.previousElementSibling : null;
    if (msg) { msg.classList.add('lv-msg'); msg.setAttribute('role', 'status'); msg.setAttribute('aria-live', 'polite'); new MutationObserver(() => { msg.classList.toggle('lv-bad', /incorret|precisa|Informe|Preencha|já tem conta|Muitas|Não consegui|Sem conexão|não parece|Escolha|Diga/.test(msg.textContent)); }).observe(msg, { childList: true, characterData: true, subtree: true }); }
    const pw = f.querySelector('input[name=password]'); if (pw) { const s = document.createElement('span'); s.className = 'lv-str'; s.hidden = true; s.innerHTML = '<i></i><span></span>'; (pw.closest('label') || pw).after(s); lvStrength(pw, s); const upd = () => { if (!isReg(f)) s.hidden = true; }; pw.addEventListener('input', upd); f.addEventListener('click', () => setTimeout(upd, 0)); upd(); }
    f.querySelectorAll('input').forEach((i) => i.addEventListener('input', () => setErr(i, '')));
    const h = f.querySelector('input[name=handle]'); if (h) { const note = document.createElement('span'); note.className = 'lv-fok'; note.hidden = true; (h.closest('label') || h).after(note);
      let adj = false; h.addEventListener('input', () => { const raw = h.value; if (raw && clean(raw) !== raw) adj = true; if (!raw) adj = false; setTimeout(() => { note.hidden = !(adj && h.value); if (!note.hidden) note.textContent = 'Ajustamos para @' + h.value + ' (só minúsculas sem acento, números, ponto e _).'; }, 0); }, true);
      const nm = f.querySelector('input[name=name]'); if (nm) nm.addEventListener('input', () => { adj = false; note.hidden = true; }); }
  };
  const scan = () => { const g = document.getElementById('auth-gate'); if (g) prep(g); document.querySelectorAll('.sheet form').forEach((f) => { if (f.querySelector('input[name=password]')) prep(f.closest('.sheet')); }); };
  scan(); new MutationObserver(scan).observe(document.body, { childList: true });
  document.addEventListener('submit', (ev) => {
    const f = ev.target; if (!f || !f.querySelector || !f.querySelector('input[name=password]') || !(f.closest('#auth-gate') || f.closest('.sheet'))) return;
    const reg = isReg(f), em = f.querySelector('input[name=email]'), pw = f.querySelector('input[name=password]'), nm = f.querySelector('input[name=name]'), hd = f.querySelector('input[name=handle]');
    if (hd && hd.closest('label') && !hd.closest('label').classList.contains('hidden') && !reg) return; // "Escolha outro @" (conta já criada)
    const E = [];
    const ev1 = String(em && em.value || '').trim();
    if (!ev1) E.push([em, reg ? 'Informe seu e-mail.' : 'Informe seu e-mail ou @usuário.']);
    else if (reg && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ev1)) E.push([em, 'Esse e-mail não parece certo (exemplo: nome@gmail.com).']);
    if (!pw.value) E.push([pw, 'Digite a senha.']); else if (reg) { const w = lvWeak(pw.value); if (w) E.push([pw, w]); }
    if (reg) { if (!String(nm && nm.value || '').trim()) E.push([nm, 'Diga como o app deve te chamar.']); const hv = clean(hd && hd.value); if (!/^[a-z0-9_.]{3,20}$/.test(hv)) E.push([hd, 'Use de 3 a 20 letras minúsculas, números, ponto ou _.']); }
    [em, pw, nm, hd].forEach((i) => i && setErr(i, ''));
    if (E.length) { ev.preventDefault(); ev.stopImmediatePropagation(); E.forEach(([i, m]) => setErr(i, m)); try { E[0][0].focus(); } catch {} }
  }, true);
}

// ---------- importar histórico: prévia, resenhas privadas, resumo e desfazer ----------
{ const _imp = importCSV;
  importCSV = function () {
    const inp = document.createElement('input'); inp.type = 'file'; inp.accept = '.csv,text/csv';
    inp.addEventListener('change', async () => {
      const file = inp.files && inp.files[0]; if (!file) return;
      if (file.size > 5 * 1024 * 1024) return toast('Arquivo grande demais (máx. 5 MB)');
      let rows; try { rows = parseCSV(await file.text()); } catch { return toast('Não consegui ler esse arquivo'); }
      if (!rows || rows.length < 2) return toast('O arquivo está vazio');
      const H = rows[0].map((h) => normT(h)), col = (...n) => H.findIndex((h) => n.includes(h));
      const cT = col('title', 'titulo', 'livro', 'nome do livro'), cS = col('exclusive shelf', 'read status', 'status', 'estante'), cV = col('my review', 'review', 'resenha', 'comentario'), cX = col('bookshelves', 'estantes', 'tags'), cSp = col('spoiler');
      if (cT < 0) return toast('Não encontrei a coluna de título');
      S.lvSrc = H.includes('read status') ? 'StoryGraph' : H.includes('exclusive shelf') || H.includes('my review') ? 'Goodreads' : 'outro app'; // de onde veio, para o Completar histórico (Bia, 21/11)
      const C = { livros: 0, lidos: 0, lendo: 0, quero: 0, aband: 0, paus: 0, resenhas: 0, spoiler: 0 }, shelves = new Set(), ABD = /abandon|did not finish|\bdnf\b|desist|nao termin|nao conclu/;
      for (const r of rows.slice(1, 3001)) { if (!String(r[cT] || '').trim()) continue; C.livros++;
        const sh = cS >= 0 ? normT(r[cS]) : '', tg = cX >= 0 ? normT(r[cX]) : '', st = ABD.test(sh) || ABD.test(tg) ? 'aband' : /currently|lendo|reading/.test(sh) ? 'lendo' : /to read|quero|wish/.test(sh) ? 'quero' : /paus|hiberna/.test(sh) ? 'paus' : 'lidos'; C[st]++;
        if (st === 'lidos' && cV >= 0 && String(r[cV] || '').trim()) { C.resenhas++; if (cSp >= 0 && /^(true|sim|yes|1)$/i.test(String(r[cSp] || '').trim())) C.spoiler++; }
        if (cX >= 0) String(r[cX] || '').split(/[,;]/).map((x) => x.trim()).filter((x) => x && !/^(read|to-read|currently-reading|lidos?|quero ler|lendo)$/i.test(x)).forEach((x) => shelves.add(normT(x))); }
      const cell = (n, l) => n ? `<span><b>${n}</b><small>${l}</small></span>` : '';
      lvDialog({ title: 'Importar histórico', label: 'Prévia da importação',
        html: `<p>Encontrei no arquivo <b>${esc(file.name)}</b>:</p><div class="lvnums">${cell(C.livros, C.livros === 1 ? 'livro' : 'livros')}${cell(C.lidos, 'lidos')}${cell(C.lendo, 'lendo')}${cell(C.quero, 'quero ler')}${cell(C.paus, 'pausados')}${cell(C.aband, 'abandonados')}${cell(C.resenhas, C.resenhas === 1 ? 'resenha' : 'resenhas')}${cell(shelves.size, shelves.size === 1 ? 'estante' : 'estantes')}</div>
          <p>Livros que já estão na sua biblioteca são completados, sem apagar o que você preencheu.</p>
          ${C.resenhas ? `<label class="lvck"><input type="checkbox" id="lvimp-pub"><span>Publicar minhas resenhas na Comunidade<small>Desligado: as resenhas ficam só para você. Dá para publicar depois, uma a uma.${C.spoiler ? ` ${C.spoiler} ${C.spoiler === 1 ? 'vem marcada' : 'vêm marcadas'} com spoiler e ${C.spoiler === 1 ? 'fica escondida' : 'ficam escondidas'} para quem não leu.` : ''}</small></span></label>` : ''}`,
        actions: [{ label: 'Importar', cls: 'pri', fn: (btn) => { const pub = !!(btn.closest('.lvdlg').querySelector('#lvimp-pub') || {}).checked; lvRunImport(file, pub); } }, { label: 'Cancelar' }] });
    });
    inp.click();
  };
  function lvRunImport(file, pub) {
    const snap = JSON.stringify(db), before = new Map((db.library || []).map((e) => [e.id, (e.review && e.review.texto) || '']));
    const n0 = (db.library || []).length; S.lvImp = { pub, snap, before, n0 };
    const pc = HTMLInputElement.prototype.click;
    HTMLInputElement.prototype.click = function () { if (this.type === 'file') { HTMLInputElement.prototype.click = pc; try { const dt = new DataTransfer(); dt.items.add(file); this.files = dt.files; } catch { S.lvImp = null; return pc.call(this); } this.dispatchEvent(new Event('change')); return; } return pc.call(this); };
    try { _imp(); } finally { HTMLInputElement.prototype.click = pc; }
  }
  const _ai = window.lvAfterImport;
  window.lvAfterImport = (n) => {
    const I = S.lvImp; S.lvImp = null;
    const touched = [];
    if (I) { for (const e of (db.library || [])) if (!I.before.has(e.id) && !e.impSrc) e.impSrc = S.lvSrc || 'outro app';
      // "Date Added" é quando a pessoa adicionou o livro no outro app, não quando começou a ler (teste real 21/11, item 13)
      for (const e of (db.library || [])) if (!I.before.has(e.id) && e.startedAt && e.addedAt && e.startedAt === e.addedAt) delete e.startedAt;
      for (const e of (db.library || [])) { const t = (e.review && e.review.texto) || ''; if (t && t !== I.before.get(e.id)) { touched.push(e); if (!I.pub) e.review.share = false; else delete e.review.share; } } try { save(); } catch {} if (I.pub) touched.forEach((e) => { try { publishReview(e); } catch {} }); }
    // um diálogo por vez (teste real 21/11, item 2): no fluxo com prévia, o resumo já leva ao Completar histórico; a folha
    // "Faltou completar…" antiga só aparece em importação fora desse fluxo
    if (!I) { try { if (_ai) _ai(n); } catch (err) { console.warn(err); } return; }
    S.ppImpAt = Date.now();
    const novos = Math.max(0, (db.library || []).length - I.n0), atual = Math.max(0, n - novos);
    let miss = 0; try { const c = fxCount(); miss = c.ini + c.fim + c.pag; } catch {}
    const inFirst = (() => { try { const v = $('#shelflist'); return !!(v && !v.hidden && v.querySelector('#gs-hist')); } catch { return false; } })();
    setTimeout(() => lvDialog({ title: 'Importação concluída', html: `<div class="lvnums"><span><b>${novos}</b><small>${novos === 1 ? 'livro novo' : 'livros novos'}</small></span><span><b>${atual}</b><small>atualizados</small></span><span><b>${touched.length}</b><small>${touched.length === 1 ? 'resenha' : 'resenhas'}</small></span></div><p>${touched.length ? (I.pub ? 'As resenhas foram publicadas na Comunidade.' : 'As resenhas ficaram só para você.') : ''} ${miss ? (inFirst ? 'Datas, páginas e notas que faltaram você confere depois, em Completar histórico.' : 'Alguns vieram sem data, páginas ou nota.') : ''}</p>`,
      actions: [miss && !inFirst ? { label: 'Conferir minhas leituras', cls: 'pri', fn: () => { setTimeout(() => { try { openFixReads(); } catch (e) { console.warn(e); } }, 60); } } : { label: inFirst ? 'Continuar' : 'Ver minha Biblioteca', cls: 'pri', fn: () => { if (!inFirst) { try { goTab('estante'); } catch {} } } }, { label: 'Desfazer importação', fn: () => {
        try { if (I.pub) touched.forEach((e) => { sapi('DELETE', `/v1/reviews/${encodeURIComponent(e.id)}`).catch(() => {}); }); } catch {}
        db = JSON.parse(I.snap); S.gsHist = ''; try { save(); refresh(); } catch {} try { S.listRedraw && S.listRedraw(); } catch {} toast('Importação desfeita'); } }] }), 350);
  };
}

// ---------- textos e detalhes do primeiro acesso ----------
// tour: explica órbita e eco e não manda usar um cartão que a conta nova ainda não tem (itens 32)
try { for (const t of TOUR) { if (t[1] === 'Hoje') t[2] = 'Seu dia de leitura: o livro que você está lendo, o prazo, a órbita (os dias seguidos em que você leu), a meta e a Pergunta do dia. Quando começar um livro, marque a página pelo cartão dele.';
  if (t[1] === 'Ler') t[2] = 'Comece uma sessão de leitura com cronômetro e luz. Os ecos são recados de quem leu a mesma página, e só aparecem quando você chega nela.'; } } catch {}
// "Catálogo B.E.A.R" (nome interno) na lista de resultados vira "Livroverso" (item 14)
{ const fix = (root) => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); for (let n; (n = w.nextNode());) if (n.nodeValue.includes('Catálogo B.E.A.R')) n.nodeValue = n.nodeValue.split('Catálogo B.E.A.R').join('Livroverso'); };
  let tm = 0; const run = () => { tm = 0; try { fix(document.body); fix(TR); } catch {} };
  const mo = new MutationObserver(() => { if (!tm) tm = setTimeout(run, 120); }); mo.observe(document.body, { childList: true, subtree: true }); mo.observe(TR, { childList: true, subtree: true }); }
// Para você: sem títulos/autores em outro alfabeto quando há opções em português, e sem os livros do Top 3 (itens 13 e 15)
{ const _tr = tasteRecs; tasteRecs = async function () { const L = await _tr.apply(this, arguments); try {
    const t = tasteOf() || {}, top = (t.books || []).map((b) => normT(String(b.title || '').split(/[:(]/)[0])).filter(Boolean);
    const alien = (s) => /[Ͱ-ϿЀ-ӿ֐-ۿ฀-๿぀-ヿ㐀-鿿가-힯]/.test(String(s || ''));
    let out = (L || []).filter((x) => { const n = normT(String(x.title || '').split(/[:(]/)[0]); return !top.some((k) => k && (n === k || n.startsWith(k) || k.startsWith(n))); });
    const lat = out.filter((x) => !alien(x.title) && !alien(x.author)); if (lat.length >= 6) out = lat;
    return out; } catch { return L; } }; }
// sessão: o texto "Sessão de X min · N páginas" acompanha a página digitada (item 28)
// (reteste da noite, 21/11: ainda ficava em "0 páginas") a contagem vem da página escolhida, ao digitar, ao deslizar e nos botões − e +
{ const upd = (root) => { try { const p = root.querySelector('#v4sesn'); if (!p) return; const pg0 = Number(p.dataset.pg0); const i = root.querySelector('#v4pgv'), r = root.querySelector('#v4upr');
    const raw = i ? String(i.value) : ''; if (/%|:/.test(raw)) return; let v = Number(raw.replace(/\D/g, '')); if (!raw && r) v = Number(r.value); if (!Number.isFinite(pg0) || !Number.isFinite(v)) return;
    const n = Math.max(0, v - pg0), txt = '· ' + n + (n === 1 ? ' página.' : ' páginas.'); const nt = p.textContent.replace(/· \d+ páginas?\./, txt); if (nt !== p.textContent) p.textContent = nt; } catch {} };
  document.addEventListener('input', (ev) => { const i = ev.composedPath && ev.composedPath()[0]; if (!i || (i.id !== 'v4pgv' && i.id !== 'v4upr')) return; const root = i.getRootNode(); if (i.id === 'v4upr') setTimeout(() => upd(root), 0); else upd(root); }, true);
  document.addEventListener('click', (ev) => { const b = ev.composedPath && ev.composedPath()[0]; const x = b && b.closest && b.closest('[data-a=ust]'); if (x) { const root = x.getRootNode(); setTimeout(() => upd(root), 30); } }, true); }
// perfil: as páginas contam também o que você já leu dos livros em andamento (item 19)
{ const _ms = myStatsSnap; myStatsSnap = function () { const r = _ms.apply(this, arguments); try { const extra = lib().filter((e) => e.status !== 'LIDO' && e.status !== 'QUERO').reduce((a, e) => { let p = 0; try { p = readingInfo(e).now || e.currentPage || 0; } catch { p = e.currentPage || 0; } return a + (Number(p) || 0); }, 0); if (r && typeof r.paginas === 'number') r.paginas += extra; } catch {} return r; }; }
