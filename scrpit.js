const apiKey = "e80a75c9bc8c705218ece23052c94474";
const endPoint =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard";
const nflGames = document.getElementById("scoreboard");

const displayOdds = async () => {
  const res = await fetch(endPoint);
  const data = await res.json();

  const features = data.events[0].competitions;

  console.log(data);
};

displayOdds();

// Função que cria os quadros de jogos
const displayInfos = async () => {
  const main = document.getElementById("main");

  games.forEach((game) => {
    const containerHTML = `
        <div class="game">
          <span class="header">
            <img src="${game.leagueImg}" alt="" width="25px" />
            <p>${game.league}</p>
            <button>Add</button>
          </span>
  
          <div class="conteudo">
            <div class="teams team-home">
              <img src="${game.homeTeam.logo}" alt="" width="70px" />
              <h3>${game.homeTeam.name}</h3>
              <span class="team-home_odd">${game.homeTeam.odd.toFixed(2)}</span>
            </div>
  
            <div class="score">
              <span>
                <h1>${game.score[0]}</h1>
                <h1>-</h1>
                <h1>${game.score[1]}</h1>
              </span>
            </div>
            <div class="teams team-away">
              <img src="${game.awayTeam.logo}" alt="" width="70px" />
              <h3>${game.awayTeam.name}</h3>
              <span class="team-away_odd">${game.awayTeam.odd.toFixed(2)}</span>
            </div>
          </div>
        </div>
      `;

    // Convertendo a string HTML em um elemento DOM
    const container = document.createElement("div");
    container.innerHTML = containerHTML;

    // Adicionando o conteúdo ao elemento principal
    main.appendChild(container.firstElementChild);
  });
};

// Chame a função para exibir as informações
// displayInfos();
