var io = require('socket.io-client');
var server = require("./server/server");
var app = angular.module("app", ["ui.router"]);
var dnode = require('dnode');
var remote = require("./client/js/service/remote");

app.run(function (episodeUpdaterService, fileSystemService, utorrentService, postProcessService) {

  episodeUpdaterService.addTask(fileSystemService.updateEpisodes);
  episodeUpdaterService.addTask(utorrentService.updateEpisodes);

  postProcessService.start();

  if(!process.env.SERVER_HOST) {
    console.log("server start");
    server.start();
  }
  remote.start();
});
