
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://4961:4961@imc.kean.edu:27017/building", function (err, db) {
    
    db.collection('buildings', function (err, collection) {
        
         collection.find().toArray(function(err, items) {
            if(err) throw err;    
            console.log(items);            
        });
        
    });
                
});