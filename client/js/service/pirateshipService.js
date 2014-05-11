var co = require("co");
var thunkify = require("thunkify");
var pirateship = require("pirateship");

angular.module("app").factory("pirateshipService", function () {
  return {
    findTorrents: thunkify(pirateship.find)
  };
});