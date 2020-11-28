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

// Checks and cleans a suggested word
var checkSuggestedWord = function(newWord, req) {
    // If the word is empty (i.e. ""), then fail the word adding
    if (newWord == "") {
        req.flash('msg', 'You can\'t submit an empty string. Please enter a word.');
        return false;
    }
    // If the word contains spaces then automatically fail the word adding
    if (newWord.indexOf(" ") != -1) {
        req.flash('msg', 'Please only use one word, and no spaces.');
        return false;
    }
    // If the word already exists in the system then fail adding it 
    if (checkSuggestedWordExistsInList(newWord)) {
        req.flash('msg', newWord + ' already exists in the list of suggested words.');
        return false;
    }

    // If all checks pass, then return true.
    return true;
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

// Checks if the suggested word already exists in the list of suggested words
var checkSuggestedWordExistsInList = function(word) {
    let retVal = false;
    for (let i = 0; i < suggestedWords.length; i++) {
        if (suggestedWords[i].name.toLowerCase() == word.toLowerCase()) {
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
router.post('/suggestword', function(req, res) {
    let newWord = req.body.word;

    // Remove non-alphanumeric characters from the suggested "word"
    if (checkWordAlphanumeric(newWord)) {
        newWord = stripWord(newWord); // ensure no non-alphanumeric characters
        req.flash('msg', 'Non-alphanumeric characters were stripped from your word.')
    }

    // Ensure the suggested "word" passes checks before attempting to add  
    if (checkSuggestedWord(newWord, req)) { 
        if (addSuggestedWord(newWord)) {
            req.flash('msg', 'Your word has been submitted!');
        } else {
            req.flash('msg', 'Your word was unable to be submitted as an error occurred.');
        }
    }
    res.redirect('/');
});

module.exports = router;