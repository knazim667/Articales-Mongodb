//Require Dependencies
var express = require("express");
//var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// initilize express
var app = express();

// Port 
var PORT = 3000;

//use morgan for logging request
app.use(logger("dev"));

// using Handlebars Models set view engine
//app.engine('handlebars', exphbs({defaultLayout: 'main'}));
//app.set('view engine', 'handlebars');
app.use(express.static("public"));

//Parse Request body as JSON
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

// connect to mongo Db
mongoose.connect("mongodb://localhost/Articles-mongo", { useNewUrlParser: true });

// Routes

// A get route for scrapping the newyork times website

app.get('/scrape', function(req, res) {
    axios.get('https://www.nytimes.com/section/technology').then(function(response) {

        var $ = cheerio.load(response.data);


        $("article.story").each(function(i , element) {

            var result = {};

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

            console.log(result);
            
            
            // create a new Article using  using the result object build from scrapping
            db.News.create(result)
            .then(function(data){
                // View the added result in console log
                console.log(data);
            })
            .catch(function(err) {
                // if error occured it to a client
                return res.json(err);
            });
        });
        // if we are able to successfully scrape and save an Article, send message to a client
        res.send("Scrape Complete");
    });
});

// Route for all News from the db
app.get('/news', function (req, res) {
    //Grab every documents in the news collection
    db.News.find({})
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Start the server
app.listen(PORT, function(){
    console.log("App Running on Port " + PORT + "!");
});