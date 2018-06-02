const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const ParameterHelper = require('../helpers/ParameterHelper');
const IntentController = require('../controllers/IntentController');

// Geocoder we need to mock
const geocoder = require('../handlers/location/geocoder');

const alexaBusRequest20East = require('./data/transit/bus/alexaRequest20EastboundBus');
const alexaBusRequest49South = require('./data/transit/bus/alexaRequest49SouthboundBus');
const alexaBusRequest20stop4727 = require('./data/transit/bus/alexaRequest20atStop4727');
const alexaBusRequest49stop8245 = require('./data/transit/bus/alexaRequest49atStop8245');
const alexaJson = require('./data/transit/train/response.alexa.json');
const responseDeviceLocation = require('./data/response.deviceLocation');

const BUS_ROUTE = "20";
const BUS_STOP_ID = "4727";

const busHandler = require('../handlers/transit/bus/BusHandler');
const busPred20Response = require('./data/transit/bus/response.getPredictions20');
const busPred49Response = require('./data/transit/bus/response.getPredictions49');
const busPred1Response = require('./data/transit/bus/response.getPredictions1');
const busStops20Response = require('./data/transit/bus/response.getStops20');
const busStops49Response = require('./data/transit/bus/response.getStops49');
const getPatterns20Response = require('./data/transit/bus/response.getPatterns20');
const getPatterns49Response = require('./data/transit/bus/response.getPatterns49');
const getPatterns1Response = require('./data/transit/bus/response.getPatterns1');
const CTABUS_API_KEY = 'test';

describe('Index.JS', function () {
    let sandbox;

    const stubbedLocationParameters = {
        apiEndpoint: alexaJson.context.System.apiEndpoint,
        token: alexaJson.context.System.apiAccessToken,
        deviceId: alexaJson.context.System.device.deviceId
    };

    beforeEach(function () {
        process.env.CTABUS_API_KEY = CTABUS_API_KEY;
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '49', stpid: '76', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '49', stpid: '14182', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '49', stpid: '8245', format: 'json'})
            .reply(200, busPred49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '20', stpid: '4727', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '20', stpid: '449', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query({key: CTABUS_API_KEY, rt: '20', stpid: '386', format: 'json'})
            .reply(200, busPred20Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpredictions')
            .query(function (queryObject) {
                return (queryObject.key == 'mY73pz65XVB4Yc7GYAgqFrHQY'
                    && queryObject.rt == '1'
                    && queryObject.format == 'json');
            })
            .reply(200, busPred1Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query({key: CTABUS_API_KEY, rt: '49', dir: 'Southbound', format: 'json'})
            .reply(200, busStops49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getstops')
            .query({key: CTABUS_API_KEY, rt: '20', dir: 'Eastbound', format: 'json'})
            .reply(200, busStops20Response);

        // Mock getpatterns
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpatterns')
            .query({key: CTABUS_API_KEY, rt: '20', format: 'json'})
            .reply(200, getPatterns20Response);

        // Mock getpatterns
        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpatterns')
            .query({key: CTABUS_API_KEY, rt: '49', format: 'json'})
            .reply(200, getPatterns49Response);

        nock('http://ctabustracker.com')
            .get('/bustime/api/v2/getpatterns')
            .query({key: CTABUS_API_KEY, rt: '1', format: 'json'})
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

    afterEach(function () {
        sandbox.restore();
        nock.cleanAll();
    });

    it('Test BusHandler asyncGetBusesForRouteAndStop', async function () {
        this.timeout(3000);

        let parameters = {
            rt: BUS_ROUTE,
            stpid: BUS_STOP_ID
        };

        let string = await busHandler.asyncGetBusesForRouteAndStop(parameters.rt, parameters.stpid)
        assert.strictEqual(string, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM")
    });

    it('Test asyncGetBusesWithUserLocation', async function () {
        this.timeout(3000);
        let parameters = {
            rt: BUS_ROUTE,
            dir: 'Eastbound'
        };

        let stringResponse = await busHandler.asyncGetBusesWithUserLocation(parameters.rt, parameters.dir, 41.881383249235, -87.668550968956);
        assert.strictEqual(stringResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM")
    });

    it('Test CTABusIntent 20 East', async function () {
        let event = alexaBusRequest20East;
        let route = event.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = event.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);

        let alexaResponse = await IntentController.getBusesWithUserLocation(event, route, direction);
        assert.strictEqual(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM");
    })

    it('Test CTABusIntent 49 South', async function () {
        let event = alexaBusRequest49South;
        let route = event.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let direction = event.request.intent.slots.busDirection.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);

        let alexaResponse = await IntentController.getBusesWithUserLocation(event, route, direction);
        assert.strictEqual(alexaResponse, "The Southbound 49 bus towards 79th will arrive at stop 8245 at 11:20 PM");
    })

    it('Test CTABusIntent No Service Error Response', async function () {
        let event = alexaBusRequest49South;

        sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);

        let alexaResponse = await IntentController.getBusesWithUserLocation(event, 1, "Southbound");
        assert.strictEqual(alexaResponse, "There is no scheduled service for stop 70 on route 1");
    })

    it('Test GetBusesIntent Wrong Direction Error Response', async function () {
        let event = alexaBusRequest49South;

        sandbox.stub(ParameterHelper, "getLocationParameters")
            .returns(stubbedLocationParameters);

        let alexaResponse = await IntentController.getBusesWithUserLocation(event, 1, "Eastbound");
        assert.strictEqual(alexaResponse, "Bus 1 does not go Eastbound. Please ask again.");
    });

    it('Test CTABusStopIntent 20 East', async function () {
        let route = alexaBusRequest20stop4727.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = alexaBusRequest20stop4727.request.intent.slots.busStop.value;
        let alexaResponse = await IntentController.getBusesByStop(route, stopId);
        assert.strictEqual(alexaResponse, "The Eastbound 20 bus towards Michigan will arrive at stop 4727 at 8:27 PM");
    })

    it('Test CTABusStopIntent 49 South', async function () {
        let route = alexaBusRequest49stop8245.request.intent.slots.bus.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let stopId = alexaBusRequest49stop8245.request.intent.slots.busStop.value;
        let alexaResponse = await IntentController.getBusesByStop(route, stopId);
        assert.strictEqual(alexaResponse, "The Southbound 49 bus towards 79th will arrive at stop 8245 at 11:20 PM");
    });
});