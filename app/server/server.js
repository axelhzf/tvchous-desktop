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
var downloadPostProcess = require("download-post-process");
var mkdirp = thunkify(require("mkdirp"));
var configuration = require("../client/js/service/configuration");


require("./socketServer");


var utorrentCall;
var watcher;

var downloadSubtitle = thunkify(subtitlesDownloader.downloadSubtitle);
var downloadSubtitle = thunkify(subtitlesDownloader.downloadSubtitle);

var server = dnode({
  basePath: function (cb) {
    return cb(null, configuration.get("tvshowsFolder"));
  },
  filesFromBasePath: function (filesGlob, cb) {
    co(function *() {
      var folder = configuration.get("tvshowsFolder");
      var files = yield glob(path.join(folder, filesGlob));
      return files;
    })(cb);
  },
  torrentList: function (cb) {
    co(function *() {
      var torrentList = yield utorrentCall("list");
      return torrentList;
    })(cb);
  },
  downloadSubtitle: function (file, lang, cb) {
    co(function* () {
      try {
        yield downloadSubtitle(file, lang);
      } catch(e) {
        console.log("error", e);
      }
    })(cb);
  },
  downloadedFolders: function () {

  }
}, {
  weak: false
});

exports.start = function (cb) {
  co(function* () {
    try {
      configureUtorrent();
      yield startPostProcess();
      yield startServer();
    }catch(e) {
      console.log("error starting server", e);
    }
  })(cb);
};

exports.stop = function () {
  if (server) {
    server.end();
  }
  stopPostProcess();
};

function configureUtorrent () {
  var port = configuration.get("utorrentPort");
  var user = configuration.get("utorrentUser");
  var password = configuration.get("utorrentPassword");

  var utorrent = new Utorrent('localhost', port);
  utorrent.setCredentials(user, password);
  utorrentCall = thunkify(utorrent.call.bind(utorrent));
}

function* startPostProcess () {
  var basePath = configuration.get("downloadedFolder");
  var destPath = configuration.get("tvshowsFolder");

  try {
    yield createIfNotExists(basePath);
    yield createIfNotExists(destPath);

    watcher = downloadPostProcess.watcher(basePath, destPath);
    watcher.start();
  } catch(e) {
    debugger;
    console.log("postProcess service error", e);
  }
}

function* createIfNotExists(folder) {
  var exist = yield cfs.exists(folder);
  if (!exist) {
    yield mkdirp(folder);
  }
}

function stopPostProcess () {
  if (watcher) {
    watcher.stop();
    watcher = undefined;
  }
}

function* startServer () {
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
    if(pid === process.pid) {
      return;
    }

    try {
      yield exec("kill -9 " + pid);
    } catch (e) {
    }
    yield cfs.unlink(PID_FILE);
    var pid = npid.create(PID_FILE);
    pid.removeOnExit();
  }
  try {
    server.listen(configuration.get("serverPort"));
  } catch (e) {

  }
}

process.on('exit', exports.stop);