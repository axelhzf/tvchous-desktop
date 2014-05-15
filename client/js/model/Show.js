var _ = require("underscore");

var Show = function (attributes) {
  _.extend(this, attributes);
  this.id = this.title.replace(/\s/g, ".");
  this.id = this.id.replace(/'/g, "");
};
module.exports = Show;