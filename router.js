var express = require('express');
var router = express.Router();

var story = "Testing 123";
var suggestedWords = [];

// Helper function to get current story text
var getStory = function() {
    return story;
}

// Display homepage
router.get('/', function(req, res) {
    let storydata = getStory();
    res.render("index.html", {story: storydata, words: suggestedWords, flash: req.flash('msg')});
});

router.post('/suggestword', function(req, res) {
    let newWord = req.body.word;
    //!TODO - ensure only one word and return error
    try {
        suggestedWords.push({
            'name': newWord,
            'votes': 0
        });
        req.flash('msg', 'Your word has been submitted!');
        console.log(suggestedWords);
    } catch (e) {
        console.log(e);
        req.flash('msg', 'Your word was unable to be submitted.')
    }
    res.redirect('/');
});

module.exports = router;