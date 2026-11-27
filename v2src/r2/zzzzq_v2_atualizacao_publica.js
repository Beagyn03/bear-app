// ---------- v2: toda atualização vai para a Comunidade (Bia, 27/11) ----------
// "Todas as atualizações têm que ser publicadas... a pessoa pode escolher se é privado, só para amigos ou para todos...
// mas o ideal é que seja para todos, menos anotações, que é sempre privado."
// Antes: "Publicar na Comunidade" vinha desligado e só um comentário escrito virava post; página sozinha nunca aparecia
// (a Comunidade nova lê só posts e avaliações).
// Agora a folha de atualizar (e a do fim da sessão) tem "Quem vê: Todos · Amizades · Só eu", começando em Todos (a
// última escolha fica guardada no aparelho). Vale para a atualização inteira: página, emoções, comentário e trecho.
// Sem comentário, o post leva uma linha automática com a página ("Pág. 123 de 400 · +18 páginas"), porque a API não
// aceita post vazio. Anotação continua só sua.
const UPW_K = 'lv.upWho';
const upwGet = () => { try { const v = localStorage.getItem(UPW_K); return v === 'friends' || v === 'eu' ? v : 'public'; } catch { return 'public'; } };
const UPW_CSS = `.upwho{display:flex;align-items:center;gap:10px;margin:4px 0 12px;width:100%}.upwho>span{flex:none;font-size:.9rem;color:var(--ink-2,var(--mut))}
.upwho .seg{flex:1;min-width:0;display:flex}.upwho .seg button{flex:1;min-width:0;white-space:nowrap}
.uppn label.tog:has(input[data-a=uppub]),#v4pubx>.seg,.uppn .seg[aria-label="Quem vê o trecho"],.uppn .seg[aria-label="Quem vê o trecho"]+.spfix,.uppn .lbl:has(+.seg[aria-label="Quem vê o trecho"]){display:none!important}`;
{ const _i = v4UpdInit; v4UpdInit = function () { const r = _i.apply(this, arguments);
    try { const U = v4State().upd; if (U) { const w = upwGet(); U.who = w; U.pub = w !== 'eu'; U.vis = w === 'friends' ? 'friends' : 'public'; U.treVis = w; } } catch {}
    return r; }; }
const upwSet = (U, w) => { U.who = w; U.pub = w !== 'eu'; U.vis = w === 'friends' ? 'friends' : 'public'; U.treVis = w; try { localStorage.setItem(UPW_K, w); } catch {} };
{ const _d = v4Draw; v4Draw = function () { const r = _d.apply(this, arguments);
    try { const st = v4State(), U = st.upd, R = V4; if (!R || !U || (st.sheet !== 'upd' && st.sheet !== 'end')) return r;
      const root = R.getRootNode && R.getRootNode(); if (root && root !== document && !root.querySelector('style.upwcss')) { const s = document.createElement('style'); s.className = 'upwcss'; s.textContent = UPW_CSS; root.append(s); }
      let on = true; try { on = v4On('comunidade'); } catch {} if (!on) return r;
      const sh = R.querySelector('.sheet'); if (!sh) return r; const save = sh.querySelector('[data-a=savepg]'); if (!save) return r;
      if (!U.who) upwSet(U, upwGet());
      const html = `<span>Quem vê</span><div class="seg sm" role="group" aria-label="Quem vê esta atualização">${[['public', 'Todos'], ['friends', 'Amizades'], ['eu', 'Só eu']].map(([k, n]) => `<button type="button" class="${U.who === k ? 'on' : ''}" data-a="upwho" data-k="${k}" aria-pressed="${U.who === k}">${n}</button>`).join('')}</div>`;
      let box = sh.querySelector('.upwho'); if (!box) { box = document.createElement('div'); box.className = 'upwho'; const row = save.parentElement && save.parentElement !== sh && !save.parentElement.classList.contains('uppn') ? save.parentElement : save; row.before(box); }
      if (box.innerHTML !== html) box.innerHTML = html;
    } catch (err) { console.warn('quem vê', err); }
    return r; }; }
{ let wired = null; const wire = () => { if (!V4 || wired === V4) return; wired = V4;
    V4.addEventListener('click', (ev) => { const b = ev.target.closest && ev.target.closest('[data-a=upwho]'); if (!b) return; ev.stopImmediatePropagation(); ev.preventDefault();
      const U = v4State().upd; if (!U) return; upwSet(U, b.dataset.k); v4Draw(); }, true); };
  setInterval(wire, 1000); setTimeout(wire, 300); }
// salvar: sem comentário escrito, posta a página (com as emoções) para quem a pessoa escolheu
{ const _s = v4UpdSave; v4UpdSave = async function (k) {
    const st = v4State(), U = st.upd, e = U && lib().find((x) => x.id === (st.sheetE || st.e));
    if (!U || !e) return _s.apply(this, arguments);
    if (!U.who) upwSet(U, upwGet()); else upwSet(U, U.who);
    let inf0 = null; try { inf0 = v4Info(e); } catch {}
    const who = U.who, text = (U.text || '').trim(), fe = [...(U.fe || [])], cap = U.cap;
    const r = await _s.apply(this, arguments);
    try {
      if (who === 'eu' || text || !inf0 || inf0.gb) return r;
      let on = true; try { on = v4On('comunidade'); } catch {} if (!on || !connected() || !socialProfile) return r;
      if (v4State().upd === U) return r; // não salvou (erro na tela, pergunta pendente)
      const inf = v4Info(e), was = Number(inf0.now) || 0, now = Number(inf.now) || 0, total = Number(inf.total) || 0, d = now - was;
      if (d === 0 && !fe.length) return r;
      const fim = total && now >= total;
      const line = (cap ? 'Cap. ' + cap + ' · ' : '') + (total ? `Pág. ${now} de ${total}` : `Pág. ${now}`) + (d > 0 ? ` · +${d} ${d === 1 ? 'página' : 'páginas'}` : '') + (fim ? ' · última página!' : '');
      const x = await sapi('POST', '/v1/posts', { kind: 'comment', text: line.slice(0, 280), feelings: fe.slice(0, 3), visibility: who === 'friends' ? 'friends' : 'public', readerPct: total ? Math.min(100, Math.round(now / total * 100)) : null,
        page: now > 0 ? Math.min(100000, now) : null, book: { title: String(e.title).slice(0, 200), author: e.author ? String(e.author).slice(0, 120) : null, cover: /^https:\/\//.test(e.cover || '') ? e.cover : null } });
      if (x && x.status >= 400) console.warn('atualização na Comunidade', x.status);
    } catch (err) { console.warn('atualização na Comunidade', err); }
    return r; }; }
