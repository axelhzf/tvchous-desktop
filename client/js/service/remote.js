var dnode = require('dnode');
var thunkify = require("thunkify");
var remote;

var remote = Proxy.create({
  get: function (receiver, index) {
    if(index === "start") return connect;
    if (!remote){
      throw new Error("Not connected yet");
    }
    if(!remote[index]) {
      throw new Error("Client doesn't have method " + index);
    }
    return thunkify(remote[index]);
  },
  set : function () {
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

module.exports = remote;