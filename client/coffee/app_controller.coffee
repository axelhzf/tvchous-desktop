angular.module("app").controller "AppController",
  class AppController
    constructor: (@traktProvider, @pirateshipProvider)->
      @trendingShows
      @season
      @episode

      @fetchTrending()

    selectShow: (show) ->
      @show = show
      delete @season
      delete @episode
      @fetchSeasons()

    selectSeason: (season) ->
      @season = season
      delete @episode
      @fetchEpisodes()

    selectEpisode: (episode) ->
      @episode = episode
      @fetchTorrents()

    fetchTrending: ->
      @traktProvider.trendingShows().then (shows) =>
        @trendingShows = shows

    fetchSeasons: ->
      @traktProvider.seasons(@show).then (seasons) =>
        @show.seasons = seasons

    fetchEpisodes: ->
      @traktProvider.episodes(@show, @season).then (episodes) =>
        @season.episodes = episodes

    fetchTorrents: ->
      q = "#{@show.title} #{@episode.id()}"
      console.log q

      @pirateshipProvider.find(q).then (torrents) =>
        @episode.torrents = torrents

    downloadEpisode: (episode) ->
      q = "#{@show.title} #{episode.id()}"
      @pirateshipProvider.find(q).then (torrents) =>
        @pirateshipProvider.download torrents[0].link