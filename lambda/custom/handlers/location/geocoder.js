const logger = require("../../logging/Logger");

let NodeGeocoder = require('node-geocoder');

let options = {
  provider: 'mapquest',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'gDv2NLrNGlP0RS2qQCxkRFBAA6qcF4FG',
  formatter: null         // 'gpx', 'string', ...
};

let geocoder = NodeGeocoder(options);

exports.getLatLong = (locationString, callback) => {
    geocoder.geocode(locationString, function (err, res) {
        let jsonObject = res[0];
        let location = {
            latitude: jsonObject.latitude,
            longitude: jsonObject.longitude
        };
        callback && callback(location);
    })
};

// take address, return location object with latitude and longitude
exports.asyncGetLatLong = async function asyncGetLatLong(locationString){
  let response = await geocoder.geocode(locationString).catch(error => {
    logger.error(error);
    logger.error(JSON.stringify(error))
  });

  let jsonObject = response[0];
  let location = {
    latitude: jsonObject.latitude,
    longitude: jsonObject.longitude
  };
  return location;
};
