const lerJogos = async () => {
  try {
    const res = await fetch("/ler-jogos");
    if (!res.ok) throw new Error("Erro ao ler os jogos");

    const jogos = await res.json();
    console.log("Jogos armazenados:", jogos);

    return jogos;
  } catch (error) {
    console.error("Erro ao ler os jogos:", error);
  }
};

// Chamar a função para ler os jogos e exibi-los
const display = async () => {
  const main = document.getElementById("main");
  const jogos = await lerJogos(); // Lê os jogos armazenados

  if (jogos && jogos.length > 0) {
    jogos.forEach((infos) => {
      const containerHTML = `
          <div class="game">
            <div class="header">
              <img src="${infos.logoLiga}" alt="" width="25px" />
              <p>${infos.nomeLiga}</p>
            </div>
            <div class="conteudo">
              <div class="teams team-home">
                <img src="${infos.escudoHome}" width="70px" />
                <h3>${infos.nomeHome}</h3>
                <span class="team-home_odd">${infos.OddHome}</span>
              </div>
  
              <div class="score">
                <div class="placar">
                  <h1>${infos.placarHome || 0}</h1>
                  <h2>x</h2>
                  <h1>${infos.placarAway || 0}</h1>
                </div> 
                <div class="date">
                  <p class="elemento">${infos.status}</p>
                  <h4>${infos.status}</h4>
                </div>
              </div>
              
              <div class="teams team-away">
                <img src="${infos.escudoAway}" width="70px" />
                <h3>${infos.nomeAway}</h3>
                <span class="team-away_odd">${infos.OddAway}</span>
              </div>
            </div>
          </div>
        `;

      const container = document.createElement("div");
      container.innerHTML = containerHTML;
      main.appendChild(container.firstElementChild);
    });
  } else {
    main.innerHTML = "<p>Nenhum jogo encontrado.</p>"; // Mensagem caso não haja jogos
  }
};

// Chamar a função para exibir os jogos
display();
