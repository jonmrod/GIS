angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('HomeCtrl', function($scope, $interval, $ionicLoading, $cordovaGeolocation, AppService) {
  $scope.data = {
     prop : {
      title: 'Intro to Programming Info Session',
      time: '3:45pm'
     }
  };

  $scope.position = {};
  $interval(function(){
    checkLocation();
    // $scope.doRefresh();
  }, 10);
  // $interval($scope.doRefresh, 10);
  getBuildings();

  $scope.doRefresh = function () {
    //delete objects not in area
    for (var index in $scope.data.buildings) {
      if(!inside([$scope.position.lat, $scope.position.lng],$scope.data.buildings[index].location.coordinates)) {
        // delete $scope.data.buildings[index];
      }
      console.log($scope.data.buildings[index].location.coordinates);
    }
    $scope.$broadcast('scroll.refreshComplete');
  }
  // vm.setPositions = function(pos) {
  //   vm.positions = angular.copy(pos);
  // };
  // NgMap.getMap().then(function(map) {
  //   vm.map = map;
  // });
  // vm.setPositions(vm.positions1);
  // vm.currentIndex = 0;
  // vm.selectNextCustomMarker = function() {
  //   vm.map.customMarkers[vm.currentIndex].removeClass('selected');
  //   vm.currentIndex = (vm.currentIndex+1) % vm.positions.length;
  //   vm.map.customMarkers[vm.currentIndex].addClass('selected');
  //   vm.currentPosition = vm.positions[vm.currentIndex];
  // }
  function getBuildings() {
    AppService.getBuildings().then(DisplayBuildings, DisplayFailed);
  }

  function showEvent(res) {
    $scope.data = res.data;
  }

  function eventError(res) {
    console.log(res);
  }

  function checkLocation() {
    var posOptions = {enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
      $scope.location = position.coords;
      $scope.position = {lat: position.coords.latitude,lng: position.coords.longitude};
      $scope.map.setCenter($scope.position);
    });
  }

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

  function DisplayBuildings(res) {
    $scope.data.buildings = res.data;
    $scope.doRefresh();
  }

  function DisplayFailed(res) {
    $scope.data.error = res.data;
  }

  function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
  };

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
