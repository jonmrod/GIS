// Set up
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
var conn = mongoose.createConnection('mongodb://4961:4961@69.114.186.143:27017/buildings');

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride()); 
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Models
var Building = conn.model('building', {
  title: String,
  floors: String,
  content: String,
  events: [{
    title: String,
    content: String,
    floor: String,
    date: String,
    timeStart: String,
    timeEnd: String,
    img: String
  }]
});

// Routes

//get all buildings
app.get('/buildings', function(req, res) {
    Building.find({}, 'title floors content location events', function(err, building) {
      if (err) {
        res.send(err);
      } else {
        res.json(building);
      }
    });
  })
//get floors
app.get('/buildings/info', function(req, res) {
    Building.find({}, 'title floors', function(err, building) {
      if (err) {
        res.send(err);
      } else {
        res.json(building);
      }
    });
  })

//new brunch
app.post('/api/brunches', function(req, res) {
  var brunch = new Brunch();
  brunch.title = req.body.title;
  brunch.type = req.body.type;
  brunch.content = req.body.content;
  brunch.location = req.body.location;
  brunch.votes = 0;
  brunch.createdBy = req.body.createdBy;
  brunch.idOfCreator = req.body.idOfCreator;
  brunch.imgOfCreator = req.body.imgOfCreator;
  brunch.createdAt = new Date();

  brunch.save(function(err, brunch) {
    if (err)
      res.send(err);
    res.json({ message: 'brunch created!' });
  });
});
//get event by id
// app.get('/api/brunches/:brunchId', function(req, res) {
//   Brunch.findById(req.params.brunchId, function(err, brunch) {
//     if (err)
//       res.send(err);
//     res.json(brunch);
//   });
// });
//delete brunch
// app.delete('/api/brunches/:brunchId', function(req, res) {
//   Brunch.remove({
//     _id: req.params.brunchId
//   }, function(err, brunch) {
//     if (err)
//       res.send(err);

//     res.json({ message: 'Successfully deleted' });
//   });
// });

// app.post('/api/upvoteBrunch/:brunchId', function(req, res) {
//     Brunch.update({
//       _id: req.params.brunchId
//     }, { $inc: { votes: 1 } }, function(err, brunch) {
//       if (err)
//         res.send(err);

//       res.json({ message: 'Successfully upvoted' });
//     });
//   })

//new building event
app.post('/api/event/new', function(req, res) {
  Building.update({
    _id: req.body.brunchId
  }, {
    $push: {
      comments: {
        comment: req.body.comment,
        name: req.body.userName,
        img: req.body.img,
        createdAt: new Date()
      }
    }
  }, function(err, brunch) {
    if (err)
      res.send(err);

    res.json({ message: 'Successfully commented' });
  });
})

// listen (start app with node server.js) ======================================
app.listen(8000);
console.log("App listening on port 8080");

