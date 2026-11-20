// Sem urso (Bia, 17/11): o visual é só tipografia. Ilustrações do urso viraram um pixel transparente (ART/A) e somem do layout;
// o cartão "Dica" (antigo "Bear diz") fica só com o texto.
{ const st = document.createElement('style'); st.textContent = `
img[src^="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP"]{display:none!important}
.v3-bear{grid-template-columns:1fr!important}.v3-bear > img{display:none!important}
.v3-bear-b small{text-transform:uppercase;letter-spacing:.08em;color:var(--acc);font-weight:900}
`; TR.append(st); }
