var poems = require('lib/poems');

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log('event.session.application.applicationId=' + event.session.application.applicationId);

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request, event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        console.log(e);
        context.fail('Exception: ' + e);
    }
};

/**
* Called when the session starts.
*/
function onSessionStarted(sessionStartedRequest, session) {
    console.log('onSessionStarted requestId=' + sessionStartedRequest.requestId +
    ', sessionId=' + session.sessionId);
}

/**
* Called when the user launches the skill without specifying what they want.
*/
function onLaunch(launchRequest, session, callback) {
    console.log('onLaunch requestId=' + launchRequest.requestId +
    ', sessionId=' + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
* Called when the user specifies an intent for this skill.
*/
function onIntent(intentRequest, session, callback) {
    console.log('onIntent requestId=' + intentRequest.requestId +
    ', sessionId=' + session.sessionId);

    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ('ReadPoem' === intentName) {
        readPoem(intent, session, callback);
    } else if ('AMAZON.HelpIntent' === intentName) {
        getWelcomeResponse(callback);
    } else if ('AMAZON.StopIntent' === intentName || 'AMAZON.CancelIntent' === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw 'Invalid intent';
    }
}

/**
* Called when the user ends the session.
* Is not called when the skill returns shouldEndSession=true.
*/
function onSessionEnded(sessionEndedRequest, session) {
    console.log('onSessionEnded requestId=' + sessionEndedRequest.requestId +
    ', sessionId=' + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = 'Edgar Allan Poe';
    var speechOutput = 'Welcome to Poems by Edgar Allan Poe. ' +
    'Please ask me to read a poem by saying, read Annabel Lee';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = 'Please tell me what poem to read by saying, read Annabel Lee';
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = 'Session Ended';
    var speechOutput = 'Thank you for listening to the poems of Edgar Allan Poe. Have a nice day!';
    // Setting this to true ends the session and exits the skill.
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

/**
* Sets the color in the session and prepares the speech to reply to the user.
*/
function readPoem(intent, session, callback) {
    var cardTitle = '';
    var poemNameSlot = intent.slots.Poem;
    var repromptText = '';
    var poem = {};
    var shouldEndSession = true;
    var speechOutput = '';
    var sessionAttributes = {};

    if (poemNameSlot) {
        var poemName = poemNameSlot.value;
        poem = poems.loadPoem(poemName);
        cardTitle = poem.title + ' by Edgar Allan Poe';
        speechOutput = poem.title + ' by Edgar Allan Poe ' + poem.text.join(' ');
        repromptText = 'I\'m not sure which poem you\'d like to hear. Some of the poems I know are Annabel Lee and'
         + ' The Raven.';
    } else {
        speechOutput = 'I\'m not sure which poem you\'d like to hear. Some of the poems I know are Annabel Lee and '
         + 'The Raven';
        repromptText = 'I\'m not sure which poem you\'d like to hear. Some of the poems I know are Annabel Lee and '
         + 'The Raven';
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
