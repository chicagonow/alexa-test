const asyncRequest = require('request-promise');
const logger = require("../../logging/Logger");

/**
 * Adds or updates a user in the database
 * @param {string} requestId
 * @param {string} deviceId
 * @param {number} latitude
 * @param {number} longitude
 */
exports.insertLocation = (requestId, deviceId, latitude, longitude) => {
    var options = {
        method: 'POST',
        uri: process.env.LOCATION_UPDATE_URI,
        body: {
            locationEntry: {
                requestId: requestId,
                deviceId: deviceId,
                latitude: latitude,
                longitude: longitude
            }
        },
        json: true
    };

    asyncRequest(options).catch(error => {
        logger.error("error with location data upload: " + error.message);
    }); 
};


