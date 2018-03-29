//testing requirements
const nock = require('nock');
const sinon = require('sinon');
const assert = require('assert');

//dummy files
const alexaJson = require('../../response.alexa.json');
const responseDeviceLocation = require('../../response.deviceLocation');

//function under test
const locationHandler = require("../../../handlers/location/LocationHandler");
const geocoder = require('../../../handlers/location/geocoder');

describe('LocationHandler tests', () => {
    beforeEach(() => {

        // Mock Device Location request
        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        // Mock Lat/Long location
        sandbox = sinon.sandbox.create();
        
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('Tests that locationHandler returns lat long', function(done) {
        let mockGeoCoder = sandbox.stub(geocoder, 'getLatLong');
        mockGeoCoder.callsArgWith(1, {latitude: -10, longitude: -20});

        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;
        locationHandler.getLocation(apiEndpoint, apiAccessToken, funcDeviceId, (alexaResponse) => {
            
            assert.deepEqual(alexaResponse,{ latitude: -10, longitude: -20 });
            done();
        });
    });

    it('Tests that asyncGetLocation returns lat long', async function(){
        let mockGeoCoder = sandbox.stub(geocoder, 'asyncGetLatLong')
            .returns({latitude: -10, longitude: -20});

        
        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;

        let locationObj = await locationHandler.asyncGetLocation(apiEndpoint, apiAccessToken, funcDeviceId);
        assert.deepEqual(locationObj,{ latitude: -10, longitude: -20});
    })
});

