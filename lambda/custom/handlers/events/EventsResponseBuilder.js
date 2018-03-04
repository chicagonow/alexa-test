const NUMBER_OF_EVENTS = 3;

exports.buildAlexaResponse = (jsonObject) => {    
    let eventsArray = buildEventArray(jsonObject.events);
    // set prefix
    var msg = "Here are " + NUMBER_OF_EVENTS + " events going on in Chicago ";

    // add a break
    msg += "<break time=\"1s\"/>";

    // add events to the message
    msg += eventsArray.join(", ");
    return msg;
};

buildEventArray = (events) => {
    let eventsArray = [];
    for (let index = 0; index < NUMBER_OF_EVENTS; index++) {
        eventsArray.push(events[index].name.text);
    }
    return eventsArray;
};