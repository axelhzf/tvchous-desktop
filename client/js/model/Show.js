angular.module("app").service("Show", function () {
  var Show = function (attributes) {
    _.extend(this, attributes);
    this.id = this.title.replace(/\s/g, ".");
  };
  return Show;
});