// v2 etapa 3 (19/11, branch livroverso-2): ícones próprios no topo e no menu lateral.
//  - O bloco antigo de ícones ilustrados (62_icones_novos) trocava o desenho do sino e dos itens do menu lateral por
//    imagens coloridas (marca data-ic2). Aqui o traço novo (duas camadas) volta e fica: sino, •••, menu e cada item do
//    menu lateral, inclusive os que entram depois (Resumo do mês, Presentes, Denúncias).
//  - Cabeçalho do menu lateral vira um cartão com a foto e o nome, no padrão do perfil novo.
Object.assign(V2I, {
  stats: '<path d="M4 20V11M10 20V5M16 20v-6M3 20.5h18"/><rect class="d" x="8.2" y="5" width="3.6" height="15" rx="1.2"/>',
  resumo: '<rect class="d" x="4" y="5" width="16" height="15" rx="3"/><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 9.5h16M8.5 3v4M15.5 3v4M9 14l2 2 4-4"/>',
  orbita: '<circle class="d" cx="12" cy="12" r="5.5"/><circle cx="12" cy="12" r="5.5"/><path d="M6.8 14.6C3.4 16.5 2 18.2 2.6 19.1c1 1.6 6.6-.3 12.4-4.2s9.6-8.4 8.6-10c-.6-.9-2.7-.6-5.6.6"/>',
  goals: '<circle class="d" cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><path d="M12 12l6-6M15.5 4.5V6.5h2"/>',
  ach: '<path class="d" d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M10 15h4v4h-4zM8 21h8"/>',
  quotes: '<path class="d" d="M5 7h5v5c0 3-2 5-5 6zM14 7h5v5c0 3-2 5-5 6z"/><path d="M5 7h5v5c0 3-2 5-5 6zM14 7h5v5c0 3-2 5-5 6z"/>',
  hl: '<circle class="d" cx="12" cy="12" r="8.5"/><path d="M3.5 12a8.5 8.5 0 1 0 2.5-6M3.5 4v4h4M12 7.5V12l3 2"/>',
  salvos: '<path class="d" d="M7 3h10v18l-5-4-5 4z"/><path d="M7 3h10v18l-5-4-5 4z"/>',
  friends: '<circle class="d" cx="9" cy="8" r="3.5"/><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5M15 15c3 0 5.5 1 6.5 4"/>',
  gifts: '<rect class="d" x="4" y="10" width="16" height="11" rx="2"/><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M3 7.5h18v2.5H3zM12 7.5V21M12 7.5c-2-4-6-4-6-1.5S10 7.5 12 7.5zM12 7.5c2-4 6-4 6-1.5S14 7.5 12 7.5z"/>',
  inst: '<rect class="d" x="6" y="2.5" width="12" height="19" rx="3"/><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M12 7v7M9 11.5l3 3 3-3M10.5 18.5h3"/>',
  out: '<path class="d" d="M5 4h8v16H5z"/><path d="M13 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7M10 12h10M17 8.5l3.5 3.5-3.5 3.5"/>',
  mod: '<path class="d" d="M5 4h11l-2 4 2 4H5z"/><path d="M5 21V4h11l-2 4 2 4H5"/>',
  home: '<path d="M3.5 7h17M3.5 17h17"/><circle class="d" cx="9" cy="7" r="2.8"/><circle cx="9" cy="7" r="2.8"/><circle class="d" cx="15.5" cy="17" r="2.8"/><circle cx="15.5" cy="17" r="2.8"/>',
  cfg: '<path d="M3.5 7h17M3.5 17h17"/><circle class="d" cx="9" cy="7" r="2.8"/><circle cx="9" cy="7" r="2.8"/><circle class="d" cx="15.5" cy="17" r="2.8"/><circle cx="15.5" cy="17" r="2.8"/>',
  chat: '<path class="d" d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v5a3.5 3.5 0 0 1-3.5 3.5H10l-5 4v-4.4A3.5 3.5 0 0 1 4 12.5z"/><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v5a3.5 3.5 0 0 1-3.5 3.5H10l-5 4v-4.4A3.5 3.5 0 0 1 4 12.5z"/>',
  spark: '<path class="d" d="M12 3c.9 4.6 2.4 6.1 7 7-4.6.9-6.1 2.4-7 7-.9-4.6-2.4-6.1-7-7 4.6-.9 6.1-2.4 7-7z"/><path d="M12 3c.9 4.6 2.4 6.1 7 7-4.6.9-6.1 2.4-7 7-.9-4.6-2.4-6.1-7-7 4.6-.9 6.1-2.4 7-7zM19 16.5v4M17 18.5h4"/>',
});
// chave do item do menu lateral pelo data-go / data-go2 (e pelo texto, para itens novos)
const V2DRW = { stats: 'stats', resumo: 'resumo', orbita: 'orbita', goals: 'goals', ach: 'ach', quotes: 'quotes', hl: 'hl', salvos: 'salvos', friends: 'friends', gifts: 'gifts', inst: 'inst', mod: 'mod', home: 'home', cfg: 'cfg', msgs: 'chat' };
const V2DRWT = [[/estat/i, 'stats'], [/resumo/i, 'resumo'], [/órbita|orbita/i, 'orbita'], [/meta/i, 'goals'], [/conquist/i, 'ach'], [/trecho/i, 'quotes'], [/histór/i, 'hl'], [/salvo/i, 'salvos'], [/amig/i, 'friends'], [/presente/i, 'gifts'], [/instalar/i, 'inst'], [/sair/i, 'out'], [/denúnc/i, 'mod'], [/ajuste/i, 'cfg'], [/personaliz/i, 'home'], [/mensag/i, 'chat']];
{ const st = document.createElement('style'); st.textContent = `
.drw{background:var(--bg)!important;padding-bottom:1.2rem!important}
.drw .drw-me{margin:.2rem .8rem .4rem!important;width:calc(100% - 1.6rem)!important;padding:.85rem .9rem!important;border:1px solid var(--line)!important;border-radius:var(--v2-r,20px)!important;background:var(--panel)!important;box-shadow:var(--v2-sh)!important}
.drw .drw-me .av{width:48px!important;height:48px!important;box-shadow:0 0 0 2.5px var(--panel),0 0 0 4.5px color-mix(in srgb,var(--acc) 60%,#e45f9b)!important}
.drw .drw-me b{font-family:var(--v2-disp,Georgia,serif)!important;font-size:1.08rem!important}
.drw .drw-me small{color:var(--ink-2)!important;font-weight:700}
.drw .drw-g{padding:1.05rem 1.3rem .35rem!important;color:var(--acc)!important;letter-spacing:.1em!important}
.drw .drw-it{margin:0 .5rem;width:calc(100% - 1rem)!important;border-radius:14px!important;padding:.6rem .8rem!important;gap:.8rem!important;font-weight:700}
.drw .drw-it:hover,.drw .drw-it:active{background:color-mix(in srgb,var(--acc) 9%,transparent)!important}
.drw .drw-it > svg.v2i{width:22px!important;height:22px!important;color:var(--ink)!important;flex:none}
.drw .drw-it.drw-out,.drw .drw-it.drw-out > svg.v2i{color:#c0392b!important}
.drw .drw-it > svg:not(.v2i),.drw .drw-it > img{display:none!important}
.drw .drw-it small:not(.drw-bd){color:var(--ink-2)!important;font-weight:800;font-size:.7rem}
#g-bell.v2ic svg:not(.v2i),#g-msg svg:not(.v2i){display:none!important}
`; TR.append(st); }
{ const keyOf = (b) => { const g = b.dataset.go || b.dataset.go2 || ''; if (b.classList.contains('drw-out')) return 'out'; if (V2DRW[g]) return V2DRW[g]; const t = b.textContent || ''; const m = V2DRWT.find(([re]) => re.test(t)); return m ? m[1] : null; };
  const fixTop = () => {
    // o bloco antigo escreve a imagem dentro do primeiro svg do sino: devolve o traço novo
    ['g-bell', 'g-imore', 'g-av'].forEach((id) => { const b = TR.querySelector('#' + id); if (!b) return; const s = b.querySelector(':scope > svg.v2i');
      const k = id === 'g-bell' ? 'bell' : id === 'g-imore' ? 'dots' : 'menu';
      if (s) { s.dataset.ic2 = '1'; if (s.querySelector('image') && V2I[k]) s.innerHTML = V2I[k]; } });
  };
  const fixDrw = () => {
    TR.querySelectorAll('.drw .drw-it').forEach((b) => { const k = keyOf(b); if (!k || !V2I[k]) return; b.dataset.ic2 = '1';
      let s = b.querySelector(':scope > svg.v2i'); if (s && s.dataset.k === k) return;
      b.querySelectorAll(':scope > svg, :scope > img').forEach((x) => { if (!x.classList.contains('v2i')) x.remove(); });
      if (!s) { b.insertAdjacentHTML('afterbegin', V2SVG(k, 22)); s = b.querySelector(':scope > svg.v2i'); } else s.innerHTML = V2I[k];
      s.dataset.k = k; });
  };
  let tm = 0; new MutationObserver(() => { if (tm) return; tm = setTimeout(() => { tm = 0; fixTop(); fixDrw(); }, 30); }).observe(TR, { childList: true, subtree: true });
  setTimeout(() => { fixTop(); fixDrw(); }, 700); }
