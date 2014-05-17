var exec = require("co-exec");
var client = require("./client/js/service/client");

angular.module("app").factory("execService", function () {

  function* downloadTorrent (link) {
    return yield client.downloadTorrent(link);
  }

  function* playFile (file) {
    return yield exec("open " + file);
  }

  return {
    downloadTorrent: downloadTorrent,
    playFile: playFile
  }

});