const nock = require('nock');
const assert = require('assert');
const sinon = require('sinon');

const alexaJson = require('../../example-alexa-json.json');
const responseDeviceLocation = require('../../response.deviceLocation');
const responseEvents = require('../../response.events');


const EventsHandler = require('../../../handlers/events/EventsHandler');
const ParameterHelper = require('../../../helpers/ParameterHelper')

const geocoder = require('../../../handlers/location/geocoder');

describe('EventsHandler Tests', function() {
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
    it('searchEventsNearMe: returns correct Alexa Response', function(done) {
        let fakeGeocoder = sandbox.stub(geocoder, 'getLatLong');
        fakeGeocoder.callsArgWith(1, {latitude: -10, longitude: -81.7});

        let parameters = ParameterHelper.getLocationParameters(alexaJson.context.System);
        EventsHandler.searchEventsNearMe(parameters, (alexaResponse) => {
            assert.equal(alexaResponse, 'Here are 3 events going on in Chicago <break time="1s"/>Martin Trivia Night (FREE ENTRY), 2018 KIDFITSTRONG FITNESS CHALLENGE-CHICAGO , Redesigning the System: How Artists, Policymakers, and Practitioners are Shaping Criminal Justice Reform');
            done();
        });
    });
});