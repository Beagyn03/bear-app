// ---------- v2: menu do livro enxuto (Bia, 27/11) ----------
// "Por que temos todas essas opções? Acho que é muito menu." Decisão dela:
//  - Lombada e edição, Trocar edição, Remover da Biblioteca e Trocar capa para todos (moderação): só no menu aberto na Biblioteca (não no Hoje, Comunidade,
//    perfil, Jornada nem na página do livro).
//  - Onde comprar: só na página do livro (sai do menu; a aba Sobre já tem a seção Onde comprar).
//  - Sem a linha "Mais": o que sobra aparece direto (Estantes, Ler junto, Emprestar quando cabe).
const lvMenuNaBiblioteca = () => { try { if (S.tab !== 'estante') return false; const v = TR.querySelector('#shelflist'); return !(v && !v.hidden && v.classList.contains('v5bp')); } catch { return false; } };
{ const _bm = v5BmHTML; v5BmHTML = function (e) {
    const st = v4State(), m0 = st.v5more; st.v5more = true; let h;
    try { h = _bm.apply(this, arguments); } finally { st.v5more = m0; }
    try {
      const tira = (re) => { h = h.replace(re, ''); };
      tira(/<button class="li v5more[^>]*>[\s\S]*?<\/button>/);
      tira(/<button class="li[^"]*" data-a="v5buy"[\s\S]*?<\/button>/);
      if (!lvMenuNaBiblioteca()) {
        tira(/<button type="button" class="li" data-a="shxlb">[\s\S]*?<\/button>/);
        tira(/<button class="li[^"]*" data-a="sheet" data-s="v5edicao"[\s\S]*?<\/button>/);
        tira(/<button class="li[^"]*" data-a="sheet" data-s="v5rm"[\s\S]*?<\/button>/);
        tira(/<button class="li[^"]*" data-a="v5covmod"[\s\S]*?<\/button>/);
      }
    } catch (err) { console.warn('menu do livro enxuto', err); }
    return h; }; }
