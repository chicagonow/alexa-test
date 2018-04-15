const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const alexaJson = require('../../response.alexa.json');
const responseDeviceLocation = require('../../response.deviceLocation');
const responseEvents = require('../../response.events');


const EventsHandler = require('../../../handlers/events/EventsHandler');
const ParameterHelper = require('../../../helpers/ParameterHelper');

const geocoder = require('../../../handlers/location/geocoder');

describe('EventsHandler Tests', function() {
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

    // Tests the searchEventsNearMe method
    describe("searchEventsNearMe", () => {
        const expectedEventsResponse = "Here are 3 events going on in Chicago. martin trivia night (free entry), 2018 kidfitstrong fitness challenge-chicago , redesigning the system: how artists, policymakers, and practitioners are shaping criminal justice reform";
        it('old callback way returns correct Alexa Response', function(done) {
            let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
            fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});

            let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
            EventsHandler.searchEventsNearMe(parameters, (alexaResponse) => {
                assert.equal(alexaResponse, expectedEventsResponse);
                done();
            });
        });

        // Tests the searchEventsNearMe method
        it('async-await call returns correct Alexa Response', async function(){
            let alexaResponse = await EventsHandler.asyncGetEventsNearUserLocation(-10, -81.7);
            assert.equal(alexaResponse, expectedEventsResponse);
        });
    });

});