// Personalizar Hoje alinhado ao Hoje novo (Bia, 20/11). O cartão do livro atual fica sempre primeiro. Itens:
// Linha do dia (Órbita e Meta; fica logo abaixo do livro), Destaque do dia (Pergunta do dia, lembretes, Resumo do mês),
// A seguir, Para você. Saem Comece por aqui (aparece sozinho em conta sem livros), Também lendo (virou deslizar no cartão),
// Próxima conquista, Meta do ano e Na fila (estão na Linha do dia e em A seguir). Sem duplicar Funções do app: item de função
// desligada fica cinza ("desligado em Funções do app") e o toque leva para lá. Guardado em db.prefs.home2; as escolhas
// antigas (db.prefs.home.off) migram uma vez: Indicações → Para você, Na fila → A seguir, Pergunta do dia → Destaque.
// (Bia 28/11: "isso ainda faz sentido?") A lista agora espelha o Hoje de verdade, de cima para baixo. Em cima, fixos (só
// ligar/desligar): Cartão do topo (a abertura do dia), Órbita e Meta, Calendário do mês. Embaixo, na ordem escolhida (setas):
// Destaque do dia, A seguir, Para você. Antes o cartão do topo e o calendário não tinham chave, a Linha do dia tinha setas
// que não faziam nada, e o Destaque dizia "Debate semanal, lembretes" quando hoje é um cartão só (empréstimo, Resumo do mês
// ou a pergunta da semana).
var V6H = [['abre', 'Cartão do topo', 'prazo, meta ou lembrete do dia'], ['dia', 'Órbita e Meta', 'os dois cartões logo abaixo do livro'], ['cal', 'Calendário do mês', 'o que você leu em cada dia'],
  ['dest', 'Destaque do dia', 'um cartão: empréstimo, Resumo do mês ou ' + String(DEB.nome || 'a pergunta da semana').toLowerCase()], ['seguir', 'A seguir', 'o próximo da fila; aparece quando você não está lendo nada'], ['pv', 'Para você', 'indicações de livros e seus gostos']];
