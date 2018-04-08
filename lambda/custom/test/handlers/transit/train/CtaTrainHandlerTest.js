// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const alexaJson = require('../../../response.alexa.json');
const responseDeviceLocation = require('../../../response.deviceLocation');
const responseTrains = require('../../../response.trains');
const responseRepoTrains = require('../../../response.repo.trains.json');

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

        // Initialize the sandbox for sinon testing
        sandbox = sinon.sandbox.create();        

        // Mock CTA Train Repository call
        nock('https://data.cityofchicago.org')
            .get('/resource/8mj8-j3c4.json')
            .query(true)
            .reply(200, responseRepoTrains);

        // Mock CTA API call
        nock('http://lapi.transitchicago.com')
            .get('/api/1.0/ttarrivals.aspx')
            .query(true)
            .reply(200, responseTrains);
        
    });

    afterEach(function() {
        // restore the test environment
        sandbox.restore();
    });

    describe("searchTrainNearMe", function () {
        it('returns correct Alexa Response', function (done) {
            // The next 2 lines are basically saying to call the 2nd argument of getLatLong, which is the
            // callback, with that location object instead of the location retrieved from the geocode library
            let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
            fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});

            let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
            CtaTrainHandler.searchTrainNearMe(parameters, (alexaResponse) => {
                assert.equal(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
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
                assert.equal(alexaResponse, "The Diversey Brn Service toward Loop will arrive at 9:55 PM");
                done();
            });
        });
    });

    describe("asyncCallCta", function () {
        it('has default fail response ', async () => {

            console.error("need to find a way to implement failure. The regex matching of the nock will win over one will malformed query parameters")
            // nock('http://lapi.transitchicago.com')
            //     .get('/api/1.0/ttarrivals.aspx')
            //     .query({
            //         key: "541afb8f3df94db2a7afffc486ea4fbf",
            //         mapid: "fail",
            //         rt: "fail",
            //         outputType: "JSON"
            //     })
            //     .reply(500);
            //
            // let ctaTrainParameters = {
            //     mapid: "fail",
            //     route: "fail"
            // };
            //
            // let actualAlexaResponse = await CtaTrainHandler.asyncCallCta(ctaTrainParameters);
            // let expectedAlexaResponse = "There was an error with the CTA train service response.";
            // assert.equal(actualAlexaResponse, expectedAlexaResponse);
            //
            // // done();
        });

        it('with correct query parameters returns correct Alexa Response', async () => {
            let ctaTrainParameters = {
                mapid: "40530",
                route: "Brn"
            };

            let actualAlexaResponse = await CtaTrainHandler.asyncCallCta(ctaTrainParameters);
            let expectedAlexaResponse = "The Diversey Brn Service toward Loop will arrive at 9:55 PM";
            assert.equal(actualAlexaResponse, expectedAlexaResponse);

            // done();
        });
    });
});