var remote = require("./client/js/service/remote");
var mediaPlayer = require("./client/js/lib/mediaPlayer");
var torrents = require("./client/js/lib/torrents");
var streaming = require("./client/js/lib/streaming");

angular.module("app").controller("SeasonController",
  function ($scope, $stateParams, traktService) {

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
        try {
          $scope.loadingMsg = "Opening file";
          var file = episode.local.mountFile || episode.local.file;
          mediaPlayer.playFile(file);
        } finally {
          delete $scope.loadingMsg;
        }
      })();
    }

    function downloadEpisode (episode) {
      co(function *() {
        $scope.loadingMsg = "Downloading torrent";
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        yield remote.downloadTorrent(torrent.link);
        delete $scope.loadingMsg;
      })();
    }

    function streamEpisode (episode) {
      co(function* () {
        var torrent = yield torrents.defaultTorrentForEpisode(episode);
        var torrentStream = streaming.startStreamingTorrent(torrent.link);
        $scope.activeStream = torrentStream;

        torrentStream.events.on("ready", function () {
          var options = "";
          if (torrentStream.subtitles.length) {
            var sub = torrentStream.subtitles[0];
            options += ' --sub-file="' + sub + '"';
          }
          console.log(options);
          mediaPlayer.playRemote(torrentStream.href, options, function () {
            stopStreaming(torrent.link);
          });
          delete $scope.activeStream;
        });
      })();
    }

    function cancelStreaming () {
      if ($scope.activeStream) {
        var torrent = $scope.activeStream.torrent;
        stopStreaming(torrent);
        delete $scope.activeStream;
      }
    }

    function stopStreaming (torrent) {
      streaming.stopStreamingTorrent(torrent);
    }

    _.extend($scope, {
      playEpisode: playEpisode,
      downloadEpisode: downloadEpisode,
      streamEpisode: streamEpisode,
      cancelStreaming: cancelStreaming
    });

    init();
  });