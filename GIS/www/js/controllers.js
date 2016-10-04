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
  var file = {};
  $scope.picFile = {};
  $scope.onFileSelect = function($files) {
    file = $scope.picFile = $files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(e) {
     $scope.$apply(function(){
      $scope.ImageSrc = e.target.result;
    });  
   }
 } 
 $scope.submitGeo = function() {
  EXIF.getData(file, function() {
    console.log(EXIF.pretty(this));
    var lati = EXIF.getTag(this, 'GPSLatitude');
    var long = EXIF.getTag(this, 'GPSLongitude');
    var latiRef = EXIF.getTag(this, 'GPSLatitudeRef') || "N";
    var longRef = EXIF.getTag(this, 'GPSLongitudeRef') || "W";
    var orien = EXIF.getTag(this, 'GPSInfoIFDPointer');
    lati = (lati[0] + lati[1]/60 + lati[2]/3600) * (latiRef == "N" ? 1 : -1); 
    long = (long[0] + long[1]/60 + long[2]/3600) * (longRef == "W" ? -1 : 1);
    startMap(lati,long, orien);
  });
}
function displayImage (coord) {
    // startMap(res.data)
    console.log(res);
  }
  function startMap (lati, long, orien) {
    var lat = lati;
    var lng = long;
    var latLng = new google.maps.LatLng(lat, lng);
    var overlay;
    USGSOverlay.prototype = new google.maps.OverlayView();

    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: latLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(lat - .0001, lng - .0001),
      new google.maps.LatLng(lat + .0001, lng + .0001));

        // The custom USGSOverlay object contains the USGS image,
        // the bounds of the image, and a reference to the map.
        overlay = new USGSOverlay(bounds, $scope.ImageSrc, map);

        /** @constructor */
        function USGSOverlay(bounds, image, map) {

        // Initialize all properties.
        this.bounds_ = bounds;
        this.image_ = image;
        this.map_ = map;

        // Define a property to hold the image's div. We'll
        // actually create this div upon receipt of the onAdd()
        // method so we'll leave it null for now.
        this.div_ = null;

        // Explicitly call setMap on this overlay.
        this.setMap(map);
      }

      USGSOverlay.prototype.onAdd = function() {

        var div = document.createElement('div');
        div.style.borderStyle = 'none';
        div.style.borderWidth = '0px';
        div.style.position = 'absolute';

        // Create the img element and attach it to the div.
        var img = document.createElement('img');
        img.src = this.image_;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.position = 'absolute';
        img.style.opacity = '0.75';
        div.appendChild(img);

        this.div_ = div;

        // Add the element to the "overlayLayer" pane.
        var panes = this.getPanes();
        panes.overlayLayer.appendChild(div);
      };

      USGSOverlay.prototype.draw = function() {

        var overlayProjection = this.getProjection();
        var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
        var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

        var div = this.div_;
        div.style.left = sw.x + 'px';
        div.style.top = ne.y + 'px';
        div.style.width = (ne.x - sw.x) + 'px';
        div.style.height = (sw.y - ne.y) + 'px';
      };
      var mySymbol = {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
        fillOpacity: 0.0,
        rotation: orien
      };
      var marker = new google.maps.Marker({
       position: latLng,
       map: map,
       animation: google.maps.Animation.DROP,
       icon: mySymbol
     });
      var infoWindow = new google.maps.InfoWindow({
        content: 'lat:' + lat + '<br>lon:' + lng
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open(map, marker);
      });

    }
    DisplayGeoData = function(res) {
      EXIF = res;
      console.log(EXIF);
    }
  });
