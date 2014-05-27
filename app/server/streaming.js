var _ = require("underscore");
var path = require("path");
var peerflix = require("peerflix");
var address = require('network-address');
var subtitlesDownloader = require("subtitles-downloader");

var activeStreaming;

function Streaming (engine, torrent) {
  this.torrent = torrent;
  this.engine = engine;
  this.href = 'http://' + address() + ':' + engine.server.address().port + '/';
  this.filename = engine.server.index.name.split('/').pop().replace(/\{|\}/g, '');
  this.filelength = engine.server.index.length;
}

Streaming.prototype.close = function (cb) {
  var self = this;
  //TODO async not working?
  self.engine.server.close();
  self.engine.destroy();
  cb();
};

function tempPath () {
  return "./tmp";
}

function startStreamingTorrent (torrent, cb) {
  stopStreamingTorrent(function () {
    var engine = peerflix(torrent);
    engine.on("ready", function () {
      var streaming = new Streaming(engine, torrent);
      activeStreaming = streaming;

      var filepath = path.join(tempPath(), streaming.filename);
      subtitlesDownloader.downloadSubtitles({filepath: filepath, languages: ["eng", "spa"]}, function (err, subtitles) {
        cb(null, {href: streaming.href, subtitles: subtitles});
      });
    });
  })
}

function stopStreamingTorrent (cb) {
  if (activeStreaming) {
    activeStreaming.close(function () {
      activeStreaming = undefined;
      cb();
    });
  } else {
    cb();
  }
}

function getActiveStreamingTorrent () {
  if (activeStreaming) {
    return activeStreaming.torrent;
  }
}

exports.startStreamingTorrent = startStreamingTorrent;
exports.stopStreamingTorrent = stopStreamingTorrent;
exports.getActiveStreamingTorrent = getActiveStreamingTorrent;