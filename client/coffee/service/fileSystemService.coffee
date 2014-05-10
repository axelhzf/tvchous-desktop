async = require "async"
fs = require "fs"
path = require "path"
glob = require "glob"

BASE_PATH = "/Users/axelhzf/dev/js/tvchous/download_test"

class FileSystemService
  fillEpisodes: (episodes, cb) ->
    async.series([
      _.partial(async.mapSeries, episodes, @fillEpisodeFile),
      _.partial(async.mapSeries, episodes, @fillEpisodeSubtitles)
    ], cb)

  fillEpisodeFile: (episode, cb) =>
    fileGlob = path.join(BASE_PATH, episode._show.id, "*#{episode.id}*.+(mkv|avi|mp4)")
    glob fileGlob, (err, files) ->
      episode.file = files[0] if files.length
      cb null

  fillEpisodeSubtitles: (episode, cb) =>
    fileGlob = path.join(BASE_PATH, episode._show.id, "*#{episode.id}*.+(srt)")
    glob fileGlob, (err, subtitlesFiles) =>
      episode.subtitles = _.map subtitlesFiles, (file) =>
        lang = @subtitleLanguage(file)
        subtitle =
          lang: lang,
          country: @countryFromLanguage(lang)
          file: file

      cb null

  subtitleLanguage: (file) =>
    matches = file.match(/\.(\w{2,3})\.srt/)
    lang = matches[1] if matches.length > 0
    lang

  countryFromLanguage: (lang) ->
    switch lang
      when "spa" then "es"
      when "eng" then "us"
      else lang

angular.module("app").service "fileSystemService", FileSystemService