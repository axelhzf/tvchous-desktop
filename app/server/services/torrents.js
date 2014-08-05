var _ = require("underscore");
var co = require("co");
var exec = require("co-exec");
var thunkify = require("thunkify");
var pirateship = require("pirateship");

var findTorrents = thunkify(pirateship.find);

module.exports = {
  findTorrents: findTorrents,
  defaultTorrentForEpisode: defaultTorrentForEpisode,
  downloadTorrent: downloadTorrent
};

function* defaultTorrentForEpisode(episode) {
  if (!episode.torrents) {
    var q = episode.showId + " " + episode.fullId;
    console.log(q);
    episode.torrents = yield findTorrents(q);
  }
  var torrent = findHdTorrent(episode.torrents) || episode.torrents[0];
  return torrent;
}

function findHdTorrent(torrents) {
  return _.find(torrents, function (torrent) {
    return torrent.title.toLowerCase().indexOf("720p") !== -1;
  });
}

function *downloadTorrent (link) {
  return yield exec("open /Applications/uTorrent.app " + link);
}
