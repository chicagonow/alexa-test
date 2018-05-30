const Alexa = require('alexa-sdk');
const bespokenTools = require('bespoken-tools');
const TransitHandler = require('./handlers/transit/TransitHandler');
const IntentController = require('./controllers/IntentController');
const logger = require("./logging/Logger");
const UserRepository = require("./repositories/database/UserRepository");
const TransitSlotHelper = require('./helpers/TransitSlotHelper');
const RequestRepository = require('./repositories/database/RequestRepository');

let startTime;

let logRequestInfo = (intentName, endTime) => {
    //this needs to be console.* instead of logger. so it is not json formatted
    console.info("IntentName: " + intentName + " Duration: " + (endTime - startTime));
};

const handlers = {

    'CtaTrainIntent': async function () {
        let train = "";
        let trainStation = "";
        let trainDirection = "";

        let trainIntentSlots = this.event.request.intent.slots;

        // check for any unmatched slots
        let failedSlotResponse = TransitSlotHelper.getSlotErrorResponse(trainIntentSlots, ["train", "trainStation", "trainDirection"], true);

        let alexaTrainStatusResponse = "";
        if (failedSlotResponse) {
            alexaTrainStatusResponse = failedSlotResponse;
        } else {

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
                alexaTrainStatusResponse = "No train line, train station, or train direction specified";
            } else {
                alexaTrainStatusResponse = await IntentController.asyncGetTrain(trainStation, train, trainDirection);
            }

        }

        this.emit(':tell', alexaTrainStatusResponse);
        logRequestInfo("CtaTrainIntent", new Date());
    },
    'CtaBusIntent': async function () {
        let busIntentSlots = this.event.request.intent.slots;

        let failedSlotResponse = TransitSlotHelper.getSlotErrorResponse(busIntentSlots, ["bus", "busDirection"]);
        if (failedSlotResponse) {
            this.emit(':tell', failedSlotResponse);
        } else {
            let route = busIntentSlots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            let direction = busIntentSlots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;

            let alexaResponse =
                await IntentController.getBusesWithUserLocation(this.event, route, direction)
                    .catch(error => {
                        logger.error(error)
                    });
            this.emit(':tell', alexaResponse);
        }        
        logRequestInfo("CtaBusIntent", new Date());
    },
    'CtaBusStopIntent': async function () {
        let bustStopIntentSlots = this.event.request.intent.slots;

        let failedSlotResponse = TransitSlotHelper.getSlotErrorResponse(bustStopIntentSlots, ["bus", "busStop"]);
        if (failedSlotResponse) {
            this.emit(':tell', failedSlotResponse);
        } else {
            let route = bustStopIntentSlots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            let stopId = bustStopIntentSlots.busStop.resolutions.resolutionsPerAuthority[0].values[0].value.name;

            let alexaResponse =
                await IntentController.getBusesByStop(route, stopId)
                    .catch(error => {
                        logger.error(error)
                    });
            this.emit(':tell', alexaResponse);
        }
        logRequestInfo("CtaBusStopIntent", new Date());
    },
    'CtaLocationIntent': function () {
        let transitSlot = this.event.request.intent.slots.transitMode.value;
        if (transitSlot === "train") {
            TransitHandler.searchTrainNearMe(this.event, (alexaResponse) => {
                this.emit(':tell', alexaResponse);
            });
        } else {
            this.emit(':tell', "implement nearest bus location Intent");
        }
        logRequestInfo("CtaLocationIntent", new Date());
    },
    'EventLocationIntent': async function () {

        let alexaResponse = await IntentController.getEvents(this.event);
        this.emit(':tell', alexaResponse);
        logRequestInfo("EventLocationIntent", new Date());
    },
    'EventTimeFrameIntent': async function () {
        let timeFrame = this.event.request.intent.slots.timeFrame.value;
        let alexaResponse =
            await IntentController.getEventsWithinTimeFrame(this.event, timeFrame)
                .catch(error => {
                    logger.error(error)
                });
        this.emit(':tell', alexaResponse);
        logRequestInfo("EventTimeFrameIntent", new Date());
    },
    'EventHelpIntent': function () {
        let eventHelpResponse =
            "You can ask chicago now about events at specific venues, by timeframe, and or by category." +
            " For example: ask chicago now what pop events are going on at house of blues," +
            " or, ask chicago now what baseball games are going on at this week";
        this.emit(':tell', eventHelpResponse);
        logRequestInfo("EventHelpIntent", new Date());
    },
    'TrainHelpIntent': function () {
        let trainHelpIntent =
            "You can ask chicago now about specific train schedules by line and direction." +
            " For example: ask chicago now what's the status of the south brown line at Diversey," +
            " or, ask chicago now what's the status of the wilson red line";
        this.emit(':tell', trainHelpIntent);
        logRequestInfo("TrainHelpIntent", new Date());
    },
    'BusHelpIntent': function () {
        let trainHelpIntent =
            "You can ask chicago now about specific bus stop schedules by bus number, and by direction or intersection." +
            " For example: ask chicago now what's the status of the southbound 49," +
            " or, ask chicago now what's the status of 66 at chicago and state." +
            " To change direction, switch the order of the intersection. For example, say state and chicago instead of chicago and state";
        this.emit(':tell', trainHelpIntent);
        logRequestInfo("BusHelpIntent", new Date());
    },
    'AMAZON.HelpIntent': function () {
        helpIntent(this);
        logRequestInfo("HelpIntent", new Date());
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
        logRequestInfo("CancelIntent", new Date());
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
        logRequestInfo("StopIntent", new Date());
    },
    'Unhandled': function () {
        logger.info("Unhandled Intent. Alexa request was : " + JSON.stringify(this));
        helpIntent(this);
    },

};

let helpIntent = (that) => {
    const speechOutput = "Ok. Try : " +
        "ask chicago now event help, or " +
        "ask chicago now train help, or " +
        "ask chicago now bus help.";

    that.emit(':tell', speechOutput);
};

let trackUser = (event) => {
    let userId = event.context.System.user.userId;
    UserRepository.updateUser(userId);
};

let trackRequest = (event) => {
    RequestRepository.insertRequest(event.request);
};

exports.handler = bespokenTools.Logless.capture("92060b22-f9da-4f6a-a9f8-f3e5769a3745", function (event, context) {
    trackUser(event);
    trackRequest(event);
    logger.info(event);
    startTime = new Date();
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.skill_id;
    alexa.registerHandlers(handlers);
    alexa.execute();
});