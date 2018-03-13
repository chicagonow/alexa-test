const TrainHandler = require('../../../../handlers/transit/train/CtaTrainHandler');
const alexaJson = require('../../../example-alexa-json.json');
const ParameterHelper = require('../../../../helpers/ParameterHelper');

let searchTrainNearMeTest = () => {
    let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
    TrainHandler.searchTrainNearMe(parameters, (alexaResponse) => {
        console.log(alexaResponse);
    })
};

exports.all = () => {
    searchTrainNearMeTest();
};

require('make-runnable');