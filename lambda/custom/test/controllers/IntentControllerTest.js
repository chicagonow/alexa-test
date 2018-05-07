//libraries
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');
const AmazonDateParser = require('amazon-date-parser');

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
const requestGenreVenueTime = require('../data/events/request.genreEventsAtVenueThisWeekend.json');
const requestGenreVenue = require('../data/events/request.genreEventsAtVenue.json');
const alexaRequestVenue = require('../data/events/request.alexa.eventsAtVenue.json');
const alexaRequestVenueWithTime = require('../data/events/request.eventsAtVenueThisWeekend.json');
const alexaRequestLandmark = require('../data/events/request.alexa.eventsAtLandmark');
const responseEventsWithGenreAndVenueAndTime = require('../data/events/request.alexa.eventsWithGenreAndVenueAndTime');
const alexaRequestGenreEventsNearMe = require('../data/events/request.alexa.genreEventsNearMe.json');
const alexaRequestGenreEventsNearMeThisWeekend = require('../data/events/request.alexa.genreEventsNearMeThisWeekend.json');

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
        it('"events near me" calls getEvents() with location parameters only', async function () {

            sandbox.stub(ParameterHelper, "getLocationParameters")
                .returns(stubbedLocationParameters);

            sandbox.stub(EventsHandler, "asyncGetEvents")
                .withArgs("", "", "", "", -10, -20)
                .returns("logic correctly only parsed latitude and longitude");

            let alexaResponse = await IntentController.getEvents(alexaRequestNearMe);
            assert.equal(alexaResponse, "logic correctly only parsed latitude and longitude");
        });

        const fakeVenueName = "A CHICAGO VENUE";
        const fakeLandmarkName = "A CHICAGO LANDMARK";
        it('calls asyncGetEventsAtVenue with venue name when there is a venue slot type', async function () {
            let venueEventsStub = sandbox.stub(EventsHandler, "asyncGetEvents")
                .withArgs("", fakeVenueName, "", "", "", "")
                .returns("fake event response for venue: " + fakeVenueName);

            let alexaResponse = await IntentController.getEvents(alexaRequestVenue);
            assert.equal(alexaResponse, "fake event response for venue: A CHICAGO VENUE");
        });

        it('calls asyncGetEventsAtVenue with landmark name when there is a landmark slot type', async function () {
            sandbox.stub(EventsHandler, "asyncGetEvents")
                .withArgs("", fakeLandmarkName, "", "", "", "")
                .returns("fake event response for landmark: " + fakeLandmarkName);

            let alexaResponse = await IntentController.getEvents(alexaRequestLandmark);
            assert.equal(alexaResponse, "fake event response for landmark: A CHICAGO LANDMARK");
        });
        it('calls asyncGetEvents with genre, venue, and time', async function () {
            let parsedDate = new AmazonDateParser("2018-W19-WE");

             sandbox.stub(EventsHandler, "asyncGetEvents")
                 .withArgs("jazz", "house of blues", parsedDate.startDate, parsedDate.endDate, "", "")
                 .returns("logic successfully called for function with genre, venue, and time");
            
            let alexaResponse = await IntentController.getEvents(requestGenreVenueTime);
            assert.equal(alexaResponse, "logic successfully called for function with genre, venue, and time");
        });

        it('calls asyncGetEvents with genre and venue', async function () {
            sandbox.stub(EventsHandler, "asyncGetEvents")
                .withArgs("jazz", "house of blues", "", "", "", "")
                .returns("logic successfully called for function with genre, venue");

            let alexaResponse = await IntentController.getEvents(requestGenreVenue);
            assert.equal(alexaResponse, "logic successfully called for function with genre, venue");
        });
        it('calls asyncGetEvents with genre near me', async function () {
            
            sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);
            sandbox.stub(EventsHandler, "asyncGetEvents")
                 .withArgs("jazz", "", "", "", -10, -20)
                 .returns("logic successfully called for function with genre and location parameters");
            
            let alexaResponse = await IntentController.getEvents(alexaRequestGenreEventsNearMe);
            assert.equal(alexaResponse, "logic successfully called for function with genre and location parameters");
        });
        it('calls asyncGetEvents with genre near me this weekend', async function () {
            let parsedDate = new AmazonDateParser("2018-W19-WE");

            sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);
            sandbox.stub(EventsHandler, "asyncGetEvents")
                 .withArgs("jazz", "", parsedDate.startDate, parsedDate.endDate, -10, -20)
                 .returns("logic successfully called for function with with genre, location, and time.");
            
            let alexaResponse = await IntentController.getEvents(alexaRequestGenreEventsNearMeThisWeekend);
            assert.equal(alexaResponse, "logic successfully called for function with with genre, location, and time.");
        });

        it('calls asyncGetEvents with venue', async function () {

             sandbox.stub(EventsHandler, "asyncGetEvents")
                 .withArgs("", "A CHICAGO VENUE", "", "", "", "")
                 .returns("logic successfully called for function with venue");
            
            let alexaResponse = await IntentController.getEvents(alexaRequestVenue);
            assert.equal(alexaResponse, "logic successfully called for function with venue");
        });

        it('calls asyncGetEvents with venue and time', async function () {
            let parsedDate = new AmazonDateParser("2018-W19-WE");

            sandbox.stub(EventsHandler, "asyncGetEvents")
                .withArgs("", "house of blues", parsedDate.startDate, parsedDate.endDate, "", "")
                .returns("logic successfully called for function with venue and time");
           
           let alexaResponse = await IntentController.getEvents(alexaRequestVenueWithTime);
           assert.equal(alexaResponse, "logic successfully called for function with venue and time");
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