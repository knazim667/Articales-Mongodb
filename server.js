//Require Dependencies
var express = require("express");
var cheerio = require('cheerio');
var axios = require('axios');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

// initilize express
var app = express();

// Port 
var PORT = 3000;

//use morgan for logging request
app.use(logger("dev"));

// Require all models
var db = require("./models");



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

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/news/:id", function(req, res) {
    // prepare a query that finds the matching one in our db...
    db.News.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(data) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(data);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
    app.post("/news/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.News.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(data) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(data);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
    });
  

// Start the server
app.listen(PORT, function(){
    console.log("App Running on Port " + PORT + "!");
});