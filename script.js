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
const formOrientacao = document.querySelector("#formOrientacao");
const objetivoPC = document.querySelector("#objetivoPC");
const orcamentoPC = document.querySelector("#orcamentoPC");
const orientacaoInicial = document.querySelector("#orientacaoInicial");
const montagemPC = document.querySelector(".montarPC");
const areaCategorias = document.querySelector(".divEsquerda");
const areaComponentes = document.querySelector(".divMeio");
const areaResumo = document.querySelector(".divDireita");
const areaBotoes = document.querySelector(".botoes");
const statusConsumo = document.querySelector(".statusConsumo");
const statusSocket = document.querySelector(".statusSocket");
const orcamentoExibido = document.querySelector(".orcamentoDefinido");
const progressoOrcamentoPreenchido = document.querySelector(".progressoOrcamentoPreenchido");
const statusOrcamento = document.querySelector(".statusOrcamento");
const orientacaoObjetivo = document.querySelector(".orientacaoObjetivo");
const resultadoMontagem = document.querySelector("#resultadoMontagem");
const statusCompatibilidade = document.querySelector("#statusCompatibilidade");
const totalResultado = document.querySelector("#totalResultado");
const orcamentoResultado = document.querySelector("#orcamentoResultado");
const resumoOrcamento = document.querySelector("#resumoOrcamento");
const fecharResultado = document.querySelector("#fecharResultado");


let objetivoEscolhido = "";
let orcamentoDefinido = 0;

if (formOrientacao) {
  formOrientacao.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const objetivo = objetivoPC.value;
    const orcamento = Number(orcamentoPC.value);

    if (!objetivo || !Number.isFinite(orcamento) || orcamento <= 0) {
      return;
    }

    objetivoEscolhido = objetivo;
    mostrarOrientacaoObjetivo();
    orcamentoDefinido = orcamento;
    atualizarRecomendacoes();

    calcularTotal();
    abrirTutorial();
    orcamentoExibido.textContent = orcamentoDefinido.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    orientacaoInicial.hidden = true;
    montagemPC.hidden = false;
  });
}

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

let cpuSelecionada = null;
let gpuSelecionada = null;
let ramSelecionada = null;
let armazenamentoSelecionado = null;


function mostrarOrientacaoObjetivo() {
  const orientacoes = {
    jogos: "Para jogos, priorize um conjunto equilibrado de processador e placa de vídeo.",
    estudos: "Para estudos e programação, priorize uma configuração equilibrada e memória suficiente para suas tarefas.",
    trabalho: "Para trabalho profissional, considere os programas que você utiliza e os requisitos deles.",
    geral: "Para uso geral, busque uma configuração equilibrada para suas atividades diárias."
  };

  orientacaoObjetivo.textContent =
    orientacoes[objetivoEscolhido] || "";
}


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

function atualizarRecomendacoes() {
  dadosCards.forEach((componente, card) => {
    const seloExistente = card.querySelector(".seloRecomendado");
    if (componente.objetivos && componente.objetivos.includes(objetivoEscolhido) && componente.preco <= orcamentoDefinido) {
      if (!seloExistente) {
        const selo = document.createElement("p");
        selo.classList.add("seloRecomendado");
        selo.textContent = "Recomendado para seu objetivo";
        card.appendChild(selo);
      }
    } else if (seloExistente) {
      seloExistente.remove();
    }
  });
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

  if (orcamentoDefinido > 0) {
    const percentual = (total / orcamentoDefinido) * 100;
    const percentualVisual = Math.min(percentual, 100);

    progressoOrcamentoPreenchido.style.width = `${percentualVisual}%`;

    if (total > orcamentoDefinido) {
      progressoOrcamentoPreenchido.style.backgroundColor = "#dc2626";
      statusOrcamento.textContent =
        `Você ultrapassou o orçamento em ${(total - orcamentoDefinido).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })}.`;
    } else {
      progressoOrcamentoPreenchido.style.backgroundColor = "#3768ff";
      statusOrcamento.textContent =
        `Você ainda tem ${(orcamentoDefinido - total).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        })} disponíveis.`;
    }
  }
}

