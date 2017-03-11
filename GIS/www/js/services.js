angular.module('starter.services', [])

.service('AppService', function($http) {
  var API = "http://localhost:8000/";
  var self = this;

  self.getBuildings = function () {
    return $http.get(API + "buildings");
  };
  self.getEvents = function (position) {
    return $http.get(API + "buildings/events", {
      lat: position.lat,
      lng: position.lng
    })
  }
})

