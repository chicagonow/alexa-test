/*
Takes date object and converts it to english string which is readable by Alexa
*/
exports.utcToString = (dateObj) => {
    let d = new Date(dateObj);
    let hour = d.getHours() == 0 ? 12 : (d.getHours() > 12 ? d.getHours() - 12 : d.getHours());
    let min = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    let ampm = d.getHours() < 12 ? 'AM' : 'PM';
    let time = hour + ':' + min + ' ' + ampm;
    return time;
};

exports.ctaBusDateToString = (date) => {
    let d = CtaDate(date);
    let hour = d.hour == 0 ? 12 : (d.hour > 12 ? d.hour - 12 : d.hour);
    let min = d.minute;
    let ampm = d.hour < 12 ? 'AM' : 'PM';
    let time = hour + ':' + min + ' ' + ampm;
    return time;
};

//CTA date comes as YYYYMMDD HH:mm AP
let CtaDate = (ctaDate) => {
    return {
        year: ctaDate.substr(0, 4),
        month: ctaDate.substr(4, 2),
        day: ctaDate.substr(6, 2),
        hour: ctaDate.substr(9, 2),
        minute: ctaDate.substr(12, 2)
    }
};