// v2 fase 1 (Bia, 18/11, branch livroverso-2): barra de baixo com cinco destinos fixos: Hoje, Estante, Ler (no meio), Comunidade, Você.
// Buscar sai da barra e vira a lupa no topo (um lugar só). Ícones próprios em duas camadas (traço + preenchimento suave).
// Em Você, "Ajustes" fica num botão visível no topo do perfil (sai da linha Editar perfil | Ajustes, para não ter dois caminhos).
const V2I = {
  inicio: '<path class="d" d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/><path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/><path d="M17.5 3v3.4M15.8 4.7h3.4"/>',
  estante: '<rect class="d" x="3.5" y="5" width="4.2" height="15" rx="1.3"/><rect x="3.5" y="5" width="4.2" height="15" rx="1.3"/><rect x="9.3" y="3" width="4.2" height="17" rx="1.3"/><path d="M9.3 7.5h4.2"/><path d="M15.6 6.4l3.5-.9 3.2 13.6-3.5.9z"/>',
  comunidade: '<path class="d" d="M3 6.8A3.8 3.8 0 0 1 6.8 3h6.4A3.8 3.8 0 0 1 17 6.8v2.4a3.8 3.8 0 0 1-3.8 3.8H8.5L4.5 16v-3.6A3.8 3.8 0 0 1 3 9.2z"/><path d="M3 6.8A3.8 3.8 0 0 1 6.8 3h6.4A3.8 3.8 0 0 1 17 6.8v2.4a3.8 3.8 0 0 1-3.8 3.8H8.5L4.5 16v-3.6A3.8 3.8 0 0 1 3 9.2z"/><path d="M19.6 9.6A3 3 0 0 1 21 12.1v2.3a3 3 0 0 1-1.5 2.6V20l-3.4-2.8H12a3 3 0 0 1-2.5-1.3"/>',
  ler: '<path class="d" d="M12 6.6C9.8 5 6.8 4.5 3 5v13.2c3.8-.5 6.8 0 9 1.6 2.2-1.6 5.2-2.1 9-1.6V5c-3.8-.5-6.8 0-9 1.6z"/><path d="M12 6.6C9.8 5 6.8 4.5 3 5v13.2c3.8-.5 6.8 0 9 1.6 2.2-1.6 5.2-2.1 9-1.6V5c-3.8-.5-6.8 0-9 1.6zM12 6.6v13.2"/>',
  buscar: '<circle class="d" cx="10.5" cy="10.5" r="6.5"/><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.4 15.4l5.1 5.1M7.6 9.2a3.2 3.2 0 0 1 2.6-1.8"/>',
  ajustes: '<path d="M3.5 7h17M3.5 17h17"/><circle class="d" cx="9" cy="7" r="2.8"/><circle cx="9" cy="7" r="2.8"/><circle class="d" cx="15.5" cy="17" r="2.8"/><circle cx="15.5" cy="17" r="2.8"/>',
};
const V2SVG = (k, w) => `<svg class="v2i" viewBox="0 0 24 24" width="${w || 24}" height="${w || 24}" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${V2I[k]}</svg>`;
{ const st = document.createElement('style'); st.textContent = `
.v2i .d{fill:currentColor;fill-opacity:.18;stroke:none}
#tabbar.v2bar{grid-template-columns:1fr 1fr 78px 1fr 1fr!important;align-items:end;overflow:visible}
#tabbar.v2bar button svg{width:25px;height:25px;color:var(--ink-2)}
#tabbar.v2bar button.on svg{color:var(--acc);stroke-width:1.9}#tabbar.v2bar button.on .v2i .d{fill-opacity:.38}
#tabbar.v2bar button small{font-size:.64rem;font-weight:800}
#tabbar.v2bar .tb-av{width:27px;height:27px;opacity:1;filter:none;font-size:.78rem;color:#fff;background-color:#c46f2e}
#tabbar.v2bar .v2ler{position:relative;display:grid;justify-items:center;gap:.12rem;padding:0;color:var(--ink)!important}
#tabbar.v2bar .v2ler span.pl{width:58px;height:58px;margin-top:-26px;border-radius:50%;display:grid;place-items:center;color:#fff;background:radial-gradient(circle at 34% 30%,#ffd6a3,#c46f2e 58%,#8c4421);box-shadow:0 8px 18px rgba(196,111,46,.42);position:relative}
#tabbar.v2bar .v2ler span.pl::after{content:"";position:absolute;inset:-6px -11px;border:2px solid rgba(196,111,46,.35);border-radius:50%;transform:rotate(-18deg);pointer-events:none}
#tabbar.v2bar .v2ler svg{width:27px!important;height:27px!important;color:#fff!important}#tabbar.v2bar .v2ler .v2i .d{fill:#fff;fill-opacity:.3}
#tabbar.v2bar .v2ler small{color:var(--ink)!important}
.gtop #g-find svg{width:21px;height:21px}
#tabbar.v2bar button.on .tb-av{box-shadow:0 0 0 2px var(--panel),0 0 0 3.5px var(--acc)!important}#tabbar.v2bar button.on small{color:var(--acc)!important}
.yo-top{position:relative}.yo-top .v2-ajpill{position:absolute;right:0;top:-2.6rem;z-index:2}
#shelflist.mine-page .sl-body{padding-top:2.9rem}
.v2-ajpill{display:inline-flex;align-items:center;gap:.35rem;margin-left:auto;border:1.5px solid var(--line);background:var(--panel);color:var(--ink);border-radius:999px;padding:.4rem .75rem;font:inherit;font-weight:900;font-size:.8rem;flex:none}
.v2-ajpill svg{width:17px;height:17px}
#shelflist.mine-page #me-cfg{display:none!important}
`; TR.append(st); }
function v2OnTab() { const v = $('#shelflist'); return v && !v.hidden && v.classList.contains('mine-page') ? 'eu' : S.tab === 'perfil' ? 'eu' : S.tab; }
drawTabbar = function () {
  const bar = $('#tabbar'); if (!bar) return; const h = drawHud(), cur = v2OnTab();
  bar.classList.add('v2bar');
  const av = `<span class="tb-av" style="${h.ph ? `background-image:${cssUrl(h.ph)}` : ''}">${h.ph ? '' : esc(initial((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || h.name))}</span>`;
  const html = [['inicio', 'Hoje'], ['estante', 'Estante'], ['ler', 'Ler'], ['comunidade', 'Comunidade'], ['eu', 'Você']].map(([k, n]) => k === 'ler'
    ? `<button type="button" class="v2ler" data-tab="ler" aria-label="Ler agora: começar uma sessão de leitura"><span class="pl">${V2SVG('ler')}</span><small>Ler</small></button>`
    : `<button type="button" data-tab="${k}" class="${cur === k ? 'on' : ''}" aria-current="${cur === k}">${k === 'eu' ? av : V2SVG(k)}<small>${n}</small></button>`).join('');
  // só remonta a barra quando algo mudou (antes era remontada a cada tique, mesmo igual)
  if (bar.dataset.v2sig !== html || !bar.querySelector('[data-tab]')) { bar.dataset.v2sig = html; bar.innerHTML = html;
    $$('button', bar).forEach((b) => b.addEventListener('click', () => (b.dataset.tab === 'ler' ? v2Ler() : goTab(b.dataset.tab, true)))); }
  try { paintCommDot(); } catch {}
};
// lupa no topo: o Buscar que saiu da barra
{ const top = $('.gtop'), msg = $('#g-msg');
  if (top && msg && !$('#g-find')) { msg.insertAdjacentHTML('beforebegin', `<button type="button" class="g-b" id="g-find" aria-label="Buscar livros e leitores">${V2SVG('buscar', 21)}</button>`); $('#g-find').addEventListener('click', () => goTab('buscar')); } }
