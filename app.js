const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// Setar a extensão
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// Renderizar os arquivos
app.get("/", (req, res) => {
  res.render("partidas");
});
app.get("/bilhete", (req, res) => {
  res.render("bilhete");
});
app.get("/historico", (req, res) => {
  res.render("historico");
});

// Renderizar o CSS e JS
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // Para processar requisições com JSON

const filePath = path.join(__dirname, "jogos.json"); // Caminho do arquivo JSON

// Testes

// Endpoint para adicionar jogos ao JSON
app.post("/add-jogo", (req, res) => {
  const newJogo = req.body;

  // Verifica se o arquivo existe, se não, cria um novo arquivo
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).send("Erro ao ler o arquivo de jogos");
    }

    let jogos = [];

    // Se o arquivo existe, lê os jogos existentes
    if (data) {
      jogos = JSON.parse(data);
    }

    jogos.push(newJogo);

    // Salvar de volta no arquivo JSON
    fs.writeFile(filePath, JSON.stringify(jogos, null, 2), (err) => {
      if (err) {
        return res.status(500).send("Erro ao salvar o arquivo de jogos");
      }
      res.send("Jogo adicionado com sucesso");
    });
  });
});

// Endpoint para ler os jogos do JSON
app.get("/ler-jogos", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      return res.status(500).send("Erro ao ler o arquivo de jogos");
    }

    const jogos = data ? JSON.parse(data) : [];
    console.log(jogos); // Exibe os jogos no console do servidor
    res.json(jogos); // Retorna os jogos como resposta
  });
});

// Iniciar o Servidor
app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000.");
});
