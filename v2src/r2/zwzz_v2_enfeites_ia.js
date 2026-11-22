// ---------- v2: enfeites ilustrados (Bia, 22/11) ----------
// A Bia gerou os enfeites no ChatGPT (folhas por tema); recortados, limpos e salvos em img/enfeites/<tema>/<nome>.webp.
// Os desenhos antigos com equivalente passam a usar a ilustração (as chaves salvas continuam as mesmas: nada a migrar).
// Altura fixa por tipo (fração da altura da prateleira), luz ajustada ao tema e sombra de contato no pé.
// Guirlandas: peça nova, pendurada no alto do vão de uma prateleira (uma por prateleira).
const EIA_HB = 132; // altura útil de referência de uma prateleira (px, escala 1)
const EIA = {
  basicos: { planta: [0.8, 'Planta', 253, 256], suculenta: [0.5, 'Suculenta', 232, 256], pendente: [0.62, 'Planta pendente', 219, 256], vela: [0.42, 'Vela', 212, 256],
    luminaria: [0.82, 'Luminária', 199, 256], globo: [0.74, 'Globo', 199, 256], ampulheta: [0.6, 'Ampulheta', 158, 256], cha: [0.36, 'Xícara de chá', 346, 238], gato: [0.42, 'Gato dormindo', 385, 256] },
  natal: { aparador: [0.72, 'Aparador de Natal', 182, 256], retrato: [0.6, 'Porta-retrato de neve', 259, 256], presentes: [0.55, 'Presentes', 279, 256], caneca: [0.42, 'Chocolate quente', 256, 256],
    globo_neve: [0.55, 'Globo de neve', 222, 256], lanterna: [0.62, 'Lanterna de Natal', 188, 256], quebra_nozes: [0.8, 'Quebra-nozes', 118, 256], gato_gorro: [0.48, 'Gato de gorro', 340, 256], redoma: [0.66, 'Árvore na redoma', 191, 256] },
  romance: { rosas: [0.7, 'Rosas', 219, 256], cartas: [0.38, 'Cartas com laço', 327, 256], coracao: [0.55, 'Coração de cristal', 225, 256], perfume: [0.5, 'Perfume', 227, 256], xicara: [0.38, 'Xícara de coração', 261, 256],
    petalas: [0.6, 'Cortina de pétalas', 224, 256], anel: [0.4, 'Caixinha com anel', 218, 256], vela: [0.46, 'Vela com laço', 286, 256], polaroids: [0.48, 'Polaroids', 267, 256] },
  terror: { abobora: [0.5, 'Abóbora', 253, 256], caveira: [0.5, 'Caveira com rosas', 289, 256], vela: [0.62, 'Vela derretendo', 215, 256], corvo: [0.6, 'Corvo', 222, 256], veneno: [0.48, 'Frasco de veneno', 181, 256],
    candelabro: [0.72, 'Candelabro', 183, 256], teia: [0.62, 'Teia de aranha', 230, 256], balao_barco: [0.66, 'Balão e barquinho', 226, 256], lua: [0.6, 'Lua cheia', 205, 256] },
  fantasia: { dragao: [0.55, 'Dragãozinho', 277, 256], cristal: [0.5, 'Cristal', 237, 256], pocao: [0.5, 'Poção', 208, 256], esfera: [0.64, 'Esfera armilar', 205, 256], esfera2: [0.64, 'Esfera armilar dourada', 239, 256],
    pergaminho: [0.4, 'Pergaminho', 308, 256], bola_cristal: [0.55, 'Bola de cristal', 207, 256], lamparina: [0.62, 'Lamparina', 190, 256], bau: [0.5, 'Baú de cristais', 253, 256], ampulheta: [0.6, 'Ampulheta mágica', 160, 256],
    chapeu: [0.5, 'Chapéu de bruxo', 303, 256], arvore: [0.72, 'Árvore de lanternas', 273, 256], coruja: [0.62, 'Coruja', 196, 256], portal: [0.72, 'Portal', 270, 256], calice: [0.55, 'Cálice', 156, 256],
    rosa_redoma: [0.62, 'Rosa na redoma', 187, 256], globo_mapa: [0.68, 'Globo de mapa', 186, 256] },
  encantado: { aparador_esq: [0.72, 'Aparador de dragão (esq.)', 173, 244], aparador_dir: [0.72, 'Aparador de dragão (dir.)', 171, 243], retrato: [0.6, 'Porta-retrato florido', 228, 256], esfera: [0.64, 'Esfera lilás', 198, 256],
    xicara: [0.42, 'Xícara de lua', 218, 256], relogio: [0.6, 'Relógio de lareira', 262, 256], lanterna: [0.64, 'Lanterna com hera', 192, 256], bonsai: [0.62, 'Bonsai lilás', 263, 256], terrario: [0.62, 'Terrário de cristal', 207, 256], dragao: [0.52, 'Dragão na almofada', 273, 256] } };
