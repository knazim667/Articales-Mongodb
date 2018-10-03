// Grab the News as a json
$.getJSON("/news", function(data) {
    // for each one 
    for (var i=0; i < data.length; i++) {
        // Display the information on page
        $("#news").append("<div class='edit' data-id= '" + data[i]._id + "'>"
        
        + "<img src='"+ data[i].image +"'>"
        + "<h3>"+ data[i].title +"</h3>"
        + "<p>" + data[i].summary
        + "<br/>" 
        + "Author" + data[i].author + "</p>"+"</div>"); 
    }
});

//Whenever click on a div tag
$(document).on("click", ".edit", function() {
    // Empty the note from the Note section
    $("#notes").empty();
    // Save the id from the div tag
    var thisId = $(this).attr("data-id");

    // Now making ajax call from the News
    $.ajax({
        method: "GET",
        url: "/news/" + thisId
    })
    // add the note information to the page
    .then(function(data) {
    
        // The title of the article
        $("#notes").append("<h4>" + data.title + "</h4>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea><br/>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

        //if there is a note in the news
        if(data.note){
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/news/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Empty the notes section
        $("#notes").empty();
      });
  
    
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });