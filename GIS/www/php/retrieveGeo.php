<?php 
  header('Access-Control-Allow-Origin: http://localhost:8100'); 
  header("Access-Control-Allow-Credentials", "true");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  if (!empty($_FILES)) {
    $file_name = $_FILES['file']['tmp_name'];
    $image = basename($_FILES['file']['name']);
    //read exif data
    $exif = exif_read_data($file_name, 0, true);  // set gps data
    $gps = $exif["GPS"];
    $file = $exif["FILE"];
    $lon = getGps($gps["GPSLongitude"], $gps['GPSLongitudeRef']);
    $lat = getGps($gps["GPSLatitude"], $gps['GPSLatitudeRef']);
    $coords = array('lon' => "$lon", 'lat' => "$lat", 'filename' => "$file_name");
    // send lat and lng object
    header("Content-type: image/jpeg");
    echo json_encode($exif);
  }
  else {
    echo 'no files selected';
  }

  function getGps($exifCoord, $hemi) {
    $degrees = count($exifCoord) > 0 ? gps2Num($exifCoord[0]) : 0;
    $minutes = count($exifCoord) > 1 ? gps2Num($exifCoord[1]) : 0;
    $seconds = count($exifCoord) > 2 ? gps2Num($exifCoord[2]) : 0;

    $flip = ($hemi == 'W' or $hemi == 'S') ? -1 : 1;

    return $flip * ($degrees + $minutes / 60 + $seconds / 3600);
  }

  function gps2Num($coordPart) {
    $parts = explode('/', $coordPart);

    if (count($parts) <= 0)
      return 0;

    if (count($parts) == 1)
      return $parts[0];

    return floatval($parts[0]) / floatval($parts[1]);
  }
?>