/**
 * Drop down Controller
 */

angular
    .module('RDash')
    .controller('DropDownCtrl', ['$scope', 'AppService', DropDownCtrl]);

    function DropDownCtrl($scope, AppService) {

    getBuildingInfo();
    $scope.building = [];

    function getBuildingInfo() {
      AppService.getBuildingInfo().then(InfoSuccess, InfoFailed);
    }

    function InfoSuccess(res) {
      var floor = parseInt(res.data[0].floors);
      $scope.building.push(res.data[0].title);
      var floors = [];
      for (var i = 1; i <= floor; i++) {
         floors.push(i);
      }
      $scope.floors = floors;
    }
    function InfoFailed(res) {
      console.log(res.data);
    }
    $scope.room = {
        options: [
            'Floor wide event',
            'Room 109',
            'Room 113',
            'Room 115'
        ],
        selected: 'Floor wide event'
    };

}