const busHandler = require("../../../custom/handlers/transit/BusHandler");

exports.testBusHandler = () => {
    var parameters = {rt: 22,
                      stpid: 1806}
    var response = busHandler.getBusesForRouteAndStop(parameters);
    console.log(response);
}

require('make-runnable');