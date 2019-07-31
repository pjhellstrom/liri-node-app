// Create package instances
require("dotenv").config();
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var inquirer = require("inquirer");
var fs = require("fs");
const chalk = require("chalk");

// Import keys
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

// Init variables
var spotify_search_key = "track";
var spotify_search_term = "";
var concert_search_term = "skrillex";
var movie_search_term = "fargo"
const log = console.log;
var liri_command ="movie-this";

//Function declarations
function songSearch() {
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
            //formatting
            log(chalk.black.bgGreenBright(`Here's a song I found on Spotify for '${spotify_search_term}'-------------------------`));
            //log song name
            log(chalk.bold.white(`${data.tracks.items[0].name}`));
            //log artist name
            log(chalk.white(`Artist: ${data.tracks.items[0].artists[0].name}`));
            //log album name
            log(chalk.white(`Album: ${data.tracks.items[0].album.name}`));
            //log preview link
            log(chalk.white(`Preview at: ${data.tracks.items[0].external_urls.spotify}`));    
            // formatting
            log(chalk.black.bgGreenBright(`---------------------------------------------------------------------`));
        }
        // if search_key is artist
        else if (spotify_search_key == "artist") {
            //formatting
            log(chalk.black.bgGreenBright(`I found this artist on Spotify for '${spotify_search_term}'------------`));
            //log artist name
            log(chalk.bold.white(`${data.artists.items[0].name}`));
            //log artist popularity
            log(chalk.white(`Artist popularity rank: ${data.artists.items[0].popularity}`));
            //log artist followers
            log(chalk.white(`Artist follower count: ${data.artists.items[0].followers.total}`));
            //log artist link
            log(chalk.white(`Artist link: ${data.artists.items[0].external_urls.spotify}`));    
            // formatting
            log(chalk.black.bgGreenBright(`---------------------------------------------------------------------`));
        }
        // if search_key is album
        else if (spotify_search_key == "album") {
            //formatting
            log(chalk.black.bgGreenBright(`This is an album I found on Spotify for '${spotify_search_term}'--------------`));
            //log album name
            log(chalk.bold.white(`${data.albums.items[0].name}`));
            //log artist name
            log(chalk.white(`Artist: ${data.albums.items[0].artists[0].name}`));
            //log number of tracks
            log(chalk.white(`Album tracks: ${data.albums.items[0].total_tracks}`));  
            //log album release date
            log(chalk.white(`Release date: ${data.albums.items[0].release_date}`));  
            // formatting
            log(chalk.black.bgGreenBright(`---------------------------------------------------------------------`));
        };
    })
    })
}//end songSearch()

function concertSearch() {
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
            //formatting
            log(chalk.black.bgKeyword('orange')(`Here's what I found on Bands in Town for '${concert_search_term}'------------------`));
            //log venue name
            log(chalk.bold.white(`${response.data[0].lineup[0]} is performing at ${response.data[0].venue.name}`));
            //log venue location
            log(chalk.white(`In ${response.data[0].venue.city}, ${response.data[0].venue.country}`));
            //log date of event in format MM/DD/YYYY
            log(chalk.white(`On ${moment(response.data[0].datetime).format("MM/DD/YYYY")} (${moment(response.data[0].datetime).fromNow()})`));
            //formatting
            log(chalk.black.bgKeyword('orange')(`---------------------------------------------------------------------`));
            
        });
    })
}//end concertSearch

function movieSearch() {
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
        //formatting
        log(chalk.black.bgCyan(`Here's what I found on OMDB for '${movie_search_term}'--------------------------`));
        //log movie title
        log(chalk.bold.white(`${response.data.Title}`));
        //log release year
        log(chalk.white(`Release year: ${response.data.Year}`));
        //log IMDB rating
        log(chalk.white(`IMDB rating: ${response.data.imdbRating}`));
        //log Rotten Tomatoes rating
        log(chalk.white(`Rotten Tomatoes rating: ${response.data.Ratings[1].Value}`));
        //log production country
        log(chalk.white(`Production country: ${response.data.Country}`)); 
        //log movie language
        log(chalk.white(`Language(s): ${response.data.Language}`)); 
        //log movie plot
        log(chalk.white.italic(`Plot: ${response.data.Plot}`)); 
        //log movie actors
        log(chalk.white(`Actors: ${response.data.Actors}`)); 
        //formatting
        log(chalk.black.bgCyan(`-----------------------------------------------------------------------`));
        }
    );
    })
}// end movieSearch()


// LIRI greeting
log(chalk.bold("Hey! I'm LIRI, your personal assistant."));

// inquirer prompt to get LIRI command
inquirer.prompt([
    {
    type: "list",
    message: "What can I help you with today?",
    choices: ["Search Spotify", "Find upcoming concerts", "Get information on a movie",  "Do something at random"],
    name: "liri_command"
    }
])
.then(function(inquirerResponse){
// if song search is selected
    if (inquirerResponse.liri_command == "Search Spotify") {
        songSearch();
    }
// if concert search is selected
    else if (inquirerResponse.liri_command == "Find upcoming concerts") {
        concertSearch();
    }
// if movie search is selected
    else if (inquirerResponse.liri_command == "Get information on a movie") {
        movieSearch();
    }
// if random search is selected
    else if (inquirerResponse.liri_command == "Do something at random") {

    //use fs package to retrieve instructions from random.txt
    fs.readFile("random.txt", "utf8", function(err, data) {
    // if err, log err, else log data    
    err ? console.log(err) : eval(`${data}Search()`);
    })
    };
});//end inquirerResponse