const busHandler = require("../../../handlers/transit/bus/BusHandler");
const alexaJson = require('../../example-alexa-json-bus.json');
const ParameterHelper = require('../../../helpers/ParameterHelper');
const util = require('util');

exports.testBusHandler = () => {
    let parameters = {rt: 22,
                      stpid: 1806};
    let response = busHandler.getBusesForRouteAndStop(parameters, (response) => {
    });
};

exports.testBusSearchHandler = () => {
    let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
    parameters.rt = alexaJson.request.intent.slots.busStop.value;
    parameters.dir = alexaJson.request.intent.slots.busDirection.value;
    busHandler.searchBusNearMe(parameters, (response) => {
    });
};

require('make-runnable');    