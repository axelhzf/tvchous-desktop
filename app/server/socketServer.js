var co = require("co");
var io = require("socket.io")("5001");

var showsService = require("./services/showsService");
var downloadedFolder = require("./services/downloadedFolder");
var torrents = require("./services/torrents");

var remoteMethods = {
  findShows: showsService.findShows,
  findShow: showsService.findShow,
  findSeason: showsService.findSeason,
  findEpisode: showsService.findEpisode,
  downloadedFolders: downloadedFolder.list,
  findTorrents: torrents.findTorrents,
  defaultTorrentForEpisode: torrents.defaultTorrentForEpisode,
  downloadTorrent: torrents.downloadTorrent
};

io.on("connect", function (socket) {
  socket.on("call", function (data) {
    var methodName = data.methodName;

    if (!remoteMethods[methodName]) {
      socket.emit("response", {id: data.id, error: "Method not found"});
      return;
    }

    co(function* () {
      try {
        var result = yield remoteMethods[methodName].apply(null, data.params);
        socket.emit("response", {id: data.id, data: result});
      } catch (e) {
        console.error("Socket error", e);
        socket.emit("response", {id: data.id, error: {message: e.message, stack: e.stack}});
      }
    })();

  });

});

