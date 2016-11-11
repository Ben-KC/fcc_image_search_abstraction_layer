var express = require('express'),
    mongo = require('mongodb').MongoClient;

var app = express();
var mongoURL = "mongodb://0.0.0.0:27017/searches";

app.set('port', process.env.PORT || 8080);

//search routing
app.get('/api/:search', function(req, res) {
    var search = req.params.search,
        offset = req.query.offset || 0;

    //store searches in db
    mongo.connect(mongoURL, function(err, db) {
        if(err) {
            console.error(err);
        };    

        var searches = db.collection('searches');
        searches.insert({search: search, time: new Date().getTime()});
        db.close();
    });

    res.send(JSON.stringify({search: search, offset: offset}));
});

//recent searches
app.get('/api/recent/searches', function(req, res) {
    var recents = [];

    //get searches from db
    mongo.connect(mongoURL, function(err, db) {
        if(err) {
            console.error(err); 
        };    

        var searches = db.collection('searches');
        searches.count({}, function(err, count) {
            if(err) {
                console.error(err); 
            }        

            var skipNum = count > 10 ? count - 10 : 0;

            searches.find().skip(skipNum).toArray(function(err, docs) {
                if(err) {
                    console.error(err); 
                }

                for(var i=0; i<docs.length; i++) {
                    var search = {
                        search: docs[i].search,
                        time: docs[i].time
                    }

                    recents.push(search);
                }

                res.send(recents);
                db.close();
            });
        });
    });
});

app.listen(app.get('port'));
