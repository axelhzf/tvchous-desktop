var co = require("co");
var path = require("path");
var cfs = require("co-fs");
var filter = require("co-filter");
var configuration = require("../../client/js/service/configuration");

module.exports = {
  list: list
};

function *list () {
  var folder = configuration.get("tvshowsFolder");
  var downloadedFiles = yield cfs.readdir(folder);
  var downloadedDirectories = yield filter(downloadedFiles, function* (file) {
    var stat = yield cfs.stat(path.join(folder, file));
    return stat.isDirectory();
  });
  return downloadedDirectories;
}



