const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const routes = require("./routes");
const ejsLayouts = require("express-ejs-layouts");

const args = require("minimist")(process.argv.slice(2));
const SERVER_PORT = args["server-port"] || 8080;

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

/**
 * Start server
 * All Routes are defined in routes.js
 * @param {number} port
 * @returns {Promise<void>}
 */
const server = app.listen(SERVER_PORT, function () {
  console.debug(`Server is running on port http://localhost:${SERVER_PORT}`);
  console.log("all routes defined in routes.js");
});
