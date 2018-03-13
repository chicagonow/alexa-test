const request = require('request');
const buildUrl = require('build-url');
const TransitResponseBuilder = require('./TransitResponseBuilder');
const TrainHandler = require('./train/CtaTrainHandler');
const BusHandler = require('./bus/BusHandler');

const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';

exports.searchTransit = (parameters, callback) => {
    let url = buildUrl(CTA_API_DOMAIN, {
        path: CTA_API_PATH,
        queryParams: {
            key: CTA_API_KEY,
            mapid: parameters.mapid,
            rt: parameters.rt,
            outputType: "JSON"
        }
    });

    request(url,  (error, response, body) => {        
        let alexaResponse = TransitResponseBuilder.buildAlexaResponse(JSON.parse(body));
        callback(alexaResponse);        
    });
};

/**
 * Searches the CTA Train API with the nearest train station
 * @param {object} parameters 
 * @param {function} callback 
 */
exports.searchTrainNearMe = (parameters, callback) => {
    TrainHandler.searchTrainNearMe(parameters, (alexaResponse) => {
        callback(alexaResponse);
    })
};

    /**
 * Searches the CTA Bus API with the nearest bus stop
 * @param {object} parameters 
 * @param {function} callback 
 */
exports.searchBusNearMe = (parameters, callback) => {
    console.log("TransitHandler routing to BusHandler");
    BusHandler.searchBusNearMe(parameters, (alexaResponse) => {
        callback(alexaResponse);
    })
};