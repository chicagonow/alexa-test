const Alexa = require('alexa-sdk');
const request = require('request');
const buildUrl = require('build-url');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';

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
		
		request(url,(error, response, body) =>
		{		
			var data = JSON.parse(body);
			var events = data.events;			
			
			//gets number of events
			var length = events.length;
			var msg = length + " events found nearby. ";
			var firstEvent = events[0];
			var eventName = firstEvent.name.text;
			var eventDescription = firstEvent.description.text;
			msg += 'First event found is ' + eventName;
			this.emit(':tell', msg);
			console.log('error:',error);
			console.log('statusCode:', response && response.statusCode);			
		});
}