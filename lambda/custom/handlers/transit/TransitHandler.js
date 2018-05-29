const TrainHandler = require('./train/CtaTrainHandler');


/**
 * Searches the CTA Train API with the nearest train station
 * @param {object} parameters 
 * @param {function} callback 
 */
exports.searchTrainNearMe = (event, callback) => {

    TrainHandler.searchTrainNearMe(event, (alexaResponse) => {
        callback(alexaResponse);
    })
};