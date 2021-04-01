const fs = require("fs");
const https = require("https");

// Carrega o certificado e a key necessários para a configuração.
const options = {
  key: fs.readFileSync("server.key"),
  cert: fs.readFileSync("server.cert")
};

// Cria a instância do server e escuta na porta 3000
https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("Hello world using HTTPS!\n");
  })
  .listen(3000);


// Você pode testar com o curl: curl -k https://localhost:3000
// Retorno --> Hello world using HTTPS!
