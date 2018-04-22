const LocationHandler=require('../handlers/location/LocationHandler');
const EventsHandler=require('../handlers/events/EventsHandler');
const BusHandler=require('../handlers/transit/bus/BusHandler');
const CtaTrainHandler=require('../handlers/transit/train/CtaTrainHandler');
const logger = require("../logging/Logger");
const AmazonDateParser = require('amazon-date-parser');

// take device information, get lat long
// take lat long return events near location
exports.getEventsWithUserLocation = async function getEventsWithUserLocation(apiEndpoint, token, deviceID){
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
    } catch(error) {
        logger.log(error);
    }

    // Return response
    let alexaResponse = await EventsHandler.asyncGetEventsWithinTimeFrame(locationObj.latitude, locationObj.longitude, timeFrame.startDate, timeFrame.endDate)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

exports.getBusesWithUserLocation = async function getBusesWithUserLocation(apiEndpoint, token, deviceID, route, direction){
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

exports.getBusesByStop = async function getBusesByStop(route, stopId){
    let alexaResponse = await BusHandler.asyncGetBusesByStop(route, stopId)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

exports.getStatusOfTrainStation = async function getStatusOfTrainStation(mapid, route){
    let alexaTrainStatusResponse = await CtaTrainHandler.asyncCallCta(mapid, route)
        .catch(error => {
            logger.error(error);
        });

    return alexaTrainStatusResponse;
};