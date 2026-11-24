// Prateleira na Biblioteca › Livros e no perfil (Bia, 21/11): porta do protótipo v186 (scratchpad/livroverso_v3.html), visual igual.
// - Livros ganha Grade · Prateleira (o modo escolhido fica lembrado em prefs.shView). A Grade não muda.
// - Prateleira: topo compacto (seletor "Todos ▾" com situações e as estantes da pessoa, Grade, Organizar, Decorar, + e "?"),
//   lombadas com proporção real (altura pelo formato, grossura pelas páginas), tipos (brochura, capa dura, tecido, duas cores),
//   lombada tirada da capa (faixa da borda esquerda + cor amostrada em canvas; se a capa não deixa ler a cor, fica a cor da paleta).
// - Tudo o que a pessoa arruma fica em prefs.shx (vai junto com a conta, sem migração): ordem, pilhas, edição de cada livro,
//   foto da lombada (JPEG pequeno em data URL, até 60 fotos; não existe rota de upload de imagem na API), enfeites, madeira,
//   parede, luzinhas e lombadas da capa/desenhadas.
// - Perfil: uma estante só, decorada igual à da Biblioteca, com chips (Todas + cada estante; cadeado nas só suas). Quem visita vê
//   a mesma estante pelo resumo publicado (snapshot.shelf.prat), só com as estantes públicas.
// Esta parte: estado, lombadas, prateleira, topo, filtro, legenda, perfil e resumo. Organizar, Decorar, edições e foto: wk_v2_estante_decorar.js.
try { Object.assign(V4ICON, { grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>', prat: '<path d="M3 20h18M3 4h18"/><path d="M5 20V8h3v12M9 20V6h3v14M13.5 20l2-12 3 .5-2 11.5"/>', lua: '<path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z"/>' }); } catch {}
const SHX_CSS1 = `.v4ler .bsh{--bk-wall:#efe7da;--bk-back:#e4d8c5;--bk-w1:#d6aa76;--bk-w2:#b98551;--bk-w3:#8e5f36;--bk-top:#e8c597;--bk-sh:rgba(70,40,15,.28);--bk-glow:rgba(255,196,110,.20);--bk-hint:#7d6a55}
.v4ler .bsh.dk{--bk-wall:#141d31;--bk-back:#0f1728;--bk-w1:#6b4a32;--bk-w2:#4d3322;--bk-w3:#2f1f15;--bk-top:#7d5a3e;--bk-sh:rgba(0,0,0,.55);--bk-glow:rgba(255,190,100,.16);--bk-hint:#a99ab8}
.v4ler .bsh{position:relative;margin:2px -16px -110px;padding:14px 0 130px;background:var(--bk-wall)}
.v4ler .bsh .case{position:relative;margin:0 6px;padding:0 9px;border-radius:3px 3px 0 0;
 background:linear-gradient(90deg,var(--bk-w3),var(--bk-w1) 3px,var(--bk-w2) 7px,var(--bk-w3) 9px,transparent 9px,transparent calc(100% - 9px),var(--bk-w3) calc(100% - 9px),var(--bk-w2) calc(100% - 7px),var(--bk-w1) calc(100% - 3px),var(--bk-w3));
 box-shadow:0 10px 30px -12px var(--bk-sh)}
.v4ler .bsh .crown{height:12px;margin:0 -15px;border-radius:3px 3px 0 0;background:linear-gradient(180deg,var(--bk-top),var(--bk-w1) 40%,var(--bk-w2));box-shadow:0 3px 6px -2px var(--bk-sh)}
.v4ler .bsh .bay{position:relative;background:linear-gradient(180deg,rgba(0,0,0,.20),rgba(0,0,0,0) 22px),radial-gradient(120% 60% at 50% 105%,var(--bk-glow),transparent 70%),var(--bk-back)}
.v4ler .bsh .bay::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.01) 0 1px,transparent 1px 22px);pointer-events:none}
.v4ler .bsh .brow{position:relative;z-index:1;display:flex;align-items:flex-end;height:166px;padding:0 3px}
.v4ler .bsh .brow::after{content:'';position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(0deg,rgba(0,0,0,.35),transparent);pointer-events:none;z-index:0}
.v4ler .bsh .bpl{position:relative;z-index:2;height:16px;margin:0 -9px;background:linear-gradient(180deg,var(--bk-top) 0,var(--bk-top) 4px,var(--bk-w1) 4px,var(--bk-w2) 70%,var(--bk-w3));box-shadow:0 7px 9px -4px var(--bk-sh)}
.v4ler .bsh .bpl::before{content:'';position:absolute;left:0;right:0;top:4px;height:1px;background:rgba(0,0,0,.18)}
.v4ler .bsh .lt{position:absolute;left:4px;right:4px;top:8px;height:18px;pointer-events:none;z-index:3}
.v4ler .bsh .lt svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.v4ler .bsh .lt i{position:absolute;width:4px;height:6px;margin-left:-2px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 50% 40%,#fffaf0,#ffd37a 55%,#e8a238);box-shadow:0 0 4px 1px rgba(255,205,110,.65),0 0 12px 4px rgba(255,190,90,.18);animation:bktw 4s ease-in-out infinite}
.v4ler .bsh .lt i:nth-child(4n){animation-delay:-1.3s}
.v4ler .bsh .lt i:nth-child(4n+1){animation-delay:-2.6s}
@keyframes bktw{0%,100%{opacity:.82}50%{opacity:1}}
.v4ler .bsh .sp{--c:#444;--k:#eee;position:relative;flex:none;display:block;box-sizing:border-box;padding:0;margin:0;border:0;cursor:pointer;font:inherit;-webkit-tap-highlight-color:transparent;background:var(--c);color:var(--k);border-radius:1.5px 1.5px .5px .5px;transition:transform .2s ease;box-shadow:0 0 0 .5px rgba(0,0,0,.22)}
.v4ler .bsh .sp::before{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(90deg,rgba(0,0,0,.30) 0,rgba(255,255,255,.16) 14%,rgba(255,255,255,.05) 34%,rgba(0,0,0,0) 58%,rgba(0,0,0,.10) 82%,rgba(0,0,0,.34) 100%)}
.v4ler .bsh .sp::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.5;background:repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,rgba(0,0,0,.03) 1px 2px)}
.v4ler .bsh .sp.cl::after{opacity:.9;background:repeating-linear-gradient(45deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px),repeating-linear-gradient(-45deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px)}
.v4ler .bsh .sp.hc{border-radius:2.5px 2.5px 1px 1px}
.v4ler .bsh .sp:hover,.v4ler .bsh .sp:focus-visible{transform:translateY(-6px)}
.v4ler .bsh .sp:focus-visible{outline:2px solid var(--acc);outline-offset:2px;z-index:4}
.v4ler .bsh .sp.lean{transform-origin:0 100%;transform:rotate(-7deg)}
.v4ler .bsh .sp.lean:hover{transform:rotate(-7deg) translateY(-5px)}
.v4ler .bsh .sp.lean.lr{transform-origin:100% 100%;transform:rotate(7deg)}
.v4ler .bsh .sp.lean.lr:hover{transform:rotate(7deg) translateY(-5px)}
.v4ler .bsh .sp .tb{position:absolute;left:0;right:0;top:0;background:var(--c2)}
.v4ler .bsh .sp .fb{position:absolute;left:2px;right:2px;height:1px;background:var(--k);opacity:.55}
.v4ler .bsh .sp .lb{position:absolute;left:2px;right:2px;border-radius:1px;background:rgba(0,0,0,.42);box-shadow:inset 0 0 0 .5px rgba(255,220,150,.45)}
.v4ler .bsh .sp .tt,.v4ler .bsh .sp .au{position:absolute;left:0;right:0;display:block;width:fit-content;max-width:100%;writing-mode:vertical-rl;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1;z-index:1;margin:auto}
.v4ler .bsh .sp .tt.w2{white-space:normal;line-height:1.02;text-overflow:clip}
.v4ler .bsh .sp .au{font-size:6.6px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;opacity:.78}
.v4ler .bsh .sp .pm{position:absolute;left:50%;bottom:5px;width:6px;height:6px;margin-left:-3px;z-index:1;opacity:.75}
.v4ler .bsh .sp .pm.p0{border-radius:50%;background:var(--k)}
.v4ler .bsh .sp .pm.p1{border-radius:50%;border:1px solid var(--k)}
.v4ler .bsh .sp .pm.p2{background:var(--k);transform:rotate(45deg) scale(.78)}
.v4ler .bsh .sp .pm.p3{width:8px;margin-left:-4px;height:2px;border-top:1px solid var(--k);border-bottom:1px solid var(--k)}
.v4ler .bsh .sp.f0 .tt{font-family:var(--f-disp,Georgia,serif);font-weight:600}
.v4ler .bsh .sp.f1 .tt{font-family:var(--f-disp,Georgia,serif);font-style:italic;font-weight:600}
.v4ler .bsh .sp.f2 .tt{font-weight:800;text-transform:uppercase;letter-spacing:.16em}
.v4ler .bsh .sp.f3 .tt{font-family:'Arial Narrow','Roboto Condensed',Arial,sans-serif;font-weight:900;text-transform:uppercase;letter-spacing:.01em}
.v4ler .bsh .sp.f4 .tt{font-family:var(--f-disp,Georgia,serif);font-variant:small-caps;letter-spacing:.06em;font-weight:500}
.v4ler .bsh .sp .rb{position:absolute;top:-13px;left:22%;width:max(6px,46%);max-width:12px;height:20px;background:linear-gradient(180deg,#fbf3e2,#efe2c6);border-radius:1px 1px 0 0;box-shadow:0 0 0 .5px rgba(0,0,0,.25);z-index:-1}
.v4ler .bsh .sp .rb::after{content:'';position:absolute;left:50%;top:3px;width:4px;height:4px;margin-left:-2px;border-radius:50%;background:var(--acc)}
.v4ler .bsh .sp .cs{position:absolute;inset:0;background-size:auto 100%;background-position:0 0;background-repeat:no-repeat;opacity:.55;filter:saturate(.9) brightness(.8);z-index:0;pointer-events:none}
.v4ler .bsh .sp .sr{position:absolute;left:50%;transform:translateX(-50%);z-index:2;font-size:8px;line-height:1;color:#f3cf6b;text-shadow:0 0 2px rgba(0,0,0,.6)}
.v4ler .bsh .pile{flex:none;position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-end;margin:0 5px 0 4px}
.v4ler .bsh .pb{position:relative;display:flex;align-items:center;box-sizing:border-box;padding:0 7px;border-radius:1.5px;font-size:7px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;overflow:hidden;cursor:pointer;background:var(--c);color:var(--k);box-shadow:0 0 0 .5px rgba(0,0,0,.25)}
.v4ler .bsh .pb::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0) 30%,rgba(0,0,0,0) 65%,rgba(0,0,0,.3))}
.v4ler .bsh .pb span:where(:not(.pbsp):not(.pbsp *)){position:relative;overflow:hidden;text-overflow:ellipsis}
.v4ler .bsh .pb.pbm{background:none;padding:0;box-shadow:none;overflow:visible;white-space:normal;letter-spacing:normal;text-transform:none;font:inherit} /* a lombada girada usa o próprio layout (quebra em linhas, fonte mínima) — 24/11 */.v4ler .bsh .pb.pbm::before{display:none}
.v4ler .bsh .pb .pbsp{position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none;overflow:visible}.v4ler .bsh .pb .pbsp>.sp{margin:0!important;transform:none!important;flex:none}
.v4ler .bsh .pb.sf span:where(:not(.pbsp):not(.pbsp *)){font-family:var(--f-disp,Georgia,serif);font-style:italic;text-transform:none;letter-spacing:.02em;font-size:8.5px}
.v4ler .bsh .face{flex:none;position:relative;align-self:flex-end;margin:0 7px 0 5px;padding:0;border:0;background:none;cursor:pointer;transform:rotate(-4deg);transform-origin:50% 100%}
.v4ler .bsh .face .cv{width:84px;height:126px;font-size:8.5px;border-radius:2px;box-shadow:4px 3px 8px rgba(0,0,0,.35),inset -2px 0 3px rgba(0,0,0,.25)}
.v4ler .bsh .dec{flex:none;align-self:flex-end;position:relative;margin:0 5px;pointer-events:none}
.v4ler .bsh .dec svg{display:block;overflow:visible}
.v4ler .bsh .ghost{flex:1;align-self:center;text-align:center;font-size:12px;font-weight:700;color:var(--bk-hint);opacity:.8;padding:0 10px}
.v4ler .bsh .hint{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:center;margin:0 12px 10px;font-size:11.5px;font-weight:700;color:var(--bk-hint)}
.v4ler .bsh .hint .k1{display:inline-block;width:6px;height:10px;margin-right:4px;vertical-align:-1px;border-radius:1px;background:#f6ecd6;box-shadow:0 0 0 1px rgba(0,0,0,.25);position:relative}
.v4ler .bsh .hint .k1::after{content:'';position:absolute;left:1px;top:2px;width:4px;height:4px;border-radius:50%;background:var(--acc)}
.v4ler .bsh .hint .k2{color:#d9a93a;margin-right:3px}
.v4ler .bsh .hint .r{margin-left:auto}
.v4ler .bsh.sm{margin:8px 0 0;padding:8px 0 0;border-radius:12px;overflow:hidden}
.v4ler .bsh.sm .case{margin:0}
.v4ler .bsh.sm .brow{height:104px}
.v4ler .bsh.sm .bpl{height:10px}
.v4ler .bsh.sm .crown{height:8px}
.v4ler .bsh.sm .sp .au,.v4ler .bsh.sm .sp .pm{display:none}
.v4ler .bsh.sm .sp .rb{top:-7px;height:14px;width:4px;margin-left:-2px}
.v4ler .addsm{width:40px;height:40px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);display:grid;place-items:center;cursor:pointer;flex:none}
.v4ler .addsm svg{width:20px;height:20px}
@media (prefers-reduced-motion: reduce){.v4ler .bsh .lt i{animation:none}
.v4ler .bsh .sp{transition:none}
}

.v4ler .shtop{display:flex;align-items:center;gap:5px;margin:2px 0 10px}
.v4ler .shsel{flex:1;min-width:0;display:grid;grid-template-columns:auto auto;justify-content:start;align-items:center;column-gap:5px;min-height:40px;padding:0 2px;border:0;background:none;color:var(--ink);font:inherit;font-weight:800;font-size:15.5px;line-height:1.15;cursor:pointer;text-align:left}
.v4ler .shsel small{grid-column:1 / -1}
.v4ler .shsel b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.v4ler .shsel small{font-size:12px;font-weight:700;color:var(--mut);white-space:nowrap}
.v4ler .shsel i{font-style:normal;font-size:11px;color:var(--mut)}
.v4ler .shic{width:38px;height:38px;flex:none;display:grid;place-items:center;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer}
.v4ler .shic svg{width:19px;height:19px}
.v4ler .shic.q{width:28px;height:28px;border-radius:50%;font-weight:900;font-size:13px;border-color:transparent;background:var(--soft);color:var(--mut)}
.v4ler .shtopw .bsh .hint{display:none}
.v4ler .shleg{display:grid;gap:10px;margin:4px 0 2px}
.v4ler .shleg div{display:flex;align-items:center;gap:10px;font-size:14px}
.v4ler .shleg .k1{width:8px;height:14px;border-radius:1px;background:#f6ecd6;box-shadow:0 0 0 1px rgba(0,0,0,.25);flex:none;border-top:4px solid #e7934c}
.v4ler .shleg .k2{color:#e2b23f;font-size:16px;width:8px;text-align:center}
.v4ler .shfl .li small{margin-left:auto;color:var(--mut);font-weight:700}
.v4ler .shfl .li.on{background:var(--soft)}
.v4ler .shfl h4{margin:12px 4px 6px;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;color:var(--mut)}
.v4ler .pfsh{margin-top:12px}
.v4ler .pfsh .chips{margin-bottom:6px}
.v4ler .pfsh .chip svg{width:11px;height:11px;margin-left:3px;vertical-align:-1px}
.v4ler .pfsh .pfl{margin:2px 2px 8px;font-size:12.5px;font-weight:700;color:var(--mut)}
.v4ler .pfsh .pfbox{position:relative;max-height:440px;overflow-y:auto;overscroll-behavior:contain;border-radius:18px;border:1px solid var(--line);box-shadow:0 10px 24px rgba(0,0,0,.12)}
.v4ler .pfsh .pfbox .bsh{margin:0;padding:12px 0 14px}
.v4ler .pfsh .pfbox .bsh .hint{display:none}
.v4ler .pfsh .pfbox .brow.few{justify-content:center}
.v4ler .pfsh .pfbox .bay:not(:has(.sp,.v4ler .pile,.v4ler .face)),.v4ler .pfsh .pfbox .bay:not(:has(.sp,.v4ler .pile,.v4ler .face)) + .bpl{display:none}
.v4ler .pfsh .pfall{display:block;width:100%;margin-top:8px;min-height:40px;border:0;background:none;color:var(--acc);font:inherit;font-weight:800;cursor:pointer}

.v4ler{--mut:var(--ink2)}
.v4ler.shxr{position:static!important;inset:auto!important;z-index:auto!important}
.v4ler .shtopw>.shban{top:calc(var(--shx-sticky,0px) + 6px)}
.v4ler .shtopw>.bsh{margin-left:calc(-1 * var(--shx-pad,16px));margin-right:calc(-1 * var(--shx-pad,16px))}
.v4ler .lbl{font-size:10.5px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:var(--ink3);margin:14px 0 2px}
.v4ler .vtog{display:inline-flex;gap:2px;padding:3px;border-radius:12px;background:var(--soft)}.v4ler .vtog button{display:inline-flex;align-items:center;gap:5px;min-height:34px;padding:0 10px;border:0;border-radius:9px;background:none;color:var(--ink2);font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}.v4ler .vtog button.on{background:var(--card);color:var(--ink);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.v4ler .shx-sx{position:fixed;inset:0;z-index:9800;background:rgba(0,0,0,.45);display:grid;align-items:end}
.v4ler .shx-sx>div{background:var(--bg,var(--card));color:var(--ink);border-radius:20px 20px 0 0;padding:16px max(16px,env(safe-area-inset-left,0px)) calc(16px + env(safe-area-inset-bottom,0px));display:grid;gap:8px;max-width:560px;width:100%;margin:0 auto;box-sizing:border-box}
.v4ler .shx-sx>div>b{font-size:17px}.v4ler .shx-sx .btn{min-height:46px;justify-content:center}
.v4ler .shx-sx .btn:not(.p):not(.s){background:var(--soft);color:var(--ink)}
`;
const SHX_ST = { LENDO: 'lendo', LIDO: 'lido', QUERO: 'quero', HIBERNANDO: 'pausado', ABANDONEI: 'abandonado' };
let SHX_CTX = null, SHX_VB = null, SHX_VIS = false, SHX_MODE = null, SHX_VER = 0, SHX_W = 0;
const SHX_ROOTS = new Set(); // raízes onde há estante desenhada (Biblioteca, perfil, folhas): a cor amostrada entra em todas
function shDefaults(o) { const d = { ed: {}, sp: {}, ord: null, lay: {}, manual: 0, deco: null, wood: 'auto', wall: 'linho', lt: { on: 1, c: 'quente' }, spMode: 'capa' }; Object.keys(d).forEach((k) => { if (o[k] === undefined) o[k] = d[k]; }); if (!o.ed || typeof o.ed !== 'object') o.ed = {}; if (!o.sp || typeof o.sp !== 'object') o.sp = {}; if (!o.lay || typeof o.lay !== 'object') o.lay = {}; return o; }
function shc() { if (SHX_CTX) return SHX_CTX; const P = v5P(); if (!P.shx || typeof P.shx !== 'object') P.shx = {}; return shDefaults(P.shx); }
function shSave() { SHX_VER++; v5Save(); try { publishSnapshotSoon(); } catch {} }
function shMode() { return SHX_CTX ? null : SHX_MODE; }
const shView = () => (v5P().shView === 'prat' ? 'prat' : 'grade');
const shDark = () => document.documentElement.getAttribute('data-theme') === 'dark';
// livro da Biblioteca no formato do protótipo
const shB = (e) => ({ id: String(e.id), t: e.title || '', a: e.author || '', st: SHX_ST[e.status] || 'quero', tot: Number(e.totalPages) || Number(e.meta && (e.meta.pages || e.meta.pageCount)) || 0, img: e.cover || null });
function shById(id) { if (SHX_VB) { const x = SHX_VB[id]; return x ? { id, ...x } : null; } const e = v5Book(id); return e ? shB(e) : null; }
function shEdOf(b) { const e = b && shc().ed && shc().ed[b.id]; return e ? { t: e.t, e: e.e } : { t: 'auto' }; }
let SH_SPN_TEX = 'cor'; // textura da lombada da capa: 'cor' (cor amostrada) ou 'fatia' (borda esquerda da capa)
const spnHash = (s) => { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; } return h; };
// cores tiradas de lombadas reais (fundo, letra): creme, preto, marinho, vinho, verde-floresta, mostarda, rosa antigo, petróleo, terracota...
const SH_PAL = [['#efe6d6', '#2a2420'], ['#1d1d1f', '#e9dcc3'], ['#1f2f4a', '#e8d7a8'], ['#6e1f2a', '#f2e2c4'], ['#2f4a3a', '#e9e0c8'], ['#c58b3a', '#2a1d10'], ['#d8a9a1', '#3b2228'], ['#2c5f63', '#f0e7d4'], ['#b3532f', '#fbeee0'], ['#9fae8f', '#26301f'], ['#a89bc4', '#2a2240'], ['#e46f5a', '#2b1410'], ['#f4f1ea', '#7a2230'], ['#3a3f47', '#d8c27a'], ['#6b5a8c', '#f1e9ff'], ['#e9c46a', '#3a2a0c'], ['#4b2e2b', '#e8c99a'], ['#5b7f9e', '#f3f0e8'], ['#d9cfc0', '#4b3a2a'], ['#20364a', '#f2a07e'], ['#8c2f39', '#f6d58e'], ['#f2d7c9', '#5a2d3a'], ['#284139', '#e7c17a'], ['#141a2e', '#c8b6ff']];
const shLum = (hex) => { const m = String(hex).replace('#', ''); const n = parseInt(m.length === 3 ? m.replace(/./g, '$&$&') : m.slice(0, 6), 16); const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255; return (0.299 * r + 0.587 * g + 0.114 * b) / 255; };
const shMix = (hex, t, to) => { const p = (x) => { const m = String(x).replace('#', ''); const n = parseInt(m.length === 3 ? m.replace(/./g, '$&$&') : m.slice(0, 6), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }; const a = p(hex), b = p(to); return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`; };
// formato → altura (px por cm ≈ 6,1); páginas → grossura
const SH_FMT = [['p', 18, 8], ['a', 21, 45], ['m', 23, 25], ['h', 23.5, 15], ['g', 24, 7]];
function spnGeo(b, sm) { const h0 = spnHash(b.t + '|' + (b.a || '')); let r = h0 % 100, f = SH_FMT[1]; for (const x of SH_FMT) { if (r < x[2]) { f = x; break; } r -= x[2]; }
  // 22/11 (Bia): grossura proporcional às páginas (100 p ≈ 10 px … 1.000 p ≈ 64 px; teto só acima de ~1.100 p). Sem páginas: 300 (neutro).
  // Capa dura só soma espessura (+2 px) quando a edição escolhida pela pessoa diz capa dura; nada sorteado.
  const pages = b.tot || 300, ov = shEdOf(b), hc0 = f[0] === 'h' || (f[0] === 'g' && h0 % 2 === 0), hc = ov.t === 'hc' || ov.t === 'ep' ? true : (ov.t === 'pb' || ov.t === 'bp') ? false : hc0;
  let h = Math.round(f[1] * 6.15 + ((h0 >>> 3) % 5) - 2) + (hc && !hc0 ? 5 : 0), w = Math.round(Math.max(8, Math.min(70, 10 + (pages - 100) * 0.06 + (ov.t === 'hc' || ov.t === 'ep' ? 2 : 0))));
  if (sm) { h = Math.round(h * 0.6); w = Math.max(8, Math.round(w * 0.6)); } return { h, w, hc, pages, h0 }; }
// livro deitado: espessura pelas páginas, na mesma escala da lombada em pé (Bia 23/11); pilha alta demais encolhe por igual
function shPileHts(bs, room) { const hs = bs.map((x) => spnGeo(x, false).w), t = hs.reduce((a, h) => a + h, 0), R = room || 150; const k = t > R ? R / t : 1; return hs.map((h) => Math.max(7, Math.round(h * k))); }
// livro deitado = a mesma lombada do livro em pé (modelo, arte, fonte, cor, enfeites), só girada (Bia 24/11)
function shPbInner(x, wv, ht) { const m0 = SHX_MODE; try { SHX_MODE = null; const G = spnGeo(x, false);
    const s = spnHTML({ ...x, lean: 0 }, false).replace(/ data-bid="/, ' data-pbid="').replace(/ data-a="[^"]*"| data-id="[^"]*"| data-long="[^"]*"| role="button"| tabindex="[^"]*"| aria-label="[^"]*"/g, '').replace('<button type="button"', '<span').replace(/<\/button>\s*$/, '</span>');
    return `<span class="pbsp" aria-hidden="true" style="width:${G.w}px;height:${G.h}px;transform:translate(0,${ht}px) rotate(-90deg) scale(${(ht / G.w).toFixed(4)},${(wv / G.h).toFixed(4)})">${s}</span>`; } catch { return null; } finally { SHX_MODE = m0; } }
function spnColors(b) { const g = spnHash(b.t + '|' + (b.a || '')); const p = SH_PAL[g % SH_PAL.length], q = SH_PAL[(g >>> 5) % SH_PAL.length]; return [p[0], p[1], q[0]]; }
// ação de tocar num livro: na sua estante abre o livro (segurar abre o menu); na estante de outra pessoa abre a página do livro
const shAct = (b, long) => SHX_VIS ? ` data-a="shxvb" data-id="${esc(b.id)}"` : ` data-a="v5book" data-id="${esc(b.id)}"${long ? ' data-long="bm"' : ''}`;
function spnHTML(b, sm) { const G = spnGeo(b, sm), hh = G.h0, [c, k, c2] = spnColors(b), w = G.w, h = G.h, ov = shEdOf(b), C0 = shc();
  // estilo: brochura (lisa), capa dura (douração), tecido (etiqueta), duas cores; a edição marcada pela pessoa manda
  let sty = G.hc ? (hh % 3 === 0 ? 'cl' : 'hc') : (hh % 5 === 0 ? 'dt' : 'pb');
  if (ov.t === 'hc' && sty === 'cl') sty = 'hc'; if (ov.t === 'ep') sty = 'ep'; if (ov.t === 'pb' && sty === 'dt') sty = 'pb';
  // lombada: foto da pessoa > tirada da capa (faixa da borda esquerda + cor amostrada) > desenhada
  const photo = (C0.sp && C0.sp[b.id]) || null, spM = (C0.spb && C0.spb[b.id]) || C0.spMode, cvUrl = !photo && spM !== 'desenho' && b.img ? cssUrl(b.img) : '';
  // lombada da capa: cor sólida + faixa da arte; sem etiqueta escura nem tarja (nada de caixa por trás do título)
  if (cvUrl && (sty === 'cl' || sty === 'dt')) sty = G.hc ? 'hc' : 'pb';
  let fi = sty === 'cl' ? 4 : sty === 'ep' ? 0 : (hh >>> 9) % 4; if (String(b.t).length > 13 && fi === 2) fi = hh % 2 ? 3 : 0;
  const cls = `sp ${sty} f${fi}${b.lean ? ' lean' + (b.lean === 2 ? ' lr' : '') : ''}${cvUrl ? ' cvs' : ''}${photo ? ' ph' : ''}`;
  // título de cima para baixo; ocupa o meio da lombada; autor no terço de baixo; marca da editora no pé
  // 22/11 (Bia): sem o sufixo de série "(Next, #1)" na lombada; a página do livro continua com ele
  const t = String(b.t).replace(/\s*\((?=[^)]*#\s*\d)[^)]*\)\s*$/, '').trim() || String(b.t), au = String(b.a || '').split(' ').slice(-1)[0], sz = sm ? 0.6 : 1;
  const hasAu = !sm && w >= 15 && !!au, auH0 = hasAu ? Math.round(h * 0.22) : 0, foot = sm ? (b.st === 'lido' ? 9 : 5) : (w >= 13 || b.st === 'lido' ? 15 : 7);
  // 22/11 (Bia): sem a faixa de capa no topo; a lombada leva a cor da capa (modo fatia: borda esquerda da capa, escurecida)
  const topR0 = Math.round(h * (sty === 'dt' ? 0.21 : 0.07)), topR = topR0, botR = foot + auH0 + (hasAu ? 5 : 0), L = h - topR - botR;
  const kk = fi === 2 ? 0.86 : fi === 3 ? 0.5 : 0.56; let fs = Math.min(w * 0.6, 13.5 * sz), nl = 1;
  // não cabe numa linha: quebra entre palavras (2 linhas; 3 na lombada larga) antes de diminuir a letra
  if (t.length * fs * kk > L) { const words = t.split(/\s+/).length, mx = sm || words < 2 ? 1 : Math.min(words, w >= 40 ? 3 : 2);
    for (let n = 2; n <= mx && nl === 1; n++) { const f2 = Math.min(13.5 * sz, (w * 0.84) / (n * 1.06)); if ((t.length / n) * 1.34 * f2 * kk <= L - 4 && f2 >= 7 * sz) { fs = f2; nl = n; } }
    if (nl === 1 && mx >= 2) { const f2 = Math.min((w * 0.84) / 2.12, ((L - 4) * 2) / (t.length * kk * 1.34)); if (f2 > L / (t.length * kk) && f2 >= 5.6 * sz) { fs = f2; nl = 2; } }
    if (nl === 1) fs = L / (t.length * kk); }
  fs = Math.max(5.6 * sz, fs);
  const smp = cvUrl ? shSampled(b) : null, cc = smp ? smp.c : c, kx = sty === 'ep' ? '#efd28a' : smp ? smp.k : k;
  let deco = '';
  if (sty === 'dt') deco += `<span class="tb" style="height:${Math.round(h * 0.17)}px;--c2:${c2}"></span>`;
  // frisos nunca cruzam texto: o do meio fica entre o título e o autor (22/11)
  if (sty === 'hc') deco += `<span class="fb" style="top:5px"></span><span class="fb" style="top:8px;opacity:.3"></span><span class="fb" style="bottom:${hasAu ? botR - 3 : Math.round(h * 0.27)}px"></span><span class="fb" style="bottom:2px"></span>`;
  if (sty === 'ep') deco += `<span class="fb" style="top:5px"></span><span class="fb" style="top:8px"></span><span class="orn" style="top:${Math.max(12, topR - 9)}px"></span><span class="orn" style="bottom:${Math.max(9, botR - 4)}px"></span><span class="fb" style="bottom:3px"></span><span class="fb" style="bottom:1px"></span>`;
  if (sty === 'cl') deco += `<span class="lb" style="top:${topR - 3}px;height:${L + 6}px"></span><span class="fb" style="top:4px;opacity:.6"></span><span class="fb" style="bottom:4px;opacity:.6"></span>`;
  const edge = ov.t === 'bp' ? `<span class="eg" style="--eg:${ov.e || '#b3283f'}"></span>` : sty === 'ep' ? '<span class="eg" style="--eg:linear-gradient(90deg,#8a6a22,#f4dd8e 45%,#8a6a22)"></span>' : '';
  if (cvUrl && SH_SPN_TEX === 'fatia') deco += `<span class="cs" style="background-image:${cvUrl}"></span>`;
  const mk = b.st === 'lendo' ? '<span class="rb" aria-hidden="true"></span>' : b.st === 'lido' ? `<span class="sr" aria-hidden="true" style="bottom:${sm ? 2 : 4}px">✦</span>` : '';
  const lab = `${t}${b.a ? ', ' + b.a : ''}${b.st === 'lendo' ? ', lendo' : b.st === 'lido' ? ', lido' : b.st === 'quero' ? ', quero ler' : b.st === 'pausado' ? ', pausado' : b.st === 'abandonado' ? ', abandonado' : ''}`;
  const tag = sm ? 'span' : 'button', at = sm || shMode() ? '' : shAct(b, true);
  const auH = hasAu ? `<span class="au" style="bottom:${foot}px;height:${auH0}px;font-size:${Math.min(6.8, w * 0.36).toFixed(1)}px">${esc(au)}</span>` : '';
  // marca de editora (◆ ○ ▬) saiu: parecia sinal de status; o único sinal no pé é a ✦ de lido
  const pm = false ? `<span class="pm p${(hh >>> 13) % 4}" aria-hidden="true"></span>` : '';
  const bg = photo ? `;background-image:url('${photo}')` : '';
  const inner = photo ? edge : `${deco}${edge}<span class="tt${nl > 1 ? ' w2' : ''}" style="top:${topR}px;height:${L}px;font-size:${fs.toFixed(1)}px${nl > 1 ? `;-webkit-line-clamp:${nl}` : ''}">${esc(t)}</span>${auH}${pm}`;
  return `<${tag}${tag === 'button' ? ' type="button"' : ''} class="${cls}"${at} data-bid="${esc(b.id)}"${cvUrl ? ` data-sk="${spnHash(b.img)}"` : ''} aria-label="${esc(lab)}" style="width:${w}px;height:${h}px;--c:${cc};--k:${kx}${bg}${b.lean ? `;margin-${b.lean === 2 ? 'right' : 'left'}:${Math.ceil(h * 0.125)}px` : ''}">${inner}${mk}</${tag}>`; }
// objetos (desenho próprio, nos tons do universo do app); s = escala
const SH_DEC = {
  lua: (s) => `<svg width="${34 * s}" height="${92 * s}" viewBox="0 0 34 92" aria-hidden="true"><defs><linearGradient id="bkl1" x1="0" x2="1"><stop offset="0" stop-color="#8a6326"/><stop offset=".45" stop-color="#e9c46a"/><stop offset="1" stop-color="#9a6f2c"/></linearGradient></defs><path d="M28 6C10 14 4 34 8 52s16 28 24 30c-16-8-22-24-20-40S20 12 28 6z" fill="url(#bkl1)"/><circle cx="21" cy="30" r="1.2" fill="#fff3c4"/><circle cx="17" cy="50" r=".9" fill="#fff3c4"/><rect x="2" y="82" width="30" height="10" rx="1.5" fill="#5b3f1c"/><rect x="2" y="82" width="30" height="3" rx="1" fill="#a07a3c"/></svg>`,
  globo: (s) => `<svg width="${54 * s}" height="${86 * s}" viewBox="0 0 54 86" aria-hidden="true"><defs><radialGradient id="bkg1" cx="38%" cy="32%"><stop offset="0" stop-color="#4a6fa5"/><stop offset=".7" stop-color="#1c2f52"/><stop offset="1" stop-color="#0e1730"/></radialGradient><linearGradient id="bkg2" x1="0" x2="1"><stop offset="0" stop-color="#8a6326"/><stop offset=".5" stop-color="#e2bd66"/><stop offset="1" stop-color="#8a6326"/></linearGradient></defs><path d="M27 64v12" stroke="url(#bkg2)" stroke-width="3"/><ellipse cx="27" cy="80" rx="14" ry="4.5" fill="#6d4c22"/><ellipse cx="27" cy="78.5" rx="14" ry="3" fill="url(#bkg2)"/><path d="M5 38a22 22 0 0 0 44 0" fill="none" stroke="url(#bkg2)" stroke-width="2.2"/><circle cx="27" cy="36" r="19" fill="url(#bkg1)"/><g stroke="#e6c574" stroke-width=".6" fill="none" opacity=".75"><path d="M14 28l6 4 7-6 8 5 6-3"/><path d="M12 42l7-2 5 5 9-4"/></g><g fill="#fff4cf"><circle cx="14" cy="28" r="1"/><circle cx="20" cy="32" r=".8"/><circle cx="27" cy="26" r="1.1"/><circle cx="35" cy="31" r=".8"/><circle cx="41" cy="28" r=".9"/><circle cx="19" cy="40" r=".7"/><circle cx="24" cy="45" r=".9"/><circle cx="33" cy="41" r=".8"/></g><ellipse cx="21" cy="27" rx="6" ry="4" fill="#fff" opacity=".12"/></svg>`,
  planta: (s) => `<svg width="${62 * s}" height="${120 * s}" viewBox="0 0 62 120" aria-hidden="true" style="margin-bottom:${-34 * s}px"><path d="M16 60h30l-3 26H19z" fill="#d9d2c5"/><path d="M16 60h30l-.6 5H16.6z" fill="#efe9de"/><path d="M19 86h24" stroke="rgba(0,0,0,.15)"/><g fill="none" stroke="#3f6b45" stroke-width="1.4" stroke-linecap="round"><path d="M20 62c-8 8-12 22-10 38s4 18 2 20"/><path d="M42 62c6 10 9 24 8 36"/></g><g fill="#4f8a56"><ellipse cx="11" cy="74" rx="5" ry="3.2" transform="rotate(-30 11 74)"/><ellipse cx="9" cy="90" rx="5" ry="3.2" transform="rotate(20 9 90)"/><ellipse cx="11" cy="106" rx="4.6" ry="3" transform="rotate(-25 11 106)"/><ellipse cx="13" cy="118" rx="4" ry="2.6"/><ellipse cx="49" cy="74" rx="5" ry="3.2" transform="rotate(30 49 74)"/><ellipse cx="51" cy="90" rx="4.6" ry="3" transform="rotate(-15 51 90)"/></g><g fill="#5e9e64"><path d="M31 60c-4-10-14-16-22-14 4 8 12 14 22 14z"/><path d="M31 60c4-12 14-20 24-18-4 10-14 17-24 18z"/><path d="M31 60c-2-14 2-26 8-32 2 12-2 24-8 32z"/><path d="M31 60c-6-8-8-20-4-30 6 8 8 20 4 30z" fill="#6cae71"/></g></svg>`,
  vela: (s) => `<svg width="${34 * s}" height="${56 * s}" viewBox="0 0 34 56" aria-hidden="true"><defs><radialGradient id="bkv1" cx="50%" cy="30%" r="60%"><stop offset="0" stop-color="#ffe3a3" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient></defs><circle cx="17" cy="18" r="17" fill="url(#bkv1)"/><path d="M4 24h26v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" fill="#f3ead6" opacity=".55"/><path d="M6 30h22v20a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z" fill="#efe2c7"/><path d="M17 30v-5" stroke="#3b2a1a" stroke-width="1"/><path d="M17 16c3 3 3 7 0 9-3-2-3-6 0-9z" fill="#ffb648"/><path d="M17 20c1.2 1.4 1.2 3 0 4-1.2-1-1.2-2.6 0-4z" fill="#fff1c2"/><path d="M4 24h26" stroke="rgba(255,255,255,.6)"/></svg>`,
  quadro: (s) => `<svg width="${60 * s}" height="${84 * s}" viewBox="0 0 60 84" aria-hidden="true" style="transform:rotate(4deg);transform-origin:50% 100%"><rect x="2" y="2" width="56" height="80" rx="1.5" fill="#6b4a2a"/><rect x="2" y="2" width="56" height="80" rx="1.5" fill="none" stroke="#c99a58" stroke-width="2"/><rect x="8" y="8" width="44" height="68" fill="#14203a"/><g stroke="#e8c879" stroke-width=".7" fill="none" opacity=".9"><path d="M16 22l9 8 8-4 7 10 6 14"/><path d="M33 26l-2 14 9 6"/></g><g fill="#fff6d6"><circle cx="16" cy="22" r="1.3"/><circle cx="25" cy="30" r="1"/><circle cx="33" cy="26" r="1.4"/><circle cx="40" cy="36" r="1"/><circle cx="46" cy="50" r="1.2"/><circle cx="31" cy="40" r=".9"/><circle cx="40" cy="46" r=".9"/><circle cx="14" cy="60" r=".6"/><circle cx="22" cy="66" r=".5"/><circle cx="44" cy="64" r=".6"/></g><text x="30" y="71" text-anchor="middle" font-size="4.2" fill="#c9b88a" font-family="Georgia,serif" letter-spacing=".6">CASSIOPEIA</text></svg>`,
  telescopio: (s) => `<svg width="${56 * s}" height="${96 * s}" viewBox="0 0 56 96" aria-hidden="true"><defs><linearGradient id="bkt1" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#36507c"/><stop offset="1" stop-color="#1a2846"/></linearGradient><linearGradient id="bkt2" x1="0" x2="1"><stop offset="0" stop-color="#8a6326"/><stop offset=".5" stop-color="#e6c06a"/><stop offset="1" stop-color="#8a6326"/></linearGradient></defs><g stroke="#4a3220" stroke-width="2.4" stroke-linecap="round"><path d="M28 56L12 94M28 56L44 94M28 56v38"/></g><circle cx="28" cy="55" r="3" fill="url(#bkt2)"/><g transform="rotate(-30 28 50)"><rect x="4" y="44" width="46" height="11" rx="2.5" fill="url(#bkt1)"/><rect x="44" y="41.5" width="9" height="16" rx="2" fill="url(#bkt2)"/><rect x="0" y="46.5" width="6" height="6" rx="1" fill="url(#bkt2)"/><rect x="22" y="44" width="3" height="11" fill="url(#bkt2)"/></g></svg>`,
};
SH_DEC.cristal = (s) => `<svg width="${30 * s}" height="${34 * s}" viewBox="0 0 30 34" aria-hidden="true"><path d="M4 32l4-14 5 14z" fill="#7d5aa8"/><path d="M10 32l5-26 6 26z" fill="#a98bd6"/><path d="M15 6l6 26h-3z" fill="#c9b2ee"/><path d="M19 32l4-16 4 16z" fill="#8d6cc0"/><path d="M2 32h26" stroke="#5c4380" stroke-width="2"/></svg>`;
SH_DEC.globoP = (s) => SH_DEC.globo(s * 0.55);
const SH_DW = { lua: 34, globo: 54, planta: 62, vela: 34, quadro: 60, telescopio: 56 };
Object.assign(SH_DEC, {
  planeta: (s) => `<svg width="${52 * s}" height="${70 * s}" viewBox="0 0 52 70" aria-hidden="true"><defs><radialGradient id="bkp1" cx="35%" cy="30%"><stop offset="0" stop-color="#f6c89a"/><stop offset=".6" stop-color="#c8743f"/><stop offset="1" stop-color="#6e3418"/></radialGradient><linearGradient id="bkp2" x1="0" x2="1"><stop offset="0" stop-color="#8a6326"/><stop offset=".5" stop-color="#ecd08a"/><stop offset="1" stop-color="#8a6326"/></linearGradient></defs><path d="M26 50v12" stroke="#4a3220" stroke-width="2.4"/><ellipse cx="26" cy="65" rx="13" ry="4" fill="#5b3f1c"/><ellipse cx="26" cy="63.6" rx="13" ry="2.8" fill="url(#bkp2)"/><path d="M5 31C8 24 44 18 47 26" fill="none" stroke="url(#bkp2)" stroke-width="2.2" opacity=".55"/><circle cx="26" cy="31" r="17" fill="url(#bkp1)"/><g opacity=".32" fill="none" stroke="#7a3a1a" stroke-width="1.3"><path d="M11 25c8 2 22 2 30-2"/><path d="M10 35c10 2 24 2 32-1"/></g><path d="M3 35c3 6 46-2 46-10" fill="none" stroke="url(#bkp2)" stroke-width="2.6"/><ellipse cx="20" cy="24" rx="5" ry="3.4" fill="#fff" opacity=".18"/></svg>`,
  luminaria: (s) => `<svg width="${46 * s}" height="${100 * s}" viewBox="0 0 46 100" aria-hidden="true"><defs><radialGradient id="bklu1" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".7"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient><linearGradient id="bklu2" x1="0" x2="1"><stop offset="0" stop-color="#1f3a34"/><stop offset=".5" stop-color="#3f7a6c"/><stop offset="1" stop-color="#1f3a34"/></linearGradient></defs><ellipse cx="23" cy="46" rx="23" ry="26" fill="url(#bklu1)"/><path d="M8 34h30l-6-20H14z" fill="url(#bklu2)"/><path d="M8 34h30" stroke="#d9b76a" stroke-width="1.5"/><path d="M14 14h18" stroke="#d9b76a" stroke-width="1"/><ellipse cx="23" cy="35" rx="9" ry="2" fill="#fff3c9" opacity=".9"/><path d="M23 36v52" stroke="#b8924a" stroke-width="2.2"/><path d="M23 52c-6 4-6 10 0 14" stroke="#b8924a" stroke-width="1.6" fill="none"/><ellipse cx="23" cy="94" rx="14" ry="4.5" fill="#6d4c22"/><ellipse cx="23" cy="92.5" rx="14" ry="3" fill="#c9a35a"/></svg>`,
  potinho: (s) => `<svg width="${32 * s}" height="${46 * s}" viewBox="0 0 32 46" aria-hidden="true"><defs><radialGradient id="bkj1" cx="50%" cy="60%" r="55%"><stop offset="0" stop-color="#ffe7a6" stop-opacity=".7"/><stop offset="1" stop-color="#ffd27a" stop-opacity="0"/></radialGradient></defs><ellipse cx="16" cy="28" rx="16" ry="18" fill="url(#bkj1)"/><rect x="8" y="4" width="16" height="6" rx="1.5" fill="#a8743a"/><rect x="8" y="4" width="16" height="2" rx="1" fill="#d3a35c"/><path d="M7 10h18c2 0 3 2 3 4v24c0 3-2 5-5 5H9c-3 0-5-2-5-5V14c0-2 1-4 3-4z" fill="#cfe3ea" fill-opacity=".3" stroke="#e9f3f6" stroke-opacity=".6" stroke-width=".8"/><g fill="#ffd66b"><path d="M12 24l1 2.2 2.4.3-1.8 1.6.5 2.4-2.1-1.2-2.1 1.2.5-2.4-1.8-1.6 2.4-.3z"/><path d="M20 31l.7 1.5 1.6.2-1.2 1.1.3 1.6-1.4-.8-1.4.8.3-1.6-1.2-1.1 1.6-.2z"/><path d="M18 18l.6 1.2 1.3.2-1 .9.3 1.3-1.2-.6-1.2.6.3-1.3-1-.9 1.3-.2z"/><circle cx="11" cy="35" r=".9"/><circle cx="23" cy="22" r=".7"/><circle cx="15" cy="38" r=".6"/></g><path d="M8 14v22" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/></svg>`,
  astronauta: (s) => `<svg width="${44 * s}" height="${60 * s}" viewBox="0 0 44 60" aria-hidden="true"><ellipse cx="22" cy="57" rx="18" ry="3" fill="rgba(0,0,0,.22)"/><rect x="7" y="40" width="10" height="16" rx="5" fill="#e6e4dd"/><rect x="27" y="40" width="10" height="16" rx="5" fill="#e6e4dd"/><rect x="9" y="26" width="26" height="24" rx="10" fill="#f2f1ec"/><rect x="15" y="32" width="14" height="9" rx="2" fill="#d6d2c7"/><circle cx="19" cy="36.5" r="1.4" fill="#e4685a"/><circle cx="24" cy="36.5" r="1.4" fill="#5a8fe4"/><rect x="2" y="28" width="9" height="18" rx="4.5" fill="#e6e4dd" transform="rotate(-14 6 37)"/><rect x="33" y="28" width="9" height="18" rx="4.5" fill="#e6e4dd" transform="rotate(14 38 37)"/><circle cx="22" cy="17" r="14" fill="#f2f1ec"/><ellipse cx="22" cy="18" rx="10" ry="8" fill="#1d2a4d"/><ellipse cx="18" cy="15" rx="3.4" ry="2.2" fill="#8fb4ff" opacity=".55"/><circle cx="26" cy="20" r=".7" fill="#fff"/><circle cx="20" cy="22" r=".5" fill="#fff"/><path d="M8 13c4-8 24-8 28 0" stroke="#d6d2c7" stroke-width="1.2" fill="none"/></svg>`,
  cometa: (s) => `<svg width="${42 * s}" height="${70 * s}" viewBox="0 0 42 70" aria-hidden="true"><defs><linearGradient id="bkc1" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".3" stop-color="#fff" stop-opacity=".05"/><stop offset=".85" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".3"/></linearGradient><linearGradient id="bkc2" x1="0" x2="1"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0"/><stop offset="1" stop-color="#fff6d8"/></linearGradient></defs><rect x="3" y="60" width="36" height="8" rx="2" fill="#6d4c22"/><rect x="3" y="60" width="36" height="2.5" rx="1" fill="#b48a48"/><path d="M9 36l17 7" stroke="url(#bkc2)" stroke-width="5" stroke-linecap="round" opacity=".9"/><circle cx="27" cy="43.5" r="6" fill="#ffd77a" opacity=".25"/><circle cx="27" cy="43.5" r="3.4" fill="#fff6d8"/><g fill="#fff"><circle cx="12" cy="24" r=".8"/><circle cx="30" cy="22" r=".6"/><circle cx="18" cy="52" r=".6"/></g><path d="M6 60V22a15 15 0 0 1 30 0v38z" fill="url(#bkc1)" stroke="#e9f2f5" stroke-opacity=".55" stroke-width=".9"/><path d="M10 24c0-6 3-10 7-11" stroke="#fff" stroke-opacity=".6" stroke-width="1.2" fill="none"/></svg>`,
  foguete: (s) => `<svg width="${32 * s}" height="${68 * s}" viewBox="0 0 32 68" aria-hidden="true"><defs><linearGradient id="bkf1" x1="0" x2="1"><stop offset="0" stop-color="#c9c4ba"/><stop offset=".45" stop-color="#fbf8f1"/><stop offset="1" stop-color="#b8b2a6"/></linearGradient></defs><path d="M16 2c8 8 9 22 7 38H9C7 24 8 10 16 2z" fill="url(#bkf1)"/><path d="M16 2c3 3 5 7 6 11H10c1-4 3-8 6-11z" fill="#c9473f"/><circle cx="16" cy="22" r="4" fill="#2d4f7c" stroke="#d9b76a" stroke-width="1.4"/><circle cx="15" cy="21" r="1.2" fill="#9cc3ff"/><path d="M9 32L3 46l7-3zM23 32l6 14-7-3z" fill="#c9473f"/><path d="M12 40h8l-1 5h-6z" fill="#6b6b6b"/><path d="M13 45c1 5 5 5 6 0" fill="#ffb648" opacity=".9"/><path d="M16 49v7" stroke="#8a6326" stroke-width="1.6"/><rect x="6" y="56" width="20" height="10" rx="2" fill="#5b3f1c"/><rect x="6" y="56" width="20" height="2.5" rx="1" fill="#a07a3c"/></svg>`,
  xicara: (s) => `<svg width="${42 * s}" height="${46 * s}" viewBox="0 0 42 46" aria-hidden="true"><g fill="none" stroke="#cbbfa8" stroke-opacity=".7" stroke-width="1.3" stroke-linecap="round"><path d="M14 14c-3-4 3-6 0-10"/><path d="M21 13c-3-4 3-6 0-10"/></g><ellipse cx="20" cy="44" rx="18" ry="2" fill="rgba(0,0,0,.18)"/><path d="M32 24c6 0 8 3 7 7s-5 5-8 4" fill="none" stroke="#e2dccf" stroke-width="3"/><path d="M4 20h28v12a10 10 0 0 1-10 10h-8A10 10 0 0 1 4 32z" fill="#ebe5d8"/><path d="M9 31c3 2 15 2 18 0" stroke="#c99a58" stroke-width="1" fill="none"/><ellipse cx="18" cy="20.5" rx="14" ry="2.4" fill="#f7f3ea"/><ellipse cx="18" cy="21" rx="12" ry="1.8" fill="#5a3a22"/></svg>`,
});
Object.assign(SH_DW, { planeta: 52, luminaria: 46, potinho: 32, astronauta: 44, cometa: 42, foguete: 32, xicara: 42, cristal: 30 });
const SH_DH = { lua: 92, globo: 86, planta: 86, vela: 56, quadro: 84, telescopio: 96, cristal: 34, planeta: 70, luminaria: 100, potinho: 46, astronauta: 60, cometa: 70, foguete: 68, xicara: 46 };
const SH_CAT = [['lua', 'Lua aparadora'], ['planeta', 'Planeta com anel'], ['telescopio', 'Telescópio'], ['globo', 'Globo celeste'], ['planta', 'Planta'], ['luminaria', 'Luminária'], ['potinho', 'Potinho de estrelas'], ['quadro', 'Quadro de constelação'], ['astronauta', 'Astronauta de pelúcia'], ['cometa', 'Cometa na redoma'], ['foguete', 'Foguete de brinquedo'], ['vela', 'Vela'], ['xicara', 'Xícara'], ['cristal', 'Cristal']];
const SH_DN = Object.fromEntries(SH_CAT);
// cor da lombada amostrada na capa (borda esquerda da imagem): fica guardada no aparelho e entra nos elementos já desenhados.
// Capa de outro site sem permissão de leitura (CORS): a imagem não carrega no canvas e a lombada fica com a cor da paleta.
const SH_SC = (() => { try { return JSON.parse(localStorage.getItem('lv.shsc2') || '{}') || {}; } catch { return {}; } })(), SH_SCq = {};
let SH_SCt = 0; const shScSave = () => { clearTimeout(SH_SCt); SH_SCt = setTimeout(() => { try { const ks = Object.keys(SH_SC); if (ks.length > 900) ks.slice(0, ks.length - 900).forEach((k) => delete SH_SC[k]); localStorage.setItem('lv.shsc2', JSON.stringify(SH_SC)); } catch {} }, 1500); };
function shSampled(b) { const key = spnHash(b.img); const v = SH_SC[key]; if (v) return v === 1 ? null : { c: v[0], k: v[1] }; if (!SH_SCq[key]) { SH_SCq[key] = 1; setTimeout(() => shSample(b.img, key), 0); } return null; }
// cor predominante da capa (a mesma para lombada, bandeja e Arrumar por cor): capa inteira em 48x72, sem 8% das bordas, histograma por tons; se a mais frequente for quase branca/preta e houver uma cor viva com mais de 20% da área, fica a viva
function shDomRgb(im) { const W = 48, H = 72, cn = document.createElement('canvas'); cn.width = W; cn.height = H; const x = cn.getContext('2d'); x.drawImage(im, 0, 0, W, H); const d = x.getImageData(0, 0, W, H).data, bins = new Map(), mx = Math.round(W * 0.08), my = Math.round(H * 0.08); let tot = 0;
  for (let yy = my; yy < H - my; yy++) for (let xx = mx; xx < W - mx; xx++) { const i = (yy * W + xx) * 4, r = d[i], g = d[i + 1], b = d[i + 2], k = (r >> 5) * 64 + (g >> 5) * 8 + (b >> 5); const o = bins.get(k) || { n: 0, r: 0, g: 0, b: 0 }; o.n++; o.r += r; o.g += g; o.b += b; bins.set(k, o); tot++; }
  const L = [...bins.values()].map((o) => { const r = o.r / o.n, g = o.g / o.n, b = o.b / o.n, M = Math.max(r, g, b), m = Math.min(r, g, b); return { n: o.n, c: [r, g, b], sat: M ? (M - m) / M : 0, l: (0.299 * r + 0.587 * g + 0.114 * b) / 255 }; });
  // tons parecidos somam (vizinhos no histograma): junta por cor próxima
  const C = []; L.sort((a, z) => z.n - a.n).forEach((p) => { const q = C.find((k) => Math.abs(k.c[0] - p.c[0]) + Math.abs(k.c[1] - p.c[1]) + Math.abs(k.c[2] - p.c[2]) < 70); if (q) { const t = q.n + p.n; q.c = q.c.map((v, i) => (v * q.n + p.c[i] * p.n) / t); q.n = t; q.sat = Math.max(q.sat, p.sat); } else C.push({ ...p, c: p.c.slice() }); });
  C.sort((a, z) => z.n - a.n); if (!C.length) return null; let best = C[0]; const neutral = (k) => k.sat < 0.18 || k.l > 0.9 || k.l < 0.1;
  if (neutral(best)) { const viva = C.find((k) => !neutral(k) && k.n / tot > 0.2); if (viva) best = viva; } return best.c.map(Math.round); }
function shSample(u, key) { if (!u) return; const im = new Image(); if (!/^data:/.test(u)) im.crossOrigin = 'anonymous';
  im.onerror = () => { SH_SC[key] = 1; shScSave(); };
  im.onload = () => { try { const rgb = shDomRgb(im); if (!rgb) throw 0; const [r, g, bb] = rgb; const lum = (0.299 * r + 0.587 * g + 0.114 * bb) / 255;
    const v = [`rgb(${r},${g},${bb})`, lum > 0.56 ? '#1f150d' : '#f7efe2']; SH_SC[key] = v; shScSave();
    SHX_ROOTS.forEach((R) => { if (!R.isConnected && !(R.host && R.host.isConnected)) { SHX_ROOTS.delete(R); return; } R.querySelectorAll(`.bsh .sp.cvs[data-sk="${key}"]`).forEach((el) => { el.style.setProperty('--c', v[0]); if (!el.classList.contains('ep')) el.style.setProperty('--k', v[1]); }); }); } catch (e) { SH_SC[key] = 1; shScSave(); } };
  im.src = coverCanvasUrl(u); }
function shWoodVars(w) { if (w === 'tema') return '--bk-w1:color-mix(in srgb,var(--acc) 58%,#6b4a2a);--bk-w2:color-mix(in srgb,var(--acc) 44%,#3e2716);--bk-w3:color-mix(in srgb,var(--acc) 26%,#1f130a);--bk-top:color-mix(in srgb,var(--acc) 50%,#f3d7a8)';
  const p = SH_WOOD[w]; return p ? `--bk-w1:${p[0]};--bk-w2:${p[1]};--bk-w3:${p[2]};--bk-top:${p[3]}` : ''; }
const SH_WOOD = { clara: ['#d6aa76', '#b98551', '#8e5f36', '#e8c597'], escura: ['#6b4a32', '#4d3322', '#2f1f15', '#7d5a3e'], branca: ['#f2eee7', '#ddd6ca', '#bcb3a5', '#fcfaf6'] };
// largura da estante (px): na Biblioteca ela ocupa a largura toda da tela; no perfil, a da caixa
function pratHTML(list0, sm, wBsh) {
  const C0 = shc(), md = sm ? null : shMode(), sc = sm ? 0.6 : 1, W = Math.max(200, Math.min(480, wBsh || 390)) - (sm ? 56 : 40);
  let list = list0.map((b) => ({ ...b })); if (typeof SHX_LTN !== 'undefined') SHX_LTN = 0;
  // Esvaziar e arrumar: no Organizar, os livros da bandeja saem da estante (fora dele ficam no fim, até a pessoa terminar)
  const TRAY = !sm && md === 'org' && Array.isArray(C0.tray) && C0.tray.length ? new Set(C0.tray) : null; if (TRAY) list = list.filter((b) => !TRAY.has(b.id));
  const POS = C0.pos || {}; list.forEach((b) => { if (POS[b.id] === 'lean') b.lean = 1; else if (POS[b.id] === 'leanR') b.lean = 2; });
  // "Minha ordem" (Organizar): vale dentro do filtro; o que não está na ordem salva vai para o fim
  if (C0.ord && C0.ord.length) { const ix = new Map(C0.ord.map((id, i) => [id, i])); list = list.map((b, i) => [b, ix.has(b.id) ? ix.get(b.id) : 1e6 + i]).sort((x, y) => x[1] - y[1]).map((x) => x[0]); }
  const man = !!C0.manual || Object.keys(C0.lay || {}).some((id) => C0.lay[id]);
  // sequência: livro em pé; deitados (Organizar) viram pilha no lugar deles; sem arrumação manual, a estante arruma sozinha (pilhas, livro de frente)
  const seq = []; for (let i = 0; i < list.length; i++) { const b = list[i];
    if (C0.lay && C0.lay[b.id]) { const bs = [b]; while (list[i + 1] && C0.lay[list[i + 1].id] && bs.length < 5) bs.push(list[++i]); seq.push({ k: 'pile', bs, top: null }); continue; }
    if (POS[b.id] === 'face' && b.img !== undefined) { seq.push({ k: 'face', b }); continue; }
    if (!man && !sm && list.length >= 20 && i % 14 === 9 && list[i + 1]) { const n = list[i + 2] && i % 28 === 9 ? 3 : 2; seq.push({ k: 'pile', bs: list.slice(i, i + n), top: ['vela', 'cristal'][(i / 14 | 0) % 2] }); i += n - 1; continue; }
    if (!man && !sm && list.length >= 20 && i % 19 === 13 && b.img) { seq.push({ k: 'face', b }); continue; }
    seq.push({ k: 'sp', b }); }
  const wOf = (it) => it.k === 'sp' ? spnGeo(it.b, sm).w + (it.b.lean ? Math.ceil(spnGeo(it.b, sm).h * 0.13) : 0) : it.k === 'pile' ? Math.round(124 * sc) + 9 : 98;
  // decoração: a da pessoa (Decorar: {k, r, p}) ou a padrão por prateleira
  const UD = C0.deco || null;
  const DECS = sm ? ['planta', null, 'globo', null, 'lua'] : ['planta', 'lua', null, 'globo', 'quadro', null, 'telescopio', 'lua', null, 'vela'];
  const decOf = (r) => DECS[r % DECS.length];
  const udRow = (r) => UD ? UD.map((d, i) => ({ ...d, i })).filter((d) => d.r === r && SH_DEC[d.k]).sort((a, z) => a.p - z.p) : [];
  const decW = (r) => UD ? udRow(r).reduce((s, d) => s + Math.round((SH_DW[d.k] || 40) * sc) + 10, 0) : (decOf(r) ? Math.round(SH_DW[decOf(r)] * sc) + 10 : 0);
  // enche cada prateleira: se um item grande (pilha, livro de frente) não cabe, ele espera a próxima e os livros em pé seguem
  const rows = []; let cur = [], used = 0, ri = 0, cap = W - decW(0); const q = seq.slice(), wait = [];
  while (q.length || wait.length) { let it = null, from = null;
    if (wait.length && used + wOf(wait[0]) <= cap) { it = wait[0]; from = wait; } else if (q.length) { it = q[0]; from = q; } else { it = wait[0]; from = wait; }
    const w = wOf(it);
    if (used + w > cap && cur.length) { if (it.k !== 'sp' && from === q) { wait.push(q.shift()); continue; } rows.push(cur); cur = []; used = 0; ri++; cap = W - decW(ri); continue; }
    from.shift(); cur.push(it); used += w; }
  if (cur.length || !rows.length) rows.push(cur);
  // estante nunca fica com uma prateleira só: no mínimo 3; um enfeite da pessoa numa prateleira mais baixa garante que ela exista
  const minR = sm ? 1 : Math.max(C0.minR || 3, ...(UD ? UD.map((d) => d.r + 1) : [0]));
  while (rows.length < minR) rows.push([]);
  // o último livro de algumas fileiras cheias encosta no vizinho, inclinado (só na arrumação automática)
  // livro inclinado só quando a pessoa escolhe (Organizar › Inclinado)
  const pileHTML = (bs, top) => { const PH = shPileHts(bs, top ? 112 : 150); return `<span class="pile">${top ? `<span class="dec" style="margin:0 0 0 18px">${SH_DEC[top](0.9)}</span>` : ''}${bs.map((x, j) => { const G = spnGeo(x, false), [c, k] = spnColors(x), ov = shEdOf(x), wv = Math.round(G.h * 0.86 * sc) - j * 3, ht = PH[j];
    const fe = ov.t === 'bp' || ov.t === 'ep', act = md ? '' : shAct(x, true), PBI = fe ? null : shPbInner(x, wv, ht);
    // bordas pintadas (ou douradas): o livro deitado mostra o corte das páginas, não a lombada
    return `<span class="pb${(G.h0 >>> 4) % 2 ? ' sf' : ''}${fe ? ' fe' : ''}${PBI ? ' pbm' : ''}" role="button" tabindex="0" data-bid="${esc(x.id)}" aria-label="${esc(x.t)}${fe ? ', bordas ' + (ov.t === 'ep' ? 'douradas' : 'pintadas') : ''}"${act} style="width:${wv}px;height:${ht}px;--c:${c};--k:${k}${fe ? `;--eg:${ov.t === 'ep' ? '#d9b45a' : (ov.e || '#b3283f')}` : ''};margin-left:${(G.h0 % 9) - 2}px">${fe ? '' : (PBI || `<span>${esc(x.t)}</span>`)}</span>`; }).join('')}</span>`; };
  const decHTML = (d) => { const edit = md === 'deco' && d.i != null, lb = !edit && !md && !sm && d.k === 'leitor' && typeof shLeitorBook === 'function' ? shLeitorBook(d) : null; return `<span class="dec${edit ? ' u' : ''}${lb ? ' lk' : ''}"${edit ? ` data-dk="${d.i}" role="button" tabindex="0" aria-label="${esc(SH_DN[d.k] || d.k)}: trocar, tirar ou arrastar"` : lb ? `${shAct(lb, false)} role="button" tabindex="0" aria-label="Leitor digital: ${esc(lb.t)}"` : ''}>${SH_DEC[d.k](sc, d)}</span>`; };
  const itemHTML = (it) => it.k === 'sp' ? spnHTML(it.b, sm) : it.k === 'pile' ? pileHTML(it.bs, it.top) : `<button type="button" class="face" data-bid="${esc(it.b.id)}"${md ? '' : shAct(it.b, true)} aria-label="${esc(it.b.t)}, de frente">${v4cv({ title: it.b.t, cover: it.b.img })}</button>`;
  // toque para pegar (Organizar): marcadores grandes onde o livro pode entrar; por cima das pilhas, deitar nela
  const PK = md === 'org' && typeof SHX_PICK !== 'undefined' && SHX_PICK ? String(SHX_PICK) : null;
  const firstId = (it) => it.k === 'pile' ? it.bs[0].id : it.b.id, lastId = (it) => it.k === 'pile' ? it.bs[it.bs.length - 1].id : it.b.id;
  const insB = (ref, after, lab) => `<span class="ins"><button type="button" data-ins="${esc(ref)}" data-af="${after ? 1 : 0}" aria-label="${esc(lab)}">+</button></span>`;
  const itemPK = (it) => { const h = itemHTML(it); if (!PK) return h; if (it.k === 'pile' && !it.bs.some((x) => x.id === PK)) return h.replace('<span class="pile">', `<span class="pile"><button type="button" class="insp" data-insp="${esc(lastId(it))}" aria-label="Deitar em cima desta pilha">+</button>`); return h; };
  const ltOff = C0.lt && C0.lt.on === 0;
  const rowHTML = (r, k) => { let items;
    const r0 = r; if (PK) { const arr0 = []; r.forEach((it) => { if (firstId(it) !== PK) arr0.push(insB(firstId(it), false, 'Colocar aqui, antes de ' + (it.k === 'pile' ? it.bs[0].t : it.b.t))); arr0.push(itemPK(it)); }); if (r.length && lastId(r[r.length - 1]) !== PK) arr0.push(insB(lastId(r[r.length - 1]), true, 'Colocar no fim desta prateleira')); if (!r.length) arr0.push(`<span class="ins wide"><button type="button" data-ins="" data-af="1" aria-label="Colocar nesta prateleira">+ guardar aqui</button></span>`); r = { map: (f) => arr0.map((x) => ({ __h: x })).map((o) => o.__h), length: arr0.length, __pk: 1 }; }
    if (UD) { const arr = r.__pk ? r.map() : r.map(itemHTML); udRow(k).reverse().forEach((d) => arr.splice(Math.min(d.p, arr.length), 0, decHTML(d))); items = arr.join('');
      if (!r0.length && !PK && !udRow(k).length && !sm && k === rows.length - 1 && list.length < 16) items = '<span class="ghost">Seus próximos livros ficam aqui</span>'; }
    else { items = r.__pk ? r.map().join('') : r.map(itemHTML).join('');
      if (!r0.length && !sm && !PK) items = `<span class="dec">${SH_DEC.quadro(1)}</span><span style="flex:1"></span><span class="dec">${SH_DEC[k % 2 ? 'telescopio' : 'globo'](1)}</span>`;
      let d = r0.length ? decOf(k) : null; if (d === 'lua' && !(r0[r0.length - 1] && r0[r0.length - 1].k === 'sp')) d = 'globo'; if (d) { const dec = `<span class="dec">${SH_DEC[d](sc)}</span>`; items = (d === 'lua' || k % 2) ? items + dec : dec + items; }
      if (!r0.length && !sm && k === rows.length - 1 && list.length < 16) items = items.replace('<span style="flex:1"></span>', '<span class="ghost">Seus próximos livros ficam aqui</span>'); }
    const n = sm ? 0 : 9, bulbs = Array.from({ length: n }, (_, i) => { const x = (i + 0.5) / n, t = (x * 3) % 1, y = 1 + 10 * Math.sin(Math.PI * t); return `<i style="left:${(x * 100).toFixed(2)}%;top:${y.toFixed(1)}px"></i>`; }).join('');
    const wire = typeof shLtRow === 'function' ? shLtRow(k, sm, 'f') : (sm || k % 2 || ltOff) ? '' : `<span class="lt" aria-hidden="true"><svg viewBox="0 0 300 18" preserveAspectRatio="none"><path d="M0 1 Q50 22 100 1 T200 1 T300 1" fill="none" stroke="rgba(30,20,10,.55)" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>${bulbs}</span>`;
    // Leituras por mês: plaquinha do mês onde ele começa (C0.mk = {id: 'jan'})
    let mkq = ''; if (C0.mk && !PK) { let x = 12; r0.forEach((it) => { const id = it.k === 'pile' ? it.bs[0].id : it.b.id; if (C0.mk[id]) mkq += `<span class="plq mk s-${esc(C0.mkS || 'latao')}" style="left:${Math.min(x, W - 22)}px">${esc(C0.mk[id])}</span>`; x += wOf(it); }); }
    const pq = mkq + (C0.plq || []).map((q, i) => ({ ...q, i })).filter((q) => q.r === k && q.t).map((q) => `<span class="plq s-${esc(q.s || 'mad')}${md === 'deco' ? ' u' : ''}" style="left:${Math.max(4, Math.min(96, (q.p == null ? 0.5 : q.p) * 100)).toFixed(1)}%"${md === 'deco' ? ` data-pq="${q.i}" role="button" tabindex="0"` : ''}>${esc(String(q.t).slice(0, 24))}</span>`).join('');
    return `<div class="bay" data-r="${k}">${typeof shLtRow === 'function' ? shLtRow(k, sm, 'b') : ''}<div class="brow">${items}</div></div><div class="bpl"${pq ? '' : ' aria-hidden="true"'} data-r="${k}">${wire}${pq}</div>`; };
  const hint = sm || md ? '' : `<div class="hint"><span><i class="k1"></i>lendo</span><span><i class="k2">✦</i>lido</span><span class="r">${man ? 'Minha ordem · ' : ''}toque abre · segure para opções</span></div>`;
  const cls = `bsh${sm ? ' sm' : ''}${md ? ' ' + md : ''}${shDark() ? ' dk' : ''} w-${C0.wall || 'linho'} lt-${ltOff ? 'off' : (C0.lt && C0.lt.c) || 'quente'}`;
  return `<div class="${cls}" style="${shWoodVars(C0.wood)}">${hint}<div class="case">${typeof shLtFrame === 'function' ? shLtFrame(sm) : ''}<div class="crown"></div>${rows.map(rowHTML).join('')}</div></div>`; }
// ajusta o título na lombada depois de desenhar: diminui a letra até caber (e corta com reticências só no limite).
// O resultado fica guardado por livro/tamanho: redesenhar a estante não mede de novo (estante grande abre rápido).
const SH_FIT = new Map();
function shFit(root) { const PBS = root && root.querySelectorAll ? [...root.querySelectorAll('.bsh .pbsp')].map((e) => [e, e.style.transform]) : []; PBS.forEach(([e]) => { e.style.transform = 'none'; }); try { shFit0(root); } finally { PBS.forEach(([e, t]) => { e.style.transform = t; }); } } // o deitado mede sem o giro (24/11)
function shFit0(root) { const rg = document.createRange();
  // 22/11 (Bia): mede de verdade. Não coube numa linha: quebra em 2 (3 na lombada larga) pela largura real da lombada;
  // só diminui até ~8 px; reticências só se nem assim couber (no fim da última linha).
  root.querySelectorAll('.bsh .sp .tt, .bsh .sp .au').forEach((el) => { if (el.dataset.fit) return; el.dataset.fit = 1; const tn = el.firstChild; if (!tn) return;
    const sp = el.parentElement, au = el.classList.contains('au'), key = (au ? 'a|' : 't|') + (sp.closest('.pbsp') ? 'pb|' : '') + (sp.dataset.bid || sp.dataset.pbid) + '|' + sp.style.width + '|' + el.style.height + '|' + el.style.fontSize + '|' + sp.className;
    const got = SH_FIT.get(key); if (got) { el.style.fontSize = got[0]; el.classList.toggle('w2', !!got[1]); if (got[2] != null) tn.textContent = got[2]; return; }
    const room = el.clientHeight - 3; if (room <= 0) return; const full = tn.textContent, spW = sp.clientWidth || parseFloat(sp.style.width) || 20, lineW = Math.max(6, spW - 5);
    const len = () => { rg.selectNodeContents(tn); const b = rg.getBoundingClientRect(); return { h: b.height, w: b.width }; };
    const fits = () => { const m = len(); return m.h <= room && m.w <= lineW + 0.5; };
    let fs = parseFloat(el.style.fontSize) || parseFloat(getComputedStyle(el).fontSize); const fs0 = fs; el.style.textOverflow = 'clip'; el.classList.remove('w2');
    const setF = (f) => { fs = f; el.style.fontSize = f.toFixed(2) + 'px'; };
    let ok = fits(); const minS = au ? 4.4 : 6.5;
    // 1 linha: só um pouco menor
    for (let n = 0; !ok && n < 12 && fs > Math.max(minS, fs0 * 0.82); n++) { setF(fs - 0.3); ok = fits(); }
    if (!ok && !au && /\s/.test(full)) { const mx = spW >= 30 ? 3 : 2; el.classList.add('w2');
      for (let L = 2; L <= mx && !ok; L++) { setF(Math.max(minS, Math.min(fs0, (lineW / L) / 1.06))); ok = fits(); for (let n = 0; !ok && n < 30 && fs > minS; n++) { setF(Math.max(minS, fs - 0.3)); ok = fits(); } if (!ok && L < mx) setF(fs0); } }
    if (!ok && au) { for (let n = 0; !ok && n < 30 && fs > minS; n++) { setF(Math.max(minS, fs - 0.3)); ok = fits(); } }
    // fonte do título ainda carregando: a medida não vale; mede de novo quando ela chegar (sem guardar nada)
    if (document.fonts && document.fonts.status !== 'loaded') { tn.textContent = full; el.style.textOverflow = ''; delete el.dataset.fit; if (!shFit.wt) { shFit.wt = 1; document.fonts.ready.then(() => { shFit.wt = 0; try { shFit(root); } catch {} }); } return; }
    let txt = null; if (!ok) { // reticências no fim da última linha
      const w = full.split(' '); let lo = 1, hi = full.length; while (lo < hi) { const mid = Math.ceil((lo + hi) / 2); tn.textContent = full.slice(0, mid).trimEnd() + '…'; if (fits()) lo = mid; else hi = mid - 1; } tn.textContent = full.slice(0, lo).trimEnd() + '…'; void w;
      // sobrariam 1–3 letras: melhor a letra menor (até 5,5 px) com o título inteiro
      if (lo < 4) { tn.textContent = full; el.classList.remove('w2'); for (let n = 0; !fits() && n < 40 && fs > 5.5; n++) setF(Math.max(5.5, fs - 0.3)); el.style.textOverflow = ''; return; }
      // medida feita cedo demais (fonte/estilo ainda chegando) deixava reticências para sempre: confere de novo uma vez, sem guardar
      if (!el.dataset.retry) { el.dataset.retry = 1; setTimeout(() => { if (!el.isConnected) return; tn.textContent = full; delete el.dataset.fit; SH_FIT.delete(key); shFit(root); }, 1500); } el.style.textOverflow = ''; return; }
    el.style.textOverflow = ''; SH_FIT.set(key, [el.style.fontSize, el.classList.contains('w2'), txt]); });
  root.querySelectorAll('.bsh .pb span').forEach((el) => { if (el.dataset.fit || el.closest('.pbsp')) return; el.dataset.fit = 1; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0; const room = el.parentElement.clientWidth - 14;
    while (el.scrollWidth > room && fs > 5.4 && n++ < 12) { fs -= 0.4; el.style.fontSize = fs.toFixed(1) + 'px'; } }); }

// ---------- CSS nas raízes (Biblioteca, perfil, folhas) ----------
function shCss(sr) { if (!sr || sr.querySelector('style[data-shx]')) return; const st = document.createElement('style'); st.dataset.shx = 1; st.textContent = SHX_CSS1 + (typeof SHX_CSS2 === 'string' ? SHX_CSS2 : ''); sr.append(st); }

// ---------- Biblioteca › Livros ----------
const SHF = [['todos', 'Todos os livros'], ['lendo', 'Lendo'], ['quero', 'Quero ler'], ['lido', 'Lidos'], ['pausado', 'Pausados'], ['abandonado', 'Abandonados']];
const shSh = () => v5Shelves().filter((s) => !s.arch);
function shF() { const f = v5P().shF || 'todos'; if (f.indexOf('sh:') === 0 && !shSh().some((s) => 'sh:' + s.id === f)) return 'todos'; return f; }
function shBase() { let L = lib().slice(); try { L = esnSort(L, ESN().sort); } catch {} return L; }
function shList(f) { f = f || shF();
  if (f.indexOf('sh:') === 0) { const s = shSh().find((x) => 'sh:' + x.id === f); return s ? v5ShBooks(s).map(shB) : []; }
  const L = shBase().map(shB); return f === 'todos' ? L : L.filter((b) => b.st === f); }
const shFName = (f) => { f = f || shF(); if (f.indexOf('sh:') === 0) { const x = shSh().find((s) => 'sh:' + s.id === f); return x ? x.name : 'Estante'; } return (SHF.find((x) => x[0] === f) || SHF[0])[1]; };
const shAllIds = () => shList().map((b) => b.id);
const shVtog = () => `<div class="shxvt" style="display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0 2px 10px"><div class="vtog" role="group" aria-label="Ver como"><button type="button" class="on" data-a="shxview" data-v="grade" aria-pressed="true">${v4ic('grid', 16)}Grade</button><button type="button" data-a="shxview" data-v="prat" aria-pressed="false">${v4ic('prat', 16)}Prateleira</button></div></div>`;
// a Grade não muda; só ganha o seletor Grade · Prateleira. Na Prateleira a grade nem é montada.
{ const _lh = v5LivrosHTML; v5LivrosHTML = function () { const S5 = v5S();
    if (shView() === 'prat' && !S5.sub) return '<div class="shxph"></div>';
    const h = _lh.apply(this, arguments); const i = h.indexOf('<div class="v6sbar">'), j = i >= 0 ? i : h.indexOf('<div class="grid">');
    return j >= 0 ? h.slice(0, j) + shVtog() + h.slice(j) : h; }; }
{ const _de = drawEstante; drawEstante = function (box) { const r = _de.apply(this, arguments); try { shDraw(box || $('#lista')); } catch (err) { console.warn('prateleira', err); } return r; }; }
function shBibRoot() { const box = $('#lista'), host = box && box.querySelector(':scope > .v5host'); return host && host.shadowRoot; }
function shDraw(box) {
  const host = box && box.querySelector(':scope > .v5host'), sr = host && host.shadowRoot; if (!sr) return; const R = sr.querySelector('.v5est'); if (!R) return;
  shArm(sr); const S5 = v5S();
  if (S5.tab !== 'livros' || S5.sub || shView() !== 'prat' || !R.querySelector('.shxph')) { SHX_MODE = null; return; }
  const t0 = performance.now(), seg = R.querySelector(':scope > .seg'), segH = seg ? seg.outerHTML : '', f = shF(), list = shList(f), md = SHX_MODE, n = list.length;
  const top = `<div class="shtop">${md ? '' : `<button type="button" class="shsel" data-a="shxsheet" data-s="shxfilt" aria-label="Mostrar: ${esc(shFName())}"><b>${esc(f === 'todos' ? 'Todos' : shFName())}</b><i>▾</i><small>${n} livro${n === 1 ? '' : 's'}</small></button>
      <div class="vtog" role="group" aria-label="Ver como"><button type="button" data-a="shxview" data-v="grade" aria-pressed="false">${v4ic('grid', 16)}Grade</button><button type="button" class="on" data-a="shxview" data-v="prat" aria-pressed="true">${v4ic('prat', 16)}Prateleira</button></div>
      <button type="button" class="shic" data-a="shmode" data-v="org" aria-label="Organizar" title="Organizar">${v4ic('sort', 19)}</button>
      <button type="button" class="shic" data-a="shmode" data-v="deco" aria-label="Decorar" title="Decorar">${v4ic('lua', 19)}</button>
      <button type="button" class="shic" data-a="sheet" data-s="v5add" aria-label="Adicionar livro" title="Adicionar">${v4ic('plus', 19)}</button>
      <button type="button" class="shic q" data-a="shxsheet" data-s="shxleg" aria-label="Como ler a estante" title="Legenda">?</button>`}</div>`;
  const ban = md === 'org' ? `<div class="shban" role="status"><b>Arraste para reorganizar<small>Toque num livro para deitar ou levantar${shc().manual ? ' · <button type="button" data-a="shreset">voltar à arrumação automática</button>' : ''}</small></b><button type="button" data-a="shdone">Concluir</button></div>` : '';
  // a estante vai de borda a borda: desconta o respiro da página (#lista) e usa a largura que sobra
  const pad = Math.max(0, Math.min(32, parseFloat(getComputedStyle(box).paddingLeft) || 0)); R.style.setProperty('--shx-pad', pad + 'px');
  // o painel Decorar fica acima da barra de abas do app
  try { const tb = box.getRootNode().querySelector('#tabbar'), tr = tb && tb.getBoundingClientRect(); let tp = tr && tr.height ? tr.top : innerHeight; if (tb) tb.querySelectorAll('button, a').forEach((n) => { const r = n.getBoundingClientRect(); if (r.height && r.top < tp) tp = r.top; }); R.style.setProperty('--shx-tab', Math.max(0, Math.round(innerHeight - tp)) + 'px'); } catch {}
  // a faixa do Organizar gruda logo abaixo do topo fixo do app
  try { const g = box.getRootNode().querySelector('.gtop'); R.style.setProperty('--shx-sticky', (g ? Math.max(0, Math.round(g.getBoundingClientRect().bottom - Math.max(0, box.getBoundingClientRect().top))) : 0) + 'px'); } catch {}
  const wB = SHX_W || ((R.clientWidth || Math.min(innerWidth, 480) - 2 * pad) + 2 * pad);
  const paint = (w) => { const rest = !n ? `<p class="mut" style="text-align:center;margin:40px 12px">Nenhum livro aqui ainda.</p>` : ban + pratHTML(list, false, w) + (md === 'deco' ? '<div style="height:44vh" aria-hidden="true"></div>' : '');
    R.innerHTML = `<div class="shtopw">${segH}${top}${rest}</div>` + (md === 'deco' ? dkPanel() : ''); };
  paint(wB);
  // a largura real da estante (a página pode ter outro respiro): se for outra, desenha de novo com ela
  const bsh = R.querySelector('.bsh'); if (bsh && bsh.clientWidth && Math.abs(bsh.clientWidth - wB) > 6) { SHX_W = bsh.clientWidth; paint(SHX_W); }
  shFit(R); window.__shxMs = Math.round(performance.now() - t0);
}
// cliques da Biblioteca (raiz própria em captura: roda antes do clique do v5)
function shArm(sr) { if (!sr || sr.__shx) return; sr.__shx = 1; shCss(sr); SHX_ROOTS.add(sr);
  sr.addEventListener('click', (ev) => shClick(ev, sr), true);
  sr.addEventListener('keydown', (ev) => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.matches && ev.target.matches('.bsh .dec[data-dk], .bsh .pb[data-bid]')) { ev.preventDefault(); ev.target.click(); } });
  try { shDragArm(sr); } catch (err) { console.warn('arrastar estante', err); } }
function shGo(v) { v5P().shView = v; SHX_MODE = null; v5Save(); v5Redraw(); }

// ---------- folhas (camada V4): filtro e legenda; as de edição e foto ficam na outra parte ----------
function shArmV4() { try { const R = v4Root(), sr = R.getRootNode(); shCss(sr); SHX_ROOTS.add(sr); if (!R.__shx) { R.__shx = 1; R.addEventListener('click', (ev) => shV4Click(ev), true); R.addEventListener('change', (ev) => shV4Change(ev), true); } } catch (err) { console.warn('folhas da estante', err); } }
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments); try { const st = v4State(); if (st && String(st.sheet || '').startsWith('shx') && V4) shFit(V4); } catch {} return r; }; }
function shOpen(k, ctx) { shArmV4(); v5Sheet(k, ctx || {}); shArmV4(); }
{ const _vs = v5Sheet; v5Sheet = function () { const r = _vs.apply(this, arguments); shArmV4(); return r; }; }
{ const _sh = v4SheetHTML; v4SheetHTML = function (k) { if (!String(k).startsWith('shx')) return _sh.apply(this, arguments);
    try { return shSheetHTML(k); } catch (err) { console.warn('folha da estante', err); return '<p class="mut">Não deu para abrir.</p>'; } }; }
