// import test stuff
const nock = require('nock');
const assert = require('assert');

// import test data
const responseRepoTrains = require('../../response.repo.trains.json');
const responseTrainStationObject = require('../../data/repository/response.TrainStations.json')

// import files we need to test
const TrainRepository = require('../../../repositories/transit/CtaTrainRepository');

/**
 * Verifies the CtaTrainRepository works properly
 */
describe('CtaTrainRepository Tests', function() {
    afterEach(function() {
        // Mock CTA Train Repository call 
        nock.cleanAll();  
    });

    // Tests the getAll method
    it('getAll: returns all of the train stop/station information', function(done) {
        nock('https://data.cityofchicago.org')
        .get('/resource/8mj8-j3c4.json')
        .query(true)
        .reply(200, responseRepoTrains);

        TrainRepository.getAll((trainInfo) => {
            assert.equal(trainInfo.length, 104);
            done();
        });
    });

    // Tests the getNearestTrainMapID method
    it('getNearestTrainMapID: returns the nearest mapID', function(done){
        nock('https://data.cityofchicago.org')
        .get('/resource/8mj8-j3c4.json')
        .query(true)
        .reply(200, responseRepoTrains);

        TrainRepository.getNearestTrainMapID(41.87893, -87.626088, (mapID) => {
            assert.equal(mapID, '40130');
            done();
        });
    });

    // Test the getTrainStationObject method
    it('getPossibleTrainStations: returns stations array', async function(){
        nock('https://data.cityofchicago.org')
        .get('/resource/8mj8-j3c4.json')
        .query((queryObject) => {
            return queryObject["$where"] !== undefined;
        })
        .reply(200, responseTrainStationObject);

        let trainStations = await TrainRepository.getPotentialTrainStations("18th");
        assert.equal(trainStations[0].map_id, '40830'); 
    });
});