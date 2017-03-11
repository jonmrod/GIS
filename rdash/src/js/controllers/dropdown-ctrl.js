angular.module('RDash').controller('DropDown', ['$scope', 'GIS', DropDown]);

    function DropDown($scope) {

    function getInfo() {
      GIS.getInfo().then(fillFields, showError);
    };
    getInfo();

    $scope.building = {
        options: [
            'NAAB',
            'GLAB',
            'STEM'
        ],
        selected: 'NAAB'
    };

    $scope.floor = {
        options: [
            'Building wide event',
            'Floor 1',
            'Floor 2',
            'Floor 3',
            'Floor 4',
            'Floor 5',
            'Floor 6'
        ],
        selected: 'Building wide event'
    };

    $scope.room = {
        options: [
            'Floor wide event',
            'Room 109',
            'Room 113',
            'Room 115'
        ],
        selected: 'Floor wide event'
    };

    function fillFields(res) {
      console.log(res.data);
    }

    function showError(res) {
      console.log(res.data);
    }

}