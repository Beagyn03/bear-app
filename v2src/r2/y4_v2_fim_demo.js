// Terminei em modo demonstração (Bia, 21/11): o tour mostra a folha do Terminei sem que a pessoa marque como lido um livro
// que ainda está lendo. v4FimOpen(e, 1) abre a folha com o aviso "Só uma demonstração: nada será salvo" e o botão final
// "Entendi", que fecha sem gravar nada (nem status, nem nota, nem datas). Abrir normalmente desliga a demonstração.
{ const _fo = v4FimOpen; v4FimOpen = function (e, demo) { try { v4State().fimDemo = demo ? 1 : 0; } catch {} return _fo.call(this, e); };
  const _fp = v4FimPage; v4FimPage = function (e) { let h = _fp.apply(this, arguments); let demo = 0; try { demo = v4State().fimDemo; } catch {}
    if (!demo || !h) return h;
    h = h.replace('<div class="fimh">', '<div class="fimdemo" role="note" style="margin:0 0 12px;padding:10px 12px;border-radius:12px;border:1.5px dashed var(--acc,#e0a060);font-weight:800;font-size:.9rem;text-align:center">Só uma demonstração: nada será salvo</div><div class="fimh">');
    h = h.replace(/(data-a="fimok"[^>]*>)[^<]*(<\/button>)/, '$1Entendi$2');
    return h; };
  const _fs = v4FimSave; v4FimSave = function () { let demo = 0; try { demo = v4State().fimDemo; } catch {}
    if (!demo) return _fs.apply(this, arguments);
    const st = v4State(); st.fimDemo = 0; st.F = null;
    try { if (st.prevView === 'ler') { st.view = 'ler'; v4Draw(); } else v4Close(); } catch {}
    try { toast('Demonstração concluída. Nada foi salvo.'); } catch {} }; }
