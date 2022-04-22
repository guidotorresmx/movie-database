const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const { route } = require("express/lib/router");
const router = express.Router();
const app = express();
const SERVER_PORT = 3000;
const DATABASE_PORT = 3306;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  port: DATABASE_PORT,
  database: "nodejs",
});

router.get("/", function (req, res) {
  //const colors = [{ name: "red" }, { name: "blue" }, { name: "green" }];
  const queryString = "SELECT * FROM colours";
  connection.query(queryString, (err, result) => {
    if (err) {
      console.error("Error while querying database");
    } else {
      res.render("index", { data: result });
    }
  });
});

router.get("/add-colour", function (req, res) {
  res.render("add-colour");
});

router.get("/colour/:id", function (req, res) {
  const queryString = `SELECT * FROM colours WHERE id = ${req.params.id}`;
  connection.query(queryString, (err, result) => {
    if (err) {
      console.error("Error while querying database");
    } else {
      res.render("colour", { data: result[0] });
    }
  });
});

router.post("/update-colour", function (req, res) {
  const queryString = `UPDATE colours SET name = '${req.body.colourName}' WHERE id = '${req.body.id}'`;
  console.log(queryString);
  connection.query(queryString);
  res.writeHead(302, {
    Location: "/",
  });
  res.end();
});

router.post("/delete-colour", function (req, res) {
  const queryString = `DELETE FROM colours WHERE id = '${req.body.id}'`;
  console.log(queryString);
  connection.query(queryString);
  res.writeHead(204);
  res.end();
});

router.post("/add-colour-submit", function (req, res) {
  console.log("data", req.body.colourName);
  const name = req.body.colourName;
  const queryString = `INSERT INTO colours (name) VALUES ('${name}')`;
  connection.query(queryString);
  res.writeHead(302, {
    Location: "/",
  });
  res.end();
});

app.use("/", router);

app.listen(SERVER_PORT);
console.log(`Server is running on port ${SERVER_PORT}`);
