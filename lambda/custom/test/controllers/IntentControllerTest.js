//libraries
const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

//imports
const IntentController = require('../../controllers/IntentController');
const responseDeviceLocation = require('../response.deviceLocation');
const responseEvents = require('../response.events');

//dummy files
const alexaJson = require('../response.alexa.json');


describe('IntentController Tests', function() {
    var sandbox;

    beforeEach(function() {

        let deviceId = alexaJson.context.System.device.deviceId;
        nock('https://api.amazonalexa.com')
        .get('/v1/devices/' + deviceId + '/settings/address')        
        .query(true)
        .reply(200, responseDeviceLocation);

        sandbox = sinon.sandbox.create();        

        nock('https://www.eventbriteapi.com')
        .get('/v3/events/search/')
        .query(true)
        .reply(200, responseEvents);
        
    });

    afterEach(function() {
        sandbox.restore();
    });

    // Tests the searchEventsNearMe method
    it('In: returns correct Alexa Response', async function(){

        let apiEndpoint = alexaJson.context.System.apiEndpoint;
        let apiAccessToken = alexaJson.context.System.apiAccessToken;
        let funcDeviceId = alexaJson.context.System.device.deviceId;

        let alexaResponse = await IntentController.getEventsWithUserLocation(apiEndpoint, apiAccessToken, funcDeviceId);
        assert.equal(alexaResponse, 'Here are 3 events going on in Chicago <break time="1s"/>Martin Trivia Night (FREE ENTRY), 2018 KIDFITSTRONG FITNESS CHALLENGE-CHICAGO , Redesigning the System: How Artists, Policymakers, and Practitioners are Shaping Criminal Justice Reform');
    });
});