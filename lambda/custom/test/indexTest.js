const expect = require('chai').expect;
const nock = require('nock');
const assert = require('assert');

const getEventsHandler = require('../handlers/events/EventsHandler');
const getEventsResponse = require('../handlers/events/EventsResponseBuilder').buildAlexaResponse;
const events = require('./response.events.js');
const ParameterHelper = require('../helpers/ParameterHelper');
const IntentController = require('../controllers/IntentController');

const getTransitHandler = require('../handlers/transit/TransitHandler').searchTransit;
const getTransitBuilder = require('../handlers/transit/TransitResponseBuilder').buildAlexaResponse;
const responseTrains = require('./response.trains');
const alexaBusRequest20East = require('./alexaRequest20EastboundBus');
const alexaBusRequest49South = require('./alexaRequest49SouthboundBus');

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
        //console.log(getEventsHandler.searchEvents());
        console.log("IMPLEMENT MEE!!!!!");
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

describe('Cta Bus Handler', function() {

    const BUS_ROUTE = "20";
    const BUS_STOP_ID = "4727";
    const DIRECTION = "Eastbound";

    const busHandler = require('../handlers/transit/bus/BusHandler');
    const busResponse = require('./response.buses');
    const busStopsResponse = require('./response.repo.buses');
    const ctaBusRepository = require("../repositories/transit/CtaBusRepository");


    beforeEach(function() {

        // require(busHandler);
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query(true)
            .reply(200, busResponse);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query(true)
            .reply(200, busStopsResponse);
    });

    it('returns status of specific bus and stop', (done) => {
        this.timeout(3000);

        let parameters = {
            rt: BUS_ROUTE,
            stpid: BUS_STOP_ID
        };

        busHandler.getBusesForRouteAndStop(parameters, (alexaResponse) => {
            expect(alexaResponse).to.equal("The Eastbound 20 bus towards Michigan will arrive at 8:27 PM");
            done();
        });

    });

    it('return status of nearest bus stop', (done) => {
        this.timeout(3000);
        let parameters = {
            rt: BUS_ROUTE,
            stpid: BUS_STOP_ID
        };

        busHandler.searchBusNearMe(parameters, alexaResponse => {
            expect(alexaResponse).to.equal("The Eastbound 20 bus towards Michigan will arrive at 8:27 PM");
            done();
        });
    });

    it('calculates the closest bus stop id', done => {
        let closestStopId = ctaBusRepository.closestStopId(41.888045629769, -87.624405026432, busStopsResponse);
        expect(closestStopId).to.equal("1121");
        done();
    });

    it('test Alexa JSON 20 East input returns correct response', async function() {
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest20East.context.System);
        let route = alexaBusRequest20East.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = alexaBusRequest20East.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction);
        assert.equal(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at 8:27 PM");
    })

    it('test Alexa JSON 49 South input returns correct response', async function() {
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest49South.context.System);
        let route = alexaBusRequest49South.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = alexaBusRequest49South.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction);
        assert.equal(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at 8:27 PM");
    })

});

describe('Get Transit Handler', function() {
    beforeEach(function() {
        nock('http://lapi.transitchicago.com')
        .get('/api/1.0/ttarrivals.aspx')
        .query(true)
        .reply(200, responseTrains);
    });
    it('returns Transit Handler', function() {
        this.timeout(3000);

        // getEventsResponse(function(err, events) {
        //     //it should return an array of objects? maybe just an array of text TODO
        //     expect(String.isString(events)).to.equal(true);
        // });
        getTransitHandler({mapid: "123456", rt: ""}, (alexaResponse) => console.log(alexaResponse));
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