const Alexa = require('alexa-sdk');
const TransitHandler = require('./handlers/transit/TransitHandler');
const EventsHandler = require('./handlers/events/EventsHandler');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';
const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

const handlers = {
    'CtaTrainIntent': function () {        
        // TODO: Build proper parameters object
        let parameters = {
            mapid: "40530",
            rt: "Brn"
        };

        TransitHandler.searchTransit(parameters, (alexaResponse) => {
            this.emit(':tell', alexaResponse);
        });
    },
    'CtaBusIntent': function () {
        // TODO: Build proper parameters object
        //let parameters = {
        //    mapid: "40530",
        //    rt: "Brn"
        //};

        //TransitHandler.searchTransit(parameters, (alexaResponse) => {
        //    this.emit(':tell', alexaResponse);
        //});
        this.emit(':tell', "implement bus intent");
    },
    'CtaLocationIntent': function () {
        // TODO: Build proper parameters object
        //let parameters = {
        //    mapid: "40530",
        //    rt: "Brn"
        //};

        //TransitHandler.searchTransit(parameters, (alexaResponse) => {
        //    this.emit(':tell', alexaResponse);
        //});
        this.emit(':tell', "implement cta location intent");
    },
	'EventLocationIntent': function() {		
		EventsHandler.searchEvents((alexaResponse,error,response) => {				
			this.emit(':tell', alexaResponse);			
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