const eiaKey = (t, n) => 'ia_' + t + '_' + n;
const eiaSrc = (t, n) => 'img/enfeites/' + t + '/' + n + '.webp';
function eiaDec(t, n) { const [fr, , iw, ih] = EIA[t][n], H = fr * EIA_HB, W = H * iw / ih;
  return (s) => { const w = Math.round(W * s), h = Math.round(H * s); return `<span class="eia" aria-hidden="true" style="width:${w}px;height:${h}px"><img alt="" width="${w}" height="${h}" loading="lazy" decoding="async" src="${eiaSrc(t, n)}"></span>`; }; }
Object.entries(EIA).forEach(([t, o]) => Object.entries(o).forEach(([n, v]) => { const k = eiaKey(t, n); SH_DEC[k] = eiaDec(t, n); SH_DH[k] = Math.round(v[0] * EIA_HB); SH_DW[k] = Math.round(v[0] * EIA_HB * v[2] / v[3]); SH_DN[k] = v[1]; }));
// chaves antigas (desenhos) que agora usam a ilustração: o que a pessoa já pôs na estante muda sozinho
const EIA_OLD = { planta: 'basicos_planta', vela: 'basicos_vela', luminaria: 'basicos_luminaria', globo: 'basicos_globo', xicara: 'basicos_cha', cristal: 'fantasia_cristal',
  tz_presentes: 'natal_presentes', tz_arvore: 'natal_redoma', tz_abobora: 'terror_abobora', tz_caveira: 'terror_caveira', tz_velaD: 'terror_vela', tz_corvo: 'terror_corvo',
  tz_rosas: 'romance_rosas', tz_coracao: 'romance_coracao', tz_cartas: 'romance_cartas', tz_dragao: 'fantasia_dragao', tz_pocao: 'fantasia_pocao', tz_lamparina: 'fantasia_lamparina',
  tz_mapa: 'fantasia_pergaminho', tz_gato: 'basicos_gato', tz_pendente: 'basicos_pendente' };
Object.entries(EIA_OLD).forEach(([old, nw]) => { const k = 'ia_' + nw; if (!SH_DEC[k]) return; SH_DEC[old] = SH_DEC[k]; SH_DW[old] = SH_DW[k]; SH_DH[old] = SH_DH[k]; try { FLW_DEC[old] = undefined; delete FLW_DEC[old]; } catch {} });
SH_DEC.globoP = (s) => SH_DEC.globo(s * 0.6);
// catálogo de "Enfeites": ilustrados primeiro, depois os desenhos sem equivalente
{ const keep = SH_CAT.filter(([k]) => !['planta', 'vela', 'luminaria', 'globo', 'xicara', 'cristal', 'leitor'].includes(k));
  const ap = keep.filter(([k]) => /^aparador/.test(k)), rest = keep.filter(([k]) => !/^aparador/.test(k));
  const novos = [['planta', 'Planta'], ['ia_basicos_suculenta', 'Suculenta'], ['ia_basicos_pendente', 'Planta pendente'], ['vela', 'Vela'], ['luminaria', 'Luminária'], ['globo', 'Globo'],
    ['ia_basicos_ampulheta', 'Ampulheta'], ['xicara', 'Xícara de chá'], ['ia_basicos_gato', 'Gato dormindo']];
  SH_CAT.splice(0, SH_CAT.length, ...ap, ...novos, ...rest, ['leitor', 'Leitor digital']); novos.forEach(([k, l]) => { SH_DN[k] = l; }); }
