// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../response.alexa.json');
const responseDeviceLocation = require('../../../response.deviceLocation');
const responseTrains = require('../../../response.trains');
const responseRepoTrains = require('../../../response.repo.trains.json');

// import files we need to test
const TrainHandler = require('../../../../handlers/transit/train/CtaTrainHandler');
const ParameterHelper = require('../../../../helpers/ParameterHelper');

// Geocoder we need to mock
const geocoder = require('../../../../../custom/handlers/location/geocoder');

/**
 * Verifies the CtaTrainHandler works properly
 */
describe('CtaTrainHandler Tests', function() {
    // sinon test environment
    var sandbox;

    beforeEach(function() {

        // Mock Device Location request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();        

        // Mock CTA Train Repository call
        nock('https://data.cityofchicago.org')
        .get('/resource/8mj8-j3c4.json')
        .query(true)
        .reply(200, responseRepoTrains);

        // Mock CTA API call
        nock('http://lapi.transitchicago.com')
        .get('/api/1.0/ttarrivals.aspx')
        .query(true)
        .reply(200, responseTrains);
        
    });

    afterEach(function() {
        // restore the test environment
        sandbox.restore();
    });

    // Tests the searchTrainNearMe method
    it('searchTrainNearMe: returns correct Alexa Response', function(done) {
        // The next 2 lines are basically saying to call the 2nd argument of getLatLong, which is the 
        // callback, with that location object instead of the location retrieved from the geocode library
        let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
        fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});

        let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
        TrainHandler.searchTrainNearMe(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
            done();
        });
    });

    // Tests the searchTrain method
    it('searchTrain: returns correct Alexa Response', function(done) {
       let parameters = {
           mapid: "40530",
           rt: "Brn"
       }
        
        TrainHandler.searchTrain(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
            done();
        });
    });
});