const botaoMenu = document.querySelector(".botaoMenu");
const navegacao = document.querySelector(".navegacao");
const linksMenu = document.querySelectorAll(".links");
const cards = document.querySelectorAll(".cardComponente");
const componentes = document.querySelectorAll(".selecaoComponente");
const precoMontagem = document.querySelector(".precoMontagem");
const botaoFinalizar = document.querySelector(".finalizarMontagem");
const snackbar = document.querySelector(".snackbar");
const mensagemSnackbar = document.querySelector(".mensagemSnackbar");
const tituloEtapa = document.querySelector(".tituloEtapa");
const descricaoComponente = document.querySelector(".descricaoComponente");
const continuarMontagem = document.querySelector(".continuarMontagem");
const voltar = document.querySelector(".voltar");
const contadorPecas = document.querySelector(".pecas .descricaoPecas");
const numeroEtapa = document.querySelector(".textoPrincipalMontagem .descricaoPecas");
const porcentagemPecas = document.querySelector(".porcentagemPecas");
const progressoPreenchido = document.querySelector(".progressoPreenchido");
let precoPlacaMae = 0;
let precoCpu = 0;
let precoGpu = 0;
let precoRAM = 0;
let precoArmazenamento = 0;
let precoFonte = 0;
let precoGabinete = 0;
let socketCpu = "";
let socketPlacaMae = "";
let consumoCpu = 0;
let consumoGpu = 0;
let potenciaFonte = 0;
let totalConsumo = 0;
let etapaAtual = 0;


const categoriaInicial = componentes[0].dataset.categoria;

function mostrarSnackbar(mensagem) {
  mensagemSnackbar.textContent = mensagem;
  snackbar.classList.add("visivel");
  setTimeout(() => snackbar.classList.remove("visivel"), 3000);
}

function filtrarCategoria(categoria) {
  cards.forEach(card => {
    if (categoria === card.dataset.categoria) {
      card.classList.remove("oculto");
    } else {
      card.classList.add("oculto");
    }
  })
}

function calcularTotal() {
  let totalComponentes = precoCpu + precoGpu + precoPlacaMae + precoRAM + precoFonte + precoGabinete + precoArmazenamento;
  return totalComponentes;
}

function verificarSocket() {
  if (!socketPlacaMae || !socketCpu) {
    document.querySelector(".statusSocket").textContent = "";
  } else {
    if (socketPlacaMae === socketCpu) {
      document.querySelector(".statusSocket").textContent = "O processador e a placa-mãe utilizam o mesmo socket. Verificação aprovada!"

    } else {
      document.querySelector(".statusSocket").textContent = "O processador e a placa-mãe utilizam sockets diferentes. Escolha componentes compatíveis.";
    }
  }
}


function verificarConsumo() {
  if (!consumoCpu || !potenciaFonte || !consumoGpu) {
    document.querySelector(".statusConsumo").textContent = "";
  } else {
    totalConsumo = consumoCpu + consumoGpu;
    if (totalConsumo > potenciaFonte) {
      document.querySelector(".statusConsumo").textContent = "Sua fonte escolhida não aguenta os componentes escolhidos! Escolha uma fonte com maior potencia"
    } else {
      document.querySelector(".statusConsumo").textContent = "Sua fonte aguenta os componentes escolhidos!"
    }
  }
}

filtrarCategoria(categoriaInicial);
componentes[0].classList.add("selecionado");


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

