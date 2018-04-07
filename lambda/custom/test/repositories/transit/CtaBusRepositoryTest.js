// import test stuff
const nock = require('nock');
const assert = require('assert');

// import test data
const getStopsResponse = require('../../../test/response.getStops49');

// import files we need to test
const BusRepository = require('../../../repositories/transit/CtaBusRepository');

/**
 * Verifies the CtaTrainRepository works properly
 */
describe('CtaBusRepository Tests', async function() {
    beforeEach(function() {

        nock.cleanAll();
        // Mock CTA Train Repository call
        nock('http://ctabustracker.com')
        .get('/bustime/api/v2/getstops')
        .query(true)
        .reply(200, getStopsResponse);
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
});