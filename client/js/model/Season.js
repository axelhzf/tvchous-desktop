angular.module("app").factory("Season", function () {

  function Season (attributes) {
    _.extend(this, attributes);
    this.episodes_count = this.episodes;
    this.episodes = undefined;
    this.id = _.string.lpad(this.season, 2, "0");
  }

  return Season;
});







