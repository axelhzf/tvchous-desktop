var humanizeEta = require("./client/js/filter/humanizeEta");

angular.module("app").filter("humanizeEta", function () {
  return humanizeEta;
});

