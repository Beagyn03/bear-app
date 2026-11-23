// ---------- v2: enfeites ilustrados (Bia, 22/11) ----------
// A Bia gerou os enfeites no ChatGPT (folhas por tema); recortados, limpos e salvos em img/enfeites/<tema>/<nome>.webp.
// Os desenhos antigos com equivalente passam a usar a ilustração (as chaves salvas continuam as mesmas: nada a migrar).
// Altura fixa por tipo (fração da altura da prateleira), luz ajustada ao tema e sombra de contato no pé.
// Guirlandas: peça nova, pendurada no alto do vão de uma prateleira (uma por prateleira).
// Desfazer/Refazer da coluna e os toasts com Desfazer também voltam escolhas de decoração (parede, madeira, lombadas, luzes, guirlanda, enfeites)
['deco', 'wood', 'wall', 'lt', 'spMode', 'spb', 'sp', 'ed', 'mk', 'lights', 'grl', 'freePend'].forEach((k) => { if (!SHX_BKK.includes(k)) SHX_BKK.push(k); });
// congelar a estante ao entrar no Organizar/Decorar não vira passo do Desfazer
{ const _fz = flFreeze; flFreeze = function () { const r = _fz.apply(this, arguments); if (r) { FLH_LOCK++; queueMicrotask(() => { FLH_LOCK--; try { const b = shBk(); FLH_CUR = { bk: b, js: JSON.stringify(b) }; flhPaint(); } catch {} }); } return r; }; }
// faixa Lombadas: o botão de um livro só cabe no cartão
{ const _dl = dkPanel; dkPanel = function () { let h = _dl.apply(this, arguments); try { h = h.replace('>Editar a lombada de um livro<', '><b>Só um livro</b><small>editar a lombada</small><').replace('>Toque no livro na estante…<', '><b>Toque no livro</b><small>na estante</small><'); } catch {} return h; }; }
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
      const ed = md === 'deco'; el.classList.toggle('ed', ed); el.classList.toggle('sel', ed && GRL_SEL === r); el.dataset.r = r;
      }); }); grlPanel(sr); } catch (e) { console.warn('guirlanda', e); } }
function grlRows() { try { const sr = shBibRoot(), sh = sr && sr.querySelector('.bsh'); return sh ? [...sh.querySelectorAll('.bay')].map((b, i) => (b.dataset.r != null ? b.dataset.r : String(i))) : []; } catch { return []; } }
function grlAdd(k) { const G = grlMap(), rows = grlRows(); let r = rows.find((x) => !G[x]); if (r == null) r = rows[0] || '0';
  try { const sr = shBibRoot(); const vis = [...sr.querySelectorAll('.bsh .bay')].find((b) => { const R = b.getBoundingClientRect(); return R.bottom > 80 && R.top < innerHeight - 120 && !G[b.dataset.r != null ? b.dataset.r : '']; }); if (vis && vis.dataset.r != null) r = vis.dataset.r; } catch {}
  const bk = JSON.parse(JSON.stringify(G)); G[r] = k; shSave(); grlPaint(); toast(EIA_GRL[k][0] + ' na estante', { label: 'Desfazer', fn: () => { shc().grl = bk; shSave(); grlPaint(); } }); }
let GRL_SEL = null;
// painel da guirlanda selecionada (mesmo padrão do painel dos enfeites): Subir · Descer · Trocar · Remover
function grlPanel(sr) { try { sr.querySelectorAll('.grlpan').forEach((e) => e.remove()); if (GRL_SEL == null || SHX_MODE !== 'deco') return; const el = sr.querySelector(`.bsh .grl[data-r="${GRL_SEL}"]`); if (!el) { GRL_SEL = null; return; }
  const E = el.getBoundingClientRect(), p = document.createElement('div'); p.className = 'grlpan'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-label', 'Guirlanda');
  const B = (a, ic, l, c) => `<button type="button" class="fpb${c ? ' ' + c : ''}" data-grl="${a}" data-r="${GRL_SEL}">${ic}<span>${l}</span></button>`, I = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  p.innerHTML = `<div class="fph2"><span class="fpn">${esc((EIA_GRL[(shc().grl || {})[GRL_SEL]] || ['Guirlanda'])[0])}</span><button type="button" class="fpok" data-grl="ok" aria-label="Pronto">${I('<path d="m5 12 5 5 9-10"/>')}</button></div><div class="fpg">${B('up', I('<path d="M12 19V5M6 11l6-6 6 6"/>'), 'Subir')}${B('dn', I('<path d="M12 5v14M6 13l6 6 6-6"/>'), 'Descer')}${B('tc', I('<path d="M4 7h13l-3-3M20 17H7l3 3"/>'), 'Trocar')}${B('rm', I('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'), 'Remover', 'red')}</div>`;
  const R = sr.querySelector('.v5est') || sr; R.appendChild(p); const ph = p.offsetHeight, pw = p.offsetWidth; let top = E.bottom + 10; if (top + ph > innerHeight - 90) top = Math.max(64, E.top - ph - 10);
  const left = Math.max(8, Math.min(innerWidth - pw - 70, E.left + E.width / 2 - pw / 2)); p.style.top = top + 'px'; p.style.left = left + 'px'; } catch (e) { console.warn('painel guirlanda', e); } }
