var second = 1;
var minute = 60 * second;
var hour = 60 * minute;
var day = 24 * hour;
var week = 7 * day;
var year = day * 365;
var month = year / 12;

function humanizeEta (eta) {
  var parts = [];

  function divideBy(unit, name) {
    if (eta > unit) {
      parts.push(Math.floor(eta / unit) + name);
      eta = eta % unit;
    }
  }

  divideBy(year, "y");
  divideBy(month, "m");
  divideBy(week, "w");
  divideBy(day, "d");
  divideBy(hour, "h");
  divideBy(minute, "m");
  divideBy(second, "s");

  return parts.slice(0, 2).join(" ");
}

module.exports = humanizeEta;