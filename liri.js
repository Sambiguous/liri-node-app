var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");


var command = process.argv[2].toLowerCase();
var search = process.argv.slice(3, process.argv.length).join(" ");


function displayTweet(number, timestamp, tweet){
    var line = 1;
    var num = number.toString() + ".";
    var time = timestamp.split(" ").slice(0, 4).join(" ") + " UTC";
    var text = "\t";
    var arr = tweet.replace("\n", "\n\t").split("https://")[0].split(" ");

    for(var i in arr){
        if((text.length + arr[i].length) > (80 * line)){
            text += "\n\t";
            line++;
        };
        text += arr[i] + " ";
    };
    console.log(num + "\t" + time);
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

    console.log("\tArtist(s): " + artist);
    console.log("\tSong: " + track);
    console.log("\tAlbum: " + album.name + " (" + album.album_type + ")");
    console.log("\tPreview: " + prev);
    console.log("");
};

function liri(cmd){
    console.log("");
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
    };
};


liri(command);