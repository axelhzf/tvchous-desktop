TRAKT_API_KEY = process.env.TRAKT_API_KEY
#TRAKT_BASE: "http://api.trakt.tv"
TRAKT_BASE = "http://localhost:3000/api"

async = require "async"
request = require "request"

class TraktProvider
  constructor: (@$http, @Show, @Season, @Episode, @fileSystemService) ->

  trendingShows: (cb) ->
    options =
      url: "#{TRAKT_BASE}/shows/trending.json/#{TRAKT_API_KEY}"
      clazz: @Show

    @_request(options, cb)

  seasons: (show, cb) ->
    options =
      url: "#{TRAKT_BASE}/show/seasons.json/#{TRAKT_API_KEY}/#{show.imdb_id}"
      clazz: @Season
      additionalAttributes:
        _show: show

    @_request(options, cb)

  episodes: (show, season, cb) ->
    options =
      url: "#{TRAKT_BASE}/show/season.json/#{TRAKT_API_KEY}/#{show.imdb_id}/#{season.season}"
      clazz: @Episode
      additionalAttributes:
        _show: show
        _season: season

    @_request(options, cb)

  _request: (options, cb) ->
    requestOptions =
      url: options.url
      json: true

    request requestOptions, (err, response, body) ->
      return cb(err) if err

      models = _.map body, (attributes) ->
        attrs = _.extend({}, attributes, options.additionalAttributes)
        new options.clazz(attrs)

      cb(null, models)

angular.module("app").service "traktProvider", TraktProvider