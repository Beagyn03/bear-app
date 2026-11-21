// Paridade produção × v2 (Bia, 20/11), decisões sobre o relatório:
// 1) Conquistas saíram do app: nada de aviso "Conquista nova", "Ver conquistas" nem envio à API (quem já ganhou não perde nada no banco).
// 2) Sons de interface (toque, página, folha) desligados: o interruptor saiu dos Ajustes. O som ambiente da sessão Ler continua (é escolha da pessoa).
// 3) Silenciar: uma lista só, guardada na conta (/v1/mutes). O "Silenciar @x" do post grava no aparelho e este bloco espelha na conta;
//    o que já estava só no aparelho sobe uma vez. A lista fica em Ajustes › Silenciadas; a engrenagem da Comunidade não repete
//    Silenciadas nem Denúncias (Denúncias fica em Ajustes › Moderação).
// 4) Excluir conta só em Ajustes (sai de Editar perfil).
// 5) Ajustes › Importar histórico abre direto o arquivo (Goodreads/StoryGraph); ao terminar, leva para Ajustar leituras para conferir.
checkAchievements = function () {};
try { SFX.play = function () {}; } catch {}
// ---------- silenciar: uma lista só ----------
const v2MuLoc = () => [...new Set(((db.prefs && db.prefs.rdMuteU) || []).map((x) => String(x).toLowerCase()))];
let v2MuBusy = false;
async function v2MuSync(pull) {
  if (v2MuBusy) return; try { if (!connected() || !socialProfile) return; } catch { return; }
  const L = v2MuLoc(), Sy = db.prefs && Array.isArray(db.prefs.rdMuteSy) ? db.prefs.rdMuteSy : null;
  const add = Sy ? L.filter((h) => !Sy.includes(h)) : L, rem = Sy ? Sy.filter((h) => !L.includes(h)) : [];
  if (!pull && !add.length && !rem.length && Sy) return;
  v2MuBusy = true; let ok = true;
  try {
    for (const h of add) { const r = await sapi('POST', '/v1/mutes/' + encodeURIComponent(h)).catch(() => null); if (!r) ok = false; }
    for (const h of rem) { const r = await sapi('DELETE', '/v1/mutes/' + encodeURIComponent(h)).catch(() => null); if (!r) ok = false; }
    if (!ok) return; // sem rede: tenta de novo depois, sem perder nada
    if (pull || !Sy) { const r = await sapi('GET', '/v1/mutes').catch(() => null);
      if (r && r.status === 200 && r.data) { const A = (r.data.items || []).map((x) => String(x.handle).toLowerCase()); db.prefs = { ...(db.prefs || {}), rdMuteU: A, rdMuteSy: A }; save(); return; } }
    db.prefs = { ...(db.prefs || {}), rdMuteSy: v2MuLoc() }; save();
  } finally { v2MuBusy = false; }
}
setTimeout(() => v2MuSync(true), 4000);
setInterval(() => v2MuSync(false), 20000);
TR.addEventListener('click', (ev) => { const desf = ev.target.closest && ev.target.closest('.v2mu [data-i]'); setTimeout(() => v2MuSync(!!desf), desf ? 900 : 500); }, true);
{ const _t = v2MuteToggle; v2MuteToggle = async function (d) { const r = await _t.apply(this, arguments);
  try { const h = String(d.handle).toLowerCase(), L = v2MuLoc().filter((x) => x !== h), N = d.muted ? [...L, h] : L; db.prefs = { ...(db.prefs || {}), rdMuteU: N, rdMuteSy: N }; save(); } catch {}
  return r; }; }
{ const _s = v2MutesSheet; v2MutesSheet = function () { const r = _s.apply(this, arguments); v2MuSync(false); return r; }; }
// engrenagem da Comunidade: sem Silenciadas e Denúncias (ficam em Ajustes)
{ const _rf = rdFiltersSheet; rdFiltersSheet = function () { const r = _rf.apply(this, arguments);
  try { const w = [...document.querySelectorAll('.rdf-sheet'), ...TR.querySelectorAll('.rdf-sheet')].pop(); if (w) { w.querySelector('#rdf-mu')?.remove(); w.querySelector('#rdf-mod')?.remove(); } } catch {}
  return r; }; }
// ---------- Ajustes: Excluir conta só em Ajustes; Importar histórico abre o arquivo ----------
{ const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
  try {
    if (S.ajMode === 'perfil') { box.querySelectorAll('#aj-del, #aj-v4del').forEach((b) => { const c = b.closest('.aj-card'); const g = c && c.previousElementSibling; b.remove(); if (c && !c.querySelector('button, .aj-row')) { c.remove(); if (g && g.classList.contains('aj-g')) g.remove(); } }); }
    const hl = box.querySelector('#aj-hl');
    if (hl && !hl.dataset.w1) { const nb = hl.cloneNode(true); nb.dataset.w1 = '1'; nb.addEventListener('click', () => { S.impAj = Date.now(); importCSV(); }); hl.replaceWith(nb); }
  } catch (err) { console.warn('ajustes w1', err); }
  return r; }; }
{ const _ai = window.lvAfterImport; window.lvAfterImport = (n) => {
  if (S.impAj && Date.now() - S.impAj < 10 * 60e3) { S.impAj = 0; if (n) { setTimeout(() => { try { openFixReads(); } catch {} }, 1200); return; } }
  return _ai && _ai(n); }; }
