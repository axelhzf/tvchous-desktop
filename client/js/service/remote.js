var dnode = require('dnode');
var thunkify = require("thunkify");
var remote;

var thunks = {};

var proxy = Proxy.create({
  get: function (receiver, index) {
    if (index === "start") return connect;
    if (!remote) {
      throw new Error("Not connected yet");
    }
    if (!remote[index]) {
      throw new Error("Client doesn't have method " + index);
    }
    if (!thunks[index]) {
      console.log("creating thunk", index);
      thunks[index] = thunkify(remote[index]);
    }
    return thunks[index];
  },
  set: function () {
    throw new Error("Can't modify properties");
  }
});

function connect () {
  var host = process.env.SERVER_HOST || "localhost";
  var port = process.env.SERVER_PORT || 5004;
  console.log("Connecting to ", host, port);
  var d = dnode.connect({host: host, port: port}, function (_remote) {
    remote = _remote;
  });
}

module.exports = proxy;