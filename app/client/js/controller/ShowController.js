var socketClient = require("./client/js/service/socketClient");

angular.module("app").controller("ShowController",
  function ($scope, $stateParams, $state) {

    function init () {
      findShow();
    }

    function findShow () {
      var showId = $stateParams.showId;
      co(function *() {
        $scope.show = yield socketClient.call("findShow", showId);
        $scope.$apply();

        redirectToLastSeason();
      })();
    }

    function redirectToLastSeason () {
      if ($state.$current.name === "show") {
        var showId = $scope.show.id;
        var seasonId = $scope.show.seasons[0].id;
        $state.go("show.season", {showId: showId, seasonId: seasonId}, {location: "replace"});
      }
    }

    init();
  });