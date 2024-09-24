const express = require("express");
const path = require("path");

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

// Renderizar o CSS
app.use(express.static(path.join(__dirname, "public")));

// Iniciar o Servidor
app.listen(5000, () => {
  console.log("Servidor rodando na porta 3000.");
});