/*
db.createUser( { user: "4961",
              pwd: "4961",
              roles: [ "readWrite", "dbAdmin" ]
            } )

db.buildings.insert({
  title: "North Ave Academic Building",
  content: "New academic building which houses the school of Computer Science",
  floors: 6,
    location : {
    type: "polygon",
    coordinates: [[40.676703,-74.228504],[40.676753,-74.228443],[40.676556,-74.228222],[40.676455,-74.228352],[40.67635,-74.228168],
[40.676352,-74.228075],
[40.676265,-74.228096],
[40.676136,-74.228067],
[40.676118,-74.22816],
[40.67613,-74.228372],
[40.676212,-74.228375],
[40.676313,-74.22852],
[40.67635,-74.228726],
[40.676415,-74.228737],
[40.676495,-74.228801],
[40.676521,-74.228818],
[40.676531,-74.228903],
[40.676537,-74.22896],
[40.676533,-74.229029],
[40.676572,-74.229102],
[40.676633,-74.229107],
[40.676651,-74.229046],
[40.676763,-74.228839],
[40.676871,-74.228834],
[40.676909,-74.228769],
[40.676903,-74.2287],
[40.676771,-74.228606]]
},
  events: [{
    title: "",
    content: "",
    start: "",
    end: "",
    date: "",
    floor: ""
  }]
})

db.buildings.find(
   {
     location: {
       $geoWithin: {
          $geometry: {
             type : "polygon" ,
             coordinates: [[[40.676871,-74.228834],
[40.676909,-74.228769],
[40.676903,-74.2287],
[40.676771,-74.228606]]]
          }
       }
     }
   }
)
db.buildings.find({
    "location": {
        "$geoIntersects": {
            "$geometry": {
                "type": "polygon",
                "coordinates": [
                    [
                        [
                            -31.593275757633,
                            115.8574693
                        ],
                        [
                            -31.596763066914,
                            115.91624693005
                        ],
                        [
                            -32.087153956437,
                            116.25114123685
                        ],
                        [
                            -32.13233852915,
                            116.22535569049
                        ],
                        [
                            -32.174036124673,
                            116.19236795072
                        ],
                        [
                            -32.304841443191,
                            115.76898154226
                        ],
                        [
                            -32.290955790481,
                            115.7119268346
                        ],
                        [
                            -31.841206471153,
                            115.45474133646
                        ],
                        [
                            -31.794742552646,
                            115.4770638401
                        ],
                        [
                            -31.751364552714,
                            115.50675244396
                        ],
                        [
                            -31.711911850434,
                            115.5432228167
                        ],
                        [
                            -31.677146863424,
                            115.58576206658
                        ],
                        [
                            -31.607157892898,
                            115.74104502522
                        ],
                        [
                            -31.596763066914,
                            115.79869166995
                        ],
                        [
                            -31.593275757633,
                            115.8574693
                        ]
                    ]
                ]
            }
        }
    }
})
db.buildings.find({
    location: {
        $geoIntersects: {
            $geometry: {
                type: "Point" ,
                coordinates: [40.676703,-74.228504]
            }
        }
    }
})
db.buildings.find({
    location: {
        $geoIntersects: {
            $geometry: {
                type: "Point" ,
                coordinates: [0.005,0.005]
            }
        }
    }
})
db.buildings.insert({location:{type:"Polygon",
coordinates:[[[0,0],[0.3,0],[0.3,0.3],[0,0]]]}
})
[40.676834,-74.228759],[40.676588,-74.228882],[40.676161,-74.228278],[40.676289,-74.228109]
db.buildings.find( {location: {$geoIntersects: {$geometry: {type: "Point", coordinates : [40.676653,-74.228874] }}}}).count();
db.buildings.find( { location: { $geoIntersects: { $geometry: { type : "Polygon" ,coordinates: [ [ [ -75, 70 ], [ -75, -70 ], [ 75, -70 ], [ 75, 70 ],[ -75, 70 ] ] ]} }}})
db.buildings.find({"location":{$geoIntersects: {$geometry:{ type : "Point","coordinates" : [ 40.676653,-74.228874 ] }}}});
db.buildings.find({
    'location': {$geoInteresects: {$geometry: {
    type: 'Point',
    coordinates: [ 40.676653,-74.228874 ]
}}});
db.buildings.insert({location:{type:"Polygon",
coordinates: [[[40.676703,-74.228504],[40.676753,-74.228443],[40.676556,-74.228222],[40.676455,-74.228352],[40.67635,-74.228168],[40.676352,-74.228075],[40.676265,-74.228096],[40.676136,-74.228067],[40.676118,-74.22816],[40.67613,-74.228372],[40.676212,-74.228375],[40.676313,-74.22852],[40.67635,-74.228726],[40.676415,-74.228737],[40.676495,-74.228801],[40.676521,-74.228818],[40.676531,-74.228903],[40.676537,-74.22896],[40.676533,-74.229029],[40.676572,-74.229102],[40.676633,-74.229107],[40.676651,-74.229046],[40.676763,-74.228839],[40.676871,-74.228834],[40.676909,-74.228769],[40.676903,-74.2287],[40.676771,-74.228606]]]}})
db.buildings.find( {"location":{"$geoIntersects":{"$geometry":{"type":"Point","coordinates":[40.676653,-74.228874]}}}}, {"title":"North Ave Academic Building"} ).explain();
db.buildings.find({location:
                 {$geoWithin:
                     {$geometry:{ "type" : "Point",
                          "coordinates" : [ -31.593275757633, 115.8574693 ] }
                      }
                  }
             });
*/