const LocationHandler=require('../handlers/location/LocationHandler');
const EventsHandler=require('../handlers/events/EventsHandler');
const BusHandler=require('../handlers/transit/bus/BusHandler');
<<<<<<< HEAD
=======
const CtaTrainHandler=require('../handlers/transit/train/CtaTrainHandler');
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2

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
<<<<<<< HEAD
=======

exports.getStatusOfTrainStation = async function getStatusOfTrainStation(ctaTrainParameters){
    let alexaTrainStatusResponse = await CtaTrainHandler.asyncCallCta(ctaTrainParameters)
        .catch(error => {
            console.error(error);
        });

    return alexaTrainStatusResponse;
};
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
