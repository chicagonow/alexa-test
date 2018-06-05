const asyncRequest = require('request-promise');
const logger = require("../../logging/Logger");

/**
 * Adds or updates a user in the databae
 * @param {string} userID 
 */
exports.updateUser = async function(userID) {
    var options = {
        method: 'POST',
        uri: process.env.USER_UPDATE_URL,
        body: {
            userID: userID
        }
    };

    let response = await asyncRequest(options).catch(error => {
        logger.error("error with user data upload: " + error.message);
    });
};