cards.forEach((card) => {
  card.addEventListener("click", (e) => {
    const categoriaCard = card.dataset.categoria;

    cards.forEach(card => {
      if (card.dataset.categoria === categoriaCard) {
        card.classList.remove("selecionado");
        atualizarIconesResumo();
      }
    })

    card.classList.add("selecionado");
    atualizarProgresso();
    atualizarIconesResumo();
    const nomePeca = card.querySelector(".nomeComponente");
    const preco = card.querySelector(".preco");
    const precoPeca = Number(preco.textContent.replace("R$", ""));
    let socket = card.dataset.socket;
    let potencia = card.dataset.potencia;
    let consumo = card.dataset.consumo;
    let consumoReal = Number(consumo);
    let potenciaReal = Number(potencia);


    if (categoriaCard === "cpu") {
      precoCpu = precoPeca
      document.querySelector(".resumoCpu").textContent = nomePeca.textContent;
      socketCpu = socket;
      consumoCpu = consumoReal


    } else if (categoriaCard === "gpu") {
      precoGpu = precoPeca
      document.querySelector(".resumoGpu").textContent = nomePeca.textContent;
      consumoGpu = consumoReal

    } else if (categoriaCard === "placaMae") {
      precoPlacaMae = precoPeca
      document.querySelector(".resumoPlacaMae").textContent = nomePeca.textContent;
      socketPlacaMae = socket;

    } else if (categoriaCard === "memoriaRAM") {
      precoRAM = precoPeca;
      document.querySelector(".resumoRAM").textContent = nomePeca.textContent;

    } else if (categoriaCard === "armazenamento") {
      precoArmazenamento = precoPeca
      document.querySelector(".resumoArmazenamento").textContent = nomePeca.textContent;

    } else if (categoriaCard === "fonte") {
      precoFonte = precoPeca
      document.querySelector(".resumoFonte").textContent = nomePeca.textContent;
      potenciaFonte = potenciaReal

    } else if (categoriaCard === "gabinete") {
      precoGabinete = precoPeca;
      document.querySelector(".resumoGabinete").textContent = nomePeca.textContent;
    }
    verificarConsumo();
    verificarSocket();

    const total = calcularTotal();
    precoMontagem.textContent = total.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    })


    componentes.forEach(componente => {
      const categoriaComponente = componente.dataset.categoria;
      if (categoriaComponente === categoriaCard) {
        const pecaEscolhida = componente.querySelector(".pecaEscolhida")
        pecaEscolhida.textContent = nomePeca.textContent;
      }
    })


  })

})


componentes.forEach(componente => {
  componente.addEventListener("click", (e) => {
    componentes.forEach(componente => {
      componente.classList.remove("selecionado");
    })

    componente.classList.add("selecionado");
    const categoria = componente.dataset.categoria;
    if (categoria === "cpu") {
      tituloEtapa.textContent = "Escolha seu processador";
      descricaoComponente.textContent = "Processador é como o cérebro humano, ele precisa executar todos os cálculos,\n" +
        "pensamentos e comandos do seu sistema."

    } else if (categoria === "gpu") {
      tituloEtapa.textContent = "Escolha sua placa de vídeo";
      descricaoComponente.textContent = "Placa de vídeo é fundamental para o PC. Pense na placa de vídeo como os olhos humanos,\n" +
        "ela procesa imagens complexas, cores e tudo o que você enxerga na tela."

    } else if (categoria === "placaMae") {
      tituloEtapa.textContent = "Escolha sua placa-mãe";
      descricaoComponente.textContent = "Placa-mãe é de extrema importância para o funcionamento do PC. \n" +
        "A placa-mãe pode ser comparada ao sistema nervoso/esqueleto, pois conecta todos os órgãos e leva a informação de um ponto ao outro."

    } else if (categoria === "memoriaRAM") {
      tituloEtapa.textContent = "Escolha sua memória RAM";
      descricaoComponente.textContent = "A memória RAM é igual a uma memória de curto prazo, pois guarda \n" +
        "o que você está usando agora (como manter um pensamento na cabeça). Ela é de extrema importância! Ela vai definir a agilidade do momento. \n" +
        "OBS:(O MAIS RECOMENDADO HOJE É PEGAR 16GB UTILIZANDO DOIS PENTES DE 8GB PARA DEIXAR AINDA MAIS RÁPIDO O TEMPO DE RESPOSTA DO PC)"
    } else if (categoria === "armazenamento") {
      tituloEtapa.textContent = "Escolha seu armazenamento";
      descricaoComponente.textContent = "O armazenamento, tanto SSD quanto HD, é de extrema importância. Pense neles como uma memória de longo prazo e, diferente da memória RAM,\n" +
        "eles guardam toda a informação do seu computador. OBS:(CASO QUEIRA QUE SEU PC CARREGUE AS INFORMAÇÕES RÁPIDAS, ESCOLHA UM SSD. CASO QUEIRA GUARDAR MUITA INFORMAÇÃO E NÃO LIGA \n" +
        "PARA O TEMPO DE RESPOSTA, ESCOLHA UM HD)"

    } else if (categoria === "fonte") {
      tituloEtapa.textContent = "Escolha sua fonte";
      descricaoComponente.textContent = "A fonte é o principal componente de todo o PC, pois sem ela, o PC não funciona. \n" +
        "A fonte é igual o coração humano, bombeia a energia (sangue) para todas as outras peças. OBS:(NUNCA ECONOMIZE NA FONTE, OU PODE QUEIMAR TODOS OS COMPONENTES!)"

    } else if (categoria === "gabinete") {
      tituloEtapa.textContent = "Escolha seu gabinete";
      descricaoComponente.textContent = "O gabinete, além de dar um visual para o PC, ele também protege os componentes de impactos, poeira e sujeira. \n" +
        "O gabinete pode se comparar à pele humana que também tem essas características"
    }
    filtrarCategoria(categoria);

  })


})

