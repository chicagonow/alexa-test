const Alexa = require('alexa-sdk');
const request = require('request');

const APP_ID = 'amzn1.ask.skill.e0929fb0-ad82-43f5-b785-95eee4ddef38';

//static lat and long used
var latitude = '41.878440'; 
var longitude = '-87.625622';
//within 1 mile of location.
var within = '1mi';
//used sample token,replace later. 
var token = 'IO6EB7MM6TSCIL2TIOHC';

const handlers = {
    'CtaIntent': function () {
            request('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=541afb8f3df94db2a7afffc486ea4fbf&mapid=40530&rt=Brn',  (error, response, body) => {
                this.emit(':tell', 'Hello peepzzzzzz');
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
            });
    },
	'EventIntent' : function(){
		request('https://www.eventbriteapi.com/v3/events/search/?location.within=' + within + '&location.latitude=' + latitude + '&location.longitude='  + longitude + '&token=' + token,(error, response, body) =>
	{		
		var data = JSON.parse(body);
		var events = data.events;			
		
		//gets number of events
		var length = events.length;
		var msg = length + " events found nearby. ";
		var firstEvent = events[0];
		this.emit(':tell', msg + 'First event found,' + firstEvent.name.text + firstEvent.description.text);
		console.log('error:',error);
		console.log('statusCode:', response && response.statusCode);			
	});
	},
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'Unhandled': function () {
        this.emit(':tell', "You don goofed");
    }
};

exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

exports.requestTest = function (event, context) {
    console.log("hello");
    request('http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=541afb8f3df94db2a7afffc486ea4fbf&mapid=40530&rt=Brn', function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    });
}
	
exports.eventTest = function (event, context){
	
	console.log("Yo");
	request('https://www.eventbriteapi.com/v3/events/search/?location.within=' + within + '&location.latitude=' + latitude + '&location.longitude='  + longitude + '&token=' + token,(error, response, body) =>
	{		
		console.log('error:',error);
		console.log('statusCode:', response && response.statusCode);	
		//parse response into json object
		var data = JSON.parse(body);
		
		//gets properties for json object
		// var propNames = Object.getOwnPropertyNames(data)
		// propNames.forEach(function(prop){
			// console.log(prop);
		// });
		
		//gets all events returned, store in events variable
		var events = data.events;		
		
		//gets number of events
		var length = events.length;
		console.log(length + " events found nearby.");
		console.log("Showing all events found.\n");
		
		//loop through each event, print name of event.
		events.forEach(function(event)
		{
			console.log(event.name.text);
		});
		
	});
}

require('make-runnable');
