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
      co(function* () {
        $scope.loadingMsg = "Streaming torrent";
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        var streaming = yield remote.startStreamingTorrent(torrent.link);
        var options = "";
        if (streaming.subtitles && streaming.subtitles.length > 0) {
          var sub = streaming.subtitles[0];
          options += ' --sub-file="' + sub + '"';
        }
        mediaPlayer.playRemote(streaming.href, options, stopStreaming);
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