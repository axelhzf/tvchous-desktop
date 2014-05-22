var TRAKT_BASE= "http://api.trakt.tv"

var co = require("co");
var parallel = require("co-parallel");
var request = require("cogent");
var thunkify = require("thunkify");
var Cacheman = require('cacheman');
var _ = require("underscore");
var md5 = require('MD5');
var configuration = require("./client/js/service/configuration");

var Show = require("./client/js/model/Show");
var Season = require("./client/js/model/Season");
var Episode = require("./client/js/model/Episode");

var cache = new Cacheman("trakt", {ttl: "3h", engine: "file"});
var cacheGet = thunkify(cache.get.bind(cache));
var cacheSet = thunkify(cache.set.bind(cache));

angular.module("app").service("traktService", function () {

  var shows;

  function* findShows () {
    var url = TRAKT_BASE + "/shows/trending.json/" + apiKey();
    shows = yield apiRequest(url, Show);
    return shows;
  }

  function* findShow (showId) {
    var shows = yield findShows();
    var show = _.findWhere(shows, {id: showId});
    if (!show) return;

    var url = TRAKT_BASE + "/show/seasons.json/" + apiKey() + "/" + show.imdb_id;
    show.seasons = yield apiRequest(url, Season);

    return show;
  }

  function* findSeason (showId, seasonId) {
    var show = yield findShow(showId);
    var season = _.findWhere(show.seasons, {id: seasonId});
    if (!season) return;

    var url = TRAKT_BASE + "/show/season.json/" + apiKey() + "/" + show.imdb_id + "/" + season.season;
    var extraAttrs = {_season: season, _show: show};
    season.episodes = yield apiRequest(url, Episode, extraAttrs);

    return season;
  }

  function* findEpisode (showId, seasonId, episodeId) {
    var season = yield findSeason(showId, seasonId);
    var episode = _.findWhere(season.episodes, {id: episodeId});
    return episode;
  }

  function* apiRequest (url, clazz, extraAttrs) {
    var cacheKey = md5(url);
    var models = yield cacheGet(cacheKey);
    if (!models) {
      var res = yield request(url, true);
      models = res.body;
      yield cacheSet(cacheKey, models);
    }

    var result = _.map(models, function (model) {
      return new clazz(_.extend(model, extraAttrs));
    });

    return result;
  }

  function apiKey () {
    return configuration.get("traktApiKey");
  }

  return {
    findShows: findShows,
    findShow: findShow,
    findSeason: findSeason,
    findEpisode: findEpisode
  }
});