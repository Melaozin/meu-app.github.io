const endPoint =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard";
const nflGames = document.getElementById("scoreboard");

const displayOdds = async () => {
  const res = await fetch(endPoint);
  const data = await res.json();

  // Mapeando cada evento em um objeto de jogo
  const jogos = data.events.map((event) => ({
    Data: event.date,
    OddHome: event.competitions[0].odds[0].homeTeamOdds.summary,
    OddAway: event.competitions[0].odds[0].awayTeamOdds.summary,
    nomeHome: event.competitions[0].competitors[0].team.shortDisplayName,
    nomeAway: event.competitions[0].competitors[1].team.shortDisplayName,
    escudoHome: event.competitions[0].competitors[0].team.logo,
    escudoAway: event.competitions[0].competitors[1].team.logo,
    logoLiga: data.leagues[0].logos[0].href,
    nomeLiga: data.leagues[0].name,
  }));

  return jogos;
};

// Função que cria os quadros de jogos
const displayInfos = async () => {
  const main = document.getElementById("main");
  const jogos = await displayOdds();

  jogos.forEach((infos) => {
    // Convertendo odds de fração para número
    const [numeratorHome, denominatorHome] =
      infos.OddHome.split("/").map(Number);
    const [numeratorAway, denominatorAway] =
      infos.OddAway.split("/").map(Number);

    const oddHomeInt = numeratorHome / denominatorHome + 1;
    const oddAwayInt = numeratorAway / denominatorAway + 1;

    const containerHTML = `
      <div class="game">
        <div class="header">
          <img src="${infos.logoLiga}" alt="" width="25px" />
          <p>${infos.nomeLiga}</p>
          <button class="add">Add</button>
        </div>

        <div class="conteudo">
          <div class="teams team-home">
            <img src="${infos.escudoHome}" width="70px" />
            <h3>${infos.nomeHome}</h3>
            <span class="team-home_odd">${oddHomeInt.toFixed(2)}</span>
          </div>

          <div class="score">
            <div class="disable>
              <h1></h1>
              <h1>-</h1>
              <h1></h1>
            </div>
          </div>
          <div class="date">${new Date(infos.Data).toLocaleString()}</div>
        </div>
        
        <div class="teams team-away">
          <img src="${infos.escudoAway}" width="70px" />
          <h3>${infos.nomeAway}</h3>
          <span class="team-away_odd">${oddAwayInt.toFixed(2)}</span>
        </div>
      </div>
    `;

    // Convertendo a string HTML em um elemento DOM
    const container = document.createElement("div");
    container.innerHTML = containerHTML;

    // Adicionando o conteúdo ao elemento principal
    main.appendChild(container.firstElementChild);
  });
  // Adicionando evento de clique para todos os botões "Add"
  document.querySelectorAll(".add").forEach((button) => {
    button.addEventListener("click", (e) => {
      // Selecionando o elemento pai mais próximo com a classe "game"
      const gameElement = e.target.closest(".game");

      // Capturando as informações do quadro
      const gameInfo = {
        nomeLiga: gameElement.querySelector(".header p").textContent,
        nomeHome: gameElement.querySelector(".team-home h3").textContent,
        nomeAway: gameElement.querySelector(".team-away h3").textContent,
        oddHome: parseFloat(
          gameElement.querySelector(".team-home_odd").textContent
        ),
        oddAway: parseFloat(
          gameElement.querySelector(".team-away_odd").textContent
        ),
        dataJogo: gameElement.querySelector(".date").textContent,
      };

      console.log("Informações do jogo adicionadas:", gameInfo);
      // Aqui você pode fazer o que precisar com o objeto gameInfo
    });
  });
};

// Chame a função para exibir as informações
displayInfos();
