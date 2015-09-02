module.exports = {
    port: process.env.PORT || 1337,
    url: function () {
        if (process.env.ENVIRONMENT === 'production') {
            return {
                'pb_base_url': process.env.PB_BASE_URL,
                'slack_token': process.env.SLACK_TOKEN,
            }
        } else {
            var env = require('../env.json');
            return env;
        }
    }
};
