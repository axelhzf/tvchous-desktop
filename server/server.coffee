path = require "path"
express = require "express"
request = require "request"

app = express()

app.use(express.static(path.join(__dirname, "../dist")))
app.use(app.router)

Cacheman = require "cacheman"
cache = new Cacheman "api"

# Proxy trakt api

cachedRequest = (url) ->
  (req, res) ->
    originalUrl = req.originalUrl
    cache.get originalUrl, (err, fromCache) ->
      return res.json(fromCache) if fromCache

      processedUrl = url.replace /:(\w+)/g, (match, paramName) -> req.param(paramName)
      requestOptions =
        uri: processedUrl
        json: true
      request requestOptions, (err, response, body) ->
        cache.set originalUrl, body
        res.json body

app.get "/api/shows/trending.json/:api_key", cachedRequest("http://api.trakt.tv/shows/trending.json/:api_key")
app.get "/api/show/seasons.json/:api_key/:imdb_id", cachedRequest("http://api.trakt.tv/show/seasons.json/:api_key/:imdb_id")
app.get "/api/show/season.json/:api_key/:imdb_id/:season", cachedRequest("http://api.trakt.tv/show/season.json/:api_key/:imdb_id/:season")


server = app.listen 3000, ->
  console.log("Listening on port #{server.address().port}")
