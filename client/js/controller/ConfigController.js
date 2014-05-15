angular.module("app").controller("ConfigController", function ($scope, configurationService) {
  $scope.configuration = configurationService.getConfiguration();

  $scope.save = function () {
    configurationService.updateConfiguration($scope.configuration);
  }

});