// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../response.alexa.json');
const responseDeviceLocation = require('../../../response.deviceLocation');
const responseBuses = require('../../../response.buses.json');
const responseRepoBuses = require('../../../response.repo.buses.json');

// import files we need to test
const BusHandler = require('../../../../handlers/transit/bus/BusHandler');
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

        // Mock CTA Bus Repository call
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getstops')
        .query(true)
        .reply(200, responseRepoBuses);

        // Mock CTA API call
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpredictions')
        .query(true)
        .reply(200, responseBuses);
        
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
        BusHandler.asyncGetBusesWithUserLocation(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, "bus shit");
            done();
        });
    });

    // Tests the BusHandler method
    it('BusHandler: returns correct Alexa Response', function(done) {
       let parameters = {
           stopId: "4727",
           rt: "20"
       }
        
        BusHandler.asyncGetBusesWithUserLocation(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, "The Eastbound Bus towards Michigan will arrive at 8:27 PM");
            done();
        });
    });
});