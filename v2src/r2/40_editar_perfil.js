// Editar perfil (16/11): nome, @usuário e frase em folhas próprias, no padrão do app; privacidade mora em Ajustes.
function pfTextSheet(o) { // o: { title, hint, label, value, max, area, prefix, clean, save: async (v) => mensagem de erro ou null }
  const wrap = document.createElement('div'); wrap.className = 'sheet';
  wrap.innerHTML = `<div class="box"><form class="form"><h3></h3>${o.hint ? '<p class="hint"></p>' : ''}<label><span class="pf-lb"></span>${o.area
    ? `<textarea rows="3" maxlength="${o.max}" style="background:var(--panel);border:1px solid var(--line);font-size:1rem"></textarea>` : `<span style="position:relative;display:block">${o.prefix ? `<span style="position:absolute;left:.75rem;top:50%;transform:translateY(-50%);font-weight:800;color:var(--ink-2);pointer-events:none">${o.prefix}</span>` : ''}<input maxlength="${o.max}" autocapitalize="${o.prefix ? 'none' : 'sentences'}" spellcheck="${o.prefix ? 'false' : 'true'}" ${o.prefix ? 'style="padding-left:1.7rem"' : ''}></span>`}</label>
    <small class="hint pf-cnt" style="text-align:right;margin-top:-.2rem"></small><p class="hint pf-msg" style="color:var(--danger,#b4442c)"></p>
    <button type="submit" class="primary">Salvar</button><button type="button" class="cancel">Cancelar</button></form></div>`;
  const f = wrap.querySelector('form'), inp = f.querySelector('input,textarea'), msg = f.querySelector('.pf-msg'), cnt = f.querySelector('.pf-cnt');
  f.querySelector('h3').textContent = o.title; if (o.hint) f.querySelector('.hint').textContent = o.hint; f.querySelector('.pf-lb').textContent = o.label;
  inp.value = o.value || ''; const upd = () => { if (o.clean) { const c = o.clean(inp.value); if (c !== inp.value) inp.value = c; } cnt.textContent = `${inp.value.length}/${o.max}`; }; upd();
  inp.addEventListener('input', upd);
  const close = () => wrap.remove();
  wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); }); f.querySelector('.cancel').addEventListener('click', close);
  f.addEventListener('submit', async (e) => { e.preventDefault(); const b = f.querySelector('.primary'); b.disabled = true; msg.textContent = '';
    let err = null; try { err = await o.save(inp.value.trim()); } catch { err = 'Sem conexão. Tente de novo.'; }
    b.disabled = false; if (err) { msg.textContent = err; return; } close(); });
  document.body.append(wrap); setTimeout(() => { try { inp.focus(); const n = inp.value.length; inp.setSelectionRange(n, n); } catch {} }, 60);
}
const pfRedraw = () => { try { refresh(); } catch {} try { paintAvatar(); } catch {} try { paintGtop(); } catch {} try { const v = $('#shelflist'); if (v && !v.hidden && v.classList.contains('mine-page')) openMyProfile(); } catch {} };
editName = function () {
  pfTextSheet({ title: 'Seu nome', hint: 'É como o app te chama e como seus amigos veem você.', label: 'Nome', value: NAME === 'Você' ? '' : NAME, max: 40,
    save: async (v) => {
      if (!v) return 'O nome não pode ficar vazio.';
      if (connected() && socialProfile) { const r = await sapi('PUT', '/v1/me/profile', { handle: socialProfile.handle, displayName: v }); if (r.status !== 200 || !r.data) return 'Não consegui salvar. Tente de novo.'; socialProfile = r.data; }
      NAME = v; try { localStorage.setItem('bear.profile', JSON.stringify({ name: v })); } catch {}
      db.profile = { ...(db.profile || {}), name: v }; save(); pfRedraw(); toast('Nome atualizado'); return null;
    } });
};
function editHandleSheet() {
  if (!connected()) return toast('Entre na sua conta para ter um @usuário');
  if (!socialProfile) return socialSettingsSheet();
  pfTextSheet({ title: 'Nome de usuário', hint: 'É como seus amigos te acham. 3 a 20 letras minúsculas, números, ponto ou _.', label: '@usuário', value: socialProfile.handle, max: 20, prefix: '@',
    clean: (x) => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9_.]+/g, '').slice(0, 20),
    save: async (h) => {
      if (h === socialProfile.handle) return null;
      if (!/^[a-z0-9_.]{3,20}$/.test(h)) return 'Use de 3 a 20 letras minúsculas, números, ponto ou _.';
      const r = await sapi('PUT', '/v1/me/profile', { handle: h, displayName: socialProfile.displayName || NAME });
      if (r.status === 409) return `@${h} já é de outra pessoa. Tente outro.`;
      if (r.status !== 200 || !r.data) return 'Não consegui salvar. Tente de novo.';
      socialProfile = r.data; try { publishSnapshot(); } catch {} pfRedraw(); toast(`Agora você é @${h}`); return null;
    } });
}
editBio = async function () {
  pfTextSheet({ title: 'Frase do perfil', hint: 'Aparece no seu perfil, embaixo do nome. Deixe em branco para o app montar uma pelas suas leituras.', label: 'Frase', value: T().bio || '', max: 160, area: true,
    save: async (bio) => {
      T().bio = bio; save(); pfRedraw();
      if (connected() && socialProfile) { const r = await sapi('PUT', '/v1/me/bio', { bio }); if (r.status !== 200) { toast('Frase salva só neste aparelho por enquanto'); return null; } }
      toast(bio ? 'Frase atualizada' : 'Frase automática de volta'); return null;
    } });
};
// Editar perfil: o @ abre só o @; o "Quem vê o quê" fica em Ajustes
{ const _da2 = drawAjustes; drawAjustes = function (box) {
  _da2(box);
  const h = box.querySelector('#aj-handle'); if (h && socialProfile) { const n = h.cloneNode(true); h.replaceWith(n); n.addEventListener('click', editHandleSheet); }
  const p = box.querySelector('#aj-priv'); if (p) { const b = p.querySelector('b'); if (b) b.textContent = 'O que aparece no meu perfil'; }
}; }
// Para você (16/11): livros em português primeiro (idioma do app); inglês só completa quando falta indicação
{ const _tr2 = tasteRecs; tasteRecs = async function () {
  const all = (await _tr2.apply(this, arguments)) || [];
  const lg = (x) => { if (x.lang || x.isbn) { try { return bookLang({ title: '', isbn: x.isbn, lang: x.lang }); } catch {} } const t = ' ' + String(x.title || '').toLowerCase() + ' ', p = (t.match(/[ãõçâêôáéíóú]| (o|os|as|de|da|do|das|dos|e|um|uma|no|na|em|para|com|que) /g) || []).length, e = (t.match(/ (the|of|and|an|in|to|for|with|my|your|is|a) /g) || []).length; return p > e ? 'pt' : e > p ? 'en' : ''; };
  const pt = [], other = [], en = [];
  const mine = new Set((lib() || []).map((e) => normT(String(e.title || '').split(':')[0]))), seen = new Set();
  for (const x of all) { const k = normT(String(x.title || '').split(':')[0]); if (!k || mine.has(k) || seen.has(k)) continue; seen.add(k); const l = lg(x); (l === 'pt' ? pt : l && l !== 'pt' ? en : other).push(x); }
  const out = [...pt, ...other]; if (out.length < 10) out.push(...en);
  return out.slice(0, 18);
}; }
