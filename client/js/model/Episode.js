angular.module("app").factory("Episode", function () {

  function Episode (attributes) {
    _.extend(this, attributes);
    this.first_aired_date = new Date(this.first_aired_iso);
    this.season = _.string.lpad(this.season, 2, "0");
    this.id = _.string.lpad(this.episode, 2, "0");
    this.fullId = "S" + this._season.id + "E" + this.id;
  }

  Episode.prototype.isAired = function () {
    return this.first_aired_date.getTime() < new Date().getTime();
  }

  return Episode;
});
