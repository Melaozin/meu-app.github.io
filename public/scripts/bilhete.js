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
    jogos.forEach((infos) => display(infos));
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
  if (isNaN(totalStake) || totalStake <= 0) {
    alert("Por favor, insira um valor válido para o total de aposta.");
    return null; // Retorna null se totalStake for inválido
  }

  const x = document.querySelector("input[name=opcao]:checked").value; // Opção selecionada
  const games = document.querySelectorAll(".game");
  const stakePerGame = x === "1" ? totalStake / games.length : totalStake; // Stake por jogo

  const oddsArray = [];
  const jogosInfo = [];

  games.forEach((game) => {
    const oddHome = parseFloat(
      game.querySelector("span.team-home_odd").innerHTML
    );
    const oddAway = parseFloat(
      game.querySelector("span.team-away_odd").innerHTML
    );
    const jogo = `${game.querySelector(".team-home h3").innerHTML} x ${
      game.querySelector(".team-away h3").innerHTML
    }`;

    const stage2 = 1 / oddHome + 1 / oddAway;
    const stage1Home = stakePerGame / oddHome;
    const stage1Away = stakePerGame / oddAway;

    const ViHome = (stage1Home / stage2).toFixed(2);
    const ViAway = (stage1Away / stage2).toFixed(2);

    oddsArray.push(ViAway, ViHome);
    jogosInfo.push(jogo);
  });

  return { oddsArray, stakePerGame, totalStake, jogosInfo, games };
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

  main.appendChild(gameElement);
}

// Botão para calcular as apostas
const calcularBtn = document.querySelector("#calcularBtn");
calcularBtn.addEventListener("click", () => {
  const result = calcularApostas();
  if (!result) return; // Interrompe se o cálculo não foi realizado

  const { oddsArray, stakePerGame, totalStake, jogosInfo, games } = result;
  const painelLucro = document.getElementById("infos-lucro");
  const oddsHome = [];
  const oddsAway = [];

  games.forEach((game) => {
    oddsHome.push(
      parseFloat(game.querySelector("span.team-home_odd").innerHTML)
    );
    oddsAway.push(
      parseFloat(game.querySelector("span.team-away_odd").innerHTML)
    );
  });

  const apostaItems = jogosInfo
    .map(
      (jogo, index) =>
        `<li class="vApostar"> (R$ ${oddsArray[index * 2 + 1]}) ${jogo} (R$ ${
          oddsArray[index * 2]
        }), </li>`
    )
    .join("");

  const lucroItems = jogosInfo
    .map(
      (jogo, index) =>
        `<li class="lucro">(R$ ${(
          oddsHome[index] * oddsArray[index * 2 + 1] -
          stakePerGame
        ).toFixed(2)}) ${jogo}  (R$ ${(
          oddsAway[index] * oddsArray[index * 2] -
          stakePerGame
        ).toFixed(2)})</li>`
    )
    .join("");
  const retornoItems = jogosInfo
    .map(
      (jogo, index) =>
        `<li class="retorno">(R$ ${(
          oddsHome[index] * oddsArray[index * 2 + 1]
        ).toFixed(2)}) ${jogo}  (R$ ${(
          oddsAway[index] * oddsArray[index * 2]
        ).toFixed(2)})</li>`
    )
    .join("");

  painelLucro.innerHTML = `
    <h3>Lucro</h3>
    <ul><p>Aposta Individual:</p>${apostaItems}</ul>
    <ul><p>Possíveis retornos:</p>${retornoItems}</ul>
    <ul><p>Lucro Individual:</p>${lucroItems}</ul>
    <ul><p>Valor Apostado:</p><li>R$ ${totalStake.toFixed(2)}</li></ul>
  `;
});

// Botão para criar um novo bilhete
const criarBilheteBtn = document.getElementById("criarBilheteBtn");
criarBilheteBtn.addEventListener("click", async () => {
  const painelLucro = document.getElementById("infos-lucro");

  if (!painelLucro.innerHTML.trim()) {
    alert(
      "O painel de lucro está vazio. Calcule as apostas antes de criar o bilhete."
    );
    return;
  }

  const dataBilhete = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adiciona 0 à esquerda
    const day = String(today.getDate()).padStart(2, "0");
    return `${day}/${month}/${year}`;
  };

  // Captura os valores do painel de lucro
  const apostaItems = [...painelLucro.querySelectorAll("li.vApostar")].map(
    (item) => item.innerHTML
  );
  const lucroItems = [...painelLucro.querySelectorAll("li.lucro")].map(
    (item) => item.innerHTML
  );
  const retornoItems = [...painelLucro.querySelectorAll("li.retorno")].map(
    (item) => item.innerHTML
  );
  const valorApostado = painelLucro.querySelector("ul:last-child li").innerHTML; // Captura o valor apostado

  // Estruturar os dados do bilhete
  const bilheteData = {
    apostaItems,
    lucroItems,
    retornoItems,
    valorApostado,
    dataBilhete: dataBilhete(),
  };
  try {
    const res = await fetch("/criar-bilhete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bilheteData),
    });
    if (!res.ok) throw new Error("Erro ao criar bilhete");
  } catch (error) {
    console.error("Erro ao criar o bilhete", error);
  }
});

// Chamar a função para ler os jogos e exibi-los
lerJogos();
