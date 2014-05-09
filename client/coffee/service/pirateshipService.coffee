pirateship = require "pirateship"

class PirateShipProvider
  constructor: () ->

  find: pirateship.find

angular.module("app").service "pirateshipProvider", PirateShipProvider