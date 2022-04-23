var express = require("express");
const { route } = require("express/lib/router");
const multer = require("multer");
var router = express.Router();
const util = require("util");
const mysql = require("mysql");
const args = require("minimist")(process.argv.slice(2));

/**
 * db connection port
 */
const DB_PORT = args["db-port"] || 3306;

/**
 * save to disk configuration
 */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

/**
 * mysql basic connection
 */
const connection = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  port: DB_PORT,
  database: "recipes",
});

/**
 * mysql connection async interface
 * @returns {Promise<void>}
 */
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

/**
 * GET /
 * Home page.
 * @param {object} req
 * @param {object} res
 */
router.get("/", function (req, res) {
  console.log("GET /");
  const queryString = "SELECT * FROM recipes";
  connection.query(queryString, (err, recipes) => {
    if (err) {
      console.error("Error while querying database");
    } else {
      res.render("index", { data: recipes });
    }
  });
});

/**
 * GET /add-recipe
 * Add recipes page.
 * @param {object} req
 * @param {object} res
 */
router.get("/add-recipe", function (req, res) {
  console.log("GET /add-recipe");
  res.render("add-recipe");
});

/**
 * GET /recipe/:name
 * Retrieve recipe page.
 * Consults 3 tables: recipes, steps, ingredients
 * @param {object} req
 * @param {object} res
 */
router.get("/recipe/:name", async function (req, res) {
  console.log("GET /recipe/:name");
  let data = { error: true };
  try {
    // get recipe name
    const recipeString = `SELECT * FROM recipes WHERE encoded_name = '${req.params.name}'`;
    let recipe = await db.query(recipeString);

    // get ingredients
    const ingredientsString = `SELECT * FROM ingredients WHERE recipe = '${req.params.name}'`;
    let ingredients = await db.query(ingredientsString);

    // get steps
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
  res.render("recipe", { data: data });
});

/**
 * POST /delete-recipe
 * Delete recipe with name in body.id.
 * Consults 3 tables: recipes, steps, ingredients
 * @param {object} req
 * @param {object} res
 */
router.post("/delete-recipe", async function (req, res) {
  console.log("POST /delete-recipe");

  // get recipe name
  const recipeString = `DELETE FROM recipes WHERE encoded_name = '${req.body.id}'`;
  let recipe = await db.query(recipeString);

  // get ingredients
  const ingredientsString = `DELETE FROM ingredients WHERE recipe='${req.body.id}'`;
  let ingredients = await db.query(ingredientsString);

  // get steps
  const stepsString = `DELETE FROM steps WHERE recipe='${req.body.id}'`;
  let steps = await db.query(stepsString);
  res.writeHead(204);
  res.end();
});

/**
 * Converts string to encoded name with no spaces
 * @param {string} name
 * @returns {string}
 */
function encode(name) {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

/**
 * POST /recipe/:name
 * Add recipe submit endpoint. Expects name, ingredients, steps, and image.
 * Consults 3 tables: recipes, steps, ingredients
 * This tookme a while to figure out. and involves trickery with multer. and forms. and cloning elements. *
 * @param {object} req
 * @param {object} res
 */
router.post(
  "/add-recipe-submit",
  upload.single("photo"),
  async function (req, res, next) {
    console.log("POST /add-recipe-submit");
    try {
      // set recipe name
      const encoded_name = encode(req.body.name);
      const recipeString =
        `INSERT INTO recipes` +
        `(name, encoded_name, descr, filename) VALUES ` +
        `('${req.body.name}', '${encoded_name}', '${req.body.description}', '${req.file.originalname}')`;
      let recipe = await db.query(recipeString);

      // set ingredients
      await req.body.Ingredients.forEach((ingredient) => {
        const encoded_ingr = encode(ingredient);
        const ingredientsString =
          `INSERT INTO ingredients` +
          `(recipe, name, encoded_name) VALUES ` +
          `('${encoded_name}', '${ingredient}', '${encoded_ingr}')`;
        let ingredients = db.query(ingredientsString);
      });

      // set steps
      await req.body.Steps.forEach((step) => {
        const encoded_ingr = encode(step);
        const stepsString =
          `INSERT INTO steps` +
          `(recipe, name, encoded_name) VALUES ` +
          `('${encoded_name}', '${step}', '${encoded_ingr}')`;
        let steps = db.query(stepsString);
      });
    } catch (err) {
      console.error(err);
      console.error("Error while querying database");
      console.error(`Please add an image`);
      res.writeHead(204);
      res.end();
    }
    res.writeHead(302, {
      Location: "/",
    });
    res.send();
  }
);

module.exports = router;
