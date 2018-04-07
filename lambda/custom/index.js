const Alexa = require('alexa-sdk');
const TransitHandler = require('./handlers/transit/TransitHandler');
const EventsHandler = require('./handlers/events/EventsHandler');
const ParameterHelper = require('./helpers/ParameterHelper');
const BusHandler = require('./handlers/transit/bus/BusHandler');
const IntentController = require('./controllers/IntentController');

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
    'CtaBusIntent': async function () {
        let transitSlot = this.event.request.intent.slots.transitMode.value;
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let route = this.event.request.intent.slots.bus.value;
        let direction = this.event.request.intent.slots.busDirection.resolutions.resolutionsperAuthority.values.value.name;
        let alexaResponse = await IntentController.getEventsWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction);
        this.emit(':tell', alexaResponse);
        /*
        if (transitSlot === "bus") {
            let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
            parameters.rt = this.event.request.intent.slots.busStop.value;
            parameters.dir = this.event.request.intent.slots.busDirection.value;

            BusHandler.searchBusNearMe(parameters, (alexaResponse) => {
                this.emit(':tell', alexaResponse);
            }); 
        } else {
            this.emit(':tell', "implement bus stop intent");
        }    
        */   
    },
    'CtaLocationIntent': function () {     
        let transitSlot = this.event.request.intent.slots.transitMode.value;
        if (transitSlot === "train") {
            let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
            TransitHandler.searchTrainNearMe(parameters, (alexaResponse) => {
                this.emit(':tell', alexaResponse);
            }); 
        } else {
            this.emit(':tell', "implement nearest bus location intent");
        }       
    },
	'EventLocationIntent': async function() {		
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let alexaResponse = await IntentController.getEventsWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID);
        this.emit(':tell', alexaResponse);
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