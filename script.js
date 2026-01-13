const botao = document.getElementById("btnCalcular");
const transporteSelect = document.getElementById("transporte");
const distanciaInput = document.getElementById("distancia");
const resultadoDiv = document.querySelector(".resultado");
const listaHistorico = document.getElementById("listaHistorico");

const fatores = {
  moto: 0.1,
  carro: 0.2,
  onibus: 0.05
};

const nomes = {
  moto: "Moto",
  carro: "Carro",
  onibus: "Ônibus"
};

const absorcaoPorArvore = 21;
let historico = [];

function validarDados(transporte, distancia) {
  return !(transporte === "" || isNaN(distancia) || distancia <= 0);
}

function calcularEmissao(transporte, distancia) {
  return fatores[transporte] * distancia;
}

function calcularArvores(emissao) {
  return emissao / absorcaoPorArvore;
}

function definirNivel(emissao) {
  if (emissao < 2) {
    return { nivel: "Baixo impacto", cor: "#2ecc71", largura: "33%" };
  } else if (emissao < 5) {
    return { nivel: "Impacto médio", cor: "#f1c40f", largura: "66%" };
  } else {
    return { nivel: "Alto impacto", cor: "#e74c3c", largura: "100%" };
  }
}

function encontrarMelhorOpcao(distancia) {
  let melhor = null;
  let menorEmissao = Infinity;

  for (let meio in fatores) {
    const emissao = calcularEmissao(meio, distancia);
    if (emissao < menorEmissao) {
      menorEmissao = emissao;
      melhor = meio;
    }
  }

  return melhor;
}

function gerarComparacao(transporteAtual, distancia) {
  const emissaoAtual = calcularEmissao(transporteAtual, distancia);
  const melhorOpcao = encontrarMelhorOpcao(distancia);
  const emissaoMelhor = calcularEmissao(melhorOpcao, distancia);

  if (melhorOpcao === transporteAtual) {
    return `Você já escolheu a opção mais sustentável para essa distância. 🌱`;
  }

  const diferenca = ((emissaoAtual - emissaoMelhor) / emissaoAtual) * 100;

  return `Se você fosse de <strong>${nomes[melhorOpcao]}</strong>, poderia emitir aproximadamente <strong>${diferenca.toFixed(0)}%</strong> menos CO₂.`;
}

function mostrarLoading() {
  resultadoDiv.innerHTML = `<p class="loading">Calculando impacto...</p>`;
}

function mostrarErro() {
  resultadoDiv.innerHTML = `
    <p class="fade-in">⚠️ Preencha todos os campos corretamente.</p>
  `;
}

function salvarNoHistorico(transporte, distancia, emissao) {
  const item = {
    transporte,
    distancia,
    emissao: emissao.toFixed(2)
  };

  historico.unshift(item);

  if (historico.length > 5) {
    historico.pop();
  }

  renderizarHistorico();
}

function renderizarHistorico() {
  listaHistorico.innerHTML = "";

  historico.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${nomes[item.transporte]} • ${item.distancia} km</span>
      <strong>${item.emissao} kg</strong>
    `;
    listaHistorico.appendChild(li);
  });
}

function mostrarResultado(transporte, distancia, emissao, arvores, impacto, comparacao) {
  resultadoDiv.innerHTML = `
    <div class="fade-in">
      <p style="opacity: 0.7; font-size: 0.8rem;">Resultado da simulação</p>
      
      <p style="font-size: 2rem; font-weight: 700; margin: 8px 0;">
        ${emissao.toFixed(2)} kg
      </p>
      <p style="opacity: 0.8;">de CO₂ emitidos</p>

      <div class="barra-container">
        <div class="barra" style="background: ${impacto.cor}; width: ${impacto.largura};"></div>
      </div>

      <p style="margin-top: 8px;"><strong>${impacto.nivel}</strong></p>

      <p style="margin-top: 12px;">
        Transporte: ${nomes[transporte]}<br>
        Distância: ${distancia} km
      </p>

      <p style="margin-top: 10px; font-size: 0.85rem; opacity: 0.85;">
        🌳 Equivale ao que <strong>${arvores.toFixed(2)}</strong> árvores absorvem em um ano.
      </p>

      <div style="margin-top: 14px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 10px; font-size: 0.8rem;">
        💡 <strong>Sugestão:</strong><br>
        ${comparacao}
      </div>

      <p style="margin-top: 10px; font-size: 0.7rem; opacity: 0.6;">
        Valores estimados para fins educacionais.
      </p>
    </div>
  `;
}

botao.addEventListener("click", () => {
  const transporte = transporteSelect.value;
  const distancia = parseFloat(distanciaInput.value);

  if (!validarDados(transporte, distancia)) {
    mostrarErro();
    return;
  }

  botao.disabled = true;
  mostrarLoading();

  setTimeout(() => {
    const emissao = calcularEmissao(transporte, distancia);
    const arvores = calcularArvores(emissao);
    const impacto = definirNivel(emissao);
    const comparacao = gerarComparacao(transporte, distancia);

    mostrarResultado(transporte, distancia, emissao, arvores, impacto, comparacao);
    salvarNoHistorico(transporte, distancia, emissao);

    botao.disabled = false;
  }, 400);
});
