var express = require("express");
const { route } = require("express/lib/router");
var router = express.Router();
const util = require("util");
const mysql = require("mysql");
const args = require("minimist")(process.argv.slice(2));
const DB_PORT = args["db-port"] || 3306;

//MULTER CONFIG: to get file photos to temp server storage

const connection = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  port: DB_PORT,
  database: "recipes",
});
function makeDb() {
  return {
    query(sql, args) {
      return util.promisify(connection.query).call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    },
  };
}

const db = makeDb();

router.get("/", function (req, res) {
  const queryString = "SELECT * FROM recipes";
  connection.query(queryString, (err, result) => {
    if (err) {
      console.error("Error while querying database");
    } else {
      res.render("index", { data: result });
    }
  });
});

router.get("/add-recipe", function (req, res) {
  res.render("add-recipe");
});

router.get("/recipe/:name", async function (req, res) {
  let data = { error: true };
  try {
    const recipeString = `SELECT * FROM recipes WHERE encoded_name = '${req.params.name}'`;
    let recipe = await db.query(recipeString);
    const ingredientsString = `SELECT * FROM ingredients WHERE recipe = '${req.params.name}'`;
    let ingredients = await db.query(ingredientsString);
    const stepsString = `SELECT * FROM steps WHERE recipe = '${req.params.name}'`;
    let steps = await db.query(stepsString);
    data = {
      recipe: recipe[0],
      ingredients: ingredients,
      steps: steps,
      error: false,
    };
  } catch (err) {
    console.error(err);
    console.error("Error while querying database");
    console.error(`Cannot retrieve recipe ${req.params.name}`);
  }
  console.log(data);
  res.render("recipe", { data: data });
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

router.post("/add-recipe-submiter", function (req, res) {
  console.log("data", req.body.name);
  const name = req.body.name;
  const queryString = `INSERT INTO colours (name) VALUES ('${name}')`;
  //connection.query(queryString);
  //res.writeHead(302, {
  //  Location: "/",
  //});
  res.send();
});

module.exports = router;
