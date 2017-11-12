var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var fs = require("fs");


var command = process.argv[2].toLowerCase();
var search = process.argv.slice(3, process.argv.length).join(" ");



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
    console.log("\n" + num + "\t" + time);
    console.log(text);
    console.log("");
    console.log("");
};

// function displayTrack(track){

//     var song = "\tSong: " + track.name;
//     var album = "\tAlbum: " + track.album_type.name;
//     var prev = "\tPreview: No preview link available";
//     var artists = "\tArtist(s): ";
    
//     for(var i in track.artists){
//         if(i > 0){
//             artists += ", ";
//         };
//         artists += track.artists[i].name;
//     };

//     if(track.preview_url !== null){
//         prev = "Prewiew: " + track.preview_url;
//     };

//     console.log(artists);
//     console.log(song);
//     console.log(album);
//     console.log(prev);
// };

function displayTrack(artists, track, album, link){
    var prev = "No preview link available";
    var artist = "";

    for(var i in artists){
        if(i > 0){
            artist += ", ";
        };
        artist += artists[i].name;
    };

    if(link !== null){
        prev = link;
    };

    console.log("\n\tArtist(s): " + artist + "\n");
    console.log("\tSong: " + track + "\n");
    console.log("\tAlbum: " + album.name + " (" + album.album_type + ")\n");
    console.log("\tPreview: " + prev + "\n");
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
    var formattedPlot = ""


    for(var i in arr){
        if((formattedPlot.length + arr[i].length) > (100 * line + 5 * (line - 1))){
            formattedPlot += newLine;
            line++;
        };
        formattedPlot += arr[i] + " ";
    }
    return formattedPlot.trim();
}

function displayMovie(movie){
    console.log("\n\tTitle: " +  movie.Title + "\n");
    console.log("\tReleased in: " + movie.Year + "\n");
    console.log("\tIMDB Rating: " + getMovieRating(movie.Ratings, "Internet Movie Database") + "\n");
    console.log("\tRotten Tomatoes Rating: " + getMovieRating(movie.Ratings, "Rotten Tomatoes") + "\n");
    console.log("\tProcuded in: " + movie.Country + "\n");
    console.log("\tLanguage: " + movie.Language + "\n");
    console.log("\tPlot: " + formatPlot(movie.Plot) + "\n");
    console.log("\tActors: " + movie.Actors + "\n");
};

function liri(cmd, search){

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
            displayTrack(track.artists, track.name, track.album, track.preview_url);
            //displayTrack(track);
        });
    }
    else if(cmd === "movie-this"){
        var movie; 
        if(search.length < 1){movie = "Mr. Nobody"} 
        else{movie = search;};

        var url = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
        request(url, function(err, response, body){
            if(err){
                console.log(err);
            }
            else if(response.statusCode === 200){
                displayMovie(JSON.parse(body));
            }
        });
    }
    else if(cmd === "do-what-it-says"){
        fs.readFile("./random.txt", "utf-8", function(err, data){
            var arr = data.split(",");
            if(arr[0] !== "do-what-it-says"){
                var cmd = arr[0];
                var search = arr[1].replace(/"/g, '');
                liri(cmd, search);

            };
        });
    };
};


liri(command, search);
