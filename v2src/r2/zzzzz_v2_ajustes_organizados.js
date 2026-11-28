// ---------- v2: Ajustes organizados por assunto (Bia, 28/11) ----------
// "Organiza o menu de ajustes... se dá pra facilitar encontrar essas configurações". Antes: "Seu app" misturava tema com
// spoiler e livros removidos, e "Conta e dados" tinha 8 itens de quatro assuntos. Agora cada grupo é um assunto só:
// Seu app (como ele aparece e avisa) · Privacidade (quem vê e com quem fala) · Seus livros (trazer, completar, recuperar)
// · Conta (acesso e cópia de segurança) · Ajuda · Moderação (só quem modera) · Sair e Excluir no fim.
// Só reorganiza as linhas que os blocos anteriores já montaram; nenhuma ação muda.
{ const GR = [
    ['Seu app', ['aj-v4apar', '@tema', 'aj-home', 'aj-fn', 'aj-v4lem']],
    ['Privacidade', ['aj-priv', 'aj-cm', 'aj-v4sp', 'aj-mu']],
    ['Seus livros', ['aj-hl', 'aj-v4fix', 'aj-cv', 'aj-v5rm']],
    ['Conta', ['aj-sync', 'aj-pw', 'aj-exp', 'aj-imp']],
    ['Ajuda', ['aj-tour', 'aj-install']],
    ['Moderação', ['aj-mod']],
  ];
  const SUB = { 'aj-home': 'o que aparece e em que ordem', 'aj-install': 'ícone na tela inicial, em tela cheia', 'aj-exp': 'cópia de toda a sua biblioteca', 'aj-imp': 'traz de volta uma cópia baixada', 'aj-v4sp': 'perguntar antes de publicar sem marcação' };
  const _da = drawAjustes; drawAjustes = function (box) { const r = _da.apply(this, arguments);
    try { if (S.ajMode === 'perfil' || !box) return r; const w = box.querySelector('.v4aj'); if (!w) return r;
      const row = (id) => id === '@tema' ? w.querySelector('.v4throw') : w.querySelector('#' + id);
      const usadas = new Set(); const novo = document.createDocumentFragment();
      GR.forEach(([t, ids]) => { const L = ids.map(row).filter((x) => x && !usadas.has(x)); if (!L.length) return;
        const g = document.createElement('div'); g.className = 'aj-g'; g.textContent = t; const c = document.createElement('div'); c.className = 'aj-card';
        L.forEach((x) => { usadas.add(x); c.append(x); }); novo.append(g, c); });
      // o que nenhum grupo pegou (linha nova de outro bloco) vai para o fim do grupo de onde veio? mais simples: Seu app
      const sobra = [...w.querySelectorAll('.aj-card > .aj-row, .aj-card > button, .aj-card > label')].filter((x) => !usadas.has(x) && !['aj-out', 'aj-login', 'aj-v4del', 'aj-del'].includes(x.id));
      if (sobra.length) { const c = novo.querySelector('.aj-card'); if (c) sobra.forEach((x) => c.append(x)); }
      const fim = document.createElement('div'); fim.className = 'aj-card'; fim.style.marginTop = '1.1rem';
      ['aj-login', 'aj-out', 'aj-v4del', 'aj-del'].forEach((id) => { const x = w.querySelector('#' + id); if (x) fim.append(x); });
      if (fim.children.length) novo.append(fim);
      w.replaceChildren(novo);
      Object.entries(SUB).forEach(([id, s]) => { const sm = w.querySelector('#' + id + ' small'); if (sm) sm.textContent = s; });
      const fn = w.querySelector('#aj-fn small'); if (fn) { try { fn.textContent = 'ligar ou desligar partes do app · ' + V2MODS.filter(([k]) => v4Mod(k)).length + ' de ' + V2MODS.length; } catch {} }
      // subtítulos começam em minúscula, como o resto do app
      w.querySelectorAll('.aj-row small').forEach((sm) => { const t = sm.textContent; if (t && /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]/.test(t) && !t.includes('@')) sm.textContent = t[0].toLowerCase() + t.slice(1); });
    } catch (err) { console.warn('ajustes organizados', err); }
    return r; }; }
