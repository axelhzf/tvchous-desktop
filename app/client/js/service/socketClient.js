var _ = require("underscore");
var co = require("co");

exports.call = call;

var waitingResponses = {};

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