function shSheetHTML(k) {
  if (k === 'shxleg') return `<h3>Como ler a estante</h3><div class="shleg"><div><span class="k1"></span>Fitinha: você está lendo</div><div><span class="k2">✦</span>Estrela: você já leu</div><div>${v4ic('ler', 18)}Toque num livro para abrir · segure para ver as opções</div><div>${v4ic('estante', 18)}Trocar a lombada: Organizar › toque no livro › Lombada, ou segure o livro › Mais › Lombada e edição</div><div>${v4ic('lua', 18)}Decorar: enfeites, plaquinhas, madeira, parede, luzinhas e o estilo das lombadas</div></div>`;
  if (k === 'shxfilt') { const f = shF(), cnt = (x) => shList(x).length, L = shSh();
    return `<div class="shfl"><h3>Mostrar na estante</h3><div class="list">${SHF.map(([x, nm]) => `<button type="button" class="li${f === x ? ' on' : ''}" data-a="shfil" data-k="${x}" aria-pressed="${f === x}"><span class="t">${nm}</span><small>${cnt(x)}</small></button>`).join('')}</div>${L.length ? `<h4>Suas estantes</h4><div class="list">${L.map((s) => `<button type="button" class="li${f === 'sh:' + s.id ? ' on' : ''}" data-a="shfil" data-k="sh:${esc(String(s.id))}" aria-pressed="${f === 'sh:' + s.id}"><span class="t">${esc(s.name)}</span><small>${(s.bookIds || []).filter((id) => v5Book(id)).length}</small></button>`).join('')}</div>` : ''}</div>`; }
  return typeof shSheetHTML2 === 'function' ? shSheetHTML2(k) : ''; }

