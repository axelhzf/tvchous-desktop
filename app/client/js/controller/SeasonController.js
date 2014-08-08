//var remote = require("./client/js/service/remote");
//var mediaPlayer = require("./client/js/lib/mediaPlayer");
//var streaming = require("./client/js/lib/streaming");
//var socketClient = require("./client/js/service/socketClient");


var client = require("./client/js/lib/client");


function SeasonController($scope, $stateParams) {
  this.$scope = $scope;
  this.$stateParams = $stateParams;
  this.findEpisodes();
}


SeasonController.prototype = {
  findEpisodes : function () {
    var showId = this.$stateParams.showId;
    var seasonId = this.$stateParams.seasonId;
    this.episodes = yield this.call("findEpisodes", showId, seasonId);
  }
}


//angular.module("app").controller("SeasonController",
//  function ($scope, $stateParams) {
//
//    function init () {
//      findEpisodes();
//    }
//
//    function findEpisodes () {
//      var showId = $stateParams.showId;
//      var seasonId = $stateParams.seasonId;
//
//      var remoteKey = showId + "." + seasonId;
//      socketClient.watch($scope, remoteKey, "season");
//    }
//
//    function playEpisode (episode) {
//      co(function *() {
//        try {
//          $scope.loadingMsg = "Opening file";
//          var file = episode.local.mountFile || episode.local.file;
//          mediaPlayer.playFile(file);
//        } finally {
//          delete $scope.loadingMsg;
//        }
//      })();
//    }
//
//    function downloadEpisode (episode) {
//      co(function *() {
//        $scope.loadingMsg = "Downloading torrent";
//        var torrent = yield socketClient.call("defaultTorrentForEpisode", episode);
//        yield socketClient.call("downloadTorrent", torrent.link);
//        delete $scope.loadingMsg;
//
//        $scope.$apply();
//      })();
//    }
//
//    function streamEpisode (episode) {
//      co(function* () {
//        var torrent = yield socketClient.call("defaultTorrentForEpisode", episode);
//        var torrentStream = streaming.startStreamingTorrent(torrent.link);
//        $scope.activeStream = torrentStream;
//
//        torrentStream.events.on("ready", function () {
//          var options = "";
//          if (torrentStream.subtitles.length) {
//            var sub = torrentStream.subtitles[0];
//            options += ' --sub-file="' + sub + '"';
//          }
//          console.log(options);
//          mediaPlayer.playRemote(torrentStream.href, options, function () {
//            stopStreaming(torrent.link);
//          });
//          delete $scope.activeStream;
//        });
//      })();
//    }
//
//    function cancelStreaming () {
//      if ($scope.activeStream) {
//        var torrent = $scope.activeStream.torrent;
//        stopStreaming(torrent);
//        delete $scope.activeStream;
//      }
//    }
//
//    function stopStreaming (torrent) {
//      streaming.stopStreamingTorrent(torrent);
//    }
//
//    _.extend($scope, {
//      playEpisode: playEpisode,
//      downloadEpisode: downloadEpisode,
//      streamEpisode: streamEpisode,
//      cancelStreaming: cancelStreaming
//    });
//
//    init();
//  });