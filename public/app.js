$(document).ready(function () {

    showArticles();
    $("#clear").on("click", deleteAll);
    $("#scrapeNew").on("click", scrapeNew);
    $(document).on("click", ".save", saveArticle);
    $(document).on("click", "#deleteSaved", clearSaved);
    $(document).on("click", "#comment", populateNote);
    $(document).on("click", "#saveNewNote", addNote);

    if ($("#saved").length > 0) {
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
                    delButton.text("Delete from Saved").attr({
                        "data-id": data[i]._id,
                        "id": "deleteSaved"
                    }).addClass("btn center");

                    var commentButton = $("<button>");
                    commentButton.text("COMMENT").attr({
                        "data-id": data[i]._id,
                        "id": "comment",
                        "data-toggle": "modal",
                        "data-target": "#articleNote"
                    }).addClass("btn center");

                    var cardBody = $("<div>");
                    cardBody.addClass("card-body");

                    var link = $("<a>");
                    link.addClass("btn btn-info article").attr("href", data[i].link).text(data[i].title);

                    cardBody.append(link);
                    newCard.append(img, delButton, commentButton, cardBody);
                    $("#saved").append(newCard);
                }
            }
        });
    }

    function clearSaved() {
        let id = $(this).attr("data-id");
        $(this).parent().remove();

        $.ajax({
            method: "PUT",
            url: "/articles/saved/" + id,
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
                window.location.href = "/saved";
            });
    }

    function populateNote() {
        let id = $(this).attr("data-id");
        console.log(id);

        $.ajax({
            method: "GET",
            url: "/articles/saved/" + id
          })
            // With that done, add the note information to the page
            .then(function(data) {
                console.log(data);
                $("#articleName").append(`Note for ${data.title}`);
            });
    }
    function addNote() {
        let id = $(this).attr("data-id");
        console.log($("textarea#articleNote").val());

        $.ajax({
            method: "POST",
            url: "/articles/" + id,
            data: {
              // Value taken from note textarea
              body: $("textarea#articleNote").val()
            }
          })
            // With that done
            .then(function(data) {
              // Log the response
              console.log(data);
              // Empty the notes section
              $("textarea#articleNote").empty();
            });
    }

});