// Função para ler os jogos e exibi-los na interface
const lerJogos = async () => {
  try {
    const res = await fetch("/ler-jogos");
    if (!res.ok) throw new Error("Erro ao ler os jogos");

    const jogos = await res.json();

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
  } catch (error) {
    console.error("Erro ao excluir o jogo:", error);
  }
};

// Função para calcular as apostas
function calcularApostas() {
  const totalStake = parseFloat(document.getElementById("money").value);
  const games = document.querySelectorAll(".game");
  const oddsArray = [];
  const jogosInfo = [];

  games.forEach((game) => {
    const oddHome = game.querySelector("span.team-home_odd").innerHTML;
    const oddAway = game.querySelector("span.team-away_odd").innerHTML;
    const jogo = `${game.querySelector(".team-home h3").innerHTML} x ${
      game.querySelector(".team-away h3").innerHTML
    }`;

    const stage2 = 1 / oddHome + 1 / oddAway;
    const stage1Home = totalStake / oddHome;
    const stage1Away = totalStake / oddAway;

    const ViHome = (stage1Home / stage2).toFixed(2);
    const ViAway = (stage1Away / stage2).toFixed(2);

    oddsArray.push(ViAway, ViHome);
    jogosInfo.push(jogo);
  });

  return [oddsArray, totalStake, jogosInfo, games];
}

// Função para exibir os jogos
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
        </div>

        <div class="score">
          <div class="placar" style="display: ${placarDisplay};">
            <h1>${infos.placarHome}</h1>
            <h2>x</h2>
            <h1>${infos.placarAway}</h1>
          </div> 
          <div class="date">
            <h4>${infos.status}</h4>
          </div>
        </div>
        
        <div class="teams team-away">
          <img src="${infos.logoAway}" width="70px" />
          <h3>${infos.nomeAway}</h3>
          <span class="team-away_odd">${infos.oddAway}</span>
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

const calcularBtn = document.querySelector("#calcularBtn");
calcularBtn.addEventListener("click", () => {
  const [odds, totalStake, jogosInfo, games] = calcularApostas();
  const painelLucro = document.getElementById("infos-lucro");

  const oddsHome = [];
  const oddsAway = [];

  games.forEach((game) => {
    const oddHome = game.querySelector("span.team-home_odd").innerHTML;
    oddsHome.push(oddHome);
  });
  games.forEach((game) => {
    const oddAway = game.querySelector("span.team-away_odd").innerHTML;
    oddsAway.push(oddAway);
  });

  // Create HTML for individual profits
  const apostaItems = jogosInfo
    .map((jogo, index) => {
      return `<li> (R$ ${odds[index * 2 + 1]}) ${jogo} (R$ ${
        odds[index * 2]
      }), </li>`;
    })
    .join("");

  // Criar HTML para lucros
  const lucroItems = jogosInfo
    .map((jogo, index) => {
      return `<li>(R$ ${(
        oddsHome[index] * odds[index * 2 + 1] -
        totalStake
      ).toFixed(2)}) ${jogo}  (R$ ${(
        oddsAway[index] * odds[index * 2] -
        totalStake
      ).toFixed(2)})</li>`;
    })
    .join("");

  const retornoItems = jogosInfo
    .map((jogo, index) => {
      return `<li>(R$ ${(oddsHome[index] * odds[index * 2 + 1]).toFixed(
        2
      )}) ${jogo}  (R$ ${(oddsAway[index] * odds[index * 2]).toFixed(2)})</li>`;
    })
    .join("");

  const lucroHtml = `
  <h3>Lucro</h3>
  <ul>
    <p>Aposta Individual:</p>
    ${apostaItems}
  </ul>
  <ul>
    <p>Possíveis retornos:</p>
    ${retornoItems}
  </ul>
  <ul>
    <p>Aposta Individual:</p>
    ${lucroItems}
  </ul>
  <ul>
    <p>Valor Apostado:</p>
    <li>R$ ${totalStake.toFixed(2)}</li>
  </ul>
  `;

  painelLucro.innerHTML = lucroHtml;
});

// Chamar a função para ler os jogos e exibi-los
lerJogos();