// temas: os pacotes passam a usar as ilustrações (aplicar põe as 5 primeiras; o carrossel mostra todas)
const EIA_PK = { natal: ['natal', ['redoma', 'presentes', 'quebra_nozes', 'globo_neve', 'caneca', 'lanterna', 'gato_gorro', 'retrato', 'aparador']],
  terror: ['terror', ['abobora', 'caveira', 'candelabro', 'corvo', 'teia', 'vela', 'veneno', 'lua', 'balao_barco']],
  romance: ['romance', ['rosas', 'cartas', 'coracao', 'vela', 'polaroids', 'perfume', 'xicara', 'anel', 'petalas']],
  fantasia: ['fantasia', ['dragao', 'bola_cristal', 'pocao', 'esfera', 'chapeu', 'coruja', 'arvore', 'portal', 'bau', 'cristal', 'calice', 'rosa_redoma', 'globo_mapa', 'esfera2', 'ampulheta', 'pergaminho', 'lamparina']],
  misterio: ['fantasia', ['lamparina', 'pergaminho', 'ampulheta', 'bola_cristal', 'globo_mapa']],
  aconchego: ['basicos', ['gato', 'cha', 'pendente', 'vela', 'suculenta']] };
try { Object.entries(EIA_PK).forEach(([id, [t, ns]]) => { const P = TZ_PACKS.find((x) => x[0] === id); if (P) P[2] = ns.map((n) => '=' + eiaKey(t, n)); });
  if (!TZ_PACKS.find((x) => x[0] === 'encantado')) TZ_PACKS.push(['encantado', 'Encantado', ['dragao', 'lanterna', 'bonsai', 'relogio', 'terrario', 'esfera', 'xicara', 'retrato', 'aparador_esq', 'aparador_dir'].map((n) => '=' + eiaKey('encantado', n)), 'rosa', 'ceu']);
} catch (e) { console.warn('enfeites ia: temas', e); }
// aplicar um tema põe só as 5 primeiras peças (as outras ficam no carrossel para pôr uma a uma)
{ const _ap = tzApply; tzApply = function (id) { const P = TZ_PACKS.find((x) => x[0] === id); if (!P || P[2].length <= 5) return _ap.apply(this, arguments); const all = P[2]; P[2] = all.slice(0, 5); try { return _ap.apply(this, arguments); } finally { P[2] = all; } }; }
// leitor digital ilustrado: capa dentro da tela com perspectiva (4 cantos medidos na imagem)
const EIA_LT = { tl: [0.1932, 0.1205], tr: [0.8058, 0.1067], br: [0.8859, 0.8003], bl: [0.2672, 0.8227] };
const EIA_LCAP = ['verde', 'rosa', 'lilas', 'areia', 'preto'];
try { delete SH_ERD.azul; } catch {}
function eiaQuad(p, W, H) { const [x0, y0] = p[0], [x1, y1] = p[1], [x2, y2] = p[2], [x3, y3] = p[3];
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2, sx = x0 - x1 + x2 - x3, sy = y0 - y1 + y2 - y3, den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den, a = x1 - x0 + g * x1, b = x3 - x0 + h * x3, d = y1 - y0 + g * y1, e = y3 - y0 + h * y3;
  return [a / W, d / W, 0, g / W, b / H, e / H, 0, h / H, 0, 0, 1, 0, x0, y0, 0, 1].map((v) => +v.toFixed(6)).join(','); }
SH_DEC.leitor = (s, d) => { const b = typeof shLeitorBook === 'function' ? shLeitorBook(d || {}) : null, H = Math.round(0.9 * EIA_HB * s), W = Math.round(H * 268 / 320);
  const cap = EIA_LCAP.includes(d && d.cap) ? d.cap : 'verde', P = [EIA_LT.tl, EIA_LT.tr, EIA_LT.br, EIA_LT.bl].map(([x, y]) => [x * W, y * H]);
  let gen = ''; try { gen = typeof v4cv === 'function' ? v4cv({ title: b ? b.t : 'Leitor digital', author: b ? b.a : '', cover: null }) : ''; } catch {}
  const scr = `<span class="gen${b && b.img ? ' hd' : ''}">${gen}</span>${b && b.img ? `<img alt="" loading="lazy" src="${esc(b.img)}" onerror="if(this.previousElementSibling)this.previousElementSibling.classList.remove('hd');this.remove()">` : ''}`;
  return `<span class="eia erdi${d && d.gr ? ' gr' : ''}" aria-hidden="true" style="width:${W}px;height:${H}px"><img alt="" width="${W}" height="${H}" decoding="async" src="${eiaSrc('leitor', 'leitor_' + cap)}"><span class="escr" style="width:100px;height:150px;transform:matrix3d(${eiaQuad(P, 100, 150)})">${scr}</span></span>`; };
