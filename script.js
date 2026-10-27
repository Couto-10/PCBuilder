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
const divComponentes = document.querySelector(".divComponentes");
const dadosCards = new Map();
const funcaoAjuda = document.querySelector("#funcao");
const oQueObservarAjuda = document.querySelector("#oQueObservar");
const dicasAjuda = document.querySelector("#dicas");
const modalAjuda = document.querySelector(".ajuda");
const botaoFechar = document.querySelector(".botaoFechar");
const tutorial = document.querySelector("#tutorial");
const tituloTutorial = document.querySelector("#tituloTutorial");
const textoTutorial = document.querySelector("#textoTutorial");
const pularTutorial = document.querySelector("#pularTutorial");
const voltarTutorial = document.querySelector("#voltarTutorial");
const avancarTutorial = document.querySelector("#avancarTutorial");
const areaCategorias = document.querySelector(".divEsquerda");
const areaComponentes = document.querySelector(".divMeio");
const areaResumo = document.querySelector(".divDireita");
const areaBotoes = document.querySelector(".botoes");
const statusConsumo = document.querySelector(".statusConsumo");
const statusSocket = document.querySelector(".statusSocket");
const areasTutorial = [
  areaCategorias,
  areaComponentes,
  areaResumo,
  areaBotoes
];
const etapasTutorial = [
  {
    titulo: "Vamos montar seu primeiro PC?",
    texto: "Você vai escolher suas peças uma por vez.",
    area: null
  },
  {
    titulo: "Escolhas os componentes",
    texto: "Comece pelo processador. Compare as opções e consulte a ajuda quando precisar.",
    area: areaCategorias,
  },
  {
    titulo: "Veja os componentes da categoria",
    texto: "Escolha os componentes da categoria selecionada. Se tiver dúvidas, clique no botão de ajuda.",
    area: areaComponentes,
    classe: "tutorialComponentes"
  },
  {
    titulo: "Confira sua montagem",
    texto: "Acompanhe o orçamento, a compatibilidade e as peças escolhidas.",
    area: areaResumo
  },
  {
    titulo: "Finalize sua montagem",
    texto: "Use os botões de navegação para voltar, continuar e finalizar.",
    area: areaBotoes
  }
];

let etapaTutorial = 0;
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
let consumoPlacaMae = 0;
let consumoMemoriaRAM = 0;
let consumoArmazenamento = 0;
let potenciaFonte = 0;
let totalConsumo = 0;
let etapaAtual = 0;

let categoriaInicial = null;

function criarCard(componente) {
  const card = document.createElement("div");
  card.classList.add("cardComponente");

  dadosCards.set(card, componente);

  card.dataset.categoria = componente.categoria;
  card.dataset.preco = componente.preco;
  card.dataset.socket = componente.socket || "";
  card.dataset.consumo = componente.consumo || 0;
  card.dataset.potencia = componente.potencia || 0;

  const nome = document.createElement("h2")
  nome.classList.add("nomeComponente");
  nome.textContent = componente.nome;
  card.appendChild(nome);

  const preco = document.createElement("p")
  preco.classList.add("preco");
  preco.textContent = componente.preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
  card.appendChild(preco);

  const descricao = document.createElement("p")
  descricao.classList.add("descricaoComponenteCard");
  descricao.textContent = componente.descricao;
  card.appendChild(descricao);

  const botaoAjuda = document.createElement("button");
  botaoAjuda.classList.add("botaoAjuda");
  botaoAjuda.textContent = "Ajuda";
  card.appendChild(botaoAjuda);

  return card;
}

if (divComponentes) {
  fetch("./componentes.json")
    .then(resposta => resposta.json())
    .then(dadosComponentes => {
      dadosComponentes.forEach(componente => {
        const card = criarCard(componente);
        divComponentes.appendChild(card);
      });

      if (dadosComponentes.length > 0 && componentes.length > 0) {
        categoriaInicial = componentes[0].dataset.categoria;
        filtrarCategoria(categoriaInicial);
        componentes[0].classList.add("selecionado")
      }
    })
    .catch(error => {
      console.error("Erro ao carregar os componentes:", error);
    });
}

function mostrarSnackbar(mensagem) {
  mensagemSnackbar.textContent = mensagem;
  snackbar.classList.add("visivel");
  setTimeout(() => snackbar.classList.remove("visivel"), 3000);
}

function filtrarCategoria(categoria) {
  const cardsAtuais = document.querySelectorAll(".cardComponente");

  cardsAtuais.forEach(card => {

    if (categoria === card.dataset.categoria) {
      card.classList.remove("oculto");

    } else {
      card.classList.add("oculto");
    }
  })
}

