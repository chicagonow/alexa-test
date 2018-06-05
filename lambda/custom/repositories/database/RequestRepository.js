const asyncRequest = require('request-promise');
const logger = require("../../logging/Logger");

/**
 * Inserts a request object into the database
 * @param {object} requestEntry 
 */
exports.insertRequest = async function(requestEntry) {
    var options = {
        method: 'POST',
        uri: process.env.REQUEST_UPDATE_URL,
        body: {
            requestEntry: requestEntry
        },
        json: true
    };

    asyncRequest(options).catch(error => {
        logger.error("error with request data upload: " + error.message);
    });        
};