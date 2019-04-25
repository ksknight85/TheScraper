const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");


module.exports = function (app) {

  app.post("/delScrape", function (res, res) {
    db.Article.deleteMany({}, (err) => { });
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

  // app.post("/articles/:id", function (req, res) {
  //   console.log(req.params.id)
  //   console.log(req.body)
  //   res.status(200).end();

  // })

}