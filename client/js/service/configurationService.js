var EventEmitter = require("events").EventEmitter;

angular.module("app").factory("configurationService", function () {

  var events = new EventEmitter();
  var configuration;

  if (localStorage.configuration) {
    try {
      configuration = JSON.parse(localStorage.configuration);
    }catch(e) {

    }
  }
  if (!configuration) {
    updateConfiguration({
      downloadedFolder: "/Users/axelhzf/Downloads/utorrent/downloaded",
      tvshowsFolder: "/Users/axelhzf/Downloads/utorrent/tvshows"
    });
  }

  function getConfiguration () {
    return _.extend({}, configuration);
  }

  function updateConfiguration (newConfiguration) {
    configuration = newConfiguration;
    events.emit("change");
    localStorage.configuration = JSON.stringify(configuration);
  }

  return {
    getConfiguration: getConfiguration,
    updateConfiguration: updateConfiguration,
    events: events
  }
});