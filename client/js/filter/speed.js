var humanize = require("humanize");
angular.module("app").filter("speed", function () {
  return function (speed) {
    var humanSpeed = humanize.filesize(speed) + "/s";
    return humanSpeed;
  }
});