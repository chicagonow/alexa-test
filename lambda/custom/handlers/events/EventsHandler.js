const request = require('request');
const asyncRequest = require('request-promise');
const buildUrl = require('build-url');
const EventsResponseBuilder = require('./EventsResponseBuilder');
const LocationHandler = require('../location/LocationHandler');

//used sample token,replace later. 
const AUTH_TOKEN = 'IO6EB7MM6TSCIL2TIOHC';
const EVENTBRITE_API_DOMAIN = 'https://www.eventbriteapi.com';
const EVENTBRITE_API_PATH = '/v3/events/search/';

exports.searchEventsNearMe = (parameters, callback) => {

	LocationHandler.getLocation(parameters.apiEndpoint, parameters.token, parameters.deviceID, (location) => {
		searchEventbrite(location.latitude, location.longitude, callback);
	});
};

let searchEventbrite = (latitude, longitude, callback) => {
	let qp = getCommonQueryObjectParameters();
	qp[encodeURIComponent('location.within')] = '1mi';
	qp[encodeURIComponent('location.latitude')] = latitude;
	qp[encodeURIComponent('location.longitude')] = longitude;

	let url = buildUrl(EVENTBRITE_API_DOMAIN, {
		path: EVENTBRITE_API_PATH,
		queryParams: qp
	});

	request(url, (error, response, body) => {
		let alexaResponse = EventsResponseBuilder.buildAlexaResponse(JSON.parse(body));
		callback && callback(alexaResponse, error, response);
	});
};

//return Alexa response string
exports.asyncGetEventsNearUserLocation = async function asyncGetEventsNearUserLocation(latitude, longitude){
	let qp = getCommonQueryObjectParameters();
	qp[encodeURIComponent('location.within')] = '1mi';
	qp[encodeURIComponent('location.latitude')] = latitude;
	qp[encodeURIComponent('location.longitude')] = longitude;

	let url = buildUrl(EVENTBRITE_API_DOMAIN, {
		path: EVENTBRITE_API_PATH,
		queryParams: qp
	});

    let body = await asyncRequest(url)
        .catch(err => console.error(err));

    let alexaEventResponse = "";
    try {
        alexaEventResponse  = EventsResponseBuilder.buildAlexaResponse(JSON.parse(body));
    } catch (err) {
        console.error("event response body was: " + body);
        console.error(err);
        alexaEventResponse = "There was an error with the event service. Try again soon."
    }
	return alexaEventResponse;
};

/**
 * Returns an alexa response with events occurring within the given time frame
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
exports.asyncGetEventsWithinTimeFrame = async function asyncGetEventsWithinTimeFrame(latitude, longitude, startDate, endDate) {
	let qp = getCommonQueryObjectParameters();
	qp[encodeURIComponent('location.within')] = '1mi';
	qp[encodeURIComponent('location.latitude')] = latitude;
	qp[encodeURIComponent('location.longitude')] = longitude;
	qp[encodeURIComponent('start_date.range_start')] = startDate.toISOString().split('.')[0]+"Z" ;
	qp[encodeURIComponent('start_date.range_end')] = endDate.toISOString().split('.')[0]+"Z" ;

	let url = buildUrl(EVENTBRITE_API_DOMAIN, {
		path: EVENTBRITE_API_PATH,
		queryParams: qp
	});

    let body = await asyncRequest(url)
        .catch(err => console.error(err));

	let alexaEventResponse = "";	
	try {
        alexaEventResponse  = EventsResponseBuilder.buildAlexaResponse(JSON.parse(body));
    } catch (err) {
        console.error("event response body was: " + body);
        console.error(err);
        alexaEventResponse = "There was an error with the event service. Try again soon."
    }
	return alexaEventResponse;
}

// Returns common query parameters
let getCommonQueryObjectParameters = () => {
	let qp = {};
	qp[encodeURIComponent('token')] = AUTH_TOKEN;
	return qp;
};

require('make-runnable');