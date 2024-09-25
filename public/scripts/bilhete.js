// Função para ler os jogos e exibi-los na interface
const lerJogos = async () => {
  try {
    const res = await fetch("/ler-jogos");
    if (!res.ok) throw new Error("Erro ao ler os jogos");

    const jogos = await res.json();
    console.log("Jogos armazenados:", jogos);

    // Limpar a interface antes de exibir os novos jogos
    const main = document.getElementById("main");
    main.innerHTML = "";

    // Exibir os jogos na interface
    jogos.forEach((infos) => {
      display(infos);
    });
  } catch (error) {
    console.error("Erro ao ler os jogos:", error);
  }
};

// Função para excluir o jogo
const excluirJogo = async (id, container) => {
  try {
    const res = await fetch(`/delete-jogo/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erro ao excluir o jogo");

    // Remove o painel do jogo da interface
    container.remove();
    console.log("Jogo excluído com sucesso!");
  } catch (error) {
    console.error("Erro ao excluir o jogo:", error);
  }
};

// Função para calcular as apostas
const calcularApostas = () => {
  const totalStake = parseFloat(document.getElementById("money").value);
  const jogos = document.querySelectorAll(".game");

  jogos.forEach((game) => {
    const oddHome = parseFloat(game.querySelector(".team-home_odd").innerText);
    const oddAway = parseFloat(game.querySelector(".team-away_odd").innerText);

    // Cálculo automático do valor a ser apostado usando o Dutching, apenas se totalStake for válido
    let stake1 = "";
    let stake2 = "";
    let lucro1 = "";
    let lucro2 = "";

    if (!isNaN(totalStake) && totalStake > 0) {
      const totalOdds = 1 / oddHome + 1 / oddAway;
      stake1 = ((1 / oddHome) * (totalStake / totalOdds)).toFixed(2);
      stake2 = ((1 / oddAway) * (totalStake / totalOdds)).toFixed(2);
      lucro1 = (oddHome * stake1 - totalStake).toFixed(2);
      lucro2 = (oddAway * stake2 - totalStake).toFixed(2);
    }

    // Atualiza a interface com os novos valores
    game.querySelector(".retorno").innerText = stake1 ? `R$ ${stake1}` : "—";
    game.querySelector(".lucro").innerText = lucro1
      ? `Lucro: R$ ${lucro1}`
      : "";
    game.querySelector(".valApostar").innerText = stake2 ? `R$ ${stake2}` : "—";
    game.querySelectorAll(".lucro")[1].innerText = lucro2
      ? `Lucro: R$ ${lucro2}`
      : "";
  });
};

// Função para exibir os jogos com cálculo automático das odds
function display(infos) {
  const main = document.getElementById("main");
  const placarDisplay =
    infos.placarHome === "N/A" || infos.placarAway === "N/A" ? "none" : "flex";

  // Criando o HTML do painel do jogo
  const containerHTML = `
    <div class="game" data-id="${infos.id}">
      <div class="header">
        <img src="${infos.ligaLogo}" alt="" width="25px" />
        <p>${infos.liga}</p>
        <button class="delete-btn">Excluir</button>
      </div>
      <div class="conteudo">
        <div class="teams team-home">
          <img src="${infos.logoHome}" width="70px" />
          <h3>${infos.nomeHome}</h3>
          <span class="team-home_odd">${infos.oddHome}</span>
          <hr />
          <span class="retorno">—</span> <!-- Mostrar valor calculado ou traço -->
          <span class="lucro">—</span> <!-- Mostrar lucro ou nada -->
        </div>

        <div class="score">
          <div class="placar" style="display: ${placarDisplay};">
            <h1>${infos.placarHome}</h1>
            <h2>x</h2>
            <h1>${infos.placarAway}</h1>
          </div> 
          <div class="date">
            <p class="elemento"></p>
            <h4>${infos.status}</h4>
          </div>
          <span class="aposta-text">Aposta</span> 
        </div>
        
        <div class="teams team-away">
          <img src="${infos.logoAway}" width="70px" />
          <h3>${infos.nomeAway}</h3>
          <span class="team-away_odd">${infos.oddAway}</span>
          <hr />
          <span class="valApostar">—</span> <!-- Mostrar valor calculado ou traço -->
          <span class="lucro">—</span> <!-- Mostrar lucro ou nada -->
        </div>
      </div>
    </div>
  `;

  const container = document.createElement("div");
  container.innerHTML = containerHTML;
  const gameElement = container.firstElementChild;

  // Adicionar evento de clique ao botão de excluir
  const deleteBtn = gameElement.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    excluirJogo(infos.id, gameElement);
  });

  // Adicionar o painel do jogo ao elemento principal (main)
  main.appendChild(gameElement);
}

// Evento do botão de calcular apostas
const calcularBtn = document.getElementById("calcular-btn"); // Certifique-se de que este botão existe no HTML
calcularBtn.addEventListener("click", calcularApostas);

// Chamar a função para ler os jogos e exibi-los
lerJogos();
