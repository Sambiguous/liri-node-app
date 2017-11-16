var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");

var command = process.argv[2].toLowerCase();
var search = process.argv.slice(3, process.argv.length).join(" ");

var logDvdr = "----------------------------------------------------------------------------------------------------";


fs.appendFile('log.txt', logDvdr + "\n" + logDvdr + "\nCommand: " + command + "\nSearch: " + search + "\n");



function displayTweet(number, timestamp, tweet){
    var line = 1;
    var num = number.toString() + ".";
    var time = timestamp.split(" ").slice(0, 4).join(" ") + " UTC";
    var text = "\t";
    var arr = tweet.replace(/\n/g, "\n\t").split(" ");

    for(var i in arr){
        if((text.length + arr[i].length) > (80 * line)){
            text += "\n\t";
            line++;
        };
        text += arr[i] + " ";
    };
    console.log("\n" + num + "\t" + time + "\n" + text + "\n\n");
    fs.appendFile('log.txt', "\n" + num + "\t" + time + "\n" + text + "\n\n");
};

function displayTrack(track){

    var song = "\tSong: " + track.name;
    var album = "\tAlbum: " + track.album.name;
    var prev = "\tPreview: No preview link available";
    var artists = "\tArtist(s): ";
    
    for(var i in track.artists){
        if(i > 0){
            artists += ", ";
        };
        artists += track.artists[i].name;
    };

    if(track.preview_url !== null){
        prev = "Prewiew: " + track.preview_url;
    };

    console.log("\n" + artists + "\n" + song +  "\n" + album + "\n" + prev + "\n");
    fs.appendFile('log.txt', "\n" + artists + "\n" + song +  "\n" + album + "\n" + prev + "\n");
};

function getMovieRating(ratings, source){
    for(var i in ratings){
        if(ratings[i].Source === source){
            return ratings[i].Value;
        };
    };
};

function formatPlot(plot){
    var line = 1;
    var newLine = "\n\t\t\b\b";
    var arr = plot.split(" ");
    var formattedPlot = "";


    for(var i in arr){
        if((formattedPlot.length + arr[i].length) > (100 * line + 5 * (line - 1))){
            formattedPlot += newLine;
            line++;
        };
        formattedPlot += arr[i] + " ";
    };
    return formattedPlot.trim();
};

function displayMovie(movie){

    //ugly code that mamkes the makes the console logs more eye friendly
    var movie = "\n\tTitle: " +  movie.Title + "\n\n\tReleased in: " + movie.Year + "\n\n\tIMDB Rating: " + getMovieRating(movie.Ratings, "Internet Movie Database") +
    "\n\n\tRotten Tomatoes Rating: " + getMovieRating(movie.Ratings, "Rotten Tomatoes") + "\n\n\tProcuded in: " + movie.Country + "\n\n\tLanguage: " + movie.Language +
    "\n\n\tPlot: " + formatPlot(movie.Plot) + "\n\n\tActors: " + movie.Actors + "\n";

    console.log(movie);
    fs.appendFile('log.txt', movie);
};

 

function main(cmd, search){

    if(cmd === "my-tweets"){
        var client = new Twitter(keys.twitter);
        var params = {
            screen_name: "realDonaldTrump",
            count: 20,
            tweet_mode: "extended"
        };
        
        client.get("statuses/user_timeline", params, function(err, tweets, response){
            if(err){
                console.log(err);
            }
            else{
                for(i in tweets){
                    displayTweet(parseInt(i) + 1, tweets[i].created_at, tweets[i].full_text);
                };
            };

        });
    }
    else if(cmd === "spotify-this-song"){
        var spotify = new Spotify(keys.spotifty);

        spotify.search({type: "track", query: search}, function(err, data){
            var track = data.tracks.items[0];
            displayTrack(track);
        });
    }
    else if(cmd === "movie-this"){
        var movie; 
        if(search.length < 1){movie = "Mr. Nobody"} 
        else{movie = search;};

        var url = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;

        request(url, function(err, response, body){

            //handle errors
            if(err){
                console.log(err);
            }

            //if no error and response code is 200...
            else if(response.statusCode === 200){
                
                //format and display important info
                displayMovie(JSON.parse(body));
            }
        });
    }
    else if(cmd === "do-what-it-says"){
        //open and read the random.txt file
        fs.readFile("./random.txt", "utf-8", function(err, data){

            //split contents of file into an array with comma as the delimiter
            var arr = data.split(",");

            //protect against infinite loop of death
            if(arr[0] !== "do-what-it-says"){
                var cmd = arr[0];
                var search = arr[1].replace(/"/g, '');

                //call main function with the contents of the random.txt file as parameters
                main(cmd, search);

            };
        });
    };
};

main(command, search);