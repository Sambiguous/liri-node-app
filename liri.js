var keys = require("./keys.js");
var request = require("request");
var Twitter = require("twitter");


var command = process.argv[2].toLowerCase();


function formatTweet(number, timestamp, tweet){
    var num = number.toString() + ".";
    var line = 1;
    var time = "\t" + timestamp.split(" ").slice(0, 4).join(" ") + " UTC\n";
    var text = "\t";

    var arr = tweet.replace("\n", "\n\t").split("https://")[0].split(" ");

    for(var i in arr){
        if((text.length + arr[i].length) > (80 * line)){
            text += "\n\t";
            line++;
        };
        text += arr[i] + " ";
    };

    return num + time + text;
};

function liri(cmd){
    console.log("");
    if(cmd = "mytweets"){
        var client = new Twitter(keys);
        var params = {
            screen_name: "realDonaldTrump",
            count: 20,
            include_rts: true,
            trim_user: true,
            tweet_mode: "extended"
        };
        
        client.get("statuses/user_timeline", params, function(error, tweets, response){
            if(error){
                console.log(error);
            }
            else{
                for(i in tweets){
                    var tweet = formatTweet(parseInt(i) + 1, tweets[i].created_at, tweets[i].full_text);
                    console.log(tweet);
                    console.log("");
                    console.log("");
                };
            };
        });
    }

};


liri(command);


