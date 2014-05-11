angular.module("app").controller("HomeController", function ($scope, $stateParams, traktService) {

  function init () {
    $scope.query = $stateParams.query;
    findShows();
  }

  function findShows () {
    co(function *() {
      $scope.shows = yield traktService.findShows();
      $scope.$apply();
    })();
  }

  init();
});
