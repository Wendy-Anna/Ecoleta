const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db")


//configurar pasta publica
server.use(express.static("public"));

//habilitar o uso do req.body na nossa aplicação
server.use(express.urlencoded({ extended: true }));

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

  const search = req.query.search;

  if (search === "") {
    return res.render("search-results.html", { total: 0 });
  }

  //pegar os dados do banco de dados
  db.all(
    `SELECT * FROM places  WHERE city LIKE '${search}%'  `,
    function (err, rows) {
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

server.post("/savepoint", (req, res) => {
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
      return res.render("create-point.html", { error: true });
    }
    console.log("Cadastrado com sucesso!");
    console.log(this);

    return res.render("create-point.html", { saved: true });
  }

  db.run(query, values, afterInsertData);

});

//ligar o servidor
server.listen(3000);