angular.module("app").factory "Episode", (Model) ->
  class Episode extends Model
    constructor: (attributes) ->
      super attributes
      @first_aired_date = new Date(@first_aired_iso)

    isAired: -> @first_aired_date.getTime() < new Date().getTime()