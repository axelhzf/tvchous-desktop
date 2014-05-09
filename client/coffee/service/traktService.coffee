TRAKT_API_KEY = process.env.TRAKT_API_KEY
#TRAKT_BASE: "http://api.trakt.tv"
TRAKT_BASE = "http://localhost:3000/api"

async = require "async"
request = require "request"

class TraktProvider
  constructor: (@$http, @Show, @Season, @Episode, @fileSystemService) ->

  _request: (url, Model, cb) ->
    requestOptions =
      url: url
      json: true

    request requestOptions, (err, response, body) ->
      return cb(err) if err
      models = _.map body, (attributes) -> new Model(attributes)
      cb(null, models)

  trendingShows: (cb)->
    @_request("#{TRAKT_BASE}/shows/trending.json/#{TRAKT_API_KEY}", @Show, cb)

  seasons: (show, cb) ->
    @_request("#{TRAKT_BASE}/show/seasons.json/#{TRAKT_API_KEY}/#{show.imdb_id}", @Season, cb)

  episodes: (show, season, cb) ->
    @_request("#{TRAKT_BASE}/show/season.json/#{TRAKT_API_KEY}/#{show.imdb_id}/#{season.season}", @Episode, cb)

angular.module("app").service "traktProvider", TraktProvider