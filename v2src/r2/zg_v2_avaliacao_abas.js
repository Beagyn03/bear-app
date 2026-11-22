// Avaliação em 3 abas (Bia, 22/11; protótipo v199): a página do Terminei / Minha avaliação vira
// cabeçalho compacto (capa pequena + "Título · Lido · 15/11 → 22/11") e as abas Avaliação · Lembranças · Histórico.
// Avaliação: datas, nota (meia vale), favoritos só com 5, resenha, spoiler só com texto, níveis do enredo abertos
// (linhas de 5 pontos, sugestões pelo gênero, "Ver todos"), Quem vê e o convite para as Lembranças.
// Lembranças: emoções da lista de produção (texto curto, valor de produção) + Encantador, Medo, Aflição e Sofrimento,
// personagem favorito, amei odiar, trecho favorito (dos salvos ou novo) e ressaca. Histórico: a mesma constelação do
// Atualizar (v6HistPaint), com "Usar na avaliação" nos trechos e nas emoções. Grava nos mesmos campos de antes
// (e.review e e.fin); sem migração.
const AV_FE = [['alegria', 'Alegria'], ['euforia', 'Euforia'], ['paixao', 'Paixão'], ['excitacao', 'Excitação'], ['borboletas', 'Borboletas'], ['shippando', 'Shippando'],
  ['rindo', 'Rindo alto'], ['conforto', 'Leitura conforto'], ['encantador', 'Encantador'], ['naoparo', 'Viciante'], ['curiosidade', 'Curiosidade'], ['ansiedade', 'Ansiedade'],
  ['tensao', 'Tensão total'], ['intensidade', 'Intensidade'], ['arrepios', 'Arrepios'], ['medo', 'Medo'], ['aflicao', 'Aflição'], ['coracao_partido', 'Coração partido'],
  ['chorei_litros', 'Chorei'], ['sofrimento', 'Sofrimento'], ['plot_surpresa', 'Surpreendente'], ['plot_previsivel', 'Previsível'], ['plot_fraco', 'Enredo fraco'],
  ['tedio', 'Tédio'], ['confusao', 'Confusão'], ['frustracao', 'Frustração'], ['raiva_personagem', 'Raiva'], ['cringe', 'Vergonha alheia'], ['nojo', 'Nojo']];
const AV_FE_DEF = ['alegria', 'paixao', 'borboletas', 'shippando', 'rindo', 'conforto', 'naoparo', 'tensao', 'coracao_partido', 'chorei_litros', 'plot_surpresa', 'raiva_personagem'];
// chaves da lista do v2 → chave desta lista (para abrir preenchido o que já foi marcado em outro lugar)
const AV_FROM = { ri: 'rindo', apaixonei: 'paixao', emocionei: 'coracao_partido', reviravolta: 'plot_surpresa', surpreendente: 'plot_surpresa', chorei: 'chorei_litros', arrastado: 'tedio',
  encanto: 'encantador', angustia: 'aflicao', arrepio: 'arrepios', doeu: 'sofrimento', raiva: 'raiva_personagem', amei: 'paixao', choque: 'plot_surpresa', arrepiei: 'arrepios', saudade: 'sofrimento' };
const avKey = (k) => { if (!k) return null; if (AV_FE.some((y) => y[0] === k)) return k; if (AV_FROM[k]) return AV_FROM[k]; const byL = AV_FE.find((y) => y[1] === k); return byL ? byL[0] : null; };
// o resto do app (retrospectiva, resumo) reconhece as chaves novas
try { Object.assign(EMO_OLD, { encantador: 'encanto', aflicao: 'angustia', sofrimento: 'doeu' }); } catch {}
try { [['encantador', 'Encantador'], ['aflicao', 'Aflição'], ['sofrimento', 'Sofrimento'], ['alegria', 'Alegria'], ['paixao', 'Paixão'], ['excitacao', 'Excitação'], ['borboletas', 'Borboletas'],
  ['shippando', 'Shippando'], ['rindo', 'Rindo alto'], ['conforto', 'Leitura conforto'], ['curiosidade', 'Curiosidade'], ['intensidade', 'Intensidade'], ['arrepios', 'Arrepios'],
  ['coracao_partido', 'Coração partido'], ['chorei_litros', 'Chorei'], ['plot_surpresa', 'Surpreendente'], ['plot_previsivel', 'Previsível'], ['plot_fraco', 'Enredo fraco'], ['raiva_personagem', 'Raiva']]
  .forEach((x) => { if (typeof QT_FEELS !== 'undefined' && !QT_FEELS.some((y) => y[0] === x[0])) QT_FEELS.push(x); }); } catch {}
