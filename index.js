const Alexa = require('alexa-sdk');
const request = require('request');
const buildUrl = require('build-url');
const EventHelper = require('./EventHelper');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';
const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

const handlers = {
    'CtaIntent': function () {

        let url = buildUrl(CTA_API_DOMAIN, {
            path: CTA_API_PATH,
            queryParams: {
                key: CTA_API_KEY,
                mapid: "40530",
                rt: "Brn"
            }
        });


        request(url,  (error, response, body) => {
            // example of how to read variables from the alexa intent
            let train = this.event.request.intent.slots.train.value;
            this.emit(':tell', 'You ask for ' + train);
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
        });
    },
	'EventIntent' : function(){
		
		let result = EventHelper.searchEvents((	result,error,response)=>{				
			this.emit(':tell', result);			
			console.log('error:',error);
			console.log('statusCode:', response && response.statusCode);
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