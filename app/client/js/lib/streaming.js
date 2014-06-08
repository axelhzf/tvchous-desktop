var _ = require("underscore");
var path = require("path");
var peerflix = require("peerflix");
var address = require('network-address');
var subtitlesDownloader = require("subtitles-downloader");
var thunkify = require("thunkify");
var EventEmitter = require("events").EventEmitter;

exports.startStreamingTorrent = startStreamingTorrent;
exports.stopStreamingTorrent = stopStreamingTorrent;

var activeStreams = {};

function startStreamingTorrent (torrent) {
  var torrentStream = activeStreams[torrent];
  if (!torrentStream) {
    torrentStream = new TorrentStream(torrent);
    activeStreams[torrent] = torrentStream;
  } //todo torrents in ready state will not emit on ready
  return torrentStream;
}

function stopStreamingTorrent (torrent) {
  var torrentStream = activeStreams[torrent];
  if (torrentStream) {
    torrentStream.close();
    delete activeStreams[torrent];
  }
}

function TorrentStream (torrent) {
  this.events = new EventEmitter();
  this.subtitles = [];
  this.torrent = torrent;
  this.engine = peerflix(torrent);
  this.state = "idle";

  var self = this;
  this.engine.on("ready", function () {
    self.href = 'http://' + address() + ':' + self.engine.server.address().port + '/';
    self.filename = self.engine.server.index.name.split('/').pop().replace(/\{|\}/g, '');
    self.filelength = self.engine.server.index.length;

    var filepath = path.join(tempPath(), self.filename);
    subtitlesDownloader.downloadSubtitles({filepath: filepath, languages: ["eng", "spa"]}, function (err, subtitles) {
      self.subtitles = subtitles;
      if (self.state === "idle") {
        self.state = "active";
        self.events.emit("ready");
      } else if (self.state === "closed") {
        self.close();
      }
    });
  });

}

TorrentStream.prototype.close = function () {
  console.log("torrent stream close");
  var self = this;
  if (self.state === "idle") {
    self.state = "closed";
    return;
  }
  try {
    self.engine.destroy();
  } catch (e) {
  }
  try {
    self.engine.server.close();
  } catch (e) {
  }
  self.state = "closed";
};

TorrentStream.prototype.clientInfo = function () {
  return _.pick(this, "href", "subtitles");
};

function tempPath () {
  return "./tmp";
}