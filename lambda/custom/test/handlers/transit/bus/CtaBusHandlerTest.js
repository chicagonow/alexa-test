// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../response.alexa.json');
const responseDeviceLocation = require('../../../response.deviceLocation');
const responseBuses = require('../../../response.getPredictions20');
const responseRepoBuses = require('../../../response.getStops20');
<<<<<<< HEAD
=======
const getPatterns20Response = require('../../../../test/response.getPatterns20');
const getPatterns49Response = require('../../../../test/response.getPatterns49');
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2

// import files we need to test
const BusHandler = require('../../../../handlers/transit/bus/BusHandler');
const ParameterHelper = require('../../../../helpers/ParameterHelper');

// Geocoder we need to mock
const geocoder = require('../../../../handlers/location/geocoder');

/**
 * Verifies the CtaTrainHandler works properly
 */

describe('CtaBusHandler Tests', function() {
    // sinon test environment
    var sandbox;

    beforeEach(function() {
        nock.cleanAll();
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
        
<<<<<<< HEAD
=======
        // Mock getpatterns
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpatterns')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', format: 'json'})
        .reply(200, getPatterns20Response);

        // Mock getpatterns
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpatterns')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', format: 'json'})
        .reply(200, getPatterns49Response);
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
    });

    afterEach(function() {
        // restore the test environment
        sandbox.restore();
    });

    // Tests the searchTrainNearMe method
    it('searchBusNearMe: returns correct Alexa Response', function(done) {
        // The next 2 lines are basically saying to call the 2nd argument of getLatLong, which is the 
        // callback, with that location object instead of the location retrieved from the geocode library
        let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
<<<<<<< HEAD
        fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});
=======
        fakeGeocoder.callsArgWith(1, {latitude: 41, longitude: -87});
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2

        let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
        BusHandler.searchBusNearMe(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM");
            done();
        });
    });

    // Tests the BusHandler method
    it('AsyncBusHandler: returns correct Alexa Response', async function() {
<<<<<<< HEAD
        let alexaResponse = await BusHandler.asyncGetBusesWithUserLocation(20, 'Eastbound', -10, -81.7);
        assert.equal(alexaResponse, 'The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM');
    });
=======
        let alexaResponse = await BusHandler.asyncGetBusesWithUserLocation(20, 'Eastbound', 41, -81.7);
        assert.equal(alexaResponse, 'The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM');
    });

    
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
});