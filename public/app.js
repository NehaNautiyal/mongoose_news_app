$(document).ready(function () {


    // Grab the articles as a json
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {

            // Create a card to display the info
            var newCard = $("<div>");
            newCard.addClass("card").attr("data-id", data[i].id);

            var img = $("<img>");
            img.addClass("card-img-top").attr("src", data[i].img);

            var cardBody = $("<div>");
            cardBody.addClass("card-body");

            // var h5 = $("<h5>");
            // h5.addClass("card-title").text(data[i].title);

            var link = $("<a>");
            link.addClass("btn btn-info").attr("href", data[i].link).text(data[i].title);

            cardBody.append(link);
            newCard.append(img, cardBody);
            $("#articles").append(newCard);

            // Display the apropos information on the page
            // $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<img src=" + data[i].img + '>' + "<br />" + data[i].link + "</p>");
        }
    });

});