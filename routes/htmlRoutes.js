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
            res.redirect("/");
            
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

    // Route for deleting all Articles from the db
    app.delete("/articles", function (req, res) {
        // grabs all of the articles
        db.Article.deleteMany()
            .then(function (articles) {
                res.json(articles);
            })
            .catch(function (error) {
                res.json(error);
            });
    });

    // Route for updating articles that are saved from the db
    app.put("/articles/:id", function (req, res) {
        // grabs all of the articles
        db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }, { new: true })
            .then(function (articles) {
                res.json(articles);
            })
            .catch(function (error) {
                res.json(error);
            });
    });

    // Route to post to saved articles
    app.get("/saved", function (req, res) {
        db.Article.find({})
            .then(function (articles) {
                res.render("saved", articles);
            })
            .catch(function (error) {
                res.json(error);
            });
    })

    // Route for saving/updating an Article's associated Note
    app.post("/saved/:id", function (req, res) {
        // Create a new note and pass the req.body to the entry
        db.Note.create(req.body)
            .then(function (dbNote) {
                // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
                // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
                // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function (dbArticle) {
                // If we were able to successfully update an Article, send it back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

};
