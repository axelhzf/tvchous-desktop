pirateship = require "pirateship"

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

angular.module("app").service "pirateshipProvider", PirateShipProvider