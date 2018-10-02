// Grab the News as a json
$.getJSON("/news", function(data) {
    // for each one 
    for (var i=0; i < data.length; i++) {
        // Display the information on page
        $("#news").append("<p data-id= '" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].summary + "<br />" + data[i].author + "<br />" + data[i].image + "</p>"); 
    }
});
