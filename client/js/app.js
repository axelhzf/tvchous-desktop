var io = require('socket.io-client');
var server = require("./server/server");
var app = angular.module("app", ["ui.router"]);
var dnode = require('dnode');
var client = require("./client/js/service/client");

app.run(function (episodeUpdaterService, fileSystemService, utorrentService, postProcessService) {

  episodeUpdaterService.addTask(fileSystemService.updateEpisodes);
  episodeUpdaterService.addTask(utorrentService.updateEpisodes);

  postProcessService.start();

  server.start();
  client.start();

});
