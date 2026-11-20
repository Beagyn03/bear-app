// Lembrete do prazo (Bia, 16/11): no "Quando quer terminar?", "Me lembrar todo dia às …". O app pede permissão de notificação,
// inscreve o aparelho (Web Push) e manda à API o livro, o prazo, a página e a hora. A API avisa uma vez por dia:
// "Hoje faltam 42 páginas de Nunca Minta para terminar sábado." Tocar abre o app no "Atualizar leitura".
const pushOk = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
const b64u = (s) => { const p = '='.repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from([...b].map((c) => c.charCodeAt(0))); };
async function pushSubscribe() {
  if (!pushOk()) throw new Error('sem suporte');
  const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('negado');
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) { const k = await sapi('GET', '/v1/push/key'); if (k.status !== 200 || !k.data) throw new Error('chave'); sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(k.data.key) }); }
  const j = sub.toJSON(); const r = await sapi('POST', '/v1/push/subscribe', { endpoint: j.endpoint, keys: j.keys });
  if (r.status !== 200) throw new Error('inscrição');
}
const reminderBody = (e) => { const i = readingInfo(e), total = i.total || Number(e.totalPages) || 0; return total ? { title: String(e.title).slice(0, 200), dueAt: e.dueAt, total, page: Math.min(total, (() => { try { const h = dueToday(e); return h ? h.start : (i.now || 0); } catch { return i.now || 0; } })()), hour: e.remind.hour, minute: e.remind.minute || 0, tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo', off: (e.dueOff || []).slice(0, 7) } : null; };
async function reminderSync(e) { try { if (!connected()) return; if (!e || !e.remind || !e.dueAt || e.status !== 'LENDO') { await sapi('DELETE', '/v1/me/reminder'); return; } const b = reminderBody(e); if (b) { const r = await sapi('PUT', '/v1/me/reminder', b); if (r && r.status >= 300) return; e.remind.sent = b.page + '|' + b.dueAt + '|' + b.hour + ':' + b.minute + '|' + b.off.join(''); save(); } } catch {} }
// opção no "Quando quer terminar?"
{ const _ds = dueSheet; dueSheet = function (e) {
  const r = _ds.apply(this, arguments);
  try {
    const wrap = [...document.querySelectorAll('body > .sheet')].pop(), f = wrap && wrap.querySelector('form'); if (!f || !f.querySelector('input[name=due]')) return r;
    const hhmm = (h, m) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'), times = []; for (let h = 6; h <= 23; h++) for (const m of [0, 15, 30, 45]) times.push([h, m]); const cur = e.remind ? hhmm(e.remind.hour, e.remind.minute || 0) : '20:00';
    const box = document.createElement('div'); box.style.cssText = 'display:grid;gap:.35rem;border:1px solid var(--line);border-radius:12px;padding:.6rem .7rem;background:var(--panel)';
    box.innerHTML = `<label class="ck-row" style="margin:0"><input type="checkbox" name="rem" ${e.remind ? 'checked' : ''}><span><b>Me lembrar todo dia</b> com quantas páginas faltam</span></label>
      <label style="display:flex;gap:.5rem;align-items:center;margin:0;font-size:.86rem">às <select name="remh" style="width:auto">${times.map(([h, m]) => `<option value="${hhmm(h, m)}" ${hhmm(h, m) === cur ? 'selected' : ''}>${hhmm(h, m)}</option>`).join('')}</select></label>
      <small class="hint" style="margin:0">${pushOk() ? 'O celular vai pedir permissão para notificar. No iPhone, só funciona com o Livroverso instalado na tela de início.' : 'Este navegador não recebe notificações.'}</small>`;
    f.querySelector('.dp').after(box);
    const sub = f.querySelector('button[type=submit]');
    sub.addEventListener('click', async () => { // roda antes do salvar do formulário (que fecha a folha)
      const on = box.querySelector('input[name=rem]').checked, [h, mi] = box.querySelector('select[name=remh]').value.split(':').map(Number);
      if (!on) { if (e.remind) { delete e.remind; save(); setTimeout(() => reminderSync(e), 300); } return; }
      e.remind = { hour: h, minute: mi }; save();
      try { await pushSubscribe(); setTimeout(() => reminderSync(e), 300); toast(`Lembrete todo dia às ${hhmm(h, mi)}`); }
      catch (err) { delete e.remind; save(); toast(err.message === 'negado' ? 'Sem permissão para notificar. Libere nas configurações do navegador.' : 'Este aparelho não aceitou notificações'); }
    }, true);
    f.querySelector('.dx')?.addEventListener('click', () => { delete e.remind; save(); setTimeout(() => reminderSync(e), 300); });
  } catch (err) { console.warn('lembrete', err); }
  return r;
}; }
// mantém a página e o prazo em dia na API (a conta do "faltam X" usa onde você está)
setInterval(() => { try {
  const R = reading(); const e = R && R.e;
  for (const x of lib()) if (x.remind && (x !== e || x.status !== 'LENDO' || !x.dueAt)) { delete x.remind; save(); reminderSync(null); }
  if (!e || !e.remind || !e.dueAt) return; const b = reminderBody(e); if (!b) return;
  if (e.remind.sent !== b.page + '|' + b.dueAt + '|' + b.hour + ':' + b.minute + '|' + b.off.join('')) reminderSync(e);
} catch {} }, 30000);
// a notificação abre o app no "Atualizar leitura"
const openUpd = () => { try { const R = reading(); if (R) editLeitura(); } catch {} };
const openFoco = () => { try { const R = reading(); if (R) startFocus(); } catch {} };
if (/[?&]upd=1/.test(location.search)) { setTimeout(openUpd, 2200); try { history.replaceState(null, '', location.pathname); } catch {} }
if (/[?&]foco=1/.test(location.search)) { setTimeout(openFoco, 2200); try { history.replaceState(null, '', location.pathname); } catch {} }
if ('serviceWorker' in navigator) navigator.serviceWorker.addEventListener('message', (ev) => { if (ev.data && ev.data.type === 'bear-upd') openUpd(); if (ev.data && ev.data.type === 'bear-foco') openFoco(); });
// cartão do Início: mostra que o lembrete está ligado
{ let tm = 0; new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(() => { TR.querySelectorAll('.due-ln span:first-child').forEach((s) => { const R = reading(); if (R && R.e.remind && !s.dataset.bell) { s.dataset.bell = 1; s.insertAdjacentHTML('beforeend', ' <small style="font-weight:700;opacity:.75">· lembrete às ' + String(R.e.remind.hour).padStart(2, '0') + ':' + String(R.e.remind.minute || 0).padStart(2, '0') + '</small>'); } }); }, 120); }).observe(TR, { childList: true, subtree: true }); }
