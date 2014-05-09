pirateship = require "pirateship"
exec = require('child_process').exec

class PirateShipProvider
  constructor: (@$q) ->

  find: (query) ->
    defer = @$q.defer();
    pirateship.find query, (err, results) ->
      if err
        defer.reject(err)
      else
        defer.resolve(results)
    defer.promise

  download: (link) ->
    console.log "download #{link}"
    cmd = "open /Applications/uTorrent.app #{link}"
    exec cmd





angular.module("app").service "pirateshipProvider", PirateShipProvider