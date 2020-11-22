var express = require('express');
const { exit } = require('process');
var router = express.Router();

var story = "Testing 123";
var suggestedWords = [];
var suggestedWordId = 0;

/*
    HELPER FUNCTIONS
*/

// Returns the current story
var getStory = function() {
    return story;
}

// Adds a word to the suggested word list
var addSuggestedWord = function(newWord) {
    try {
        suggestedWords.push({
            'id': suggestedWordId++,
            'name': newWord,
            'votes': 0
        });
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

// Checks if a "word" has non-alphanumeric characters
var checkWordAlphanumeric = function(word) {
    return word.match(/[^a-z0-9]/gi);
}

// Removes all non-alphanumeric characters from a "word"
var stripWord = function(word) { 
    return word.replace(/[^a-z0-9]/gi, "");
}

var checkSuggestedWord = function(word) {
    let retVal = false;
    for (let i = 0; i < suggestedWords.length; i++) {
        if (suggestedWords[i].name == word) {
            retVal = true;
        }
    }
    return retVal;
}

/*
    ROUTER ENDPOINTS
*/

// Homepage
router.get('/', function(req, res) {
    let storydata = getStory();
    res.render("index.html", {story: storydata, words: suggestedWords, flash: req.flash('msg')});
});

// POST Request for new suggested word
// !TODO - Clean up this mess
router.post('/suggestword', function(req, res) {
    let newWord = req.body.word;
    // If the word contains spaces then automatically fail the word adding
    if (newWord.indexOf(" ") != -1) {
        req.flash('msg', 'Please only use one word, and no spaces.');
    } else {
        // If the word contained any non-alphanumeric characters 
        if (checkWordAlphanumeric(newWord)) {
            newWord = stripWord(newWord);
            req.flash('msg', 'Non-alphanumeric characters were stripped from your word.');
        }
        // Attempt to add word
        if (!checkSuggestedWord(newWord) && newWord != "") {
            if (addSuggestedWord(newWord)) {
                req.flash('msg', 'Your word has been submitted!');
            } else {
                req.flash('msg', 'Your word was unable to be submitted.');
            }
        } else {
            req.flash('msg', 'You can\'t submit an empty string. Please enter a word.');
        }
    }
    res.redirect('/');
});

module.exports = router;