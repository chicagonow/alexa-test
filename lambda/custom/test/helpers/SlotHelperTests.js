const assert = require('assert');
const SlotHelper = require('../../helpers/SlotHelper');

// Successful slots
const validBusRequest = require('../data/helpers/validBusRequest.json');

// ER_SUCCESS_NO_MATCH
const noMatchTrainRequst = require('../data/helpers/noMatchTrainRequest.json');

// No Value
const noValueTrainRequest = require('../data/helpers/noValueTrainRequest.json');

// ER_SUCCESS_NO_MATCH and no value
const noMatchOrValueTrainRequest = require('../data/helpers/noMatchOrValueTrainRequest.json');

describe("SlotHelper Tests", function() {

    // Case when all slot values get a successful match
    it("returns no failed slot values", function() {
        let slotsToCheck = ["bus", "busStop"];
        let slotObject = validBusRequest.request.intent.slots;
        let invalidSlots = SlotHelper.checkSlots(slotObject, slotsToCheck);
        assert.strictEqual(invalidSlots.length, 0);
    });

    // Check for ER_SUCCESS_NO_MATCH
    it("returns the slot that does not match", function() {
        let slotsToCheck = ["trainDirection", "trainStation", "train"];
        let slotObject = noMatchTrainRequst.request.intent.slots;
        let invalidSlots = SlotHelper.checkSlots(slotObject, slotsToCheck);
        assert.strictEqual(invalidSlots.length, 1);
    });

    // Check for no value
    it("returns the slot that have no value", function() {
        let slotsToCheck = ["trainDirection", "trainStation", "train"];
        let slotObject = noValueTrainRequest.request.intent.slots;
        let invalidSlots = SlotHelper.checkSlots(slotObject, slotsToCheck);
        assert.strictEqual(invalidSlots.length, 1);
    });

    // Check for combination of ER_SUCCESS_NO_MATCH and no value
    it("returns the slots with either no value or ER_SUCCESS_NO_MATCH", function() {
        let slotsToCheck = ["trainDirection", "trainStation", "train"];
        let slotObject = noMatchOrValueTrainRequest.request.intent.slots;
        let invalidSlots = SlotHelper.checkSlots(slotObject, slotsToCheck);
        assert.strictEqual(invalidSlots.length, 3);
    });
});