// Você: botão Ajustes visível no topo do perfil
{ const _om = openMyProfile; openMyProfile = async function () {
  const r = await _om.apply(this, arguments); const v = $('#shelflist');
  const pill = (n) => { if (!v || v.hidden || !v.classList.contains('mine-page') || v.querySelector('.v2-ajpill')) return;
    const top = v.querySelector('.yo-top'); if (!top) { if (n < 10) setTimeout(() => pill(n + 1), 80); return; }
    top.insertAdjacentHTML('afterbegin', `<button type="button" class="v2-ajpill" id="v2-aj">${V2SVG('ajustes', 17)}Ajustes</button>`);
    $('#v2-aj', v).addEventListener('click', () => { v.hidden = true; S.ajMode = 'sistema'; goTab('perfil'); }); };
  pill(0); drawTabbar(); return r;
}; }
drawTabbar();

// a inicial da aba Você acompanha o nome/foto sempre que o cabeçalho é redesenhado (antes ficava "V" de "Você")
{ const _dh = drawHud; drawHud = function () { const r = _dh.apply(this, arguments); const a = document.querySelector('#tabbar .tb-av'); if (a) { a.textContent = r.ph ? '' : initial((typeof socialProfile !== 'undefined' && socialProfile && socialProfile.displayName) || r.name); a.style.backgroundImage = r.ph ? cssUrl(r.ph) : ''; } return r; }; }
