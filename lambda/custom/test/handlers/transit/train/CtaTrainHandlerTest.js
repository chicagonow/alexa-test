// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../data/transit/train/response.alexa.json');
const responseDeviceLocation = require('../../../data/response.deviceLocation');
const responseTrains = require('../../../data/transit/train/response.trains');
const responseRepoTrains = require('../../../data/transit/train/response.repo.trains.json');

// import files we need to test
const CtaTrainHandler = require('../../../../handlers/transit/train/CtaTrainHandler');
const ParameterHelper = require('../../../../helpers/ParameterHelper');

// Geocoder we need to mock
const geocoder = require('../../../../handlers/location/geocoder');

/**
 * Verifies the CtaTrainHandler works properly
 */
describe('CtaTrainHandler Tests', function() {
    // sinon test environment
    let sandbox;

    beforeEach(function() {
        // Mock Device Location request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
            .get('/v1/devices/' + deviceId + '/settings/address')
            .query(true)
            .reply(200, responseDeviceLocation);    

        // Mock CTA Train Repository call
        nock('https://data.cityofchicago.org')
            .get('/resource/8mj8-j3c4.json')
            .query(true)
            .reply(200, responseRepoTrains);

        // Mock CTA API call
        nock('http://lapi.transitchicago.com')
            .get('/api/1.0/ttarrivals.aspx')
            .query(function(queryObject) {
                return queryObject.stpid !== "fail"
            })
            .reply(200, responseTrains);

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();  
        
        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20}); 
    });

    afterEach(function() {
        sandbox.restore();
        nock.cleanAll();
    });

    describe("searchTrainNearMe", function () {
        it('returns correct Alexa Response', function (done) {
            // The next 2 lines are basically saying to call the 2nd argument of getLatLong, which is the
            // callback, with that location object instead of the location retrieved from the geocode library
            let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
            fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});

            let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
            CtaTrainHandler.searchTrainNearMe(parameters, (alexaResponse) => {
                assert.strictEqual(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
                done();
            });
        });

    });

    describe("searchTrain", function () {
        it('returns correct Alexa Response', function (done) {
            let parameters = {
                mapid: "40530",
                rt: "Brn"
            };

            CtaTrainHandler.searchTrain(parameters, (alexaResponse) => {
                assert.strictEqual(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
                done();
            });
        });
    });

    describe("asyncCallCta", function () {
        it('has default fail response ', async () => {
            
            nock('http://lapi.transitchicago.com')
                .get('/api/1.0/ttarrivals.aspx')
                .query(function(queryObject){
                    return queryObject.stpid == "fail";
                })
                .reply(500, null);

            let actualAlexaResponse = await CtaTrainHandler.asyncCallCta("fail");
            let expectedAlexaResponse = "There was an error with the CTA train service response.";
            assert.strictEqual(actualAlexaResponse, expectedAlexaResponse);
        });

        it('with correct query parameters returns correct Alexa Response', async () => {
            let ctaTrainParameters = {
                stpid: "30104"
            };

            let actualAlexaResponse = await CtaTrainHandler.asyncCallCta("30104");
            let expectedAlexaResponse = "The Diversey Brn Service toward Loop will arrive at 9:55 PM";
            assert.strictEqual(actualAlexaResponse, expectedAlexaResponse);
        });
    });
});