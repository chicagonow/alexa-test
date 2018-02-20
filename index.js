const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';

const handlers = {
    'CtaIntent': function () {
        request('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=541afb8f3df94db2a7afffc486ea4fbf&mapid=40530&rt=Brn', function (error, response, body) {
            this.emit(':tell', 'Hello peeps');
            console.log('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML for the Google homepage.
        });
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.emit(':tell', "You don goofed");
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

exports.requestTest = function (event, context) {
    console.log("hello");
    request('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=541afb8f3df94db2a7afffc486ea4fbf&mapid=40530&rt=Brn', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}

require('make-runnable');