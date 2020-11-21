// Imports
let express = require("express");
let bodyParser = require("body-parser"); 
let flash = require("connect-flash"); // for flash messages 
let session = require('express-session'); // for flash messages
const { exit } = require("process");
let app = express();

// Check args for secret key
let args = process.argv.slice(2);
if (args.length < 1) {
    console.log("You must provide a secret key for flash-messages!")
    exit(1);
} else {
    var secretFlashKey = '' + args[1]; // ensure that the string is considered a json value rather than a string
}

// Set up session for flash messsages
app.use(session({
    secret: secretFlashKey,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Configure imports
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({extended: false})) 
app.use(express.static('res'));

// Setup router for endpoints
var router = require("./router.js");
app.use("/", router); 

// Run the server 
app.listen("8080");
console.log("Server running at http://127.0.0.1:8080");