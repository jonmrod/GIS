angular.module('RDash', ['ui.bootstrap', 'ui.router', 'ngCookies'])

.service('GIS', function($http) {
  var API = "http://localhost:8000/";
  var self = this;

  self.getInfo = function() {
    return $http.get(API + "buildings/info");
  }
  self.submitEvent = function (title, content, start, end, date, floor) {
    return $http.get(API + "buildings/events/new", {
      title: position.lat,
      content: position.lng,
      start: start,
      end: end,
      date: date,
      floor: floor
    })
  }
})