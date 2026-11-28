// ---------- v2: mais temas, na linha do app (Bia, 28/11) ----------
// "Precisamos de mais temas que combinem melhor com o app." Antes só Papel era claro; os outros eram escuros e o Lilás fugia
// das cores quentes. Entram dois claros e dois escuros do mundo do livro (papel, encadernação, tinta), todos com contraste
// de leitura conferido (texto secundário acima de 5:1): Sálvia e Rosa antigo (claros), Couro e Mar profundo (escuros).
// Ordem na escolha: Sistema, os claros, depois os escuros. Tema claro novo funciona como o Papel (sem data-theme="dark").
const LV_CLAROS = new Set(['papel', 'salvia', 'rosa']);
{ const NOVOS = [['salvia', 'Sálvia', '#f8faf5', '#3d6b4c'], ['rosa', 'Rosa antigo', '#fdf7f5', '#9b3d52'], ['couro', 'Couro', '#1f1215', '#e0b25a'], ['mar', 'Mar profundo', '#0f1f23', '#f0a35e']];
  NOVOS.forEach((t) => { if (!THEMES.some((x) => x[0] === t[0])) THEMES.push(t); });
  const ORD = ['sistema', 'papel', 'salvia', 'rosa', 'escuro', 'couro', 'floresta', 'noite', 'mar', 'lilas'];
  THEMES.sort((a, z) => (ORD.indexOf(a[0]) + 1 || 99) - (ORD.indexOf(z[0]) + 1 || 99));
  const tx = '--tx-eco:#7d5200;--tx-le:#5a40a8;--tx-te:#24704a;--tx-co:#1f6482;--tx-in:#93376f;--tx-ab:#a8352a;--tx-pa:#45607f;--tx-dng:#a8352a;--tx-gold:#7d5200';
  const st = document.createElement('style'); st.textContent = `
html[data-pal="salvia"]{--on-acc:#fff;--bg:#eef1ea;--panel:#f8faf5;--hero:#e3e9de;--line:#d3dccd;--ink:#1f2a22;--ink-2:#55665a;--acc:#3d6b4c;--caramel:#7fa086;--caramel-deep:#3d6b4c;${tx}}
html[data-pal="rosa"]{--on-acc:#fff;--bg:#f6ece9;--panel:#fdf7f5;--hero:#efdfda;--line:#e6d0ca;--ink:#2e1c1f;--ink-2:#7a5a5f;--acc:#9b3d52;--caramel:#d19aa5;--caramel-deep:#9b3d52;${tx}}
html[data-theme="dark"][data-pal="couro"]{--on-acc:#1d140b;--bg:#140b0d;--panel:#1f1215;--hero:#2a181c;--line:#3a2328;--ink:#f5e9e4;--ink-2:#b89a97;--acc:#e0b25a;--caramel:#e0b25a;--caramel-deep:#ecc274}
html[data-theme="dark"][data-pal="mar"]{--on-acc:#1d140b;--bg:#081417;--panel:#0f1f23;--hero:#15292e;--line:#1f363c;--ink:#e8f3f2;--ink-2:#92adac;--acc:#f0a35e;--caramel:#f0a35e;--caramel-deep:#f5b77a}`;
  document.head.append(st);
  const s2 = document.createElement('style'); s2.textContent = '.aj-row.v4throw{flex-wrap:wrap;row-gap:.7rem}.aj-row.v4throw .th-dots{flex-basis:100%;flex-wrap:wrap;justify-content:flex-start;max-width:none}'; TR.append(s2);
  // botões principais usavam o caramelo fixo; nos temas novos seguem a cor do tema (os temas antigos ficam como estão)
  { const NV = NOVOS.map((t) => t[0]), G = 'linear-gradient(135deg,color-mix(in srgb,var(--acc) 72%,#fff),var(--acc))!important';
    const sel = (s) => NV.map((k) => ':host(.lv-pal-' + k + ') ' + s).join(',');
    const s3 = document.createElement('style'); s3.textContent = sel('.v2hero .go') + ',' + sel('.v3qa.p') + ',' + sel('.v3empty button') + ',' + sel('#editor.compact button.pri') + ',' + sel('.esn-sheet button.p') + ',' + sel('.sheet.due-sh .primary') + '{background:' + G + ';color:var(--on-acc)!important;box-shadow:0 5px 12px color-mix(in srgb,var(--acc) 30%,transparent)!important}'
      + sel('.v2hero .go .v2i') + ',' + sel('.v3qa.p .v2i') + '{color:var(--on-acc)!important}' + sel('.v2-qd .qr .bar i') + '{background:var(--acc)!important}';
    TR.append(s3); }
  const _at = applyTheme;
  applyTheme = function (k) { const r = _at.apply(this, arguments);
    try { const h = document.documentElement, p = h.dataset.pal;
      try { const H = TR.host; [...H.classList].filter((c) => c.startsWith('lv-pal-')).forEach((c) => H.classList.remove(c)); H.classList.add('lv-pal-' + p); } catch {}
      if (LV_CLAROS.has(p)) { delete h.dataset.theme; try { TR.host.classList.add('light'); } catch {} } } catch {}
    return r; };
  // quem já tinha escolhido um tema novo (o carregamento inicial ainda não o conhecia e caiu no Papel) volta para ele
  try { const k = T().theme; if (k && NOVOS.some((t) => t[0] === k)) applyTheme(k); } catch {}
}
