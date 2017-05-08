angular
    .module('RDash')
    .controller('EventsCtrl', ['$scope', 'AppService', EventsCtrl]);

function EventsCtrl($scope, AppService) {
    $scope.events = [];

    $scope.doRefresh = function() {
      AppService.getEvents().then(submitSuccess, submitFailed);
    };

    $scope.deleteEvent = function(building, eventId, index) {
      AppService.removeEvent(building, eventId).then(removeSuccess(index), submitFailed);
    }

    function removeSuccess(index) {
      $scope.events.splice(index, 1);
    }

    function submitSuccess(res) {
      // for (var index in res.data) {
      //   $scope.events.unshift(res.data[index].events)
      // }
      // console.log(res.data);
      $scope.events = res.data[0].events;
    };

    function submitFailed(res) {
      console.log(res.data);
    };

    $scope.doRefresh();
}
