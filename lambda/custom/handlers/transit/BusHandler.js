const request = require('request');
const buildUrl = require('build-url');
const BusResponseBuilder = require('./BusResponseBuilder');

const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_PATH = '/bustime/api/v2/getpredictions';

exports.getBusesForRouteAndStop = (parameters, callback) => {
    console.log("Running BusHandler Test");
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            Rt: parameters.rt,
            stpid: parameters.stpid,
            outputType: "JSON"
        }
    });

    request(url,  (error, response, body) => {      
        console.log("entered request method");
        console.log(body);  
        let alexaResponse = BusResponseBuilder.buildAlexaResponse(JSON.parse(body));
        callback(alexaResponse);        
    });
};