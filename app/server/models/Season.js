var _ = require("underscore");
var _s = require("underscore.string");

module.exports = Season;

function Season (attributes) {
  _.extend(this, attributes);
  this.episodes_count = this.episodes;
  this.episodes = undefined;
  this.id = _s.lpad(this.season, 2, "0");
}









