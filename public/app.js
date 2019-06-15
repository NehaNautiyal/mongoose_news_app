$(document).ready(function () {

    showArticles();
    $("#clear").on("click", deleteAll);
    $("#scrapeNew").on("click", scrapeNew);
    $(document).on("click", ".save", saveArticle);
    $(document).on("click", "#deleteSaved", clearSaved);
    // $(document).on("click", "#comment", addNote);

if ($("#saved").length > 0) {
    console.log("I see saved!")
    showSavedArticles();
}

    function scrapeNew() {
        window.location.href = "/scrape";
    }

    function deleteAll() {
        $.ajax({
            method: "DELETE",
            url: "/articles/"
        })
            .then(showArticles);
    }

    function showArticles() {
        $(".card").remove();
        // Grab the articles as a json
        $.getJSON("/articles", function (data) {
            if (!data || data.length === 0) {
                $("#articles").addClass("center").append("There are no articles! Try scraping new ones...")
            } else {
                // For each one
                for (var i = 0; i < data.length; i++) {

                    // Create a card to display the info
                    var newCard = $("<div>");
                    newCard.addClass("card");

                    var img = $("<img>");
                    img.addClass("card-img-top").attr("src", data[i].img).css("z-index", 0);

                    var button = $("<button>");
                    button.text("SAVE").attr("data-id", data[i]._id).addClass("btn center save").css({ "z-index": 1 },
                        { "position": "absolute" });

                    var cardBody = $("<div>");
                    cardBody.addClass("card-body");

                    // var h5 = $("<h5>");
                    // h5.addClass("card-title").text(data[i].title);

                    var link = $("<a>");
                    link.addClass("btn btn-info article").attr("href", data[i].link).text(data[i].title);

                    cardBody.append(link);
                    newCard.append(img, button, cardBody);
                    $("#articles").append(newCard);

                    // Display the apropos information on the page
                    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<img src=" + data[i].img + '>' + "<br />" + data[i].link + "</p>");
                }
            }
        });
    }

    function showSavedArticles() {
        $(".card").remove();
        // Grab the articles as a json
        $.getJSON("/articles/saved", function (data) {
            if (!data || data.length === 0) {
                $("#saved").addClass("center").append("There are no saved articles! Try saving some...")
            } else {
                // For each one
                for (var i = 0; i < data.length; i++) {

                    // Create a card to display the info
                    var newCard = $("<div>");
                    newCard.addClass("card");

                    var img = $("<img>");
                    img.addClass("card-img-top").attr("src", data[i].img).css("z-index", 0);

                    var delButton = $("<button>");
                    delButton.text("Delete from Saved").attr({"data-id": data[i]._id,
                                                            "id": "deleteSaved"}).addClass("btn center").css({ "z-index": 1 },
                        { "position": "absolute" });

                    var commentButton = $("<button>");
                    commentButton.text("COMMENT").attr({"data-id": data[i]._id,
                                                        "id": "comment"}).addClass("btn center").css({ "z-index": 1 },
                        { "position": "absolute" });

                    var cardBody = $("<div>");
                    cardBody.addClass("card-body");

                    // var h5 = $("<h5>");
                    // h5.addClass("card-title").text(data[i].title);

                    var link = $("<a>");
                    link.addClass("btn btn-info article").attr("href", data[i].link).text(data[i].title);

                    cardBody.append(link);
                    newCard.append(img, delButton, commentButton, cardBody);
                    $("#saved").append(newCard);

                    // Display the apropos information on the page
                    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<img src=" + data[i].img + '>' + "<br />" + data[i].link + "</p>");
                }
            }
        });
    }

    function clearSaved() {
        let id = $(this).attr("data-id");
        $(this).parent().remove();

        $.ajax({
            method: "DELETE",
            url: "/articles/" + id,
            data: {
                saved: false
            }
        }).then(showSavedArticles);
    }

    function saveArticle() {
        let id = $(this).attr("data-id");
        $(this).parent().remove();

        // Post to /saved 
        $.ajax({
            method: "PUT",
            url: "/articles/" + id,
            data: {
                saved: true
            }
        }).then(showSavedArticles)
            .then(function (data) {
            //     // With that done
                window.location = data.redirectUrl;
            });
    }

});