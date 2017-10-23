//added dependencies
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


// Mongo DB and Collection 
var db = require("./models")

mongoose.Promise = global.Promise;

if (process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
}else{
    mongoose.connect("mongodb://localhost/scrapper_db", {
        useMongoClient: true
    })
}


