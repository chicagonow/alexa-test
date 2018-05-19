const aws = require('aws-sdk');
const logger = require("../../logging/Logger");

/**
 * Adds or updates a user in the databae
 * @param {string} userID 
 */
exports.updateUser = async function(userID) {
    let lambda = getLambda();

    // Set the payload to send to the database service
    let payload = {
        httpMethod: "PUT",
        parameters: {
            TableName: "User",
            UserID: userID
        }
    };

    // Invoke the database service and pass the payload
    lambda.invoke({
        FunctionName: 'DatabaseService',
        Payload: JSON.stringify(payload)
    }, (error, data) => {
        if (error) {
            logger.error("Error adding user: " + error.message);
        } else {
            logger.info("Added to User table user: " + userID);
        }
    });
};

let getLambda = () => {
    return new aws.Lambda({
        region: 'us-east-1'
    });
};


