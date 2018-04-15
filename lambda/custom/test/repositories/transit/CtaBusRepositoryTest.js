// import test stuff
const nock = require('nock');
const assert = require('assert');

// import test data
const getStopsResponse = require('../../../test/response.getStops49');
<<<<<<< HEAD
=======
const getPatterns20Response = require('../../../test/response.getPatterns20');
const getPatterns49Response = require('../../../test/response.getPatterns49');
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2

// import files we need to test
const BusRepository = require('../../../repositories/transit/CtaBusRepository');

/**
 * Verifies the CtaTrainRepository works properly
 */
describe('CtaBusRepository Tests', async function() {
    beforeEach(function() {

        nock.cleanAll();
<<<<<<< HEAD
        // Mock CTA Train Repository call
=======
        // Mock getStops call
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getstops')
        .query(true)
        .reply(200, getStopsResponse);
<<<<<<< HEAD
=======

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
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
    });

    // Tests the getAll method
    it('GetStopId With Location returns first stopId with closest lat/long', async function() {
        let stopId = await BusRepository.asyncGetStopIdWithLocation("4", "Northbound", 41.70927805926, -87.606026530276);
        assert.equal(stopId, 2970);
    });

    it('GetStopId With Location returns last stopId with closest lat/long', async function() {
        let stopId = await BusRepository.asyncGetStopIdWithLocation("4", "Northbound", 41.883178663638, -87.627803736836);
        assert.equal(stopId, 18154);
    });
<<<<<<< HEAD
=======

    it('GetActiveStopId With Location returns first stopId with closest lat/long', async function() {
        let stopId = await BusRepository.asyncGetStopIdWithLocation("4", "Northbound", 41.70927805926, -87.606026530276);
        assert.equal(stopId, 2970);
    });

    it('GetActiveStopId With Location returns last stopId with closest lat/long', async function() {
        let stopId = await BusRepository.asyncGetStopIdWithLocation("4", "Northbound", 41.883178663638, -87.627803736836);
        assert.equal(stopId, 18154);
    });
>>>>>>> fde15110a3deb50d229f65dc9e84b449f28df0b2
});