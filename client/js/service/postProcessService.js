var downloadPostProcess = require("download-post-process");

angular.module("app").factory("postProcessService", function (configurationService) {

  var watcher;

  function start () {
    var basePath = configurationService.getConfiguration().downloadedFolder;
    var destPath = configurationService.getConfiguration().tvshowsFolder;
    console.log("start", basePath, destPath);
    watcher = downloadPostProcess.watcher(basePath, destPath);
  }

  function stop () {
    console.log("stop");
    if (watcher) {
      watcher.stop();
      watcher = undefined;
    }
  }

  function configurationChange () {
    stop();
    start();
  }

  configurationService.events.on("change", configurationChange);

  return {
    start: start,
    stop: stop
  }
});