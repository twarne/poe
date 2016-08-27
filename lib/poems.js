var fs = require('fs');

var poems = {
	"annabel_lee": "./poems/annabel_lee.json",
	"the_raven": "./poems/the_raven.json",
    "the_bells": "./poems/the_bells.json",
    "eldorado": "./poems/eldorado.json",
    "a_dream": "./poems/a_dream.json"
};

var getCard = function(poem) {
	return null;
};

var getText = function(poem) {
	console.log('Joining ' + poem.text.length + ' stanzas');
	var poemText = poem.text.join(' ');
	return poemText;
};

var normalize = function(title) {
    console.log('Normalizing ' + title);
    var normalTitle = title.replace(/\s+/g, '_').toLowerCase();
    return normalTitle;
};

var loadPoem = function(title) {
    var normalTitle = normalize(title);
	var poemFileName = poems[normalTitle];
	console.log('Loading poem ' + title + ' from ' + poemFileName);
	console.log(typeof poemFileName);

	try {
		var poem = JSON.parse(fs.readFileSync(poemFileName, 'utf8'));

		return poem;
	} catch(e) {
		console.log('Error caught in loadPoem!');
		console.log(e);
	}
};

var getResponse = function(title) {
	console.log('Attempting to generate response for \'' + title + '\'');
	var poem = loadPoem(title);

	if(poem) {
		var card = getCard(poem);
		var text = getText(poem);

		return {
			card: card,
			text: text
		};
	} else {
		var text = 'I\'m sorry, but I was unable to find a poem named ' + title;
		return {
			card: null,
			text: text
		};
	}
}

module.exports = exports = {
	loadPoem: loadPoem
};
