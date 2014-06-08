var path = require("path");
var each = require("co-each");
var parallel = require("co-parallel");
var remote = require("./client/js/service/remote");
var configuration = require("./client/js/service/configuration");

angular.module("app").factory("fileSystemService", function () {

  function* updateEpisodes (episodes) {
    yield parallel(episodes.map(episodeLocalInfo), 5);
  }

  function* episodeLocalInfo (episode) {
    episode.local = {};
    episode.local.file = yield episodeLocalFile(episode);
    episode.local.mountFile = yield mountFile(episode.local.file);
    episode.local.subtitles = yield episodeLocalSubtitles(episode);
  }

  function* episodeLocalFile (episode) {
    var fileGlob = path.join(episode._show.id, "*.+(mkv|avi|mp4)");
    var files = yield remote.filesFromBasePath(fileGlob);
    return _.find(files, episode.match.bind(episode));
  }

  function* mountFile(file) {
    var runAs = configuration.get("runAs");
    if (runAs === "remote") {
      var mount = configuration.get("remoteMount");
      if (file && mount ) {
        var basePath = yield remote.basePath();
        return path.join(mount, file.substring(basePath.length));
      }
    }
  }

  function* episodeLocalSubtitles (episode) {
    var fileGlob = path.join(episode._show.id, "*.+(srt)");
    var files = yield remote.filesFromBasePath(fileGlob);
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