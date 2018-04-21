const Alexa = require('alexa-sdk');
const bst = require('bespoken-tools');
const TransitHandler = require('./handlers/transit/TransitHandler');
const EventsHandler = require('./handlers/events/EventsHandler');
const ParameterHelper = require('./helpers/ParameterHelper');
const BusHandler = require('./handlers/transit/bus/BusHandler');
const IntentController = require('./controllers/IntentController');
const logger = require("../../logging/Logger");

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';
const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

const handlers = {
    'CtaTrainIntent': async function () {
        // TODO: Build proper parameters
        let alexaTrainStatusResponse = await IntentController.getStatusOfTrainStation("40530", "Brn");
        this.emit(':tell', alexaTrainStatusResponse);
    },
    'CtaBusIntent': async function () {
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let route = this.event.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = this.event.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse =
            await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
    },
    'CtaBusStopIntent': async function () {
        let route = this.event.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = this.event.request.intent.slots.busStop.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse =
            await IntentController.getBusesByStop(route, stopId)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
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
    'EventTimeFrameIntent': async function() {
        let timeFrame = this.event.request.intent.slots.timeFrame.value;
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let alexaResponse = 
            await IntentController.getEventsWithinTimeFrame(parameters.apiEndpoint, parameters.token, parameters.deviceID, timeFrame)
                .catch(error => {
                    logger.error(error)
                });
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

exports.handler = bst.Logless.capture("92060b22-f9da-4f6a-a9f8-f3e5769a3745", function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = process.env.skill_id;
    alexa.registerHandlers(handlers);
    alexa.execute();
});