async = require "async"
fs = require "fs"
path = require "path"
glob = require "glob"

BASE_PATH = "/Users/axelhzf/dev/js/tvchous/download_test"

class FileSystemService
  fillEpisodesFile: (episodes, cb) ->
    async.mapSeries(episodes, @fillEpisodeFile, cb)

  fillEpisodeFile: (episode, cb) ->
    fileGlob = path.join(BASE_PATH, "The.Big.Bang.Theory", "*#{episode.id()}*.+(mkv|avi|mp4)")
    console.log fileGlob
    glob fileGlob, (err, files) ->
      console.log files
      episode.file = files[0] if files.length
      cb null


angular.module("app").service "fileSystemService", FileSystemService