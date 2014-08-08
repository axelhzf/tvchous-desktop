var client = require("./client/js/lib/client");
var configuration = require("./client/js/service/configuration");

//App.controller("ServerConnect", ServerConnect);
App.ctrl(ServerConnect);

function ServerConnect ($scope, $state) {
  this.$scope = $scope;
  this.$state = $state;
  this.connected = false;
  this.client = client;

  if(!this.firstTimeRedirect()) {
    this.bindEvents();
  }
}

ServerConnect.prototype = {

  bindEvents: function () {
    this.client.socket.on("connect", this.onConnect.bind(this));
    this.client.socket.on("disconnect", this.onDisconnect.bind(this));
  },

  firstTimeRedirect: function () {
//    var firstTime = configuration.get("firstTime");
//    if(firstTime) {
//      configuration.set("firstTime", false);
//      this.$state.go("config");
//    }
    return false;
  },

  onConnect: function () {
    console.log("connected!");
    this.connected = true;
    this.$scope.$apply();
  },

  onDisconnect:  function () {
    this.connected = false;
    this.$apply();
  }

};
