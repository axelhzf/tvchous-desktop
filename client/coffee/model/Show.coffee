angular.module("app").factory "Show", (Model) ->
  class Show extends Model
    constructor: (attributes) ->
      super attributes
      @id = @title.replace(/\s/g, ".")