angular.module("app").controller("HomeController", function ($scope, traktService) {

  function init () {
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
