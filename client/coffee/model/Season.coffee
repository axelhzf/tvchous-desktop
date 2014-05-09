angular.module("app").factory "Season", (Model) ->
  class Season extends Model
    constructor: (attributes) ->
      super attributes

      @episodes_count = @episodes
      @episodes = undefined
      @season = _.string.lpad(@season, 2, "0")

    id: ->
      #{}

