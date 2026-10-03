const botaoMenu = document.querySelector(".botaoMenu");
const navegacao = document.querySelector(".navegacao");
const linksMenu = document.querySelectorAll(".links");


botaoMenu.addEventListener("click", () => {
  navegacao.classList.toggle("menuAberto")
})

linksMenu.forEach((link) => {
  link.addEventListener("click", (e) => {
    linksMenu.forEach(outroLink => {
      outroLink.classList.remove("ativo");
    })

    link.classList.add("ativo");
  })
})
