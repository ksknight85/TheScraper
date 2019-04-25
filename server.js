var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs  = require('express-handlebars');
var PORT = 3000;
var exphbs = require("express-handlebars");
var app = express();
var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";


app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

app.use(logger("dev"));

app.use(express.static("public"));


require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// mongoose.connect("mongodb://localhost/thescraper", { useNewUrlParser: true });

mongoose.connect(MONGODB_URI);


app.listen(PORT, function() {

  console.log("App running on port " + PORT + "!");
});