module = angular.module("app");

module.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider.state("home", {
    url: "/",
    templateUrl: "dist/views/home.html",
    controller: "HomeController"
  });

  $stateProvider.state("search", {
    url: "/search/:query",
    templateUrl: "dist/views/home.html",
    controller: "HomeController"
  });

  $stateProvider.state("show", {
    url: "/shows/:showId",
    templateUrl: "dist/views/show.html",
    controller: "ShowController"
  });

  $stateProvider.state("show.season", {
    url: "/seasons/:seasonId",
    templateUrl: "dist/views/show_season.html",
    controller: "SeasonController"
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