
const asyncRequest = require('request-promise');
const buildUrl = require('build-url');
const EventsResponseBuilder = require('./EventsResponseBuilder');
const moment = require('moment-timezone');
const logger = require("../../logging/Logger");

//used sample token,replace later. 
const AUTH_TOKEN = 'IO6EB7MM6TSCIL2TIOHC';
const EVENTBRITE_API_DOMAIN = 'https://www.eventbriteapi.com';
const EVENTBRITE_EVENTS_SEARCH_PATH = '/v3/events/search/';

const DEFAULT_RADIUS = '1mi';

//return Alexa response string
exports.asyncGetEventsNearLocation = async (latitude, longitude) => {
    let eventsNearLocationParameters = getCommonQueryObjectParameters();
    eventsNearLocationParameters[encodeURIComponent('location.within')] = DEFAULT_RADIUS;
	eventsNearLocationParameters[encodeURIComponent('location.latitude')] = latitude;
	eventsNearLocationParameters[encodeURIComponent('location.longitude')] = longitude;

    let eventsNearLocationResponse = await getAlexaResponseForEvents(EVENTBRITE_API_DOMAIN, EVENTBRITE_EVENTS_SEARCH_PATH, eventsNearLocationParameters);
    return eventsNearLocationResponse;
};

/**
 * Returns an alexa response with events occurring within the given time frame
 * @param {Date} latitude
 * @param {Date} longitude
 * @param {Date} startDate
 * @param {Date} endDate
 */
exports.asyncGetEventsWithinTimeFrame = async (latitude, longitude, startDate, endDate) => {
    let eventsAtTimeParameters = getCommonQueryObjectParameters();
    eventsAtTimeParameters[encodeURIComponent('location.within')] = DEFAULT_RADIUS;
    eventsAtTimeParameters[encodeURIComponent('location.latitude')] = latitude;
    eventsAtTimeParameters[encodeURIComponent('location.longitude')] = longitude;
    eventsAtTimeParameters[encodeURIComponent('start_date.range_start')] = getLocalDateString(startDate);
    eventsAtTimeParameters[encodeURIComponent('start_date.range_end')] = getLocalDateString(endDate);

    let eventsAtTimeResponse = await getAlexaResponseForEvents(EVENTBRITE_API_DOMAIN, EVENTBRITE_EVENTS_SEARCH_PATH, eventsAtTimeParameters);
    return eventsAtTimeResponse;
};

// Returns common query parameters
let getCommonQueryObjectParameters = () => {
	let qp = {};
	qp[encodeURIComponent('token')] = AUTH_TOKEN;
	return qp;
};

// Returns the local date as a string
let getLocalDateString = (date) => {
	let dateString = date.toISOString().split('.')[0]+"Z";
	return moment.tz(dateString, "America/Chicago").format("YYYY-MM-DDTHH:mm:ss");
};

exports.asyncGetEventsAtVenue = async (venueName) => {
    let venueEventsQueryParameters = getCommonQueryObjectParameters();
    venueEventsQueryParameters["q"] = encodeURIComponent(venueName + " chicago");

    let eventsAtVenueResponse = await getAlexaResponseForEvents(EVENTBRITE_API_DOMAIN, EVENTBRITE_EVENTS_SEARCH_PATH, venueEventsQueryParameters);
    return eventsAtVenueResponse;
};

exports.asyncGetEvents = async (eventGenre, eventLocation, startDate, endDate, latitude, longitude) => {
    let queryParameters = getCommonQueryObjectParameters();
    if ((eventGenre + eventLocation).trim() !== ""){
        queryParameters["q"] = eventGenre + " " + eventLocation;
    }

    if (latitude && longitude){
        queryParameters[encodeURIComponent('location.within')] = DEFAULT_RADIUS;
        queryParameters[encodeURIComponent('location.latitude')] = latitude;
        queryParameters[encodeURIComponent('location.longitude')] = longitude;
    }

    if (startDate) {queryParameters[encodeURIComponent('start_date.range_start')] = getLocalDateString(startDate);}
    if (endDate) {queryParameters[encodeURIComponent('start_date.range_end')] = getLocalDateString(endDate);}

    let eventResponse = await getAlexaResponseForEvents(EVENTBRITE_API_DOMAIN, EVENTBRITE_EVENTS_SEARCH_PATH, queryParameters);
    return eventResponse;
};


let getAlexaResponseForEvents = async (eventbriteDomain, eventbritePath, queryParameters) => {
    
    let eventbriteUrl = buildUrl(eventbriteDomain, {
        path: eventbritePath,
        queryParams: queryParameters
    });

    let body = await asyncRequest(eventbriteUrl)
        .catch(error => logger.error("error with event request: " + error));

    let alexaEventResponse = "";
    try {
        alexaEventResponse = EventsResponseBuilder.buildAlexaResponse(JSON.parse(body));
    } catch (err) {
        logger.error("event response body was: " + body);
        logger.error(err);
        alexaEventResponse = "There was an error with the event service. Try again soon."
    }
    return alexaEventResponse;
};