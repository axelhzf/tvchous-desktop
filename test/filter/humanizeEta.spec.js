var humanizeEta = require("../../client/js/filter/humanizeEta");
var expect = require("chai").expect;

var second = 1;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;
var week = 7 * day;
var year = day * 365;
var month = year / 12;


describe("eta", function () {
  it("should humanize eta", function () {
    expect(humanizeEta(30 * second)).to.equal("30s");
    expect(humanizeEta(2 * minute + 30 * second)).to.equal("2m 30s");
    expect(humanizeEta(2 * hour + 2 * minute + 30 * second)).to.equal("2h 2m");
    expect(humanizeEta(2 * day + 2 * hour + 30 * second)).to.equal("2d 2h");
    expect(humanizeEta(2 * week + 2 * day + 30 * second)).to.equal("2w 2d");
    expect(humanizeEta(2 * month + 2 * week + 30 * second)).to.equal("2m 2w");
    expect(humanizeEta(2 * year + 2 * month + 30 * second)).to.equal("2y 2m");
  });
});