const fetchData = async (camp) => {
  try {
    const endPoint = `https://site.api.espn.com/apis/site/v2/sports/soccer/${camp}/scoreboard`;
    const res = await fetch(endPoint);
    if (!res.ok) throw new Error(`Failed to fetch data for ${camp}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return { events: [] }; // Retorna um objeto vazio se houver um erro
  }
};

function isToday(dateString) {
  const targetDate = new Date(dateString);
  const today = new Date();

  return (
    targetDate.getFullYear() === today.getFullYear() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getDate() === today.getDate()
  );
}

function mapJogos(data) {
  // Filtrando e mapeando cada evento em um objeto de jogo, apenas se a data for hoje
  const jogos = data.events
    .filter((event) => isToday(event.date))
    .map((event) => ({
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
}

const features = async () => {
  const data = [];
  const camp = [
    "uefa.euro",
    "conmebol.america",
    "fifa.friendly",
    "usa.1",
    "usa.nwsl",
    "mex.1",
    "uefa.champions_qual",
    "uefa.champions",
    "uefa.europa",
    "eng.1",
    "ita.1",
    "ger.1",
    "esp.1",
    "fra.1",
    "eng.2",
    "eng.league_cup",
    "eng.fa",
    "esp.copa_del_rey",
    "ita.coppa_italia",
    "ger.dfb_pokal",
    "fra.coupe_de_france",
    "mex.copa_mx",
    "concacaf.champions",
    "ned.1",
  ];

  for (let i = 0; i < camp.length; i++) {
    const element = camp[i];
    const result = await fetchData(element);
    const jogos = mapJogos(result);
    data.push(...jogos);
  }

  return data;
};

// Função que cria os quadros de jogos
const displayInfos = async () => {
  const main = document.getElementById("main");
  const jogos = await features(); // Obtem todos os jogos filtrados pela data de hoje

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
};

// Chame a função para exibir as informações
displayInfos();
