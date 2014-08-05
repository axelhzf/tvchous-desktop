var remote = require("./client/js/service/remote");
var socketClient = require("./client/js/service/socketClient");

angular.module("app").controller("HomeController", function ($scope, $stateParams) {

  function init () {
    $scope.query = $stateParams.query;
    findShows();
  }

  function findShows () {
    co(function *() {
      $scope.allShows = yield socketClient.call("findShows");
      var downloadedFolders = yield socketClient.call("downloadedFolders");

      $scope.favorites = _.filter($scope.allShows, function (show) {
        return _.contains(downloadedFolders, show.id);
      });
      $scope.$apply();
    })();
  }

  init();
});
