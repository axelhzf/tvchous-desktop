var dnode = require('dnode');
var thunkify = require("thunkify");
var glob = thunkify(require("glob"));
var path = require("path");
var co = require("co");
var exec = require("co-exec");
var Utorrent = require('utorrent-api');
var subtitlesDownloader = require("subtitles-downloader");
var npid = require('npid');
var cfs = require("co-fs");
var filter = require("co-filter");

var PATH_DOWNLOADED = process.env.PATH_DOWNLOADED;
var PATH_SHOWS = process.env.PATH_SHOWS;
var UTORRENT_PORT = process.env.UTORRENT_PORT;
var UTORRENT_USER = process.env.UTORRENT_USER;
var UTORRENT_PASSWORD = process.env.UTORRENT_PASSWORD;

var utorrent = new Utorrent('localhost', UTORRENT_PORT);
utorrent.setCredentials(UTORRENT_USER, UTORRENT_PASSWORD);
var utorrentCall = thunkify(utorrent.call.bind(utorrent));

var downloadSubtitle = thunkify(subtitlesDownloader.downloadSubtitle);

var server = dnode({
  basePath: function (cb) {
    return cb(null, PATH_SHOWS);
  },
  filesFromBasePath: function (filesGlob, cb) {
    co(function *() {
      var files = yield glob(path.join(PATH_SHOWS, filesGlob));
      return files;
    })(cb);
  },
  torrentList: function (cb) {
    co(function *() {
      return yield utorrentCall("list");
    })(cb);
  },
  downloadTorrent: function (link, cb) {
    co(function *() {
      return yield exec("open /Applications/uTorrent.app " + link);
    })(cb);
  },
  downloadSubtitle: function (file, lang, cb) {
    co(function* () {
      yield downloadSubtitle(file, lang);
    })(cb);
  },
  downloadedFolders: function (cb) {
    co(function* () {
      var downloadedFiles = yield cfs.readdir(PATH_SHOWS);
      var downloadedDirectories = yield filter(downloadedFiles, function* (file) {
        var stat = yield cfs.stat(path.join(PATH_SHOWS, file));
        return stat.isDirectory();
      });
      return downloadedDirectories;
    })(cb);
  }
});

exports.start = function (cb) {
  co(function* () {
    var npid = require('npid');
    var PID_FILE = "./tvchous.pid";
    try {
      var pid = npid.create(PID_FILE);
      pid.removeOnExit();
    } catch (err) {
      if (err.code !== "EEXIST") {
        process.exit(1);
      }
      var pid = yield cfs.readFile(PID_FILE, {encoding: "utf-8"});
      pid = parseInt(pid, 10);

      try {
        yield exec("kill -9 " + pid);
      } catch (e) {
      }
      yield cfs.unlink(PID_FILE);
      var pid = npid.create(PID_FILE);
      pid.removeOnExit();
    }
    try {
      server.listen(5004);
    } catch (e) {

    }
  })(cb);
};
