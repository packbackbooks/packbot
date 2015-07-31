var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 1337;

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

// test route
app.get('/', function (req, res) {
    res.status(200).send('Hello world!');
});

app.listen(port, function () {
    console.log('Listening on port ' + port);
});

app.post('/isbn', function (req, res, next) {
    var token = req.body.token;
    var inputText = req.body.text;
    if (token === 'Om7eyT4leAZ9coomyRCH5F1m') {
        /*
        inputText = inputText.split(":");
        var isbn = inputText[1];
        isbn = isbn.replace(/ /g,'');
        */
        var botPayload = {
            text : inputText
        };
        return res.status(200).json(botPayload);
    }
    return res.status(404).end();
});
