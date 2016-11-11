var express = require('express');
var app = express();

app.set('port', process.env.PORT || 8080);

//search routing
app.get('/api/:search', function(req, res) {
    var search = req.params.search,
        offset = req.query.offset || 0;

    res.send(JSON.stringify({search: search, offset: offset}));
});

//recent searches
app.get('/api/recent/searches', function(req, res) {
    var recents = [];

    res.send(recents);
});

app.listen(app.get('port'));
