// ---------- v2: "Editar" da estante no topo, ao lado de "Todos" (Bia, 26/11) ----------
// O botão flutuante "Editar" ficava por cima dos livros. Agora ele é uma opção da linha de cima (Todos · Editar · Grade|
// Prateleira) e entra no mesmo Organizar de antes (data-a="shmode" data-v="org", que já existia escondido nessa linha).
// No celular, Grade e Prateleira ficam só com o ícone para caber (o nome continua no leitor de tela e no title).
{ const PEN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 20h4L19 9l-4-4L4 16z'/%3E%3Cpath d='m13.5 6.5 4 4'/%3E%3C/svg%3E\")";
  const CSS = `
.v5est .flncol.fled1{display:none!important}
.v5est .shtop.fln{display:flex;align-items:center;gap:8px}
.v5est .shtop.fln .shic[data-a=shmode][data-v=org]{display:inline-flex!important;align-items:center;gap:6px;width:auto;min-width:0;min-height:38px;padding:0 12px;border:1px solid var(--line);border-radius:12px;background:var(--soft);color:var(--ink);font:inherit;font-weight:800;font-size:.9rem;order:1}
.v5est .shtop.fln .shic[data-a=shmode][data-v=org] > svg{display:none}
.v5est .shtop.fln .shic[data-a=shmode][data-v=org]::before{content:'';width:16px;height:16px;background:currentColor;-webkit-mask:${PEN} center/contain no-repeat;mask:${PEN} center/contain no-repeat}
.v5est .shic .shedl{display:none}.v5est .shtop.fln .shic[data-a=shmode][data-v=org] .shedl{display:inline}
.v5est .shtop.fln .shsel{order:0}.v5est .shtop.fln .vtog{order:2;margin-left:auto}
@media (max-width:440px){.v5est .shtop.fln .vtog button{font-size:0;gap:0;padding:0 10px}.v5est .shtop.fln .vtog button svg{margin:0}}`;
  const _css = shCss; shCss = function (sr) { _css.apply(this, arguments); try { if (sr && !sr.querySelector('style[data-edtopo]')) { const st = document.createElement('style'); st.dataset.edtopo = 1; st.textContent = CSS; sr.append(st); } } catch {} };
  // a estante já desenhada antes deste bloco também recebe o estilo
  try { SHX_ROOTS.forEach((sr) => shCss(sr)); } catch {}
}
