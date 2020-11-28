// Imports
let express = require("express");
let bodyParser = require("body-parser"); 
let flash = require("connect-flash"); // for flash messages 
let session = require('express-session'); // for flash messages
let dotEnv = require("dotenv");
const { exit } = require("process");
let app = express();

// Configure imports
dotEnv.config();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false})) 
app.use(express.static('res'));

// Set up session for flash messsages
app.use(session({
    secret: process.env.SECRETFLASHKEY,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Setup router for endpoints
var router = require("./router.js");
app.use("/", router); 

// Run the server 
app.listen("8080");
console.log("Server running at http://127.0.0.1:8080");