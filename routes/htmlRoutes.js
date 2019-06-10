// Require all models
var db = require("../models");
var Article = require("../models/article");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function (app) {

    app.get("/", function (req, res) {
        res.render("index");
    })

    // A GET route for scraping the echoJS website
    app.get("/scrape", function (req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.sciencedaily.com/").then(function (response) {

            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);

            // Now, we grab every h2 within an article tag, and do the following:
            $(".col-xs-6").each(function (i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this)
                    .find("h3")
                    .text();
                result.img = $(this)
                    .find("img")
                    .attr("src");
                result.link = $(this)
                    .find("a")
                    .attr("href");
                
                var article = new Article(result);
                article.completeImgSrc();
                article.completeLink();

                // Create a new Article using the `result` object built from scraping
                db.Article.create(article)
                    .then(function (dbArticle) {
                    })
                    .catch(function (err) {
                        // If an error occurred, log it
                        console.log(err);
                    });
            });

            // Send a message to the client
            res.send("Scrape Complete");
        });
    });

    // Route for getting all Articles from the db
    app.get("/articles", function (req, res) {
        // grabs all of the articles
        db.Article.find({})
            .then(function (articles) {
                res.json(articles);
            })
            .catch(function (error) {
                res.json(error);
            });
    });

};
