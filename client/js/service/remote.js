var dnode = require('dnode');
var thunkify = require("thunkify");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");
var net = require('net');
var reconnect = require("reconnect-net");
var configuration = require("./configuration");

var Remote = function () {
  this.events = new EventEmitter();
};

Remote.prototype = {
  host: function () {
    var isLocal = configuration.get("runAs") === "local";
    return isLocal? "localhost" : configuration.get("remoteHost");
  },
  port: function () {
    var isLocal = configuration.get("runAs") === "local";
    return isLocal? configuration.get("serverPort") : configuration.get("remotePort");
  },
  connect: function () {
    var connectOptions = {
      host: this.host(),
      port: this.port()
    };

    var self = this;
    self.re = reconnect(function (stream) {
      var d = dnode({}, {weak: false});
      d.on("remote", self.onRemote.bind(self));
      d.on("error", self.onError.bind(self));
      stream.pipe(d).pipe(stream);
    }).connect(connectOptions);

    this.re.on("disconnect", this.onEnd.bind(this));
    this.re.on("reconnect", this.onReconnect.bind(this));
    this.re.on("connect", function () {
      console.log("connect!");
    })
  },
  disconnect: function () {
    if (this.re) {
      this.re.disconnect();
    }
  },
  onRemote: function (remote) {
    this.remote = remote;
    this.bindRemoteMethods();
    this.events.emit("connected");
  },
  onReconnect: function () {
    console.log("try to reconnect");
  },
  onError: function (e) {
    this.events.emit("error", e);
  },
  onEnd: function () {
    this.unbindRemoteMethods();
    delete this.connection;
    this.events.emit("disconnected");
  },
  bindRemoteMethods: function () {
    _.each(_.keys(this.remote), function (methodName) {
      this[methodName] = thunkify(this.remote[methodName]);
    }, this);
  },
  unbindRemoteMethods: function () {
    _.each(_.keys(this.connection), function (methodName) {
      delete this[methodName];
    }, this);
  }
};

module.exports = new Remote();