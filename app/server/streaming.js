var _ = require("underscore");
var path = require("path");
var peerflix = require("peerflix");
var address = require('network-address');
var subtitlesDownloader = require("subtitles-downloader");

exports.startStreamingTorrent = startStreamingTorrent;
exports.stopStreamingTorrent = stopStreamingTorrent;

var activeStreams = {};

function startStreamingTorrent (torrent, cb) {
  var activeStream = activeStreams[torrent];
  if (activeStream) return cb(null, activeStream.clientInfo());


  var engine = peerflix(torrent);
  engine.on("ready", function () {
    var streaming = new Streaming(engine, torrent);
    var filepath = path.join(tempPath(), streaming.filename);
    subtitlesDownloader.downloadSubtitles({filepath: filepath, languages: ["eng", "spa"]}, function (err, subtitles) {
      streaming.subtitles = subtitles;
      activeStreams[torrent] = streaming;
      cb(null, streaming.clientInfo());
    });
  });

}

function stopStreamingTorrent (torrent, cb) {
  var activeStream = activeStreams[torrent];
  if (activeStream) {
    activeStream.close(function () {
      delete activeStreams[torrent];
      cb();
    });
  } else {
    cb();
  }
}

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

Streaming.prototype.clientInfo = function () {
  return _.pick(this, "href", "subtitles");
};

function tempPath () {
  return "./tmp";
}