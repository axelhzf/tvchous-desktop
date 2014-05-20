var remote = require("./client/js/service/remote");

angular.module("app").controller("ServerConnect", function ($scope, $timeout) {

  function init() {
    $scope.connected = false;
    $scope.host = remote.host();
    $scope.port = remote.port();

    connect();
  }

  function connect () {
    console.log("try to connect");
    remote.connect();
  }

  function destroy() {
    remote.disconnect();
  }

  function onRemoteConnected () {
    $scope.$apply(function () {
      $scope.connected = true;
    });
  }

  function onRemoteDisconnected () {
    $scope.$apply(function () {
      $scope.connected = false;
    });
  }

  function onRemoteError (e) {
    if (!$scope.connected) {
      //try to reconnect

    }
  }

  remote.events.on("connected", onRemoteConnected);
  remote.events.on("disconnected", onRemoteDisconnected);
  remote.events.on("error", onRemoteError);
  $scope.$on('$destroy', destroy);

  init();

});