angular.module('RDash')
  .service('AppService', ['$http', AppService]);

  function AppService($http) {
    var API = "http://yoda.kean.edu:8000/";
    var self = this;

    self.getBuildings = function () {
      return $http.get(API + "buildings");
    };
    self.getEvents = function(position) {
      return $http.get(API + "buildings/events");
    }
    self.getBuildingInfo = function () {
      return $http.get(API + "buildings/info");
    }
    self.submitNewEvent = function(building, title, content, date, start, end, floor, room) {
      return $http.post(API + "buildings/newEvent", {
        building: building,
        title: title,
        content: content,
        date: date,
        start: start,
        end: end,
        floor: floor,
        room: room
      })
    }
    self.removeEvent = function (building, eventId) {
      return $http.post(API + "buildings/removeEvent", {
        building: building,
        eventId: eventId
      })
    }
  }