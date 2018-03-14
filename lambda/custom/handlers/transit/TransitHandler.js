const request = require('request');
const buildUrl = require('build-url');
const TransitResponseBuilder = require('./TransitResponseBuilder');
const TrainHandler = require('./train/CtaTrainHandler');
const BusHandler = require('./bus/BusHandler');

/**
 * Searches the CTA Train API with the specified train parameters
 * @param {object} parameters 
 * @param {function} callback 
 */
exports.searchTransit = (parameters, callback) => {
    TrainHandler.searchTrain(parameters, callback);
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
    BusHandler.searchBusNearMe(parameters, (alexaResponse) => {
        callback(alexaResponse);
    })
};