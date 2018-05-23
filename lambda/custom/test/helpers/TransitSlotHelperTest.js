const assert = require('assert');
const TransitSlotHelper = require('../../helpers/TransitSlotHelper');

// Bus requests
const validBusRequest = require('../data/helpers/validBusRequest.json');
const invalidBusRequest = require('../data/helpers/invalidBusRequest.json');
const invalidBusAndBusStopRequest = require('../data/helpers/invalidBusAndBusStopRequest.json');

// Train requests
const validTrainRequest = require('../data/helpers/validTrainRequest.json');
const invalidTrainStationRequest = require('../data/helpers/invalidTrainStationRequest.json');
const invalidAllSlotsTrainRequest = require('../data/helpers/invalidAllSlotsTrainRequest.json');

describe("TransitSlotHelper Tests", function() {

    describe("Bus tests", function() {
         // Case when all slot values get a successful match
        it("returns no error message", function() {
            let slotsToCheck = ["bus", "busStop"];
            let slotObject = validBusRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck);
            assert.strictEqual(errorResponse, "");
        });

        // Case when only 1 slot value gets a successful match
        it("returns error message for bus", function() {
            let slotsToCheck = ["bus", "busStop"];
            let slotObject = invalidBusRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck);
            assert.strictEqual(errorResponse, "Could not find the match for bus 2000 when searching buses");
        });

        // Case when both slot values are messed up
        it("returns error message for bus and busStop", function() {
            let slotsToCheck = ["bus", "busStop"];
            let slotObject = invalidBusAndBusStopRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck);
            assert.strictEqual(errorResponse, "Could not find the match for bus 2000 and bus Stop 1337 when searching buses");
        });
    });

    describe("Train tests", function() {
        // Case when all slots match or skipped
        it("returns no error message", function() {
            let slotsToCheck = ["trainDirection", "trainStation", "train"];
            let slotObject = validTrainRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck, true);
            assert.strictEqual(errorResponse, "")
        });

        // Case when 1 slot doesn't match
        it("returns the slot that does not match", function() {
            let slotsToCheck = ["trainDirection", "trainStation", "train"];
            let slotObject = invalidTrainStationRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck, true);
            assert.strictEqual(errorResponse, "Could not find the match for train Station asdfasddfs diversey station when searching trains");
        });

        // Case when all slots don't match
        it("returns error message for trainDirection, trainStation, and train", function() {
            let slotsToCheck = ["trainDirection", "trainStation", "train"];
            let slotObject = invalidAllSlotsTrainRequest.request.intent.slots;
            let errorResponse = TransitSlotHelper.getSlotErrorResponse(slotObject, slotsToCheck, true);
            assert.strictEqual(errorResponse, "Could not find the match for train Direction weast, train Station asdfasddfs diversey station, and train fusia when searching trains");
        });
    }); 
});