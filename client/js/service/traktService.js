TRAKT_API_KEY = process.env.TRAKT_API_KEY;
//TRAKT_BASE: "http://api.trakt.tv"
TRAKT_BASE = "http://localhost:3000/api";

var co = require("co");
var parallel = require("co-parallel");
var request = require("cogent");

angular.module("app").service("traktService", function (Show, Season, Episode, fileSystemService) {

  var shows;

  function* findShows () {
    if (shows) return shows;
    var url = TRAKT_BASE + "/shows/trending.json/" + TRAKT_API_KEY;
    shows = yield apiRequest(url, Show);
    return shows;
  }

  function* findShow (showId) {
    var shows = yield findShows();
    var show = _.findWhere(shows, {id: showId});
    if(!show) return;

    if (!show.seasons) {
      var url = TRAKT_BASE + "/show/seasons.json/" + TRAKT_API_KEY + "/" + show.imdb_id;
      show.seasons = yield apiRequest(url, Season);
    }
    return show;
  }

  function* findSeason(showId, seasonId) {
    var show = yield findShow(showId);
    var season = _.findWhere(show.seasons, {id: seasonId});
    if (!season) return;

    if(!season.episodes) {
      var url = TRAKT_BASE + "/show/season.json/" + TRAKT_API_KEY + "/" + show.imdb_id + "/" + season.season;
      var extraAttrs = {_season: season, _show: show};
      season.episodes = yield apiRequest(url, Episode, extraAttrs);

      //fill local info
      var fns = season.episodes.map(fileSystemService.episodeLocalInfo);
      yield parallel(fns, 5);
    }
    return season;
  }

  function* findEpisode(showId, seasonId, episodeId) {
    var season = yield findSeason(showId, seasonId);
    var episode = _.findWhere(season.episodes, {id: episodeId});
    return episode;
  }

  function* apiRequest(url, clazz, extraAttrs) {
    var res = yield request(url, true);
    var models = res.body;
    return _.map(models, function (model) {
      return new clazz(_.extend(model, extraAttrs));
    });
  }

  return {
    findShows: findShows,
    findShow: findShow,
    findSeason: findSeason,
    findEpisode: findEpisode
  }
});