const request = require('request');
const buildUrl = require('build-url');
const TransitResponseBuilder = require('../TransitResponseBuilder');
const TrainRepository = require('../../../repositories/transit/CtaTrainRepository');
const LocationHandler = require('../../location/LocationHandler');
const asyncRequest = require('request-promise');
const logger = require("../../../logging/Logger");

const CTA_API_KEY = '541afb8f3df94db2a7afffc486ea4fbf';
const CTA_API_DOMAIN = 'http://lapi.transitchicago.com';
const CTA_API_PATH = '/api/1.0/ttarrivals.aspx';


/**
 * Calls the CTA Train API
 * @param {object} ctaTrainParameters 
 */
exports.asyncCallCta = async function asyncCallCta(mapid, route) {
    let url = buildUrl(CTA_API_DOMAIN, {
        path: CTA_API_PATH,
        queryParams: {
            key: CTA_API_KEY,
            mapid: mapid,
            rt: route,
            outputType: "JSON"
        }
    });


    let alexaTrainStatusResponse = "";

    let responseBody = await asyncRequest(url)
        .catch(err => {
            logger.error(err);
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
