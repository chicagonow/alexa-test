exports.buildAlexaResponse = (jsonObject) => {
    let msg = "";
    let stationName = jsonObject.ctatt.eta[0].staNm;
    let stopDestination = jsonObject.ctatt.eta[0].stpDe;
    let routeName = jsonObject.ctatt.eta[0].rt;
    let arrivalTime = utcToString(jsonObject.ctatt.eta[0].arrT);
    msg = msg + "The " + stationName + " " + routeName + " "
             + stopDestination + " will arrive at " + arrivalTime; 
    return msg;
};

let utcToString = (dateObj) => {
    let d = new Date(dateObj);
    let hour = d.getHours() == 0 ? 12 : (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let ampm = d.getHours() < 12 ? 'AM' : 'PM';
    let time = hour + ':' + min + ' ' + ampm;
    return time;
};