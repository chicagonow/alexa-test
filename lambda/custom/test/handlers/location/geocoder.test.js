// import test stuff
const nock = require('nock');
const assert = require('assert');

// import test data
const locationString = require('../../response.locationString');
const responseGeo = require('../../response.latlong');

// import files we need to test
const geoCoder = require('../../../handlers/location/geocoder');

/**
 * Verifies the CtaTrainHandler returns a proper alexa response with the user's location
 */
describe('geocoder tests', () => {
    beforeEach(() => {

        // Mock Device Location request
        // let deviceId = alexaJson.context.System.device.deviceId;
        // nock('https://api.amazonalexa.com')
        // .get('/v1/devices/' + deviceId + '/settings/address')        
        // .query(true)
        // .reply(200, responseDeviceLocation);

        // Mock Lat/Long location
        // TODO: MOCK GEOCODE

        // Mock CTA Train Repository call
        // nock('https://data.cityofchicago.org')
        // .get('/resource/8mj8-j3c4.json')
        // .query(true)
        // .reply(200, responseRepoTrains);

        // Mock CTA API call
        nock('https://www.mapquestapi.com')
        .get('/geocoding/v1/address?*')
        .query(true)
        .reply(200, responseGeo);
        
    });

    it('returns geocode lat long', function(done) {
        //let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
        geoCoder.getLatLong(locationString, (location) => {
            console.log(responseGeo);
            assert.deepEqual(responseGeo, {latitude: -10, longitude:-20});
            done();
        });
    });
});