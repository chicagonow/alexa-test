exports.buildAlexaResponse = (jsonObject) => {
    var msg = ""
    var stationName = jsonObject.ctatt.eta[0].staNm;
    var stopDestination = jsonObject.ctatt.eta[0].stpDe;
    var routeName = jsonObject.ctatt.eta[0].rt;
    var arrivalTime = utcToString(jsonObject.ctatt.eta[0].arrT);
    msg = msg + "The " + stationName + " " + routeName + " "
             + stopDestination + " will arrive at " + arrivalTime; 
    return msg;
};

utcToString = (dateObj) => {
    var d = new Date(dateObj);
    var hour = d.getHours() == 0 ? 12 : (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var ampm = d.getHours() < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + ampm;
    return time;
}