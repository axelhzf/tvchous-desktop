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
    $state.go("search", {query: query});
  }

  _.extend($scope, {
    changeQuery: _.debounce(changeQuery, 500)
  });
  init();
});