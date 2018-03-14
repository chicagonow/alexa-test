const utcToString = require('../../../helpers/UTCTimeToEnglish');

exports.buildAlexaResponse = (jsonObject) => {
    let msg = "";

    let predictionResponse = jsonObject["bustime-response"].prd[0];
    let route = predictionResponse.rt;
    let destination = predictionResponse.des;
    let routeDirection = predictionResponse.rtdir;
    let predictedTime = predictionResponse.prdtm;
    let arrivalTime = utcToString.ctaBusDateToString(predictedTime);

    msg += "The " + routeDirection + " " + route + " bus towards " + destination + " will arrive at " + arrivalTime;
    return msg;
};