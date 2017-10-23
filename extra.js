//added dependencies
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var logger = require("morgan");

var app = express();

var PORT = process.env.PORT || 3000

// Middleware 

app.set(bodyParser.json())
app.set(bodyParser.urlencoded({
    extended: false
}))

// Setting Handlebars

var exphbs = require('express-handlebars')
app.use(logger("dev"));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')


// Mongo DB and Collection 
var db = require("./models")

mongoose.Promise = global.Promise;

if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
}else{
    mongoose.connect("mongodb://localhost:27017/scraperdb", {
        useMongoClient: true
    })
}
// ────────────────────────────────────────────────────────────────────────────────
app.get("/scrape", function (req, res) {
       var numSet = 0;
       
       request("http://snowboarding.transworld.net/videos/#hjiHOhvH2fvmmWup.97", function (error, response, html) {
   
           var $ = cheerio.load(html);
   
           var results = {};
   
          
   
           $(".entry-title").each(function (i, element) {
   
               numSet++;
               results.title = $(this).children("a").attr("title")
   
               results.link = $(this).children("a").attr("href")
   
   
               if (results.title && results.link) {
   
                   db.User.save(results)
                   
                   
   
               }
   
               
               
           })
   
          res.send("Transworld Scraped!")
   
       })
       
   })

   app.listen(PORT, function () {
      console.log("App running on Port " + PORT);
  })