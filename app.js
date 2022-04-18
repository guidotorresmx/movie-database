const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
const app = express();
const SERVER_PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

router.get("/", function (req, res) {
  res.render("index");
});

app.use("/", router);

app.listen(SERVER_PORT);
console.log(`Server is running on port ${SERVER_PORT}`);
