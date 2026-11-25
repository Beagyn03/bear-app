// ---------- Foco: alarme no fim do tempo e ecos diferentes no céu (Bia, 25/11) ----------
// Alarme: som suave (WebAudio, sem arquivo), vibração e o cronômetro em destaque quando o tempo acaba. Toca 4 vezes ou até a
// pessoa tocar na tela. O áudio é destravado no toque de "Começar". Pode desligar no Som ambiente (prefs.focoAlarme, padrão ligado).
// Tela acesa durante a sessão já vem do Wake Lock da "Luz" (l7_v2_sessao_luz.js). Com o app em segundo plano os timers param:
// ao voltar, mostra "Tempo cumprido" na hora e toca se o fim foi há menos de 1 min; com notificação permitida e o app ainda vivo
// em segundo plano, avisa por notificação local. Aviso garantido com a tela bloqueada precisa de push agendado na API (ver relatório).
// Ecos: o tamanho e o brilho dizem a distância da página onde a pessoa está; amizade tem anel dourado, comunidade é lilás, o
// próprio é estrela creme; cada um cintila no seu ritmo. Tocar mostra o eco (o texto de quem está à frente só abre na página).
const FA_ON = () => { try { return (db.prefs || {}).focoAlarme !== false; } catch { return true; } };
let FA_CTX = null, FA_RING = null;
const faCtx = () => { try { const C = window.AudioContext || window.webkitAudioContext; if (!C) return null; if (!FA_CTX) FA_CTX = new C(); if (FA_CTX.state === 'suspended') FA_CTX.resume(); return FA_CTX; } catch { return null; } };
function faChime(ctx) { const t0 = ctx.currentTime + 0.02; [[659.25, 0], [880, 0.22], [1046.5, 0.44]].forEach(([f, d]) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.18, t0 + d + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 1.4); o.connect(g).connect(ctx.destination); o.start(t0 + d); o.stop(t0 + d + 1.5); }); }
function faStop() { if (!FA_RING) return; clearInterval(FA_RING.t); window.removeEventListener('pointerdown', faStop, true); try { const c = V4 && V4.querySelector('.v4ler .ses #v4clk, #v4clk'); const w = c && c.closest('.orbw, .clkw, .mid') ; if (w) w.classList.remove('fa-ring'); } catch {} FA_RING = null; }
function faRing(sound) { faStop(); FA_RING = { n: 0, t: 0 }; try { window.__faRang = (window.__faRang || 0) + 1; } catch {}
  try { const c = V4 && V4.querySelector('#v4clk'); const w = c && (c.closest('.orbw') || c.parentElement); if (w) w.classList.add('fa-ring'); } catch {}
  const h = V4 && V4.querySelector('#v4clkh'); if (h) h.textContent = 'tempo cumprido; continue se quiser';
  if (!FA_ON() || !sound) return; const once = () => { if (!FA_ON()) return faStop(); const ctx = faCtx(); if (ctx) faChime(ctx); try { navigator.vibrate && navigator.vibrate([220, 120, 220]); } catch {} if (++FA_RING.n >= 4) { clearInterval(FA_RING.t); } };
  once(); FA_RING.t = setInterval(() => { if (FA_RING) once(); }, 2600); setTimeout(() => window.addEventListener('pointerdown', faStop, true), 50); }
const faEnd = (s) => (s && s.dur && !s.pz ? s.start + (s.off || 0) + s.dur * 60000 : 0);
function faCheck(fromBack) { try { const s = v4Ses(); if (!s || !s.dur || s.pz) return; const end = faEnd(s); if (!end || Date.now() < end || s.faDone === s.start) return;
    s.faDone = s.start; try { v2SesPut(s); } catch {} const late = Date.now() - end; const onScreen = V4 && V4.isConnected && document.visibilityState === 'visible';
    if (!onScreen) { faNotify(); s.faDone = 0; try { v2SesPut(s); } catch {} return; } // avisa de novo ao voltar
    void fromBack; faRing(late < 60000); } catch (e) { console.warn('alarme', e); } }
function faNotify() { try { if (!FA_ON() || !('Notification' in window) || Notification.permission !== 'granted') return; navigator.serviceWorker && navigator.serviceWorker.ready.then((r) => r.showNotification('Tempo cumprido', { body: 'Sua sessão de leitura terminou. Continue se quiser.', tag: 'lv-foco', renotify: true, vibrate: [220, 120, 220] })).catch(() => {}); } catch {} }
setInterval(() => faCheck(false), 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') setTimeout(() => faCheck(true), 150); });
// destrava o áudio no toque de Começar (o navegador só deixa tocar depois de um gesto)
window.addEventListener('click', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : []; if (p.some((n) => n && n.dataset && n.dataset.a === 'start')) { const c = faCtx(); if (c) { const o = c.createOscillator(), g = c.createGain(); g.gain.value = 0.0001; o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + 0.02); }
    try { if ('Notification' in window && Notification.permission === 'default' && FA_ON()) Notification.requestPermission().catch(() => {}); } catch {} } } catch {} }, true);
// liga/desliga no Som ambiente
{ const _sh = v4SheetHTML; v4SheetHTML = function (k) { let h = _sh.apply(this, arguments); try { if (k === 'amb') { const on = FA_ON();
      h += `<div class="lbl">Fim do tempo</div><div class="chips" style="margin:0;padding:2px 0"><button class="chip ${on ? 'on' : ''}" data-a="faalarm" data-k="1" aria-pressed="${on}">Alarme ligado</button><button class="chip ${on ? '' : 'on'}" data-a="faalarm" data-k="0" aria-pressed="${!on}">Sem alarme</button></div><small class="fa-hint">Som suave e vibração quando o tempo acabar.</small>`; } } catch {} return h; }; }
