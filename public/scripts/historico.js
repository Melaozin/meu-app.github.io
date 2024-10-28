const lerBilhetes = async () => {
  try {
    const res = await fetch("/ler-historico");
    if (!res.ok) throw new Error("Erro ao ler os jogos");

    const bilhetes = await res.json();
    console.log(bilhetes);
    await displayHistorico(bilhetes);
  } catch (error) {
    console.error("Erro ao ler os bilhetes:", error);
  }
};

function displayHistorico(bilhetes) {
  const el = document.querySelector("#historico");
  el.innerHTML = ""; // Limpa o conteúdo anterior antes de adicionar novos bilhetes

  bilhetes.forEach((data) => {
    const container = document.createElement("div");

    // Mapeia os itens de aposta, possíveis retornos e lucros individuais em elementos HTML
    const apostaItemsHtml = data.apostaItems
      .map((e) => `<li>${e}</li>`)
      .join("");
    const lucroItemsHtml = data.lucroItems.map((e) => `<li>${e}</li>`).join("");
    const retornoItemsHtml = data.retornoItems
      .map((e) => `<li>${e}</li>`)
      .join("");

    container.innerHTML = `
      <details>
        <summary>${data.dataBilhete}</summary>
        <ul><p>Aposta Individual:</p>${apostaItemsHtml}</ul>
        <ul><p>Possíveis retornos:</p>${lucroItemsHtml}</ul>
        <ul><p>Lucro Individual:</p>${retornoItemsHtml}</ul>
        <ul><p>Valor Apostado:</p><li>${data.valorApostado}</li></ul>
      </details>
    `;

    el.appendChild(container); // Adiciona cada contêiner ao elemento alvo
  });
}

// Exemplo de chamada da função, assumindo que você tenha o endpoint configurado
lerBilhetes();
