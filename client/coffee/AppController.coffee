angular.module("app").controller "AppController",
  class AppController
    constructor: (@$scope, @traktProvider, @pirateshipProvider, @execService, @fileSystemService)->
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
      @traktProvider.trendingShows (err, shows) =>
        @$scope.$apply =>
          @trendingShows = shows

    fetchSeasons: ->
      @traktProvider.seasons @show, (err, seasons) =>
        @$scope.$apply =>
          @show.seasons = seasons

    fetchEpisodes: ->
      @traktProvider.episodes @show, @season, (err, episodes) =>
        @$scope.$apply =>
          @season.episodes = episodes

        console.log "fillEpisodes"
        @fileSystemService.fillEpisodes episodes, (err) =>
          console.log "done fill"
          @$scope.$apply()


    downloadEpisode: (episode) ->
      q = "#{episode._show.id} #{episode.id}"
      @pirateshipProvider.find q,(err, torrents) =>
        @execService.downloadTorrent torrents[0].link

    playEpisode: (episode) ->
      @execService.playFile episode.file