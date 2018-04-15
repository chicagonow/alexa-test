const utcToString = require('../../../helpers/UTCTimeToEnglish');

exports.buildAlexaResponse = (jsonObject) => {
    let msg = "";
    let bustimeResponse = jsonObject["bustime-response"];
    if (bustimeResponse.prd) {
        let predictionResponse = jsonObject["bustime-response"].prd[0];
        let route = predictionResponse.rt;
        let destination = predictionResponse.des;
        let routeDirection = predictionResponse.rtdir;
        let predictedTime = predictionResponse.prdtm;
        let arrivalTime = utcToString.ctaBusDateToString(predictedTime);
        let busStopId = predictionResponse.stpid;
        msg += "The " + routeDirection + " " + route + " bus towards " + destination + " will arrive at stop " + busStopId + " at " + arrivalTime;
    }
    else if(bustimeResponse.error){
        let route = bustimeResponse.error[0].rt;
        let stopId = bustimeResponse.error[0].stpid;
        msg += "There is no scheduled service for stop " + stopId + " on route " + route;
    }

    return msg;
};