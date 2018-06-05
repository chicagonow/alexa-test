const asyncRequest = require('request-promise');

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

    asyncRequest(options);        
};


