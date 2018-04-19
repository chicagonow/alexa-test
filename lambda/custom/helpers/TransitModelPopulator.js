const fs = require('fs');
const csv = require('csvtojson');
const _ = require('lodash');

const TrainRepo = require('../repositories/transit/CtaTrainRepository');

const alexaModel = require('../../../models/en-US.json');

/**
 * Updates the bus types in the alexa model
 * @param {string} csvFilePath 
 */
let populateBusModel = (csvFilePath) => {    
    // get the slot types
    let types = alexaModel.interactionModel.languageModel.types;
    
    // build new type object to add buses
    let newType = {
        name: "CTA_BUS_STOP",
        values: []
    };

    // read csv from the specified file path
    csv()
    .fromFile(csvFilePath)
    .on('json', busStop => {
        // Get the stop id without all of the decimal spots
        let stop = Math.trunc(busStop.SYSTEMSTOP).toString();

        let formattedStopName = formatName(busStop.STREET + " and " + busStop.CROSS_ST);

        // create new object to import
        let value = {
            name: {
                value: stop,
                synonyms: [
                    formattedStopName,
                    stop
                ]
            }
        }; 

        // add object to the type array
        newType.values.push(value);       
    })
    .on('done', err => {
        // Update the alexa model with the new bus stuff we just added
        alexaModel.interactionModel.languageModel.types.push(newType);

        // Finally, write to file
        writeToModel(JSON.stringify(alexaModel));
    });
};

/**
 * Updates the Train station types in the alexa model
 */
let populateTrainModel = () => {
    // get the slot types
    let newTypes = alexaModel.interactionModel.languageModel.types;

    // find the train station type
    let trainTypeIndex = _.findIndex(newTypes, ["name", "CTA_TRAIN_STATION"]);

    let newValues = [];

    // Get all of the train stations
    TrainRepo.getAll(trainStations => {

        // Only care about the unique train stations
        let uniqueStations = _.uniqBy(trainStations, 'map_id');

        // loop through each station 
        uniqueStations.forEach(station => {  
            // Format the name          
            let formattedStopName = formatName(station.stop_name);

            // Create a new station model value
            let newTrainStationValue = {
                id: station.map_id,
                name: {
                    value: formattedStopName,
                    synonyms: [
                        formattedStopName + " station"
                    ]
                }
            };

            // Add the new station to the array
            newValues.push(newTrainStationValue);
        });

        // Add the new stations to the type
        newTypes[trainTypeIndex].values.push(newValues);

        // Add the new type to the alexa model
        alexaModel.interactionModel.languageModel.types = newTypes;

        // Finally, write to file
        writeToModel(JSON.stringify(alexaModel));
    });
};

let writeToModel = (jsonString) => {
    // Too scared to override the main model, so just spitting it out to a dummy file
    fs.writeFile('test.json', jsonString, fsError => {
        console.log("Saved model")
        fsError && console.log(fsError);
    });
};

let formatName = (stopName) => {
    // Some stations have () in them and we don't want those
    let pIndex = stopName.indexOf("(");

    // If it has (), get the substring. Otherwise get the whole thang
    let formattedStopName = pIndex === -1 ? stopName : stopName.substring(0, pIndex - 1);

    // If it has a /, replace it with english
    formattedStopName = formattedStopName.replace("/", " and ");

    return formattedStopName;
};

exports.populateBusModel = populateBusModel;
exports.populateTrainModel = populateTrainModel;

exports.updateBusAndTrainModels = (csvFilePath) => {
    populateBusModel(csvFilePath);
    populateTrainModel();
};

require('make-runnable');