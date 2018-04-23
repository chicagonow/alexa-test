//libraries
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

//imports
const IntentController = require('../../controllers/IntentController');
const geocoder = require('../../handlers/location/geocoder');

// responses
const responseDeviceLocation = require('../response.deviceLocation');
const responseEvents = require('../data/events/response.events');
const responseEventsToday = require('../data/events/response.eventsToday');
const alexaJson = require('../response.alexa.json');
const alexaRequest = require('../data/events/request.alexa.eventsNearMe.json');

describe('IntentController Tests', function() {
    let sandbox;

    beforeEach(function() {

        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);

        // Mock the eventbrite API call
        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function (queryObject) {
                return !queryObject["start_date.range_start"];
            })
            .reply(200, responseEvents);

        // Mock response for events between a certain time range
        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function (queryObject) {
                return queryObject["start_date.range_start"];
            })
            .reply(200, responseEventsToday);

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

        let alexaResponse = await IntentController.getEvents(alexaRequest);
        assert.equal(alexaResponse, "Here are 3 events going on in Chicago. martin trivia night (free entry), 2018 kidfitstrong fitness challenge-chicago , redesigning the system: how artists, policymakers, and practitioners are shaping criminal justice reform");
    });

    it('Test IntentController.getEventsWithinTimeFrame: return 3 events occuring today in string', async function() {
        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;
        let date = "2018-05-15";

        let expectedResponse = "Here are 3 events going on in Chicago. chicago professional  and  technology diversity career fair, 10th stem cell clonality and genome stability retreat, made to win rooftop social ";
        let alexaResponse = await IntentController.getEventsWithinTimeFrame(apiEndpoint, apiAccessToken, funcDeviceId, date);
        assert.equal(alexaResponse, expectedResponse);
    });
});