const LocationHandler=require('../handlers/location/LocationHandler');
const EventsHandler=require('../handlers/events/EventsHandler');
const BusHandler=require('../handlers/transit/bus/BusHandler');
const CtaTrainHandler=require('../handlers/transit/train/CtaTrainHandler');

const AmazonDateParser = require('amazon-date-parser');

// take device information, get lat long
// take lat long return events near location
exports.getEventsWithUserLocation = async function getEventsWithUserLocation(apiEndpoint, token, deviceID){
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID)
        .catch(error => {
            console.error(error);
        });

    let alexaResponse = await EventsHandler.asyncGetEventsNearUserLocation(locationObj.latitude, locationObj.longitude)
        .catch(error => {
            console.error(error);
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
            console.error(error);
        });
    
    // Get Date time frame
    var timeFrame = new AmazonDateParser(date);

    // Return response
    let alexaResponse = await EventsHandler.asyncGetEventsWithinTimeFrame(locationObj.latitude, locationObj.longitude, timeFrame.startDate, timeFrame.endDate)
        .catch(error => {
            console.error(error);
        });
    
    return alexaResponse;
};

exports.getBusesWithUserLocation = async function getBusesWithUserLocation(apiEndpoint, token, deviceID, route, direction){
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID)
        .catch(error => {
            console.error(error);
        });

    let alexaResponse = await BusHandler.asyncGetBusesWithUserLocation(route, direction, locationObj.latitude, locationObj.longitude)
        .catch(error => {
            console.error(error);
        });

    return alexaResponse;
};

exports.getStatusOfTrainStation = async function getStatusOfTrainStation(mapid, route){
    let alexaTrainStatusResponse = await CtaTrainHandler.asyncCallCta(mapid, route)
        .catch(error => {
            console.error(error);
        });

    return alexaTrainStatusResponse;
};
