// Node modules required
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');

// JS files required
var config = require('./config.js');
var cursor = require('./utils/cursor.js');

// Initialize express
var app = express();

// Use body parser middleware for Slack response
app.use(bodyParser.urlencoded({ extended: true }));

// Listen to port for local testing
app.listen(config.port, function () {
    console.log('Listening on port ' + config.port);
});

// Use /?isbn=<ISBN> to test
app.get('/', function (req, res) {
    var isbn = req.query.isbn;
    var options = config.getOptions(isbn);
    getJSON(options, function(results) {
        var botPayload = generatePayload(results);
        res.status(200).json(botPayload);
    });
});

app.post('/isbn', function (req, res, next) {
    var token = req.body.token;
    var inputText = req.body.text;
    var userName = req.body.user_name;

    if (token === config.url().slack_token && userName !== 'slackbot') {
        inputText = inputText.split(":");
        var isbn = inputText[1];
        isbn = isbn.replace(/ /g,'');

        var options = config.getOptions(isbn);
        getJSON(options, function(results) {
            var botPayload = generatePayload(results);
            res.status(200).json(botPayload);
        });
    }
});

// getJSON: REST get request returning JSON object(s)
var getJSON = function(options, callback)
{
    var req = https.request(options, function(res)
    {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var results = JSON.parse(output);
            callback(results);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
};

// Take results from search api and generate Slack-friendly payload
var generatePayload = function (results)
{
    // Packbot curses at you. How fun!
    // var badword = cursor.randomCurse();
    if (results.total_records) {
        if (results.total_records === 1) {
            var responseString = generateResponseString(results.records[0]);
            return {
                text : responseString
            };
        } else {
            return {
                text : "We have multiple books that meet that criteria. Try searching for a single ISBN."
            };
        }
    }
    return {
        text : "We can't find that book. It probably doesn't exist in Packback's system or it hasn't been added to our search index yet."
    };
}

var generateResponseString = function (result)
{
    return "isbn13: '" + result.isbn13 + "' | isbn10: '" + result.isbn10 + "' | title: '" + result.title + "' | inventory: '" + result.inventory.toString() + "' | link: http://packbackbooks.com/p/" + result.isbn13;
}
