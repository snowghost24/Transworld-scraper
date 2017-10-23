var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

var app = express();

var PORT = process.env.PORT || 3000

// Middleware 

app.set(bodyParser.json())
app.set(bodyParser.urlencoded({
    extended: false
}))

// Setting Handlebars

var exphbs = require('express-handlebars')

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))

app.set('view engine', 'handlebars')
app.use(express.static("public"));


// Mongo DB and Collection 
var db = require("./models")

mongoose.Promise = global.Promise;

if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
}else{
    mongoose.connect("mongodb://localhost/scraperdb", {
        useMongoClient: true
    })
}




// ________________________MY SCRAP REQUEST____________________________________________

app.get("/scrape", function (req, res) {


    var numSet = 0;
    
    request("http://snowboarding.transworld.net/videos/#hjiHOhvH2fvmmWup.97", function (error, response, html) {

        var $ = cheerio.load(html);

        var results = {};

       

        $(".entry-title").each(function (i, element) {

            numSet++;
            results.title = $(this).children("a").attr("title")
            
                        results.link = $(this).children("a").attr("href")


            if (results.title && results.link ) {

                db.Article.create(results)
                
                

            }

            
            
        })

       res.send("Newly scrapped articles!")

    })
    
})

// ___________________________________END MY SCRAPE _____________


// ______________________START ROUTES___________________

app.get("/", function (req, res) {


    db.Article.find({}, function (error, found) {
        res.render("index", {
            found: found
        })
    })

}) // End of "/"___________


app.post("/save/:id", function (req, res) {

    var id = req.params.id;

    var resObj = {}
    db.Article.findOne({
            _id: id
        })
        .then(function (foundOne) {

            resObj.title = foundOne.title;
            resObj.link = foundOne.link;
            resObj.summary = foundOne.summary;

            db.SavedArticle.create(resObj)

            db.Article.findOneAndRemove({
                _id: id
            }, function (err, homeDelete) {
                if (err) {
                    console.log(err);
                }
                res.redirect("/")
            })
        })


}) // End of "/save/:id"___________

app.get("/saved", function (req, res) {
   
    db.SavedArticle.find({})
    .populate("note")
    .exec(function(err, data){

        res.render("saved", {
                saved: data,
           
            })
        })

}) // End of "/saved"___________


app.get("/delete/:id", function (req, res) {

    var id2 = req.params.id;

    db.SavedArticle.findOneAndRemove({
        _id: id2
    }, function (err, foundDelete) {

        if (err) {
            console.log(err);
        }
        res.redirect("/saved")
    })

}) // End of "/delete/:id"___________


app.get("/addnote/:note", function(req, res){

var array = req.params.note.split(",");

var getNote = {
    
   body: array[0]

}
console.log(array[1]);
    db.Note.create(getNote, function(err, made){
            if (err){
               throw err;
            }

        db.SavedArticle.findOneAndUpdate({ _id : array[1]}, { $push: { "note": made._id }} , { new: true }, function(error, update){
            if (err){
                throw err;
            }

            res.send(update)
        })
    })
})

app.get("/deleteNote/:id", function(req, res){

    db.Note.findOneAndRemove({_id : req.params.id}, function(err, delNote){
        if (err){
            throw err;
        }

    res.send(delNote)
    })
})

// Listening to PORT
app.listen(PORT, function () {
    console.log("App running on Port " + PORT);
})