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
        var file = episode.local.mountFile || episode.local.file;
        yield execService.playFile(file);
      })();
    }

    function downloadEpisode (episode) {
      co(function *() {
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        yield execService.downloadTorrent(torrent.link);
      })();
    }

    function streamEpisode (episode) {
      co(function* () {
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        var href = yield remote.startStreamingTorrent(torrent.link);
        mediaPlayer.playRemote(href);
      })();
    }

    _.extend($scope, {
      playEpisode: playEpisode,
      downloadEpisode: downloadEpisode,
      streamEpisode: streamEpisode
    });

    init();
  });