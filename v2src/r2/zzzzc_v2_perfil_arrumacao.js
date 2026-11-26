// ---------- v2: a estante do perfil é a mesma que você arrumou e decorou (Bia, 26/11) ----------
// O perfil desenhava a prateleira em ordem automática (pratHTML da lista), ignorando a arrumação da Biblioteca (shc().free:
// posições, livros deitados, de frente, pilhas, enfeites no lugar). Agora a aba "Todas" do perfil desenha a arrumação.
// Sempre numa CÓPIA, sem modo de edição: a arrumação de verdade nunca muda por causa do perfil.
// Só entram os livros que o perfil pode mostrar (as estantes do perfil; estante privada fica de fora para quem visita).
// O resumo publicado leva a arrumação já filtrada, para as amizades verem igual.
function shFreeOnly(free, ok) {
  const F = JSON.parse(JSON.stringify(free));
  (F.rows || []).forEach((row) => { row.it = (row.it || []).filter((o) => {
    if (o.t === 'b') return ok.has(String(o.id));
    if (o.t === 'p') { o.ids = (o.ids || []).filter((id) => ok.has(String(id))); return o.ids.length > 0; }
    return true; }); });
  return F;
}
function shProfFreeHTML(list, w) {
  const C = shc(); if (!C || !C.free || !Array.isArray(C.free.rows) || !C.free.rows.length) return null;
  const ok = new Set(list.map((b) => String(b.id)));
  const cp = JSON.parse(JSON.stringify(C)); cp.free = shFreeOnly(C.free, ok);
  const keep = { ctx: SHX_CTX, main: FL_MAIN, sr: FL_SR, wb: FL_WB, pv: FL_PV, hbw: FL_HBW, pos: FLX.pos, posG: FLX.posG, pk: FLX.pk, sel: FLX.sel, fan: FLX.fan };
  SHX_CTX = cp; FL_MAIN = 1; FL_SR = document.createElement('div'); FL_WB = w; FL_PV = { free: cp.free, plq: cp.plq || [] }; // como prévia: o flSync nunca salva
  FLX.pos = null; FLX.posG = null; FLX.pk = null; FLX.sel = null; FLX.fan = null;
  try { return String(flHTML(list)).replace(/<div class="hint">[\s\S]*?<\/div>/, ''); }
  catch (err) { console.warn('arrumação no perfil', err); return null; }
  finally { SHX_CTX = keep.ctx; FL_MAIN = keep.main; FL_SR = keep.sr; FL_WB = keep.wb; FL_PV = keep.pv; FL_HBW = keep.hbw;
    FLX.pos = keep.pos; FLX.posG = keep.posG; FLX.pk = keep.pk; FLX.sel = keep.sel; FLX.fan = keep.fan; }
}
{ const _ph = shProfHTML; shProfHTML = function (L, mine, key) {
    const k = SHX_PF[key]; if (!(k == null || k >= L.length)) return _ph.apply(this, arguments); // estante escolhida: como antes
    const _pr = pratHTML; let done = false;
    pratHTML = function (list, sm, w) { if (!sm && !done) { done = true; const h = shProfFreeHTML(list, w); if (h) return h; } return _pr.apply(this, arguments); };
    let h; try { h = _ph.apply(this, arguments); } finally { pratHTML = _pr; }
    // a caixa do perfil mostra só o começo da estante: com a arrumação, "Ver estante inteira" aparece sempre que houver mais
    // de uma prateleira (antes só passava de 14 livros, e os enfeites das prateleiras de baixo ficavam escondidos)
    try { if (done && !/class="pfall"/.test(h) && (h.match(/class="bay fl"/g) || []).length > 1) { const all = !!SHX_PFX[key];
      h = h.replace(/<\/div>$/,`<button type="button" class="pfall" data-a="prat-go">${mine ? 'Ver estante inteira' : all ? 'Mostrar menos' : 'Ver estante inteira'}</button></div>`); } } catch {}
    return h; }; }
{ const _ss = shSnap; shSnap = function () { const r = _ss.apply(this, arguments);
    try { const C = shc(); if (r && r.C && C.free && Array.isArray(C.free.rows)) { r.C.free = shFreeOnly(C.free, new Set(Object.keys(r.b || {}))); r.C.tray = (C.tray || []).filter((id) => r.b && r.b[id]); } } catch (err) { console.warn('arrumação no resumo', err); }
    return r; }; }
