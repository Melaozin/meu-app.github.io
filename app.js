const express = require("express");
const serverless = require("serverless-http");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // Usado para gerar IDs únicos

const app = express();

// Setar a extensão
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para JSON no express
app.use(express.json());

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

// Função para criar ou garantir que a pasta Bilhetes exista
const ensureBilhetesDirectory = () => {
  const dir = path.join(__dirname, "Bilhetes");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

// Função para gerar o nome do arquivo baseado no dia atual
const getFileNameForToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Adiciona 0 à esquerda
  const day = String(today.getDate()).padStart(2, "0");
  return `bilhete_${year}-${month}-${day}.json`;
};

// Rota para adicionar jogos ao JSON
app.post("/add-jogo", (req, res) => {
  ensureBilhetesDirectory();

  const fileName = getFileNameForToday();
  const filePath = path.join(__dirname, "Bilhetes", fileName);

  const novoJogo = { id: uuidv4(), ...req.body }; // Adiciona um ID único ao jogo

  // Verificar se o arquivo já existe
  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jogos = JSON.parse(fileContent);
    jogos.push(novoJogo);
    fs.writeFileSync(filePath, JSON.stringify(jogos, null, 2));
  } else {
    const jogos = [novoJogo];
    fs.writeFileSync(filePath, JSON.stringify(jogos, null, 2));
  }

  res
    .status(200)
    .json({ message: "Jogo adicionado com sucesso!", id: novoJogo.id });
});

// Rota para ler os jogos do arquivo do dia
app.get("/ler-jogos", (req, res) => {
  const fileName = getFileNameForToday();
  const filePath = path.join(__dirname, "Bilhetes", fileName);

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const jogos = JSON.parse(fileContent);
    res.json(jogos);
  } else {
    res.status(404).json({ message: "Nenhum jogo encontrado para hoje." });
  }
});

// Rota para excluir um jogo pelo ID
app.delete("/delete-jogo/:id", (req, res) => {
  ensureBilhetesDirectory();

  const fileName = getFileNameForToday();
  const filePath = path.join(__dirname, "Bilhetes", fileName);
  const { id } = req.params;

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let jogos = JSON.parse(fileContent);
    jogos = jogos.filter((jogo) => jogo.id !== id);
    fs.writeFileSync(filePath, JSON.stringify(jogos, null, 2));
    res.status(200).json({ message: "Jogo excluído com sucesso!" });
  } else {
    res.status(404).json({ message: "Arquivo não encontrado." });
  }
});

// Exporte o app para uso no Netlify
module.exports.handler = serverless(app);
