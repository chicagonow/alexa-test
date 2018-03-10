const request = require('request');
const API_LOCATION_QUERY = "/v1/devices/{deviceID}/settings/address";
const geocoder = require('./geocoder');

// Default Location if the API isn't able to get the device's location
const DEFAULT_LOCATION = {
    stateOrRegion: "IL",
    city: "Chicago",
    countryCode: "US",
    postalCode: "98109",
    addressLine1: "243 S Wabash Ave"
};

/**
 * Returns an address object
 * @param {string} apiEndpoint 
 * @param {string} token 
 * @param {string} deviceId 
 * @param {function} callback 
 */
exports.getLocation = (apiEndpoint, token, deviceId, callback) => {
    // build the api url to get the location
    let url = apiEndpoint + API_LOCATION_QUERY.replace("{deviceID}", deviceId);

    var options = {
        url: url,
        headers: {
            'Authorization': "Bearer " + token
        }
    };

    // Call the Amazon API to get the device's location
    request(options, (error, response, body) => {
        let location = response.statusCode === 200 ? JSON.parse(body) : DEFAULT_LOCATION;
  // callback && callback(location);
        let locationString = location.addressLine1 + ',' + location.city + ',' + location.stateOrRegion;
        geocoder.getLatLong(locationString, callback);
    });
};