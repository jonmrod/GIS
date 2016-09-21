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

.controller('AccountCtrl', function(Upload, $scope, GeoData) {
  var EXIF = {};
  var file = {};
  $scope.picFile = {};
  $scope.onFileSelect = function($files) {
    file = $scope.picFile = $files[0];
  } 
  $scope.submitGeo = function() {
      Upload.upload({
        url: 'http://localhost:8000/retrieveGeo.php',
        data: {file: file}
      })
      .success(function(data, status, headers, config) {
        // file is uploaded successfully
        // console.log(data);
        startMap(data);
      });
  }
    function startMap (coordinates) {
      var lat = coordinates.lat;
      var lng = coordinates.lon;
      var latLng = new google.maps.LatLng(lat, lng);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Wait until the map is loaded
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });
      var infoWindow = new google.maps.InfoWindow({
        content: 'lat:' + lat + '<br>lon:' + lng 
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });
    });
    }
  DisplayGeoData = function(res) {
    EXIF = res;
    console.log(EXIF);
  }
});
