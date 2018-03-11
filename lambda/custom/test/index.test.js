const expect = require('chai').expect;
const nock = require('nock');

const getEventsHandler = require('../handlers/events/EventsHandler');
const getEventsResponse = require('../handlers/events/EventsResponseBuilder').buildAlexaResponse;
const events = require('./response.events.js');

const getTransitHandler = require('../handlers/transit/TransitHandler').searchTransit;
const getTransitBuilder = require('../handlers/transit/TransitResponseBuilder').buildAlexaResponse;
const responseTrains = require('./response.trains');

describe('Get Events Handler', function() {
    beforeEach(function() {
        //require(getEventsResponse);
        // nock('https://www.eventbriteapi.com')
        //     .get('/v3/events/search/*')
        //     .reply(200, events);
    });
    it('returns Events Handler', function() {
        this.timeout(3000);

        // getEventsResponse(function(err, events) {
        //     //it should return an array of objects? maybe just an array of text TODO
        //     expect(String.isString(events)).to.equal(true);
        // });
        console.log(getEventsHandler.searchEvents());
        //console.log("IMPLEMENT MEE!!!!!");
    });
});

describe('Get Events Response', function() {
    beforeEach(function() {
        //require(getEventsResponse);
        // nock('https://www.eventbriteapi.com')
        //     .get('/v3/events/search/?location.within=1mi&location.latitude=41.878440&location.longitude=-87.625622&token=IO6EB7MM6TSCIL2TIOHC')
        //     .reply(200, events);
    });
    it('returns Events Response', function() {
        this.timeout(3000);

        // getEventsResponse(function(err, events) {
        //     //it should return an array of objects? maybe just an array of text TODO
        //     expect(String.isString(events)).to.equal(true);
        // });
        console.log(getEventsResponse(events));
    });
});

describe('Get Transit Handler', function() {
    beforeEach(function() {
        //require(getEventsResponse);
        // nock('https://www.eventbriteapi.com')
        //     .get('/v3/events/search/?location.within=1mi&location.latitude=41.878440&location.longitude=-87.625622&token=IO6EB7MM6TSCIL2TIOHC')
        //     .reply(200, events);
    });
    it('returns Transit Handler', function() {
        this.timeout(3000);

        // getEventsResponse(function(err, events) {
        //     //it should return an array of objects? maybe just an array of text TODO
        //     expect(String.isString(events)).to.equal(true);
        // });
        console.log(getTransitHandler(getTransitBuilder(responseTrains)));
    });
});

describe('Get Transit Response', function() {
    beforeEach(function() {
        //require(getEventsResponse);
        // nock('http://lapi.transitchicago.com')
        //     .get('/api/1.0/ttarrivals.aspx')
        //     .reply(200, responseTrains);
    });
    it('returns Transit Response', function() {
        this.timeout(3000);

        // getEventsResponse(function(err, events) {
        //     //it should return an array of objects? maybe just an array of text TODO
        //     expect(String.isString(events)).to.equal(true);
        // });
        console.log(getTransitBuilder(responseTrains));
    });
});