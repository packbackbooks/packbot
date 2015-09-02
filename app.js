// Node modules required
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

// JS files required
var config = require('./src/config.js');
var cursor = require('./src/cursor.js');

// Initialize express
var app = express();

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(config.port, function () {
    console.log('Listening on port ' + config.port);
});

/* Test Route: Use /?isbn=<ISBN> to test */
app.get('/', function (req, res) {
    var badword = cursor.randomCurse();
    var isbn = req.query.isbn;
    var options = getOptions(isbn);
    var botPayload = {
        text: badword + "! Looks like something went wrong."
    };
    getJSON(options, function(statusCode, results) {
        if (results.total_records) {
            if (results.total_records === 1) {
                var result = results.records[0];
                res.statusCode = statusCode;
                botPayload = result;
            } else {
                botPayload = {
                    text : badword + "! We have multiple books that meet that criteria. Try searching for a single ISBN."
                };
            }
        } else {
            botPayload = {
                text : badword + "! We can't find that book. It probably doesn't exist in Packback's system or it hasn't been added to our search index yet."
            };
        }
        return res.status(200).json(botPayload);
    });
});

app.post('/isbn', function (req, res, next) {
    var badword = cursor.randomCurse();
    var token = req.body.token;
    var inputText = req.body.text;
    var userName = req.body.user_name;
    var botPayload = {
        text: badword + "! Looks like something went wrong."
    };
    if (token === config.url().slack_token && userName !== 'slackbot') {
        inputText = inputText.split(":");
        var isbn = inputText[1];
        isbn = isbn.replace(/ /g,'');
        var options = getOptions(isbn);
        getJSON(options, function(statusCode, results) {
            if (results.total_records) {
                if (results.total_records === 1) {
                    var result = results.records[0];
                    var responseString = "isbn13: '" + result.isbn13;
                    responseString = responseString + "' | isbn10: '" + result.isbn10;
                    responseString = responseString + "' | title: '" + result.title;
                    responseString = responseString + "' | inventory: '" + result.inventory.toString() + "' | link: http://packbackbooks.com/p/" + result.isbn13;
                    botPayload = {
                        text : responseString
                    };
                } else {
                    botPayload = {
                    text : badword + "! We have multiple books that meet that criteria. Try searching for a single ISBN."
                    };
                }
            } else {
                botPayload = {
                text : badword + "! We can't find that book. It probably doesn't exist in Packback's system or it hasn't been added to our search index yet."
                };
            }
            return res.status(200).json(botPayload);
        });
    }
});

var getOptions = function(isbn)
{
    return {
        host: config.url().pb_base_url,
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
    var req = https.request(options, function(res)
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
