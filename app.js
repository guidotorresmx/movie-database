const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const app = express();
const routes = require("./routes");
const ejsLayouts = require("express-ejs-layouts");

const args = require("minimist")(process.argv.slice(2));
const SERVER_PORT = args["server-port"] || 8080;

app.use(express.static("public"));
//app.use("/uploads", express.static("uploads"));

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.post("/profile", upload.single("avatar"), function (req, res, next) {
  console.log(req.file);
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
});
const cpUpload = upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "gallery", maxCount: 8 },
]);
app.post("/cool-profile", cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});

const server = app.listen(SERVER_PORT, function () {
  console.debug(`Server is running on port http://localhost:${SERVER_PORT}`);
});
