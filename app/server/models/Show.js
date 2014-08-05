var _ = require("underscore");

module.exports = Show;

function Show(attributes) {
  _.extend(this, attributes);
  this.id = this.title.replace(/\s/g, ".");
  this.id = this.id.replace(/'/g, "");
  this.id = this.id.replace(/:/g, "");
};
