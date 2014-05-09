TRAKT_API_KEY = process.env.TRAKT_API_KEY
#TRAKT_BASE: "http://api.trakt.tv"
TRAKT_BASE = "http://localhost:3000/api"

class TraktProvider
  constructor: (@$http, @Show, @Season, @Episode) ->

  _request: (url, Model) ->
    @$http({method: 'GET', url: url})
    .then (response) =>
      models = response.data
      _.map models, (attributes) => new Model(attributes)

  trendingShows: ->
    @_request("#{TRAKT_BASE}/shows/trending.json/#{TRAKT_API_KEY}", @Show)

  seasons: (show) ->
    @_request("#{TRAKT_BASE}/show/seasons.json/#{TRAKT_API_KEY}/#{show.imdb_id}", @Season)

  episodes: (show, season) ->
    @_request("#{TRAKT_BASE}/show/season.json/#{TRAKT_API_KEY}/#{show.imdb_id}/#{season.season}", @Episode)

angular.module("app").service "traktProvider", TraktProvider