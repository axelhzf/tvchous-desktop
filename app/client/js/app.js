var server = require("./server/server");
var app = angular.module("app", ["ui.router"]);
var remote = require("./client/js/service/remote");
var configuration = require("./client/js/service/configuration");

app.run(function (episodeUpdaterService, fileSystemService, utorrentService) {

  episodeUpdaterService.addTask(fileSystemService.updateEpisodes);
  episodeUpdaterService.addTask(utorrentService.updateEpisodes);

  function updateConfiguration () {
    server.stop();
    if (configuration.get("runAs") === "local") {
      server.start();
    }
    remote.disconnect(); //disconnect from old server, it will automatically connect to the new one
  }

  configuration.events.on("change", updateConfiguration);
  updateConfiguration();
});


process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});