const V6H_FIXO = ['abre', 'dia', 'cal'], V6H_MOVE = ['dest', 'seguir', 'pv'];
{ const P = () => { db.prefs = db.prefs || {}; if (!db.prefs.home2) { const old = (db.prefs.home && db.prefs.home.off) || [], off = [];
      if (old.includes('recs')) off.push('pv'); if (old.includes('fila')) off.push('seguir'); if (old.includes('qday')) off.push('dest');
      db.prefs.home2 = { order: V6H.map((x) => x[0]), off }; } const h = db.prefs.home2; V6H.forEach(([k]) => { if (!h.order.includes(k)) h.order.push(k); }); return h; };
  const fnOff = (k) => { try { if (k === 'dia') return !vFn('metas') && !vFn('orbita'); if (k === 'cal') return !vFn('orbita'); if (k === 'pv') return !vFn('pv'); return false; } catch { return false; } };
  // aplicar no Hoje: esconder e ordenar (o livro e os fixos ficam sempre em cima)
  const st = document.createElement('style'); st.textContent = `
:host(.v6h-abre) .v8diaw,:host(.v6h-dia) .v3day,:host(.v6h-cal) .h3cal,:host(.v6h-dest) .v3-colA.v3h > .v3mom,:host(.v6h-seguir) .v3-colA.v3h > .v3x-b,:host(.v6h-lendo) .v3-colA.v3h > .v3x-b,:host(.v6h-pv) .v3-colA.v3h > #pv-host{display:none!important}
.v6hp .v4fn{grid-template-columns:1fr auto auto}.v6hp .v4fn .ud{display:flex;gap:2px;margin-right:6px}.v6hp .v4fn .ud button{width:36px;height:40px;border:0;background:none;color:var(--ink-2);font-size:16px}.v6hp .v4fn .ud button:disabled{opacity:.25}
.v6hp.fixo .v4fn{grid-template-columns:1fr auto}
.v6hp .v4fn.dis{opacity:.5}.v6hp .v4fn.dis small::after{content:" · desligado em Funções do app"}
.v6hg{font-size:.72rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:var(--acc);margin:1rem 0 .45rem}
.v4pg-top{font-size:.8rem;color:var(--ink-2);margin:0 0 .6rem}`; TR.append(st);
  const apply = () => { const h = TR.host; if (!h) return; const p = P(); V6H.forEach(([k]) => h.classList.toggle('v6h-' + k, p.off.includes(k)));
    // (Bia 28/11) "A seguir só deveria aparecer se não estou lendo nada"
    { let lendo = false; try { lendo = lib().some((e) => e.status === 'LENDO'); } catch {} h.classList.toggle('v6h-lendo', lendo); }
    const col = TR.querySelector('.v3-colA.v3h'); if (!col) return; const sel = { dest: ':scope > .v3mom', seguir: ':scope > .v3x-b', pv: ':scope > #pv-host' };
    let n = 3; p.order.filter((k) => sel[k]).forEach((k) => { const el = col.querySelector(sel[k]); if (el && el.style.order !== String(n)) el.style.order = String(n); n++; }); };
  let tm = 0; new MutationObserver(() => { if (!tm) tm = setTimeout(() => { tm = 0; apply(); }, 80); }).observe(TR, { childList: true, subtree: true }); setTimeout(apply, 300);
  homePrefsSheet = function () {
    const draw = () => { const p = P(), M = p.order.filter((k) => V6H_MOVE.includes(k));
      const row = (k, i, setas) => { const it = V6H.find((x) => x[0] === k), dis = fnOff(k), on = !p.off.includes(k) && !dis;
        return '<div class="v4fn' + (dis ? ' dis' : '') + '" data-k="' + k + '"><span><b>' + esc(it[1]) + '</b><small>' + esc(it[2]) + '</small></span>'
          + (setas ? '<span class="ud"><button type="button" data-mv="-1" data-k="' + k + '" aria-label="Subir ' + esc(it[1]) + '"' + (i === 0 ? ' disabled' : '') + '>↑</button><button type="button" data-mv="1" data-k="' + k + '" aria-label="Descer ' + esc(it[1]) + '"' + (i === M.length - 1 ? ' disabled' : '') + '>↓</button></span>' : '')
          + '<button type="button" class="v2fn-tg' + (on ? ' on' : '') + '" data-tg="' + k + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(it[1]) + '"></button></div>'; };
      const v = v4Page('Personalizar Hoje', '<p class="v4pg-top">O livro que você está lendo fica sempre em primeiro.</p>'
        + '<div class="v6hg">Em cima</div><div class="v4card v6hp fixo">' + V6H_FIXO.map((k, i) => row(k, i, false)).join('') + '</div>'
        + '<div class="v6hg">Embaixo, na ordem que quiser</div><div class="v4card v6hp">' + M.map((k, i) => row(k, i, true)).join('') + '</div>', () => homePrefsSheet());
      v.querySelectorAll('[data-tg]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.tg; if (fnOff(k)) { try { v2FuncoesSheet(); } catch {} return; } p.off = p.off.includes(k) ? p.off.filter((x) => x !== k) : [...p.off, k]; save(); apply(); draw(); }));
      v.querySelectorAll('.v4fn.dis span:first-child').forEach((s) => s.addEventListener('click', () => { try { v2FuncoesSheet(); } catch {} }));
      v.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k, i = M.indexOf(k), j = i + +b.dataset.mv; if (i < 0 || j < 0 || j >= M.length) return; [M[i], M[j]] = [M[j], M[i]]; p.order = [...V6H_FIXO, ...M]; save(); apply(); draw(); }));
    };
    S.listRedraw = draw; draw();
  };
}
