
/**
 * Returns an error message with any invalid slots
 * @param {object} slotObject 
 * @param {array} slotNamesToCheck 
 * @param {boolean} isTrain
 */
exports.getSlotErrorResponse = (slotObject, slotNamesToCheck, isTrain = false) => {
    let errorResponse = "";
    let invalidSlots = [];

    // Loop through the slot names to check
    slotNamesToCheck.map(slot => {
        // get the slot we're looking for from the request slots object
        let userSlot = slotObject[slot];

        // double check to make sure those resolution properties are there
        if (userSlot && userSlot.resolutions && userSlot.resolutions.resolutionsPerAuthority) {
            let resolution = userSlot.resolutions.resolutionsPerAuthority[0];

            if (resolution.status.code === "ER_SUCCESS_NO_MATCH") {
                // Format the slot name to english, ex: busStop => bus Stop
                let formattedSlotName = userSlot.name.replace(/([A-Z])/g, ' $1');
                invalidSlots.push(formattedSlotName + " " + userSlot.value);
            }
        }
    });

    // If there are any invalid slots, spit them out with the proper transit type
    if (invalidSlots.length) {
        // Trying to english
        let delimiter = invalidSlots.length >= 3 ? ", " : " and ";
        errorResponse = "Could not find the match for " + invalidSlots.join(delimiter) + " when searching " + (isTrain ? "trains" : "buses");

        // if there are more than 3 slots, gotta replace that last comma with "and"
        if (invalidSlots.length >= 3) {
            errorResponse = errorResponse.replace(/,([^,]*)$/, ", and$1");
        }
    }
        
    return errorResponse;
};