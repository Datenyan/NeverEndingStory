let express = require("express");
var router = require("./router.js");
let app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('res'));
app.use("/", router);

app.listen("8080");
console.log("Server running at http://127.0.0.1:8080");