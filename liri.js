// Read and set environment variables
require("dotenv").config();

// ---------------- import packages -------------
var axios = require("axios");

//VARS
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

//vars to capture user inputs.
var userOption = process.argv[2]; 
var inputParameter = process.argv[3];

//Execute function
UserInputs(userOption, inputParameter);

//FUNCTIONS
function UserInputs (userOption, inputParameter){
    switch (userOption) {
    case 'concert-this':
        showConcertInfo(inputParameter);
        break;
    case 'spotify-this-song':
        showSongInfo(inputParameter);
        break;
    case 'movie-this':
        showMovieInfo(inputParameter);
        break;
    case 'do-what-it-says':
        showSomeInfo();
        break;
    default: 
        console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}

//Funtion for Concert Info: Bands in Town
function showConcertInfo(inputParameter){
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputParameter + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
        var concerts = JSON.parse(body);
        for (var i = 0; i < concerts.length; i++) {  
            console.log("**********EVENT INFO*********");  
            fs.appendFileSync("log.txt", "**********EVENT INFO*********\n");//Append in log.txt file
            console.log(i);
            fs.appendFileSync("log.txt", i+"\n");
            console.log("Name of the Venue: " + concerts[i].venue.name);
            fs.appendFileSync("log.txt", "Name of the Venue: " + concerts[i].venue.name+"\n");
            console.log("Venue Location: " +  concerts[i].venue.city);
            fs.appendFileSync("log.txt", "Venue Location: " +  concerts[i].venue.city+"\n");
            console.log("Date of the Event: " +  concerts[i].datetime);
            fs.appendFileSync("log.txt", "Date of the Event: " +  concerts[i].datetime+"\n");
            console.log("*****************************");
            fs.appendFileSync("log.txt", "*****************************"+"\n");
        }
    } else{
      console.log('Error occurred.');
    }
});
}

//Funtion for Music Info: Spotify
function showSongInfo(inputParameter) {
    if (inputParameter === undefined) {
        inputParameter = "The Sign"; //default Song
    }
    spotify.search(
        {
            type: "track",
            query: inputParameter
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }
            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log("**********SONG INFO*********");
                fs.appendFileSync("log.txt", "**********SONG INFO*********\n");
                console.log(i);
                fs.appendFileSync("log.txt", i +"\n");
                console.log("Song name: " + songs[i].name);
                fs.appendFileSync("log.txt", "song name: " + songs[i].name +"\n");
                console.log("Preview song: " + songs[i].preview_url);
                fs.appendFileSync("log.txt", "preview song: " + songs[i].preview_url +"\n");
                console.log("Album: " + songs[i].album.name);
                fs.appendFileSync("log.txt", "album: " + songs[i].album.name + "\n");
                console.log("Artist(s): " + songs[i].artists[0].name);
                fs.appendFileSync("log.txt", "artist(s): " + songs[i].artists[0].name + "\n");
                console.log("*****************************");  
                fs.appendFileSync("log.txt", "*****************************\n");
             }
        }
    );
};

//Funtion for Movie Info: OMDB
function showMovieInfo(inputParameter){
    if (inputParameter === undefined) {
        inputParameter = "Mr. Nobody"
        console.log("-----------------------");
        fs.appendFileSync("log.txt", "-----------------------\n");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        fs.appendFileSync("log.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
        console.log("It's on Netflix!");
        fs.appendFileSync("log.txt", "It's on Netflix!\n");
    }
}
   
//-----------------movieThis function -------------

function movieThis(inputParameter){
    
    queryUrl = " http://www.omdbapi.com/?t=" + inputParameter + "&apikey=trilogy";
  
    axios.get(queryUrl).then(function(response) {
      console.log(response.data);
      console.log(response.data.Title); // response is an object which includes data
      console.log("Title: " + response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
  
      for (i = 0; i < response.data.Ratings.length; i++) {
        if (response.data.Ratings[i].Source === "Rotten Tomatoes") {
          console.log(
            "Rotten Tomatoes Rating: " + response.data.Ratings[i].Value
          );
        }
      }
      // console.log("IMDB Rating: " + response.imdbRaing);  ///rotten
      console.log("Country: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Actors: " + response.data.Actors);
    });
  }
  

//function to get proper Rotten Tomatoes Rating
function getRottenTomatoesRatingObject (data) {
    return data.Ratings.find(function (item) {
       return item.Source === "Rotten Tomatoes";
    });
  }
  
  function getRottenTomatoesRatingValue (data) {
    return getRottenTomatoesRatingObject(data).Value;
  }

//function for reading out of random.txt file  
function showSomeInfo(){
	fs.readFile('random.txt', 'utf8', function(err, data){
		if (err){ 
			return console.log(err);
		}
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
	});
 }

