var exec = require("co-exec");

angular.module("app").factory("execService", function () {

  function* downloadTorrent (link) {
    return yield exec("open /Applications/uTorrent.app " + link);
  }

  function* playFile (file) {
    return yield exec("open " + file);
  }

  return {
    downloadTorrent: downloadTorrent,
    playFile: playFile
  }

});