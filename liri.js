// Create instance of package
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");
const chalk = require("chalk");

// Make keys available
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Init variables
var spotify_search_key = "track";
var spotify_search_term = "";
var concert_search_term = "skrillex";
var movie_search_term = "fargo"
const log = console.log;
var liri_command ="movie-this";

// LIRI greeting
log("Hi, I'm LIRI, your personal assistant!")

// inquirer prompt to get LIRI command
inquirer.prompt([
    {
    type: "list",
    message: "What can I help you with today?",
    choices: ["Look up a song", "Find upcoming concerts", "Get information on a movie",  "Do something at random"],
    name: "liri_command"
    }
])
.then(function(inquirerResponse){

// if song search is selected
    if (inquirerResponse.liri_command == "Look up a song") {
        // inquirer prompt to set up search string
        inquirer.prompt([
            {
            type: "list",
            message: "What are you looking for?",
            choices: ["A song", "An artist", "An album"],
            name: "spotify_search_key"
            },
            {
            type: "input",
            message: "Give me a search term!",
            name: "spotify_search_term" 
            }
        ])
        .then(function(inquirerResponse){
            // Check to see what search parameter to use
            switch(inquirerResponse.spotify_search_key) {
                case "A song":
                    spotify_search_key = "track";
                    break;
                case "An artist":
                    spotify_search_key = "artist";
                    break;
                case "An album":
                    spotify_search_key = "album";
                    break;
                // if no selection is made default to track parameter
                default:
                    spotify_search_key = "track";
            }
            // save search term
            spotify_search_term = inquirerResponse.spotify_search_term
        
            //if no search term is provided default to:
            if (spotify_search_term == "") {
                spotify_search_term = 'Misread'
            };

            // initiate JSON request to Spotify API
            spotify.search({type: `${spotify_search_key}`, query: `${spotify_search_term}`}, function(err, data) {

            if (err) {
                return log(chalk.white.bgRed(`Error encountered: ${err}`));
            }
            // if search_key is track
            if (spotify_search_key == "track") {
                //log artist name
                log(data.tracks.items[0].artists[0].name);
                //log song name
                log(data.tracks.items[0].name);
                //log album name
                log(data.tracks.items[0].album.name);
                //log preview link
                log(data.tracks.items[0].external_urls.spotify);    
            }
            // if search_key is artist
            else if (spotify_search_key == "artist") {
                //log artist name
                log(data.artists.items[0].name);
                //log artist popularity
                log(data.artists.items[0].popularity);
                //log artist followers
                log(data.artists.items[0].followers.total);
                //log artist link
                log(data.artists.items[0].external_urls.spotify);    
            }
            // if search_key is album
            else if (spotify_search_key == "album") {
                //log artist name
                log(data.albums.items[0].artists[0].name);
                //log album name
                log(data.albums.items[0].name);
                //log number of tracks
                log(data.albums.items[0].total_tracks);  
                //log album release date (MM/DD/YYYY)
                log(data.albums.items[0].release_date);  
            };
        })
        })
    }// end if LIRI command is song

    else if (inquirerResponse.liri_command == "Find upcoming concerts") {
        // inquirer prompt to set up search string
        inquirer.prompt([
            {
            type: "input",
            message: "What artist are you looking for?",
            name: "concert_search_term" 
            }
        ])
        .then(function(inquirerResponse){
            // save input from inquirer
            concert_search_term = inquirerResponse.concert_search_term;
            // initiate axios request
            axios.get(`https://rest.bandsintown.com/artists/${concert_search_term}/events?app_id=codingbootcamp`)
            .then( function(response) {
                // error handling
                if (!response.data[0]) {
                    log("Sorry, no concerts found!");
                    return;
                }
                //log venue name
                log(`${response.data[0].lineup[0]} is playing at ${response.data[0].venue.name}`);
                //log date of event in format MM/DD/YYYY
                log(`On ${moment(response.data[0].datetime).format("MM/DD/YYYY")}`);
                //log venue location
                log(`${response.data[0].venue.city}, ${response.data[0].venue.country}`);
            });
        })
    }// end if LIRI command is concerts

    else if (inquirerResponse.liri_command == "Get information on a movie") {
        // inquirer prompt to set up search string
        inquirer.prompt([
            {
            type: "input",
            message: "What movie are you looking for?",
            name: "movie_search_term" 
            }
        ])
        .then(function(inquirerResponse){
            // save input from inquirer
            movie_search_term = inquirerResponse.movie_search_term;
            // initiate axios request
            axios.get(`http://www.omdbapi.com/?t=${movie_search_term}&y=&plot=short&apikey=trilogy`)
            .then(function(response) {
            // error handling
            if (!response.data) {
                log("Sorry, no movies found!");
                return;
            }
            //log movie title
            log( chalk.white(`Title: ${response.data.Title}`));
            //log release year
            log( chalk.white(`Release year: ${response.data.Year}`));
            //log IMDB rating
            log( chalk.white(`IMDB rating: ${response.data.imdbRating}`));
            //log Rotten Tomatoes rating
            log( chalk.white(`Rotten Tomatoes rating: ${response.data.Ratings[1].Value}`));
            //log production country
            log( chalk.white(`Production country: ${response.data.Country}`)); //log movie language
            log( chalk.white(`Language(s): ${response.data.Language}`)); //log movie plot
            log( chalk.white(`Plot: ${response.data.Plot}`)); //log movie actors
            log( chalk.white(`Actors: ${response.data.Actors}`)); 
            }
        );
        })
    }// end if LIRI command is concerts

});

// else if (liri_command == "do-what-it-says") {
//     //use fs package to retrieve instructions from random.txt

// };