const Alexa = require('alexa-sdk');
const bespokenTools = require('bespoken-tools');
const TransitHandler = require('./handlers/transit/TransitHandler');
const ParameterHelper = require('./helpers/ParameterHelper');
const IntentController = require('./controllers/IntentController');
const logger = require("logging/Logger");
const UserRepository = require("./repositories/database/UserRepository");

let startTime;

let logRequestInfo = (context, intentName, endTime) => {
    //this needs to be console.* instead of logger. so it is not json formatted
    console.info("IntentName: " + intentName + " Duration: " + (endTime - startTime));

};

const handlers = {

    'CtaTrainIntent': async function () {
        trackUser(this.event);
        let train = "";
        let trainStation = "";
        let trainDirection = "";

        let trainIntentSlots = this.event.request.intent.slots;

        if (trainIntentSlots.train.resolutions) {
            train = trainIntentSlots.train.resolutions.resolutionsPerAuthority[0].values[0].value.id;
        }
        if (trainIntentSlots.trainStation.resolutions) {
            trainStation = trainIntentSlots.trainStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        if (trainIntentSlots.trainDirection.resolutions) {
            trainDirection = trainIntentSlots.trainDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        }
        if (train === "" && trainStation === "" && trainDirection === "") {
            this.emit(':tell', "No train line, train station, or train direction specified");
        }
        else {
            let alexaTrainStatusResponse = await IntentController.asyncGetTrain(trainStation, train, trainDirection);
            this.emit(':tell', alexaTrainStatusResponse);
        }
        logRequestInfo(this.context, "CtaTrainIntent", new Date());
    },
    'CtaBusIntent': async function () {

        trackUser(this.event);
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let busIntentSlots = this.event.request.intent.slots;

        let route = busIntentSlots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = busIntentSlots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse =
            await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
        logRequestInfo(this.context, "CtaBusIntent", new Date());
    },
    'CtaBusStopIntent': async function () {
        logRequestInfo(this.context, "CtaBusStopIntent", new Date());
        trackUser(this.event);
        let bustStopIntentSlots = this.event.request.intent.slots;
        let route = bustStopIntentSlots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = bustStopIntentSlots.busStop.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse =
            await IntentController.getBusesByStop(route, stopId)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
    },
    'CtaLocationIntent': function () {
        trackUser(this.event);
        let transitSlot = this.event.request.intent.slots.transitMode.value;
        if (transitSlot === "train") {
            let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
            TransitHandler.searchTrainNearMe(parameters, (alexaResponse) => {
                this.emit(':tell', alexaResponse);
            });
        } else {
            this.emit(':tell', "implement nearest bus location Intent", new Date());
        }
        logRequestInfo(this.context, "CtaLocationIntent", new Date());
    },
    'EventLocationIntent': async function () {
        trackUser(this.event);
        let alexaResponse = await IntentController.getEvents(this.event);
        this.emit(':tell', alexaResponse);
        logRequestInfo(this.context, "EventLocationIntent", new Date());
    },
    'EventTimeFrameIntent': async function () {
        trackUser(this.event);
        let timeFrame = this.event.request.intent.slots.timeFrame.value;
        let parameters = ParameterHelper.getLocationParameters(this.event.context.System);
        let alexaResponse =
            await IntentController.getEventsWithinTimeFrame(parameters.apiEndpoint, parameters.token, parameters.deviceID, timeFrame)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
        logRequestInfo(this.context, "EventTimeFrameIntent", new Date());
    },
    'EventHelpIntent': function () {
        let eventHelpResponse =
            "You can ask chicago now about events at specific venues, by timeframe, and or by category." +
            " For example: ask chicago now what pop events are going on at house of blues," +
            " or, ask chicago now what baseball games are going on at this week";
        this.emit(':tell', eventHelpResponse);
        logRequestInfo(this.context, "EventHelpIntent", new Date());
    },
    'TrainHelpIntent': function () {
        let trainHelpIntent =
            "You can ask chicago now about specific train schedules by line and direction." +
            " For example: ask chicago now what's the status of the south brown line at Diversey," +
            " or, ask chicago now what's the status of the wilson red line";
        this.emit(':tell', trainHelpIntent);
        logRequestInfo(this.context, "TrainHelpIntent", new Date());
    },
    'BusHelpIntent': function () {
        let trainHelpIntent =
            "You can ask chicago now about specific bus stop schedules by bus number, and by direction or intersection." +
            " For example: ask chicago now what's the status of the southbound 49," +
            " or, ask chicago now what's the status of 66 at chicago and state." +
            " To change direction, switch the order of the intersection. For example, say state and chicago instead of chicago and state";
        this.emit(':tell', trainHelpIntent);
        logRequestInfo(this.context, "BusHelpIntent", new Date());
    },
    'AMAZON.HelpIntent': function () {
        trackUser(this.event);
        const speechOutput = "Ok. Try : " +
            "ask chicago now event help, or " +
            "ask chicago now train help, or " +
            "ask chicago now bus help.";

        this.emit(':tell', speechOutput);
        logRequestInfo(this.context, "HelpIntent", new Date());
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
        logRequestInfo(this.context, "CancelIntent", new Date());
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
        logRequestInfo(this.context, "StopIntent", new Date());
    },
    'Unhandled': function () {
        logger.info("Unhandled Intent. Alexa request was : " + JSON.stringify(this));
        this.emit(':tell', "You don goofed");
        logRequestInfo(this.context, "Unhandled", new Date());
    }
};

let trackUser = (event) => {
    let userID = event.context.System.user.userId;
    UserRepository.updateUser(userID);
};

exports.handler = bespokenTools.Logless.capture("92060b22-f9da-4f6a-a9f8-f3e5769a3745", function (event, context) {
    startTime = new Date();
    const alexa = Alexa.handler(event, context);
    logger.info("alexa.handler");
    alexa.appId = process.env.skill_id;
    logger.info("alexa.appId");
    alexa.registerHandlers(handlers); 
    logger.info("alexa.registerHandlers");  
    alexa.execute();
    logger.info("alexa.execute");
});