function verificarSocket() {
  if (!socketPlacaMae || !socketCpu) {
    statusSocket.classList.remove("statusConsumoInsuficiente", "statusConsumoSuficiente");
    document.querySelector(".statusSocket").textContent = "";
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
      statusSocket.textContent =
        `Incompatibilidade: o processador utiliza o socket ${socketCpu}, ` +
        `mas a placa-mãe utiliza o socket ${socketPlacaMae}. ` +
        `Escolha componentes com sockets compatíveis.`;
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

    etapa.area.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
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
if (voltarTutorial) {
  voltarTutorial.addEventListener("click", () => {
    if (etapaTutorial > 0) {
      etapaTutorial--;
      mostrarEtapaTutorial();
    }
  })
}

if (pularTutorial) {
  pularTutorial.addEventListener("click", () => {
    localStorage.setItem("tutorialVisto", "sim")

    tutorial.classList.remove("tutorialAtivo")
    limparDestaquesTutorial();
  })
}


if (divComponentes) {
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
      const componenteSelecionado = dadosCards.get(card);
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
        cpuSelecionada = componenteSelecionado;

      } else if (categoriaCard === "gpu") {
        precoGpu = precoSelecionado;
        consumoGpu = consumo;
        gpuSelecionada = componenteSelecionado;

      } else if (categoriaCard === "placaMae") {
        precoPlacaMae = precoSelecionado;
        socketPlacaMae = socket;
        consumoPlacaMae = consumo;

      } else if (categoriaCard === "memoriaRAM") {
        precoRAM = precoSelecionado;
        consumoMemoriaRAM = consumo;
        ramSelecionada = componenteSelecionado;

      } else if (categoriaCard === "armazenamento") {
        precoArmazenamento = precoSelecionado;
        consumoArmazenamento = consumo;
        armazenamentoSelecionado = componenteSelecionado;

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



componentes.forEach(componente => {
  componente.addEventListener("click", (e) => {
    componentes.forEach(componente => {
      componente.classList.remove("selecionado");
    })

    componente.classList.add("selecionado");
    const categoria = componente.dataset.categoria;
    if (categoria === "cpu") {
      tituloEtapa.textContent = "Escolha seu processador";
      descricaoComponente.textContent = "Escolha um processador adequado ao seu orçamento e ao uso que pretende dar ao PC. Confira a compatibilidade com a placa-mãe."

    } else if (categoria === "gpu") {
      tituloEtapa.textContent = "Escolha sua placa de vídeo";
      descricaoComponente.textContent = "Escolha uma placa de vídeo de acordo com os jogos e programas que pretende utilizar, considerando seu orçamento."

    } else if (categoria === "placaMae") {
      tituloEtapa.textContent = "Escolha sua placa-mãe";
      descricaoComponente.textContent = "Verifique se a placa-mãe é compatível com o processador e com o tipo de memória RAM escolhido."

    } else if (categoria === "memoriaRAM") {
      tituloEtapa.textContent = "Escolha sua memória RAM";
      descricaoComponente.textContent = "Considere a capacidade de memória necessária para suas atividades e confira o tipo compatível com a placa-mãe."
    } else if (categoria === "armazenamento") {
      tituloEtapa.textContent = "Escolha seu armazenamento";
      descricaoComponente.textContent = "Escolha a capacidade e o tipo de armazenamento de acordo com seu espaço necessário e sua preferência por velocidade ou custo."

    } else if (categoria === "fonte") {
      tituloEtapa.textContent = "Escolha sua fonte";
      descricaoComponente.textContent = "	Escolha uma fonte de qualidade e com potência adequada ao consumo dos componentes do seu computador."

    } else if (categoria === "gabinete") {
      tituloEtapa.textContent = "Escolha seu gabinete";
      descricaoComponente.textContent = "Confira se o gabinete comporta as peças escolhidas e oferece espaço adequado para ventilação."
    }
    filtrarCategoria(categoria);
  })


})


function preencherResultado() {
  const total = precoCpu + precoGpu + precoPlacaMae +
    precoRAM + precoFonte + precoGabinete + precoArmazenamento;

  totalResultado.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  orcamentoResultado.textContent = orcamentoDefinido.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

  if (total <= orcamentoDefinido) {
    resumoOrcamento.textContent =
      `Você ficou ${(orcamentoDefinido - total).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })} abaixo do orçamento.`;
  } else {
    resumoOrcamento.textContent =
      `Você ultrapassou o orçamento em ${(total - orcamentoDefinido).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })}.`;
  }
}


function preencherEstatisticas() {
  const notaCpuJogos = cpuSelecionada?.pontuacao?.jogos ?? 0;
  const notaGpuJogos = gpuSelecionada?.pontuacao?.jogos ?? 0;
  const notaRamJogos = ramSelecionada?.pontuacao?.jogos ?? 0;

  const notaJogos = Math.round(
    notaCpuJogos * 0.25 +
    notaGpuJogos * 0.50 +
    notaRamJogos * 0.25
  );

  const notaCpuEstudos = cpuSelecionada?.pontuacao?.estudos ?? 0;
  const notaGpuEstudos = gpuSelecionada?.pontuacao?.estudos ?? 0;
  const notaRamEstudos = ramSelecionada?.pontuacao?.estudos ?? 0;
  const notaArmazenamentoEstudos =
    armazenamentoSelecionado?.pontuacao?.estudos ?? 0;

  const notaEstudos = Math.round(
    notaCpuEstudos * 0.40 +
    notaGpuEstudos * 0.10 +
    notaRamEstudos * 0.30 +
    notaArmazenamentoEstudos * 0.20
  );

  const notaCpuTrabalho = cpuSelecionada?.pontuacao?.trabalho ?? 0;
  const notaGpuTrabalho = gpuSelecionada?.pontuacao?.trabalho ?? 0;
  const notaRamTrabalho = ramSelecionada?.pontuacao?.trabalho ?? 0;
  const notaArmazenamentoTrabalho =
    armazenamentoSelecionado?.pontuacao?.trabalho ?? 0;

  const notaTrabalho = Math.round(
    notaCpuTrabalho * 0.40 +
    notaGpuTrabalho * 0.15 +
    notaRamTrabalho * 0.25 +
    notaArmazenamentoTrabalho * 0.20
  );

  document.querySelector("#valorJogos").textContent = `${notaJogos}%`;
  document.querySelector("#barraJogos").style.width = `${notaJogos}%`;

  document.querySelector("#valorEstudos").textContent = `${notaEstudos}%`;
  document.querySelector("#barraEstudos").style.width = `${notaEstudos}%`;

  document.querySelector("#valorTrabalho").textContent = `${notaTrabalho}%`;
  document.querySelector("#barraTrabalho").style.width = `${notaTrabalho}%`;
}


fecharResultado.addEventListener("click", () => {
  resultadoMontagem.hidden = true;
})


function verificarMontagem() {
  if (precoPlacaMae === 0 || precoArmazenamento === 0 || precoGabinete === 0 || precoGpu === 0 || precoFonte === 0 || precoRAM === 0 || precoCpu === 0) {
    mostrarSnackbar("Não foi possível finalizar: faltam peças.")
  } else {
    const socketValido = verificarSocket();
    const consumoValido = verificarConsumo()
    if (consumoValido === false || socketValido === false) {
      mostrarSnackbar("Você escolheu componentes incompativeis. Troque os componentes para finalizar a montagem")

    } else {
      preencherResultado();
      preencherEstatisticas();

      statusCompatibilidade.textContent =
        "Todos os componentes passaram pelas verificações de compatibilidade.";

      resultadoMontagem.hidden = false;
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

if (botaoFinalizar) {
  botaoFinalizar.addEventListener("click", (e) => {
    verificarMontagem();
  })
}


if (continuarMontagem) {
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

if (voltar) {
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


