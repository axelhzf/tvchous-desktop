//var remote = require("./client/js/service/remote");
//var socketClient = require("./client/js/service/socketClient");

var client = require("./client/js/lib/client");
var g = require("./client/js/controller/Global");

function HomeController ($scope) {
  this.$scope = $scope;
  this.global = g;
  this.findShows()();
}

HomeController.prototype = {

  findShows: function* () {
    this.allShows = yield client.call("findShows");
  }

};

App.ctrl(HomeController);
