angular.module("app").factory "Episode", (Model) ->
  class Episode extends Model
    constructor: (attributes) ->
      super attributes
      @first_aired_date = new Date(@first_aired_iso)
      @episode =  _.string.lpad(@episode, 2, "0")
      @season =  _.string.lpad(@season, 2, "0")

    isAired: -> @first_aired_date.getTime() < new Date().getTime()
    id: -> "S#{@season}E#{@episode}"