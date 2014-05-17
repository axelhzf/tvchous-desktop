var Timer = require("./client/js/service/timer");
var each = require("co-each");

angular.module("app").factory("episodeUpdaterService", function ($rootScope) {
  var tasks = [];
  var watchedEpisodes = [];
  var timer = new Timer(periodic, 3000);

  function addTask(task) {
    tasks.push(task);
  }

  function removeTask(task) {
    var index = tasks.indexOf(task);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  }

  function watch(episode) {
    watchedEpisodes.push(episode);
    watchedEpisodes = _.unique(watchedEpisodes);
    if (watchedEpisodes.length > 0) {
      timer.start();
    }
  }

  function stopWatch(episode) {
    watchedEpisodes = _.without(watchedEpisodes, episode);
    if (watchedEpisodes.length === 0) {
      timer.stop();
    }
  }

  function* periodic() {
    for(var i= 0; i < tasks.length; i++) {
      yield tasks[i](watchedEpisodes);
    }

    if (!$rootScope.$$phase) {
      $rootScope.$apply();
    }

  }

  return {
    addTask: addTask,
    removeTask: removeTask,
    watch: watch,
    stopWatch: stopWatch
  };

});