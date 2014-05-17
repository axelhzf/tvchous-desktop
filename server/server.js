var dnode = require('dnode');
var thunkify = require("thunkify");
var glob = thunkify(require("glob"));
var path = require("path");
var co = require("co");
var exec = require("co-exec");
var Utorrent = require('utorrent-api');

var PATH_DOWNLOADED = process.env.PATH_DOWNLOADED;
var PATH_SHOWS = process.env.PATH_SHOWS;
var UTORRENT_PORT = process.env.UTORRENT_PORT;
var UTORRENT_USER = process.env.UTORRENT_USER;
var UTORRENT_PASSWORD = process.env.UTORRENT_PASSWORD;

var utorrent = new Utorrent('localhost', UTORRENT_PORT);
utorrent.setCredentials(UTORRENT_USER, UTORRENT_PASSWORD);
var utorrentCall = thunkify(utorrent.call.bind(utorrent));

var server = dnode({
  basePath: function () {
    return PATH_SHOWS;
  },
  filesFromBasePath: function (filesGlob, cb) {
    co(function *() {
      var files = yield glob(path.join(PATH_SHOWS, filesGlob));
      return files;
    })(cb);
  },
  torrentList : function (cb) {
    co(function *() {
      return yield utorrentCall("list");
    })(cb);
  },
  downloadTorrent: function (link, cb) {
    co(function *() {
      return yield exec("open /Applications/uTorrent.app " + link);
    })(cb);
  }
});

exports.start = function () {
  server.listen(5004);
};
