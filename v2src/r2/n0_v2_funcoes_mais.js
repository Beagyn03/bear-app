// Funções do app: 5 interruptores novos (Bia, 20/11, "se não quebrar nada"). Desligar NUNCA apaga dado; religar volta tudo.
// - Ecos (independente da Comunidade): bolinhas, "N ecos à sua frente", (?), Deixar um eco, filtro Ecos da Atividade.
// - Ler junto e Pergunta do dia: ficam "dentro" da Comunidade (só valem com ela ligada; sem ela, aparecem cinza).
// - Para você: a seção de indicações do Hoje (e "Seus gostos").
// - Prazos: caixa "Hoje, leia até a pág. X", arco pontilhado, Prazo/Definir prazo do menu, lembrete de prazo em Lembretes;
//   enquanto desligada, o lembrete de prazo na API fica desligado (ao religar, volta sozinho).
var V6SUB = { junto: 'comunidade', qday: 'comunidade' };
function vFn(k) { try { const m = v2Mods(); if (V6SUB[k] && m[V6SUB[k]] === false) return false; if (k === 'presentes') return v4Mod('presentes'); return m[k] !== false; } catch { return true; } }
{ const add = (after, item) => { const i = V2MODS.findIndex((x) => x[0] === after); if (V2MODS.some((x) => x[0] === item[0])) return; V2MODS.splice(i < 0 ? V2MODS.length : i + 1, 0, item); };
  add('comunidade', ['qday', 'Pergunta do dia', 'cartão do Hoje e Mais votados']);
  add('comunidade', ['junto', 'Ler junto', 'convites e leitura com amizades']);
  add('qday', ['ecos', 'Ecos', 'frases que leitores deixam nas páginas']);
  add('metas', ['prazos', 'Prazos', 'data para terminar um livro, plano do dia e lembrete']);
  add('trechos', ['pv', 'Para você', 'indicações de livros no Hoje']);
  v2ModsApply = function () { const m = v2Mods(), h = TR.host; if (!h) return; V2MODS.forEach(([k]) => h.classList.toggle('v2off-' + k, !vFn(k))); h.classList.remove('v2off-conq'); if (!m.comunidade && S.tab === 'comunidade') { try { goTab('inicio'); } catch {} } };
  const st = document.createElement('style'); st.textContent = `
:host(.v2off-pv) #pv-host,:host(.v2off-pv) [data-in=pv]{display:none!important}
:host(.v2off-junto) .v3-bud,:host(.v2off-junto) #v3-bud-inv{display:none!important}
.v4fn.sub{padding-left:1.4rem}.v4fn.sub b::before{content:"";display:inline-block;width:.5em;height:.45em;border-left:1.6px solid var(--ink-2);border-bottom:1.6px solid var(--ink-2);border-bottom-left-radius:2px;margin:0 .4em .2em 0;vertical-align:middle}
.v4fn.dis{opacity:.45}.v4fn.dis small::after{content:" · precisa da Comunidade"}
`; TR.append(st);
  // página: subitens recuados; sem Comunidade, ficam cinza e não mudam
  v2FuncoesSheet = function () {
    const draw = () => {
      const row = ([k, n, d]) => { const sub = V6SUB[k], dis = sub && !v4Mod(sub), on = v2Mods()[k] !== false && !(k === 'presentes' && !v4Mod('presentes'));
        return '<div class="v4fn' + (sub ? ' sub' : '') + (dis ? ' dis' : '') + '"><span><b>' + esc(n) + '</b><small>' + esc(d) + '</small></span><button type="button" class="v2fn-tg' + (on && !dis ? ' on' : '') + '" data-k="' + k + '" role="switch" aria-checked="' + (on && !dis) + '" aria-label="' + esc(n) + '"' + (dis ? ' aria-disabled="true"' : '') + '></button></div>'; };
      const v = v4Page('Funções do app', '<p class="v4pg-intro">Desligue o que você não usa. O app se reorganiza e some com os botões, abas e números dessa função. Nada é apagado: ao religar, volta tudo.</p><div class="v4card">' + V2MODS.map(row).join('') + '</div>', () => v2FuncoesSheet());
      v.querySelectorAll('.v2fn-tg').forEach((b) => b.addEventListener('click', () => { const k = b.dataset.k; if (V6SUB[k] && !v4Mod(V6SUB[k])) return toast('Ligue a Comunidade primeiro');
        const mods = { ...((db.prefs || {}).mods || {}) }; if (mods.presentes === undefined) mods.presentes = mods.emprest !== false;
        const now = k === 'presentes' ? v4Mod('presentes') : mods[k] !== false; mods[k] = !now; db.prefs = { ...(db.prefs || {}), mods }; save(); v2ModsApply(); try { drawTabbar(); } catch {}
        if (k === 'prazos') { try { if (mods.prazos === false) sapi('DELETE', '/v1/me/reminder').catch(() => {}); else { reminderSync(typeof remindOwner === 'function' ? remindOwner() : null); } } catch {} }
        try { refresh(); } catch {} draw(); }));
    };
    S.listRedraw = draw; draw();
  };
  // com Prazos desligado, o lembrete de prazo não volta a ser enviado por outro caminho
  const _rs = reminderSync; reminderSync = async function () { if (!vFn('prazos')) { try { if (connected()) await sapi('DELETE', '/v1/me/reminder'); } catch {} return; } return _rs.apply(this, arguments); };
  [0, 600, 1800].forEach((ms) => setTimeout(() => { try { v2ModsApply(); } catch {} }, ms));
}
