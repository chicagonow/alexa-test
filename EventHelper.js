const Alexa = require('alexa-sdk');
const request = require('request');
const buildUrl = require('build-url');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';
//used sample token,replace later. 
const AUTH_TOKEN = 'IO6EB7MM6TSCIL2TIOHC';
const EVENTBRITE_API_DOMAIN = 'https://www.eventbriteapi.com';
const EVENTBRITE_API_PATH = '/v3/events/search/';

const NUMBER_OF_EVENTS = 3;

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

	console.log("hello")
	request(url, (error, response, body) => {
		var msg = "Here are " + NUMBER_OF_EVENTS + " events going on in Chicago ";

		var data = JSON.parse(body);
		var events = data.events;

		//gets number of events
		var length = events.length;

		var firstEvent = events[0];
		var eventName = firstEvent.name.text;
		var eventArray = [];
		//var eventDescription = firstEvent.description.text;
		events.map((event, index) => {
			if (index < NUMBER_OF_EVENTS) {
				eventArray.push(event.name.text);
			}
		});
		msg += eventArray.join(", ");


		console.log(msg);
		callback && callback(msg,error,response);

	});
};

exports.listEvents = (events) => {

    console.log("Here are " + NUMBER_OF_EVENTS + " events going on in Chicago");
	for (i = 0; i < NUMBER_OF_EVENTS; i++) {
		var firstEvent = events[i];
		var eventName = firstEvent.name.text;
		console.log(eventName)
	}
};

require('make-runnable');