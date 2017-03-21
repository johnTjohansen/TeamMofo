
  // Initialize Firebase
/*  var config = {
    apiKey: "AIzaSyAO0b8UIE87PlrM4o1ouMnKLgdFCMaJgUg",
    authDomain: "team-mofo-project-1.firebaseapp.com",
    databaseURL: "https://team-mofo-project-1.firebaseio.com",
    storageBucket: "team-mofo-project-1.appspot.com",
    messagingSenderId: "245129627837"
  };
  firebase.initializeApp(config);

  var database = firebase.database();*/

  // When the submit button is pressed...
  $("#submit").on("click", function() {

  	// event.preventDefault() is used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    $("#directorNames").empty();
    $("#actorNames").empty();

  	var movieEntered = $("#movieName").val().trim();
  	console.log(movieEntered)

    // construct our URL
    var queryURL = "http://www.omdbapi.com/?t=" + movieEntered + "&y=&plot=short&r=json";

    // Use $ajax to call OMDB API with movie title,
    // then take the response data and display directors and actors as buttons
    // for display in the name selection div.

    $.ajax({
       url: queryURL,
       method: "GET"
    }).done(function(response) {

       var responseData = JSON.stringify(response);
       console.log(responseData);
       var directors = response.Director.split(", ");
       var actors = response.Actors.split(", ");
       console.log(directors);
       console.log(actors);

       for (var i=0; i < directors.length; i++) {
       	 $("#directorNames").append("<button type='button' class='btn btn-default btn-lg btn-block'>" + directors[i] + "</button>");

       };

       for (var i=0; i < actors.length; i++) {
       	  $("#actorNames").append("<button type='button' class='btn btn-default btn-lg btn-block'>" + actors[i] + "</button>");

       $("#movieName").val() = "";
       };
    });
// this is not working yet
    $(document).ajaxError(function(){
   	  console.log("ajax error"); 	
      $("#actorNames").append("<p>Search was not successful</p>");
    });

  });