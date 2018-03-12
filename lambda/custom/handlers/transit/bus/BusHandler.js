const request = require('request');
const buildUrl = require('build-url');
const BusResponseBuilder = require('./BusResponseBuilder');
const LocationHandler = require('../../location/LocationHandler');
const BusRepository = require('../../../repositories/transit/CtaBusRepository');
const util = require('util');


const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_PATH = '/bustime/api/v2/getpredictions';

exports.getBusesForRouteAndStop = (parameters, callback) => {
    console.log("Entered BusHandler.getBusesForRouteAndStop");
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: parameters.rt,
            stpid: parameters.stpid,
            format: "json"
        }
        
    });
    console.log(url);

    request(url,  (error, response, body) => {      
        console.log("entered request method");
        console.log(body);  
        let alexaResponse = BusResponseBuilder.buildAlexaResponse(JSON.parse(body));
        callback(alexaResponse);        
    });
};

/*
Call getLocation, forward longitude and parameters entered to Bus Stop Repository
*/
exports.searchBusNearMe = (parameters, callback) => {
    console.log("BusHandler.searchBusNearMe() routing to LocationHandler");
    LocationHandler.getLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, (location) => {
        console.log("latitude: " + location.latitude);
        console.log("longitude: " + location.longitude);
        console.log("Parameters input into getNearestBusStopId \n" + util.inspect(parameters, false, null));
        BusRepository.getNearestBusStopId(parameters, location.latitude, location.longitude, (stopID) => {
            parameters.stpid = stopID;
            this.getBusesForRouteAndStop(parameters, callback);
        });
    });    
};