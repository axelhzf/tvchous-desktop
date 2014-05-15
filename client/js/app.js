var app = angular.module("app", ["ui.router"]);

app.run(function (episodeUpdaterService, fileSystemService, utorrentService, postProcessService) {

  episodeUpdaterService.addTask(fileSystemService.updateEpisodes);
  episodeUpdaterService.addTask(utorrentService.updateEpisodes);

  postProcessService.start();
});