// o toque na faixa da guirlanda é dela, não do livro de baixo
{ const _n = flNicheAt; flNicheAt = function (T) { try { if (T && T.closest && (T.closest('.grl') || T.closest('.grlpan'))) return null; } catch {} return _n.apply(this, arguments); }; }
{ const _h = flHitFli; flHitFli = function (T) { try { if (SHX_MODE === 'deco' && T && T.closest && (T.closest('.grl') || T.closest('.grlpan'))) return null; } catch {} return _h.apply(this, arguments); }; }
window.addEventListener('click', (ev) => { try { if (typeof SHX_MODE === 'undefined' || SHX_MODE !== 'deco') return; const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.grl), g = p.find((n) => n && n.classList && n.classList.contains && n.classList.contains('grl'));
  if (!b && g) { ev.stopImmediatePropagation(); ev.preventDefault(); GRL_SEL = GRL_SEL === g.dataset.r ? null : g.dataset.r; try { navigator.vibrate && navigator.vibrate(8); } catch {} return grlPaint(); }
  if (!b) { if (GRL_SEL != null && !p.find((n) => n && n.classList && n.classList.contains && n.classList.contains('grlpan'))) { GRL_SEL = null; grlPaint(); } return; }
  ev.stopImmediatePropagation(); ev.preventDefault(); const a = b.dataset.grl; if (a === 'ok') { GRL_SEL = null; return grlPaint(); }
  const G = grlMap(), r = b.dataset.r, rows = grlRows(), i = rows.indexOf(r), bk = JSON.parse(JSON.stringify(G));
  if (a === 'rm') { delete G[r]; GRL_SEL = null; } else if (a === 'tc') { G[r] = G[r] === 'natal' ? 'encantado' : 'natal'; } else { const j = i + (a === 'up' ? -1 : 1); if (j < 0 || j >= rows.length) return toast(a === 'up' ? 'Já está na prateleira de cima' : 'Já está na prateleira de baixo'); const k = G[r]; delete G[r]; const o = G[rows[j]]; G[rows[j]] = k; if (o) G[r] = o; GRL_SEL = rows[j]; }
  shSave(); grlPaint(); if (a === 'rm') toast('Guirlanda tirada', { label: 'Desfazer', fn: () => { shc().grl = bk; shSave(); grlPaint(); } }); } catch (e) { console.warn('guirlanda', e); } }, true);
