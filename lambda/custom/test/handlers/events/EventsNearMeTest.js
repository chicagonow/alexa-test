const EventsHandler = require('../../../handlers/events/EventsHandler');
const alexaJson = require('../../example-alexa-json.json');
const ParameterHelper = require('../../../helpers/ParameterHelper');

let searchEventsNearMeTest = () => {
    let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
    EventsHandler.searchEventsNearMe(parameters, (alexaResponse) => {
        console.log(alexaResponse);
    })
};

exports.all = () => {
    searchEventsNearMeTest();
};

require('make-runnable')