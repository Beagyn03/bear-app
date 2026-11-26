// ---------- v2: áreas de toque maiores sem mudar o desenho (portão de QA, 26/11) ----------
// Links de texto pequenos (menos de 40 px de altura) ficavam difíceis de acertar no celular. O padding vertical aumenta a
// área do toque e a margem negativa do mesmo tamanho devolve o espaço: nada muda de lugar na tela.
{ const st = document.createElement('style'); st.textContent = `
.v3lag button,[data-v3=amz],.v3sh [data-h3=qual],.v3dots .nx{padding-top:10px!important;padding-bottom:10px!important;margin-top:-10px!important;margin-bottom:-10px!important}
`; TR.append(st); }
