var path = require("path");
var thunkify = require("thunkify");
var each = require("co-each");
var parallel = require("co-parallel");
var client = require("./client/js/service/client");

angular.module("app").factory("fileSystemService", function (configurationService) {

  function* updateEpisodes (episodes) {
    yield parallel(episodes.map(episodeLocalInfo), 5);
  }

  function* episodeLocalInfo (episode) {
    episode.local = {};
    episode.local.file = yield episodeLocalFile(episode);
    episode.local.subtitles = yield episodeLocalSubtitles(episode);
  }

  function* episodeLocalFile (episode) {
    var fileGlob = path.join(episode._show.id, "*.+(mkv|avi|mp4)");
    var files = yield client.filesFromBasePath(fileGlob);
    return _.find(files, episode.match.bind(episode));
  }

  function* episodeLocalSubtitles (episode) {
    var fileGlob = path.join(episode._show.id, "*.+(srt)");
    var files = yield client.filesFromBasePath(fileGlob);
    files = _.filter(files, _.bind(episode.match, episode));
    var subtitles = _.map(files, subtitleInfoFromFile);
    return subtitles;
  }

  function subtitleInfoFromFile (file) {
    var lang = subtitleLanguage(file);
    return {
      file: file,
      lang: lang,
      country: countryFromLanguage(lang)
    };
  }

  function subtitleLanguage (file) {
    var matches = file.match(/\.(\w{2,3})\.srt/);
    var lang = matches ? matches[1] : undefined;
    return lang;
  }

  function countryFromLanguage (lang) {
    if (lang === "spa") return "es";
    if (lang === "eng") return "en";
    return lang;
  }

  return {
    updateEpisodes: updateEpisodes,
    episodeLocalInfo: episodeLocalInfo
  }
});