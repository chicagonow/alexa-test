const LocationHandler = require('../../../custom/handlers/location/LocationHandler');
const alexaJson = require('../../example-alexa-json.json');

let latLongTest = () => {}
    LocationHandler.getLocation(alexaJson.context.System.apiEndpoint, 
        alexaJson.context.System.apiAccessToken, alexaJson.context.System.device.deviceId, (location) => {            
        if (location) {
            console.log(location.latitude);
            console.log(location.longitude);
        } else {
            throw "Location was not found";
        }
    });
;

exports.all = () => {
    latLongTest();
};