// ---------- Perfil: uma estante só, decorada igual à da Biblioteca, com chips ----------
const SHX_PF = {}, SHX_PFX = {}; // estante escolhida e "ver inteira", por perfil
function shProfHTML(L, mine, key, wBox) { if (!L.length) return `<p class="mut" style="margin:16px 4px">${mine ? 'Crie estantes para organizar seus livros do seu jeito (ex.: Clássicos, Para reler).' : 'Nenhuma estante para mostrar.'}</p>`;
  const k = SHX_PF[key] == null || SHX_PF[key] >= L.length ? 'all' : SHX_PF[key];
  const ids = k === 'all' ? [...new Set(L.flatMap((x) => x[1]))] : L[k][1], list = ids.map(shById).filter(Boolean);
  const nL = list.filter((b) => b.st === 'lido').length, nR = list.filter((b) => b.st === 'lendo').length;
  const chips = `<div class="chips" role="tablist">${[['all', 'Todas']].concat(L.map((x, i) => [i, x[0], x[3]])).map(([v, n, pv]) => `<button type="button" class="chip ${String(k) === String(v) ? 'on' : ''}" data-a="pfsh" data-k="${v}" role="tab" aria-selected="${String(k) === String(v)}">${esc(n)}${mine && pv ? v4ic('lock', 11) : ''}</button>`).join('')}</div>`;
  const line = `<div class="pfl">${list.length} livro${list.length === 1 ? '' : 's'}${nL ? ' · ' + nL + ' lido' + (nL > 1 ? 's' : '') : ''}${nR ? ' · ' + nR + ' lendo' : ''}${k !== 'all' && mine && L[k][3] ? ' · só você vê' : ''}</div>`;
  let box = pratHTML(list, false, wBox);
  if (list.length < 8) box = box.replace(/<div class="brow">/, '<div class="brow few">');
  const all = !!SHX_PFX[key];
  return `<div class="pfsh">${chips}${line}<div class="pfbox"${all ? ' style="max-height:none"' : ''}>${box}</div>${list.length > 14 ? `<button type="button" class="pfall" data-a="prat-go">${mine ? 'Ver estante inteira' : all ? 'Mostrar menos' : 'Ver estante inteira'}</button>` : ''}</div>`; }
{ const _vb = v3Build; v3Build = function (v, d) { const r = _vb.apply(this, arguments); try { shProfPaint(v, d); } catch (err) { console.warn('prateleira no perfil', err); } return r; }; }
function shProfData(d) {
  if (d.self && !S.v3prev) return { mine: true, key: '@me', L: shSh().map((s) => [s.name, (s.bookIds || []).map(String).filter((id) => v5Book(id)), 0, !!s.priv]) };
  if (d.self) { const L = (typeof window.v6ProfOrder === 'function' ? window.v6ProfOrder() : shSh().filter((s) => !s.priv)); return { mine: false, prev: true, key: '@prev', L: L.map((s) => [s.name, (s.bookIds || []).map(String).filter((id) => v5Book(id)), 0, false]) }; }
  const P = d.shelf && d.shelf.prat; if (!P || !Array.isArray(P.sh) || !P.b) return null;
  return { mine: false, vis: true, key: String(d.handle || '?'), L: P.sh.map((x) => [String(x.n || 'Estante'), (x.ids || []).map(String).filter((id) => P.b[id]), 0, false]).filter((x) => x[1].length), C: shDefaults({ ...(P.C || {}) }), B: P.b }; }
