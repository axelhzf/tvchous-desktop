angular.module("app").controller("SeasonController",
  function ($scope, $stateParams, traktService, execService, pirateshipService) {

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
        console.log("play file", file);
        yield execService.playFile(file);
      })();
    }

    function downloadEpisode (episode) {
      co(function *() {
        if (!episode.torrents) {
          var q = episode._show.id + " " + episode.fullId;
          episode.torrents = yield pirateshipService.findTorrents(q);
        }
        var torrent = findHdTorrent(episode.torrents) || episode.torrents[0];
        console.log("Downloading torrent", torrent.title);
        yield execService.downloadTorrent(torrent.link);
      })();
    }

    function findHdTorrent(torrents) {
      return _.find(torrents, function (torrent) {
        return torrent.title.toLowerCase().indexOf("720p") !== -1;
      });
    }

    _.extend($scope, {
      playEpisode: playEpisode,
      downloadEpisode: downloadEpisode
    });

    init();
  });