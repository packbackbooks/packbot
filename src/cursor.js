var badWords = require('badwords/array');

module.exports = {
    randomCurse: function() {
        var badWord = badWords[Math.floor(Math.random()*badWords.length)];
        return badWord.charAt(0).toUpperCase() + badWord.slice(1);
    }
};
