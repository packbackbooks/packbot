# Packbot: A Slack Bot for Packback

Packback sells textbooks. A slackbot conveys information. Packbot conveys
information about textbooks using Packback's search API.

## Usage

In Slack, just type `isbn: ` followed by any valid ISBN. For example:

```
isbn: 9781429261555
```

Packbot will return you the ISBN13, ISBN10, Title, Inventory Status, and URL (if
we have the book at Packback).

You can also hit the GET endpoint directly on our Heroku app:

```
https://packbot.herokuapp.com/?isbn=9780515121490
```

## Installation

If you're trying to run this locally:

1. Download the repo
2. Run `npm install`
3. Add an env.json file based on sample.env.json
4. Run `node app.js`
5. Your server is going!

You should be able to send it post requests like Slack does and get a response, although
I have not been able to successfully do this.

For local testing, I simply use the GET method:

```
http://localhost:1337?isbn=9780515121490
```

## Contributing

If you have a suggestion to improve Packbot, make a pull request. If you have
other questions, email [Karl Hughes](mailto:karl@packback.co).

## License

MIT
