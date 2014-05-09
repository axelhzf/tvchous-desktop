angular.module("app").factory "Season", (Model) ->
  class Season extends Model
    constructor: (attributes) ->
      super attributes

      @episodes_count = @episodes
      @episodes = undefined