SH_DW.leitor = Math.round(0.9 * EIA_HB * 268 / 320); SH_DH.leitor = Math.round(0.9 * EIA_HB);
try { FLW_DEC.leitor = undefined; delete FLW_DEC.leitor; Object.keys(FLW_DEC).forEach((k) => delete FLW_DEC[k]); } catch {}
// ---------- guirlandas: penduradas no alto do vão de uma prateleira ----------
const EIA_GRL = { natal: ['Guirlanda de Natal', 'natal'], encantado: ['Guirlanda encantada', 'encantado'] };
const grlMap = () => { const C0 = shc(); if (!C0.grl || typeof C0.grl !== 'object') C0.grl = {}; return C0.grl; };
function grlPaint() { try { const sr = shBibRoot(); if (!sr) return; try { sr.host.classList.toggle('eiaL', !!(TR && TR.host && TR.host.classList.contains('light'))); } catch {} const G = (shc().grl) || {}, md = typeof SHX_MODE !== 'undefined' ? SHX_MODE : '';
    sr.querySelectorAll('.bsh').forEach((sh) => { const bays = [...sh.querySelectorAll(':scope .bay')]; bays.forEach((bay, i) => { const r = bay.dataset.r != null ? bay.dataset.r : String(i), k = G[r];
      let el = bay.querySelector(':scope > .grl'); if (!k || !EIA_GRL[k]) { if (el) el.remove(); return; }
      if (!el || el.dataset.k !== k) { if (el) el.remove(); el = document.createElement('span'); el.className = 'grl'; el.dataset.k = k; el.innerHTML = `<img alt="" decoding="async" src="${eiaSrc(EIA_GRL[k][1], 'guirlanda')}">`; bay.prepend(el); }
      const ed = md === 'deco'; el.classList.toggle('ed', ed); let bt = el.querySelector('.grb');
      if (ed && !bt) { bt = document.createElement('span'); bt.className = 'grb'; bt.innerHTML = `<button type="button" data-grl="up" data-r="${r}" aria-label="Subir a guirlanda">↑</button><button type="button" data-grl="dn" data-r="${r}" aria-label="Descer a guirlanda">↓</button><button type="button" data-grl="rm" data-r="${r}" aria-label="Tirar a guirlanda">✕</button>`; el.append(bt); }
      else if (!ed && bt) bt.remove(); }); }); } catch (e) { console.warn('guirlanda', e); } }
function grlRows() { try { const sr = shBibRoot(), sh = sr && sr.querySelector('.bsh'); return sh ? [...sh.querySelectorAll('.bay')].map((b, i) => (b.dataset.r != null ? b.dataset.r : String(i))) : []; } catch { return []; } }
function grlAdd(k) { const G = grlMap(), rows = grlRows(); let r = rows.find((x) => !G[x]); if (r == null) r = rows[0] || '0';
  try { const sr = shBibRoot(); const vis = [...sr.querySelectorAll('.bsh .bay')].find((b) => { const R = b.getBoundingClientRect(); return R.bottom > 80 && R.top < innerHeight - 120 && !G[b.dataset.r != null ? b.dataset.r : '']; }); if (vis && vis.dataset.r != null) r = vis.dataset.r; } catch {}
  const bk = JSON.parse(JSON.stringify(G)); G[r] = k; shSave(); grlPaint(); toast(EIA_GRL[k][0] + ' na estante', { label: 'Desfazer', fn: () => { shc().grl = bk; shSave(); grlPaint(); } }); }
document.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.grl); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
  const G = grlMap(), r = b.dataset.r, rows = grlRows(), i = rows.indexOf(r), bk = JSON.parse(JSON.stringify(G)), a = b.dataset.grl;
  if (a === 'rm') { delete G[r]; } else { const j = i + (a === 'up' ? -1 : 1); if (j < 0 || j >= rows.length) return; const k = G[r]; delete G[r]; const o = G[rows[j]]; G[rows[j]] = k; if (o) G[r] = o; }
  shSave(); grlPaint(); if (a === 'rm') toast('Guirlanda tirada', { label: 'Desfazer', fn: () => { shc().grl = bk; shSave(); grlPaint(); } }); }, true);
