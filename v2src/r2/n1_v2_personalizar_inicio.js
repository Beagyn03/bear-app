// Personalizar Hoje alinhado ao Hoje novo (Bia, 20/11). O cartão do livro atual fica sempre primeiro. Itens:
// Linha do dia (Órbita e Meta; fica logo abaixo do livro), Destaque do dia (Pergunta do dia, lembretes, Resumo do mês),
// A seguir, Para você. Saem Comece por aqui (aparece sozinho em conta sem livros), Também lendo (virou deslizar no cartão),
// Próxima conquista, Meta do ano e Na fila (estão na Linha do dia e em A seguir). Sem duplicar Funções do app: item de função
// desligada fica cinza ("desligado em Funções do app") e o toque leva para lá. Guardado em db.prefs.home2; as escolhas
// antigas (db.prefs.home.off) migram uma vez: Indicações → Para você, Na fila → A seguir, Pergunta do dia → Destaque.
var V6H = [['dia', 'Linha do dia', 'Órbita e Meta, logo abaixo do livro'], ['dest', 'Destaque do dia', 'Pergunta do dia, lembretes e Resumo do mês'], ['seguir', 'A seguir', 'o próximo da fila e "Qual leio agora?"'], ['pv', 'Para você', 'indicações de livros e Seus gostos']];
{ const P = () => { db.prefs = db.prefs || {}; if (!db.prefs.home2) { const old = (db.prefs.home && db.prefs.home.off) || [], off = [];
      if (old.includes('recs')) off.push('pv'); if (old.includes('fila')) off.push('seguir'); if (old.includes('qday')) off.push('dest');
      db.prefs.home2 = { order: V6H.map((x) => x[0]), off }; } const h = db.prefs.home2; V6H.forEach(([k]) => { if (!h.order.includes(k)) h.order.push(k); }); return h; };
  const fnOff = (k) => { try { if (k === 'dia') return !vFn('metas') && !vFn('orbita'); if (k === 'pv') return !vFn('pv'); return false; } catch { return false; } };
  // aplicar no Hoje: esconder e ordenar (o livro e a Linha do dia ficam sempre em cima)
  const st = document.createElement('style'); st.textContent = `
:host(.v6h-dia) .v3day,:host(.v6h-dest) .v3-colA.v3h > .v3mom,:host(.v6h-seguir) .v3-colA.v3h > .v3x-b,:host(.v6h-pv) .v3-colA.v3h > #pv-host{display:none!important}
.v6hp .v4fn{grid-template-columns:1fr auto auto}.v6hp .v4fn .ud{display:flex;gap:2px;margin-right:6px}.v6hp .v4fn .ud button{width:28px;height:28px;border:0;background:none;color:var(--ink-2);font-size:15px}.v6hp .v4fn .ud button:disabled{opacity:.25}
.v6hp .v4fn.dis{opacity:.5}.v6hp .v4fn.dis small::after{content:" · desligado em Funções do app"}
.v6hp .v4pg-top{font-size:.8rem;color:var(--ink-2);margin:0 0 .6rem}`; TR.append(st);
  const apply = () => { const h = TR.host; if (!h) return; const p = P(); V6H.forEach(([k]) => h.classList.toggle('v6h-' + k, p.off.includes(k)));
    const col = TR.querySelector('.v3-colA.v3h'); if (!col) return; const sel = { dest: ':scope > .v3mom', seguir: ':scope > .v3x-b', pv: ':scope > #pv-host' };
    let n = 3; p.order.filter((k) => sel[k]).forEach((k) => { const el = col.querySelector(sel[k]); if (el && el.style.order !== String(n)) el.style.order = String(n); n++; }); };
  let tm = 0; new MutationObserver(() => { if (!tm) tm = setTimeout(() => { tm = 0; apply(); }, 80); }).observe(TR, { childList: true, subtree: true }); setTimeout(apply, 300);
  homePrefsSheet = function () {
    const draw = () => { const p = P(), O = p.order.filter((k) => V6H.some((x) => x[0] === k));
      const row = (k, i) => { const it = V6H.find((x) => x[0] === k), dis = fnOff(k), on = !p.off.includes(k) && !dis;
        return '<div class="v4fn' + (dis ? ' dis' : '') + '" data-k="' + k + '"><span><b>' + esc(it[1]) + '</b><small>' + esc(it[2]) + '</small></span><span class="ud"><button type="button" data-mv="-1" data-k="' + k + '" aria-label="Subir"' + (i === 0 ? ' disabled' : '') + '>↑</button><button type="button" data-mv="1" data-k="' + k + '" aria-label="Descer"' + (i === O.length - 1 ? ' disabled' : '') + '>↓</button></span><button type="button" class="v2fn-tg' + (on ? ' on' : '') + '" data-tg="' + k + '" role="switch" aria-checked="' + on + '" aria-label="' + esc(it[1]) + '"></button></div>'; };
      const v = v4Page('Personalizar Hoje', '<p class="v4pg-top">O livro que você está lendo fica sempre em primeiro. Escolha o que aparece embaixo dele e em que ordem.</p><div class="v4card v6hp">' + O.map(row).join('') + '</div>', () => homePrefsSheet());
      v.querySelectorAll('[data-tg]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.tg; if (fnOff(k)) { try { v2FuncoesSheet(); } catch {} return; } p.off = p.off.includes(k) ? p.off.filter((x) => x !== k) : [...p.off, k]; save(); apply(); draw(); }));
      v.querySelectorAll('.v4fn.dis span:first-child').forEach((s) => s.addEventListener('click', () => { try { v2FuncoesSheet(); } catch {} }));
      v.querySelectorAll('[data-mv]').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k, i = p.order.indexOf(k), j = i + +b.dataset.mv; if (i < 0 || j < 0 || j >= p.order.length) return; [p.order[i], p.order[j]] = [p.order[j], p.order[i]]; save(); apply(); draw(); }));
    };
    S.listRedraw = draw; draw();
  };
}