// botões de guirlanda no carrossel de Temas e de Luzinhas
const grlBtns = () => Object.entries(EIA_GRL).map(([k, [l, t]]) => `<button type="button" class="tzi grlbtn" data-grlk="${k}" aria-label="Pôr ${l}"><span class="tzv th"><span class="eia" style="width:56px;height:18px"><img alt="" loading="lazy" src="${eiaSrc(t, 'guirlanda')}"></span></span><small>${l}</small></button>`).join('');
{ const _dp = dkPanel; dkPanel = function () { let h = _dp.apply(this, arguments); try { if (typeof FLX !== 'undefined' && FLX && FLX.car === 'temas' && h && h.includes('class="dbody')) h = h.replace(/(<div class="dbody[^"]*"[^>]*>)/, `$1${grlBtns()}`); } catch {} return h; }; }
document.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : [], b = p.find((n) => n && n.dataset && n.dataset.grlk); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault(); grlAdd(b.dataset.grlk); }, true);
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { grlPaint(); requestAnimationFrame(grlPaint); } catch {} return r; }; }
{ const _fr = flRender; flRender = function () { const r = _fr.apply(this, arguments); try { grlPaint(); } catch {} return r; }; }
const EIA_CSS = `
.v4ler .dkpan.flcar .dbody [data-a=dkpqok],.v4ler .dkpan.flcar .dbody [data-a=dkpqrm],.v4ler .dkpan.flcar .dbody [data-a=dkpqnew]{order:1}.v4ler .dkpan.flcar .dbody .pqsw>button{order:2}.v4ler .dkpan.flcar .dbody .dchips>button{order:3}.v4ler .dkpan.flcar .dbody .pqin{order:0;display:flex!important;flex:0 0 168px;height:96px;margin:0;box-sizing:border-box;flex-direction:column;align-items:stretch;justify-content:center;gap:2px;border-radius:14px;background:color-mix(in srgb,var(--card) 70%,transparent)}.v4ler .dkpan.flcar .dbody .pqin input{min-height:40px;font-size:15px;border-bottom:1.5px solid var(--line)}.v4ler .dkpan.flcar .dbody .pqin .cnt{align-self:flex-end}
.v4ler .dkpan.flcar .dbody button.btn{white-space:normal;line-height:1.15;text-align:center;gap:4px}.v4ler .dkpan.flcar .dbody button.btn small{font-size:11px;font-weight:600;color:var(--ink2)}.v4ler .dkpan.flcar .dbody button.btn.p small{color:inherit;opacity:.85}.eia{display:block;position:relative;line-height:0}.eia>img{width:100%;height:100%;object-fit:contain;display:block;filter:brightness(.86) saturate(.86) contrast(.94) drop-shadow(-2px 2px 3px rgba(0,0,0,.45))}
:host(.eiaL) .eia>img{filter:brightness(.96) saturate(.9) contrast(.96) drop-shadow(-2px 2px 2px rgba(60,40,20,.25))}
.eia::after{content:"";position:absolute;left:12%;right:12%;bottom:-2px;height:6px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.42),transparent);pointer-events:none}
.th .eia,.tzv .eia,.dkpan .eia{max-width:56px;max-height:54px;width:auto!important;height:54px!important}.th .eia>img,.tzv .eia>img,.dkpan .eia>img{filter:none}.th .eia::after,.tzv .eia::after,.dkpan .eia::after{display:none}
.erdi .escr{position:absolute;left:0;top:0;transform-origin:0 0;overflow:hidden;background:#d9d6cf;pointer-events:none}.erdi .escr>img,.erdi .escr .gen{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.erdi .escr .gen.hd{opacity:0}
.erdi .escr{filter:grayscale(.3) contrast(.92) brightness(1.02) sepia(.1)}.erdi.gr .escr{filter:grayscale(1) contrast(.95)}
.bay{position:relative}.grl{position:absolute;left:0;right:0;top:0;z-index:4;pointer-events:none;display:block;line-height:0}.grl>img{width:100%;max-height:58px;object-fit:cover;object-position:center top;display:block;filter:brightness(.92) drop-shadow(0 3px 3px rgba(0,0,0,.35))}
.grl.ed{pointer-events:auto;cursor:pointer}.grl.sel{outline:2px solid var(--acc,#e0ad3a);outline-offset:-2px;z-index:6}.grlpan{position:fixed;z-index:10003;padding:6px;border-radius:16px;background:var(--card);color:var(--ink);border:1px solid var(--line);box-shadow:0 14px 34px rgba(0,0,0,.38)}.grlpan .fph2{display:flex;align-items:center;gap:6px;margin:0 2px 4px}.grlpan .fpn{flex:1;font-size:11.5px;font-weight:700;color:var(--ink2)}.grlpan .fpok{width:32px;height:32px;border-radius:50%;border:0;background:var(--acc);color:var(--on-acc,#fff);display:grid;place-items:center}.grlpan .fpg{display:grid;grid-template-columns:repeat(4,64px);gap:4px}.grlpan .fpb{height:46px;border-radius:10px;border:1px solid var(--line);background:var(--soft,rgba(127,127,127,.12));color:var(--ink);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:0;font:inherit;font-size:10.5px;font-weight:700;cursor:pointer}.grlpan .fpb.red{color:#e5675a}.grl .grb{position:absolute;right:6px;top:50%;transform:translateY(-50%);display:flex;gap:4px}.grl .grb button{width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.65);color:#fff;font:700 15px/1 system-ui;cursor:pointer}
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
// ---------- faixas da coluna nascem ao lado do botão tocado (Bia, 22/11) ----------
// Categorias do Decorar, "Arrumar por" e "•••": a faixa fica alinhada ao centro do botão, vai até a borda oposta e tem uma setinha para ele.
let FLA_LAST = '';
function flcAnchorPos() { try { const sr = shBibRoot(); if (!sr) return; const col = sr.querySelector('.flcol'); if (!col) return; const vw = innerWidth, vh = innerHeight;
  const place = (panel, btn) => { if (!panel || !btn) return; const B = btn.getBoundingClientRect(); if (!B.width) return; const side = B.left > vw / 2 ? 'R' : 'L';
    const h = panel.offsetHeight || 110, top = Math.max(70, Math.min(vh - h - 12 - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0), B.top + B.height / 2 - h / 2));
    const st = panel.style; st.setProperty('top', top + 'px', 'important'); st.setProperty('bottom', 'auto', 'important'); st.setProperty('max-width', 'none', 'important');
    if (side === 'R') { st.setProperty('right', (vw - B.left + 10) + 'px', 'important'); st.setProperty('left', '16px', 'important'); } else { st.setProperty('left', (B.right + 10) + 'px', 'important'); st.setProperty('right', '16px', 'important'); }
    st.setProperty('width', 'auto', 'important'); st.setProperty('--ay', Math.max(14, Math.min(h - 14, B.top + B.height / 2 - top)) + 'px'); st.setProperty('transform-origin', (side === 'R' ? '100% ' : '0 ') + (B.top + B.height / 2 - top) + 'px');
    panel.classList.toggle('flaR', side === 'R'); panel.classList.toggle('flaL', side === 'L'); panel.classList.add('flanc'); const key = (btn.dataset.k || btn.dataset.fl || '') + side; if (panel.classList.contains('dkpan') && FLA_LAST !== key) { panel.classList.add('flanew'); } FLA_LAST = key; };
  if (!sr.querySelector('.dkpan.flcar')) FLA_LAST = '';
  place(sr.querySelector('.dkpan.flcar'), col.querySelector('.flcat.on, [data-fl="car"][aria-pressed="true"]'));
  place(sr.querySelector('.shx-sx.flarr.flcar2'), col.querySelector('[data-fl="arr"]'));
  sr.querySelectorAll('.flpop').forEach((p) => place(p, col.querySelector('[data-fl="more"]'))); } catch (e) { console.warn('faixa ao lado', e); } }
{ const _sd = shDraw; shDraw = function () { const r = _sd.apply(this, arguments); try { flcAnchorPos(); requestAnimationFrame(flcAnchorPos); } catch {} return r; }; }
{ const _fr = flRender; flRender = function () { const r = _fr.apply(this, arguments); try { flcAnchorPos(); requestAnimationFrame(flcAnchorPos); } catch {} return r; }; }
{ const _ar = flArrSheet; flArrSheet = function () { const r = _ar.apply(this, arguments); try { flcAnchorPos(); requestAnimationFrame(flcAnchorPos); setTimeout(flcAnchorPos, 60); } catch {} return r; }; }
{ const _p = flPop; flPop = function () { const r = _p.apply(this, arguments); try { requestAnimationFrame(flcAnchorPos); } catch {} return r; }; }
addEventListener('resize', () => { try { flcAnchorPos(); } catch {} });
const FLA_CSS = `.v4ler .flanc{overflow:visible!important}.v4ler .flanc::after{content:"";position:absolute;top:calc(var(--ay,50%) - 8px);width:0;height:0;border:8px solid transparent;pointer-events:none}
.v4ler .flanc.flaR::after{right:-15px;border-left-color:var(--card,#2a2235)}.v4ler .flanc.flaL::after{left:-15px;border-right-color:var(--card,#2a2235)}
.v4ler .flanc .dbody,.v4ler .flanc>div{overflow-x:auto}
@media (prefers-reduced-motion:no-preference){.v4ler .flarr.flanc,.v4ler .flpop.flanc{animation:flanin .16s ease-out}.v4ler .dkpan.flanc.flanew{animation:flanin .16s ease-out}@keyframes flanin{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}}`;
{ const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-fla]')) { const st = document.createElement('style'); st.dataset.fla = 1; st.textContent = FLA_CSS; sr.append(st); } } catch {} }; }
