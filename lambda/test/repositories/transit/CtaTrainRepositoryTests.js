const TrainRepository = require('../../../custom/repositories/transit/CtaTrainRepository');

let getAllTest = () => {
    TrainRepository.getAll((trainInfo) => {
        console.log(trainInfo[0]);
    })
};

let getMapIdTest = () => {
    TrainRepository.getNearestTrainMapID(41.87893, -87.626088, (mapID) => {
        console.log(mapID);
    });
};

exports.all = () => {
    getAllTest();
    getMapIdTest();
};

require('make-runnable');