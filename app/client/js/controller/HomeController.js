//var remote = require("./client/js/service/remote");
//var socketClient = require("./client/js/service/socketClient");

App.controller("HomeController", function ($scope, $stateParams) {

  function init () {
    $scope.query = $stateParams.query;
    console.log("init!");
    findShows();
  }

  function findShows () {
    co(function *() {
      try {
        $scope.allShows = yield socketClient.call("findShows");
        $scope.favorites = _.where($scope.allShows, {favorite: true});
        $scope.$apply();
      } catch(e) {
        console.log(e);
      }

    })();
  }

  init();
});
