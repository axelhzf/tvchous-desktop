var defer = require("co-defer");
var co = require("co");

function Timer (gen, timeout) {
  this.gen = gen;
  this.timeout = timeout;
  this._intervalObject = undefined;
}

Timer.prototype = {
  start: function () {
    if (!this._intervalObject) {
      defer.nextTick(this.gen);
      this._intervalObject = defer.setInterval(this.gen, this.timeout);
    }
  },
  stop: function () {
    if (this._intervalObject) {
      clearInterval(this._intervalObject);
      this._intervalObject = undefined;
    }
  }
};

module.exports = Timer;