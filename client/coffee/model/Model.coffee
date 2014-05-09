angular.module("app").factory "Model", ($http) ->
  class Model
    constructor: (attributes) ->
      _.extend(@, attributes)