// as 12 que aparecem primeiro: as mais marcadas pela pessoa; sem histórico, a lista padrão
function avTop12() {
  const n = new Map(); try { lib().forEach((e) => { [...(((e.fin || {}).fe) || []), ...((e.diary || []).flatMap((d) => d.fe || []))].forEach((k) => { const a = avKey(k); if (a) n.set(a, (n.get(a) || 0) + 1); }); }); } catch {}
  const mine = [...n.entries()].sort((a, b) => b[1] - a[1]).map((x) => x[0]);
  return [...new Set([...mine, ...AV_FE_DEF])].slice(0, 12);
}
// sugestões de níveis pelo gênero do livro
function avNivSug(e) {
  const g = String((e && (e.genre || (e.meta && e.meta.genre))) || '').toLowerCase();
  if (/suspense|thriller|policial|crime|mist/.test(g)) return ['suspense', 'tensao', 'plot', 'misterio', 'slow'];
  if (/romance|romantasia|hot|dark/.test(g)) return ['romance', 'hot', 'choro', 'humor', 'slow'];
  if (/fantasia|fic[cç][aã]o cient|distopia|jovem/.test(g)) return ['fantasia', 'acao', 'romance', 'plot', 'drama'];
  if (/terror|horror/.test(g)) return ['terror', 'tensao', 'suspense', 'angst', 'plot'];
  return ['drama', 'choro', 'tensao', 'plot', 'humor'];
}
const avDM = (d) => (d ? d.slice(8, 10) + '/' + d.slice(5, 7) : '');
{ const st = document.createElement('style'); st.className = 'zgcss'; st.textContent = `
.v4fim.avz .avh{display:flex;align-items:center;gap:10px;margin:2px 0 10px}.v4fim.avz .avh .cv{width:40px!important;height:60px!important;flex:none}
.v4fim.avz .avh>div{min-width:0}.v4fim.avz .avh b{display:block;font-size:15px;line-height:1.25;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v4fim.avz .avh small{display:block;font-size:12.5px;font-weight:800;color:#2f8a52}
.v4fim.avz .avtabs{display:flex;border-bottom:1.5px solid var(--line);margin:0 0 12px}
.v4fim.avz .avtabs button{flex:1;border:0;background:none;padding:10px 4px;font:inherit;font-size:14px;font-weight:800;color:var(--ink2);border-bottom:2.5px solid transparent;margin-bottom:-1.5px;display:inline-flex;gap:5px;white-space:nowrap;align-items:center;justify-content:center;cursor:pointer}
.v4fim.avz .avtabs button.on{color:var(--ink);border-bottom-color:var(--acc)}.v4fim.avz .avtabs i{font-style:normal;font-size:10.5px;white-space:nowrap;padding:1px 5px;border-radius:99px;background:var(--card);border:1px solid var(--line)}
.v4fim.avz .avtabs i.has{color:var(--acc);border-color:var(--acc)}
.v4fim.avz .avp[hidden],.v4fim.avz [hidden]{display:none!important}
.v4fim.avz .avnd{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:var(--ink2);margin:6px 0 2px;cursor:pointer}.v4fim.avz .avnd input{width:16px;height:16px}
.v4fim.avz .avnr{display:flex;align-items:flex-end;justify-content:space-between;gap:8px;margin-top:10px}.v4fim.avz .avnr .stars5{margin:0}
.v4fim.avz .avnvb{flex:none;border:1.5px dashed var(--acc);background:none;color:var(--acc);border-radius:12px;padding:6px 9px;font:inherit;font-size:12px;font-weight:800;max-width:112px;line-height:1.15}
.v4fim.avz .avhint{font-size:11.5px;color:var(--ink2);font-weight:700}
.v4fim.avz .avfav{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:var(--ink);margin:8px 0 0;cursor:pointer}.v4fim.avz .avfav small{font-weight:700;color:var(--ink2)}
.v4fim.avz .avsum{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 0}.v4fim.avz .avsum:empty{display:none}.v4fim.avz .avsum span{border:1px solid var(--line);border-radius:99px;padding:2px 9px;font-size:11.5px;font-weight:800;color:var(--ink2)}
.v4fim.avz .avsp{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;margin:8px 0 0}.v4fim.avz .avsp input{width:18px;height:18px}.v4fim.avz .avsp.off{opacity:.85}.v4fim.avz .avsp.off input{opacity:.5}.v4fim.avz .avsp small{font-weight:700;color:var(--ink2);font-size:11.5px}
.v4fim.avz .avnv{margin-top:16px}.v4fim.avz .avnv h4{margin:0;font-size:14px}.v4fim.avz .avnv p{margin:2px 0 6px;font-size:12px;color:var(--ink2);font-weight:700;display:flex;justify-content:space-between}
.v4fim.avz .avrow{display:flex;align-items:center;justify-content:space-between;min-height:44px;border-bottom:1px solid var(--line)}.v4fim.avz .avrow>span{font-size:13.5px;font-weight:800}
.v4fim.avz .avdots{display:flex}.v4fim.avz .avdots button{width:40px;height:44px;border:0;background:none;padding:0;display:grid;place-items:center;cursor:pointer}
.v4fim.avz .avdots button i{width:16px;height:16px;border-radius:50%;border:2px solid color-mix(in srgb,var(--ink2) 55%,transparent);display:block}.v4fim.avz .avdots button.on i{background:var(--acc);border-color:var(--acc)}
.v4fim.avz .avlink{border:0;background:none;color:var(--acc);font:inherit;font-weight:800;font-size:13px;padding:8px 0;cursor:pointer}
.v4fim.avz .avline{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;border:1.5px solid var(--line);background:var(--card);border-radius:14px;padding:11px 13px;margin-top:10px;font:inherit;text-align:left;color:var(--ink);cursor:pointer}
.v4fim.avz .avline b{font-size:13.5px}.v4fim.avz .avline small{display:block;font-size:11.5px;color:var(--ink2);font-weight:700}.v4fim.avz .avline em{font-style:normal;color:var(--acc);font-weight:900}
.v4fim.avz .avqv{display:flex;gap:6px;margin-top:6px}.v4fim.avz .avqv[hidden]{display:none}
.v4fim.avz .avfe{display:flex;flex-wrap:wrap;gap:6px}.v4fim.avz .avfe .chip{height:34px;padding:0 11px;font-size:12.5px}.v4fim.avz .avfe .chip.on{background:var(--acc);border-color:var(--acc);color:var(--on-acc,#fff)}
.v4fim.avz .avpp{display:grid;grid-template-columns:1fr 1fr;gap:8px}.v4fim.avz .avpp label{display:grid;gap:4px;font-size:11.5px;font-weight:800;color:var(--ink2);min-width:0}
.v4fim.avz .avqs{display:grid;gap:6px}.v4fim.avz .avqs button{text-align:left;border:1.5px solid var(--line);background:var(--card);color:var(--ink);border-radius:12px;padding:9px 11px;font:inherit;font-style:italic;font-size:13px;line-height:1.35;cursor:pointer}
.v4fim.avz .avqs button small{display:block;font-style:normal;font-size:11px;font-weight:800;color:var(--ink2);margin-top:2px}.v4fim.avz .avqs button.on{border-color:var(--acc);background:color-mix(in srgb,var(--acc) 12%,var(--card))}
.v4fim.avz .avqn{display:grid;grid-template-columns:1fr 76px;gap:6px;margin-top:6px}.v4fim.avz .avqn[hidden]{display:none}
.v4fim.avz .avh3{font-size:12px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);margin:14px 0 6px;display:flex;justify-content:space-between}.v4fim.avz .avh3 small{text-transform:none;letter-spacing:0;font-weight:700}
.v4fim.avz .avuse{margin-top:6px;border:1.5px solid var(--acc);background:none;color:var(--acc);border-radius:99px;padding:4px 10px;font:inherit;font-size:11.5px;font-weight:800;cursor:pointer}
.v4fim.avz .v6hist .tl-fe span{cursor:pointer}
.v4fim.avz .v6hist .cs-mini{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.v4fim.avz .v6hist .cs-mini span{font-size:12px;font-weight:800;color:var(--ink2)}
.v4fim.avz .v6hist .cs-retro{margin-top:8px;border:1.5px solid var(--acc);background:none;color:var(--acc);border-radius:99px;padding:6px 12px;font:inherit;font-size:12.5px;font-weight:800;cursor:pointer}
.v4fim.avz .stars5,.v4fim.avz .stars5 button,.v4fim.avz .avdots button{touch-action:manipulation}`;
  try { TR.append(st); } catch {} }
