// declare global variables
  var movieEntered = "";
  var nameEntered = "";

  var prevSearch = [];
  var searchObj = {};
  var searchText = "";
  var prevSplit = [];

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyAO0b8UIE87PlrM4o1ouMnKLgdFCMaJgUg",
    authDomain: "team-mofo-project-1.firebaseapp.com",
    databaseURL: "https://team-mofo-project-1.firebaseio.com",
    storageBucket: "team-mofo-project-1.appspot.com",
    messagingSenderId: "245129627837"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  // When the submit button is pressed...
  $("#submit").on("click", function() {

  	// event.preventDefault() is used to prevent an event's default behavior.
    // Here, it prevents the submit button from trying to submit a form when clicked
    event.preventDefault();

    $("#directorNames").empty();
    $("#actorNames").empty();

  	movieEntered = $("#movieName").val().trim();
  	console.log(movieEntered)

    buildNameButts();
  });
 
 // When a previous search button is pressed, use those search keys to refresh the 
 // data on the HTML
  $(document).on("click", ".prevButts", function() {
    prevChosen = $(this).text();
    console.log("prev button clicked " + prevChosen);
    prevSplit = prevChosen.split(" - ");
    movieEntered = prevSplit[0];
    nameEntered = prevSplit[1];

    // clear out old name buttons
    $("#directorNames").empty();
    $("#actorNames").empty();

    // Rebuild the name buttons using previous search movie key
    buildNameButts()

// Call function to refresh youTube search results using previous keys

  });

 // When a name button is pressed, search Youtube for related videos
  $(document).on("click", ".nameButts", function() {
    nameEntered = $(this).text();
    console.log("name button clicked " + nameEntered);
    updateFirebase();

// youtube retrieval code goes here

  });

  // Firebase is always watching for changes to the data.
  // When changes occur it will print them to console and html
  database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    prevSearch = snapshot.val().sArray;
    console.log(prevSearch);
    // clear previous Search container for refreshing
    $("#lastSearch").empty();
    // build previous searches list
    for (var i=0; i < prevSearch.length; i++) {
      searchObj = prevSearch[i];
      console.log(searchObj);
      searchText = searchObj.sMovie + " - " + searchObj.sName;
      $("#lastSearch").append("<button type='button' class='list-group-item prevButts'>" + searchText + "</button>");
    };

  });

// Functions are here --------------------------------

  function buildNameButts() {
    // construct our URL
    var queryURL = "https://www.omdbapi.com/?t=" + movieEntered + "&y=&plot=short&r=json";
    // Use $ajax to call OMDB API with movie title,
    // then take the response data and display directors and actors as buttons
    // for display in the name selection div.
    $.ajax({
       url: queryURL,
       method: "GET"

    }).done(function(response) {
      if (response.Response != 'False') {
        var responseData = JSON.stringify(response);
        console.log(responseData);
        var directors = response.Director.split(", ");
        var actors = response.Actors.split(", ");
        var posterURL = response.Poster;
        console.log(directors);
        console.log(actors);
        console.log(posterURL);

        for (var i=0; i < directors.length; i++) {
          $("#directorNames").append("<button type='button' class='btn btn-default btn-lg btn-block nameButts'>" + directors[i] + "</button>");
        };

        for (var i=0; i < actors.length; i++) {
          $("#actorNames").append("<button type='button' class='btn btn-default btn-lg btn-block nameButts'>" + actors[i] + "</button>");
        };

        $("#uTubes").empty();
        $("#uTubes").append('<img src="' + posterURL + '" alt=poster>');

        $("#movieName").val("");
      } else {
        $("#actorNames").append("<p>Search was not successful</p>");
      }
    })
    .fail(function() {
      console.log('error on afax call');
    });  
  };


  function updateFirebase() {
    // create search key object to add to firebase
    searchObj = {
      sMovie: movieEntered,
      sName: nameEntered
    }; 
    console.log(searchObj);

    console.log("before " + prevSearch);
    // add current search key to previous searches array.  remove last one
    // if more than 5 objects
    prevSearch.unshift(searchObj);
    if (prevSearch.length > 5) {
      prevSearch.pop();
    };
    console.log("after " + prevSearch);

    // store modified array on firebase
    database.ref().set({
        sArray: prevSearch
    });

  };
