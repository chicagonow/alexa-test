const aws = require('aws-sdk');
const logger = require("../../logging/Logger");

exports.updateUser = async function(userID) {
    let lambda = getLambda();

    let payload = {
        httpMethod: "PUT",
        parameters: {
            TableName: "User",
            UserID: userID
        }
    };

    lambda.invoke({
        FunctionName: 'DatabaseService',
        Payload: JSON.stringify(payload)
    }, (error, data) => {
        if (error) {
            logger.error("Error adding user: " + error.message);
        } else {
            logger.log("Added to User table user: " + userID);
        }
    });
};

let getLambda = () => {
    return new aws.Lambda({
        region: 'us-east-1'
    });
};


