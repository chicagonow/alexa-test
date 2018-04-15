const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const alexaJson = require('../../response.alexa.json');
const responseDeviceLocation = require('../../response.deviceLocation');
const responseEvents = require('../../response.events');

// Time response
const responseToday = require('../../response.eventsTime');


const EventsHandler = require('../../../handlers/events/EventsHandler');
const ParameterHelper = require('../../../helpers/ParameterHelper');

const geocoder = require('../../../handlers/location/geocoder');

describe('EventsHandler Tests', function() {
    let sandbox;

    beforeEach(function() {
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);

        sandbox = sinon.sandbox.create();       

        nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function(queryObject) {
                return !queryObject.start_date;
            })
            .reply(200, responseEvents);        
        
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

    // Tests the searchEventsWithinTimeFrame method
    describe("searchEventsWithinTimeFrame", () => {

        beforeEach(function() {
            nock.cleanAll();
            
            // Mock response for events between a certain time range
            nock('https://www.eventbriteapi.com')
            .get('/v3/events/search/')
            .query(function(queryObject) {
                return queryObject["start_date.range_start"] === "2018-05-15T05:00:00Z"
                    && queryObject["start_date.range_end"] === "2018-05-16T04:00:00Z";
            })
            .reply(200, responseToday);
        });

        it('returns events for today', async function() {
            let expectedResponse = "Here are 3 events going on in Chicago. chicago professional  and  technology diversity career fair, 10th stem cell clonality and genome stability retreat, made to win rooftop social ";
            let startDate = new Date("2018-05-15T00:00:00"); // replace with start date
            let endDate = new Date("2018-05-15T23:00:00"); // replace with end date
            let alexaResponse = await EventsHandler.asyncGetEventsWithinTimeFrame(41.87893, -87.626088, startDate, endDate);
            assert.equal(alexaResponse, expectedResponse);
        });
    });

});