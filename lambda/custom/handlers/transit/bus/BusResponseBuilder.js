const utcToString = require('../../../helpers/UTCTimeToEnglish').ctaBusDateToString;

exports.buildAlexaResponse = (jsonObject) => {
    var msg = ""
    var route = jsonObject["bustime-response"].prd[0].rt;
    var destination = jsonObject["bustime-response"].prd[0].des;
    var direction = jsonObject["bustime-response"].prd[0].rtdir;
    var UTC = jsonObject["bustime-response"].prd[0].prdtm;
    var arrivalTime = utcToString(UTC);
    msg = msg + "The " + direction + " " + route + " towards " + destination
             + " will arrive at " + arrivalTime; 
    return msg;
};