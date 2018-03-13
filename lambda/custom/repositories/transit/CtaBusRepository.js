const request = require('request');
const buildUrl = require('build-url');
const LocationHandler = require('../../handlers/location/LocationHandler');
const distanceCalc = require('../../helpers/DistanceCalculator');
const util = require('util');

const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_PATH = '/bustime/api/v2/getstops';


/*take latitude, long, return nearest stopID*/
exports.getNearestBusStopId = (parameters, latitude, longitude, callback) => {
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: parameters.rt,
            dir: parameters.dir,
            format: "json"
        }
        
    });

    request(url,  (error, response, body) => {      
        let stopId = closestStopId(latitude, longitude, JSON.parse(body));
    });
};

/* take JSON response from API, return nearest stopID*/
closestStopId = (latitude, longitude, ctaJSONResponse) => {
    var length = Object.keys(ctaJSONResponse["bustime-response"].stops).length;
    var closestStopID = ctaJSONResponse["bustime-response"].stops[0].stpid;
    var closestDistance = distanceCalc.getDistance(latitude, longitude, ctaJSONResponse["bustime-response"].stops[0].lat, ctaJSONResponse["bustime-response"].stops[0].lon);
    for (let i = 0; i < length; i++){
        var lat = ctaJSONResponse["bustime-response"].stops[i].lat;
        var long = ctaJSONResponse["bustime-response"].stops[i].lon;
        var thisDistance = distanceCalc.getDistance(latitude,longitude,lat,long,'M');
        var thisStopId = ctaJSONResponse["bustime-response"].stops[i].stpid
        if (thisDistance < closestDistance){
            closestDistance = thisDistance;
            closestStopId = thisStopId;
        }
    }
    return closestStopId;
}