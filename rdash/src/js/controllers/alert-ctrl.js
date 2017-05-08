/**
 * Alerts Controller
 */

angular
    .module('RDash')
    .controller('AlertsCtrl', ['$scope', 'AppService', AlertsCtrl]);

function AlertsCtrl($scope, AppService) {
    $scope.alerts = [];

    $scope.addAlert = function() {
        $scope.alerts.push({
            type: 'success',
            msg: 'Another alert!'
        });
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.submit = function() {
      AppService.submitNewEvent($scope.data.building, $scope.data.title, $scope.data.content, $scope.data.dt, $scope.data.startTime, $scope.data.endTime, $scope.data.floor, $scope.data.room).then(submitSuccess, submitFailed);
    };

    function submitSuccess(res) {
      $scope.alerts.push({
          type: 'success',
          msg: res.data.message
      });
       $scope.data = null;
    };

    function submitFailed(res) {
      $scope.alerts.push({
          type: 'danger',
          msg: res.data
      });
      $scope.data = null;
    };
}
