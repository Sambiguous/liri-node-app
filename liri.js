var keys = require("./keys.js");
var request = require("request");

var command = process.argv.slice(2, process.argv.length).join(" ").toLowerCase();

function liri(cmd){
    if(cmd = "my tweets"){
        var url = "https://"
        request("https://api.twitter.com/1.1/search/tweets.json", function(error, response, body){
            console.log(error);
            console.log("===================================");
            console.log(body);
        
        })
    }
};


liri(command);