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

// Filtrando e mapeando cada evento em um objeto de jogo, apenas se a data for hoje
function mapJogos(data) {
  // console.log("Data: ", data);
  const jogos = data.events
    .filter((event) => isToday(event.date))
    .map((event) => ({
      OddHome:
        event.competitions[0].odds && event.competitions[0].odds[0].homeTeamOdds
          ? event.competitions[0].odds[0].homeTeamOdds.summary
          : "N/A",
      OddAway:
        event.competitions[0].odds && event.competitions[0].odds[0].awayTeamOdds
          ? event.competitions[0].odds[0].awayTeamOdds.summary
          : "N/A",
      nomeHome: event.competitions[0].competitors[0].team.shortDisplayName,
      nomeAway: event.competitions[0].competitors[1].team.shortDisplayName,
      escudoHome: event.competitions[0].competitors[0].team.logo,
      escudoAway: event.competitions[0].competitors[1].team.logo,
      logoLiga: data.leagues[0].logos[0].href,
      nomeLiga: data.leagues[0].name,
      status:
        new Date(event.date) < new Date()
          ? "Finalizado"
          : new Date(event.date).toLocaleString(),
      placarHome:
        new Date(event.date) <= new Date()
          ? event.competitions[0].competitors[0].score
          : "N/A",
      placarAway:
        new Date(event.date) <= new Date()
          ? event.competitions[0].competitors[1].score
          : "N/A",
      statusCode: event.competitions[0].status.clock,
      statusDisplayClock: event.competitions[0].status.displayClock,
      statusType: event.competitions[0].status.type.description,
    }));
  return jogos;
}

const features = async () => {
  const data = [];
  const camp = [
    // "uefa.euro",
    // "conmebol.america",
    // "fifa.friendly",
    // "usa.1",
    // "bra.1",
    // "bra.2",
    // "usa.nwsl",
    // "mex.1",
    // "uefa.champions_qual",
    // "uefa.champions",
    // "uefa.europa",
    // "eng.1",
    "ita.1",
    // "ger.1",
    // "esp.1",
    // "fra.1",
    // "eng.2",
    // "eng.league_cup",
    // "eng.fa",
    // "esp.copa_del_rey",
    // "ita.coppa_italia",
    // "ger.dfb_pokal",
    // "fra.coupe_de_france",
    // "mex.copa_mx",
    // "concacaf.champions",
    // "ned.1",
  ];

  for (let i = 0; i < camp.length; i++) {
    const element = camp[i];
    const result = await fetchData(element);
    const jogos = mapJogos(result);
    data.push(...jogos);
    //console.log(`Jogos de hoje em ${element}:`, jogos);
  }

  return data;
};

// Função que cria os quadros de jogos
const displayInfos = async () => {
  const main = document.getElementById("main");
  const jogos = await features();

  jogos.forEach((infos) => {
    const [numeratorHome, denominatorHome] =
      infos.OddHome !== "N/A" ? infos.OddHome.split("/").map(Number) : [0, 1];
    const [numeratorAway, denominatorAway] =
      infos.OddAway !== "N/A" ? infos.OddAway.split("/").map(Number) : [0, 1];

    const oddHomeInt = numeratorHome / denominatorHome + 1;
    const oddAwayInt = numeratorAway / denominatorAway + 1;

    const oddHomeDisplay = infos.OddHome !== "N/A" ? oddHomeInt.toFixed(2) : "";
    const oddAwayDisplay = infos.OddAway !== "N/A" ? oddAwayInt.toFixed(2) : "";

    const placarDisplay =
      infos.placarHome === "N/A" || infos.placarAway === "N/A"
        ? "none"
        : "flex";

    const statusJogo =
      infos.statusType === "Full Time"
        ? infos.status
        : infos.statusType == "Scheduled"
        ? ""
        : infos.statusType == "Half Time"
        ? "Intervalo"
        : infos.statusType == "First Time"
        ? "Primeiro Tempo"
        : infos.statusType == "Second Time"
        ? "Segundo Tempo"
        : "";

    const statusTime =
      infos.statusCode > 1 && infos.statusCode < 5400
        ? infos.statusDisplayClock
        : infos.status;

    const isOddsAvailable = infos.OddHome !== "N/A" && infos.OddAway !== "N/A";

    const containerHTML = `
      <div class="game">
        <div class="header">
          <img src="${infos.logoLiga}" alt="" width="25px" />
          <p>${infos.nomeLiga}</p>
          <button class="add" ${isOddsAvailable ? "" : "disabled"}>Add</button>
        </div>
        <div class="conteudo">
          <div class="teams team-home">
            <img src="${infos.escudoHome}" width="70px" />
            <h3>${infos.nomeHome}</h3>
            <span class="team-home_odd">${oddHomeDisplay}</span>
          </div>

          <div class="score">
            <div class="placar" style="display: ${placarDisplay};">
              <h1>${infos.placarHome}</h1>
              <h2>x</h2>
              <h1>${infos.placarAway}</h1>
            </div> 
            <div class="date">
            <p class="elemento">${statusTime}</p>
            <h4>${statusJogo}</h4>
            </div>
          </div>
          
          <div class="teams team-away">
          <img src="${infos.escudoAway}" width="70px" />
          <h3>${infos.nomeAway}</h3>
          <span class="team-away_odd">${oddAwayDisplay}</span>
          </div>
          </div>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = containerHTML;

    main.appendChild(container.firstElementChild);
  });

  // Adicionando evento de clique para todos os botões "Add"
  const buttons = document.querySelectorAll(".add");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const base = e.srcElement.attributes;

      button.disabled = true;
      button.innerText = "Adicionado";

      const infosJson = {
        containerJogo: base[0].ownerElement.offsetParent.offsetParent,
      };
      addJogo(infosJson);
      console.log(array);
    });
  });
};

let array = [];

export const addJogo = (jogo) => {
  array.push(jogo);
};

export const getJogosAdicionados = () => {
  return [...array]; // Retorna uma cópia do array
};

// Chame a função para exibir as informações
displayInfos();
