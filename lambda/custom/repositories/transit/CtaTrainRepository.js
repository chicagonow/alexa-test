const request = require('request');
const buildUrl = require('build-url');
const sprintf = require('sprintf-js').sprintf;
const asyncRequest = require('request-promise');

const API_ENDPOINT = "https://data.cityofchicago.org/resource/8mj8-j3c4.json";
const APP_TOKEN = "STK4neXxNDIblSih7NUAfFmg3";
const RADIUS = 500;

/**
 * Returns all of the train information
 * @param {function} callback 
 */
exports.getAll = (callback) => {

    let options = buildRequestOptions(API_ENDPOINT);

    request(options, (error, response, body) => {
        if (response.statusCode === 200) {
            callback(JSON.parse(body));
        }
    });
};

/**
 * Returns the nearest Train mapid
 * @param {number} latitude 
 * @param {number} longitude 
 * @param {function} callback 
 */
exports.getNearestTrainMapID = (latitude, longitude, callback) => {    
    let url = API_ENDPOINT + "?" + buildWithinCircleQuery(latitude, longitude);
    let options = buildRequestOptions(url);

    request(options, (error, response, body) => {
        if (response.statusCode === 200) {
            callback(JSON.parse(body)[0].map_id);
        }
    });
};

/**
 * Builds options object for HTTP Requests
 * @param {string} url 
 */
let buildRequestOptions = (url) => {
    return {
        url: url,
        headers: {
            "X-App-Token" : APP_TOKEN
        }
    };
};

/**
 * Inputs the proper variables into the search query
 * @param {number} latitude 
 * @param {number} longitude 
 */
let buildWithinCircleQuery = (latitude, longitude) => {
    let query = "$where=within_circle(location, %f, %f, %d)";
    return sprintf(query, latitude, longitude, RADIUS);
};

/**
 * Returns station object 
 */

 exports.getTrainStationObject = async function getTrainStationStatus(mapID, direction, color) {
    let url = buildUrl(API_ENDPOINT, {
        queryParams: {
            map_id: mapID,
            direction_id: direction
        }
    });

    url += '&' + color.toLowerCase() + '=true';

    let options = buildRequestOptions(url); 
    let stations = await asyncRequest(options);

    return JSON.parse(stations)[0];
 }