// Quem vê (migração 042, Bia 22/11): Toda a comunidade (padrão), Só amizades ou Só você
function avQvK(F) { return !F.share ? 'eu' : F.vis === 'friends' ? 'fr' : 'pub'; }
function avQvTxt(F) { const k = avQvK(F); return k === 'eu' ? 'Só você · fica no seu diário' : k === 'fr' ? 'Só amizades · feed delas e página do livro' : 'Toda a comunidade · feed e página do livro'; }
// estado extra das abas (junto do F que o v4 já usa)
{ const _fo = v4FimOpen; v4FimOpen = function (e) {
    const r = _fo.apply(this, arguments);
    try { const st = v4State(), F = st.F; if (!F || !e) return r; const fin = e.fin || {};
      F.tab = 'av'; F.fe = [...new Set(((fin.fe) || []).map(avKey).filter(Boolean))].slice(0, 3); F.feMore = false; F.nvAll = false; F.qv = false;
      F.pf = fin.fav || ''; F.ph = fin.hate || ''; F.q = fin.q ? { ...fin.q } : null; F.qNew = false; F.nd = !!e.noDate; F.txt = (e.review || {}).texto || ''; F.vis = (e.review || {}).vis === 'friends' ? 'friends' : 'public';
      v4Draw(); } catch (err) { console.warn('avaliação abas', err); }
    return r; }; }
