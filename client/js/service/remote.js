var dnode = require('dnode');
var thunkify = require("thunkify");
var EventEmitter = require("events").EventEmitter;
var _ = require("underscore");
var net = require('net');

var Remote = function () {
  this.events = new EventEmitter();
  this.d = dnode();
  this.bindEvents();
};

Remote.prototype = {
  bindEvents: function () {
    this.d.on("error", this.onError.bind(this));
    this.d.on("end", this.onEnd.bind(this));
  },
  host: function () {
    return process.env.SERVER_HOST || "localhost";
  },
  port: function () {
    return process.env.SERVER_PORT || 5004;
  },
  connect: function () {
    var host = this.host();
    var port = this.port();
    this.d.connect({host: host, port: port}, this.onRemote.bind(this));
  },
  disconnect: function () {
    if (this.connection) {
      this.d.end();
    }
  },
  onRemote: function (connection) {
    this.connection = connection;
    this.bindRemoteMethods();
    this.events.emit("connected");
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
    _.each(_.keys(this.connection), function (methodName) {
      this[methodName] = thunkify(this.connection[methodName]);
    }, this);
  },
  unbindRemoteMethods: function () {
    _.each(_.keys(this.connection), function (methodName) {
      delete this[methodName];
    }, this);
  }
};

module.exports = new Remote();