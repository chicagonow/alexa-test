//testing requirements
const nock = require('nock');
const sinon = require('sinon');
const assert = require('assert');

//dummy files
const alexaJson = require('../../data/transit/train/response.alexa.json');
const responseDeviceLocation = require('../../data/response.deviceLocation');

//function under test
const locationHandler = require("../../../handlers/location/LocationHandler");
const geocoder = require('../../../handlers/location/geocoder');

describe('LocationHandler tests', () => {
    let sandbox;

    beforeEach(() => {

        // Mock Device Location request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        // Mock Lat/Long location
        sandbox = sinon.sandbox.create();

        // Mock the geocoder call
        sandbox.stub(geocoder, 'asyncGetLatLong').returns({latitude: -10, longitude: -20});         
    });

    afterEach(function() {
        sandbox.restore();
        nock.cleanAll();
    });

    it('Tests that locationHandler returns lat long', function(done) {
        let mockGeoCoder = sandbox.stub(geocoder, 'getLatLong');
        mockGeoCoder.callsArgWith(1, {latitude: -10, longitude: -20});

        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;
        locationHandler.getLocation(apiEndpoint, apiAccessToken, funcDeviceId, (alexaResponse) => {

            assert.deepStrictEqual(alexaResponse,{ latitude: -10, longitude: -20 });
            done();
        });
    });

    it('Tests that asyncGetLocation returns lat long', async function(){
        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;

        let locationObj = await locationHandler.asyncGetLocation(apiEndpoint, apiAccessToken, funcDeviceId);
        assert.deepStrictEqual(locationObj,{ latitude: -10, longitude: -20, isDefault:undefined});
    })
});

