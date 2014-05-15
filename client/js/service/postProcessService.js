var downloadPostProcess = require("download-post-process");

angular.module("app").factory("postProcessService", function () {

  console.log("post process service start");

  var basepath = "/Users/axelhzf/Downloads/utorrent/downloaded";
  var destpath = "/Users/axelhzf/Downloads/utorrent/tvshows";

  function start() {
    downloadPostProcess.watcher(basepath, destpath);
  }

  return {
    start : start,
    stop : stop
  }
});