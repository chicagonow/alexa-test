//libraries
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

//imports
const IntentController = require('../../controllers/IntentController');
const ParameterHelper = require("../../helpers/ParameterHelper");
const EventsHandler = require('../../handlers/events/EventsHandler');
const geocoder = require('../../handlers/location/geocoder');

// responses
const responseDeviceLocation = require('../data/response.deviceLocation');
const responseEvents = require('../data/events/response.events');
const responseEventsToday = require('../data/events/response.eventsToday');
const alexaJson = require('../data/transit/train/response.alexa.json');
const alexaRequestNearMe = require('../data/events/request.alexa.eventsNearMe.json');
const alexaRequestVenue = require('../data/events/request.alexa.eventsAtVenue');
const alexaRequestLandmark = require('../data/events/request.alexa.eventsAtLandmark');
const responseEventsWithGenreAndVenueAndTime = require('../data/events/request.alexa.eventsWithGenreAndVenueAndTime');

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

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();  
        
        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20});        
    });

    afterEach(function() {
        sandbox.restore();
        nock.cleanAll();
    });

    const stubbedLocationParameters = {
        apiEndpoint: alexaJson.context.System.apiEndpoint,
        token: alexaJson.context.System.apiAccessToken,
        deviceID: alexaJson.context.System.device.deviceId
    };

    describe("getEvents()", () => {
        it('calls getEventsWithUserLocation when there is no venue or landmark: return 3 events in string', async function () {

            sandbox.stub(ParameterHelper, "getLocationParameters")
                .returns(stubbedLocationParameters);

            let alexaResponse = await IntentController.getEvents(alexaRequestNearMe);
            assert.equal(alexaResponse, "Here are 3 events going on in Chicago. martin trivia night (free entry), 2018 kidfitstrong fitness challenge-chicago , redesigning the system: how artists, policymakers, and practitioners are shaping criminal justice reform");
        });

        const fakeVenueName = "A CHICAGO VENUE";
        const fakeLandmarkName = "A CHICAGO LANDMARK";
        it('calls asyncGetEventsAtVenue with venue name when there is a venue slot type', async function () {
            let venueEventsStub = sandbox.stub(EventsHandler, "asyncGetEventsAtVenue")
                .withArgs(fakeVenueName)
                .returns("fake event response for venue: " + fakeVenueName);

            let alexaResponse = await IntentController.getEvents(alexaRequestVenue);
            assert.equal(alexaResponse, "fake event response for venue: A CHICAGO VENUE");
        });

        it('calls asyncGetEventsAtVenue with landmark name when there is a landmark slot type', async function () {
            sandbox.stub(EventsHandler, "asyncGetEventsAtVenue")
                .withArgs(fakeLandmarkName)
                .returns("fake event response for landmark: " + fakeLandmarkName);

            let alexaResponse = await IntentController.getEvents(alexaRequestLandmark);
            assert.equal(alexaResponse, "fake event response for landmark: A CHICAGO LANDMARK");
        });
    });





    it('Test IntentController.getEventsWithinTimeFrame: return 3 events occuring today in string', async function() {
        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function (queryObject) {
                return queryObject["start_date.range_start"];
            })
            .reply(200, responseEventsToday);

        let apiEndpoint = stubbedLocationParameters.apiEndpoint;
        let apiAccessToken = stubbedLocationParameters.token;
        let funcDeviceId = stubbedLocationParameters.deviceID;
        let date = "2018-05-15";

        let expectedResponse = "Here are 3 events going on in Chicago. chicago professional  and  technology diversity career fair, 10th stem cell clonality and genome stability retreat, made to win rooftop social ";
        let alexaResponse = await IntentController.getEventsWithinTimeFrame(apiEndpoint, apiAccessToken, funcDeviceId, date);
        assert.equal(alexaResponse, expectedResponse);
    });
});