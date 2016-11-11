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

    res.send(recents);
});

app.listen(app.get('port'));
