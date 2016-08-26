var fs = require('fs');

var poems = {
	"Annabel Lee": "./poems/annabel_lee.json",
	"The Raven": "./poems/the_raven.json"
};

var getCard = function(poem) {
	return null;
};

var getText = function(poem) {
	console.log('Joining ' + poem.text.length + ' stanzas');
	var poemText = poem.text.join(' ');
	return poemText;
};

var loadPoem = function(title) {
	var poemFileName = poems[title];
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
