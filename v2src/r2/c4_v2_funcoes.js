// v2 "Funções do app" (Bia, 19/11, branch livroverso-2): em Ajustes, o primeiro item escolhe o que aparece no app.
// Desligar só esconde as entradas (cartões do Hoje, itens do menu lateral, seções do perfil, aba da barra); nada é apagado.
// Guardado em db.prefs.mods (padrão: tudo ligado).
const V2MODS = [
  ['metas', 'Metas e prazos', 'meta do ano, prazo para terminar e a semana do prazo'],
  ['comunidade', 'Comunidade', 'aba Comunidade, amizades e o ' + DEB.nome],
  ['trechos', 'Trechos e diário', 'trechos, anotações e o diário da leitura'],
  ['emprest', 'Empréstimos e presentes', 'meu exemplar, emprestei, peguei emprestado e presentes'],
  ['orbita', 'Órbita', 'os dias seguidos de leitura'],
  ['conq', 'Conquistas', 'medalhas no perfil e a próxima conquista'],
];
const v2Mods = () => ({ metas: true, comunidade: true, trechos: true, emprest: true, orbita: true, conq: true, ...((db.prefs || {}).mods || {}) });
function v2ModsApply() { const m = v2Mods(), h = TR.host; if (!h) return; V2MODS.forEach(([k]) => h.classList.toggle('v2off-' + k, !m[k])); if (!m.comunidade && S.tab === 'comunidade') { try { goTab('inicio'); } catch {} } }
{ const st = document.createElement('style'); st.textContent = `
:host(.v2off-comunidade) #tabbar [data-tab=comunidade]{display:none!important}
:host(.v2off-comunidade) #tabbar.v2bar{grid-template-columns:1fr 1fr 78px 1fr!important}
:host(.v2off-comunidade) .v2-qd,:host(.v2off-comunidade) .v2wk,:host(.v2off-comunidade) .drw [data-go="friends"],:host(.v2off-comunidade) .drw [data-go2="salvos"],:host(.v2off-comunidade) .v2afi,:host(.v2off-comunidade) .v2hero [data-h=inv]{display:none!important}
:host(.v2off-metas) .v3-colA.v2h > .v3-now,:host(.v2off-metas) .v3-colA.v2h > .v2-meta-t,:host(.v2off-metas) .v2hero .due,:host(.v2off-metas) .drw [data-go="goals"],:host(.v2off-metas) .v2pv [data-p=meta]{display:none!important}
:host(.v2off-trechos) .drw [data-go="quotes"],:host(.v2off-trechos) .drw [data-go2="quotes"],:host(.v2off-trechos) .v2ses [data-a=qt],:host(.v2off-trechos) .v2ses [data-a=nt]{display:none!important}
:host(.v2off-emprest) .drw [data-go2="gifts"],:host(.v2off-emprest) .bp-ex,:host(.v2off-emprest) .ex-alert,:host(.v2off-emprest) .gf-alert{display:none!important}
:host(.v2off-orbita) .drw [data-go2="orbita"],:host(.v2off-orbita) #g-orb,:host(.v2off-orbita) .v3-colA.v2h > .orb-row{display:none!important}
:host(.v2off-conq) .drw [data-go="ach"],:host(.v2off-conq) .v2-conq,:host(.v2off-conq) .yo-ach,:host(.v2off-conq) .ini-conq{display:none!important}
.v2fn-row{display:grid;grid-template-columns:1fr auto;gap:.6rem;align-items:center;min-height:58px;border-top:1px solid var(--line);padding:.35rem 0}
.v2fn-row b{display:block;font-size:.92rem;color:var(--ink)}.v2fn-row small{display:block;font-size:.74rem;color:var(--ink-2);margin-top:.1rem}
.v2fn-tg{width:48px;height:28px;border-radius:99px;border:0;background:var(--line);position:relative;padding:0;cursor:pointer;transition:background .15s}
.v2fn-tg::after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .15s}
.v2fn-tg.on{background:var(--acc)}.v2fn-tg.on::after{left:23px}
`; TR.append(st); }
function v2FuncoesSheet() {
  const ed = $('#editor'); ed.classList.add('compact'); const m = v2Mods();
  const draw = () => {
    ed.querySelector('.ed-body').innerHTML = `<div class="dd"><h3>Funções do app</h3><p>Escolha o que aparece no seu app. Desligar só esconde: nada é apagado, e dá para ligar de novo quando quiser.</p>
      ${V2MODS.map(([k, n, d]) => `<div class="v2fn-row"><span><b>${n}</b><small>${d}</small></span><button type="button" class="v2fn-tg${m[k] ? ' on' : ''}" data-k="${k}" role="switch" aria-checked="${m[k]}" aria-label="${n}"></button></div>`).join('')}
      <button type="button" class="op main" id="v2fn-ok" style="margin-top:.8rem"><b>Pronto</b></button></div>`;
    $$('.v2fn-tg', ed).forEach((b) => b.addEventListener('click', () => { m[b.dataset.k] = !m[b.dataset.k]; draw(); }));
    $('#v2fn-ok', ed).addEventListener('click', () => { db.prefs = { ...(db.prefs || {}), mods: { ...m } }; save(); closeEd(); v2ModsApply(); try { drawTabbar(); } catch {} toast('Funções do app atualizadas'); });
  };
  draw(); ed.hidden = false;
}
{ const _da = drawAjustes; drawAjustes = function (box) { _da(box); if (S.ajMode === 'perfil' || box.querySelector('#aj-fn')) return;
  const g = box.querySelector('.aj-g'); if (!g) return;
  g.insertAdjacentHTML('beforebegin', `<div class="aj-g">Seu app</div><div class="aj-card"><button type="button" class="aj-row" id="aj-fn"><span><b>Funções do app</b><small>o que aparece no seu app · ${V2MODS.filter(([k]) => v2Mods()[k]).length} de ${V2MODS.length} ligadas</small></span>›</button></div>`);
  $('#aj-fn', box).addEventListener('click', v2FuncoesSheet); }; }
setTimeout(v2ModsApply, 300);
