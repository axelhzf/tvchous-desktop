var expect = require("chai").expect;

var Show = require("../../client/js/model/Show");
var Season = require("../../client/js/model/Season");
var Episode = require("../../client/js/model/Episode");

describe("Episode", function () {
  describe("match", function () {

    it("should remove '", function () {
      var episode = createEpisode("Marvel's Agents of Shield", 1, 1);
      expect(episode.match("Marvels.Agents.of.Shield.S01E01.lol.mvk")).to.be.true;
    });

    it("should ignore case", function () {
      var episode = createEpisode("game.of.thrones", 1, 1);
      expect(episode.match("Game.of.Thrones.S01E01.lol.mvk")).to.be.true;
    });

  });
});

function createEpisode (showTitle, season, episode) {
  var show = new Show({title: showTitle});
  var season = new Season({season: season});
  var episode = new Episode({_season: season, _show: show, episode: episode});
  return episode;
}