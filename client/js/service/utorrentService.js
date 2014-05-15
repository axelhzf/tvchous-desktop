var thunkify = require("thunkify");
var co = require("co");
var defer = require("co-defer");
var Client = require('utorrent-api');
var Timer = require("./client/js/service/timer");

var utorrent = new Client('localhost', '40959');
var user = process.env.UTORRENT_USER;
var password = process.env.UTORRENT_PASSWORD;
utorrent.setCredentials(user, password);

var utorrentCall = thunkify(_.bind(utorrent.call, utorrent));

angular.module("app").factory("utorrentService", function () {

  function* list () {
    var response = yield utorrentCall("list");
    var torrents = _.map(response.torrents, parseTorrent);
    return torrents;
  }

  function parseTorrent (torrent) {
    var keys = ["hash", "status", "name", "size", "percentProgress",
      "downloaded", "uploaded", "ratio", "uploadSpeed", "downloadSpeed",
      "eta", "label", "peersConnected", "peersSwarm", "seedConnected",
      "seedsSwarm", "availability"];
    return _.object(keys, torrent);
  }

  function* updateEpisodes (episodes) {
    try {
      var torrentList = yield list();
      _.each(episodes, function (episode) {
        var showId = episode._show.id;
        var episodeId = episode.fullId;

        episode.utorrent = _.find(torrentList, function (torrent) {
          return (torrent.name.indexOf(showId) !== -1 && torrent.name.indexOf(episodeId) !== -1);
        });
      });

    } catch (e) {
      console.log(e);
    }
  }

  return {
    list: list,
    updateEpisodes: updateEpisodes
  }

});