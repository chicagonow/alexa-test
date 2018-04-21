const fs = require('fs');
const csv = require('csvtojson');
const _ = require('lodash');

const TrainRepo = require('../repositories/transit/CtaTrainRepository');

const alexaModel = require('../../../models/en-US.json');

/**
 * Updates the bus types in the alexa model
 * @param {string} csvFilePath 
 * @param {function} callback
 */
let populateBusModel = (csvFilePath, callback) => {    
    // get the slot types
    let newTypes = alexaModel.interactionModel.languageModel.types;

    // find the train station type
    let busTypeIndex = _.findIndex(newTypes, ["name", "CTA_BUS_STOP"]);

    // clear existing values
    newTypes[busTypeIndex].values = [];

    // read csv from the specified file path
    csv()
    .fromFile(csvFilePath)
    .on('json', busStop => {
        // Get the stop id without all of the decimal spots
        let stop = Math.trunc(busStop.SYSTEMSTOP).toString();

        let formattedStopName = formatName(busStop.STREET + " and " + busStop.CROSS_ST, false);

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
        newTypes[busTypeIndex].values.push(value);       
    })
    .on('done', err => {
        // Update the alexa model with the new bus stuff we just added
        alexaModel.interactionModel.languageModel.types = newTypes;

        // Finally, write to file
        writeToModel(JSON.stringify(alexaModel), callback);
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

    // clear existing values
    newTypes[trainTypeIndex].values = [];

    let newValues = [];

    // Get all of the train stations
    TrainRepo.getAll(trainStations => {

        // Only care about the unique train stations
        let uniqueStations = _.uniqBy(trainStations, 'map_id');

        // loop through each station 
        uniqueStations.forEach(station => {  
            // Format the name          
            let formattedStopName = formatName(station.stop_name, false);

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

            // Add the new station to the type array
            newTypes[trainTypeIndex].values.push(newTrainStationValue);
        });

        // Add the new type to the alexa model
        alexaModel.interactionModel.languageModel.types = newTypes;

        // Finally, write to file
        writeToModel(JSON.stringify(alexaModel));
    });
};

let writeToModel = (jsonString, callback) => {
    // Too scared to override the main model, so just spitting it out to a dummy file
    fs.writeFile('test.json', jsonString, fsError => {
        console.log("Saved model")
        fsError && console.log(fsError);

        // If there's another function to run then go ahead and run it
        callback && callback();
    });
};

/**
 * Formats the stop/station names
 * @param {*} stopName 
 * @param {*} hideParentheses 
 */
let formatName = (stopName, hideParentheses = true) => {
    let formattedStopName = stopName;

    if (hideParentheses) {
        // Some stations have () in them and we don't want those
        let pIndex = stopName.indexOf("(");
        // If it has (), get the substring. Otherwise get the whole thang
        formattedStopName = pIndex === -1 ? stopName : stopName.substring(0, pIndex - 1);
    }

    // Replace any / with english
    formattedStopName = formattedStopName.replace("/", " and ");

    // Remove any extra quotes
    formattedStopName = formattedStopName.replace(/\"/g, "");

    return formattedStopName;
};

exports.populateBusModel = populateBusModel;
exports.populateTrainModel = populateTrainModel;

exports.updateBusAndTrainModels = (csvFilePath) => {
    populateBusModel(csvFilePath, populateTrainModel);
};

require('make-runnable');