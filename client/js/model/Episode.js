var _ = require("underscore");
var _s = require("underscore.string");

function Episode (attributes) {
  _.extend(this, attributes);
  this.first_aired_date = new Date(this.first_aired_iso);
  this.season = _s.lpad(this.season, 2, "0");
  this.id = _s.lpad(this.episode, 2, "0");
  this.fullId = "S" + this._season.id + "E" + this.id;
}

Episode.prototype.isAired = function () {
  return this.first_aired_date.getTime() < new Date().getTime();
};

Episode.prototype.match = function (title) {
  var currentTitle = this._show.id + "." + this.fullId;
  return normalizeTitle(currentTitle) === normalizeTitle(title);
};

function normalizeTitle(title) {
  var episodeMatch = title.match(/([^/]*\.S\d\dE\d\d)/i);
  if (!episodeMatch) return;
  var tmp = episodeMatch[1];
  tmp = tmp.toLowerCase();
  tmp = tmp.replace(/[.' ]/g, "");
  return tmp;
}


module.exports = Episode;

