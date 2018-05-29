const aws = require('aws-sdk');
const logger = require("../../logging/Logger");

/**
 * Adds or updates a user in the database
 * @param {string} requestId
 * @param {string} deviceId
 * @param {number} latitude
 * @param {number} longitude
 */
exports.insertLocation = (requestId, deviceId, latitude, longitude) => {
    let lambda = getLambda();

    // Set the payload to send to the database service
    let insertLocationPayload = {
        httpMethod: "POST",
        parameters: {
            TableName: "location",
            locationEntry: {
                requestId: requestId,
                deviceId: deviceId,
                latitude: latitude,
                longitude: longitude
            }
        }
    };

    // Invoke the database service and pass the payload
    lambda.invoke({
        FunctionName: 'DatabaseService',
        Payload: JSON.stringify(insertLocationPayload)
    }, (error, data) => {
        if (error) {
            logger.error("Error inserting location entry: " + error.message);
        } else {
            logger.info("Successfully inserted location entry for requestId: " + requestId);
        }
    });
};

let getLambda = () => {
    return new aws.Lambda({
        region: 'us-east-1'
    });
};


