//var server = require("./server/server");
//var app = angular.module("app", ["ui.router"]);
//var remote = require("./client/js/service/remote");
//var configuration = require("./client/js/service/configuration");
//
//
//require("./client/js/service/socketClient");
//
//app.run(function (episodeUpdaterService, fileSystemService, utorrentService) {
//
//  episodeUpdaterService.addTask(fileSystemService.updateEpisodes);
//  episodeUpdaterService.addTask(utorrentService.updateEpisodes);
//
//  function updateConfiguration () {
//    server.stop();
//    if (configuration.get("runAs") === "local") {
//      server.start();
//    }
//    remote.disconnect(); //disconnect from old server, it will automatically connect to the new one
//  }
//
//  configuration.events.on("change", updateConfiguration);
//  updateConfiguration();
//});
//
//
//process.on('uncaughtException', function(err) {
//  console.log('Caught exception: ' + err);
//});

var co = require("co");

var App = window.App = angular.module("app", ["ui.router", "ngAnimate"]);

App.config(function($sceProvider) {
  $sceProvider.enabled(false);
});

App.ctrl = function (clazz) {
  window.App.controller(clazz.name, clazz);

  for (var method in clazz.prototype) {
    if (isGeneratorFunction(clazz.prototype[method])) {
      var gen = clazz.prototype[method];
      clazz.prototype[method] = function () {
        var self = this;
        var args = arguments;
        return function (cb) {
          co(function* () {
            var res = yield gen.apply(self, args);
            if (self.$scope) {
              self.$scope.$apply();
            }
            return res;
          })(cb);
        }
      }
    }
  }
};

function isGeneratorFunction (obj) {
  return obj && obj.constructor && 'GeneratorFunction' == obj.constructor.name;
}