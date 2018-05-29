const request = require('request');
const buildUrl = require('build-url');
const TransitResponseBuilder = require('../TransitResponseBuilder');
const TrainRepository = require('../../../repositories/transit/CtaTrainRepository');
const LocationHandler = require('../../location/LocationHandler');
const asyncRequest = require('request-promise');
const logger = require("../../../logging/Logger");
const ParameterHelper = require("../../../helpers/ParameterHelper");
const locationRepository = require("../../../repositories/database/LocationRepository");

const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';


/**
 * Gets the nearest train station info
 * @param event
 * @param {function} callback
 */
exports.searchTrainNearMe = async (event, callback) => {
    let locationParameters = ParameterHelper.getLocationParameters(event.context.System);
    let locationObject = await LocationHandler.asyncGetLocation(locationParameters.apiEndpoint, locationParameters.token, locationParameters.deviceID);

    let requestId = event.request.requestId.split("amzn1.echo-api.request.")[1];
    locationRepository.insertLocation(requestId, locationParameters.deviceId, locationObject.latitude, locationObject.longitude);

    TrainRepository.getNearestTrainMapID(locationObject.latitude, locationObject.longitude, (mapID) => {
        let parameters = {
            mapid: mapID,
            rt: ""
        };

        callCta(parameters, callback);
    });
};

/**
 * Calls the CTA Train API
 * @param {object} parameters
 * @param {function} callback
 */
let callCta = (parameters, callback) => {
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
 * Calls the CTA Train API
 * @param {object} ctaTrainParameters 
 */
exports.asyncCallCta = async function asyncCallCta(stopId) {
    let url = buildUrl(CTA_API_DOMAIN, {
        path: CTA_API_PATH,
        queryParams: {
            key: CTA_API_KEY,
            stpid: stopId,
            outputType: "JSON"
        }
    });


    let alexaTrainStatusResponse = "";

    let responseBody = await asyncRequest(url)
        .catch(error => {
            logger.error("error with cta train request: " + error.message);
        });

    try {
        alexaTrainStatusResponse = TransitResponseBuilder.buildAlexaResponse(JSON.parse(responseBody));
    } catch (err) {
        alexaTrainStatusResponse = "There was an error with the CTA train service response.";
        logger.error("The request body was: " + responseBody);
        logger.error(err);
    }

    return alexaTrainStatusResponse;
};
