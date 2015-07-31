var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
    inputText = 'isbn:978';
    inputText = inputText.split(":");
    var isbn = inputText[1];
    isbn = isbn.replace(/ /g,'');
    res.status(200).send(isbn);
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
        var botPayload = {
            text : isbn
        };
        return res.status(200).json(botPayload);
    }
    return res.status(404).end();
});
