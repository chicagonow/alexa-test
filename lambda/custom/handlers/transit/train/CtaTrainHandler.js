const request = require('request');
const buildUrl = require('build-url');
const TransitResponseBuilder = require('./TransitResponseBuilder');
const TrainRepository = require('../../../repositories/transit/CtaTrainRepository');
const LocationHandler = require('../../location/LocationHandler');

const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

/**
 * Gets the nearest train station info
 * @param {object} parameters 
 * @param {function} callback 
 */
exports.searchTrainNearMe = (parameters, callback) => {

    LocationHandler.getLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, (location) => {
        TrainRepository.getNearestTrainMapID(location.latitude, location.longitude, (mapID) => {
            let parameters = {
                mapID: mapID,
                rt: ""
            };

            callCta(parameters, callback);
        });
    });    
};

let callCta = (parameters, callback) => {
    let url = buildUrl(CTA_API_DOMAIN, {
        path: CTA_API_PATH,
        queryParams: {
            key: CTA_API_KEY,
            mapid: parameters.mapID,
            rt: parameters.rt,
            outputType: "JSON"
        }
    });

    request(url,  (error, response, body) => {        
        let alexaResponse = TransitResponseBuilder.buildAlexaResponse(JSON.parse(body));
        callback(alexaResponse);        
    });
};