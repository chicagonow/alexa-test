/*
Takes date object and converts it to english string which is readable by Alexa
*/
exports.utcToString = (dateObj) => {
    var d = new Date(dateObj);
    var hour = d.getHours() == 0 ? 12 : (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    var min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var ampm = d.getHours() < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + ampm;
    return time;
}

exports.ctaBusDateToString = (dateObj) => {
    var d = CtaDate(dateObj);
    var hour = d.hour == 0 ? 12 : (d.hour > 12 ? d.hour - 12 : d.hour);
    var min = d.minute;
    var ampm = d.hour < 12 ? 'AM' : 'PM';
    var time = hour + ':' + min + ' ' + ampm;
    return time;
}


var CtaDate = (ctaDate) => {
    let  ctaObject = {
    year: ctaDate.substr(0,4),
    month: ctaDate.substr(4,2),
    day: ctaDate.substr(6,2),
    hour: ctaDate.substr(9,2),
    minute: ctaDate.substr(12,2)
    }
    return ctaObject
}