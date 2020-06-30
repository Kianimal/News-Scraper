const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require('mongoose');

var app = express();

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(__dirname + "/public/"));

// Routes
require("./routes/htmlRoutes")(app);

// Database configuration
const db = process.env.MONGODB_URI || "mongodb://localhost/NewsScraper";
mongoose.connect(db);

app.listen(process.env.PORT || 3000, function() {
    console.log("App running on port 3000!");
});

module.exports = app;