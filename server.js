var express = require('express'),
    mongo = require('mongodb').MongoClient,
    https = require('https'),
    url = require('url');

//load my enviro variables
require('dotenv').config();

var app = express();
var mongoURL = "mongodb://0.0.0.0:27017/searches";

app.set('port', process.env.PORT || 8080);

//index page
app.use('/', express.static('public'));

//search routing
app.get('/api/:search', function(req, res) {
    var search = req.params.search,
        offset = req.query.offset || 0;

    //send request to Bing
    var options = {
       host: 'api.cognitive.microsoft.com',
       path: '/bing/v5.0/images/search?q='+encodeURIComponent(search)+'&count=10&offset='+offset,
       headers: {
            'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY
       }
    }

    var request = https.request(options, function(response) {
        var data = '';
        response.on('data', (d) => {
            data += d;
        });    

        response.on('end', function() {
            var results = JSON.parse(data).value;
            var toSend = [];
            for(var i=0; i<results.length; i++) {
                //so we can cut out the bing part
                var pURL = url.parse(results[i].contentUrl, true);
                var obj = {
                    imgURL : pURL.query.r,
                    pageURL : results[i].hostPageDisplayUrl,
                    pageTitle : results[i].name
                }                 

                toSend.push(obj);
            }

            res.send(JSON.stringify(toSend));
        });
    }); 
    
    request.on('error', (e) => {
        console.error(e)
    });
    
    request.end();

    //store searches in db
    mongo.connect(mongoURL, function(err, db) {
        if(err) {
            console.error(err);
        };    

        var searches = db.collection('searches');
        searches.insert({search: search, time: new Date().getTime()});
        db.close();
    });
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

                res.send(recents.reverse());
                db.close();
            });
        });
    });
});

app.listen(app.get('port'));
