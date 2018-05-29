/**
 * Returns a parameter object with the needed properties to get a device's location
 * @param {event.context.System} systemObject
 */
exports.getLocationParameters = (systemObject) => {
    return {
        apiEndpoint: systemObject.apiEndpoint,
        token: systemObject.apiAccessToken,
        deviceID: systemObject.device.deviceId
    };
};