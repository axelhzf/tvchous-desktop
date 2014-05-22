var remote = require("./client/js/service/remote");

angular.module("app").controller("HomeController", function ($scope, $stateParams, traktService) {

  function init () {
    $scope.query = $stateParams.query;
    findShows();
  }

  function findShows () {
    co(function *() {
      $scope.allShows = yield traktService.findShows();
      var downloadedFolders = yield remote.downloadedFolders();

      $scope.favorites = _.filter($scope.allShows, function (show) {
        return _.contains(downloadedFolders, show.id);
      });

      $scope.$apply();
    })();
  }

  init();
});
