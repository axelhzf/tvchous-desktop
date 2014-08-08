var _ = require("underscore");
var co = require("co");

module.exports = {
  call: call,
  watch: watch
};

var waitingResponses = {};
var watchCallbacks = {};

var socket = require("socket.io-client")("http://localhost:5001");
socket.on("connect", onConnect);
socket.on("response", onResponse);

function call (methodName) {
  var params = _.toArray(arguments).slice(1);
  return function (cb) {
    var id = _.uniqueId("call-");
    waitingResponses[id] = function (data) {
      delete waitingResponses[id];
      if (data.error) {
        console.error("Socket client error", data.error);
      }
      cb(data.error, data.data);
    };
    socket.emit("call", {id: id, methodName: methodName, params: params});
  }
}

function onConnect () {
  console.log("Client connected");
}

function onResponse (data) {
  if (waitingResponses[data.id]) {
    waitingResponses[data.id](data);
  } else {
    console.error("Response call without callback");
  }
}

function watch ($scope, remoteKey, varName) {
  socket.emit("watch", {key: remoteKey});
  var eventName = "watchUpdate:" + remoteKey;
  socket.on(eventName, function (data) {
    $scope.$apply(function () {
      $scope[varName] = data;
    });
  });
  $scope.$on("$destroy", function () {
    delete watchCallbacks[remoteKey];
    socket.off(eventName);
    socket.emit("stopWatch", {key: remoteKey});
  });
}

