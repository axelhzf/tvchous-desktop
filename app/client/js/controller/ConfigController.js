var configuration = require("./client/js/service/configuration");

angular.module("app").controller("ConfigController", function ($scope, $state) {
  $scope.configuration = configuration.getConfiguration();

  $scope.save = function () {
    configuration.updateConfiguration($scope.configuration);
    $state.go("home");
  }

});