'use strict';

//MongoJS and Mongoose assignments
const mongoose = require('mongoose');

//Mongoose schema
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
  headline: {
    type:String
  },
  link:{
    type:String
  },
  description:{
    type:String
  },
  comments:{
    type:Array
  }
});

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;