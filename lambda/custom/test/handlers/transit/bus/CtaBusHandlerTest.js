// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../response.alexa.json');
const responseDeviceLocation = require('../../../response.deviceLocation');
const getPred20Response = require('../../../response.getPredictions20');
const getPred49Response = require('../../../response.getPredictions49');
const responseRepoBuses = require('../../../response.getStops20');
const getPatterns20Response = require('../../../../test/response.getPatterns20');
const getPatterns49Response = require('../../../../test/response.getPatterns49');

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
        // Mock Device Location request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);

        // Mock CTA Bus Repository call
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query(true)
            .reply(200, responseRepoBuses);

        // Mock CTA API call
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpredictions')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', stpid: '4727', format: 'json'})
        .reply(200, getPred20Response);

         // Mock CTA API call
         nock('http://ctabustracker.com')
         .get('/bustime/api/v2/getpredictions')
         .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', stpid: '386', format: 'json'})
         .reply(200, getPred20Response);

        // Mock CTA API call
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpredictions')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', stpid: '8245', format: 'json'})
        .reply(200, getPred49Response);
        
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

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();  
        
        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20});        
    });

    afterEach(function() {
        // restore the test environment
        sandbox.restore();
        nock.cleanAll();
    });

    // Tests the BusHandler method
    it('AsyncGetBusesWithUserLocation: returns correct Alexa Response', async function() {
        let alexaResponse = await BusHandler.asyncGetBusesWithUserLocation(20, 'Eastbound', 41, -81.7);
        assert.equal(alexaResponse, 'The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM');
    }); 

    it('AsyncGetBusesByStop: returns correct Alexa Response', async function() {
        let alexaResponse = await BusHandler.asyncGetBusesByStop(49, 8245);
        assert.equal(alexaResponse, 'The Southbound 49 bus towards 79th will arrive at stop 8245 at 11:20 PM');
    });
});