function calcularTotal() {
  const total = precoCpu + precoGpu + precoPlacaMae + precoRAM + precoFonte + precoGabinete + precoArmazenamento;
  precoMontagem.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function verificarSocket() {
  if (!socketPlacaMae || !socketCpu) {
    document.querySelector(".statusSocket").textContent = "";
    statusSocket.classList.remove("statusConsumoInsuficiente", "statusConsumoSuficiente");

    return false
  } else {
    if (socketPlacaMae === socketCpu) {
      statusSocket.classList.remove("statusConsumoInsuficiente");
      statusSocket.classList.add("statusConsumoSuficiente");
      document.querySelector(".statusSocket").textContent = "O processador e a placa-mãe utilizam o mesmo socket. Verificação aprovada!"

      return true
    } else {
      statusSocket.classList.remove("statusConsumoSuficiente");
      statusSocket.classList.add("statusConsumoInsuficiente");
      document.querySelector(".statusSocket").textContent = "O processador e a placa-mãe utilizam sockets diferentes. Escolha componentes compatíveis.";
      return false
    }
  }
}


function verificarConsumo() {
  if (consumoCpu <= 0 || potenciaFonte <= 0 || consumoGpu <= 0 || consumoArmazenamento <= 0 || consumoPlacaMae <= 0 || consumoMemoriaRAM <= 0) {
    document.querySelector(".statusConsumo").textContent = "";
    statusConsumo.classList.remove("statusConsumoInsuficiente", "statusConsumoSuficiente");
    return false
  } else {
    totalConsumo = consumoCpu + consumoGpu + consumoMemoriaRAM + consumoPlacaMae + consumoArmazenamento;
    const consumoComMargem = totalConsumo * 1.25
    if (consumoComMargem > potenciaFonte) {
      statusConsumo.classList.remove("statusConsumoSuficiente");
      statusConsumo.classList.add("statusConsumoInsuficiente");
      document.querySelector(".statusConsumo").textContent = `Fonte possivelmente insuficiente! Consumo estimado com margem: ${Math.ceil(consumoComMargem)} W. Escolha uma fonte com potência maior que ${(consumoComMargem)} W`;
      return false;
    } else {
      statusConsumo.classList.remove("statusConsumoInsuficiente");
      statusConsumo.classList.add("statusConsumoSuficiente");
      document.querySelector(".statusConsumo").textContent = "Sua fonte aguenta os componentes escolhidos!"
      return true

    }
  }
}



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

function abrirTutorial() {
  if (localStorage.getItem("tutorialVisto") === "sim") {
    return;
  }
  tutorial.classList.add("tutorialAtivo")
  mostrarEtapaTutorial()

}

abrirTutorial();


function mostrarEtapaTutorial() {
  areasTutorial.forEach((area) => {
    area.classList.remove("destaqueTutorial");


  })


  const etapa = etapasTutorial[etapaTutorial];
  tutorial.querySelector(".tutorialCaixa").classList.toggle(
    "tutorialComponentes",
    etapa.classe === "tutorialComponentes"
  );

  if (etapa.area !== null) {
    etapa.area.classList.add("destaqueTutorial");
  }

  tituloTutorial.textContent = etapa.titulo;
  textoTutorial.textContent = etapa.texto;

  voltarTutorial.hidden = etapaTutorial === 0;

  avancarTutorial.textContent =
    etapaTutorial === etapasTutorial.length - 1
      ? "Concluir"
      : "Avançar";
}

function limparDestaquesTutorial() {
  areasTutorial.forEach((area) => {
    area.classList.remove("destaqueTutorial");
  });
}

if (avancarTutorial) {
  avancarTutorial.addEventListener("click", () => {
    if (etapaTutorial === etapasTutorial.length - 1) {
      localStorage.setItem("tutorialVisto", "sim");
      tutorial.classList.remove("tutorialAtivo");
      limparDestaquesTutorial();
    } else {
      etapaTutorial++;
      mostrarEtapaTutorial();
    }
  });
}
if (voltarTutorial){
  voltarTutorial.addEventListener("click", () => {
    if (etapaTutorial > 0) {
      etapaTutorial--;
      mostrarEtapaTutorial();
    }
  })
}

if (pularTutorial){
  pularTutorial.addEventListener("click", () => {
    localStorage.setItem("tutorialVisto", "sim")

    tutorial.classList.remove("tutorialAtivo")
    limparDestaquesTutorial();
  })
}



if(divComponentes){
  divComponentes.addEventListener("click", (e) => {
    const botaoAjuda = e.target.closest(".botaoAjuda")

    if (botaoAjuda) {
      modalAjuda.classList.add("ajudaAberta");
      botaoFechar.addEventListener("click", (e) => {
        modalAjuda.classList.remove("ajudaAberta");
      })
      const card = botaoAjuda.closest(".cardComponente");
      const componente = dadosCards.get(card);

      funcaoAjuda.textContent = componente.ajuda.funcao
      oQueObservarAjuda.textContent = componente.ajuda.oQueObservar
      dicasAjuda.textContent = componente.ajuda.dicas

      return;
    }

    const card = e.target.closest(".cardComponente");

    if (card) {
      const categoriaCard = card.dataset.categoria;
      const precoSelecionado = Number(card.dataset.preco);
      const nomePeca = card.querySelector(".nomeComponente");
      const socket = card.dataset.socket;
      const consumo = Number(card.dataset.consumo);
      const potencia = Number(card.dataset.potencia);

      if (categoriaCard === "cpu") {
        document.querySelector(".resumoCpu").textContent = nomePeca.textContent;

      } else if (categoriaCard === "gpu") {
        document.querySelector(".resumoGpu").textContent = nomePeca.textContent;

      } else if (categoriaCard === "placaMae") {
        document.querySelector(".resumoPlacaMae").textContent = nomePeca.textContent;

      } else if (categoriaCard === "memoriaRAM") {
        document.querySelector(".resumoRAM").textContent = nomePeca.textContent;

      } else if (categoriaCard === "armazenamento") {
        document.querySelector(".resumoArmazenamento").textContent = nomePeca.textContent;

      } else if (categoriaCard === "fonte") {
        document.querySelector(".resumoFonte").textContent = nomePeca.textContent;

      } else if (categoriaCard === "gabinete") {
        document.querySelector(".resumoGabinete").textContent = nomePeca.textContent;
      }

      if (categoriaCard === "cpu") {
        precoCpu = precoSelecionado;
        socketCpu = socket;
        consumoCpu = consumo;

      } else if (categoriaCard === "gpu") {
        precoGpu = precoSelecionado;
        consumoGpu = consumo;

      } else if (categoriaCard === "placaMae") {
        precoPlacaMae = precoSelecionado;
        socketPlacaMae = socket;
        consumoPlacaMae = consumo;

      } else if (categoriaCard === "memoriaRAM") {
        precoRAM = precoSelecionado;
        consumoMemoriaRAM = consumo;

      } else if (categoriaCard === "armazenamento") {
        precoArmazenamento = precoSelecionado;
        consumoArmazenamento = consumo;

      } else if (categoriaCard === "fonte") {
        precoFonte = precoSelecionado;
        potenciaFonte = potencia;

      } else if (categoriaCard === "gabinete") {
        precoGabinete = precoSelecionado;
      }
      calcularTotal();
      verificarSocket();
      verificarConsumo();

      divComponentes.querySelectorAll(".cardComponente").forEach(outroCard => {
        if (outroCard.dataset.categoria === categoriaCard) {
          outroCard.classList.remove("selecionado");
        }
      });

      card.classList.add("selecionado");
      componentes.forEach(componente => {
        const categoriaComponente = componente.dataset.categoria;

        if (categoriaComponente === categoriaCard) {
          const pecaEscolhida = componente.querySelector(".pecaEscolhida");
          if (pecaEscolhida) {
            pecaEscolhida.textContent = nomePeca.textContent;
          }

        }
      });
      atualizarProgresso();
      atualizarIconesResumo();
    }
  });
}


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
    const socketValido = verificarSocket();
    const consumoValido = verificarConsumo()
    if (consumoValido === false || socketValido === false) {
      mostrarSnackbar("Você escolheu componentes incompativeis. Troque os componentes para finalizar a montagem")

    }else{
      mostrarSnackbar("Montagem concluída com sucesso!");
    }

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

if (botaoFinalizar){
  botaoFinalizar.addEventListener("click", (e) => {
    verificarMontagem();
  })
}


if (continuarMontagem){
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
}



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

if (voltar){
  voltar.addEventListener("click", (e) => {
    if (etapaAtual > 0) {
      etapaAtual--;
      atualizarMontagem();
    }
  })
}


let listaComponente = [];

async function carregarComponentes() {

  try {
    const resposta = await fetch("./componentes.json");
    listaComponente = await resposta.json();

    console.log(listaComponente);
  } catch (error) {
    console.error("Erro ao carregar os componentes", error);
  }
}

carregarComponentes();


