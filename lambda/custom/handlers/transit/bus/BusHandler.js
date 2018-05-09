const request = require('request');
const asyncRequest = require('request-promise');
const buildUrl = require('build-url');
const BusResponseBuilder = require('./BusResponseBuilder');
const LocationHandler = require('../../location/LocationHandler');
const BusRepository = require('../../../repositories/transit/CtaBusRepository');
const util = require('util');
const logger = require("../../../logging/Logger");

const CTABUS_API_KEY = 'mY73pz65XVB4Yc7GYAgqFrHQY';
const CTABUS_API_DOMAIN = 'http://ctabustracker.com';
const CTABUS_API_ROUTE_AND_STOP_PATH = '/bustime/api/v2/getpredictions';

let getBusesForRouteAndStop = (parameters, callback) => {
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_ROUTE_AND_STOP_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: parameters.rt,
            stpid: parameters.stpid,
            format: "json"
        }
        
    });

    request(url,  (error, response, body) => {      
        let alexaResponse = BusResponseBuilder.buildAlexaResponse(JSON.parse(body));
        callback(alexaResponse);        
    });
};

exports.getBusesForRouteAndStop = getBusesForRouteAndStop;

/*
Call getLocation, forward longitude and parameters entered to Bus Stop Repository
*/
exports.searchBusNearMe = (parameters, callback) => {
    LocationHandler.getLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, (location) => {
        BusRepository.getNearestBusStopId(parameters, location.latitude, location.longitude, (stopID) => {
            parameters.stpid = stopID;
            getBusesForRouteAndStop(parameters, callback);
        });
    });
};

exports.asyncGetBusesWithUserLocation = async function asyncGetBusesWithUserLocation(route, direction, latitude, longitude) {

    let alexaResponse = "";
    let stopId = await BusRepository.asyncGetActiveStopIdWithLocation(route, direction, latitude, longitude)
        .catch(error => {
            logger.error(error);
        });

    if (stopId == -1){
        alexaResponse = "Bus " + route + " does not go " + direction + ". Please ask again.";
        return alexaResponse;
    }
    else{

    alexaResponse = await this.asyncGetBusesForRouteAndStop(route, stopId)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
    }
};

exports.asyncGetBusesByStop = async function asyncGetBusesWithUserLocation(route, stopId) {
    let alexaResponse = await this.asyncGetBusesForRouteAndStop(route, stopId)
        .catch(error => {
            logger.error(error);
        });

    return alexaResponse;
};

// take route, stopId, return String Alexa Response
exports.asyncGetBusesForRouteAndStop = async function asyncGetBusesForRouteAndStop(route, stopId){
    let url = buildUrl(CTABUS_API_DOMAIN, {
        path: CTABUS_API_ROUTE_AND_STOP_PATH,
        queryParams: {
            key: CTABUS_API_KEY,
            rt: route,
            stpid: stopId,
            format: "json"
        }
        
    });

    let body = await asyncRequest(url)
        .catch(error => {
            logger.error("error with cta bus request: " + error);
        });

    
    let alexaResponse = "";
    try {
        let responseBodyJson = JSON.parse(body);
        alexaResponse = BusResponseBuilder.buildAlexaResponse(responseBodyJson);
    } catch(error) {
        logger.error("response body was: " + responseBodyJson);
        logger.error(error);
        alexaResponse = "The specified bus stop has no scheduled service";
    }

    return alexaResponse;
};
