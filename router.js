var express = require('express');
var router = express.Router();

var index = router.get('/', function(req, res) {
    res.send('The webserver is working!');
});

module.exports = router;