var dnode = require('dnode');
var thunkify = require("thunkify");
var remote;

var client = Proxy.create({
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
  var d = dnode.connect(5004, function (_remote) {
    remote = _remote;
  });
}

module.exports = client;