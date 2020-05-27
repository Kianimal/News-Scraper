var express = require("express");
var exphbs = require("express-handlebars");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "NewsScraper";
var collections = ["scrapedNews"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.render("index");
});

app.get("/scraped", function(req, res) {
    db.scrapedData.find({}, function(err, data) {
      // Log any errors if the server encounters one
      if (err) {
        console.log(err);
      }
      else {
        // Otherwise, send the result of this query to the browser
        res.json(data);
      }
    });
});

app.get("/scrape", function(req, res) {
    axios.get("https://abcnews.go.com/US").then(function(response) {
  
      // Load the Response into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      let $ = cheerio.load(response.data);
  
      // An empty array to save the data that we'll scrape
      let headlines = [];
      let description = [];
  
      // With cheerio, find each p-tag with the "title" class
      // (i: iterator. element: the current element)
      $("div.ContentRoll__Headline").each((i, element) => {
  
        // Save the text of the element in a "title" variable
        let headline = $(element).children("h2").text();
  
        // In the currently selected element, look at its child elements (i.e., its a-tags),
        // then save the values for any "href" attributes that the child elements may have
        let link = $(element).children().children().attr("href");

        let description = $(element).children().children("div.ContentRoll__Desc").text();
  
        // Save these results in an object that we'll push into the results array we defined earlier
        headlines.push({
          headline: headline,
          link: link,
          description: description
        });
  
        db.scrapedData.insert({headline: headline, link: link, description: description});
      });
  
      // Log the results once you've looped through each of the elements found with cheerio
      console.log(headlines);
      res.send("Scraped!")
    });
});

app.listen(3000, function() {
    console.log("App running on port 3000!");
});

// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// var app = express();

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// app.use(express.static("public"));

// // Handlebars
// app.engine(
//     "handlebars",
//     exphbs({
//       defaultLayout: "main"
//     })
//   );
//   app.set("view engine", "handlebars");

// require("../News-Scraper/routes/index.js")(app);

// module.exports = app;