function avLbN(F) { return (F.fe.length ? 1 : 0) + (F.pf || F.ph ? 1 : 0) + (F.q ? 1 : 0) + (F.ress ? 1 : 0); }
{ const _fp = v4FimPage; v4FimPage = function (e) {
    const old = _fp.apply(this, arguments); if (!e || !old) return old;
    const st = v4State(), F = st.F; if (!F || !F.tab) return old;
    const demo = (old.match(/<div class="fimdemo"[\s\S]*?<\/div>/) || [''])[0], del = (old.match(/<button class="btn s w" data-a="fimdel"[^>]*>[^<]*<\/button>/) || [''])[0];
    const okLbl = (old.match(/data-a="fimok"[^>]*>([^<]*)</) || [, 'Salvar'])[1];
    const lido = e.status === 'LIDO', ini = e.startedAt || '', fim = e.finishedAt || todayISO(), niv = (() => { try { return NIVEIS; } catch { return []; } })();
    const sug = avNivSug(e), rowsN = F.nvAll ? niv.map((x) => x[0]) : [...new Set([...sug, ...Object.keys(F.niv).filter((k) => F.niv[k] > 0)])];
    const qs = (e.quotes || []).filter((x) => x && x.t), top = avTop12(), feL = F.feMore ? AV_FE.map((x) => x[0]) : [...new Set([...top, ...F.fe])];
    const lbN = avLbN(F), com = (() => { try { return v4On('comunidade'); } catch { return true; } })();
    const nvSum = niv.filter(([k]) => F.niv[k] > 0).map(([k, l]) => `<span>${esc(l)} ${F.niv[k]}</span>`).join('');
    const tabs = `<div class="avtabs" role="tablist">${[['av', 'Avaliação'], ['lb', 'Lembranças'], ['hi', 'Histórico']].map(([k, l]) => `<button type="button" role="tab" data-av="tab" data-t="${k}" class="${F.tab === k ? 'on' : ''}" aria-selected="${F.tab === k}">${l}${k === 'lb' ? `<i class="${lbN ? 'has' : ''}">${lbN} de 4</i>` : ''}</button>`).join('')}</div>`;
    const pAv = `<div class="avp" data-p="av"${F.tab === 'av' ? '' : ' hidden'}>
      <div class="dts"><label><span class="lbl">Comecei</span><input class="fld" type="date" id="v4di" value="${esc(ini)}"${F.nd ? ' disabled' : ''}></label><label><span class="lbl">Terminei</span><input class="fld" type="date" id="v4df" value="${esc(fim)}"${F.nd ? ' disabled' : ''}></label></div>
      <label class="avnd"><input type="checkbox" data-av="nd"${F.nd ? ' checked' : ''}> Não lembro as datas</label>
      <div class="avnr"><div><div class="lbl" style="margin:0">Nota <span class="avhint">2 toques = meia</span></div><div class="stars5" id="v4st5">${v4Stars(F.n)}</div></div><button type="button" class="avnvb" data-av="gonv">${nvSum ? 'Níveis do enredo ›' : '+ Níveis do enredo'}</button></div>
      <div class="nlbl" id="v4nlbl">${V4NL[F.n] || 'Toque nas estrelas. Dá para dar meia.'}</div>
      <div class="avsum" id="avnvs">${nvSum}</div>
      <label class="avfav" data-avfav${F.n === 5 ? '' : ' hidden'}><input type="checkbox" data-av="fav"${F.fav ? ' checked' : ''}> Guardar nos favoritos <small>pode ir para o Top 3</small></label>
      <div class="lbl">O que achou? <small style="text-transform:none;letter-spacing:0">opcional</small></div>
      <div class="cbox${F.rec ? ' rec' : ''}"><textarea id="v4fimt" rows="3" maxlength="2000" placeholder="O que achou?">${esc(F.txt || '')}</textarea><button class="mic2" data-a="fimmic" aria-label="Ditar">${v4ic('mic', 18)}</button></div>
      <label class="avsp${F.txt.trim() ? '' : ' off'}"><input type="checkbox" data-av="sp"${F.sp && F.txt.trim() ? ' checked' : ''}${F.txt.trim() ? '' : ' disabled'}> Contém spoiler <small>${F.txt.trim() ? 'escondido para quem não leu' : 'só com resenha'}</small></label>
      <input type="hidden" id="v4fimpg" value="">
      <section class="avnv" id="avnv"><h4>Níveis do enredo <span class="avhint">· opcional</span></h4><p><span>Quanto disso o livro tem?</span><span>pouco ← → muito</span></p>
        ${rowsN.map((k) => { const l = (niv.find((x) => x[0] === k) || [, k])[1]; return `<div class="avrow"><span>${esc(l)}</span><span class="avdots">${[1, 2, 3, 4, 5].map((i) => `<button type="button" data-av="nv" data-k="${k}" data-v="${i}" class="${(F.niv[k] || 0) >= i ? 'on' : ''}" aria-label="${esc(l)} ${i} de 5"><i></i></button>`).join('')}</span></div>`; }).join('')}
        ${F.nvAll ? '' : `<button type="button" class="avlink" data-av="nvall">Ver todos (${niv.length})</button>`}</section>
      ${com ? `<button type="button" class="avline" data-av="qv"><span><b>Quem vê</b><small>${avQvTxt(F)}</small></span><em>›</em></button>
      <div class="avqv" data-avqv${F.qv ? '' : ' hidden'}>${[['pub', 'Toda a comunidade'], ['fr', 'Só amizades'], ['eu', 'Só você']].map(([k, t]) => `<button type="button" class="chip${avQvK(F) === k ? ' on' : ''}" data-av="share" data-k="${k}">${t}</button>`).join('')}</div>` : ''}
      <button type="button" class="avline" data-av="tab" data-t="lb"><span><b>Conte como o livro te deixou</b><small>emoções, personagens, trecho · opcional</small></span><em>${lbN ? lbN + ' de 4' : '›'}</em></button></div>`;
    const pLb = `<div class="avp" data-p="lb"${F.tab === 'lb' ? '' : ' hidden'}>
      <section class="avfs"><div class="avh3"><span>Como o livro te deixou</span><small>até 3 · ${F.fe.length}/3</small></div>
      <div class="avfe" id="v4fimfe">${feL.map((k) => `<button type="button" class="chip${F.fe.includes(k) ? ' on' : ''}" data-av="fe" data-k="${k}">${esc((AV_FE.find((y) => y[0] === k) || [, k])[1])}</button>`).join('')}${F.feMore ? '' : `<button type="button" class="chip" data-av="femore">+ mais ${AV_FE.length - feL.length}</button>`}</div></section>
      <div class="avpp" style="margin-top:14px"><label>Personagem favorito<input class="fld" type="text" maxlength="60" data-av="pf" placeholder="Nome" value="${esc(F.pf)}"></label><label>Amei odiar<input class="fld" type="text" maxlength="60" data-av="ph" placeholder="Nome" value="${esc(F.ph)}"></label></div>
      <section class="avtq"><div class="avh3"><span>Trecho favorito${qs.length ? ' <small>· dos que você salvou</small>' : ''}</span><button type="button" class="avlink" data-av="qnew" style="padding:0">+ Novo</button></div>
      <div class="avqn" data-avqn${F.qNew ? '' : ' hidden'} style="margin:0 0 8px"><textarea class="fld" data-av="qt" rows="2" maxlength="600" placeholder="A frase do livro">${esc(F.q && F.q.nw ? F.q.t : '')}</textarea><input class="fld" type="number" data-av="qp" inputmode="numeric" min="1" placeholder="pág." value="${esc(String((F.q && F.q.nw && F.q.p) || ''))}"></div>
      <div class="avqs">${qs.slice(-6).reverse().map((x, i) => `<button type="button" data-av="q" data-i="${(e.quotes || []).indexOf(x)}" class="${F.q && F.q.t === x.t ? 'on' : ''}">“${esc(x.t.length > 140 ? x.t.slice(0, 140) + '…' : x.t)}”${x.p ? `<small>pág. ${x.p}</small>` : ''}</button>`).join('')}</div></section>
      <div class="avh3"><span>Ressaca literária</span></div>
      <div class="chips fimc">${[['deu', 'Me deu ressaca'], ['curou', 'Curou ressaca']].map(([k, l]) => `<button class="chip${F.ress === k ? ' on' : ''}" data-a="fimr" data-k="${k}">${l}</button>`).join('')}</div></div>`;
    const pHi = `<div class="avp" data-p="hi"${F.tab === 'hi' ? '' : ' hidden'}><div class="v6hist" id="avhist"></div></div>`;
    const okTxt = /Entendi/.test(okLbl) ? okLbl : (com && F.share ? 'Salvar e publicar' : (lido ? 'Salvar' : 'Salvar e marcar como lido'));
    return `<section class="page v4fim avz"><header class="top"><button class="ib" data-a="fimx" aria-label="Voltar">${v4ic('back')}</button><h1 style="font-size:18px">${lido ? 'Sua avaliação' : 'Você terminou!'}</h1></header><div class="scr">
      ${demo}<div class="fimh avh">${v4cv(e)}<div><b>${esc(e.title)}</b><small>Lido · ${F.nd ? 'sem datas' : (ini ? avDM(ini) + ' → ' : '') + avDM(fim)}</small></div></div>
      ${tabs}${pAv}${pLb}${pHi}
      <button class="btn p w" data-a="fimok" style="margin-top:16px">${okTxt}</button>${del}</div></section>`;
  }; }