// botões de guirlanda no carrossel de Temas e de Luzinhas
const grlBtns = () => Object.entries(EIA_GRL).map(([k, [l, t]]) => `<button type="button" class="tzi grlbtn" data-grlk="${k}" aria-label="Pôr ${l}"><span class="tzv th"><span class="eia" style="width:56px;height:18px"><img alt="" loading="lazy" src="${eiaSrc(t, 'guirlanda')}"></span></span><small>${l}</small></button>`).join('');
{ const _dp = dkPanel; dkPanel = function () { let h = _dp.apply(this, arguments); try { if (typeof FLX !== 'undefined' && FLX && (FLX.car === 'temas' || FLX.car === 'luz') && h && h.includes('class="dbody')) h = h.replace(/(<div class="dbody[^"]*"[^>]*>)/, `$1${grlBtns()}`); } catch {} return h; }; }
document.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.grlk); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault(); grlAdd(b.dataset.grlk); }, true);
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { grlPaint(); requestAnimationFrame(grlPaint); } catch {} return r; }; }
{ const _fr = flRender; flRender = function () { const r = _fr.apply(this, arguments); try { grlPaint(); } catch {} return r; }; }
const EIA_CSS = `.eia{display:block;position:relative;line-height:0}.eia>img{width:100%;height:100%;object-fit:contain;display:block;filter:brightness(.86) saturate(.86) contrast(.94) drop-shadow(-2px 2px 3px rgba(0,0,0,.45))}
:host(.eiaL) .eia>img{filter:brightness(.96) saturate(.9) contrast(.96) drop-shadow(-2px 2px 2px rgba(60,40,20,.25))}
.eia::after{content:"";position:absolute;left:12%;right:12%;bottom:-2px;height:6px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.42),transparent);pointer-events:none}
.th .eia,.tzv .eia,.dkpan .eia{max-width:56px;max-height:54px;width:auto!important;height:54px!important}.th .eia>img,.tzv .eia>img,.dkpan .eia>img{filter:none}.th .eia::after,.tzv .eia::after,.dkpan .eia::after{display:none}
.erdi .escr{position:absolute;left:0;top:0;transform-origin:0 0;overflow:hidden;background:#d9d6cf;pointer-events:none}.erdi .escr>img,.erdi .escr .gen{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.erdi .escr .gen.hd{opacity:0}
.erdi .escr{filter:grayscale(.3) contrast(.92) brightness(1.02) sepia(.1)}.erdi.gr .escr{filter:grayscale(1) contrast(.95)}
.bay{position:relative}.grl{position:absolute;left:0;right:0;top:0;z-index:4;pointer-events:none;display:block;line-height:0}.grl>img{width:100%;max-height:58px;object-fit:cover;object-position:center top;display:block;filter:brightness(.92) drop-shadow(0 3px 3px rgba(0,0,0,.35))}
.grl.ed{pointer-events:auto;outline:1.5px dashed rgba(255,255,255,.55);outline-offset:-2px}.grl .grb{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:flex;gap:4px}.grl .grb button{width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;font:700 15px/1 system-ui;cursor:pointer}
.grlbtn .eia{height:20px!important}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-eia]')) { const st = document.createElement('style'); st.dataset.eia = 1; st.textContent = EIA_CSS; sr.append(st); } } catch {} }; }
// enfeite que vai para a frente dos livros não cai em cima de outro da frente: procura o lugar mais livre nas prateleiras à vista
{ const _da = flDecoAdd; flDecoAdd = function () { const before = new Set(); try { shc().free.rows.forEach((rw) => rw.it.forEach((o) => before.add(o.u))); } catch {} const r = _da.apply(this, arguments);
  try { const F = shc().free, BW = flBW(); let row0 = -1, o = null; F.rows.forEach((rw, i) => rw.it.forEach((q) => { if (!before.has(q.u)) { o = q; row0 = i; } }));
    if (o && o.z) { const w = flW(o), cand = [row0, row0 + 1, row0 + 2].filter((i) => i < F.rows.length); let best = null;
      for (const ri of cand) { const row = F.rows[ri], NW = flNW(row, 0, BW), oth = row.it.filter((q) => q !== o && q.z).map((q) => [q.x, q.x + flW(q)]);
        for (let x = 0; x <= NW - w; x += 6) { const ov = oth.reduce((a, [l, rr]) => a + Math.max(0, Math.min(rr, x + w) - Math.max(l, x)), 0), cost = ov * 10 + (ri - row0) * 40 + Math.abs(x + w / 2 - NW / 2) * 0.05; if (!best || cost < best.c) best = { c: cost, ri, x }; } }
      if (best) { if (best.ri !== row0) { F.rows[row0].it = F.rows[row0].it.filter((q) => q !== o); F.rows[best.ri].it.push(o); } o.x = best.x; o.n = 0; shSave(); flRender(); } } } catch (e) { console.warn('enfeite frente', e); }
  return r; }; }
