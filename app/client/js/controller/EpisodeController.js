var torrents = require("./client/js/lib/torrents");
var remote = require("./clients/js/service/remote");

angular.module("app").controller("EpisodeController",
  function ($scope, $stateParams, traktService) {
    function init () {
      findEpisode();
    }

    function findEpisode () {
      var showId = $stateParams.showId;
      var seasonId = $stateParams.seasonId;
      var episodeId = $stateParams.episodeId;

      co(function *() {
        $scope.episode = yield traktService.findEpisode(showId, seasonId, episodeId);
        $scope.$apply();

        if (!$scope.episode.torrents) {
          var q = $scope.episode._show.id + " " + $scope.episode.fullId;
          $scope.episode.torrents = yield torrents.findTorrents(q);
          $scope.$apply();
        }

      })();
    }

    function downloadTorrent (torrent) {
      co(function* () {
        var link = torrent.link;
        yield remote.downloadTorrent(link);
      })();
    }

    _.extend($scope, {
      downloadTorrent: downloadTorrent
    });

    init();
  });