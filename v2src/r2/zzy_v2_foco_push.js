// ---------- Foco: aviso por push agendado no servidor (Bia, 25/11) ----------
// Com a tela bloqueada o navegador para os timers e o alarme do app não toca. Ao começar ou retomar uma sessão com tempo,
// o app agenda na API um push para o fim (POST /v1/push/schedule, tag "foco"); ao pausar, encerrar ou concluir antes,
// cancela (DELETE /v1/push/schedule/foco). Funciona pelo estado da sessão, não por botão: confere logo depois de cada
// toque, a cada 2 s e ao esconder o app. Só agenda com o alarme ligado, login e notificação permitida.
const FP_K = 'lv.focoPush';
const FP = (() => { try { return JSON.parse(localStorage.getItem(FP_K) || 'null') || { at: 0 }; } catch { return { at: 0 }; } })();
const fpSave = () => { try { localStorage.setItem(FP_K, JSON.stringify({ at: FP.at })); } catch {} };
let FP_BUSY = false, FP_FAIL = 0, FP_SUBBED = false;
const fpCan = () => { try { return connected() && 'Notification' in window && Notification.permission === 'granted' && 'serviceWorker' in navigator && 'PushManager' in window; } catch { return false; } };
function fpWant() { // fim da sessão que precisa de aviso (ms) ou 0
  try { if (!FA_ON()) return 0; const s = v4Ses(); if (!s || !s.dur || s.pz || s.faDone === s.start) return 0; const end = faEnd(s), left = end - Date.now();
    return left > 5000 && left <= 3 * 3600e3 ? end : 0; } catch { return 0; }
}
async function fpSync() {
  if (FP_BUSY || Date.now() < FP_FAIL) return; const want = fpWant();
  if (Math.abs(want - FP.at) < 1500) return; // mesmo fim (arredonda o relógio)
  FP_BUSY = true;
  try {
    if (want) {
      if (!fpCan()) return;
      if (!FP_SUBBED) { try { await pushSubscribe(); FP_SUBBED = true; } catch { FP_FAIL = Date.now() + 60000; return; } } // garante o aparelho inscrito
      const r = await sapi('POST', '/v1/push/schedule', { at: new Date(want).toISOString(), title: 'Tempo cumprido', body: 'Sua sessão de leitura terminou. Continue se quiser.', url: './', tag: 'foco' });
      if (r && r.status === 200) { FP.at = want; fpSave(); } else FP_FAIL = Date.now() + 30000;
    } else if (FP.at) {
      const ended = FP.at <= Date.now() + 1000; // terminou no tempo: o servidor já mandou; nada a cancelar
      if (!ended) { if (!connected()) return; const r = await sapi('DELETE', '/v1/push/schedule/foco'); if (!r || r.status !== 200) { FP_FAIL = Date.now() + 30000; return; } }
      FP.at = 0; fpSave();
    }
  } catch { FP_FAIL = Date.now() + 30000; } finally { FP_BUSY = false; }
}
setInterval(() => { fpSync(); }, 2000);
window.addEventListener('click', () => setTimeout(() => fpSync(), 60), true); // depois do clique de Começar, pausar, retomar, encerrar
document.addEventListener('visibilitychange', () => fpSync());
window.addEventListener('pagehide', () => fpSync());