// histórico na aba + "Usar na avaliação"
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments);
    try { const st = v4State(); if (st.view !== 'fim' || !V4) return r; const F = st.F, e = lib().find((x) => x.id === st.fim); const H = V4.querySelector('#avhist'); if (!F || !e) return r;
      try { const root = V4.getRootNode(); if (root && root !== document && !root.querySelector('style.zgcss')) { const s = TR.querySelector('style.zgcss'); if (s) root.append(s.cloneNode(true)); } } catch {}
      if (H && F.tab === 'hi') avHist(H, e, F);
      avInert(true);
      if (!V4._zg) { V4._zg = 1; V4.addEventListener('click', avClick, true); V4.addEventListener('input', avInput, true); }
    } catch (err) { console.warn('avaliação abas', err); }
    return r; }; }
function avHist(H, e, F) {
  try { v6HistPaint(H, e); } catch (err) { console.warn('histórico', err); }
  const deco = () => { H.querySelectorAll('.tl-c[data-ref^="qt:"]').forEach((c) => { if (c.querySelector('.avuse')) return; const b = document.createElement('button'); b.type = 'button'; b.className = 'avuse'; b.dataset.av = 'huseq'; b.dataset.i = c.dataset.ref.slice(3); b.textContent = 'Usar na avaliação'; (c.querySelector('.tl-q') || c.lastElementChild).after(b); });
    H.querySelectorAll('.tl-fe span').forEach((s) => { s.dataset.av = 'husef'; s.title = 'Usar na avaliação'; }); };
  deco(); if (!H._zgo) { H._zgo = new MutationObserver(() => deco()); H._zgo.observe(H, { childList: true, subtree: true }); }
}
function avPaintTabs(F) { const R = V4; if (!R) return;
  R.querySelectorAll('.avtabs button').forEach((b) => { const on = b.dataset.t === F.tab; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  R.querySelectorAll('.avp').forEach((p) => { p.hidden = p.dataset.p !== F.tab; });
  const n = avLbN(F), i = R.querySelector('.avtabs [data-t=lb] i'); if (i) { i.textContent = n + ' de 4'; i.classList.toggle('has', n > 0); }
  const em = R.querySelector('.avline[data-t=lb] em'); if (em) em.textContent = n ? n + ' de 4' : '›';
  const fx = R.querySelector('.avh3 small'); if (fx && /\/3/.test(fx.textContent)) fx.textContent = 'até 3 · ' + F.fe.length + '/3';
  if (F.tab === 'hi') { const e = lib().find((x) => x.id === v4State().fim), H = R.querySelector('#avhist'); if (H && e && !H.firstElementChild) avHist(H, e, F); } }
function avOk(F) { const b = V4 && V4.querySelector('[data-a=fimok]'); if (!b || /Entendi/.test(b.textContent)) return; const e = lib().find((x) => x.id === v4State().fim); const com = (() => { try { return v4On('comunidade'); } catch { return true; } })();
  b.textContent = com && F.share ? 'Salvar e publicar' : (e && e.status === 'LIDO' ? 'Salvar' : 'Salvar e marcar como lido'); }
function avAddFe(F, k) { if (!k) return false; if (F.fe.includes(k)) return true; if (F.fe.length >= 3) { toast('Até 3. Tire uma para trocar.'); return false; } F.fe.push(k); return true; }
function avClick(ev) {
  const p = ev.composedPath ? ev.composedPath() : [];
  // 2 toques na mesma estrela = meia
  const sb = p.find((n) => n && n.dataset && n.dataset.a === 'fimn'); if (sb) { const F0 = v4State().F, v = Number(sb.dataset.v); if (F0 && v === Math.round(v) && F0.n === v) { ev.stopPropagation(); ev.preventDefault(); F0.n = v - 0.5; const s5 = V4.querySelector('#v4st5'), nl = V4.querySelector('#v4nlbl'); if (s5) s5.innerHTML = v4Stars(F0.n); if (nl) nl.textContent = V4NL[F0.n] || ''; const l = V4.querySelector('[data-avfav]'); if (l) l.hidden = true; F0.fav = false; } return; }
  const b = p.find((n) => n && n.dataset && n.dataset.av); if (!b) return;
  const st = v4State(), F = st.F; if (st.view !== 'fim' || !F) return; const a = b.dataset.av, e = lib().find((x) => x.id === st.fim), R = V4;
  if (a === 'pf' || a === 'ph' || a === 'qt' || a === 'qp') return;
  if (a === 'tab') { ev.preventDefault(); F.tab = b.dataset.t; avPaintTabs(F); try { R.querySelector('.scr').scrollTop = 0; } catch {} return; }
  if (a === 'nd') { F.nd = b.checked; R.querySelectorAll('#v4di,#v4df').forEach((x) => { x.disabled = F.nd; }); return; }
  if (a === 'fav') { F.fav = b.checked; return; }
  if (a === 'sp') { F.sp = b.checked; return; }
  ev.preventDefault();
  if (a === 'gonv') { const s = R.querySelector('#avnv'); if (s) s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (a === 'nv') { const k = b.dataset.k, v = Number(b.dataset.v); F.niv[k] = F.niv[k] === v ? 0 : v; b.parentNode.querySelectorAll('button').forEach((x) => x.classList.toggle('on', Number(x.dataset.v) <= F.niv[k]));
    const niv = NIVEIS.filter(([kk]) => F.niv[kk] > 0); const S2 = R.querySelector('#avnvs'); if (S2) S2.innerHTML = niv.map(([kk, l]) => `<span>${esc(l)} ${F.niv[kk]}</span>`).join(''); const g = R.querySelector('[data-av=gonv]'); if (g) g.textContent = niv.length ? 'Níveis do enredo ›' : '+ Níveis do enredo'; return; }
  if (a === 'nvall' || a === 'femore') { F.txt = (R.querySelector('#v4fimt') || {}).value || F.txt; if (a === 'nvall') F.nvAll = true; else F.feMore = true; const sc = R.querySelector('.scr'), y = sc ? sc.scrollTop : 0; v4Draw(); try { V4.querySelector('.scr').scrollTop = y; } catch {} return; }
  if (a === 'qv') { F.qv = !F.qv; const q = R.querySelector('[data-avqv]'); if (q) q.hidden = !F.qv; return; }
  if (a === 'share') { const k = b.dataset.k; F.share = k !== 'eu'; F.vis = k === 'fr' ? 'friends' : 'public'; R.querySelectorAll('[data-av=share]').forEach((x) => x.classList.toggle('on', x === b)); const sm = R.querySelector('[data-av=qv] small'); if (sm) sm.textContent = avQvTxt(F); F.qv = false; const q = R.querySelector('[data-avqv]'); if (q) q.hidden = true; avOk(F); return; }
  if (a === 'fe') { const k = b.dataset.k; if (F.fe.includes(k)) F.fe = F.fe.filter((x) => x !== k); else if (!avAddFe(F, k)) return; b.classList.toggle('on', F.fe.includes(k)); avPaintTabs(F); return; }
  if (a === 'q') { const x = (e.quotes || [])[Number(b.dataset.i)]; if (!x) return; const on = !(F.q && F.q.t === x.t); F.q = on ? { t: x.t, p: x.p } : null; R.querySelectorAll('[data-av=q]').forEach((y) => y.classList.toggle('on', y === b && on)); avPaintTabs(F); return; }
  if (a === 'qnew') { F.qNew = !F.qNew; const n = R.querySelector('[data-avqn]'); if (n) { n.hidden = !F.qNew; if (F.qNew) n.querySelector('textarea').focus(); } return; }
  if (a === 'huseq') { const x = (e.quotes || [])[Number(b.dataset.i)]; if (!x) return; F.q = { t: x.t, p: x.p }; toast('Trecho escolhido como favorito'); avPaintTabs(F); return; }
  if (a === 'husef') { const nm = b.textContent.trim(), qf = (typeof QT_FEELS !== 'undefined' ? QT_FEELS : []).find((y) => y[1] === nm); const k = avKey(qf ? qf[0] : nm); if (!k) return toast('Essa emoção não está na lista da avaliação'); if (F.fe.includes(k)) return toast('Já está nas Lembranças'); if (avAddFe(F, k)) { toast(b.textContent.trim() + ' entrou nas Lembranças'); avPaintTabs(F); } return; }
}
function avInput(ev) {
  const t = ev.target, st = v4State(), F = st.F; if (st.view !== 'fim' || !F || !t) return;
  if (t.id === 'v4fimt') { F.txt = t.value; const sp = V4.querySelector('[data-av=sp]'), lb = sp && sp.closest('label'); const has = !!t.value.trim(); if (sp) { sp.disabled = !has; if (!has) { sp.checked = false; F.sp = false; } } if (lb) { lb.classList.toggle('off', !has); const sm = lb.querySelector('small'); if (sm) sm.textContent = has ? 'escondido para quem não leu' : 'só com resenha'; } return; }
  const a = t.dataset && t.dataset.av; if (!a) return;
  if (a === 'pf') F.pf = t.value; else if (a === 'ph') F.ph = t.value;
  else if (a === 'qt' || a === 'qp') { const tx = (V4.querySelector('[data-av=qt]') || {}).value || '', pg = Number((V4.querySelector('[data-av=qp]') || {}).value) || undefined; if (tx.trim()) { F.q = { t: tx.trim().slice(0, 600), p: pg, nw: 1 }; V4.querySelectorAll('[data-av=q]').forEach((y) => y.classList.remove('on')); } else if (F.q && F.q.nw) F.q = null; }
  avPaintTabs(F);
}
// nota: favoritos só com 5
{ const H = () => { try { const F = v4State().F; if (!F || !V4) return; const l = V4.querySelector('[data-avfav]'); if (l) l.hidden = F.n !== 5; if (F.n !== 5) F.fav = false; } catch {} };
  TR.addEventListener('click', (ev) => { const p = ev.composedPath ? ev.composedPath() : []; if (p.some((n) => n && n.dataset && n.dataset.a === 'fimn')) setTimeout(H, 0); if (p.some((n) => n && n.dataset && n.dataset.a === 'fimr')) setTimeout(() => { try { avPaintTabs(v4State().F); } catch {} }, 0); }); }
// salvar: grava as Lembranças em e.fin e as datas "não lembro" antes do salvar de sempre
{ const _fs = v4FimSave; v4FimSave = function () {
    try { const st = v4State(), F = st.F, e = F && lib().find((x) => x.id === st.fim);
      if (e && F && F.tab !== undefined && !st.fimDemo) {
        if (!F.txt.trim()) F.sp = false; if (F.n !== 5) F.fav = false;
        const fin = { ...(e.fin || {}) }; const fav = (F.pf || '').trim(), hate = (F.ph || '').trim();
        fav ? fin.fav = fav.slice(0, 60) : delete fin.fav; hate ? fin.hate = hate.slice(0, 60) : delete fin.hate;
        if (F.q) { fin.q = { t: F.q.t, p: F.q.p }; if (F.q.nw && !(e.quotes || []).some((x) => x.t === F.q.t)) e.quotes = [...(e.quotes || []), { t: F.q.t, p: F.q.p, at: new Date().toISOString() }]; } else delete fin.q;
        e.fin = fin; // F.fe e a ressaca entram pelo salvar de sempre
        if (F.nd) { const di = V4.querySelector('#v4di'), df = V4.querySelector('#v4df'); if (di) di.value = ''; if (df) df.value = ''; }
        const r = _fs.apply(this, arguments);
        if (F.nd) { delete e.startedAt; delete e.finishedAt; e.noDate = true; } else delete e.noDate;
        try { save(); } catch {}
        return r; } } catch (err) { console.warn('avaliação salvar', err); }
    return _fs.apply(this, arguments); }; }

// a página da avaliação fica por cima de outra camada do v4 (Biblioteca): a de baixo não recebe toque nem foco
let avInert = function (on) { try { const root = V4 && V4.getRootNode(); if (!root) return; [...root.querySelectorAll('.v4ler'), ...TR.querySelectorAll('.v5host')].forEach((x) => { if (x === V4 || x.contains(V4)) return; if (on) { x.inert = true; x.style.visibility = 'hidden'; x.dataset.avIn = '1'; } else if (x.dataset.avIn) { x.inert = false; x.style.visibility = ''; delete x.dataset.avIn; } }); } catch {} };
{ let mo = null; const watch = () => { try { const host = V4 && V4.parentNode; if (!host || mo) return; mo = new MutationObserver(() => { let open = false; try { open = !!(V4 && V4.isConnected && v4State().view === 'fim'); } catch {} if (!open) { const root = host.getRootNode(); [...root.querySelectorAll('.v4ler[data-av-in]'), ...TR.querySelectorAll('.v5host[data-av-in]')].forEach((x) => { x.inert = false; x.style.visibility = ''; delete x.dataset.avIn; }); } }); mo.observe(host, { childList: true }); } catch {} };
  const _i = avInert; avInert = function (on) { if (on) watch(); return _i(on); };
  const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments); try { if (v4State().view !== 'fim') avInert(false); } catch {} return r; }; }
// (Bia, 22/11) avaliações e comentários começam visíveis para toda a comunidade; a pessoa pode trocar.
// Avaliação nova: "Toda a comunidade"; a que já existe mantém o que tem. Comentário do Atualizar: publicar ligado.
{ const _fo = v4FimOpen; v4FimOpen = function (e) { try { const r = (e && e.review) || {}; S.avNew = !(r.paws || r.texto); } catch {} const out = _fo.apply(this, arguments);
    try { const F = v4State().F; if (F && S.avNew && !v4State().fimDemo) { F.share = true; v4Draw(); } } catch {} return out; }; }
{ const _ui = v4UpdInit; v4UpdInit = function () { const r = _ui.apply(this, arguments); try { const U = v4State().upd; if (U) U.pub = true; } catch {} return r; }; }
// convite "Adicionar lembranças" na página do livro: uma vez, depois de salvar a avaliação sem lembranças
{ const _fs = v4FimSave; v4FimSave = function () { let e = null, F = null; try { const st = v4State(); F = st.F; e = F && !st.fimDemo && lib().find((x) => x.id === st.fim); } catch {}
    const r = _fs.apply(this, arguments);
    try { if (e && e.status === 'LIDO' && !avLbN(F) && !e.lbInv) { e.lbInv = 1; save(); } } catch {} return r; };
  const st2 = document.createElement('style'); st2.textContent = `.av-inv{display:flex;align-items:center;gap:10px;margin:10px 0;padding:11px 12px;border:1.5px dashed var(--acc);border-radius:14px;background:color-mix(in srgb,var(--acc) 8%,var(--panel))}
.av-inv div{flex:1;min-width:0}.av-inv b{display:block;font-size:.9rem;color:var(--ink)}.av-inv small{display:block;font-size:.76rem;color:var(--ink-2);font-weight:700}
.av-inv .av-go{border:0;background:var(--acc);color:var(--on-acc,#fff);border-radius:99px;padding:.45rem .8rem;font:inherit;font-weight:800;font-size:.8rem;min-height:40px;cursor:pointer}
.av-inv .av-x{border:0;background:none;color:var(--ink-2);font-size:1.2rem;width:40px;height:40px;cursor:pointer}`; try { TR.append(st2); } catch {}
  let gone = false, cur = null;
  const put = (e) => { if (gone) return true; const v = $('#shelflist'); const body = v && !v.hidden && v.querySelector('.sl-body'); if (!body || body.querySelector('.av-inv')) return !!(body && body.querySelector('.av-inv'));
    const c = document.createElement('div'); c.className = 'av-inv'; c.innerHTML = '<div><b>Adicionar lembranças</b><small>como o livro te deixou, personagens e trecho favorito</small></div><button type="button" class="av-go">Adicionar</button><button type="button" class="av-x" aria-label="Fechar">×</button>';
    body.prepend(c); e.lbInv = 2; save();
    c.querySelector('.av-x').addEventListener('click', () => { gone = true; c.remove(); });
    c.querySelector('.av-go').addEventListener('click', () => { gone = true; c.remove(); try { v4FimOpen(e); const F = v4State().F; if (F) { F.tab = 'lb'; v4Draw(); } } catch (err) { console.warn('lembranças', err); } });
    return true; };
  const _ob = openBookPage; openBookPage = function (e) { const r = _ob.apply(this, arguments);
    try { if (e && e.lbInv === 1 && e.status === 'LIDO') { gone = false; cur = e; const v = $('#shelflist'); const t0 = Date.now();
        // a página pode ser redesenhada logo depois de abrir: o convite volta para o lugar enquanto ela estiver aberta (até 8 s)
        const mo = new MutationObserver(() => { if (gone || Date.now() - t0 > 8000 || !v || v.hidden) return mo.disconnect(); put(cur); }); if (v) mo.observe(v, { childList: true, subtree: true });
        let n = 0; const tick = () => { if (put(e) || ++n > 15) return; setTimeout(tick, 200); }; setTimeout(tick, 150); } } catch {} return r; }; }
