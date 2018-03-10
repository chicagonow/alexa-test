const utcToString = require('../../helpers/UTCTimeToEnglish');

exports.buildAlexaResponse = (jsonObject) => {
    var msg = ""
    var route = jsonObject.bustime-response.vehicle[0].rt;
    var destination = jsonObject.bustime-response.vehicle[0].des;
    var direction = jsonObject.bustime-response.vehicle[0].rtdir;
    var arrivalTime = utcToString(jsonObject.bustime-response.vehicle[0].tmstmp);
    msg = msg + "The " + direction + " " + route + " towards" + destination + " "
             + " will arrive at " + arrivalTime; 
    return msg;
};