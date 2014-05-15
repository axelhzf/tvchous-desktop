var thunkify = require("thunkify");
var subtitlesDownloader = require("subtitles-downloader");
var _downloadSubtitle = thunkify(subtitlesDownloader.downloadSubtitle);

angular.module("app").factory("subtitlesService", function () {

  function* downloadSubtitle (file, lang) {
    console.log("download subtitle", file, lang);
    yield _downloadSubtitle(file, lang);
  }

  return {
    downloadSubtitle: downloadSubtitle
  }
});