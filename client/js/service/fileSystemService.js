var path = require("path");
var thunkify = require("thunkify");
var glob = thunkify(require("glob"));

BASE_PATH = "/Users/axelhzf/dev/js/tvchous/download_test";


angular.module("app").factory("fileSystemService", function () {

  function* episodeLocalInfo (episode) {
    episode.local = {};
    episode.local.file = yield episodeLocalFile(episode);
    episode.local.subtitles = yield episodeLocalSubtitles(episode);
  }

  function* episodeLocalFile (episode) {
    var fileGlob = path.join(BASE_PATH, episode._show.id, "*" + episode.fullId + "*.+(mkv|avi|mp4)");
    var files = yield glob(fileGlob);
    return files[0];
  }

  function* episodeLocalSubtitles (episode) {
    var fileGlob = path.join(BASE_PATH, episode._show.id, "*" + episode.fullId + "*.+(srt)");
    var files = yield glob(fileGlob);
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
    var lang = matches.length > 0 ? matches[1] : undefined;
    return lang;
  }

  function countryFromLanguage (lang) {
    if (lang === "spa") return "es";
    if (lang === "eng") return "us";
    return lang;
  }

  return {
    episodeLocalInfo: episodeLocalInfo
  }
});