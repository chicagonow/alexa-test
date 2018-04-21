const expect = require('chai').expect;
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const getEventsHandler = require('../handlers/events/EventsHandler');
const getEventsResponse = require('../handlers/events/EventsResponseBuilder').buildAlexaResponse;
const events = require('./data/events/response.events');
const ParameterHelper = require('../helpers/ParameterHelper');
const IntentController = require('../controllers/IntentController');

// Geocoder we need to mock
const geocoder = require('../handlers/location/geocoder');

const getTransitHandler = require('../handlers/transit/TransitHandler').searchTransit;
const getTransitBuilder = require('../handlers/transit/TransitResponseBuilder').buildAlexaResponse;
const responseTrains = require('./response.trains');
const alexaBusRequest20East = require('./alexaRequest20EastboundBus');
const alexaBusRequest49South = require('./alexaRequest49SouthboundBus');
const alexaBusRequest20stop4727 = require('./alexaRequest20atStop4727');
const alexaBusRequest49stop8245 = require('./alexaRequest49atStop8245');
const alexaJson = require('./response.alexa.json');
const responseDeviceLocation = require('./response.deviceLocation');

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

describe('Cta Bus Index.JS Test', function() {
    let sandbox;
    const BUS_ROUTE = "20";
    const BUS_STOP_ID = "4727";
    const DIRECTION = "Eastbound";

    const busHandler = require('../handlers/transit/bus/BusHandler');
    const busPred20Response = require('./response.getPredictions20');
    const busPred49Response = require('./response.getPredictions49');
    const busPred1Response = require('./response.getPredictions1');
    const busStops20Response = require('./response.getStops20');
    const busStops49Response = require('./response.getStops49');
    const ctaBusRepository = require("../repositories/transit/CtaBusRepository");
    const getPatterns20Response = require('../test/response.getPatterns20');
    const getPatterns49Response = require('../test/response.getPatterns49');
    const getPatterns1Response = require('../test/response.getPatterns1');

    beforeEach(function() {
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', stpid: '76', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', stpid: '14182', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', stpid: '8245', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', stpid: '4727', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', stpid: '449', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', stpid: '386', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query(function(queryObject){
                return (queryObject.key == 'mY73pz65XVB4Yc7GYAgqFrHQY' 
                    && queryObject.rt == '1'
                    && queryObject.format == 'json');
            })
            .reply(200, busPred1Response)

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', dir: 'Southbound', format: 'json'})
            .reply(200, busStops49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', dir: 'Eastbound', format: 'json'})
            .reply(200, busStops20Response);

        // Mock getpatterns
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpatterns')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '20', format: 'json'})
        .reply(200, getPatterns20Response);

        // Mock getpatterns
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpatterns')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '49', format: 'json'})
        .reply(200, getPatterns49Response);

        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getpatterns')
        .query({key: 'mY73pz65XVB4Yc7GYAgqFrHQY', rt: '1', format: 'json'})
        .reply(200, getPatterns1Response);

        // Mock device location API request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();  
        
        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20}); 
    });

    afterEach(function() {
        sandbox.restore();
        nock.cleanAll();
    });

    it('Test BusHandler asyncGetBusesForRouteAndStop', async function() {
        this.timeout(3000);

        let parameters = {
            rt: BUS_ROUTE,
            stpid: BUS_STOP_ID
        };

        let string = await busHandler.asyncGetBusesForRouteAndStop(parameters.rt, parameters.stpid)
        assert.equal(string, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM")
    });

    it('Test asyncGetBusesWithUserLocation', async function() {
        this.timeout(3000);
        let parameters = {
            rt: BUS_ROUTE,
            dir: 'Eastbound'
        };

        let stringResponse = await busHandler.asyncGetBusesWithUserLocation(parameters.rt, parameters.dir, 41.881383249235, -87.668550968956);
        assert.equal(stringResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM")
    });

    it('Test CTABusIntent 20 East', async function() {
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest20East.context.System);
        let route = alexaBusRequest20East.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = alexaBusRequest20East.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction);
        assert.equal(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM");
    })

    it('Test CTABusIntent 49 South', async function() {
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest49South.context.System);
        let route = alexaBusRequest49South.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = alexaBusRequest49South.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, route, direction);
        assert.equal(alexaResponse, "The Southbound 49 bus towards 79th will arrive at stop 8245 at 11:20 PM");
    })

    it('Test CTABusIntent No Service Error Response', async function(){
        
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest49South.context.System);
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, 1, "Southbound");
        assert.equal(alexaResponse, "There is no scheduled service for stop 70 on route 1");
    })

    it('Test GetBusesIntent Wrong Direction Error Response', async function(){
        
        let parameters = ParameterHelper.getLocationParameters(alexaBusRequest49South.context.System);
        let alexaResponse = await IntentController.getBusesWithUserLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, 1, "Eastbound");
        assert.equal(alexaResponse, "Bus 1 does not go Eastbound. Please ask again.");
    })

    it('Test CTABusStopIntent 20 East', async function() {
        let route = alexaBusRequest20stop4727.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = alexaBusRequest20stop4727.request.intent.slots.busStop.value;
        let alexaResponse = await IntentController.getBusesByStop(route, stopId);
        assert.equal(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM");
    })

    it('Test CTABusStopIntent 49 South', async function() {
        let route = alexaBusRequest49stop8245.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = alexaBusRequest49stop8245.request.intent.slots.busStop.value;
        let alexaResponse = await IntentController.getBusesByStop(route, stopId);
        assert.equal(alexaResponse, "The Southbound 49 bus towards 79th will arrive at stop 8245 at 11:20 PM");
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