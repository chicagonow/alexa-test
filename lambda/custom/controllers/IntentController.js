const LocationHandler=require('../handlers/location/LocationHandler');
const EventsHandler=require('../handlers/events/EventsHandler');
const CtaTrainHandler=require('../handlers/transit/train/CtaTrainHandler');

// take device information, get lat long
// take lat long return events near location
exports.getEventsWithUserLocation = async function getEventsWithUserLocation(apiEndpoint, token, deviceID){
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID);
    let alexaResponse = await EventsHandler.asyncGetEventsNearUserLocation(locationObj.latitude, locationObj.longitude);
    return alexaResponse;
};

exports.getStatusOfTrainStation = async function getStatusOfTrainStation(ctaTrainParameters){
    let alexaTrainStatusResponse = await CtaTrainHandler.asyncCallCta(ctaTrainParameters);
    return alexaTrainStatusResponse;
};