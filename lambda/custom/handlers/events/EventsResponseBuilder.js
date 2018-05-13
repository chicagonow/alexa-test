const logger = require("../../logging/Logger");
const MAX_NUMBER_OF_EVENTS = 3;

exports.buildAlexaResponse = (jsonObject) => {
    let eventsArray = buildEventArray(jsonObject.events);

    if (eventsArray.length < 1) {
        return "Your request returned no events."
    }

    let msg = "Here are " + eventsArray.length + " events going on in Chicago. ";
    msg += eventsArray.join(", ");

    logger.info("built event response: " + msg);
    return msg;
};

let buildEventArray = (events) => {
    let eventsArray = [];
    let numberOfEvents = events.length < MAX_NUMBER_OF_EVENTS
        ? events.length
        : MAX_NUMBER_OF_EVENTS;

    for (let index = 0; index < numberOfEvents; index++) {
        let sanitizedEvent = events[index].name.text
            .toLocaleLowerCase()
            .replace("®", "")
            .replace("&", " and ");

        eventsArray.push(sanitizedEvent);
    }
    return eventsArray;
};