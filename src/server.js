const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db")


//configurar pasta publica
server.use(express.static("public"));

//Utilizando template engine
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

//configurando caminhos da minha aplicação
//página inicial
server.get("/", (req, res) => {
  return res.render("index.html");
});
server.get("/create-point", (req, res) => {
  return res.render("create-point.html");
});
server.get("/search", (req, res) => {
  //pegar os dados do banco de dados
  db.all(`SELECT * FROM places`, function (err, rows) {
    if (err) {
      console.log(err);
    }

    const total = rows.length;

    console.log("Aqui estão seus registros: ");
    console.log(rows);

      // mostrar a página html com os dados do banco de dados
    return res.render("search-results.html", { places: rows, total });
  });
}); 

server.post("/save-point", (req, res) => {
  const query = `
    INSERT INTO places (
      image,
      name,
      address,
      address2,
      state,
      city,
      items
    ) VALUES (?,?,?,?,?,?,?)
  `;
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items,
  ];

  function afterInsertData(error) {
    if (error) {
      console.log(error);
    }
    console.log("Cadastrado com sucesso!");
    console.log(this);

    return res.send("ok");
  }

  database.run(query, values, afterInsertData);

  return res.render("search-results.html");
});

//ligar o servidor
server.listen(3000);