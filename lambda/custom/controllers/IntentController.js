const LocationHandler=require('../handlers/location/LocationHandler');
const EventsHandler=require('../handlers/events/EventsHandler');


exports.getEventsWithUserLocation = async function getEventsWithUserLocation(apiEndpoint, token, deviceID){
    let locationObj = await LocationHandler.asyncGetLocation(apiEndpoint, token, deviceID);
    let alexaResponse = await EventsHandler.asyncGetEventsNearUserLocation(locationObj.latitude, locationObj.longitude);
    return alexaResponse;
}