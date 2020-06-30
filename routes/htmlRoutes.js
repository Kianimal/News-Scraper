module.exports = function(app) {

  var axios = require("axios");
  var cheerio = require("cheerio");

  const Article = require('../models/index');
  var mongoose = require("mongoose");

    app.get("/", function(req, res) {
      res.render("index");
    });

    app.get("/api/scrape", function(req, res) {
      axios.get("https://abcnews.go.com/US").then(function(response) {

            mongoose.connection.db.dropCollection("articles", function(err){
              console.log(err);
              console.log("COLLECTION DROPPED");
            });
        
            let $ = cheerio.load(response.data);
        
            let headlines = [];

            $("div.ContentRoll__Headline").each((i, element) => {

            let headline = $(element).children("h2").text();

            let link = $(element).children().children().attr("href");

            let description = $(element).children().children("div.ContentRoll__Desc").text();

            headlines.push({
                headline: headline,
                link: link,
                description: description
            });
        
            Article.create({headline: headline, link: link, description: description});
            });

        });
        res.send("Scraped!")
    });

    app.get("/api/headlines", function(req, res) {
      Article.find({}, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          res.json(data);
        }
      });
    });

    app.get("/saved", function(req, res) {
      Article.find({}, function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          res.json(data);
        }
      });
    });

    app.get("/*", function(req, res) {
      res.render("404");
    });
};