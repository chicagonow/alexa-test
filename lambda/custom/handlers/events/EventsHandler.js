const request = require('request');
const asyncRequest = require('request-promise');
const buildUrl = require('build-url');
const EventsResponseBuilder = require('./EventsResponseBuilder');
const LocationHandler = require('../location/LocationHandler');

//used sample token,replace later. 
const AUTH_TOKEN = 'IO6EB7MM6TSCIL2TIOHC';
const EVENTBRITE_API_DOMAIN = 'https://www.eventbriteapi.com';
const EVENTBRITE_API_PATH = '/v3/events/search/';

//return Alexa response string
exports.asyncGetEventsNearLocation = async function asyncGetEventsNearLocation(latitude, longitude){
	const qp = {};
	qp[encodeURIComponent('token')] = AUTH_TOKEN;
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
