// Menu lateral revisado: sai o que já está na barra de baixo ou no ••• do perfil (Estantes, Editar perfil);
// entra "Meta do ano" ao lado das metas com prazo; "Encontrar leitores" vai para Buscar › Leitores (mesma tela da aba).
// (o botão do topo guarda a função original do menu; por isso o ajuste é feito quando o menu aparece na tela)
{
  const fix = (d) => {
    if (d.dataset.r2) return; d.dataset.r2 = 1;
    d.querySelector('[data-go="cols"]')?.remove();
    const prof = d.querySelector('[data-go="prof"]');
    if (prof && socialProfile) { const g = prof.previousElementSibling; prof.remove(); if (g && g.classList.contains('drw-g') && g.textContent.trim() === 'Você') g.remove(); }
    const goals = d.querySelector('[data-go="goals"]');
    if (goals) {
      const y = new Date().getFullYear(), t = Number((db.yearGoals || {})[y]) || 0, n = lib().filter((e) => e.status === 'LIDO' && String(e.finishedAt || '').startsWith(String(y))).length;
      // Meta do ano e Metas com prazo numa tela só (15/11)
      goals.innerHTML = `${dsv('target')}Metas<small>${t ? `${n} de ${t} em ${y}` : (db.goals || []).length ? plural(db.goals.length, 'meta', 'metas') : 'definir'}</small>`;
    }
    d.querySelector('[data-go="people"]')?.remove(); // Encontrar leitores fica dentro de Amigos (15/11)
    const people = null;
    if (people) people.addEventListener('click', (ev) => { ev.stopImmediatePropagation(); closeDrawer(); goTab('buscar'); setTimeout(() => { const b = [...TR.querySelectorAll('button')].find((x) => x.offsetParent && x.textContent.trim() === 'Leitores'); if (b) b.click(); }, 250); }, true);
  };
  new MutationObserver(() => { const d = TR.querySelector('.drw'); if (d) fix(d); }).observe(TR, { childList: true });
}
