angular.module('app.controllers', [])

.controller('ChatsCtrl', function($scope) {})

.controller('DashCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, $interval, $ionicLoading, $cordovaGeolocation) {
  $scope.position = {};
  

  function checkLocation() {
    var posOptions = {enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
      $scope.location = position.coords;
      $scope.position = {lat: position.coords.latitude,lng: position.coords.longitude};
    });
  }

  $scope.$on('mapInitialized', function(event, map) {
    $scope.map = map;
  });

  $scope.centerOnMe= function(){
  $scope.positions = [];
    
    
    $ionicLoading.show({
      template: 'Loading...'
    });

    //position options
    var posOptions = {enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function(position) {
      var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      $scope.position = {lat: position.coords.latitude,lng: position.coords.longitude};
      $scope.direction = {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
        fillOpacity: 0.0,
        rotation: position.coords.heading
      };
      $scope.map.setCenter(pos);
      $ionicLoading.hide();
    });
    $interval(checkLocation, 100);
  };
})
