let odd1;
let odd2;

function calcularDutching() {
  const totalStake = parseFloat(document.getElementById("totalStake").value);
  const odds = document.querySelectorAll(".odd");
  const resultados = document.getElementById("resultados");
  resultados.innerHTML = "";
  const lucro1 = document.getElementById("lucro1");
  const lucro2 = document.getElementById("lucro2");

  let totalOdds = 0;
  let stakePerSelection = [];

  odds.forEach((oddInput) => {
    const odd = parseFloat(oddInput.value);
    totalOdds += 1 / odd;
    stakePerSelection.push(1 / odd);

    odd1 = parseFloat(odds[0].value); // Armazena o valor da primeira odd na variável odd1.
    odd2 = parseFloat(odds[1].value); // Armazena o valor da segunda odd na variável odd2.
  });

  const stakeMultiplier = totalStake / totalOdds;

  stakePerSelection.forEach((stake, index) => {
    const stakeAmount = (stake * stakeMultiplier).toFixed(2);
    resultados.innerHTML += `<li>Time ${
      index + 1
    }: Valor que deve apostar R$ ${stakeAmount}</li>`;

    if (index === 0) {
      valor1 = stakeAmount;
    }
    if (index === 1) {
      valor2 = stakeAmount;
    }
  });
  const lucro_1 = (odd1 * valor1 - totalStake).toFixed(2);
  lucro1.innerHTML = `<li>Se o Time 1 ganhar:</li> <ol>Seu lucro será de: R$ ${lucro_1}</ol>`; // Mostrar o lucro
  const lucro_2 = (odd1 * valor1 - totalStake).toFixed(2);
  lucro2.innerHTML = `<li>Se o Time 2 ganhar:</li> <ol>Seu lucro será de: R$ ${lucro_2}</ol>`; // Mostrar o lucro
}
