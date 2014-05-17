var downloadPostProcess = require("download-post-process");

angular.module("app").factory("postProcessService", function (configurationService) {

  var watcher;

  function start () {
    var basePath = configurationService.getConfiguration().downloadedFolder;
    var destPath = configurationService.getConfiguration().tvshowsFolder;
    console.log("start", basePath, destPath);
    try {
      watcher = downloadPostProcess.watcher(basePath, destPath);
      watcher.start();
    } catch(e) {
      console.log("postProcess service error", e);
    }
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