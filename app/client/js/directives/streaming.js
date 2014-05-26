var co = require("co");
var remote = require("./client/js/service/remote");
var mediaPlayer = require("./client/js/lib/mediaPlayer");
var torrents = require("./client/js/lib/torrents");

angular.module("app").directive("streaming", function () {
  return {
    restrict: "E",
    scope: {
      episode: "="
    },
    templateUrl: "dist/views/streaming.html",
    link: function (scope) {

      function init () {
        scope.loading = false;
      }

      function startStreaming () {
        scope.loading = true;
        co(function* () {
          var torrent = yield torrents.defaultTorrentForEpisode(scope.episode);
          var href = yield remote.startStreamingTorrent(torrent.link);
          mediaPlayer.playRemote(href, stopStreaming);
          scope.loading = false;
        })();
      }

      function stopStreaming () {
        co(function* () {
          yield remote.stopStreamingTorrent();
          scope.streaming = false;
        })();
      }

      scope.startStreaming = startStreaming;
      scope.stopStreaming = stopStreaming;

      init();
    }
  }
});