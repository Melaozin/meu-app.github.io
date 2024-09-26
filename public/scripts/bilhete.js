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

// Função para calcular as apostas e exibir o painel de lucro
const calcularApostas = () => {
  const totalStake = parseFloat(document.getElementById("money").value);
  const jogos = document.querySelectorAll(".game");
  const infosLucroContainer = document.getElementById("infos-lucro");
  infosLucroContainer.innerHTML = ""; // Limpa o conteúdo anterior

  let totalApostado = 0;
  let lucros = [];
  let totalLucro = 0; // Novo total de lucros

  jogos.forEach((game) => {
    const oddHome = parseFloat(
      game.querySelector("span.team-home_odd").innerText
    );
    const oddAway = parseFloat(
      game.querySelector("span.team-away_odd").innerText
    );

    if (!isNaN(totalStake) && totalStake > 0) {
      let totalOdds = 1 / oddHome + 1 / oddAway;
      let stake1 = ((1 / oddHome) * (totalStake / totalOdds)).toFixed(2);
      let stake2 = ((1 / oddAway) * (totalStake / totalOdds)).toFixed(2);
      let lucro1 = (oddHome * stake1 - stake1).toFixed(2);
      let lucro2 = (oddAway * stake2 - stake2).toFixed(2);

      totalApostado += parseFloat(stake1) + parseFloat(stake2);
      totalLucro += parseFloat(lucro1) + parseFloat(lucro2); // Acumula lucros

      lucros.push({
        jogo: `${game.querySelector(".team-home h3").innerText} x ${
          game.querySelector(".team-away h3").innerText
        }`,
        lucro: lucro1,
      });
      lucros.push({
        jogo: `${game.querySelector(".team-away h3").innerText} x ${
          game.querySelector(".team-home h3").innerText
        }`,
        lucro: lucro2,
      });
    }
  });

  // Exibir o painel de lucro
  const lucroTotal = (totalStake - totalLucro) * -1; // Garantir que seja positivo
  const lucroHTML = `
    <h3>Lucro</h3>
    <ul>
      <p>Lucro Individual:</p>
      ${lucros
        .map((item) => `<li>${item.jogo} = R$ ${item.lucro}</li>`)
        .join("")}
    </ul>
    <p>Valor Total do Lucro: R$ ${totalLucro.toFixed(2)}</p>
    <p>Lucro Total: R$ ${lucroTotal.toFixed(2)}</p>
  `;

  infosLucroContainer.innerHTML = lucroHTML;

  // Exibir o total apostado
  const totalApostadoDiv = document.createElement("div");
  totalApostadoDiv.innerHTML = `<p>Valor Total Apostado: R$ ${totalApostado.toFixed(
    2
  )}</p>`;
  infosLucroContainer.appendChild(totalApostadoDiv);
};

// Função para exibir os jogos com cálculo automático das odds
function display(infos) {
  const main = document.getElementById("main");
  const placarDisplay =
    infos.placarHome === "N/A" || infos.placarAway === "N/A" ? "none" : "flex";

  // Criando os elementos do painel do jogo
  const gameElement = document.createElement("div");
  gameElement.classList.add("game");
  gameElement.dataset.id = infos.id;

  gameElement.innerHTML = `
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
          <p class="elemento"></p>
          <h4>${infos.status}</h4>
        </div>
        <span class="aposta-text">Aposta</span>
      </div>
      <div class="teams team-away">
        <img src="${infos.logoAway}" width="70px" />
        <h3>${infos.nomeAway}</h3>
        <span class="team-away_odd">${infos.oddAway}</span>
      </div>
    </div>
  `;

  // Adicionar evento de clique ao botão de excluir
  const deleteBtn = gameElement.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", () => {
    excluirJogo(infos.id, gameElement);
  });

  // Adicionar o painel do jogo ao elemento principal (main)
  main.appendChild(gameElement);
}

// Evento do botão de calcular apostas
const calcularBtn = document.getElementById("calcularBtn"); // Certifique-se de que este botão existe no HTML
calcularBtn.addEventListener("click", calcularApostas);

// Chamar a função para ler os jogos e exibi-los
lerJogos();
