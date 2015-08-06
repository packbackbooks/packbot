var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');

var app = express();
var port = process.env.PORT || 1337;

// Import config variables
if (process.env.ENVIRONMENT === 'production') {
    var config = {
        'pb_base_url': process.env.PB_BASE_URL,
        'slack_token': process.env.SLACK_TOKEN,
    }
} else {
    var config = require('./env.json');
}

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

/* Test Route: Use /?isbn=<ISBN> to test */
app.get('/', function (req, res) {
    var isbn = req.query.isbn;
    var options = getOptions(isbn);
    var botPayload = {
        text: "Looks like something went wrong."
    };
    getJSON(options, function(statusCode, results) {
        if (results.total_records) {
            if (results.total_records === 1) {
                var result = results.records[0];
                res.statusCode = statusCode;
                botPayload = result;
            } else {
                botPayload = {
                    text : "We have multiple books that meet that criteria. Try searching for a single ISBN."
                };
            }
        } else {
            botPayload = {
                text : "We can't find that book. It probably doesn't exist in Packback's system or it hasn't been added to our search index yet."
            };
        }
        return res.status(200).json(botPayload);
    });
});

app.post('/isbn', function (req, res, next) {
    var token = req.body.token;
    var inputText = req.body.text;
    var userName = req.body.user_name;
    var botPayload = {
        text: "Looks like something went wrong."
    };
    if (token === config.slack_token && userName !== 'slackbot') {
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
                        text : "We have multiple books that meet that criteria. Try searching for a single ISBN."
                    };
                }
            } else {
                botPayload = {
                    text : "We can't find that book. It probably doesn't exist in Packback's system or it hasn't been added to our search index yet."
                };
            }
            return res.status(200).json(botPayload);
        });
    }
});

var getOptions = function(isbn)
{
    return {
        host: config.pb_base_url,
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