function verificarMontagem() {
  if (precoPlacaMae === 0 || precoArmazenamento === 0 || precoGabinete === 0 || precoGpu === 0 || precoFonte === 0 || precoRAM === 0 || precoCpu === 0) {
    mostrarSnackbar("Não foi possível finalizar: faltam peças.")
  } else {
    mostrarSnackbar("Montagem concluída com sucesso!");
  }

}

function atualizarMontagem() {
  componentes[etapaAtual].click();


  numeroEtapa.textContent =
    `ETAPA ${etapaAtual + 1} DE ${componentes.length}`;


  const pecasSelecionadas =
    document.querySelectorAll(".cardComponente.selecionado").length;


  contadorPecas.textContent =
    `${pecasSelecionadas} de ${componentes.length} peças`;

  porcentagemPecas.textContent =
    `${Math.round((pecasSelecionadas / componentes.length) * 100)}%`;
}


function atualizarProgresso() {
  const pecasSelecionadas = document.querySelectorAll(
    ".cardComponente.selecionado"
  ).length;

  const totalPecas = componentes.length;

  const porcentagem = Math.round(
    (pecasSelecionadas / totalPecas) * 100
  );

  contadorPecas.textContent =
    `${pecasSelecionadas} de ${totalPecas} peças`;

  porcentagemPecas.textContent = `${porcentagem}%`;

  progressoPreenchido.style.width = `${porcentagem}%`;
}


botaoFinalizar.addEventListener("click", (e) => {
  verificarMontagem();
})

continuarMontagem.addEventListener("click", (e) => {

  const categoriaAtual = componentes[etapaAtual].dataset.categoria;

  const pecaSelecionada = document.querySelector(
    `.cardComponente.selecionado[data-categoria="${categoriaAtual}"]`
  );

  if (!pecaSelecionada) {
    mostrarSnackbar("Escolha uma peça antes de continuar.");
    return;
  }

  if (etapaAtual < componentes.length - 1) {
    etapaAtual++;
    atualizarMontagem();
  } else {
    mostrarSnackbar("Você chegou à última etapa da montagem!");
  }
});


function atualizarIconesResumo() {
  const itensResumo = document.querySelectorAll(".itemResumo");

  itensResumo.forEach((item) => {
    const categoria = item.dataset.categoria;

    const pecaSelecionada = document.querySelector(
      `.cardComponente.selecionado[data-categoria="${categoria}"]`
    );

    if (pecaSelecionada) {
      item.classList.add("temPeca");
    } else {
      item.classList.remove("temPeca");
    }
  });
}

voltar.addEventListener("click", (e) => {
  if (etapaAtual > 0){
    etapaAtual--;
    atualizarMontagem();
  }
})
