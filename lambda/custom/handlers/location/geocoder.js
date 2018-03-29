var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'mapquest',

  // Optional depending on the providers
  httpAdapter: 'https', // Default
  apiKey: 'gDv2NLrNGlP0RS2qQCxkRFBAA6qcF4FG',
  formatter: null         // 'gpx', 'string', ...
};

var geocoder = NodeGeocoder(options);

exports.getLatLong = (locationString, callback) => {
  geocoder.geocode(locationString, function (err, res) {
    var jsonObject = res[0];
    let location = {
      latitude: jsonObject.latitude,
      longitude: jsonObject.longitude
    }
    callback && callback(location);
  })
}

exports.asyncGetLatLong = async function asyncGetLatLong(locationString){
  let response = await geocoder.geocode(locationString);
  jsonObject = response[0];
  let location = {
    latitude: jsonObject.latitude,
    longitude: jsonObject.longitude
  }
  return location;
}
