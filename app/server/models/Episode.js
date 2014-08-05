var _ = require("underscore");
var _s = require("underscore.string");

module.exports = Episode;

function Episode (attributes) {
  _.extend(this, attributes);
  this.first_aired_date = new Date(this.first_aired_iso);
  this.season = _s.lpad(this.season, 2, "0");
  this.id = _s.lpad(this.episode, 2, "0");
  this.fullId = "S" + this.season + "E" + this.id;
  this.isAired = this.first_aired_date.getTime() < new Date().getTime();
}

Episode.prototype.match = function (title) {
  var currentTitle = this._show.id + "." + this.fullId;
  return normalizeTitle(currentTitle) === normalizeTitle(title);
};

Episode.prototype.isHd = function () {
  if(this.local && this.local.file) {
    var lowerFile = this.local.file.toLowerCase();
    return _s.contains(lowerFile, "720p") || _.contains(lowerFile, "720p");
  }
};

function normalizeTitle (title) {
  var episodeMatch = title.match(/([^/]*\.S\d\dE\d\d)/i);
  if (!episodeMatch) return;
  var tmp = episodeMatch[1];
  tmp = tmp.toLowerCase();
  tmp = tmp.replace(/[.' ]/g, "");
  return tmp;
}