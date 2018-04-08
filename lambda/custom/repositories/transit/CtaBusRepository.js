const request = require('request');
const asyncRequest = require('request-promise');
const buildUrl = require('build-url');
const distanceCalc = require('../../helpers/DistanceCalculator');

const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_STOPS_PATH = '/bustime/api/v2/getstops';
const CTABUS_API_PATTERNS_PATH = '/bustime/api/v2/getpatterns';

/*take latitude, long, return nearest stopID*/
exports.asyncGetStopIdWithLocation = async function asyncGetStopIdWithLocation(route, direction, latitude, longitude) {
    // build url
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_STOPS_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: route,
            dir: direction,
            format: "json"
        }
    });

    let body = await asyncRequest(url).catch(error => {
        console.error(error);
    });

    let ctaBusStopResponse = JSON.parse(body);
    const bustimeResponse = ctaBusStopResponse["bustime-response"];

    // set closest stop to first stop
    let length = Object.keys(bustimeResponse.stops).length;
    let closestStopId = bustimeResponse.stops[0].stpid;
    let closestDistance = 9999999999;

    // iterate through all stops find closest stop
    for (let i = 0; i < length; i++) {
        let thisStop = bustimeResponse.stops[i];
        let lat = thisStop.lat;
        let long = thisStop.lon;
        let thisDistance = distanceCalc.getDistance(latitude, longitude, lat, long, distanceCalc.Unit.M);
        let thisStopId = thisStop.stpid;

        if (thisDistance < closestDistance) {
            closestDistance = thisDistance;
            closestStopId = thisStopId;
        }
    }

    return closestStopId;
};

exports.asyncGetActiveStopIdWithLocation = async function asyncGetActiveStopIdWithLocation(route, direction, latitude, longitude) {
    // build url
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_PATTERNS_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: route,
            format: "json"
        }

    });
    // call cta
    let body = await asyncRequest(url).catch(error => {
        console.error(error);
    });

    // parse JSON
    let ctaBusPatternsResponse = JSON.parse(body);

    // convert to Javascript object
    const bustimeResponse = ctaBusPatternsResponse["bustime-response"];

    //iterate through patterns to find matching direction
    let busPattern = "";
    for (let i = 0; i < Object.keys(bustimeResponse.ptr).length; i++) {
        if (bustimeResponse.ptr[i].rtdir == direction) {
            busPattern = bustimeResponse.ptr[i];
            break;
        }
    }

    if (busPattern == "") {
        console.error("Incorrect Direction for Route Specified");
    }

    // set closest stop to first stop
    let length = Object.keys(busPattern.pt).length;
    let closestStopId = busPattern.pt[0].stpid;
    let closestDistance = 9999999999;

    // iterate through all stops find closest stop
    for (let i = 0; i < length; i++) {
        let thisStop = busPattern.pt[i];

        // if stop has a stop id, test for distance
        if (thisStop.stpId != undefined) {
            let lat = thisStop.lat;
            let long = thisStop.lon;
            let thisDistance = distanceCalc.getDistance(latitude, longitude, lat, long, distanceCalc.Unit.M);
            let thisStopId = thisStop.stpid;

            if (thisDistance < closestDistance) {
                closestDistance = thisDistance;
                closestStopId = thisStopId;
            }
        }
    }

    return closestStopId;
};

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

    request(url, (error, response, body) => {
        let stopId = closestStopId(latitude, longitude, JSON.parse(body));
        callback(stopId);
    });
};

/* take JSON response from API, return nearest stopID*/
let closestStopId = (latitude, longitude, ctaBusStopResponse) => {
    const bustimeResponse = ctaBusStopResponse["bustime-response"];

    let length = Object.keys(bustimeResponse.stops).length;
    let closestStopId = bustimeResponse.stops[0].stpid;
    let closestDistance = 9999999999;

    for (let i = 0; i < length; i++) {
        let thisStop = bustimeResponse.stops[i];
        let lat = thisStop.lat;
        let long = thisStop.lon;
        let thisDistance = distanceCalc.getDistance(latitude, longitude, lat, long, distanceCalc.Unit.M);
        let thisStopId = thisStop.stpid;

        if (thisDistance < closestDistance) {
            closestDistance = thisDistance;
            closestStopId = thisStopId;
        }
    }
    return closestStopId;
};

exports.closestStopId = closestStopId;
