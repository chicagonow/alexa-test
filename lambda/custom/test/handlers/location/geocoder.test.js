// import test stuff
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

// import test data
const locationString = require('../../response.locationString');
const responseGeo = require('../../response.latlong');

// import files we need to test
const geocoder = require('../../../handlers/location/geocoder');

/**
 * Verifies the CtaTrainHandler returns a proper alexa response with the user's location
 */
describe('geocoder tests', () => {
    beforeEach(() => {

        // nock('https://www.mapquestapi.com')
        // .get('/geocoding/v1/address?*')
        // .query(true)
        // .reply(200, responseGeo);
        
        sandbox = sinon.sandbox.create();

    });

    afterEach(function() {
        sandbox.restore();
    })

    it('returns geocode lat long', function(done) {
        let mockGeoCoder = sandbox.stub(geocoder, 'geocode');
        mockGeoCoder.callsArgWith(1, locationString);
        
        geoCoder.geocode(locationString, (location) => {
            assert.deepEqual(responseGeo, {latitude: -10, longitude:-20});
            done();
        });
    });
});