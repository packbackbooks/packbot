# Packbot: A Slack Bot for Packback

Packback sells textbooks. Slackbots convey information. Packbot conveys information about textbooks.

## Usage

In Slack, just type `isbn: ` followed by any valid ISBN. For example:

```
isbn: 9781429261555
```

Packbot will return you the ISBN13, ISBN10, Title, Inventory Status, and URL (if
we have the book at Packback).

## Installation

If you're trying to run this locally:

1. Download the repo
2. Run `npm install`
3. Run `node app.js`
4. Your server is going!

You should be able to send it post requests like Slack does and get a response, although
I have not been able to successfully do this. For local testing, I simply uncomment the get method at
the end and use it.

## Contributing

Packback team members only!

## License

MIT
