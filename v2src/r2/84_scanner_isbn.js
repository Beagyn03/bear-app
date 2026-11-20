// Escanear o código de barras do livro na busca (Bia, 17/11): botão de câmera ao lado de Buscar; lê o ISBN (978/979…)
// e já busca. Usa o leitor do navegador (BarcodeDetector) quando existe; senão carrega o ZXing só na hora.
{ const st = document.createElement('style'); st.textContent = `
.ct-scan{flex:none;width:44px;height:44px;border-radius:12px;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);display:grid;place-items:center;padding:0;cursor:pointer}
.ct-scan svg{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}`; TR.append(st);
  const st2 = document.createElement('style'); st2.textContent = `
.scn{position:fixed;inset:0;z-index:100001;background:#000;display:grid;grid-template-rows:auto 1fr auto;color:#fff;font-family:inherit}
.scn header{display:flex;justify-content:space-between;align-items:center;padding:max(12px,env(safe-area-inset-top)) 16px 10px}.scn header b{font-size:1rem}
.scn header button{width:40px;height:40px;border-radius:50%;border:0;background:rgba(255,255,255,.15);color:#fff;font-size:1.3rem}
.scn .scn-v{position:relative;overflow:hidden}.scn video{width:100%;height:100%;object-fit:cover}
.scn .scn-box{position:absolute;left:10%;right:10%;top:38%;height:22%;border:3px solid #f5b84a;border-radius:14px;box-shadow:0 0 0 2000px rgba(0,0,0,.45)}
.scn .scn-line{position:absolute;left:12%;right:12%;top:49%;height:2px;background:#ff6b6b;box-shadow:0 0 8px #ff6b6b;animation:scnL 1.6s ease-in-out infinite alternate}
@keyframes scnL{from{transform:translateY(-34px)}to{transform:translateY(34px)}}
.scn footer{padding:14px 16px max(18px,env(safe-area-inset-bottom));text-align:center;font-size:.9rem;opacity:.9}`; document.head.append(st2); }
const ZXING_URL = 'https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
const loadZXing = () => window.ZXing ? Promise.resolve(window.ZXing) : new Promise((ok, no) => { const s = document.createElement('script'); s.src = ZXING_URL; s.onload = () => ok(window.ZXing); s.onerror = no; document.head.append(s); });
const isbnOf = (raw) => { const d = String(raw || '').replace(/[^0-9X]/gi, ''); if (/^97[89]\d{10}$/.test(d)) return d; if (/^\d{9}[\dX]$/i.test(d)) return d; return null; };
async function scanIsbn(onFound) {
  const wrap = document.createElement('div'); wrap.className = 'scn';
  wrap.innerHTML = '<header><b>Escanear código do livro</b><button type="button" aria-label="Fechar">×</button></header><div class="scn-v"><video playsinline muted autoplay></video><div class="scn-box"></div><div class="scn-line"></div></div><footer>Aponte a câmera para o código de barras atrás do livro.</footer>';
  document.body.append(wrap); const video = wrap.querySelector('video'), msg = wrap.querySelector('footer');
  let stream = null, timer = 0, reader = null, done = false;
  const stop = () => { done = true; clearInterval(timer); try { reader && reader.reset(); } catch {} try { stream && stream.getTracks().forEach((t) => t.stop()); } catch {} wrap.remove(); };
  const found = (raw) => { const isbn = isbnOf(raw); if (!isbn || done) return; try { navigator.vibrate && navigator.vibrate(60); } catch {} stop(); onFound(isbn); };
  wrap.querySelector('header button').addEventListener('click', stop);
  try {
    if ('BarcodeDetector' in window && (await BarcodeDetector.getSupportedFormats()).includes('ean_13')) {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false }); video.srcObject = stream; await video.play();
      const det = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a'] });
      timer = setInterval(async () => { if (done || video.readyState < 2) return; try { const r = await det.detect(video); if (r && r[0]) found(r[0].rawValue); } catch {} }, 250);
    } else {
      msg.textContent = 'Abrindo a câmera…'; const ZX = await loadZXing(); if (done) return;
      const hints = new Map(); hints.set(ZX.DecodeHintType.POSSIBLE_FORMATS, [ZX.BarcodeFormat.EAN_13, ZX.BarcodeFormat.EAN_8, ZX.BarcodeFormat.UPC_A]);
      reader = new ZX.BrowserMultiFormatReader(hints); msg.textContent = 'Aponte a câmera para o código de barras atrás do livro.';
      await reader.decodeFromConstraints({ video: { facingMode: 'environment' } }, video, (res) => { if (res) found(res.getText()); });
    }
  } catch (err) { console.warn('scanner', err); msg.textContent = /NotAllowed|Permission/i.test(String(err && err.name)) ? 'Sem permissão para usar a câmera. Libere nas configurações do navegador.' : 'Não consegui abrir a câmera neste aparelho.'; }
}
{ let tm = 0; const put = () => { TR.querySelectorAll('form.ct-form').forEach((f) => { if (f.querySelector('.ct-scan')) return;
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ct-scan'; b.setAttribute('aria-label', 'Escanear código de barras'); b.title = 'Escanear código de barras';
      b.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M8 8v8M11 8v8M14 8v8M17 8v8"/></svg>';
      const sub = f.querySelector('button[type=submit]'); if (sub) sub.before(b); else f.append(b);
      b.addEventListener('click', () => scanIsbn((isbn) => { const q = f.querySelector('#ct-q'); if (q) q.value = isbn; f.requestSubmit(); toast('ISBN ' + isbn); }));
    }); };
  new MutationObserver(() => { clearTimeout(tm); tm = setTimeout(put, 60); }).observe(TR, { childList: true, subtree: true }); }
