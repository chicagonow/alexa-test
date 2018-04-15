const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const alexaJson = require('../../response.alexa.json');
const responseDeviceLocation = require('../../response.deviceLocation');
const responseEvents = require('../../response.events');
const responseEventsNearLocation = require('../../response.eventsNearLocation.json');


const EventsHandler = require('../../../handlers/events/EventsHandler');
const ParameterHelper = require('../../../helpers/ParameterHelper');

const geocoder = require('../../../handlers/location/geocoder');

describe('EventsHandler Tests', function () {
    let sandbox;

    beforeEach(function () {
        const EVENTBRITE_TOKEN = "IO6EB7MM6TSCIL2TIOHC";

        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);

        sandbox = sinon.sandbox.create();

        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query({
                    "token":EVENTBRITE_TOKEN,
                    "location.within":"1mi",
                    "location.latitude":"-10",
                    "location.longitude":"-81.7"
                    })
            .reply(200, responseEvents);

        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query({
                "token": EVENTBRITE_TOKEN,
                "location.within":"1mi",
                "location.latitude":"41.9",
                "location.longitude":"-87.7"
                })
            .reply(200, responseEventsNearLocation);
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


});