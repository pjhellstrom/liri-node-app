# LIRI Bot
Language Interpretation and Recognition Interface (or LIRI for short) is a command line node app that searches Spotify for songs, Bands in Town for concerts, and OMDB for movies. Inquirer is used to simplify user input while Node-Spotify-API and Axios are used to submit API requests.

### Demo
<a href="http://www.youtube.com/watch?feature=player_embedded&v=IvFgERVwQFw
" target="_blank"><img src="http://img.youtube.com/vi/IvFgERVwQFw/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>

### Requirements

  * [Node.js](https://nodejs.org/) LTS (v10)
  
### Dependencies

   * [Inquirer](https://www.npmjs.com/package/inquirer)
   
   * [Node-Spotify-API](https://www.npmjs.com/package/node-spotify-api)

   * [Axios](https://www.npmjs.com/package/axios)

   * [Moment](https://www.npmjs.com/package/moment)

   * [DotEnv](https://www.npmjs.com/package/dotenv)

   * [Chalk](https://www.npmjs.com/package/chalk)


### Launch

Download repo into a new directory and create a .env file containing the following Spotify keys (make sure to exclude quotes from your keys):

```js
# Spotify API keys

SPOTIFY_ID=your-spotify-id
SPOTIFY_SECRET=your-spotify-secret

```

These keys can be obtained after registering for a developer account at  <https://developer.spotify.com/my-applications/#!/applications/create>. Exclusions for the .env file is included in .gitignore.

Next, install the dependencies and run liri.js

```console
# Install dependencies
npm i

# Run liri.js
node liri.js

```

### How to

Upon launch, LIRI will prompt you to select a search category. The options are:

  - Search Spotify
    - When selecting this option, you will get another prompt to select search by song, album or artist
    - Once a selection has been made, input a search term and hit enter
  - Find upcoming concerts
    - Input an artist/band to see the venue, location and time of the next concert 
  - Get information about a movie
    - Enter a movie search term to see ratings, movie details and a plot summary
  - Do something at random
    - This selection is dependent on the content of the 'random.txt' file. The file must contain one of the following key words:
      - song OR concert OR movie (excluding quotes)
    - The default is set to 'movie' - which will initiate a movie search
      
To initiate new search 

```console
# Run liri.js
node liri.js

```

### Author

* Jonas Hellstrom

