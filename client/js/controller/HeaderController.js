angular.module("app").controller("HeaderController", function ($scope, $state, $rootScope) {

  function init () {
    $rootScope.$on('$stateChangeSuccess',
      function (event, toState, toParams) {
        if (toState.name === "search") {
          $scope.query = toParams.query;
        }
      }
    )
  }

  function changeQuery (query) {
    var location = $state.current.name === "search" ? "replace" : true;
    $state.go("search", {query: query}, {location: location});
  }

  _.extend($scope, {
    changeQuery: changeQuery
  });
  init();
});