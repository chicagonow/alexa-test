const request = require('request');
const buildUrl = require('build-url');
const EventsResponseBuilder = require('./EventsResponseBuilder');

//used sample token,replace later. 
const AUTH_TOKEN = 'IO6EB7MM6TSCIL2TIOHC';
const EVENTBRITE_API_DOMAIN = 'https://www.eventbriteapi.com';
const EVENTBRITE_API_PATH = '/v3/events/search/';

exports.searchEvents = (callback) => {
	const qp = {};
	qp[encodeURIComponent('token')] = AUTH_TOKEN;
	qp[encodeURIComponent('location.within')] = '1mi';
	qp[encodeURIComponent('location.latitude')] = '41.878440';
	qp[encodeURIComponent('location.longitude')] = '-87.625622';

	let url = buildUrl(EVENTBRITE_API_DOMAIN, {
		path: EVENTBRITE_API_PATH,
		queryParams: qp
	});
	
	request(url, (error, response, body) => {		
        let alexaResponse = EventsResponseBuilder.buildAlexaResponse(JSON.parse(body));
		callback && callback(alexaResponse, error, response);		
	});
};

require('make-runnable');