var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var SavedArticlesSchema = new Schema({

    title: {
        type:String,
        required: true
    },

    link:{
        type:String,
        required: true
    },
 
    note:[{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
})


var SavedArticle = mongoose.model("SavedArticle", SavedArticlesSchema);

module.exports = SavedArticle;