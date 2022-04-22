var express = require("express");
const { route } = require("express/lib/router");
var router = express.Router();
const mysql = require("mysql");
const args = require("minimist")(process.argv.slice(2));
const DB_PORT = args["db-port"] || 3306;

const connection = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  port: DB_PORT,
  database: "nodejs",
});

router.get("/", function (req, res) {
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

module.exports = router;
