const aws = require('aws-sdk');
const logger = require("../../logging/Logger");

/**
 * Inserts a request object into the database
 * @param {object} requestEntry 
 */
exports.insertRequest = async function(requestEntry) {
    let lambda = getLambda();

    // Set the payload to send to the database service
    let payload = {
        httpMethod: "POST",
        parameters: {
            TableName: "request",
            requestEntry: requestEntry
        }
    };

    // Invoke the database service and pass the payload
    lambda.invoke({
        FunctionName: 'DatabaseService',
        Payload: JSON.stringify(payload)
    }, (error, data) => {
        if (error) {
            logger.error("Error inserting request entry: " + error.message);
        } else {
            logger.info("Successfully inserted request entry for requestId: " + requestEntry.requestId);
        }
    });
};

let getLambda = () => {
    return new aws.Lambda({
        region: 'us-east-1'
    });
};