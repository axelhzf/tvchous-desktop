var exec = require("co-exec");
var remote = require("./client/js/service/remote");

angular.module("app").factory("execService", function () {

  function* downloadTorrent (link) {
    return yield remote.downloadTorrent(link);
  }

  function* playFile (file) {
    return yield exec("open " + file);
  }

  return {
    downloadTorrent: downloadTorrent,
    playFile: playFile
  }

});