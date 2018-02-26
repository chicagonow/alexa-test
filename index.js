const Alexa = require('alexa-sdk');
const request = require('request');
const buildUrl = require('build-url');
const TransitHandler = require('./handlers/transit/TransitHandler');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';
const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

const handlers = {
    'CtaIntent': function () {
        // TODO: Build proper parameters object
        let parameters = {
            mapid: "40530",
            rt: "Brn"
        };
        TransitHandler.searchTransit(parameters, (alexaResponse) => {
            this.emit(':tell', alexaResponse);
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
    alexa.APP_ID = process.env.skill_id;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

exports.requestTest = function (event, context) {
    console.log("hello");

    let url = buildUrl(CTA_API_DOMAIN, {
        path: CTA_API_PATH,
        queryParams: {
            key: CTA_API_KEY,
            mapid: "40530",
            rt: "Brn"
        }
    });

    request(url, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
};


exports.dumbAdditionTest = () => {
  let x = 1;
  let y = 2;

  let result=x+y;
  if (result !== 3) {
      throw "Simple addition doesn't work, 1 + 2 was: " + result;
  } else {
      console.log("dumb test passed");
  }
};

require('make-runnable');