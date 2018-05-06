// import test stuff
const nock = require('nock');
const assert = require('assert');

// import test data
const responseRepoTrains = require('../../data/train/response.repo.trains.json');

// import files we need to test
const TrainRepository = require('../../../repositories/transit/CtaTrainRepository');

/**
 * Verifies the CtaTrainRepository works properly
 */
describe('CtaTrainRepository Tests', function() {
    beforeEach(function() {
        // Mock CTA Train Repository call
        nock('https://data.cityofchicago.org')
        .get('/resource/8mj8-j3c4.json')
        .query(true)
        .reply(200, responseRepoTrains);
    });

    // Tests the getAll method
    it('getAll: returns all of the train stop/station information', function(done) {
        TrainRepository.getAll((trainInfo) => {
            assert.equal(trainInfo.length, 104);
            done();
        });
    });

    // Tests the getNearestTrainMapID method
    it('getNearestTrainMapID: returns the nearest mapID', function(done){
        TrainRepository.getNearestTrainMapID(41.87893, -87.626088, (mapID) => {
            assert.equal(mapID, '40130');
            done();
        });
    });
});