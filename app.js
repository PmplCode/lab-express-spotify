require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("index")
})

app.get("/artist-search", (req, res, next) => {
    // console.log("req.query: ", req.query)
    spotifyApi.searchArtists(req.query.artist)
    .then((resultats) =>  {
            // console.log("data: ", data)
            console.log('Artist albums', resultats.body.artists.items);
            console.log('Length arr: ', resultats.body.artists.items.length)
            const data = {};
            if(resultats.body.artists.items.length > 0) {
                data.artista = resultats.body.artists.items;
            }
            res.render("artist-search", data);
        },
        function(err) {
          console.error("err: ", err);
        }
      );
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));