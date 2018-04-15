//libraries
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

//imports
const IntentController = require('../../controllers/IntentController');
const responseDeviceLocation = require('../response.deviceLocation');
const responseEvents = require('../response.events');
const geocoder = require('../../handlers/location/geocoder');

//dummy files
const alexaJson = require('../response.alexa.json');


describe('IntentController Tests', function() {
    let sandbox;

    beforeEach(function() {

        // Mock device location API request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        // Mock the eventbrite API call
        nock('https://www.eventbriteapi.com')
        .get('/v3/events/search/')
        .query(true)
        .reply(200, responseEvents);

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();  
        
        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20});        
    });

    afterEach(function() {
        sandbox.restore();
        nock.cleanAll();
    });

    it('Test IntentController.getEventsWithUserLocation: return 3 events in string', async function(){

        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;

        let alexaResponse = await IntentController.getEventsWithUserLocation(apiEndpoint, apiAccessToken, funcDeviceId);
        assert.equal(alexaResponse, "Here are 3 events going on in Chicago. martin trivia night (free entry), 2018 kidfitstrong fitness challenge-chicago , redesigning the system: how artists, policymakers, and practitioners are shaping criminal justice reform");
    });
});