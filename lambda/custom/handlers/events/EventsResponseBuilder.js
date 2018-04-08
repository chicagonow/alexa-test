const NUMBER_OF_EVENTS = 3;

exports.buildAlexaResponse = (jsonObject) => {
    let msg = "Here are " + NUMBER_OF_EVENTS + " events going on in Chicago ";

    msg += "<break time=\"1s\"/>" +
        "<speak>";

    let eventsArray = buildEventArray(jsonObject.events);

    msg += eventsArray.join(", ");
    msg += "</speak>";

    return msg;
};

let buildEventArray = (events) => {
    let eventsArray = [];
    for (let index = 0; index < NUMBER_OF_EVENTS; index++) {
        eventsArray.push("<s>" + events[index].name.text + "</s>");
    }
    return eventsArray;
};