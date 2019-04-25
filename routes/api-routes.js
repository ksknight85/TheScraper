const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");


module.exports = function (app) {

  app.post("/delScrape", function (res, res) {
    db.Article.deleteMany({}, (err) => {});
    res.status(200).end();
  })


  let numResults = 0;

  app.get("/scrape", function (req, res) {
    axios.get("https://www.washingtonpost.com/").then(function (response) {
      var $ = cheerio.load(response.data);
      $(".headline").each(function (i, element) {
        let title = $(element).children().text();
        let link = $(element).children().attr("href");
        let summary = $(element).parent().find("div").attr("class", "blurb").text().trim()
        const results = [];
        if (title === '' || link === undefined || summary === "" || numResults > 30) {
          return
        }
        else {
          results.push({
            title: title,
            link: link,
            summary: summary
          });
          numResults++;
        }
        db.Article.create(results)
          .then(function (data) {
            res.status(200).end()
          })
          .catch(function (err) {
            console.log(err)
          })
      });
      results = [];
    })
    numResults = 0
  })
  // app.get("/scrape", function(req, res) {
  //   // First, we grab the body of the html with axios
  //   axios.get("http://www.echojs.com/").then(function(response) {
  //     // Then, we load that into cheerio and save it to $ for a shorthand selector
  //     const $ = cheerio.load(response.data);

  //     // Now, we grab every h2 within an article tag, and do the following:
  //     $("article h2").each(function(i, element) {
  //       // Save an empty result object
  //       var result = {};

  //       // Add the text and href of every link, and save them as properties of the result object
  //       result.title = $(this)
  //         .children("a")
  //         .text();
  //       result.link = $(this)
  //         .children("a")
  //         .attr("href");

  //       // Create a new Article using the `result` object built from scraping
  //       db.Article.create(result)
  //         .then(function(dbArticle) {
  //           // View the added result in the console
  //           console.log(dbArticle);
  //         })
  //         .catch(function(err) {
  //           // If an error occurred, log it
  //           console.log(err);
  //         });
  //     });

  //     // Send a message to the client
  //     res.send("Scrape Complete");
  //   });
  // });

  app.get("/articles", function (req, res) {
    db.Article.find().then(function (data) {
      res.render("articles", { articles: data })
    }).catch(function (err) {
      res.json(err);
    })
  });

  app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (data) {
        res.json(data);
      }).catch(err => {
        res.json(err);
      })
  })

  app.post("/articles/:id", function (req, res) {
    console.log(req.params.id)
    console.log(req.body)
    res.status(200).end();


    // console.log(`title: ${req.body}`)
    // db.Note.create(`title: ${req.body.title}`)
    // db.Article.findOneAndUpdate({_id: req.params.id}).then(data => {
    //   res.json(data);
    // })
  })









}