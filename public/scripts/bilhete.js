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

// Chamar a função para ler os jogos e exibi-los
lerJogos();
