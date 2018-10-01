//Require Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");


// initilize express
var app = express();

// Port 
var PORT = 3000;

// using Handlebars Models set view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Parse Request body as JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// connect to mongo Db
mongoose.connect("mongodb://localhost/Articles-mongo", { useNewUrlParser: true });

// Routes

// A get route for scrapping the newyork times website

app.get('/scrape', function(req, res) {
    axios.get('https://www.nytimes.com/section/technology').then(function(response) {

        var $ =cheerio.load(response.data);


        $("article.story").each(function(i , element) {

            var result = [];

            result.title = $(this)
            .find("h2.headline")
            .text();
            result.summary = $(this)
            .find("p.summary")
            .text();
            result.author = $(this)
            .find("p.byline")
            .text();
            result.image = $(this)
            .find("img")
            .attr("src");

            console.log(result.title);
            console.log(result.summary);
            console.log(result.author);
            console.log(result.image);
        });

    });
})
// app.get function for main display
app.get('/', function (req, res) {
    res.render('home');
});

// Start the server
app.listen(PORT, function(){
    console.log("App Running on Port " + PORT + "!");
});