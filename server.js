//Require Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var axios = require("axios");
//var cheerio = require("cheerio");


// initilize express
var app = express();

// Port 
var PORT = 3000;

// using Handlebars Models set view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Parse Request body as JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// connect to mongo Db
mongoose.connect("mongodb://localhost/Articles-mongo", { useNewUrlParser: true });

// app.get function for main display
app.get('/', function (req, res) {
    res.render('home');
});

// Start the server
app.listen(PORT, function(){
    console.log("App Running on Port " + PORT + "!");
});