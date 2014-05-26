var remote = require("./client/js/service/remote");
var mediaPlayer = require("./client/js/lib/mediaPlayer");
var torrents = require("./client/js/lib/torrents");

angular.module("app").controller("SeasonController",
  function ($scope, $stateParams, traktService, execService) {

    function init () {
      findEpisodes();
    }

    function findEpisodes () {
      var showId = $stateParams.showId;
      var seasonId = $stateParams.seasonId;
      co(function *() {
        $scope.season = yield traktService.findSeason(showId, seasonId);
        $scope.$apply();
      })();
    }

    function playEpisode (episode) {
      co(function *() {
        $scope.loadingMsg = "Opening file";
        var file = episode.local.mountFile || episode.local.file;
        yield execService.playFile(file);
        delete $scope.loadingMsg;
      })();
    }

    function downloadEpisode (episode) {
      co(function *() {
        $scope.loadingMsg = "Downloading torrent";
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        yield execService.downloadTorrent(torrent.link);
        delete $scope.loadingMsg;
      })();
    }

    function streamEpisode (episode) {
      console.log("stream episode", episode);
      co(function* () {
        $scope.loadingMsg = "Streaming torrent";
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        var href = yield remote.startStreamingTorrent(torrent.link);
        mediaPlayer.playRemote(href, stopStreaming);
        delete $scope.loadingMsg;
      })();
    }

    function stopStreaming () {
      co(function* () {
        yield remote.stopStreamingTorrent();
      })();
    }

    _.extend($scope, {
      playEpisode: playEpisode,
      downloadEpisode: downloadEpisode,
      streamEpisode: streamEpisode
    });

    init();
  });