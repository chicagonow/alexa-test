const request = require('request');
const buildUrl = require('build-url');
const distanceCalc = require('../../helpers/DistanceCalculator');

const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_STOPS_PATH = '/bustime/api/v2/getstops';


/*take latitude, long, return nearest stopID*/
exports.getNearestBusStopId = (parameters, latitude, longitude, callback) => {
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_STOPS_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: parameters.rt,
            dir: parameters.dir,
            format: "json"
        }
        
    });

    request(url,  (error, response, body) => {
        let stopId = closestStopId(latitude, longitude, JSON.parse(body));
        callback(stopId);
    });
};

/* take JSON response from API, return nearest stopID*/
closestStopId = (latitude, longitude, ctaBusStopResponse) => {
    const bustimeResponse = ctaBusStopResponse["bustime-response"];

    let length = Object.keys(bustimeResponse.stops).length;
    let closestStopId = bustimeResponse.stops[0].stpid;
    let closestDistance = 9999999999;

    for (let i = 0; i < length; i++){
        let thisStop = bustimeResponse.stops[i];
        let lat = thisStop.lat;
        let long = thisStop.lon;
        let thisDistance = distanceCalc.getDistance(latitude,longitude,lat,long, distanceCalc.Unit.M);
        let thisStopId = thisStop.stpid;

        if (thisDistance < closestDistance){
            closestDistance = thisDistance;
            closestStopId = thisStopId;
        }
    }
    return closestStopId;
};