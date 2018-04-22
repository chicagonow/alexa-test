const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const EventsHandler = require('../../../handlers/events/EventsHandler');
const ParameterHelper = require('../../../helpers/ParameterHelper');
const geocoder = require('../../../handlers/location/geocoder');

//responses
const alexaJson = require('../../response.alexa.json');
const responseDeviceLocation = require('../../response.deviceLocation');
const responseEvents = require('../../data/events/response.events');
const responseEventsNearLocation = require('../../response.eventsNearLocation.json');
const responseToday = require('../../data/events/response.eventsToday');

describe('EventsHandler Tests', function () {
    let sandbox;

    beforeEach(function () {
        const EVENTBRITE_TOKEN = "IO6EB7MM6TSCIL2TIOHC";

        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);

        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query({
                "token": EVENTBRITE_TOKEN,
                "location.within": "1mi",
                "location.latitude": "-10",
                "location.longitude": "-81.7"
            })
            .reply(200, responseEvents);

        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query({
                "token": EVENTBRITE_TOKEN,
                "location.within": "1mi",
                "location.latitude": "41.9",
                "location.longitude": "-87.7"
            })
            .reply(200, responseEventsNearLocation);

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();

        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20});
    });

    afterEach(function () {
        sandbox.restore();
        nock.cleanAll();
    });

    describe("getEventsNearLocation", () => {
        const expectedEventsNearMeResponse = "Here are 3 events going on in Chicago. martin trivia night (free entry), 2018 kidfitstrong fitness challenge-chicago , redesigning the system: how artists, policymakers, and practitioners are shaping criminal justice reform";
        // Tests the searchEventsNearMe method
        it("returns events near the user's current location", async function () {
            let alexaResponse = await EventsHandler.asyncGetEventsNearLocation(-10, -81.7);
            assert.equal(alexaResponse, expectedEventsNearMeResponse);
        });

        const expectedEventsNearLocation = "Here are 3 events going on in Chicago. 2018 kidfitstrong fitness challenge chicago , girls night out social + happy hour at latinicity , chiteen lit fest: april 13-14, 2018";
        it("returns events near the address specified by user", async function () {
            let alexaResponse = await EventsHandler.asyncGetEventsNearLocation(41.9, -87.7);
            assert.equal(alexaResponse, expectedEventsNearLocation);
        })
    });

    // Tests the searchEventsWithinTimeFrame method
    describe("searchEventsWithinTimeFrame", () => {

        beforeEach(function() {
            nock.cleanAll();

            // Mock response for events between a certain time range
            nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function(queryObject) {
                return queryObject["start_date.range_start"];
            })
            .reply(200, responseToday);
        });

        afterEach(function() {
            sandbox.restore();
            nock.cleanAll();
        });

        it('returns events for today', async function() {
            let expectedResponse = "Here are 3 events going on in Chicago. chicago professional  and  technology diversity career fair, 10th stem cell clonality and genome stability retreat, made to win rooftop social ";
            let startDate = new Date("2018-05-15T00:00:00"); // replace with start date
            let endDate = new Date("2018-05-15T23:59:59"); // replace with end date
            let alexaResponse = await EventsHandler.asyncGetEventsWithinTimeFrame(41.87893, -87.626088, startDate, endDate);
            assert.equal(alexaResponse, expectedResponse);
        });
    });

});