window.addEventListener('click', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.a === 'faalarm'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  db.prefs = { ...(db.prefs || {}), focoAlarme: b.dataset.k === '1' }; save(); if (b.dataset.k === '1') { const c = faCtx(); if (c) faChime(c); } try { v4Draw(); } catch {} toast(b.dataset.k === '1' ? 'Alarme ligado' : 'Sem alarme no fim do tempo'); } catch (e) { console.warn('alarme', e); } }, true);
// ---------- ecos ----------
const faHash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
let FA_ECO = [];
{ const _sky = v4SkyHTML; v4SkyHTML = function (e) { try { const E = V4ECO.get(e.id); if (!E || !vFn('ecos')) return _sky.apply(this, arguments);
      const base = _sky.apply(this, arguments).replace(/<b class="ecs[^>]*><\/b>/g, ''); const pg = E.pg || 1; FA_ECO = [];
      const mine = (E.seen || []).filter((x) => x.mine).slice(-3).map((x, k) => ({ x, k, kind: 'me', pos: [[64, 9], [36, 16], [80, 22]][k % 3] }));
      const ah = (E.ahead || []).slice(0, 7).map((x, k) => ({ x, k, kind: x.friend ? 'fr' : 'rd', pos: V4POS[k % 7] }));
      const orbs = [...mine, ...ah].map((o, i) => { const x = o.x, d = Math.abs((x.page || pg) - pg), near = Math.max(0, 1 - d / 60), hs = faHash((x.id || '') + i);
        const sz = Math.round((o.kind === 'rd' ? 6 : 8) + near * (o.kind === 'me' ? 12 : 10)), op = (0.5 + near * 0.5).toFixed(2), dur = (2.4 + (hs % 18) / 10).toFixed(1), dl = ((hs >> 5) % 30 / 10).toFixed(1);
        const who = o.kind === 'me' ? 'Seu eco' : o.kind === 'fr' ? 'Eco de ' + (x.displayName || (x.handle ? '@' + x.handle : 'uma amizade')) : 'Eco da comunidade';
        FA_ECO.push(o); return `<button type="button" class="faeco fa-${o.kind}" data-a="faeco" data-i="${i}" aria-label="${esc(who)}, pág. ${x.page || '?'}" style="left:${o.pos[0]}%;top:${o.pos[1]}%;--sz:${sz}px;--op:${op};animation-duration:${dur}s;animation-delay:-${dl}s"></button>`; }).join('');
      return base.replace(/<\/div>$/, orbs + '</div>'); } catch (err) { console.warn('ecos', err); return _sky.apply(this, arguments); } }; }
window.addEventListener('click', (ev) => { try { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.a === 'faeco'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const o = FA_ECO[+b.dataset.i]; if (!o) return; const x = o.x;
  if (x.text && o.kind === 'me') return v4Float([x]);
  if (x.text && (V4ECO.get(v4State().e) || {}).pg >= x.page) return v4Float([x]);
  toast((o.kind === 'fr' ? 'Eco de ' + (x.displayName || (x.handle ? '@' + x.handle : 'uma amizade')) : 'Eco da comunidade') + ' na pág. ' + x.page + ' · abre quando você chegar lá'); } catch (e) { console.warn('ecos', e); } }, true);
const FA_CSS = `.v4ler .sky .faeco{position:absolute;width:var(--sz);height:var(--sz);margin:calc(var(--sz) / -2) 0 0 calc(var(--sz) / -2);padding:0;border:0;border-radius:50%;opacity:var(--op);cursor:pointer;pointer-events:auto;z-index:31;filter:none;-webkit-tap-highlight-color:transparent;animation-name:faTw;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
.v4ler .sky .faeco::before{content:"";position:absolute;inset:-14px;border-radius:50%}
.v4ler .sky .faeco.fa-rd{background:#cfc4ff;box-shadow:0 0 10px 2px rgba(207,196,255,.55)}
.v4ler .sky .faeco.fa-fr{background:#ffd27a;box-shadow:0 0 0 2px rgba(255,236,190,.95),0 0 14px 4px rgba(224,173,58,.6)}
.v4ler .sky .faeco.fa-me{background:#fff1cf;border-radius:2px;transform:rotate(45deg);clip-path:polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%);box-shadow:none;filter:drop-shadow(0 0 6px rgba(255,214,140,.9))}
@keyframes faTw{0%,100%{opacity:var(--op);scale:1}50%{opacity:calc(var(--op) * .55);scale:.82}}
@media (prefers-reduced-motion:reduce){.v4ler .sky .faeco{animation:none}}
.v4ler .sky{pointer-events:none}
.v4ler .fa-ring{animation:faPulse 1.1s ease-in-out infinite;border-radius:50%}
.v4ler .fa-ring #v4clk{color:#ffd27a;text-shadow:0 0 18px rgba(255,210,122,.75)}
@keyframes faPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,210,122,0)}50%{box-shadow:0 0 0 14px rgba(255,210,122,.28)}}
@media (prefers-reduced-motion:reduce){.v4ler .fa-ring{animation:none;box-shadow:0 0 0 6px rgba(255,210,122,.35)}}
.v4ler .fa-hint{display:block;margin:4px 2px 0;font-size:12px;opacity:.75}`;
{ const put = () => { try { const sr = V4 && V4.getRootNode(); const host = sr && (sr.head || sr); if (host && !host.querySelector('style[data-fa]')) { const st = document.createElement('style'); st.dataset.fa = 1; st.textContent = FA_CSS; (sr === document ? document.head : sr).append(st); } } catch {} };
  const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments); put(); if (FA_RING) { try { const c = V4.querySelector('#v4clk'); const w = c && (c.closest('.orbw') || c.parentElement); if (w) w.classList.add('fa-ring'); } catch {} } return r; }; }
