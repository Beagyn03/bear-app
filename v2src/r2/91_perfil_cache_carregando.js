// Perfil mais rápido no celular (Bia, 17/11):
// 1) enquanto o perfil monta, estrelas cadentes cruzam a tela com "Carregando perfil…";
// 2) o perfil fica guardado no aparelho: abrir de novo mostra na hora o que estava salvo e, quando a resposta nova chega,
//    a página se atualiza sozinha (sem piscar). Guarda os 6 perfis abertos por último.
{ const st = document.createElement('style'); st.textContent = `
.fp-load{position:fixed;left:0;right:0;top:56px;bottom:64px;z-index:40;background:var(--bg);display:grid;place-items:center;overflow:hidden;pointer-events:none;animation:fpIn .2s ease}
@keyframes fpIn{from{opacity:0}to{opacity:1}}
.fp-load b{position:relative;z-index:2;font-size:.9rem;font-weight:800;color:var(--ink-2);display:flex;align-items:center;gap:.45rem}
.fp-load b i{font-style:normal;color:#f2c94c;font-size:1.2rem;animation:fpTw 1.2s ease-in-out infinite;text-shadow:0 0 8px rgba(242,201,76,.8)}
@keyframes fpTw{50%{transform:scale(.7) rotate(20deg);opacity:.6}}
.fp-load s{position:absolute;width:110px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,rgba(242,201,76,.15),#f7d77a);transform:rotate(-35deg);opacity:0;animation:fpShoot 1.6s ease-in infinite;text-decoration:none}
.fp-load s::after{content:"★";position:absolute;right:-7px;top:-9px;font-size:14px;color:#ffe08a;text-shadow:0 0 6px #ffd35a}
.fp-load s:nth-child(1){top:12%;left:70%;animation-delay:0s}.fp-load s:nth-child(2){top:28%;left:95%;animation-delay:.45s}
.fp-load s:nth-child(3){top:5%;left:40%;animation-delay:.9s}.fp-load s:nth-child(4){top:45%;left:85%;animation-delay:1.25s}.fp-load s:nth-child(5){top:20%;left:115%;animation-delay:.7s}
@keyframes fpShoot{0%{opacity:0;transform:rotate(-35deg) translateX(0)}12%{opacity:1}70%{opacity:1}100%{opacity:0;transform:rotate(-35deg) translateX(-420px)}}
@media (prefers-reduced-motion:reduce){.fp-load s{display:none}}
`; TR.append(st); }
{ const v = $('#shelflist'); let ov = null;
  const sync = () => { const on = v.classList.contains('fp-wait');
    if (on && !ov) { ov = document.createElement('div'); ov.className = 'fp-load'; ov.innerHTML = '<s></s><s></s><s></s><s></s><s></s><b><i>★</i>Carregando perfil…</b>'; TR.append(ov); }
    else if (!on && ov) { const o = ov; ov = null; o.style.transition = 'opacity .2s'; o.style.opacity = '0'; setTimeout(() => o.remove(), 220); } };
  new MutationObserver(sync).observe(v, { attributes: true, attributeFilter: ['class'] }); }
// cache dos perfis
{ const KEY = 'lv.fpCache', MAX = 6;
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } };
  const write = (c) => { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { try { localStorage.removeItem(KEY); } catch {} } };
  const put = (path, data) => { const s = JSON.stringify(data); if (s.length > 450000) return; const c = read(); c[path] = { t: Date.now(), d: data };
    const ks = Object.keys(c).sort((a, b) => c[b].t - c[a].t); ks.slice(MAX).forEach((k) => delete c[k]); write(c); };
  let fresh = null, inFP = 0;
  const _fp = friendPage; friendPage = async function () { inFP++; try { return await _fp.apply(this, arguments); } finally { inFP--; } };
  const _s = sapi; sapi = async function (method, path, body) {
    const m = inFP > 0 && method === 'GET' && /^\/v1\/users\/[^/?]+$/.test(String(path || ''));
    if (!m) return _s.apply(this, arguments);
    const hit = fresh === path ? null : read()[path];
    if (!hit) { const r = await _s.apply(this, arguments); if (r && r.status === 200 && r.data) put(path, r.data); return r; }
    // mostra o salvo na hora e confere com o servidor em seguida
    _s.call(this, method, path, body).then((r) => {
      if (!r || r.status !== 200 || !r.data) return;
      const changed = JSON.stringify(r.data) !== JSON.stringify(hit.d); put(path, r.data); if (!changed) return;
      const h = decodeURIComponent(path.split('/').pop()), vv = $('#shelflist');
      if (vv && !vv.hidden && S.fpData && String(S.fpData.handle || '').toLowerCase() === h.toLowerCase()) {
        fresh = path; const y = vv.scrollTop; const p = S.myOpen || (socialProfile && socialProfile.handle && socialProfile.handle.toLowerCase() === h.toLowerCase()) ? openMyProfile() : friendPage(h);
        Promise.resolve(p).finally(() => { fresh = null; try { vv.scrollTop = y; } catch {} });
      }
    }).catch(() => {});
    return { status: 200, data: JSON.parse(JSON.stringify(hit.d)) };
  }; }
