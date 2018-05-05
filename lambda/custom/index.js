const Alexa = require('alexa-sdk');
const bespokenTools = require('bespoken-tools');
const TransitHandler = require('./handlers/transit/TransitHandler');
const ParameterHelper = require('./helpers/ParameterHelper');
const IntentController = require('./controllers/IntentController');
const logger = require("logging/Logger");

const handlers = {
    'CtaTrainIntent': async function () {
        // TODO: Build proper parameters
        // train = color, trainstation = stpid, traindirection =
        let train = "";
        let trainStation = "";
        let trainDirection = "";
        if (this.event.request.intent.slots.train){
            train =  this.event.request.intent.slots.train.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        if (this.event.request.intent.slots.trainStation){
            trainStation =  this.event.request.intent.slots.trainStation.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        if (this.event.request.intent.slots.trainDirection){
            trainDirection =  this.event.request.intent.slots.trainDirection.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        if (train === "" && trainStation === "" && trainDirection ===""){
            this.emit(':tell', "No train line, train station, or train direction specified");
        }
        else{
            let alexaTrainStatusResponse = await IntentController.getStatusOfTrainStation(trainStation, train, trainDirection);
            this.emit(':tell', alexaTrainStatusResponse);
        }
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
        let alexaResponse = await IntentController.getEvents(this.event);
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
        logger.error("Unhandled Intent. Alexa request was : " + JSON.stringify(this));
        this.emit(':tell', "You don goofed");
    }
};

exports.handler = bespokenTools.Logless.capture("92060b22-f9da-4f6a-a9f8-f3e5769a3745", function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.skill_id;
    alexa.registerHandlers(handlers);
    alexa.execute();
});