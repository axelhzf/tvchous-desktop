App.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider.state("serverConnect", {
    abstract: true,
    templateUrl: "dist/views/server_connect.html",
    controller: "ServerConnect as s"
  });

  $stateProvider.state("home", {
    url: "/",
    parent: "serverConnect",
    templateUrl: "dist/views/home.html",
    controller: "HomeController as h"
  });

  $stateProvider.state("search", {
    url: "/search/:query",
    parent: "serverConnect",
    templateUrl: "dist/views/home.html",
    controller: "HomeController as h"
  });

  $stateProvider.state("show", {
    url: "/shows/:showId",
    parent: "serverConnect",
    templateUrl: "dist/views/show.html",
    controller: "ShowController as sh"
  });

  $stateProvider.state("show.season", {
    url: "/seasons/:seasonId",
    templateUrl: "dist/views/show_season.html",
    controller: "SeasonController as se"
  });

  $stateProvider.state("show.episode", {
    url: "/seasons/:seasonId/episodes/:episodeId",
    templateUrl: "dist/views/show_episode.html",
    controller: "EpisodeController"
  });

  $stateProvider.state("config", {
    url: "/config",
    templateUrl: "dist/views/config.html",
    controller: "ConfigController"
  });

});