var _ = require("underscore");
var peerflix = require("peerflix");
var address = require('network-address');

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

function startStreamingTorrent (torrent, cb) {
  stopStreamingTorrent(function () {
    var engine = peerflix(torrent);
    engine.on("ready", function () {
      var streaming = new Streaming(engine, torrent);
      activeStreaming = streaming;
      cb(null, streaming.href);
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