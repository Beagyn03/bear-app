// ---------- v2: segurança da estante publicada (auditoria 26/11, XSS) ----------
// O resumo que cada pessoa publica (snapshot.shelf.prat.C) é JSON livre e entrava no HTML de quem visita o perfil sem
// escape: foto da lombada (sp), cor da borda (ed.e), tema (wall, lt.c) e o id de cada peça da arrumação (free.rows.it.u).
// Uma estante "envenenada" rodaria código no aparelho de quem abrisse o perfil e poderia levar o login.
// Duas camadas:
//  1) tudo que vem de OUTRA pessoa passa por shSafeC antes de desenhar: foto só data:image base64 ou https limpo;
//     qualquer outro texto do contexto só com letras, números e poucos sinais (sem aspas, <, >, (, ), ; ou :).
//     Os rótulos das plaquinhas (plq.t) continuam livres porque já são escapados ao desenhar.
//  2) os pontos de desenho escapam/validam de novo (shSafeTok/shSafeUrl e esc), valendo também para dados próprios.
const SH_TOK_RE = /^[\p{L}\p{N} _#.,%+-]{0,80}$/u;
const SH_DATA_RE = /^data:image\/(png|jpe?g|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
const SH_HTTPS_RE = /^https:\/\/[A-Za-z0-9.-]+(:\d+)?\/[A-Za-z0-9._~!$&*+,=@%/?-]*$/;
function shSafeUrl(u) { const s = String(u == null ? '' : u); return SH_DATA_RE.test(s) || (s.length < 2000 && SH_HTTPS_RE.test(s)) ? s : ''; }
function shSafeTok(v) { if (v == null) return ''; const s = String(v); return SH_TOK_RE.test(s) ? s : ''; }
function shSafeC(C) {
  if (!C || typeof C !== 'object') return {};
  const walk = (v, path) => {
    if (typeof v === 'string') { if (path[0] === 'sp') return shSafeUrl(v) || undefined; if (path[0] === 'plq' && path[path.length - 1] === 't') return v.slice(0, 40); return SH_TOK_RE.test(v) ? v : undefined; }
    if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
    if (typeof v === 'boolean' || v === null) return v;
    if (Array.isArray(v)) return v.slice(0, 2000).map((x) => walk(x, path)).filter((x) => x !== undefined);
    if (typeof v === 'object') { const o = {}; for (const k of Object.keys(v).slice(0, 5000)) { if (!/^[\p{L}\p{N} _#.%+-]{1,120}$/u.test(k)) continue; const w = walk(v[k], path.length ? path.concat(k) : [k]); if (w !== undefined) o[k] = w; } return o; }
    return undefined; };
  return walk(C, []);
}
// perfil de outra pessoa: o contexto da estante passa pelo filtro antes de qualquer desenho
{ const _pd = shProfData; shProfData = function (d) { const x = _pd.apply(this, arguments);
    try { if (x && x.vis) x.C = shDefaults(shSafeC(x.C)); } catch (err) { console.warn('estante segura', err); if (x) x.C = shDefaults({}); } return x; }; }
