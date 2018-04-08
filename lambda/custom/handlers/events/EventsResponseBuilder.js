const NUMBER_OF_EVENTS = 3;

exports.buildAlexaResponse = (jsonObject) => {
    let msg = "Here are " + NUMBER_OF_EVENTS + " events going on in Chicago. ";

    let eventsArray = buildEventArray(jsonObject.events);
    msg += eventsArray.join(", ");

    console.info("built event response: " + msg);
    return msg;
};

let buildEventArray = (events) => {
    let eventsArray = [];
    for (let index = 0; index < NUMBER_OF_EVENTS; index++) {
        eventsArray.push(
            events[index].name.text
                .toLocaleLowerCase()
                .replace("[^a-z\d\s:]", " ")
                .replace("®", "")
                .replace("&", " and ")
        );
    }
    return eventsArray;
};