function shWith(x, fn) { const c0 = SHX_CTX, v0 = SHX_VB, s0 = SHX_VIS; if (x.vis) { SHX_CTX = x.C; SHX_VB = x.B; SHX_VIS = true; } try { return fn(); } finally { SHX_CTX = c0; SHX_VB = v0; SHX_VIS = s0; } }
function shProfPaint(v, d) {
  const body = v && v.querySelector('.sl-body'), pE = body && body.querySelector(':scope > .v3pane[data-k=est]'); if (!pE || !d) return;
  const x = shProfData(d); if (!x) return;
  const wBox = Math.max(240, (pE.clientWidth || Math.min(innerWidth, 560) - 32) - 2);
  const sig = JSON.stringify([x.key, x.L, x.vis ? JSON.stringify(x.C).length : SHX_VER, shDark(), wBox, x.vis ? 0 : lib().length]);
  const cur = pE.querySelector('.shxpf');
  if (cur && pE.dataset.shxsig === sig && cur.isConnected) return;
  pE.dataset.shxsig = sig;
  // o seu perfil mantém a barra "Organizar · Nova estante"; as outras partes do perfil continuam vendo o que esperam (v4psh / v6pv)
  const bar = x.mine ? pE.querySelector(':scope > .v4mysh-bar') : null;
  const wrap = document.createElement('div'); wrap.className = 'v4psh shxwrap'; if (x.prev) wrap.dataset.v6pv = '1'; wrap.style.display = 'block';
  const host = document.createElement('div'); host.className = 'shxpf'; wrap.append(host);
  pE.replaceChildren(...(bar ? [bar] : []), wrap);
  const sr = host.attachShadow({ mode: 'open' }); const st = document.createElement('style'); st.textContent = V4CSS + V4EXTRA; sr.append(st); shCss(sr); SHX_ROOTS.add(sr);
  const R = document.createElement('div'); R.className = 'v4ler shxr'; sr.append(R);
  const paint = () => { R.innerHTML = shWith(x, () => shProfHTML(x.L, x.mine, x.key, wBox)); shFit(R); };
  paint();
  if (x.mine) { R.addEventListener('click', v5ClickLongGuard, true); v5Gestures(R); }
  R.addEventListener('click', (ev) => { const t = ev.target.closest('[data-a]'); if (!t) return; const a = t.dataset.a;
    if (a === 'pfsh') { SHX_PF[x.key] = t.dataset.k === 'all' ? null : +t.dataset.k; paint(); return; }
    if (a === 'prat-go') { if (!x.mine) { SHX_PFX[x.key] = !SHX_PFX[x.key]; paint(); return; }
      const S5 = v5S(); S5.tab = 'livros'; S5.sub = null; v5P().shView = 'prat'; v5P().shF = 'todos'; v5Save(); try { v.hidden = true; goTab('estante'); } catch {} return; }
    if (a === 'v5book') { const e = v5Book(t.dataset.id); if (e) openBookPage(e); return; }
    if (a === 'shxvb') { const b = x.B && x.B[t.dataset.id]; if (b) try { openAnyBook(b.t, b.a, b.img); } catch {} } });
}
// segurar abre o menu do livro; o toque que solta logo depois não abre o livro
function v5ClickLongGuard(ev) { const r = ev.currentTarget; if (r.dataset.longAt && Date.now() - Number(r.dataset.longAt) < 700) { ev.preventDefault(); ev.stopImmediatePropagation(); } }
// resumo publicado: só as estantes públicas (mesma regra do perfil), com a arrumação e a decoração; fotos de lombada até ~90 KB
function shSnap() { const L = typeof window.v6ProfOrder === 'function' ? window.v6ProfOrder() : shSh().filter((s) => !s.priv);
  const sh = L.map((s) => ({ n: s.name, ids: (s.bookIds || []).map(String).filter((id) => v5Book(id)) })).filter((x) => x.ids.length);
  const ids = [...new Set(sh.flatMap((x) => x.ids))].slice(0, 400), set = new Set(ids); sh.forEach((x) => { x.ids = x.ids.filter((id) => set.has(id)); });
  const b = {}; ids.forEach((id) => { const e = v5Book(id); b[id] = { t: String(e.title || '').slice(0, 120), a: String(e.author || '').slice(0, 80), st: SHX_ST[e.status] || 'quero', tot: Number(e.totalPages) || Number(e.meta && (e.meta.pages || e.meta.pageCount)) || 0, img: e.cover && !/^data:/.test(e.cover) && e.cover.length < 600 ? e.cover : null }; });
  const C = shc(), pick = (o) => Object.fromEntries(Object.entries(o || {}).filter(([k]) => set.has(k)));
  let budget = 90000; const sp = {}; ids.forEach((id) => { const u = C.sp && C.sp[id]; if (u && u.length < budget) { sp[id] = u; budget -= u.length; } });
  return { v: 1, sh, b, C: { ed: pick(C.ed), sp, ord: (C.ord || []).filter((id) => set.has(id)), lay: pick(C.lay), pos: pick(C.pos), spb: pick(C.spb), plq: (C.plq || []).slice(0, 24), manual: C.manual ? 1 : 0, deco: C.deco, wood: C.wood, wall: C.wall, lt: C.lt, lights: Array.isArray(C.lights) ? C.lights.slice(0, 3) : undefined, spMode: C.spMode } }; }
{ const _ps = profShelvesSnap; profShelvesSnap = function (snapshot) { const r = _ps.apply(this, arguments); try { if (snapshot && snapshot.shelf) snapshot.shelf.prat = shSnap(); } catch (err) { console.warn('prateleira no resumo', err); } return r; }; }
