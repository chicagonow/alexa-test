const busHandler = require("../../../handlers/transit/bus/BusHandler");
const alexaJson = require('../../example-alexa-json-bus.json');
const ParameterHelper = require('../../../helpers/ParameterHelper')
const util = require('util');

exports.testBusHandler = () => {
    var parameters = {rt: 22,
                      stpid: 1806}
    var response = busHandler.getBusesForRouteAndStop(parameters, (response) => {
        console.log(response);
    });
}

exports.testBusSearchHandler = () => {
    let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
    parameters.rt = alexaJson.request.intent.slots.busStop.value;
    parameters.dir = alexaJson.request.intent.slots.busDirection.value;
    console.log("Parameters input into searchBusNearMe \n" + util.inspect(parameters, false, null));
    busHandler.searchBusNearMe(parameters, (response) => {
        console.log(response);
    });
}

require('make-runnable');    