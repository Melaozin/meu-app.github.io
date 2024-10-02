const serverless = require("serverless-http");
const app = require("../../app.js"); // Ajuste o caminho se necessário
module.exports.handler = serverless(app);
