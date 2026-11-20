// Aba "Enredo" na página do livro (Bia, 17/11): ressaca literária e níveis do enredo saem do Sobre para não empurrar a sinopse.
{ const st = document.createElement('style'); st.textContent = `
#shelflist[data-bt=sobre] .rs-term,#shelflist[data-bt=sobre] .nv-term{display:none!important}
#shelflist[data-bt=enredo] .bp-sec,#shelflist[data-bt=enredo] .bp-dl,#shelflist[data-bt=enredo] .bp-src,#shelflist[data-bt=enredo] .bp-btn{display:none!important}
#shelflist .bp-tabs button{white-space:nowrap}`; TR.append(st); }
