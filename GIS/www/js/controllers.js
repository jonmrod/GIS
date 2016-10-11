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
  var file1 = {};
  var file2 = {};
  $scope.pic1 = {};
  $scope.pic2 = {};
  $scope.distance = null;

  $scope.selectFirstFile = function($files) {
    $scope.distance = null;
    file1 = $scope.pic1 = $files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file1);
    reader.onload = function(e) {
      EXIF.getData(file1, function() {
        console.log(EXIF.pretty(this));
        var lati = EXIF.getTag(this, 'GPSLatitude');
        var long = EXIF.getTag(this, 'GPSLongitude');
        var latiRef = EXIF.getTag(this, 'GPSLatitudeRef') || "N";
        var longRef = EXIF.getTag(this, 'GPSLongitudeRef') || "W";
        var orien = EXIF.getTag(this, 'GPSInfoIFDPointer');
        lati = (lati[0] + lati[1]/60 + lati[2]/3600) * (latiRef == "N" ? 1 : -1); 
        long = (long[0] + long[1]/60 + long[2]/3600) * (longRef == "W" ? -1 : 1);
        file1 = {
          lat: lati,
          lng: long,
          orien: orien
        }
      });
      $scope.$apply(function() {
        $scope.ImageSrc = e.target.result;
      });  
    }
  } 
  $scope.selectSecondFile = function($files) {
    $scope.distance = null;
    file2 = $scope.pic2 = $files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file2);
    reader.onload = function(e) {
      EXIF.getData(file2, function() {
        console.log(EXIF.pretty(this));
        var lati = EXIF.getTag(this, 'GPSLatitude');
        var long = EXIF.getTag(this, 'GPSLongitude');
        var latiRef = EXIF.getTag(this, 'GPSLatitudeRef') || "N";
        var longRef = EXIF.getTag(this, 'GPSLongitudeRef') || "W";
        var orien = EXIF.getTag(this, 'GPSInfoIFDPointer');
        lati = (lati[0] + lati[1]/60 + lati[2]/3600) * (latiRef == "N" ? 1 : -1); 
        long = (long[0] + long[1]/60 + long[2]/3600) * (longRef == "W" ? -1 : 1);
        file2 = {
          lat: lati,
          lng: long,
          orien: orien
        }
      });
      $scope.$apply(function() {
        $scope.ImageSrc = e.target.result;
      });  
    }
  } 
  $scope.submitGeo = function() {
    if (file1 && file2) {
      console.log(file1);
      console.log(file2);
      startMap(file1, file2);
      var p1 = new google.maps.LatLng(file1.lat, file1.lng);
      var p2 = new google.maps.LatLng(file2.lat, file2.lng);
      $scope.distance = google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1609.344;
    }
  }
  function startMap (file1, file2) {
    var lat = file1.lat;
    var lng = file1.lng;
    var bound = new google.maps.LatLngBounds();
    bound.extend( new google.maps.LatLng(file1.lat, file1.lng));
    bound.extend( new google.maps.LatLng(file2.lat, file2.lng));
    // var overlay;
    // USGSOverlay.prototype = new google.maps.OverlayView();

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var Symbol1 = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 5,
      fillOpacity: 0.0,
      rotation: file1.orien
    };
    new google.maps.Marker({
      position: new google.maps.LatLng(file1.lat, file1.lng), 
      map: map,
      animation: google.maps.Animation.DROP,
      icon: Symbol1
    });
    var Symbol2 = {
      path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
      scale: 5,
      fillOpacity: 0.0,
      rotation: file2.orien
    };
    new google.maps.Marker({
      position: new google.maps.LatLng(file2.lat, file2.lng), 
      map: map,
      animation: google.maps.Animation.DROP,
      icon: Symbol2
    });

    map.fitBounds(bound);

    var flightPlanCoordinates = [
      {lat: file1.lat, lng: file1.lng},
      {lat: file2.lat, lng: file2.lng}
    ];
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);

    // var bounds = new google.maps.LatLngBounds(
    //   new google.maps.LatLng(lat - .0001, lng - .0001),
    //   new google.maps.LatLng(lat + .0001, lng + .0001));

    //     // The custom USGSOverlay object contains the USGS image,
    //     // the bounds of the image, and a reference to the map.
    //     overlay = new USGSOverlay(bounds, $scope.ImageSrc, map);

    //     /** @constructor */
    //     function USGSOverlay(bounds, image, map) {

    //     // Initialize all properties.
    //     this.bounds_ = bounds;
    //     this.image_ = image;
    //     this.map_ = map;

    //     // Define a property to hold the image's div. We'll
    //     // actually create this div upon receipt of the onAdd()
    //     // method so we'll leave it null for now.
    //     this.div_ = null;

    //     // Explicitly call setMap on this overlay.
    //     this.setMap(map);
    //   }

    //   USGSOverlay.prototype.onAdd = function() {

    //     var div = document.createElement('div');
    //     div.style.borderStyle = 'none';
    //     div.style.borderWidth = '0px';
    //     div.style.position = 'absolute';

    //     // Create the img element and attach it to the div.
    //     var img = document.createElement('img');
    //     img.src = this.image_;
    //     img.style.width = '100%';
    //     img.style.height = '100%';
    //     img.style.position = 'absolute';
    //     img.style.opacity = '0.75';
    //     div.appendChild(img);

    //     this.div_ = div;

    //     // Add the element to the "overlayLayer" pane.
    //     var panes = this.getPanes();
    //     panes.overlayLayer.appendChild(div);
    //   };

    //   USGSOverlay.prototype.draw = function() {

    //     var overlayProjection = this.getProjection();
    //     var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
    //     var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

    //     var div = this.div_;
    //     div.style.left = sw.x + 'px';
    //     div.style.top = ne.y + 'px';
    //     div.style.width = (ne.x - sw.x) + 'px';
    //     div.style.height = (sw.y - ne.y) + 'px';
    //   };
    }
    DisplayGeoData = function(res) {
      EXIF = res;
      console.log(EXIF);
    }
  });
