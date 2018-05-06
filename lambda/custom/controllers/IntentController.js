const LocationHandler = require('../handlers/location/LocationHandler');
const EventsHandler = require('../handlers/events/EventsHandler');
const BusHandler = require('../handlers/transit/bus/BusHandler');
const CtaTrainHandler = require('../handlers/transit/train/CtaTrainHandler');
const ParameterHelper = require('../helpers/ParameterHelper');
const logger = require("../logging/Logger");
const AmazonDateParser = require('amazon-date-parser');


exports.getEvents = async (event) => {
    let eventLocationIntentSlots = event.request.intent.slots;
    let alexaResponse = "There was an error using events handler";

    let eventLocation = eventLocationIntentSlots.venueName.value || "";
    if (!eventLocation) {
        eventLocation = eventLocationIntentSlots.landmark.value || "";
    }

    let locationParameters;
    let locationObj = {
        latitude : "",
        longitude : ""
    };
    if (eventLocation.trim() === "") {
        locationParameters = ParameterHelper.getLocationParameters(event.context.System);
        locationObj = await LocationHandler.asyncGetLocation(locationParameters.apiEndpoint, locationParameters.token, locationParameters.deviceID);
    }

    let timeFrame = eventLocationIntentSlots.timeFrame.value || "";


    let parsedDate = {
        startDate: "",
        endDate: ""
    };

    if (timeFrame.trim()) {
        try {
            parsedDate = new AmazonDateParser(timeFrame);
        } catch (error) {
            logger.error(error);
        }
    }

    let eventGenre = eventLocationIntentSlots.eventGenre.value || "";

    try {
        alexaResponse = await EventsHandler.asyncGetEvents(eventGenre, eventLocation, parsedDate.startDate, parsedDate.endDate, locationObj.latitude, locationObj.longitude);
    } catch (error) {
        logger.error(error);
    }

    return alexaResponse;

    //
    //
    // try {
    //     if (eventLocationIntentSlots.venueName.value) {
    //         alexaResponse = await EventsHandler.asyncGetEventsAtVenue(eventLocationIntentSlots.venueName.value);
    //     } else if (eventLocationIntentSlots.landmark.value) {
    //         alexaResponse = await EventsHandler.asyncGetEventsAtVenue(eventLocationIntentSlots.landmark.value);
    //     } else {
    //         let locationParameters = ParameterHelper.getLocationParameters(event.context.System);
    //         alexaResponse = await getEventsWithUserLocation(locationParameters.apiEndpoint, locationParameters.token, locationParameters.deviceID);
    //     }
    // } catch (error) {
    //     logger.error(error);
    // }

    // return alexaResponse;
};


// take device information, get lat long
// take lat long return events near location
let getEventsWithUserLocation = async function getEventsWithUserLocation(apiEndpoint, token, deviceID) {
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID)
        .catch(error => {
            logger.error(error);
        });

    let alexaResponse = await EventsHandler.asyncGetEventsNearLocation(locationObj.latitude, locationObj.longitude)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

/**
 * Returns events within the specified time frame
 * @param {string} apiEndpoint
 * @param {string} token
 * @param {string} deviceID
 * @param {string} date
 */
exports.getEventsWithinTimeFrame = async function getEventsWithinTimeFrame(apiEndpoint, token, deviceID, date) {
    // Get location
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID)
        .catch(error => {
            logger.error(error);
        });

    // Get Date time frame
    let timeFrame;
    try {
        timeFrame = new AmazonDateParser(date);
    } catch (error) {
        logger.error(error);
    }

    // Return response
    let alexaResponse = await EventsHandler.asyncGetEventsWithinTimeFrame(locationObj.latitude, locationObj.longitude, timeFrame.startDate, timeFrame.endDate)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

exports.getBusesWithUserLocation = async function getBusesWithUserLocation(apiEndpoint, token, deviceID, route, direction) {
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID)
        .catch(error => {
            logger.error(error);
        });

    let alexaResponse = await BusHandler.asyncGetBusesWithUserLocation(route, direction, locationObj.latitude, locationObj.longitude)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

exports.getBusesByStop = async function getBusesByStop(route, stopId) {
    let alexaResponse = await BusHandler.asyncGetBusesByStop(route, stopId)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

exports.getStatusOfTrainStation = async function getStatusOfTrainStation(mapid, route) {
    let alexaTrainStatusResponse = await CtaTrainHandler.asyncCallCta(mapid, route)
        .catch(error => {
            logger.error(error);
        });

    return alexaTrainStatusResponse;
};
