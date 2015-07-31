var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var port = process.env.PORT || 1337;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
    var isbn = req.query.isbn;
    var options = getOptions(isbn);
    getJSON(options, function(statusCode, results) {
        if (results.total_records === 1) {
            var result = results.records[0];
            res.statusCode = statusCode;
            res.status(200).send(result);
        } else {
            res.status(404).end();
        }
    });
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

app.post('/isbn', function (req, res, next) {
    var token = req.body.token;
    var inputText = req.body.text;
    var userName = req.body.user_name;
    if (token === 'Om7eyT4leAZ9coomyRCH5F1m' && userName !== 'slackbot') {
        inputText = inputText.split(":");
        var isbn = inputText[1];
        isbn = isbn.replace(/ /g,'');
        var options = getOptions(isbn);
        getJSON(options, function(statusCode, results) {
            if (results.total_records === 1) {
                var result = results.records[0];
                var response = "isbn13: " + result.isbn13 + "
                    isbn10: " + result.isbn10 + "
                    title: " + result.title + "
                    inventory: " + result.inventory + "
                    link: http://packbackbooks.com/p/" + result.isbn13 + "/" + result.slug "";
                var botPayload = {
                    text : response
                };
                return res.status(200).json(botPayload);
            } else {
                res.status(404).end();
            }
        });
    }
    //return res.status(404).end();
});

var getOptions = function(isbn)
{
    return {
        host: 'search.packback.co',
        path: '/api/search/'+isbn,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
}

// getJSON:  REST get request returning JSON object(s)
var getJSON = function(options, onResult)
{
    var req = http.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};
